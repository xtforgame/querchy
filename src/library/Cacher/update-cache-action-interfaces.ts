import {
  QcTimestamp,
} from '../common/interfaces';

import {
  QcRequestAction,
  ResourceModelQueryActionOptions,
} from '../core/crud-sub-action-interfaces';

export interface QcCacheChange {
}

export type UpdateCacheActionCreator = (
  cacheChange : QcCacheChange,
) => QcUpdateCacheAction;

export interface QcUpdateCacheAction extends QcRequestAction {
  cacheChange : QcCacheChange;
  updateCacheTimestamp : QcTimestamp;

  actionCreator : ModelQueryActionCreatorUpdateCache & {
    actionType: string;
  };
  [s : string] : any;
}

export type ModelQueryActionCreatorUpdateCache = (
  cacheChange : QcCacheChange, options?: ResourceModelQueryActionOptions,
) => QcUpdateCacheAction;
