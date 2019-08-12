import {
  RunnerType,
  QcAction,
  QcActionCreator,
  ResourceModelActions,
  Merger,
} from '~/common/interfaces';

import {
  QcBasicAction,
  QcRequestConfig,
  ResourceModelQueryActions,
  StartQueryActionCreatorWithProps,
} from './crud-sub-action-interfaces';

export * from './crud-sub-action-interfaces';

export type SimpleQueryRunner = {
  type: RunnerType;
  handleQuery: Function;
};

export type QueryInfo<
  RawActionCreator extends Function
> = {
  actionCreator: RawActionCreator;
  mergerCreator?: Merger<QcBasicAction>,
};

export type ActionInfo<
  RawActionCreator extends Function
> = {
  actionCreator: RawActionCreator;
  mergerCreator?: Merger<QcBasicAction>,
};

export type CommonConfig = {
  defaultQueryRunner: SimpleQueryRunner;
  queryRunners?: { [s : string] : SimpleQueryRunner };
  queryPrefix?: string;
  getActionTypeName?: (queryPrefix: string, queryName: string) => string;
  [s : string]: any;
};

// ====================

export type ResourceModelActionTypes<ModelActions> = {
  [P in keyof ModelActions]: string;
};

export type ResourceModel<
  CommonConfigType extends CommonConfig
> = {
  url: string;
  crudNames?: string[];
  queryInfos: {
    [s : string]: QueryInfo<Function>;
  };
  actionNames?: string[];
  actionInfos: {
    [s : string]: ActionInfo<Function>;
  };
  buildUrl?: (action: QcBasicAction) => string;
  parseResponse?: (action: QcBasicAction) => {};
  queryCreator?: string;
  actionTypes?: { [s : string]: string; };
  actions?: { [s: string]: StartQueryActionCreatorWithProps<{}>; },
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

export type ModelQueryActionCreatorSet<
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
> = ModelQueryActionCreatorSet<CommonConfigType, T, {}> & {
  extra : ExtraActionCreatorSetsType;
};
