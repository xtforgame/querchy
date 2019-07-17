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

export type RunnerType = string;
