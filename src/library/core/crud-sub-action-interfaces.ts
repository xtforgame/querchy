import {
  ArgumentTypes,
  ReturnType,
} from '~/utils/helper-functions';

import {
  RunnerType,
  QcTimestamp,
  QcAction,
  QcActionCreator,
} from '~/common/interfaces';

export type QcTransferables = {
  requestTimestamp: QcTimestamp;
  requestAction?: QcRequestAction;
  [s : string] : any;
};

export type ResourceModelActionsOptions = {
  query?: any;
  headers?: { [s : string] : string };
  transferables?: QcTransferables;
};

export type CrudType = string;
export type CrudSubType = 'start' | 'respond' | 'respondError' | 'cancel';

// =================

export interface QcBasicAction extends QcAction {
  modelName: string;
  crudType: CrudType;
  crudSubType: CrudSubType;
  // actionTypes,

  options: any;
  [s : string] : any;
}

// ==================

export interface QcRequestAction extends QcBasicAction {
  requestTimestamp: QcTimestamp;
  transferables: QcTransferables;
  [s : string] : any;
}

export type QcRequestConfig = {
  rawConfigs?: any;
  overwriteConfigs?: any;
  method : string;
  url : string;
  headers?: { [s : string] : string };
  query?: { [s : string] : any };
  body?: any;
} | null;

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

export type QcCancelReason = any;

export type SuccessActionCreator = (
  response : any,
  responseType : string,
) => QcResponseAction;

export type ErrorActionCreator = (
  error : any,
) => QcRespondErrorAction;

export type CancelActionCreator = (
  reason : any,
) => QcCancelRequestAction;

export interface QcRequestActionCreators {
  success: SuccessActionCreator;
  error: ErrorActionCreator;
  cancel: CancelActionCreator;
}

// ================

export interface QcResponseAction extends QcRequestAction {
  response: QcResponse;
  responseType : string;
  responseTimestamp: QcTimestamp;

  actionCreator: ActionCreatorWithProps<{}, ModelSubActionCreatorRespond>;
  [s : string] : any;
}

export interface QcRespondErrorAction extends QcRequestAction {
  error: QcRespondError;
  errorTimestamp: QcTimestamp;

  actionCreator: ActionCreatorWithProps<{}, ModelSubActionCreatorRespondError>;
  [s : string] : any;
}

export interface QcCancelRequestAction extends QcRequestAction {
  reason: QcCancelReason;
  cancelTimestamp: QcTimestamp;

  actionCreator: ActionCreatorWithProps<{}, ModelSubActionCreatorCancel>;
  [s : string] : any;
}

// ====================

export type ModelSubActionCreatorRespond = (
  response: any, responseType: string, options?: ResourceModelActionsOptions,
) => QcResponseAction;

export type ModelSubActionCreatorRespondError = (
  error: any, options?: ResourceModelActionsOptions,
) => QcRespondErrorAction;

export type ModelSubActionCreatorCancel = (
  reason: any, options?: ResourceModelActionsOptions,
) => QcCancelRequestAction;

export type ActionCreatorRefs<
  StartActionCreatorType,
> = {
  start: ActionCreatorWithProps<StartActionCreatorType, StartActionCreatorType>,
  respond: ActionCreatorWithProps<StartActionCreatorType, ModelSubActionCreatorRespond>,
  respondError: ActionCreatorWithProps<StartActionCreatorType, ModelSubActionCreatorRespondError>,
  cancel: ActionCreatorWithProps<StartActionCreatorType, ModelSubActionCreatorCancel>,
};

export type ActionCreatorProps<
  StartActionCreatorType,
> = {
  actionType: string,
  creatorRefs: ActionCreatorRefs<
    StartActionCreatorType
  >,
};

export type ActionCreatorWithProps<
  StartActionCreatorType,
  ActionCreatorType,
> = ActionCreatorType & ActionCreatorProps<
  StartActionCreatorType
>;

export type StartActionCreatorWithProps<
  ActionCreatorType,
> = ActionCreatorWithProps<ActionCreatorType, ActionCreatorType>;

export type AnyActionCreatorWithProps = StartActionCreatorWithProps<{}>;

// =========================================================================

export type ModelActionCreator<
  RawActionCreator extends Function
> = (
  ...args: ArgumentTypes<RawActionCreator>
) => ReturnType<RawActionCreator> & {
  actionCreator: StartActionCreatorWithProps<ModelActionCreator<RawActionCreator>>;
} & QcRequestAction;

export type ResourceModelActions<
  QueryInfosLike extends { [ s : string] : { actionCreator: Function; } }
> = {
  [P in keyof QueryInfosLike] : StartActionCreatorWithProps<
    ModelActionCreator<QueryInfosLike[P]['actionCreator']>
  >;
  // [s: string]: StartActionCreatorWithProps<{}>,
};
