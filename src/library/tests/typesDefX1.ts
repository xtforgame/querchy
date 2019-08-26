import {
  CommonConfig,
  QueryBuilderDefinition,
  QcStore,

  SimpleQueryRunner,

  ResourceModelQueryActionOptions,
  QueryInfo,
  ExtraQueryInfo,
  ExtraActionInfo,

  BaseSelector,
} from '../index';

import {
  ActionInfosT1,
  QueryInfosT1,
} from '../templates/builtin-t1';

import {
  MakeResourceModelType,
  TypeHelperClass,
} from '../type-helpers';

export interface CommonConfigX1 extends CommonConfig {
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

export type ActionInfosX1 = ActionInfosT1;

export type QueryInfosX1 = QueryInfosT1 & {
  getCollection: QueryInfo<RawActionCreatorGetCollection>;
};

export type RawActionCreatorUpdateCacheExtra = (
  cacheChange: any, options?: ResourceModelQueryActionOptions,
) => {
  cacheChange: any;
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type ModelMapX1 = {
  httpBinRes: MakeResourceModelType<CommonConfigX1, QueryInfosT1, ActionInfosT1>;
  httpBinRes2: MakeResourceModelType<CommonConfigX1, QueryInfosX1, ActionInfosX1>;
};

export type QueryBuilderMapX1 = {
  defaultBuilder : QueryBuilderDefinition<CommonConfigX1, ModelMapX1>;
  customPath : QueryBuilderDefinition<CommonConfigX1, ModelMapX1>;
  forExtra : QueryBuilderDefinition<CommonConfigX1, ModelMapX1>;
} & {
  [s : string] : QueryBuilderDefinition<CommonConfigX1, ModelMapX1>;
};

export type RawActionCreatorExtraActionX1 = (
  options?: ResourceModelQueryActionOptions,
) => {
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type ExtraQueryInfosT1 = {
  extraQuery1: ExtraQueryInfo<ModelMapX1, RawActionCreatorExtraActionX1>;
};

export type ExtraActionInfosT1 = {
  updateCacheExtra: ExtraActionInfo<ModelMapX1, RawActionCreatorUpdateCacheExtra>;
};

// ===========================================

export type ExtraSelectorInfosForModelT1 = {
  httpBinRes: {
    sss: {
      creatorCreator: (baseSelector : BaseSelector<ModelMapX1>) => () => () => string,
    },
  },
};

// ===========================================

export const typeHelperClassX1 = new TypeHelperClass<
  CommonConfigX1,
  ModelMapX1,
  QueryBuilderMapX1,
  ExtraQueryInfosT1,
  ExtraActionInfosT1,

  any, // ExtraDependenciesX1,
  any, // MyStateX1
  ExtraSelectorInfosForModelT1
>();

export type Types = (typeof typeHelperClassX1)['Types'];

export type MyQcStoreX1 = QcStore<Types['StateType']>;
