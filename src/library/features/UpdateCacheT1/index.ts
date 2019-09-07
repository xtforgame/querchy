import {
  ResourceMetadata,
  ResourceMerger,
  ResourceState,
} from '../../common/interfaces';
import {
  ResourceModelQueryActionOptions,
  ActionInfo,
  QueryInfo,
  CommonConfig,
  ModelMap,
  BuildRequestConfigMiddleware,
  QcBasicAction,
  Feature,
  FeatureForModel,
} from '../../core/interfaces';
import {
  createEmptyResourceState,
} from '../../utils';
import {
  ModelQueryActionCreatorUpdateCache,
} from './interfaces';

export type RawActionCreatorUpdateCacheT1 = (
  cacheChange: any, options?: ResourceModelQueryActionOptions,
) => {
  cacheChange: any;
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

// ===============================================================

export type QueryInfosT1 = {};

export type ActionInfosT1 = {
  updateCache: ActionInfo<ModelQueryActionCreatorUpdateCache>;
  updateSomeCache: ActionInfo<ModelQueryActionCreatorUpdateCache>;
  clearCache: ActionInfo<ModelQueryActionCreatorUpdateCache>;
  clearSomeCache: ActionInfo<ModelQueryActionCreatorUpdateCache>;
  clearAllCache: ActionInfo<ModelQueryActionCreatorUpdateCache>;
};

export type Types = {
  ModelQueryActionCreatorUpdateCache: ModelQueryActionCreatorUpdateCache;
  RawActionCreatorUpdateCache: RawActionCreatorUpdateCacheT1;

  ActionInfos: ActionInfosT1;
  QueryInfos: QueryInfosT1;
};

class UpdateCacheForModelT1 implements FeatureForModel<Types> {
  Types!: Types;

  resourceMerger : ResourceMerger<QcBasicAction> = (
    state = createEmptyResourceState(),
    action,
  ) => {
    console.log('action :', action);
    return state;
  }

  getQueryInfos : () => QueryInfosT1 = () => ({
  })

  getActionInfos : () => ActionInfosT1 = () => ({
    updateCache: {
      actionCreator: (cacheId, newCache, options?) => ({ cacheId, newCache, options }),
      resourceMerger: this.resourceMerger,
    },
    updateSomeCache: {
      actionCreator: (cacheId, newCache, options?) => ({ cacheId, newCache, options }),
      resourceMerger: this.resourceMerger,
    },
    clearCache: {
      actionCreator: (cacheId, newCache, options?) => ({ cacheId, newCache, options }),
      resourceMerger: this.resourceMerger,
    },
    clearSomeCache: {
      actionCreator: (cacheId, newCache, options?) => ({ cacheId, newCache, options }),
      resourceMerger: this.resourceMerger,
    },
    clearAllCache: {
      actionCreator: (cacheId, newCache, options?) => ({ cacheId, newCache, options }),
      resourceMerger: this.resourceMerger,
    },
  })
}

export default class UpdateCacheT1 implements Feature<Types> {
  Types!: Types;

  getFeatureForModel = () => new UpdateCacheForModelT1();

  getBuildRequestConfigMiddleware = <
    CommonConfigType extends CommonConfig,
    ModelMapType extends ModelMap<CommonConfigType>
  >() : BuildRequestConfigMiddleware<CommonConfigType, ModelMapType> => {
    return (_, next) => next();
  }
}
