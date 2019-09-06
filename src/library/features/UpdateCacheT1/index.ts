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
  updateCache: ActionInfo<RawActionCreatorUpdateCacheT1>;
};

export type Types = {
  RawActionCreatorUpdateCache: RawActionCreatorUpdateCacheT1;

  ActionInfos: ActionInfosT1;
  QueryInfos: QueryInfosT1;
};

class UpdateCacheForModelT1 implements FeatureForModel<Types> {
  Types!: Types;

  getQueryInfos : () => QueryInfosT1 = () => ({
  })

  getActionInfos : () => ActionInfosT1 = () => ({
    updateCache: {
      actionCreator: (cacheChange, options?) => ({ cacheChange, options }),
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
