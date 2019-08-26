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
};

export type BuildRequestConfigFunction<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>
> = (
  context: BuildRequestConfigContext<CommonConfigType, ModelMapType>,
) => QcRequestConfig;

export type BuildRequestConfigContextForMiddleware<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>
> = BuildRequestConfigContext<CommonConfigType, ModelMapType>
  & {
    requestConfig: QcRequestConfig | undefined,
  };

export type BuildRequestConfigMiddleware<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>
> = (
  context: BuildRequestConfigContextForMiddleware<CommonConfigType, ModelMapType>,
  next: (requestConfig?: QcRequestConfig) => QcRequestConfig,
) => QcRequestConfig;

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

// ============================
export type SelectorCreatorCreatorForModelMap<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>,
> = (baseSelector : BaseSelector<ModelMapType>) => (...args : any) => Function;

export type ExtraSelectorInfosForModelMap<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>,
> = {
  [s : string] : {
    creatorCreator: SelectorCreatorCreatorForModelMap<
      CommonConfigType,
      ModelMapType
    >;
  };
};

export type ExtraSelectorInfosMapForModelMap<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>,
> = {
  [P in keyof Partial<ModelMapType>] : ExtraSelectorInfosForModelMap<
    CommonConfigType,
    ModelMapType
  >;
};

export type BuiltinModelSelectors = { [s : string] : Function };

export type MergedSelectorCreatorsForModel<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>,
  ExtraSelectorInfosForModelMapType extends ExtraSelectorInfosForModelMap<
    CommonConfigType,
    ModelMapType
  >
> = {
  [P in keyof ExtraSelectorInfosForModelMapType] : ReturnType<ExtraSelectorInfosForModelMapType[P]['creatorCreator']>;
};

export type ExtraModelSelectorCreators<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>,
  ExtraSelectorInfosForModelType extends ExtraSelectorInfosMapForModelMap<
    CommonConfigType,
    ModelMapType
  >
> = {
  [P in keyof ModelMapType] : MergedSelectorCreatorsForModel<
    CommonConfigType,
    ModelMapType,
    ExtraSelectorInfosForModelType[P]
  >;
};

export type MergedSelectorsForModel<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>,
  ExtraSelectorInfosForModelMapType extends ExtraSelectorInfosForModelMap<
    CommonConfigType,
    ModelMapType
  >
> = {
  [P in keyof ExtraSelectorInfosForModelMapType] : ReturnType<ReturnType<ExtraSelectorInfosForModelMapType[P]['creatorCreator']>>;
};

export type ExtraModelSelectors<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>,
  ExtraSelectorInfosForModelType extends ExtraSelectorInfosMapForModelMap<
    CommonConfigType,
    ModelMapType
  >
> = {
  [P in keyof ModelMapType] : MergedSelectorsForModel<
    CommonConfigType,
    ModelMapType,
    ExtraSelectorInfosForModelType[P]
  >;
};
