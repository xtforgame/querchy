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

export type ResourceModelActions<
  ActionType extends Action,
  CommonConfigType extends CommonConfig
> = {
  get?: (s: string) => ActionType,
  update?: (s: string) => ActionType,
};

export type ResourceModel<
  ActionType extends Action,
  CommonConfigType extends CommonConfig
> = {
  actions: ResourceModelActions<ActionType, CommonConfigType>,
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