import {
  ArgumentTypes,
  ReturnType,
} from '~/utils/helper-functions';

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

// ==========

// for cacher

export type Merger<
  ActionType extends QcAction
> = (state: ResourceState, action: ActionType) => ResourceState;

export type BasicMerger = Merger<QcAction>;

export type RootReducer = (state: any, action: QcAction) => any;

export type SliceReducer = BasicMerger;

// ========================================

export type ModelActionCreator<
  RawActionCreator extends Function
> = ((
  ...args: ArgumentTypes<RawActionCreator>
) => ReturnType<RawActionCreator> & {
  actionCreator: ModelActionCreator<RawActionCreator>;
} & {
  actionType: string;
}) & {
  actionType: string;
};

export type ResourceModelActions<
  ActionInfosLike extends { [ s : string] : { actionCreator: Function; } }
> = {
  [P in keyof ActionInfosLike] : ModelActionCreator<ActionInfosLike[P]['actionCreator']>;
  // [s: string]: StartQueryActionCreatorWithProps<{}>;
};
