import {
  ResourceMetadata,
  ResourceMerger,
  QcBasicAction,
} from '../index';

import {
  ActionInfosT1,
  QueryInfosT1,
} from '../templates/builtin-t1';

export const resMerger : ResourceMerger<QcBasicAction> = (
  state = {
    queryMap: {},
    resourceMap: {},
  },
  action,
) => {
  const resourceId : string = (
    action.response
    && action.response.data
    && action.response.data.args
    && action.response.data.args.id
  ) || '1';

  const { queryMap } = state;

  const metadata : ResourceMetadata = {
    lastRequest: {
      ...(queryMap[resourceId] && queryMap[resourceId].lastRequest),
      requestTimestamp: action.requestTimestamp,
      responseTimestamp: action.responseTimestamp,
    },
  };
  if (action.response) {
    metadata.lastRequest!.lastResponse = action.response;
  }
  const result = {
    ...state,
    resourceMap: {
      ...state.resourceMap,
      [resourceId]: {
        metadata,
        value: action.response.data,
      },
    },
  };
  if (action.crudType === 'delete') {
    if (result.resourceMap[resourceId]) {
      delete result.resourceMap[resourceId].value;
    }
    // delete result.resourceMap[resourceId];
  }
  return result;
};

export const resMergerForColl : ResourceMerger<QcBasicAction> = (
  state = {
    queryMap: {},
    resourceMap: {},
  },
  action,
) => {
  const resourceId : string = (
    action.response
    && action.response.data
    && action.response.data.args
    && action.response.data.args.id
  ) || '1';

  const { queryMap } = state;

  const metadata : ResourceMetadata = {
    lastRequest: {
      ...(queryMap[resourceId] && queryMap[resourceId].lastRequest),
      requestTimestamp: action.requestTimestamp,
      responseTimestamp: action.responseTimestamp,
    },
  };
  const result = {
    ...state,
    resourceMap: {
      ...state.resourceMap,
      '1': {
        metadata,
        value: action.response.data,
      },
      '2': {
        metadata,
        value: action.response.data,
      },
    },
  };
  return result;
};

export const getBasicQueryInfos : () => QueryInfosT1 = () => ({
  create: {
    actionCreator: (data, options?) => ({ data, options }),
    resourceMerger: resMerger,
  },
  read: {
    actionCreator: (resourceId, options?) => ({ resourceId, options }),
    resourceMerger: resMerger,
  },
  update: {
    actionCreator: (resourceId, data, options?) => ({ resourceId, data, options }),
    resourceMerger: resMerger,
  },
  delete: {
    actionCreator: (resourceId, options?) => ({ resourceId, options }),
    resourceMerger: resMerger,
  },
});

export const getBasicActionInfos : () => ActionInfosT1 = () => ({
  updateCache: {
    actionCreator: (cacheChange, options?) => ({ cacheChange, options }),
  },
});
