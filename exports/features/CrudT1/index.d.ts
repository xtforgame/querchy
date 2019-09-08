import { ResourceMerger, ResourceState } from '../../common/interfaces';
import { QcBasicAction, ResourceModelQueryActionOptions, ResourceModel, QueryInfo, CommonConfig, ModelMap, BuildRequestConfigMiddleware, Feature, FeatureForModel } from '../../core/interfaces';
export declare const crudToRestMap: {
    create: string;
    read: string;
    update: string;
    delete: string;
};
export declare type RawActionCreatorCreateT1 = (data: any, options?: ResourceModelQueryActionOptions) => {
    data: any;
    options?: ResourceModelQueryActionOptions;
    [s: string]: any;
};
export declare type RawActionCreatorReadT1 = (resourceId: any, options?: ResourceModelQueryActionOptions) => {
    resourceId: any;
    options?: ResourceModelQueryActionOptions;
    [s: string]: any;
};
export declare type RawActionCreatorUpdateT1 = (resourceId: any, data: any, options?: ResourceModelQueryActionOptions) => {
    resourceId: any;
    data: any;
    options?: ResourceModelQueryActionOptions;
    [s: string]: any;
};
export declare type RawActionCreatorDeleteT1 = (resourceId: any, options?: ResourceModelQueryActionOptions) => {
    resourceId: any;
    options?: ResourceModelQueryActionOptions;
    [s: string]: any;
};
export declare type QueryInfosT1 = {
    create: QueryInfo<RawActionCreatorCreateT1>;
    read: QueryInfo<RawActionCreatorReadT1>;
    update: QueryInfo<RawActionCreatorUpdateT1>;
    delete: QueryInfo<RawActionCreatorDeleteT1>;
};
export declare type ActionInfosT1 = {};
export declare type Types = {
    RawActionCreatorCreate: RawActionCreatorCreateT1;
    RawActionCreatorRead: RawActionCreatorReadT1;
    RawActionCreatorUpdate: RawActionCreatorUpdateT1;
    RawActionCreatorDelete: RawActionCreatorDeleteT1;
    ActionInfos: ActionInfosT1;
    QueryInfos: QueryInfosT1;
};
export declare type GetResourceId = (state: ResourceState, action: QcBasicAction) => string | void;
export declare type GetBuildRequestConfigMiddleware<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>> = () => BuildRequestConfigMiddleware<CommonConfigType, ModelMapType>;
declare class CrudForModelT1 implements FeatureForModel<Types> {
    resourceModel: ResourceModel;
    getResourceId: GetResourceId;
    onError: (error: Error, state: ResourceState, action: QcBasicAction) => any;
    constructor(resourceModel: ResourceModel);
    Types: Types;
    resourceMerger: ResourceMerger<QcBasicAction>;
    getQueryInfos: () => QueryInfosT1;
    getActionInfos: () => ActionInfosT1;
}
export default class CrudT1 implements Feature<Types> {
    Types: Types;
    getFeatureForModel: (resourceModel: ResourceModel<CommonConfig>) => CrudForModelT1;
    getBuildRequestConfigMiddleware: <CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>>() => BuildRequestConfigMiddleware<CommonConfigType, ModelMapType>;
}
export {};
