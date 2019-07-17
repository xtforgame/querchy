import { Action, State, ActionsObservable, StateObservable } from 'pure-epic';
import { Observable } from 'rxjs';

import {
  QcAction,
  QcState,
  QcDependencies,
  RunnerType,
} from '~/common/interfaces';

export interface Canceler {
  (message?: string): void;
}

export interface CancelTokenSource {
  token: any;
  cancel: Canceler;
}

export type RunnerRunOption<
  Input extends Action = QcAction,
  StateType extends State = QcState,
  Dependencies = QcDependencies,
> = {
  action$: ActionsObservable<Input>;
  store$: StateObservable<StateType>;
  dependencies?: Dependencies;
  args: any[];
};

export type RunnerRun<
  Input extends Action = QcAction,
  Output extends Input = Input,
  StateType extends State = QcState,
  Dependencies = QcDependencies,
> = (
  action: Input,
  options: RunnerRunOption<Input, StateType, Dependencies>,
) => Observable<Output>;

export type QueryRunner<
  Input extends Action = QcAction,
  Output extends Input = Input,
  StateType extends State = QcState,
  Dependencies = QcDependencies,
> = {
  type: RunnerType;
  handle: RunnerRun<Input, Output, StateType, Dependencies>,
};
