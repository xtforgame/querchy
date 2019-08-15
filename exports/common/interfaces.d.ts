import { ArgumentTypes, ReturnType } from '~/utils/helper-functions';
export declare type QcTimestamp = number;
export declare type QcAction = {
    type: string;
    [s: string]: any;
};
export declare type QcState = {
    [s: string]: any;
};
export interface QcStore<StateType> {
    dispatch(action: QcAction): any;
    getState(): StateType;
}
export declare type QcActionCreator = (...args: any) => QcAction;
export declare type QcActionCreatorWithProps = QcActionCreator & {
    actionType: string;
};
export interface ResourceMetadata {
    lastRequest?: {
        queryId?: string;
        requestTimestamp: QcTimestamp;
        responseTimestamp?: QcTimestamp;
        lastError?: any;
        errorTimestamp?: QcTimestamp;
        lastCancelReason?: any;
        cancelTimestamp?: QcTimestamp;
    };
    [s: string]: any;
}
export interface ResourceState {
    resourceMap: {
        [s: string]: {
            metadata: ResourceMetadata;
            value: any;
        };
    };
    queryMap: {
        [s: string]: any;
    };
}
export declare type ModelRootState<QcRootState> = {
    [P in keyof QcRootState]: ResourceState;
} & {
    [s: string]: ResourceState;
};
export declare type RunnerType = string;
export declare type ResourceMerger<ActionType extends QcAction> = (state: ResourceState, action: ActionType) => ResourceState;
export declare type BasicResourceMerger = ResourceMerger<QcAction>;
export declare type SliceReducer = BasicResourceMerger;
export declare type GlobalMerger<QcRootState, ActionType extends QcAction> = (state: ModelRootState<QcRootState>, action: ActionType) => ModelRootState<QcRootState>;
export declare type BasicGlobalMerger = GlobalMerger<any, QcAction>;
export declare type GlobalReducer = BasicGlobalMerger;
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
