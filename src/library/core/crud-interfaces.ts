import {
  RunnerType,
  QcAction,
  QcActionCreator,
} from '~/common/interfaces';

export type ResourceModelActionsOptions = {
  query?: any;
  headers?: { [s : string] : string };
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

export interface QcBasicActionWithResourceId extends QcBasicAction {
  resourceId: any;
}

// ==================

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

export interface QcResponseError extends Error {
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
) => QcResponseErrorAction;

export type CancelActionCreator = (
  reason : any,
) => QcCancelRequestAction;

export interface QcRequestActionCreators {
  success: SuccessActionCreator;
  error: ErrorActionCreator;
  cancel: CancelActionCreator;
}

// ================

export interface QcResponseAction extends QcBasicAction {
  response: QcResponse;
  responseType : string;

  actionCreator: ActionCreatorWithProps<{}, ModelSubActionCreatorRespond>;
  [s : string] : any;
}

export interface QcResponseErrorAction extends QcBasicAction {
  error: QcResponseError;

  actionCreator: ActionCreatorWithProps<{}, ModelSubActionCreatorRespondError>;
  [s : string] : any;
}
export interface QcCancelRequestAction extends QcBasicAction {
  reason: QcCancelReason;

  actionCreator: ActionCreatorWithProps<{}, ModelSubActionCreatorCancel>;
  [s : string] : any;
}

// ====================

export type ModelSubActionCreatorRespond = (
  response: any, responseType: string, options?: ResourceModelActionsOptions,
) => QcResponseAction;

export type ModelSubActionCreatorRespondError = (
  error: any, options?: ResourceModelActionsOptions,
) => QcResponseErrorAction;

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

// ====================

export interface QcCreateAction extends QcBasicAction {
  actionCreator: StartActionCreatorWithProps<ModelActionCreatorCreate>;
  [s : string] : any;
}

export interface QcReadAction extends QcBasicActionWithResourceId {
  actionCreator: StartActionCreatorWithProps<ModelActionCreatorRead>;
  [s : string] : any;
}

export interface QcUpdateAction extends QcBasicActionWithResourceId {
  actionCreator: StartActionCreatorWithProps<ModelActionCreatorUpdate>;
  [s : string] : any;
}

export interface QcDeleteAction extends QcBasicActionWithResourceId {
  actionCreator: StartActionCreatorWithProps<ModelActionCreatorDelete>;
  [s : string] : any;
}

export type ModelActionCreatorCreate = (
  data: any, options?: ResourceModelActionsOptions,
) => QcCreateAction;

export type ModelActionCreatorRead = (
  resourceId: any, options?: ResourceModelActionsOptions,
) => QcReadAction;

export type ModelActionCreatorUpdate = (
  resourceId: any, data: any, options?: ResourceModelActionsOptions,
) => QcUpdateAction;

export type ModelActionCreatorDelete = (
  resourceId: any, options?: ResourceModelActionsOptions,
) => QcDeleteAction;

export interface ResourceModelActions {
  create?: StartActionCreatorWithProps<ModelActionCreatorCreate>;
  read?: StartActionCreatorWithProps<ModelActionCreatorRead>;
  update?: StartActionCreatorWithProps<ModelActionCreatorUpdate>;
  delete?: StartActionCreatorWithProps<ModelActionCreatorDelete>;
  // [s: string]: StartActionCreatorWithProps<{}>,
}
