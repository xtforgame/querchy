import { State } from 'pure-epic';
import {
  RunnerType,
  QcAction,
  QcActionCreator,
  ResourceModelActions,
  ResourceMerger,
  GlobalMerger,
  BaseSelector,
  ModelRootState,
} from '../common/interfaces';

import {
  QcBasicAction,
  QcRequestConfig,
  ResourceModelQueryActions,
  StartQueryActionCreatorWithProps,
} from './crud-sub-action-interfaces';

import {
  ReturnType,
} from '../utils/index';

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
  querySubActionTypes?: { [s : string]: string },
};

export type ModelActionInfoBase<
  RawActionCreator extends Function
> = ActionInfoBase<RawActionCreator> & {
  resourceMerger?: ResourceMerger<QcBasicAction>,
};

export type QueryInfo<
  RawActionCreator extends Function
> = ModelActionInfoBase<RawActionCreator>;

export type ActionInfo<
  RawActionCreator extends Function
> = ModelActionInfoBase<RawActionCreator>;

// ==================

export type ExtraActionInfoBase<
  QcRootState,
  RawActionCreator extends Function
> = ActionInfoBase<RawActionCreator> & {
  globalMerger?: GlobalMerger<QcRootState, QcBasicAction>,
};

export type ExtraQueryInfo<
  QcRootState,
  RawActionCreator extends Function
> = ExtraActionInfoBase<QcRootState, RawActionCreator> & {
  queryBuilderName?: string,
};

export type ExtraActionInfo<
  QcRootState,
  RawActionCreator extends Function
> = ExtraActionInfoBase<QcRootState, RawActionCreator>;

export type CommonConfig = {
  defaultBuildUrl: (modelBaseUrl : string, action: QcBasicAction) => string;
  defaultQueryRunner: SimpleQueryRunner;
  queryRunners?: { [s : string] : SimpleQueryRunner };
  actionTypePrefix?: string;
  getActionTypeName?: (actionTypePrefix: string, queryName: string) => string;
  [s : string]: any;
};

// ====================

// feature
// https://stackoverflow.com/questions/54701874/variadic-generic-types-in-typescript
export interface FeatureTypes {
  QueryInfos: {
    [s : string]: QueryInfo<Function>;
  };
  ActionInfos: {
    [s : string]: ActionInfo<Function>;
  };
}

export interface Feature<TypesType extends FeatureTypes = FeatureTypes> {
  Types: TypesType;
  getQueryInfos : () => TypesType['QueryInfos'];
  getActionInfos : () => TypesType['ActionInfos'];
  getBuildRequestConfigMiddleware : <
    CommonConfigType extends CommonConfig,
    ModelMapType extends ModelMap<CommonConfigType>
  >() => BuildRequestConfigMiddleware<CommonConfigType, ModelMapType>;
}

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
  buildUrl?: (modelBaseUrl : string, action: QcBasicAction) => string;
  queryBuilderName?: string;
  actionTypes?: { [s : string]: string; };
  actions?: { [s: string]: StartQueryActionCreatorWithProps<{}>; };
  feature?: Feature;
};

export type ModelMap<
  CommonConfigType extends CommonConfig
> = {
  [s : string] : ResourceModel<CommonConfigType>;
};

export type BuildRequestConfigContext<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>
> = {
  action: QcBasicAction,
  runnerType : RunnerType,
  commonConfig : CommonConfigType,
  models: ModelMapType,
  modelRootState : ModelRootState<ModelMapType>;
  requestConfig: QcRequestConfig | undefined;
};

export type BuildRequestConfigMiddleware<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>
> = (
  context: BuildRequestConfigContext<CommonConfigType, ModelMapType>,
  next: (requestConfig?: QcRequestConfig) => QcRequestConfig,
) => QcRequestConfig;

export type BuildRequestConfigFunction<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>
> = BuildRequestConfigMiddleware<
  CommonConfigType,
  ModelMapType
>;

export type BuildRequestConfig<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>
> = BuildRequestConfigFunction<
  CommonConfigType,
  ModelMapType
> | BuildRequestConfigMiddleware<
  CommonConfigType,
  ModelMapType
>[];

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
  namespace?: string;
  commonConfig : CommonConfigType;
  models : ModelMapType;
  baseSelector : BaseSelector<ModelMapType>;
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
    [s : string]: ExtraQueryInfo<any, Function>;
  };
  actionInfos: {
    [s : string]: ExtraActionInfo<any, Function>;
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
  ModelMapType extends ModelMap<CommonConfigType>,
  ExtraActionCreatorsType extends ExtraActionCreatorsLike,
> = {
  [P in keyof ModelMapType] : Required<Required<ModelMapType[P]>['actions']>;
} & {
  extra : Required<Required<ExtraActionCreatorsType>['actions']>;
} & {
  [s : string] : QcActionCreator;
};

export type ActionCreatorSets<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>,
  ExtraActionCreatorsType extends ExtraActionCreatorsLike,
> = ModelQueryActionCreatorSet<CommonConfigType, ModelMapType, ExtraActionCreatorsType>;

// ==========

export type ModelPromiseQueryActionCreatorSet<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>,
  ExtraActionCreatorsType extends ExtraActionCreatorsLike,
> = {
  [P in keyof ModelMapType] : ResourceModelQueryActions<Required<ModelMapType[P]>['queryInfos']>;
} & {
  extra : ResourceModelQueryActions<Required<ExtraActionCreatorsType>['queryInfos']>;
} & {
  [s : string] : QcActionCreator;
};

export type PromiseActionCreatorSets<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>,
  ExtraActionCreatorsType extends ExtraActionCreatorsLike,
> = ModelQueryActionCreatorSet<CommonConfigType, ModelMapType, ExtraActionCreatorsType>; // ModelPromiseQueryActionCreatorSet<CommonConfigType, ModelMapType, ExtraActionCreatorsType>;
