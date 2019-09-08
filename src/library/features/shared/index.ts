import {
  ResourceMetadata,
  ResourceStateQueryMap,
  ResourceStateResourceMap,
  ResourceMerger,
  ResourceState,

  ResourceUpdate,
  ResourceDelete,
  ResourceChange,
} from '../../common/interfaces';
import {
  QcBasicAction,
  ResourceModelQueryActionOptions,
  ResourceModel,
  // ActionInfo,
  QueryInfo,
  CommonConfig,
  ModelMap,
  BuildRequestConfigMiddleware,
  Feature,
  FeatureForModel,
} from '../../core/interfaces';
import {
  createEmptyResourceState,
  mergeResourceState,
} from '../../utils';

export const crudToRestMap = {
  getCollection: 'get',
};

export type RawActionCreatorGetCollectionT1 = (
  options?: ResourceModelQueryActionOptions,
) => {
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type RawActionCreatorGetByIdsT1 = (
  ids: string[],
  options?: ResourceModelQueryActionOptions,
) => {
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

// ===============================================================

export type GetResourceChange = (
  state : ResourceState,
  action : QcBasicAction,
) => ResourceChange | null;

export const changeResourceMerger : (
  updateType : string,
  getResourceChange : GetResourceChange,
) => ResourceMerger<QcBasicAction> = (
  updateType : string,
  getResourceChange : GetResourceChange,
) => (
  state = createEmptyResourceState(),
  action,
) => {
  const resourceChange = getResourceChange(state, action);
  if (!resourceChange) {
    return state;
  }
  const { queryMap, resourceMap } = state;

  const extraQueryMap : ResourceStateQueryMap = {
    metadata: {},
    values: {},
  };
  const queryId = action.queryId;
  if (queryId) {
    extraQueryMap.metadata[queryId] = {
      ...(queryMap[queryId] && queryMap[queryId].metadata.lastRequest),
      queryId,
      requestTimestamp: action.requestTimestamp,
      responseTimestamp: action.responseTimestamp,
    };
    extraQueryMap.values[queryId] = action.response.data;
  }

  const extraResourceMap : ResourceStateResourceMap = {
    metadata: {},
    values: {},
  };
  if (queryId) {
    const update = resourceChange.update || {};
    Object.keys(update)
    .forEach((key) => {
      extraResourceMap.metadata[key] = {
        ...(resourceMap[queryId] && resourceMap[queryId].metadata.lastRequest),
        lastUpdate: {
          updateType,
          updateData: update[key],
          updateTimestamp: action.responseTimestamp,
        },
      };
      extraResourceMap.values[key] = update[key];
    });
    const deleteIds = resourceChange.delete || [];
    deleteIds.forEach((deleteId) => {
      extraResourceMap.metadata[deleteId] = {
        ...(resourceMap[queryId] && resourceMap[queryId].metadata.lastRequest),
        lastUpdate: {
          updateType,
          updateData: update[deleteId],
          updateTimestamp: action.responseTimestamp,
        },
      };
      delete extraResourceMap.values[deleteId];
    });
  }
  const result = mergeResourceState(
    state,
    {
      queryMap: extraQueryMap,
      resourceMap: extraResourceMap,
    },
  );
  return result;
};
