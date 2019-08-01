import {
  RunnerType,
  QcAction,
  QcActionCreator,
} from '~/common/interfaces';

import {
  QcBasicAction,
  QcRequestConfig,
  ResourceModelActions,
  RawActionCreatorCreate,
  RawActionCreatorRead,
  RawActionCreatorUpdate,
  RawActionCreatorDelete,
} from './crud-sub-action-interfaces';

export * from './crud-sub-action-interfaces';

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

export type QueryInfo<
  CommonConfigType extends CommonConfig,
  RawActionCreator extends Function
> = {
  actionCreator: RawActionCreator;
};

export type QueryInfos<
  CommonConfigType extends CommonConfig
> = {
  create?: QueryInfo<CommonConfigType, RawActionCreatorCreate>;
  read?: QueryInfo<CommonConfigType, RawActionCreatorRead>;
  update?: QueryInfo<CommonConfigType, RawActionCreatorUpdate>;
  delete?: QueryInfo<CommonConfigType, RawActionCreatorDelete>;
} & {
  [s : string]: QueryInfo<CommonConfigType, Function>;
};

export type ResourceModelActionTypes<ModelActions> = {
  [P in keyof ModelActions]: string;
};

export type ResourceModel<
  CommonConfigType extends CommonConfig
> = {
  url: string;
  queryInfos: QueryInfos<CommonConfigType>;
  buildUrl?: (action: QcBasicAction) => string;
  queryCreator?: string;
  crudTypes?: string[];
  actionTypes?: ResourceModelActionTypes<ResourceModelActions<Required<QueryInfos<CommonConfigType>>>>,
  actions?: ResourceModelActions<Required<QueryInfos<CommonConfigType>>>,
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
