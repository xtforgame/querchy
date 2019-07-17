import { Epic, createEpicMiddleware } from 'pure-epic';
import { ObservableInput } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import AxiosRunner from './query-runners/AxiosRunner';

import {
  QcAction,
  QcState,
  QcStore,
} from '~/common/interfaces';

import {
  ModelMap,
  QueryCreatorMap,
  QuerchyDefinition,
  QcDependencies,
} from '~/core/interfaces';

const run = <
  ModelMapType extends ModelMap = ModelMap,
  QueryCreatorMapType extends QueryCreatorMap<ModelMap> = QueryCreatorMap<ModelMap>,
  QuerchyDefinitionType extends QuerchyDefinition<ModelMapType, QueryCreatorMapType> = QuerchyDefinition<ModelMapType, QueryCreatorMapType>,

  Dependencies extends QcDependencies<ModelMapType, QueryCreatorMapType, QuerchyDefinitionType> = QcDependencies<ModelMapType, QueryCreatorMapType, QuerchyDefinitionType>,
>(resolve: Function, data : any, deps : Dependencies) => {
  const runner = new AxiosRunner<QcAction, QcAction, QcState, ModelMapType, QueryCreatorMapType, QuerchyDefinitionType, Dependencies>();

  const rootEpic : Epic<QcAction, QcAction, QcState, Dependencies> = (
    action$, store$, dependencies, ...args
  ) => action$.ofType('FIRST')
  .pipe(
    mergeMap<QcAction, ObservableInput<QcAction>>((action) => {
      return runner.handle(action, {
        action$, store$, dependencies, args,
      });
    }),
  );

  const epicMiddleware =
    createEpicMiddleware<QcAction, QcState, QcStore<QcAction, QcState>, Dependencies>({
      dependencies: deps,
    });
  const epicMiddlewareCb = epicMiddleware({
    dispatch: (action) => {
      // console.log('action :', action);
      epicMiddlewareCb(() => {})(action);
      if (action.type === 'FIRST_CANCEL' || action.type === 'FIRST_SUCCESS') {
        resolve(data);
      }
    },
    getState: () => ({ xxx: 1 }),
  });
  epicMiddleware.run(rootEpic);
  epicMiddlewareCb(() => {})({ type: 'FIRST' });
  // epicMiddlewareCb(() => {})({ type: 'CANCEL' });
};

export default (data : any, err : any) => {
  return new Promise((resolve, reject) => {
    if (err) {
      return reject(err);
    }
    run(resolve, data, {
      querchyDef: {
        models: {},
        queryCreators: {
          FIRST: {
            buildRequestConfig: (runnerType: string) => ({
              method: 'post',
              url: 'https://httpbin.org/post',
              query: {
                queryKey1: 1,
              },
              body: {
                dataKey1: 1,
              },
            }),
          },
        },
      },
    });
  });
};
