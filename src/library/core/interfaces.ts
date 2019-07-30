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

export interface QcStartAction extends QcAction {
  modelName: string;
  crudType: CrudType;
  crudSubType: CrudSubType;
  // actionTypes,

  options: any;
  [s : string] : any;
}

export interface QcStartActionWithResourceId extends QcStartAction {
  resourceId: any;
}

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

export interface QcCreateAction extends QcStartAction {
  actionCreator: StartActionCreatorWithProps<ModelActionCreatorCreate>;
  [s : string] : any;
}

export interface QcReadAction extends QcStartActionWithResourceId {
  actionCreator: StartActionCreatorWithProps<ModelActionCreatorRead>;
  [s : string] : any;
}

export interface QcUpdateAction extends QcStartActionWithResourceId {
  actionCreator: StartActionCreatorWithProps<ModelActionCreatorUpdate>;
  [s : string] : any;
}

export interface QcDeleteAction extends QcStartActionWithResourceId {
  actionCreator: StartActionCreatorWithProps<ModelActionCreatorDelete>;
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
  CommonConfigType extends CommonConfig
> = {
  url: string;
  buildUrl?: (action: QcStartAction) => string;
  queryCreator?: string;
  actionTypes?: ResourceModelActionTypes,
  actions?: ResourceModelActions,
};

export type ModelMap<
  CommonConfigType extends CommonConfig
> = {
  [s : string] : ResourceModel<CommonConfigType>;
};

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

// ====================

export type BuildRequestConfigOption<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>
> = {
  runnerType : RunnerType,
  commonConfig : CommonConfigType,
  models: ModelMapType,
};

export type QueryCreatorDefinition<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>
> = {
  queryRunner?: string | SimpleQueryRunner,
  buildRequestConfig : (
    action: QcStartAction,
    options: BuildRequestConfigOption<CommonConfigType, ModelMapType>,
  ) => QcRequestConfig;
};

export type QueryCreatorMap<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>
> = {
  defaultCreator : QueryCreatorDefinition<CommonConfigType, ModelMapType>;
  [s : string] : QueryCreatorDefinition<CommonConfigType, ModelMapType> | undefined;
};

export interface QuerchyDefinition<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>,
  QueryCreatorMapType extends QueryCreatorMap<CommonConfigType, ModelMapType>,
  ExtraActionCreatorsType extends ExtraActionCreators<
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
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>,
  QueryCreatorMapType extends QueryCreatorMap<CommonConfigType, ModelMapType>,
  ExtraActionCreatorsType extends ExtraActionCreators<
    CommonConfigType,
    ModelMapType,
    QueryCreatorMapType
  >,
  QuerchyDefinitionType extends QuerchyDefinition<
    CommonConfigType, ModelMapType, QueryCreatorMapType, ExtraActionCreatorsType
  >,
  ExtraDependencies = any,
> = ExtraDependencies & {
  querchyDef : QuerchyDefinitionType;
};

export const INIT_FUNC = Symbol('init');
export type InitFunctionKeyType = typeof INIT_FUNC;
export type ActionCreatorsInitFunction = (args: any) => void;

export interface ExtraActionCreators<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<
    CommonConfigType
  >,
  QueryCreatorMapType extends QueryCreatorMap<
    CommonConfigType, ModelMapType
  >,
> {
  [INIT_FUNC] : ActionCreatorsInitFunction;
  [s : string] : QcActionCreator;
}

// ==========

export type ModelActionCreators<
  CommonConfigType extends CommonConfig,
  T extends Required<ResourceModelActions>
> = {
  [P in keyof T] : QcActionCreator;
} & {
  [s : string] : QcActionCreator;
};

export type ModelActionCreatorSet<
  CommonConfigType extends CommonConfig,
  T extends ModelMap<CommonConfigType>,
  ExtraActionCreatorsType
> = {
  [P in keyof T] : Required<T[P]>['actions'];
} & {
  [P in keyof ExtraActionCreatorsType] : ExtraActionCreatorsType[P];
} & {
  [s : string] : QcActionCreator;
};

export type ActionCreatorSets<
  CommonConfigType extends CommonConfig,
  T extends ModelMap<CommonConfigType>,
  ExtraActionCreatorSetsType
> = ModelActionCreatorSet<CommonConfigType, T, {}> & {
  extra : ExtraActionCreatorSetsType;
};
