import { ArgumentTypes, ReturnType } from '../utils/helper-functions';
import { QcTimestamp, QcAction, QueryId } from '../common/interfaces';
import { SUCCESS_ACTION, ERROR_ACTION, SUCCESS_CALLBACK, ERROR_CALLBACK, Tester, CallbackFunction } from '../utils/createWatcherMiddleware/index';
export declare type QcTransferables = {
    queryId?: QueryId;
    requestTimestamp: QcTimestamp;
    requestAction?: QcRequestAction;
    [s: string]: any;
};
export declare type ResourceModelQueryActionOptions = {
    queryId?: QueryId;
    queryPart?: any;
    headers?: {
        [s: string]: string;
    };
    transferables?: QcTransferables;
    actionProps?: {
        [s: string]: any;
    };
    [SUCCESS_ACTION]?: Tester<QcAction>;
    [ERROR_ACTION]?: Tester<QcAction>;
    [SUCCESS_CALLBACK]?: CallbackFunction<QcAction>;
    [ERROR_CALLBACK]?: CallbackFunction<QcAction>;
};
export declare type CrudType = string;
export declare type CrudSubType = 'start' | 'respond' | 'respondError' | 'cancel';
export interface QcBasicAction extends QcAction {
    queryId?: QueryId;
    modelName: string;
    crudType: CrudType;
    crudSubType: CrudSubType;
    options?: any;
    [SUCCESS_ACTION]?: Tester<QcAction>;
    [ERROR_ACTION]?: Tester<QcAction>;
    [SUCCESS_CALLBACK]?: CallbackFunction<QcAction>;
    [ERROR_CALLBACK]?: CallbackFunction<QcAction>;
    [s: string]: any;
}
export interface QcRequestAction extends QcBasicAction {
    requestTimestamp: QcTimestamp;
    transferables: QcTransferables;
    [s: string]: any;
}
export declare type QcRequestConfigNormal = {
    method: string;
    url: string;
    overwriteQueryId?: QueryId;
    rawConfigs?: any;
    overwriteConfigs?: any;
    headers?: {
        [s: string]: string;
    };
    query?: {
        [s: string]: any;
    };
    body?: any;
};
export declare type QcRequestConfigFromCache = {
    fromCache: boolean;
    responseFromCache: any;
    overwriteQueryId?: QueryId;
};
export declare type QcRequestConfig = QcRequestConfigNormal | QcRequestConfigFromCache | null;
export interface QcResponse {
    rawResponse: any;
    data: any;
    status: number;
    statusText: string;
    headers: any;
    config: QcRequestConfig;
}
export interface QcRespondError extends Error {
    config: QcRequestConfig;
    response?: QcResponse;
}
export declare type QcCancelReason = any;
export declare type SuccessActionCreator = (response: any, responseType: string) => QcResponseAction;
export declare type ErrorActionCreator = (error: any) => QcRespondErrorAction;
export declare type CancelActionCreator = (reason: any) => QcCancelRequestAction;
export interface QcRequestActionCreators {
    success: SuccessActionCreator;
    error: ErrorActionCreator;
    cancel: CancelActionCreator;
}
export interface QcResponseAction extends QcRequestAction {
    response: QcResponse;
    responseType: string;
    responseTimestamp: QcTimestamp;
    actionCreator: QueryActionCreatorWithProps<{}, ModelSubActionCreatorRespond>;
    [s: string]: any;
}
export interface QcRespondErrorAction extends QcRequestAction {
    error: QcRespondError;
    errorTimestamp: QcTimestamp;
    actionCreator: QueryActionCreatorWithProps<{}, ModelSubActionCreatorRespondError>;
    [s: string]: any;
}
export interface QcCancelRequestAction extends QcRequestAction {
    reason: QcCancelReason;
    cancelTimestamp: QcTimestamp;
    actionCreator: QueryActionCreatorWithProps<{}, ModelSubActionCreatorCancel>;
    [s: string]: any;
}
export declare type ModelSubActionCreatorRespond = (response: any, responseType: string, options?: ResourceModelQueryActionOptions) => QcResponseAction;
export declare type ModelSubActionCreatorRespondError = (error: any, options?: ResourceModelQueryActionOptions) => QcRespondErrorAction;
export declare type ModelSubActionCreatorCancel = (reason: any, options?: ResourceModelQueryActionOptions) => QcCancelRequestAction;
export declare type ActionCreatorRefs<StartActionCreatorType> = {
    start: QueryActionCreatorWithProps<StartActionCreatorType, StartActionCreatorType>;
    respond: QueryActionCreatorWithProps<StartActionCreatorType, ModelSubActionCreatorRespond>;
    respondError: QueryActionCreatorWithProps<StartActionCreatorType, ModelSubActionCreatorRespondError>;
    cancel: QueryActionCreatorWithProps<StartActionCreatorType, ModelSubActionCreatorCancel>;
};
export declare type QueryActionCreatorProps<StartActionCreatorType> = {
    actionType: string;
    creatorRefs: ActionCreatorRefs<StartActionCreatorType>;
};
export declare type QueryActionCreatorWithProps<StartActionCreatorType, ActionCreatorType> = ActionCreatorType & QueryActionCreatorProps<StartActionCreatorType>;
export declare type StartQueryActionCreatorWithProps<ActionCreatorType> = QueryActionCreatorWithProps<ActionCreatorType, ActionCreatorType>;
export declare type AnyQueryActionCreatorWithProps = StartQueryActionCreatorWithProps<{}>;
export declare type ModelQueryActionCreator<RawActionCreator extends Function> = (...args: ArgumentTypes<RawActionCreator>) => ReturnType<RawActionCreator> & {
    actionCreator: StartQueryActionCreatorWithProps<ModelQueryActionCreator<RawActionCreator>>;
} & QcRequestAction;
export declare type ResourceModelQueryActions<QueryInfosLike extends {
    [s: string]: {
        actionCreator: Function;
    };
}> = {
    [P in keyof QueryInfosLike]: StartQueryActionCreatorWithProps<ModelQueryActionCreator<QueryInfosLike[P]['actionCreator']>>;
};
