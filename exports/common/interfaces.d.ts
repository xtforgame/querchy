import { Epic } from 'pure-epic';
import { ArgumentTypes, ReturnType } from '../utils/helper-functions';
export declare type QcTimestamp = number;
export declare type QcAction = {
    type: string;
    [s: string]: any;
};
export declare type QcState = {
    [s: string]: any;
};
export declare type QcEpic = Epic<QcAction, QcAction, QcState, any>;
export interface QcStore<StateType> {
    dispatch(action: QcAction): any;
    getState(): StateType;
}
export declare type QcActionCreator = (...args: any) => QcAction;
export declare type QcActionCreatorWithProps = QcActionCreator & {
    actionType: string;
};
export declare type QueryId = string | void;
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
        updateData: any;
        updateType: string;
        updateTimestamp: QcTimestamp;
    };
    [s: string]: any;
}
export interface ResourceStateMetadataMap {
    [s: string]: ResourceMetadata;
}
export interface ResourceStateValueMap {
    [s: string]: any;
}
export interface ResourceStateResourceMap {
    metadata: ResourceStateMetadataMap;
    values: ResourceStateValueMap;
}
export interface ResourceStateQueryMap {
    metadata: {
        [s: string]: ResourceMetadata;
    };
    values: {
        [s: string]: any;
    };
}
export interface ResourceState {
    resourceMap: ResourceStateResourceMap;
    queryMap: ResourceStateQueryMap;
}
export declare type ModelRootState<QcRootState> = {
    [P in keyof QcRootState]: ResourceState;
} & {
    extra: ResourceState;
} & {
    [s: string]: ResourceState;
};
export declare type BaseSelector<QcRootState> = (state: any) => ModelRootState<QcRootState>;
export declare type RunnerType = string;
export declare type ResourceMerger<ActionType extends QcAction> = (state: ResourceState, action: ActionType) => ResourceState;
export declare type BasicResourceMerger = ResourceMerger<QcAction>;
export declare type SliceReducer = BasicResourceMerger;
export declare type GlobalMerger<QcRootState, ActionType extends QcAction> = (state: ModelRootState<QcRootState>, action: ActionType) => ModelRootState<QcRootState>;
export declare type BasicGlobalMerger<ModelMapType = any> = GlobalMerger<ModelMapType, QcAction>;
export declare type GlobalReducer<ModelMapType = any> = BasicGlobalMerger<ModelMapType>;
export declare type RootReducer = (state: any, action: QcAction) => any;
export declare type ModelActionCreator<RawActionCreator extends Function> = ((...args: ArgumentTypes<RawActionCreator>) => ReturnType<RawActionCreator> & {
    actionCreator: ModelActionCreator<RawActionCreator>;
} & {
    actionType: string;
}) & {
    actionType: string;
};
export declare type ResourceModelActions<ActionInfosLike extends {
    [s: string]: {
        actionCreator: Function;
    };
}> = {
    [P in keyof ActionInfosLike]: ModelActionCreator<ActionInfosLike[P]['actionCreator']>;
};
