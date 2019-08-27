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
} from 'library/index';

import { Types as CrudT1Types } from 'library/features/CrudT1';
import { Types as UpdateCacheT1Types } from 'library/features/UpdateCacheT1';
import { Types as CollectionT1Types } from 'library/features/CollectionT1';

import {
  MakeResourceModelType,
  TypeHelperClass,
} from 'library/type-helpers';

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

export type ModelMapX1 = {
  httpBinRes: MakeResourceModelType<
    CommonConfigX1,
    CrudT1Types['QueryInfos']
      & UpdateCacheT1Types['QueryInfos'],
    CrudT1Types['ActionInfos']
      & UpdateCacheT1Types['ActionInfos']
  >;
  httpBinRes2: MakeResourceModelType<
    CommonConfigX1,
    CrudT1Types['QueryInfos']
      & UpdateCacheT1Types['QueryInfos']
      & CollectionT1Types['QueryInfos'],
    CrudT1Types['ActionInfos']
      & UpdateCacheT1Types['ActionInfos']
      & CollectionT1Types['ActionInfos']
      & {
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

export type ExtraQueryInfosX1 = {
  extraQuery1: ExtraQueryInfo<ModelMapX1, RawActionCreatorExtraQueryX1>;
};

export type ExtraActionInfosX1 = {
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
  ExtraQueryInfosX1,
  ExtraActionInfosX1,

  any, // ExtraDependenciesX1,
  any, // MyStateX1
  ExtraSelectorInfosForModelX1
>();

export type Types = (typeof typeHelperClassX1)['Types'];

export type StoreX1 = QcStore<Types['StateType']>;

// ===========================================

// just for demonstrating how to do inheritance

export class AxiosRunnerX1 extends typeHelperClassX1.GetAxiosRunnerClass() {}

export class QuerchyX1 extends typeHelperClassX1.GetQuerchyClass() {}

export class CacherX1 extends typeHelperClassX1.GetCacherClass() {
  // reduce(action: QcAction, state: any) : any {
  //   return super.reduce(action, state);
  // }
}
