import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
import { promiseWait } from './common-functions';
import getMiddlewaresHandler from './getMiddlewaresHandler';

class ErrorFromMiddleware {
  error : any;
  constructor(error : any) {
    this.error = error;
  }
}

export interface Options {
  middlewares?: {
    request?: any[];
    response?: any[];
    error?: any[];
  };
  debugDelay?: number;
  axiosCancelTokenSource?: CancelTokenSource;
}

export default <Config extends AxiosRequestConfig>(request : Config, op : Options = {}) => {
  const {
    middlewares: {
      request: requestMiddlewares = [],
      response: responseMiddlewares = [],
      error: errorMiddlewares = [],
    } = {},
    debugDelay = 0,
    axiosCancelTokenSource = axios.CancelToken.source(),
  } = op;

  return promiseWait(debugDelay)
  .then(() => {
    const next = getMiddlewaresHandler(
      [
        ...requestMiddlewares,
        (req, { options }) => axios.request({
          ...req,
          cancelToken: axiosCancelTokenSource.token,
        }),
      ],
      [request, { options: op }],
    );
    return next();
  })
  .then((response) => {
    const next = getMiddlewaresHandler(
      [
        ...responseMiddlewares,
        res => Promise.resolve(res),
      ],
      [response, { request, options: op }],
    );
    return Promise.resolve()
    .then<any>(next)
    .then(
      res => res || Promise.reject(new ErrorFromMiddleware(
        `Malformed Response: ${res}, please check you response middlewares`
      )),
    )
    .catch(error => Promise.reject(new ErrorFromMiddleware(error)));
  })
  .catch((error) => {
    if (error instanceof ErrorFromMiddleware) {
      return Promise.reject(error.error);
    }
    const next = getMiddlewaresHandler(
      [
        ...errorMiddlewares,
        err => Promise.reject(err),
      ],
      [error, { request, options: op }],
    );
    return Promise.resolve()
    .then(next);
  });
};
