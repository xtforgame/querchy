import { RunnerType, QcActionCreator, ResourceMerger, GlobalMerger, BaseSelector, ModelRootState } from '../common/interfaces';
import { QcBasicAction, QcRequestConfig, ResourceModelQueryActions, StartQueryActionCreatorWithProps } from './crud-sub-action-interfaces';
export * from './crud-sub-action-interfaces';
export declare type SimpleQueryRunner = {
    type: RunnerType;
    handleQuery: Function;
};
export declare type ActionInfoBase<RawActionCreator extends Function> = {
    name?: string;
    actionType?: string;
    actionCreator: RawActionCreator;
    querySubActionTypes?: {
        [s: string]: string;
    };
};
export declare type ModelActionInfoBase<RawActionCreator extends Function> = ActionInfoBase<RawActionCreator> & {
    resourceMerger?: ResourceMerger<QcBasicAction>;
};
export declare type QueryInfo<RawActionCreator extends Function> = ModelActionInfoBase<RawActionCreator>;
export declare type ActionInfo<RawActionCreator extends Function> = ModelActionInfoBase<RawActionCreator>;
export declare type ExtraActionInfoBase<QcRootState, RawActionCreator extends Function> = ActionInfoBase<RawActionCreator> & {
    globalMerger?: GlobalMerger<QcRootState, QcBasicAction>;
};
export declare type ExtraQueryInfo<QcRootState, RawActionCreator extends Function> = ExtraActionInfoBase<QcRootState, RawActionCreator> & {
    queryBuilderName?: string;
};
export declare type ExtraActionInfo<QcRootState, RawActionCreator extends Function> = ExtraActionInfoBase<QcRootState, RawActionCreator>;
export declare type CommonConfig = {
    defaultBuildUrl: (modelBaseUrl: string, action: QcBasicAction) => string;
    defaultQueryRunner: SimpleQueryRunner;
    queryRunners?: {
        [s: string]: SimpleQueryRunner;
    };
    actionTypePrefix?: string;
    getActionTypeName?: (actionTypePrefix: string, queryName: string) => string;
    [s: string]: any;
};
export interface FeatureTypes {
    QueryInfos: {
        [s: string]: QueryInfo<Function>;
    };
    ActionInfos: {
        [s: string]: ActionInfo<Function>;
    };
}
export interface Feature<TypesType extends FeatureTypes = FeatureTypes> {
    Types: TypesType;
    getBuildRequestConfigMiddleware: <CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>>() => BuildRequestConfigMiddleware<CommonConfigType, ModelMapType>;
    getQueryInfos: <CommonConfigType extends CommonConfig, ResourceModelType extends ResourceModel<CommonConfigType>>(resourceModel: ResourceModelType) => TypesType['QueryInfos'];
    getActionInfos: <CommonConfigType extends CommonConfig, ResourceModelType extends ResourceModel<CommonConfigType>>(resourceModel: ResourceModelType) => TypesType['ActionInfos'];
}
export declare type ResourceModelActionTypes<ModelActions> = {
    [P in keyof ModelActions]: string;
};
export declare type ResourceModel<CommonConfigType extends CommonConfig = CommonConfig> = {
    url: string;
    crudNames?: string[];
    queryInfos: {
        [s: string]: QueryInfo<Function>;
    };
    actionNames?: string[];
    actionInfos: {
        [s: string]: ActionInfo<Function>;
    };
    buildUrl?: (modelBaseUrl: string, action: QcBasicAction) => string;
    queryBuilderName?: string;
    actionTypes?: {
        [s: string]: string;
    };
    actions?: {
        [s: string]: StartQueryActionCreatorWithProps<{}>;
    };
    feature?: Feature;
    featureDeps?: any;
};
export declare type ModelMap<CommonConfigType extends CommonConfig> = {
    [s: string]: ResourceModel<CommonConfigType>;
};
export declare type BuildRequestConfigContext<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>> = {
    action: QcBasicAction;
    runnerType: RunnerType;
    commonConfig: CommonConfigType;
    models: ModelMapType;
    modelRootState: ModelRootState<ModelMapType>;
    requestConfig: QcRequestConfig | undefined;
};
export declare type BuildRequestConfigMiddleware<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>> = (context: BuildRequestConfigContext<CommonConfigType, ModelMapType>, next: (requestConfig?: QcRequestConfig) => QcRequestConfig) => QcRequestConfig;
export declare type BuildRequestConfigFunction<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>> = BuildRequestConfigMiddleware<CommonConfigType, ModelMapType>;
export declare type BuildRequestConfig<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>> = BuildRequestConfigFunction<CommonConfigType, ModelMapType> | BuildRequestConfigMiddleware<CommonConfigType, ModelMapType>[];
export declare type QueryBuilderDefinition<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>> = {
    queryRunner?: string | SimpleQueryRunner;
    buildRequestConfig: BuildRequestConfig<CommonConfigType, ModelMapType>;
};
export declare type QueryBuilderMap<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>> = {
    defaultBuilder: QueryBuilderDefinition<CommonConfigType, ModelMapType>;
    [s: string]: QueryBuilderDefinition<CommonConfigType, ModelMapType> | undefined;
};
export interface QuerchyDefinition<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, QueryBuilderMapType extends QueryBuilderMap<CommonConfigType, ModelMapType>, ExtraActionCreatorsType extends ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType>> {
    namespace?: string;
    commonConfig: CommonConfigType;
    models: ModelMapType;
    baseSelector: BaseSelector<ModelMapType>;
    queryBuilders: QueryBuilderMapType;
    extraActionCreators?: ExtraActionCreatorsType;
}
export declare type QcDependencies<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, QueryBuilderMapType extends QueryBuilderMap<CommonConfigType, ModelMapType>, ExtraActionCreatorsType extends ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType>, QuerchyDefinitionType extends QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType>, ExtraDependencies = any> = ExtraDependencies & {
    querchyDef: QuerchyDefinitionType;
};
export declare const INIT_FUNC: unique symbol;
export declare type InitFunctionKeyType = typeof INIT_FUNC;
export declare type ActionCreatorsInitFunction<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>> = (models: ModelMapType, args: any) => void;
export interface ExtraActionCreatorsLike {
    queryInfos: {
        [s: string]: ExtraQueryInfo<any, Function>;
    };
    actionInfos: {
        [s: string]: ExtraActionInfo<any, Function>;
    };
    actionTypes?: {
        [s: string]: string;
    };
    actions?: {
        [s: string]: StartQueryActionCreatorWithProps<{}>;
    };
}
export interface ExtraActionCreators<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, QueryBuilderMapType extends QueryBuilderMap<CommonConfigType, ModelMapType>> extends ExtraActionCreatorsLike {
    [INIT_FUNC]: ActionCreatorsInitFunction<CommonConfigType, ModelMapType>;
}
export declare type ModelQueryActionCreatorSet<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, ExtraActionCreatorsType extends ExtraActionCreatorsLike> = {
    [P in keyof ModelMapType]: Required<Required<ModelMapType[P]>['actions']>;
} & {
    extra: Required<Required<ExtraActionCreatorsType>['actions']>;
} & {
    [s: string]: QcActionCreator;
};
export declare type ActionCreatorSets<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, ExtraActionCreatorsType extends ExtraActionCreatorsLike> = ModelQueryActionCreatorSet<CommonConfigType, ModelMapType, ExtraActionCreatorsType>;
export declare type ModelPromiseQueryActionCreatorSet<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, ExtraActionCreatorsType extends ExtraActionCreatorsLike> = {
    [P in keyof ModelMapType]: ResourceModelQueryActions<Required<ModelMapType[P]>['queryInfos']>;
} & {
    extra: ResourceModelQueryActions<Required<ExtraActionCreatorsType>['queryInfos']>;
} & {
    [s: string]: QcActionCreator;
};
export declare type PromiseActionCreatorSets<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, ExtraActionCreatorsType extends ExtraActionCreatorsLike> = ModelQueryActionCreatorSet<CommonConfigType, ModelMapType, ExtraActionCreatorsType>;
