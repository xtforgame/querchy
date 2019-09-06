import { Subject, Observable, ObservableInput, from, queueScheduler } from 'rxjs';
import {
  map,
  mergeMap,
  observeOn,
  subscribeOn,
} from 'rxjs/operators';
import {
  ActionsObservable,
  StateObservable,
  Action,
  Epic,
  State,
  Store,
  Dependencies,
} from 'pure-epic';
import namespaces, {
  defaultNamespaceName,
} from './namespaces';
import createWatcherMiddleware from '../utils/createWatcherMiddleware';

interface Options<DependenciesType = Dependencies> {
  dependencies?: DependenciesType;
}

export default <
  ActionType extends Action = Action,
  StateType extends State = State,
  StoreType extends Store<ActionType, StateType> = Store<ActionType, StateType>,
>(namespace : string = defaultNamespaceName) => {
  let store : StoreType;

  const epicMiddleware = (s : StoreType) => {
    store = s;
    namespaces[namespace] = { store, name: namespace };
    const watcherMiddleware = createWatcherMiddleware();
    const watcherMiddlewareCb = watcherMiddleware(store);

    return (next : Function) => (action : ActionType) => {
      const result = next(action);
      return watcherMiddlewareCb(() => result)(action);
    };
  };

  return epicMiddleware;
};
