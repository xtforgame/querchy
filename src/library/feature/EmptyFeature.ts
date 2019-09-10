import {
  ResourceMetadata,
  ResourceStateQueryMap,
  ResourceStateResourceMap,
  ResourceMerger,
  ResourceState,
} from '../common/interfaces';
import {
  QcBasicAction,
  ResourceModelQueryActionOptions,
  // ActionInfo,
  QueryInfo,
  CommonConfig,
  ModelMap,
  BuildRequestConfigMiddleware,
  Feature,
  FeatureTypes,
} from '../core/interfaces';
import {
  createEmptyResourceState,
} from '../utils';

// ===============================================================

export type QueryInfosEmpty = {};

export type ActionInfosEmpty = {};

export type Types = {
  ActionInfos: ActionInfosEmpty;
  QueryInfos: QueryInfosEmpty;
};

export default class EmptyFeature<
  TypesType extends FeatureTypes = Types
> implements Feature<TypesType> {
  constructor(nothing?: any) {
  }

  Types!: TypesType;

  resourceMerger : ResourceMerger<QcBasicAction> = (
    state = createEmptyResourceState(),
    action,
  ) => {
    return state;
  }

  getQueryInfos : () => QueryInfosEmpty = () => ({});

  getActionInfos : () => ActionInfosEmpty = () => ({});

  getBuildRequestConfigMiddleware = <
    CommonConfigType extends CommonConfig,
    ModelMapType extends ModelMap<CommonConfigType>
  >() : BuildRequestConfigMiddleware<CommonConfigType, ModelMapType> => {
    return ({ action, runnerType, commonConfig, models, modelRootState }, next) => {
      return next();
    };
  }
}

export const emptyFeature = new EmptyFeature();
