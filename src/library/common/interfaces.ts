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

export type QcActionCreatorWithProps = QcActionCreator & {
  actionType: string;
};

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

export interface ResourceState {
  resourceMap : {
    [s : string] : {
      metadata: ResourceMetadata;
      value: any;
    };
  };
  queryMap : {
    [s : string] : any;
  };
}

export type ModelRootState<QcRootState> = {
  [P in keyof QcRootState] : ResourceState;
} & {
  [s : string] : ResourceState;
};

export type RunnerType = string;

// ==========

// for cacher

export type ResourceMerger<
  ActionType extends QcAction
> = (state: ResourceState, action: ActionType) => ResourceState;

export type BasicResourceMerger = ResourceMerger<QcAction>;

export type SliceReducer = BasicResourceMerger;

  // ==========================

export type GlobalMerger<
  QcRootState,
  ActionType extends QcAction
> = (state: ModelRootState<QcRootState>, action: ActionType) => ModelRootState<QcRootState>;

export type BasicGlobalMerger = GlobalMerger<{}, QcAction>;

export type GlobalReducer = BasicGlobalMerger;

  // ==========================

export type RootReducer = (state: any, action: QcAction) => any;

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
