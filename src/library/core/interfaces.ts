import {
  RunnerType,
  QcAction,
  QcActionCreator,
} from '~/common/interfaces';

import {
  QcBasicAction,
  QcRequestConfig,
  ResourceModelActions,
} from './crud-interfaces';

export * from './crud-interfaces';

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

// ====================

export type ResourceModelActionTypes = {
  [P in keyof ResourceModelActions]: string;
};

export type ResourceModel<
  CommonConfigType extends CommonConfig
> = {
  url: string;
  buildUrl?: (action: QcBasicAction) => string;
  queryCreator?: string;
  actionTypes?: ResourceModelActionTypes,
  actions?: ResourceModelActions,
};

export type ModelMap<
  CommonConfigType extends CommonConfig
> = {
  [s : string] : ResourceModel<CommonConfigType>;
};

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
    action: QcBasicAction,
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
  [P in keyof T] : Required<Required<T[P]>['actions']>;
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
