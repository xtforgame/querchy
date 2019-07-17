import { Action, State, ActionsObservable, StateObservable } from 'pure-epic';
import { Observable } from 'rxjs';

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

export type QcDependencies = any;

// ============

export interface Canceler {
  (message?: string): void;
}

export interface CancelTokenSource {
  token: any;
  cancel: Canceler;
}

// ====================

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
  handle: RunnerRun<Input, Output, StateType, Dependencies>,
};
