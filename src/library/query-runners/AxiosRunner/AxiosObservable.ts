import { AxiosStatic, AxiosResponse, AxiosError, AxiosRequestConfig, CancelTokenSource } from 'axios';
import { from, of, race, Observable } from 'rxjs';
import {
  map, take, catchError,
} from 'rxjs/operators';

import {
  QcAction,
} from '../../common/interfaces';

import {
  QcRequestActionCreators,
} from '../../core/interfaces';

import {
  toNull,
} from '../../utils/helper-functions';

export interface AxiosObservableOptions {
  cancelStream$?: Observable<any>;
  axiosCancelTokenSource?: CancelTokenSource;
}

export default <
  Config extends AxiosRequestConfig = AxiosRequestConfig,
>(axios : AxiosStatic) => (
  axiosRequestConfig : Config,
  {
    success: successAction = toNull,
    error: errorAction = toNull,
    cancel: cancelAction = toNull,
  } : Partial<QcRequestActionCreators> = {},
  options : AxiosObservableOptions = {},
) => {
  const {
    cancelStream$,
    axiosCancelTokenSource = axios.CancelToken.source(),
  } = options;
  const observable = from(
    axios.request({
      ...axiosRequestConfig,
      cancelToken: axiosCancelTokenSource.token,
    }),
  )
  .pipe(
    map<AxiosResponse<any>, any>((response) => {
      return successAction(response, 'from-request');
    }),
    catchError<AxiosError, any>(error => of(errorAction(error))),
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
