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

export interface QcUpdateCache {
}

export type UpdateCacheActionCreator = (
  error : any,
) => QcUpdateCacheAction;

export interface QcUpdateCacheAction extends QcRequestAction {
  error : QcUpdateCache;
  errorTimestamp : QcTimestamp;

  actionCreator : ActionCreatorWithProps<{}, ModelSubActionCreatorUpdateCache>;
  [s : string] : any;
}

export type ModelSubActionCreatorUpdateCache = (
  error : any, options?: ResourceModelActionsOptions,
) => QcUpdateCacheAction;
