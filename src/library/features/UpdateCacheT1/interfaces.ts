import {
  QcTimestamp,

  ResourceUpdate,
  ResourceDelete,
  ResourceChange,
} from '../../common/interfaces';

import {
  QcRequestAction,
  ResourceModelQueryActionOptions,
} from '../../core/crud-sub-action-interfaces';

// ===================================

export type ModelActionCreatorUpdateCache = (
  resourceId : string,
  value : any,
  options?: ResourceModelQueryActionOptions,
) => UpdateCacheAction;

export interface UpdateCacheAction {
  resourceId : string;
  value : any;
  options?: any; // ResourceModelQueryActionOptions;

  [s : string] : any;
}

// ===================================

export type ModelActionCreatorUpdateSomeCache = (
  update: ResourceUpdate,
  options?: ResourceModelQueryActionOptions,
) => UpdateSomeCacheAction;

export interface UpdateSomeCacheAction {
  update: ResourceUpdate;
  options?: any; // ResourceModelQueryActionOptions;

  [s : string] : any;
}

// ===================================

export type ModelActionCreatorClearCache = (
  resourceId : string,
  options?: ResourceModelQueryActionOptions,
) => ClearCacheAction;

export interface ClearCacheAction {
  resourceId : string;
  options?: any; // ResourceModelQueryActionOptions;

  [s : string] : any;
}

// ===================================

export type ModelActionCreatorClearSomeCache = (
  deleteIds: ResourceDelete,
  options?: ResourceModelQueryActionOptions,
) => ClearSomeCacheAction;

export interface ClearSomeCacheAction {
  delete: ResourceDelete;
  options?: any; // ResourceModelQueryActionOptions;

  [s : string] : any;
}
// ===================================

export type ModelActionCreatorClearAllCache = (
  options?: ResourceModelQueryActionOptions,
) => ClearAllCacheAction;

export interface ClearAllCacheAction {
  options?: any; // ResourceModelQueryActionOptions;

  [s : string] : any;
}

// ===================================

export type ModelActionCreatorChangeSomeCache = (
  change: ResourceChange,
  options?: ResourceModelQueryActionOptions,
) => ChangeSomeCacheAction;

export interface ChangeSomeCacheAction {
  change: ResourceChange;
  options?: any; // ResourceModelQueryActionOptions;

  [s : string] : any;
}
