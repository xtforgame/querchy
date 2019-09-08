import { ResourceMerger, ResourceState, ResourceChange } from '../../common/interfaces';
import { QcBasicAction, ResourceModelQueryActionOptions } from '../../core/interfaces';
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
export declare type GetResourceChange = (state: ResourceState, action: QcBasicAction) => ResourceChange | null;
export declare const changeResourceMerger: (updateType: string, getResourceChange: GetResourceChange) => ResourceMerger<QcBasicAction>;
