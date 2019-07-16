import { from, of, race } from 'rxjs';
import {
  map, take, catchError,
} from 'rxjs/operators';

import axiosPromise from './axiosPromise';
import {
  toNull,
  toNull2,
  toNull3,
} from './helper-functions';

export default (axios, Observable) => (axiosOptions, {
  success: successAction = toNull,
  error: errorAction = toNull2,
  cancel: cancelAction = toNull3,
} = {}, options = {}) => {
  const {
    cancelStream$,
    axiosCancelTokenSource = axios.CancelToken.source(),
  } = options;
  const observable = from(axiosPromise(axios, axiosOptions, options))
  .pipe(
    map(successAction),
    catchError(error => of(errorAction(error)))
  );

  if (cancelStream$) {
    return race(
      observable,
      cancelStream$
        .pipe(
          map(() => {
            axiosCancelTokenSource.cancel('Operation canceled by the user.');
            return cancelAction();
          }),
          take(1),
        )
    );
  }
  return observable;
};
