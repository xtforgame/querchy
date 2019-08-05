export type QcTimestamp = number;

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

export interface ResourceMetadata {
  lastRequest?: {
    queryId?: string;
    requestTimestamp: QcTimestamp;
    responseTimestamp?: QcTimestamp;
    lastError?: any
    errorTimestamp?: QcTimestamp;
    lastCancelReason?: any
    cancelTimestamp?: QcTimestamp;
  };
  [s : string] : any;
}

export interface ResourceMetadataMap {
  [s : string] : ResourceMetadata;
}

export interface ResourceState {
  metadataMap: ResourceMetadataMap;
  resourceMap: { [s : string] : any };
  [s : string] : any;
}

export type RunnerType = string;
