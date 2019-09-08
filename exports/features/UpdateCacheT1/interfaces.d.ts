import { ResourceUpdate, ResourceDelete, ResourceChange } from '../../common/interfaces';
import { ResourceModelQueryActionOptions } from '../../core/crud-sub-action-interfaces';
export declare type ModelActionCreatorUpdateCache = (resourceId: string, value: any, options?: ResourceModelQueryActionOptions) => UpdateCacheAction;
export interface UpdateCacheAction {
    resourceId: string;
    value: any;
    options?: any;
    [s: string]: any;
}
export declare type ModelActionCreatorUpdateSomeCache = (update: ResourceUpdate, options?: ResourceModelQueryActionOptions) => UpdateSomeCacheAction;
export interface UpdateSomeCacheAction {
    update: ResourceUpdate;
    options?: any;
    [s: string]: any;
}
export declare type ModelActionCreatorClearCache = (resourceId: string, options?: ResourceModelQueryActionOptions) => ClearCacheAction;
export interface ClearCacheAction {
    resourceId: string;
    options?: any;
    [s: string]: any;
}
export declare type ModelActionCreatorClearSomeCache = (deleteIds: ResourceDelete, options?: ResourceModelQueryActionOptions) => ClearSomeCacheAction;
export interface ClearSomeCacheAction {
    delete: ResourceDelete;
    options?: any;
    [s: string]: any;
}
export declare type ModelActionCreatorClearAllCache = (options?: ResourceModelQueryActionOptions) => ClearAllCacheAction;
export interface ClearAllCacheAction {
    options?: any;
    [s: string]: any;
}
export declare type ModelActionCreatorChangeSomeCache = (change: ResourceChange, options?: ResourceModelQueryActionOptions) => ChangeSomeCacheAction;
export interface ChangeSomeCacheAction {
    change: ResourceChange;
    options?: any;
    [s: string]: any;
}
