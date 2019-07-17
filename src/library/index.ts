import { Epic, createEpicMiddleware } from 'pure-epic';
import { ObservableInput } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import AxiosRunner from './query-runners/AxiosRunner';

import {
  QcAction,
  QcState,
  QcStore,
  QcDependencies,
} from './interfaces';

export default function echo(data : any, err : any) {
  return new Promise((resolve, reject) => {
    if (err) {
      return reject(err);
    }

    const runner = new AxiosRunner<QcAction, QcAction, QcState, QcDependencies>();

    const rootEpic : Epic<QcAction, QcAction, QcState, QcDependencies> = (
      action$, store$, dependencies, ...args
    ) => action$.ofType('FIRST')
    .pipe(
      mergeMap<QcAction, ObservableInput<QcAction>>((action) => {
        return runner.handle(action, {
          action$, store$, dependencies, args,
        });
      }),
    );

    const epicMiddleware = createEpicMiddleware<QcAction, QcState, QcStore<QcAction, QcState>>();
    const epicMiddlewareCb = epicMiddleware({
      dispatch: (action) => {
        // console.log('action :', action);
        epicMiddlewareCb(() => {})(action);
        if (action.type === 'CANCEL' || action.type === 'SUCCESS') {
          resolve(data);
        }
      },
      getState: () => ({ xxx: 1 }),
    });
    epicMiddleware.run(rootEpic);
    epicMiddlewareCb(() => {})({ type: 'FIRST' });
    // epicMiddlewareCb(() => {})({ type: 'CANCEL' });
  });
}
