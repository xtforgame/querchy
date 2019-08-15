import { RunnerType, QcActionCreator, ResourceMerger, GlobalMerger } from '~/common/interfaces';
import { QcBasicAction, QcRequestConfig, StartQueryActionCreatorWithProps } from './crud-sub-action-interfaces';
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
    defaultQueryRunner: SimpleQueryRunner;
    queryRunners?: {
        [s: string]: SimpleQueryRunner;
    };
    actionTypePrefix?: string;
    getActionTypeName?: (actionTypePrefix: string, queryName: string) => string;
    [s: string]: any;
};
export declare type ResourceModelActionTypes<ModelActions> = {
    [P in keyof ModelActions]: string;
};
export declare type ResourceModel<CommonConfigType extends CommonConfig> = {
    url: string;
    crudNames?: string[];
    queryInfos: {
        [s: string]: QueryInfo<Function>;
    };
    actionNames?: string[];
    actionInfos: {
        [s: string]: ActionInfo<Function>;
    };
    buildUrl?: (action: QcBasicAction) => string;
    queryBuilderName?: string;
    actionTypes?: {
        [s: string]: string;
    };
    actions?: {
        [s: string]: StartQueryActionCreatorWithProps<{}>;
    };
};
export declare type ModelMap<CommonConfigType extends CommonConfig> = {
    [s: string]: ResourceModel<CommonConfigType>;
};
export declare type BuildRequestConfigOption<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>> = {
    runnerType: RunnerType;
    commonConfig: CommonConfigType;
    models: ModelMapType;
};
export declare type BuildRequestConfig<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>> = (action: QcBasicAction, options: BuildRequestConfigOption<CommonConfigType, ModelMapType>) => QcRequestConfig;
export declare type QueryBuilderDefinition<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>> = {
    queryRunner?: string | SimpleQueryRunner;
    buildRequestConfig: BuildRequestConfig<CommonConfigType, ModelMapType>;
};
export declare type QueryBuilderMap<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>> = {
    defaultBuilder: QueryBuilderDefinition<CommonConfigType, ModelMapType>;
    [s: string]: QueryBuilderDefinition<CommonConfigType, ModelMapType> | undefined;
};
export interface QuerchyDefinition<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, QueryBuilderMapType extends QueryBuilderMap<CommonConfigType, ModelMapType>, ExtraActionCreatorsType extends ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType>> {
    commonConfig: CommonConfigType;
    models: ModelMapType;
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
export declare type ModelQueryActionCreatorSet<CommonConfigType extends CommonConfig, T extends ModelMap<CommonConfigType>, ExtraActionCreatorsType extends ExtraActionCreatorsLike> = {
    [P in keyof T]: Required<Required<T[P]>['actions']>;
} & {
    extra: Required<Required<ExtraActionCreatorsType>['actions']>;
} & {
    [s: string]: QcActionCreator;
};
export declare type ActionCreatorSets<CommonConfigType extends CommonConfig, T extends ModelMap<CommonConfigType>, ExtraActionCreatorsType extends ExtraActionCreatorsLike> = ModelQueryActionCreatorSet<CommonConfigType, T, ExtraActionCreatorsType>;
