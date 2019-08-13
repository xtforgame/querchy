import {
  ResourceMetadata,
  Merger,
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

export const resMerger : Merger<QcBasicAction> = (
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
  return {
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
};

export const basicQueryInfos : QueryInfosT1 = {
  create: {
    actionCreator: (data, options?) => ({ data, options }),
    mergerCreator: resMerger,
  },
  read: {
    actionCreator: (resourceId, options?) => ({ resourceId, options }),
    mergerCreator: resMerger,
  },
  update: {
    actionCreator: (resourceId, data, options?) => ({ resourceId, data, options }),
    mergerCreator: resMerger,
  },
  delete: {
    actionCreator: (resourceId, options?) => ({ resourceId, options }),
    mergerCreator: resMerger,
  },
};

export const basicActionInfos : ActionInfosT1 = {
  updateCache: {
    actionCreator: (cacheChange, options?) => ({ cacheChange, options }),
  },
};
