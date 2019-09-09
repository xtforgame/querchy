import { from, of, race, Observable } from 'rxjs';
import {
  map, take, catchError,
} from 'rxjs/operators';

import {
  QcAction,
} from '../common/interfaces';

import {
  QcRequestActionCreators,
  QcRequestConfigNormal,
  QcResponse,
  QcRespondError,
} from '../core/interfaces';

import {
  RequestObservableOptions,
  SendRequestFunction,
} from './interfaces';

import {
  toNull,
} from '../utils/helper-functions';

export default (
  sendRequest : SendRequestFunction,
  requestConfig : QcRequestConfigNormal,
  {
    success: successAction = toNull,
    error: errorAction = toNull,
    cancel: cancelAction = toNull,
  } : Partial<QcRequestActionCreators>,
  options : RequestObservableOptions,
) : any => {
  const {
    cancelStream$,
    cancelTokenSource,
  } = options;
  const observable = from(
    sendRequest(requestConfig, cancelTokenSource),
  )
  .pipe(
    map<QcResponse, any>((response) => {
      return successAction(response, 'normal');
    }),
    catchError<QcRespondError, any>(error => of(errorAction(error))),
  );

  if (cancelStream$) {
    return race(
      observable,
      cancelStream$
        .pipe(
          map((value) => {
            cancelTokenSource.cancel('Operation canceled by the user.');
            return cancelAction(value);
          }),
          take(1),
        ),
    );
  }
  return observable;
};
