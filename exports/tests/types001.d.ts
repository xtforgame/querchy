import { Epic } from 'pure-epic';
import { CommonConfig, ResourceModel, QuerchyDefinition, QueryBuilderDefinition, QcAction, QcStore, QcDependencies, INIT_FUNC, ActionCreatorsInitFunction, SimpleQueryRunner, Querchy, AxiosRunner, Cacher, ResourceModelActions, ResourceModelActionTypes, ResourceModelQueryActionOptions, ResourceModelQueryActions, QueryInfo, ExtraQueryInfo, ExtraActionInfo } from '~/index';
import { ActionInfosT1, QueryInfosT1 } from '~/templates/builtin-t1';
export interface CommonConfig001 extends CommonConfig {
    defaultQueryRunner: SimpleQueryRunner;
    queryRunners: {
        customRunner: SimpleQueryRunner;
        [s: string]: SimpleQueryRunner;
    };
    [s: string]: any;
}
export declare type RawActionCreatorGetCollection = (options?: ResourceModelQueryActionOptions) => {
    options?: ResourceModelQueryActionOptions;
    [s: string]: any;
};
export declare type ActionInfosXxx = ActionInfosT1;
export declare type QueryInfosXxx = QueryInfosT1 & {
    getCollection: QueryInfo<RawActionCreatorGetCollection>;
};
export declare type ResourceModel001<CommonConfigType extends CommonConfig> = ResourceModel<CommonConfigType> & {
    queryInfos: QueryInfosT1;
    actionInfos: ActionInfosT1;
    actionTypes?: ResourceModelActionTypes<ResourceModelQueryActions<Required<QueryInfosT1>>> & ResourceModelActionTypes<ResourceModelActions<Required<ActionInfosT1>>>;
    actions?: ResourceModelQueryActions<Required<QueryInfosT1>> & ResourceModelActions<Required<ActionInfosT1>>;
};
export declare type ResourceModelXxx<CommonConfigType extends CommonConfig> = ResourceModel<CommonConfigType> & {
    queryInfos: QueryInfosXxx;
    actionInfos: ActionInfosXxx;
    actionTypes?: ResourceModelActionTypes<ResourceModelQueryActions<Required<QueryInfosXxx>>> & ResourceModelActionTypes<ResourceModelActions<Required<ActionInfosXxx>>>;
    actions?: ResourceModelQueryActions<Required<QueryInfosXxx>> & ResourceModelActions<Required<ActionInfosXxx>>;
};
export declare type QcModelMap001 = {
    httpBinRes: ResourceModel001<CommonConfig001>;
    httpBinRes2: ResourceModelXxx<CommonConfig001>;
};
export declare type QcQueryBuilderMap001 = {
    defaultBuilder: QueryBuilderDefinition<CommonConfig001, QcModelMap001>;
    customPath: QueryBuilderDefinition<CommonConfig001, QcModelMap001>;
    forExtra: QueryBuilderDefinition<CommonConfig001, QcModelMap001>;
};
export declare type RawActionCreatorExtraAction1 = (options?: ResourceModelQueryActionOptions) => {
    options?: ResourceModelQueryActionOptions;
    [s: string]: any;
};
export declare type ExtraQueryInfoT1 = {
    extraQuery1: ExtraQueryInfo<QcModelMap001, RawActionCreatorExtraAction1>;
};
export declare type RawActionCreatorUpdateCacheExtra = (cacheChange: any, options?: ResourceModelQueryActionOptions) => {
    cacheChange: any;
    options?: ResourceModelQueryActionOptions;
    [s: string]: any;
};
export declare type ExtraActionInfoT1 = {
    updateCacheExtra: ExtraActionInfo<QcModelMap001, RawActionCreatorUpdateCacheExtra>;
};
export declare type QcExtraActionCreatorsT1 = {
    [INIT_FUNC]: ActionCreatorsInitFunction<CommonConfig001, QcModelMap001>;
    queryInfos: ExtraQueryInfoT1;
    actionInfos: ExtraActionInfoT1;
    actionTypes?: ResourceModelActionTypes<ResourceModelQueryActions<Required<ExtraQueryInfoT1>>> & ResourceModelActionTypes<ResourceModelActions<Required<ExtraActionInfoT1>>>;
    actions?: ResourceModelQueryActions<Required<ExtraQueryInfoT1>> & ResourceModelActions<Required<ExtraActionInfoT1>>;
};
export declare type QuerchyDefinition001 = QuerchyDefinition<CommonConfig001, QcModelMap001, QcQueryBuilderMap001, QcExtraActionCreatorsT1>;
export declare type MyState001 = any;
export declare type MyQcStore001 = QcStore<MyState001>;
export declare type ExtraDependencies001 = any;
export declare class MyAxiosRunner001 extends AxiosRunner<MyState001, CommonConfig001, QcModelMap001, QcQueryBuilderMap001, QcExtraActionCreatorsT1, QuerchyDefinition001, ExtraDependencies001> {
}
export declare class MyQuerchy001 extends Querchy<CommonConfig001, QcModelMap001, QcQueryBuilderMap001, QcExtraActionCreatorsT1, QuerchyDefinition001, ExtraDependencies001> {
}
export declare type QcDependencies001 = QcDependencies<CommonConfig001, QcModelMap001, QcQueryBuilderMap001, QcExtraActionCreatorsT1, QuerchyDefinition001, ExtraDependencies001>;
export declare const createEpicMiddleware001: (...args: any[]) => {
    (_store: QcStore<any>): (next: Function) => (action: QcAction) => any;
    run(rootEpic: Epic<QcAction, QcAction, any, any>): void;
};
export declare class MyCacher001 extends Cacher<CommonConfig001, QcModelMap001, QcQueryBuilderMap001, QcExtraActionCreatorsT1, QuerchyDefinition001, ExtraDependencies001> {
    reduce(action: QcAction, state: any): any;
}
