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

export type ActionInfoBase<
  RawActionCreator extends Function
> = {
  name?: string;
  actionType?: string;
  actionCreator: RawActionCreator;
  mergerCreator?: Merger<QcBasicAction>,
};

export type QueryInfo<
  RawActionCreator extends Function
> = ActionInfoBase<RawActionCreator>;

export type ActionInfo<
  RawActionCreator extends Function
> = ActionInfoBase<RawActionCreator>;

// ==================

export type ExtraActionInfoBase<
  RawActionCreator extends Function
> = ActionInfoBase<RawActionCreator>;

export type ExtraQueryInfo<
  RawActionCreator extends Function
> = ExtraActionInfoBase<RawActionCreator> & {
  queryBuilderName?: string,
};

export type ExtraActionInfo<
  RawActionCreator extends Function
> = ExtraActionInfoBase<RawActionCreator>;

export type CommonConfig = {
  defaultQueryRunner: SimpleQueryRunner;
  queryRunners?: { [s : string] : SimpleQueryRunner };
  actionTypePrefix?: string;
  getActionTypeName?: (actionTypePrefix: string, queryName: string) => string;
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
  queryBuilderName?: string;
  actionTypes?: { [s : string]: string; };
  actions?: { [s: string]: StartQueryActionCreatorWithProps<{}>; };
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

export type BuildRequestConfig<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>
> = (
  action: QcBasicAction,
  options: BuildRequestConfigOption<CommonConfigType, ModelMapType>,
) => QcRequestConfig;

export type QueryBuilderDefinition<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>
> = {
  queryRunner?: string | SimpleQueryRunner,
  buildRequestConfig : BuildRequestConfig<CommonConfigType, ModelMapType>;
};

export type QueryBuilderMap<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>
> = {
  defaultBuilder : QueryBuilderDefinition<CommonConfigType, ModelMapType>;
  [s : string] : QueryBuilderDefinition<CommonConfigType, ModelMapType> | undefined;
};

export interface QuerchyDefinition<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>,
  QueryBuilderMapType extends QueryBuilderMap<CommonConfigType, ModelMapType>,
  ExtraActionCreatorsType extends ExtraActionCreators<
    CommonConfigType,
    ModelMapType,
    QueryBuilderMapType
  >,
> {
  commonConfig : CommonConfigType;
  models : ModelMapType;
  queryBuilders : QueryBuilderMapType;
  extraActionCreators?: ExtraActionCreatorsType;
}

export type QcDependencies<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>,
  QueryBuilderMapType extends QueryBuilderMap<CommonConfigType, ModelMapType>,
  ExtraActionCreatorsType extends ExtraActionCreators<
    CommonConfigType,
    ModelMapType,
    QueryBuilderMapType
  >,
  QuerchyDefinitionType extends QuerchyDefinition<
    CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType
  >,
  ExtraDependencies = any,
> = ExtraDependencies & {
  querchyDef : QuerchyDefinitionType;
};

export const INIT_FUNC = Symbol('init');
export type InitFunctionKeyType = typeof INIT_FUNC;
export type ActionCreatorsInitFunction<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>
> = (models: ModelMapType, args: any) => void;

export interface ExtraActionCreatorsLike {
  queryInfos: {
    [s : string]: ExtraQueryInfo<Function>;
  };
  actionInfos: {
    [s : string]: ExtraActionInfo<Function>;
  };
  extraQueryCreators: {
    [s : string] : QcActionCreator;
  };
  actionTypes?: { [s : string]: string; };
  actions?: { [s: string]: StartQueryActionCreatorWithProps<{}>; };
}

export interface ExtraActionCreators<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<
    CommonConfigType
  >,
  QueryBuilderMapType extends QueryBuilderMap<
    CommonConfigType, ModelMapType
  >,
> extends ExtraActionCreatorsLike {
  [INIT_FUNC] : ActionCreatorsInitFunction<CommonConfigType, ModelMapType>;
}

// ==========

export type ModelQueryActionCreatorSet<
  CommonConfigType extends CommonConfig,
  T extends ModelMap<CommonConfigType>,
  ExtraActionCreatorsType extends ExtraActionCreatorsLike,
> = {
  [P in keyof T] : Required<Required<T[P]>['actions']>;
} & {
  extra : Required<Required<ExtraActionCreatorsType>['actions']>;
} & {
  [s : string] : QcActionCreator;
};

export type ActionCreatorSets<
  CommonConfigType extends CommonConfig,
  T extends ModelMap<CommonConfigType>,
  ExtraActionCreatorsType extends ExtraActionCreatorsLike,
> = ModelQueryActionCreatorSet<CommonConfigType, T, ExtraActionCreatorsType>;
