import {
  QcTimestamp,
} from '../../common/interfaces';

import {
  QcRequestAction,
  ResourceModelQueryActionOptions,
} from '../../core/crud-sub-action-interfaces';

export type ModelQueryActionCreatorUpdateCache = (
  cacheId : string,
  newCache : any,
  options?: ResourceModelQueryActionOptions,
) => UpdateCacheAction;

export interface UpdateCacheAction extends QcRequestAction {
  cacheId : string;
  newCache : any;
  options?: ResourceModelQueryActionOptions;
  updateCacheTimestamp : QcTimestamp;

  actionCreator : ModelQueryActionCreatorUpdateCache & {
    actionType: string;
  };
  [s : string] : any;
}

//

export interface SomeCacheChange {
}
