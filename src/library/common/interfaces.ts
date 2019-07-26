export type QcAction = {
  type: string;
  [s : string] : any;
};

export type QcState = {
  [s : string] : any;
};

export interface QcStore<StateType> {
  dispatch(action : QcAction) : any;
  getState() : StateType;
}

export type QcActionCreator = (...args : any) => QcAction;

export type RunnerType = string;
