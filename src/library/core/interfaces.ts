import { Observable } from 'rxjs';
import { Action, State } from 'pure-epic';
import {
  RunnerType,
  QcAction,
  QcActionCreator,
} from '~/common/interfaces';

export type SimpleQueryRunner = {
  type: RunnerType;
  handle: Function;
};

export type CommonConfig = {
  defaultQueryRunner : SimpleQueryRunner,
  queryRunners?: { [s : string] : SimpleQueryRunner };
  queryPrefix?: string;
  getActionTypeName?: (queryPrefix: string, queryName: string) => string;
  [s : string] : any;
};

export type ResourceModelActionsOptions = {
  query?: any;
  headers?: { [s : string] : string };
};

// ====================

export type CrudType = 'create' | 'read' | 'update' | 'delete';
export type CrudSubType = 'start' | 'respond' | 'respondError' | 'cancel';

export interface QcResponseAction extends QcAction {
  response: QcResponse;
  responseType : string;

  modelName: string;
  crudType: CrudType;
  crudSubType: CrudSubType;

  actionCreator: ActionCreatorWithProps<{}, ModelSubActionCreatorRespond>;
  // actionTypes,

  options: any;
  [s : string] : any;
}
export interface QcResponseErrorAction extends QcAction {
  error: QcResponseError;

  modelName: string;
  crudType: CrudType;
  crudSubType: CrudSubType;

  actionCreator: ActionCreatorWithProps<{}, ModelSubActionCreatorRespondError>;
  // actionTypes,

  options: any;
  [s : string] : any;
}
export interface QcCancelRequestAction extends QcAction {
  reason: QcCancelReason;

  modelName: string;
  crudType: CrudType;
  crudSubType: CrudSubType;

  actionCreator: ActionCreatorWithProps<{}, ModelSubActionCreatorCancel>;
  // actionTypes,

  options: any;
  [s : string] : any;
}

export interface QcCreateAction extends QcAction {
  modelName: string;
  crudType: CrudType;
  crudSubType: CrudSubType;

  actionCreator: StartActionCreatorWithProps<ModelActionCreatorCreate>;
  // actionTypes,

  options: any;
  [s : string] : any;
}

export interface QcReadAction extends QcAction {
  modelName: string;
  crudType: CrudType;
  crudSubType: CrudSubType;

  actionCreator: StartActionCreatorWithProps<ModelActionCreatorRead>;
  // actionTypes,

  options: any;
  [s : string] : any;
}

export interface QcUpdateAction extends QcAction {
  modelName: string;
  crudType: CrudType;
  crudSubType: CrudSubType;

  actionCreator: StartActionCreatorWithProps<ModelActionCreatorUpdate>;
  // actionTypes,

  options: any;
  [s : string] : any;
}

export interface QcDeleteAction extends QcAction {
  modelName: string;
  crudType: CrudType;
  crudSubType: CrudSubType;

  actionCreator: StartActionCreatorWithProps<ModelActionCreatorDelete>;
  // actionTypes,

  options: any;
  [s : string] : any;
}

// ====================

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

export type ResourceModelActions = {
  create: StartActionCreatorWithProps<ModelActionCreatorCreate>,
  read: StartActionCreatorWithProps<ModelActionCreatorRead>,
  update: StartActionCreatorWithProps<ModelActionCreatorUpdate>,
  delete: StartActionCreatorWithProps<ModelActionCreatorDelete>,
  [s: string]: StartActionCreatorWithProps<{}>,
};

export type ResourceModelActionTypes = {
  [P in keyof ResourceModelActions]: string;
};

export type ResourceModel<
  ActionType extends Action,
  CommonConfigType extends CommonConfig
> = {
  actionTypes?: ResourceModelActionTypes,
  actions?: ResourceModelActions,
};

export type ModelMap<
  ActionType extends Action,
  CommonConfigType extends CommonConfig
