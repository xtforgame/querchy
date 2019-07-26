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

export type ResourceModelActionsOptions<
  ActionType extends Action,
  CommonConfigType extends CommonConfig
> = {
  query?: any;
  headers?: { [s : string] : string };
};

export type ModelActionCreatorCreate<
  ActionType extends Action,
  CommonConfigType extends CommonConfig
> = (
  data: any, options?: ResourceModelActionsOptions<ActionType, CommonConfigType>,
) => ActionType;

export type ModelActionCreatorRead<
  ActionType extends Action,
  CommonConfigType extends CommonConfig
> = (
  resourceId: any, options?: ResourceModelActionsOptions<ActionType, CommonConfigType>,
) => ActionType;

export type ModelActionCreatorUpdate<
  ActionType extends Action,
  CommonConfigType extends CommonConfig
> = (
  resourceId: any, data: any, options?: ResourceModelActionsOptions<ActionType, CommonConfigType>,
) => ActionType;

export type ModelActionCreatorDelete<
  ActionType extends Action,
  CommonConfigType extends CommonConfig
> = (
  resourceId: any, options?: ResourceModelActionsOptions<ActionType, CommonConfigType>,
) => ActionType;

export type ModelSubActionCreatorRespond<
  ActionType extends Action,
  CommonConfigType extends CommonConfig
> = (
  resourceId: any, options?: ResourceModelActionsOptions<ActionType, CommonConfigType>,
) => ActionType;

export type ModelSubActionCreatorRespondError<
  ActionType extends Action,
  CommonConfigType extends CommonConfig
> = (
  resourceId: any, options?: ResourceModelActionsOptions<ActionType, CommonConfigType>,
) => ActionType;

export type ModelSubActionCreatorCancel<
  ActionType extends Action,
  CommonConfigType extends CommonConfig
> = (
  resourceId: any, options?: ResourceModelActionsOptions<ActionType, CommonConfigType>,
) => ActionType;

export type ActionCreatorWithProps<
  ActionType extends Action,
  CommonConfigType extends CommonConfig,
  StartActionCreatorType,
  ActionCreatorType,
> = ActionCreatorType & {
  actionType: string,
  creators: {
    start?: ActionCreatorWithProps<ActionType, CommonConfigType, StartActionCreatorType, StartActionCreatorType>,
    respond?: ActionCreatorWithProps<ActionType, CommonConfigType, StartActionCreatorType, ModelSubActionCreatorRespond<ActionType, CommonConfigType>>,
    respondError?: ActionCreatorWithProps<ActionType, CommonConfigType, StartActionCreatorType, ModelSubActionCreatorRespondError<ActionType, CommonConfigType>>,
    cancel?: ActionCreatorWithProps<ActionType, CommonConfigType, StartActionCreatorType, ModelSubActionCreatorCancel<ActionType, CommonConfigType>>,
  },
};

export type StartActionCreatorWithProps<
  ActionType extends Action,
  CommonConfigType extends CommonConfig,
  ActionCreatorType,
> = ActionCreatorWithProps<ActionType, CommonConfigType, ActionCreatorType, ActionCreatorType>;

export type ResourceModelActions<
  ActionType extends Action,
  CommonConfigType extends CommonConfig
> = {
  create: StartActionCreatorWithProps<ActionType, CommonConfigType, ModelActionCreatorCreate<ActionType, CommonConfigType>>,
  read: StartActionCreatorWithProps<ActionType, CommonConfigType, ModelActionCreatorRead<ActionType, CommonConfigType>>,
  update: StartActionCreatorWithProps<ActionType, CommonConfigType, ModelActionCreatorUpdate<ActionType, CommonConfigType>>,
  delete: StartActionCreatorWithProps<ActionType, CommonConfigType, ModelActionCreatorDelete<ActionType, CommonConfigType>>,
};

export type ResourceModelActionTypes<
  ActionType extends Action,
  CommonConfigType extends CommonConfig
> = {
  [P in keyof ResourceModelActions<ActionType, CommonConfigType>]: string;
};

export type ResourceModel<
  ActionType extends Action,
  CommonConfigType extends CommonConfig
> = {
  actionTypes?: ResourceModelActionTypes<ActionType, CommonConfigType>,
  actions?: ResourceModelActions<ActionType, CommonConfigType>,
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

export interface QcResponseAction extends QcAction {
  response: QcResponse;
  responseType : string;
  options: any;
}

export interface QcResponseError extends Error {
  config: QcRequestConfig;
  response?: QcResponse;
}

export interface QcResponseErrorAction extends QcAction {
  error: QcResponseError;
  options: any;
}

export type QcCancelReason = any;

export interface QcCancelRequestAction extends QcAction {
  reason: QcCancelReason;
  options: any;
}

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
  T extends Required<ResourceModelActions<ActionType, CommonConfigType>>
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
