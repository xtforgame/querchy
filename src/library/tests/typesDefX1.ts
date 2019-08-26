import {
  CommonConfig,
  QueryBuilderDefinition,
  QcStore,

  SimpleQueryRunner,

  ResourceModelQueryActionOptions,
  QueryInfo,
  ActionInfo,
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

export type RawActionCreatorUpdateCacheX1 = (
  cacheChange: any, options?: ResourceModelQueryActionOptions,
) => {
  cacheChange: any;
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type RawActionCreatorGetCollection = (
  options?: ResourceModelQueryActionOptions,
) => {
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type ModelMapX1 = {
  httpBinRes: MakeResourceModelType<CommonConfigX1, QueryInfosT1, ActionInfosT1>;
  httpBinRes2: MakeResourceModelType<
    CommonConfigX1,
    QueryInfosT1 & {
      getCollection: QueryInfo<RawActionCreatorGetCollection>;
    },
    ActionInfosT1 & {
      updateCache2: ActionInfo<RawActionCreatorUpdateCacheX1>;
    }
  >;
};

export type QueryBuilderMapX1 = {
  defaultBuilder : QueryBuilderDefinition<CommonConfigX1, ModelMapX1>;
  customPath : QueryBuilderDefinition<CommonConfigX1, ModelMapX1>;
  forExtra : QueryBuilderDefinition<CommonConfigX1, ModelMapX1>;
} & {
  [s : string] : QueryBuilderDefinition<CommonConfigX1, ModelMapX1>;
};

export type RawActionCreatorExtraQueryX1 = (
  options?: ResourceModelQueryActionOptions,
) => {
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type RawActionCreatorExtraActionX1 = (
  cacheChange: any, options?: ResourceModelQueryActionOptions,
) => {
  cacheChange: any;
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type ExtraQueryInfosT1 = {
  extraQuery1: ExtraQueryInfo<ModelMapX1, RawActionCreatorExtraQueryX1>;
};

export type ExtraActionInfosT1 = {
  extraAction1: ExtraActionInfo<ModelMapX1, RawActionCreatorExtraActionX1>;
};

// ===========================================

export type ExtraSelectorInfosForModelX1 = {
  httpBinRes: {
    extraSelectorX1: {
      creatorCreator: (baseSelector : BaseSelector<ModelMapX1>) => () => (state : any) => string,
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
  ExtraSelectorInfosForModelX1
>();

export type Types = (typeof typeHelperClassX1)['Types'];

export type QcStoreX1 = QcStore<Types['StateType']>;
