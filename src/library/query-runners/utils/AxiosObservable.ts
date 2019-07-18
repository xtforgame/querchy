import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
import { from, of, race, Observable } from 'rxjs';
import {
  map, take, catchError,
} from 'rxjs/operators';

import axiosPromise from './axiosPromise';
import {
  toNull,
} from './helper-functions';

export interface Options {
  cancelStream$?: Observable<any>;
  axiosCancelTokenSource?: CancelTokenSource;
}

export default <Config extends AxiosRequestConfig>() => (
  axiosRequestConfig : Config,
  {
    success: successAction = toNull,
    error: errorAction = toNull,
    cancel: cancelAction = toNull,
  } = {},
  options : Options = {},
) => {
  const {
    cancelStream$,
    axiosCancelTokenSource = axios.CancelToken.source(),
  } = options;
  const observable = from(axiosPromise(axiosRequestConfig, options))
  .pipe(
    map(successAction),
    catchError(error => of(errorAction(error))),
  );

  if (cancelStream$) {
    return race(
      observable,
      cancelStream$
        .pipe(
          map((value) => {
            axiosCancelTokenSource.cancel('Operation canceled by the user.');
            return cancelAction(value);
          }),
          take(1),
        ),
    );
  }
  return observable;
};
