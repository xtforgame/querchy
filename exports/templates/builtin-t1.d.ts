import { ResourceModelQueryActionOptions, ActionInfo, QueryInfo } from '../core/interfaces';
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
export declare type RawActionCreatorUpdateCacheT1 = (cacheChange: any, options?: ResourceModelQueryActionOptions) => {
    cacheChange: any;
    options?: ResourceModelQueryActionOptions;
    [s: string]: any;
};
export declare type QueryInfosT1 = {
    create: QueryInfo<RawActionCreatorCreateT1>;
    read: QueryInfo<RawActionCreatorReadT1>;
    update: QueryInfo<RawActionCreatorUpdateT1>;
    delete: QueryInfo<RawActionCreatorDeleteT1>;
};
export declare type ActionInfosT1 = {
    updateCache: ActionInfo<RawActionCreatorUpdateCacheT1>;
};
