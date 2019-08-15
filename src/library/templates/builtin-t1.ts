import {
  ResourceModelQueryActionOptions,
  ActionInfo,
  QueryInfo,
} from '../core/interfaces';

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
