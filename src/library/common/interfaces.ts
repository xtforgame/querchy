import { Action, State, ActionsObservable, StateObservable } from 'pure-epic';
import { Observable } from 'rxjs';

export type QcAction = {
  type: string;
  [s : string] : any;
};

export type QcState = {
  [s : string] : any;
};

export interface QcStore<ActionType extends Action, StateType> {
  dispatch(action : ActionType) : any;
  getState() : StateType;
}

export type QcActionCreator<ActionType extends Action> = (...args : any) => ActionType;

export type RunnerType = string;
