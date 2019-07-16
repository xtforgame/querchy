import { Epic, ActionsObservable, Action, createEpicMiddleware } from 'pure-epic';
import { Observable, ObservableInput } from 'rxjs';
import axios from 'axios';
import { mergeMap, filter } from 'rxjs/operators';

import AxiosObservable from './utils/AxiosObservable';

export type QcAction = {
  type: string;
  [s : string] : any;
};

export type QcState = {
  xxx: number;
};

export interface QcStore<ActionType extends Action, StateType> {
  dispatch(action : ActionType) : any;
  getState() : StateType;
}

export default function echo(data : any, err : any) {
  return new Promise((resolve, reject) => {
    if (err) {
      return reject(err);
    }

    const axiosObservable = AxiosObservable(axios, Observable);

    const rootEpic : Epic<QcAction, QcAction, QcState> = (
      action$, store$,
    ) => action$.ofType('FIRST')
    .pipe(
      mergeMap<QcAction, ObservableInput<QcAction>>((action) => {
        console.log('store :', store$.value);
        const source = axios.CancelToken.source();
        return axiosObservable(
          {
            method: 'post',
            url: 'https://httpbin.org/post',
            headers: {},
            data: {
              dataKey1: 1,
            },
            params: {
              queryKey1: 1,
            },
          },
          {
            success: () => ({ type: 'SUCCESS' }),
            error: () => ({ type: 'ERROR' }),
            cancel: () => ({ type: 'CANCEL' }),
          },
          {
            axiosCancelTokenSource: source,
            cancelStream$: action$.pipe(
              filter<QcAction>((cancelAction) => {
                if (cancelAction.type !== 'CANCEL') {
                  return false;
                }
                return true;
              }),
            ),
          },
        );
      }),
    );

    const epicMiddleware = createEpicMiddleware<QcAction, QcState, QcStore<QcAction, QcState>>();
    const epicMiddlewareCb = epicMiddleware({
      dispatch: (action) => {
        // console.log('action :', action);
        epicMiddlewareCb(() => {})(action);
        if (action.type === 'CANCEL') {
          resolve(data);
        }
      },
      getState: () => ({ xxx: 1 }),
    });
    epicMiddleware.run(rootEpic);
    epicMiddlewareCb(() => {})({ type: 'FIRST' });
    epicMiddlewareCb(() => {})({ type: 'CANCEL' });
  });
}
