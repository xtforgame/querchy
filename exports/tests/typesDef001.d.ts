import { CommonConfig, QueryBuilderDefinition, QcStore, SimpleQueryRunner, ResourceModelQueryActionOptions, QueryInfo, ExtraQueryInfo, ExtraActionInfo } from '../index';
import { ActionInfosT1, QueryInfosT1 } from '../templates/builtin-t1';
import { MakeResourceModelType, TypeHelperClass } from '../type-helpers';
export interface CommonConfig001 extends CommonConfig {
    queryRunners: {
        customRunner: SimpleQueryRunner;
    };
}
export declare type RawActionCreatorGetCollection = (options?: ResourceModelQueryActionOptions) => {
    options?: ResourceModelQueryActionOptions;
    [s: string]: any;
};
export declare type ActionInfosXxx = ActionInfosT1;
export declare type QueryInfosXxx = QueryInfosT1 & {
    getCollection: QueryInfo<RawActionCreatorGetCollection>;
};
export declare type RawActionCreatorUpdateCacheExtra = (cacheChange: any, options?: ResourceModelQueryActionOptions) => {
    cacheChange: any;
    options?: ResourceModelQueryActionOptions;
    [s: string]: any;
};
export declare type QcModelMap001 = {
    httpBinRes: MakeResourceModelType<CommonConfig001, QueryInfosT1, ActionInfosT1>;
    httpBinRes2: MakeResourceModelType<CommonConfig001, QueryInfosXxx, ActionInfosXxx>;
};
export declare type QcQueryBuilderMap001 = {
    defaultBuilder: QueryBuilderDefinition<CommonConfig001, QcModelMap001>;
    customPath: QueryBuilderDefinition<CommonConfig001, QcModelMap001>;
    forExtra: QueryBuilderDefinition<CommonConfig001, QcModelMap001>;
} & {
    [s: string]: QueryBuilderDefinition<CommonConfig001, QcModelMap001>;
};
export declare type RawActionCreatorExtraAction1 = (options?: ResourceModelQueryActionOptions) => {
    options?: ResourceModelQueryActionOptions;
    [s: string]: any;
};
export declare type ExtraQueryInfosT1 = {
    extraQuery1: ExtraQueryInfo<QcModelMap001, RawActionCreatorExtraAction1>;
};
export declare type ExtraActionInfosT1 = {
    updateCacheExtra: ExtraActionInfo<QcModelMap001, RawActionCreatorUpdateCacheExtra>;
};
export declare const typeHelperClass001: TypeHelperClass<CommonConfig001, QcModelMap001, QcQueryBuilderMap001, ExtraQueryInfosT1, ExtraActionInfosT1, any, any>;
export declare type Types = (typeof typeHelperClass001)['Types'];
export declare type MyQcStore001 = QcStore<Types['StateType']>;
