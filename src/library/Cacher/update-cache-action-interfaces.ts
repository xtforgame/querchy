import {
  RunnerType,
  QcTimestamp,
  QcAction,
  QcActionCreator,
} from '~/common/interfaces';

import {
  QcRequestAction,
  ActionCreatorWithProps,
  ResourceModelActionsOptions,
} from '~/core/crud-sub-action-interfaces';

export interface QcCacheChange {
}

export type UpdateCacheActionCreator = (
  cacheChange : QcCacheChange,
) => QcUpdateCacheAction;

export interface QcUpdateCacheAction extends QcRequestAction {
  cacheChange : QcCacheChange;
  updateCacheTimestamp : QcTimestamp;

  actionCreator : ModelActionCreatorUpdateCache & {
    actionType: string;
  };
  [s : string] : any;
}

export type ModelActionCreatorUpdateCache = (
  cacheChange : QcCacheChange, options?: ResourceModelActionsOptions,
) => QcUpdateCacheAction;
