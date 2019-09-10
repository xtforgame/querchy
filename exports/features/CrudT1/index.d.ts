import { ResourceMerger, ResourceState } from '../../common/interfaces';
import { QcBasicAction, ResourceModelQueryActionOptions, ResourceModel, QueryInfo, CommonConfig, ModelMap, BuildRequestConfigMiddleware, Feature } from '../../core/interfaces';
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
export default class CrudT1 implements Feature<Types> {
    Types: Types;
    onError: (error: Error, state: ResourceState, action: QcBasicAction) => any;
    constructor();
    getResourceId: <CommonConfigType extends CommonConfig, ResourceModelType extends ResourceModel<CommonConfigType>>(resourceModel: ResourceModelType) => GetResourceId;
    resourceMerger: <CommonConfigType extends CommonConfig, ResourceModelType extends ResourceModel<CommonConfigType>>(resourceModel: ResourceModelType) => ResourceMerger<QcBasicAction>;
    getBuildRequestConfigMiddleware: <CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>>() => BuildRequestConfigMiddleware<CommonConfigType, ModelMapType>;
    getQueryInfos: <CommonConfigType extends CommonConfig, ResourceModelType extends ResourceModel<CommonConfigType>>(resourceModel: ResourceModelType) => QueryInfosT1;
    getActionInfos: <CommonConfigType extends CommonConfig, ResourceModelType extends ResourceModel<CommonConfigType>>(resourceModel: ResourceModelType) => ActionInfosT1;
}
