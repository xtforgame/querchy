import { ResourceMerger, ResourceState } from '../../common/interfaces';
import { QcBasicAction, ResourceModelQueryActionOptions, QueryInfo, CommonConfig, ModelMap, BuildRequestConfigMiddleware } from '../../core/interfaces';
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
export declare type ResourceChange = {
    update?: {
        [s: string]: any;
    };
    delete?: string[];
};
export declare type ParseResponse = (state: ResourceState, action: QcBasicAction) => ResourceChange;
export default class CollectionT1 {
    static crudToRestMap(crudName: any): any;
    parseResource: ParseResponse;
    onError: (error: Error, state: ResourceState, action: QcBasicAction) => any;
    constructor(parseResource?: ParseResponse);
    Types: Types;
    resourceMerger: ResourceMerger<QcBasicAction>;
    getQueryInfos: () => QueryInfosT1;
    getActionInfos: () => ActionInfosT1;
    getBuildRequestConfigMiddleware: <CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>>() => BuildRequestConfigMiddleware<CommonConfigType, ModelMapType>;
}
