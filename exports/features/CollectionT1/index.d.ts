import { ResourceState, ResourceChange } from '../../common/interfaces';
import { QcBasicAction, ResourceModelQueryActionOptions, ResourceModel, QueryInfo, CommonConfig, ModelMap, BuildRequestConfigMiddleware, Feature, FeatureForModel } from '../../core/interfaces';
import { GetResourceChange } from '../shared';
export declare const crudToRestMap: {
    getCollection: string;
};
export declare type RawActionCreatorGetCollectionT1 = (options?: ResourceModelQueryActionOptions) => {
    options?: ResourceModelQueryActionOptions;
    [s: string]: any;
};
export declare type RawActionCreatorGetByIdsT1 = (ids: string[], options?: ResourceModelQueryActionOptions) => {
    options?: ResourceModelQueryActionOptions;
    [s: string]: any;
};
export declare type QueryInfosT1 = {
    getCollection: QueryInfo<RawActionCreatorGetCollectionT1>;
    getByIds: QueryInfo<RawActionCreatorGetByIdsT1>;
};
export declare type ActionInfosT1 = {};
export declare type Types = {
    RawActionCreatorGetCollection: RawActionCreatorGetCollectionT1;
    ActionInfos: ActionInfosT1;
    QueryInfos: QueryInfosT1;
};
export declare type ParseResponse = (state: ResourceState, action: QcBasicAction) => ResourceChange;
declare class CollectionForModelT1 implements FeatureForModel<Types> {
    resourceModel: ResourceModel;
    parseResponse: ParseResponse;
    onError: (error: Error, state: ResourceState, action: QcBasicAction) => any;
    constructor(resourceModel: ResourceModel);
    Types: Types;
    getResourceChange: GetResourceChange;
    getQueryInfos: () => QueryInfosT1;
    getActionInfos: () => ActionInfosT1;
}
export default class CollectionT1 implements Feature<Types> {
    Types: Types;
    getFeatureForModel: (resourceModel: ResourceModel<CommonConfig>) => CollectionForModelT1;
    getBuildRequestConfigMiddleware: <CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>>() => BuildRequestConfigMiddleware<CommonConfigType, ModelMapType>;
}
export {};
