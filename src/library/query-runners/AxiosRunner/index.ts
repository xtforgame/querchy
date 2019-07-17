import { Epic, Action, State, ActionsObservable, StateObservable } from 'pure-epic';
import { Observable, ObservableInput } from 'rxjs';
import axios from 'axios';
import { mergeMap, filter } from 'rxjs/operators';

import {
  QcAction,
  QcState,
  QcStore,
  QcDependencies,
  RunnerRun,
  RunnerRunOption,
  QueryRunner,
  Canceler,
  CancelTokenSource,
} from '../../interfaces';

import AxiosObservable from '../../utils/AxiosObservable';

export default class AxiosRunner<
  Input extends Action = QcAction,
  Output extends Input = Input,
  StateType extends State = QcState,
  Dependencies = QcDependencies,
> implements QueryRunner<Input, Output, StateType, Dependencies> {
  axiosObservable : any;

  constructor() {
    this.axiosObservable = AxiosObservable();
  }

  handle : RunnerRun<Input, Output, StateType, Dependencies> = (
    action, { store$, action$ },
  ) => {
    console.log('store :', store$.value);
    const source = axios.CancelToken.source();
    return this.axiosObservable(
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
          filter<Input>((cancelAction) => {
            if (cancelAction.type !== 'CANCEL') {
              return false;
            }
            return true;
          }),
        ),
      },
    );
  }
}
