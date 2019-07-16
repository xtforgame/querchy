import { ActionsObservable, Action } from 'pure-epic';
import { Observable, ObservableInput } from 'rxjs';
import axios from 'axios';
import { mergeMap, filter } from 'rxjs/operators';

import AxiosObservable from './utils/AxiosObservable';

export default function echo(data : any, err : any) {
  return new Promise((resolve, reject) => {
    if (err) {
      return reject(err);
    }
    const axiosObservable = AxiosObservable(axios, Observable);

    const output = [];
    const action$ = ActionsObservable.of<Action>({ type: 'FIRST' }, { type: 'SECOND' });
    action$.ofType('FIRST', 'SECOND')
    .pipe(
      mergeMap<Action, ObservableInput<Action>>((x) => {
        const source = axios.CancelToken.source();

        return axiosObservable({
          method: 'post',
          url: 'https://httpbin.org/post',
          headers: {},
          data: {
            dataKey1: 1,
          },
          params: {
            queryKey1: 1,
          },
        }, {
          // success: respondCreator(actions, action, getId),
          // error: respondErrorCreator(actions, action),
          // cancel: actions.clearError,
        }, {
          axiosCancelTokenSource: source,
          cancelStream$: action$.pipe(
            filter((cancelAction) => {
              if (cancelAction.type !== 'SECOND') {
                return false;
              }
              return true;
            }),
          ),
        });
      }),
    )
    .subscribe(x => {
      console.log('x :', x);
      output.push(x);
      // if (output.length > 1) {
      //   resolve(data);
      // }
    });
  });
}
