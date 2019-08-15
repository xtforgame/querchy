import {
  CommonConfig,
  QueryBuilderDefinition,
  QcStore,

  SimpleQueryRunner,

  ResourceModelQueryActionOptions,
  QueryInfo,
  ExtraQueryInfo,
  ExtraActionInfo,
} from '../index';

import {
  ActionInfosT1,
  QueryInfosT1,
} from '../templates/builtin-t1';

import {
  MakeResourceModelType,
  TypeHelperClass,
} from '../type-helpers';

export interface CommonConfig001 extends CommonConfig {
  queryRunners: {
    customRunner: SimpleQueryRunner;
  };
}

export type RawActionCreatorGetCollection = (
  options?: ResourceModelQueryActionOptions,
) => {
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type ActionInfosXxx = ActionInfosT1;

export type QueryInfosXxx = QueryInfosT1 & {
  getCollection: QueryInfo<RawActionCreatorGetCollection>;
};

export type RawActionCreatorUpdateCacheExtra = (
  cacheChange: any, options?: ResourceModelQueryActionOptions,
) => {
  cacheChange: any;
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type QcModelMap001 = {
  httpBinRes: MakeResourceModelType<CommonConfig001, QueryInfosT1, ActionInfosT1>;
  httpBinRes2: MakeResourceModelType<CommonConfig001, QueryInfosXxx, ActionInfosXxx>;
};

export type QcQueryBuilderMap001 = {
  defaultBuilder : QueryBuilderDefinition<CommonConfig001, QcModelMap001>;
  customPath : QueryBuilderDefinition<CommonConfig001, QcModelMap001>;
  forExtra : QueryBuilderDefinition<CommonConfig001, QcModelMap001>;
} & {
  [s : string] : QueryBuilderDefinition<CommonConfig001, QcModelMap001>;
};

export type RawActionCreatorExtraAction1 = (
  options?: ResourceModelQueryActionOptions,
) => {
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type ExtraQueryInfosT1 = {
  extraQuery1: ExtraQueryInfo<QcModelMap001, RawActionCreatorExtraAction1>;
};

export type ExtraActionInfosT1 = {
  updateCacheExtra: ExtraActionInfo<QcModelMap001, RawActionCreatorUpdateCacheExtra>;
};

// ===========================================

export const typeHelperClass001 = new TypeHelperClass<
  CommonConfig001,
  QcModelMap001,
  QcQueryBuilderMap001,
  ExtraQueryInfosT1,
  ExtraActionInfosT1,

  any, // ExtraDependencies001,
  any // MyState001
>();

export type Types = (typeof typeHelperClass001)['Types'];

export type MyQcStore001 = QcStore<Types['StateType']>;
