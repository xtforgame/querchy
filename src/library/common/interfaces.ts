import { Epic, createEpicMiddleware, combineEpics } from 'pure-epic';
import {
  ArgumentTypes,
  ReturnType,
} from '../utils/helper-functions';

export type QcTimestamp = number;

export type QcAction = {
  type: string;
  [s : string] : any;
};

export type QcState = {
  [s : string] : any;
};

export type QcEpic = Epic<
  QcAction,
  QcAction,
  QcState,
  any
>;

export interface QcStore<StateType> {
  dispatch(action : QcAction) : any;
  getState() : StateType;
}

export type QcActionCreator = (...args : any) => QcAction;

export type QcActionCreatorWithProps = QcActionCreator & {
  actionType: string;
};

export type QueryId = string | void;

export interface ResourceMetadata {
  lastRequest?: {
    queryId?: QueryId;
    requestTimestamp: QcTimestamp;

    lastResponse?: any;
    responseTimestamp?: QcTimestamp;

    lastError?: any;
    errorTimestamp?: QcTimestamp;

    lastCancelReason?: any;
    cancelTimestamp?: QcTimestamp;
  };
  lastUpdate?: {
    queryId?: QueryId;
    updateData : any;
    updateType : string;
    updateTimestamp : QcTimestamp;
  };
  [s : string] : any;
}

export interface CacheValueState {
  metadata: ResourceMetadata;
  value: any;
}

// change

export type CacheStateChange = {
  update?: { [s : string] : CacheValueState },
  delete?: string[],
};

export type FullChange = [CacheStateChange, CacheStateChange];

export type CacheChange = CacheStateChange | FullChange;

// ==================

export interface ResourceStateResourceMap {
  [s : string] : CacheValueState;
}

export interface ResourceStateQueryMap {
  [s : string] : CacheValueState;
}

export interface ResourceState {
  resourceMap : ResourceStateResourceMap;
  queryMap : ResourceStateQueryMap;
}

export type ModelRootState<QcRootState> = {
  [P in keyof QcRootState] : ResourceState;
} & {
  extra: ResourceState;
} & {
  [s : string] : ResourceState;
};

export type BaseSelector<QcRootState> = (state : any) => ModelRootState<QcRootState>;

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

export type BasicGlobalMerger<ModelMapType = any> = GlobalMerger<ModelMapType, QcAction>;

export type GlobalReducer<ModelMapType = any> = BasicGlobalMerger<ModelMapType>;

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
