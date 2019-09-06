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

export default class EmptyFeature implements Feature<Types> {
  constructor(nothing?: any) {
  }

  Types!: Types;

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