> = {
  [s : string] : ResourceModel<ActionType, CommonConfigType>;
};

export type QcRequestConfig = {
  rawConfigs?: any;
  overwriteConfigs?: any;
  method : string;
  url : string;
  headers?: { [s : string] : string };
  query?: { [s : string] : any };
  body?: any;
};

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

// ====================

export type QueryCreatorDefinition<
  ActionType extends Action,
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<ActionType, CommonConfigType>
> = {
  queryRunner?: string | SimpleQueryRunner,
  buildRequestConfig : (
    action: ActionType, runnerType : RunnerType, commonConfig : CommonConfigType,
  ) => QcRequestConfig;
};

export type QueryCreatorMap<
  ActionType extends Action,
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<ActionType, CommonConfigType>
> = {
  [s : string] : QueryCreatorDefinition<ActionType, CommonConfigType, ModelMapType> | undefined;
};

export interface QuerchyDefinition<
  ActionType extends Action,
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<ActionType, CommonConfigType>,
  QueryCreatorMapType extends QueryCreatorMap<ActionType, CommonConfigType, ModelMapType>,
  ExtraActionCreatorsType extends ExtraActionCreators<
    ActionType,
    CommonConfigType,
    ModelMapType,
    QueryCreatorMapType
  >,
> {
  commonConfig : CommonConfigType;
  models : ModelMapType;
  queryCreators : QueryCreatorMapType;
  extraActionCreators?: ExtraActionCreatorsType;
}

export type QcDependencies<
  ActionType extends Action,
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<ActionType, CommonConfigType>,
  QueryCreatorMapType extends QueryCreatorMap<ActionType, CommonConfigType, ModelMapType>,
  ExtraActionCreatorsType extends ExtraActionCreators<
    ActionType,
    CommonConfigType,
    ModelMapType,
    QueryCreatorMapType
  >,
  QuerchyDefinitionType extends QuerchyDefinition<
    ActionType, CommonConfigType, ModelMapType, QueryCreatorMapType, ExtraActionCreatorsType
  >,
  ExtraDependencies = any,
> = ExtraDependencies & {
  queryCreatorMap : QueryCreatorMap<ActionType, CommonConfigType, ModelMapType>;
  querchyDef : QuerchyDefinitionType;
};

export const INIT_FUNC = Symbol('init');
export type InitFunctionKeyType = typeof INIT_FUNC;
export type ActionCreatorsInitFunction = (x: any) => void;

export interface ExtraActionCreators<
  ActionType extends Action,
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<
    ActionType, CommonConfigType
  >,
  QueryCreatorMapType extends QueryCreatorMap<
    ActionType, CommonConfigType, ModelMapType
  >,
> {
  [INIT_FUNC] : ActionCreatorsInitFunction;
  [s : string] : QcActionCreator<ActionType>;
}


// ==========

export type ModelActionCreators<
  ActionType extends Action,
  CommonConfigType extends CommonConfig,
  T extends Required<ResourceModelActions>
> = {
  [P in keyof T] : QcActionCreator<ActionType>;
} & {
  [s : string] : QcActionCreator<ActionType>;
};

export type ModelActionCreatorSet<
  ActionType extends Action,
  CommonConfigType extends CommonConfig,
  T extends ModelMap<ActionType, CommonConfigType>,
  ExtraActionCreatorsType
> = {
  [P in keyof T] : Required<T[P]>['actions'];
} & {
  [P in keyof ExtraActionCreatorsType] : ExtraActionCreatorsType[P];
} & {
  [s : string] : QcActionCreator<ActionType>;
};

export type ActionCreatorSets<
  ActionType extends Action,
  CommonConfigType extends CommonConfig,
  T extends ModelMap<ActionType, CommonConfigType>,
  ExtraActionCreatorSetsType
> = ModelActionCreatorSet<ActionType, CommonConfigType, T, {}> & {
  extra : ExtraActionCreatorSetsType;
};
