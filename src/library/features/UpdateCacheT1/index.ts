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
  ResourceModel,
} from '../../core/interfaces';
import {
  createEmptyResourceState,
} from '../../utils';
import {
  GetResourceChange,
  changeResourceMerger,
} from '../shared';
import {
  ModelActionCreatorUpdateCache,
  ModelActionCreatorUpdateSomeCache,
  ModelActionCreatorClearCache,
  ModelActionCreatorClearSomeCache,
  ModelActionCreatorClearAllCache,
  ModelActionCreatorChangeSomeCache,
} from './interfaces';

// ===============================================================

export type QueryInfosT1 = {};

export type ActionInfosT1 = {
  updateCache: ActionInfo<ModelActionCreatorUpdateCache>;
  updateSomeCache: ActionInfo<ModelActionCreatorUpdateSomeCache>;
  clearCache: ActionInfo<ModelActionCreatorClearCache>;
  clearSomeCache: ActionInfo<ModelActionCreatorClearSomeCache>;
  clearAllCache: ActionInfo<ModelActionCreatorClearAllCache>;
  changeSomeCache: ActionInfo<ModelActionCreatorChangeSomeCache>;
};

export type Types = {
  ModelActionCreatorUpdateCache: ModelActionCreatorUpdateCache;
  ModelActionCreatorUpdateSomeCache: ModelActionCreatorUpdateSomeCache;
  ModelActionCreatorClearCache: ModelActionCreatorClearCache;
  ModelActionCreatorClearSomeCache: ModelActionCreatorClearSomeCache;
  ModelActionCreatorClearAllCache: ModelActionCreatorClearAllCache;
  ModelActionCreatorChangeSomeCache: ModelActionCreatorChangeSomeCache;

  ActionInfos: ActionInfosT1;
  QueryInfos: QueryInfosT1;
};

export default class UpdateCacheT1 implements Feature<Types> {
  Types!: Types;

  getBuildRequestConfigMiddleware = <
    CommonConfigType extends CommonConfig,
    ModelMapType extends ModelMap<CommonConfigType>
  >() : BuildRequestConfigMiddleware<CommonConfigType, ModelMapType> => {
    return (_, next) => next();
  }

  getQueryInfos : <
    CommonConfigType extends CommonConfig,
    ResourceModelType extends ResourceModel<CommonConfigType>,
  >(resourceModel : ResourceModelType) => QueryInfosT1 = () => ({
  })

    getActionInfos : <
    CommonConfigType extends CommonConfig,
    ResourceModelType extends ResourceModel<CommonConfigType>,
  >(resourceModel : ResourceModelType) => ActionInfosT1 = () => ({
    updateCache: {
      actionCreator: (resourceId, value, options?) => ({ resourceId, value, options }),
      resourceMerger: changeResourceMerger('update-cache', (
        state,
        action,
      ) => ({
        update: {
          [action.resourceId] : action.value,
        },
      })),
    },
    updateSomeCache: {
      actionCreator: (update, options?) => ({ update, options }),
      resourceMerger: changeResourceMerger('update-cache', (
        state,
        action,
      ) => ({
        update: action.update,
      })),
    },
    clearCache: {
      actionCreator: (resourceId, value, options?) => ({ resourceId, value, options }),
      resourceMerger: changeResourceMerger('update-cache', (
        state,
        action,
      ) => ({
        delete: [action.resourceId],
      })),
    },
    clearSomeCache: {
      actionCreator: (deleteIds, options?) => ({ delete: deleteIds, options }),
      resourceMerger: changeResourceMerger('update-cache', (
        state,
        action,
      ) => ({
        delete: action.delete,
      })),
    },
    clearAllCache: {
      actionCreator: (options?) => ({ options }),
      resourceMerger: (
        state = createEmptyResourceState(),
        action,
      ) => {
        return createEmptyResourceState();
      },
    },
    changeSomeCache: {
      actionCreator: (change, options?) => ({ change, options }),
      resourceMerger: changeResourceMerger('update-cache', (
        state,
        action,
      ) => action.change),
    },
  })
}
