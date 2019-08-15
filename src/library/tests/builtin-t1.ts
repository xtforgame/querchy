import {
  ResourceMetadata,
  ResourceMerger,
  QcBasicAction,
  ResourceModelQueryActionOptions,
  ActionInfo,
  QueryInfo,
} from '~/index';

export const crudToRestMap = {
  create: 'post',
  read: 'get',
  update: 'patch',
  delete: 'delete',
};

export type RawActionCreatorCreateT1 = (
  data: any, options?: ResourceModelQueryActionOptions,
) => {
  data: any;
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type RawActionCreatorReadT1 = (
  resourceId: any, options?: ResourceModelQueryActionOptions,
) => {
  resourceId: any;
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type RawActionCreatorUpdateT1 = (
  resourceId: any, data: any, options?: ResourceModelQueryActionOptions,
) => {
  resourceId: any;
  data: any;
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type RawActionCreatorDeleteT1 = (
  resourceId: any, options?: ResourceModelQueryActionOptions,
) => {
  resourceId: any;
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type RawActionCreatorUpdateCacheT1 = (
  cacheChange: any, options?: ResourceModelQueryActionOptions,
) => {
  cacheChange: any;
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

// ===============================================================

export type QueryInfosT1 = {
  create: QueryInfo<RawActionCreatorCreateT1>;
  read: QueryInfo<RawActionCreatorReadT1>;
  update: QueryInfo<RawActionCreatorUpdateT1>;
  delete: QueryInfo<RawActionCreatorDeleteT1>;
};

export type ActionInfosT1 = {
  updateCache: ActionInfo<RawActionCreatorUpdateCacheT1>;
};

// ===============================================================

export const resMerger : ResourceMerger<QcBasicAction> = (
  state = {
    metadataMap: {},
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

  const { metadataMap } = state;

  const metadata : ResourceMetadata = {
    lastRequest: {
      ...(metadataMap[resourceId] && metadataMap[resourceId].lastRequest),
      requestTimestamp: action.requestTimestamp,
      responseTimestamp: action.responseTimestamp,
    },
  };
  const result = {
    ...state,
    metadataMap: {
      ...metadataMap,
      [resourceId]: metadata,
    },
    resourceMap: {
      ...state.resourceMap,
      [resourceId]: action.response.data,
    },
  };
  if (action.crudType === 'delete') {
    delete result.metadataMap[resourceId];
    delete result.resourceMap[resourceId];
  }
  return result;
};

export const resMergerForColl : ResourceMerger<QcBasicAction> = (
  state = {
    metadataMap: {},
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

  const { metadataMap } = state;

  const metadata : ResourceMetadata = {
    lastRequest: {
      ...(metadataMap[resourceId] && metadataMap[resourceId].lastRequest),
      requestTimestamp: action.requestTimestamp,
      responseTimestamp: action.responseTimestamp,
    },
  };
  const result = {
    ...state,
    metadataMap: {
      ...metadataMap,
      [resourceId]: metadata,
      '2': metadata,
    },
    resourceMap: {
      ...state.resourceMap,
      [resourceId]: action.response.data,
      '2': action.response.data,
    },
  };
  if (action.crudType === 'delete') {
    delete result.metadataMap[resourceId];
    delete result.resourceMap[resourceId];
  }
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
