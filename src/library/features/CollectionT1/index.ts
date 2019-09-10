import { Epic, createEpicMiddleware, combineEpics, State } from 'pure-epic';
import { createSelector } from 'reselect';
import {
  ResourceMetadata,
  ResourceStateQueryMap,
  ResourceStateResourceMap,
  ResourceMerger,
  ResourceState,

  ResourceUpdate,
  ResourceDelete,
  ResourceChange,
  BaseSelector,
  ResourceStateValueMap,
} from '../../common/interfaces';
import {
  QcBasicAction,
  ResourceModelQueryActionOptions,
  ResourceModel,
  // ActionInfo,
  QueryInfo,
  CommonConfig,
  ModelMap,
  BuildRequestConfigMiddleware,
} from '../../core/interfaces';
import {
  FeatureEx,
  ExtraSelectorInfosForModelMap,
  BuiltinSelectorCreators,
  BuiltinSelectors,
} from '../../Cacher/interfaces';
import {
  createEmptyResourceState,
  mergeResourceState,
} from '../../utils';
import {
  GetResourceChange,
  changeResourceMerger,
} from '../shared';

export const crudToRestMap = {
  getCollection: 'get',
};

export type RawActionCreatorGetCollectionT1 = (
  options?: ResourceModelQueryActionOptions,
) => {
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type RawActionCreatorGetByIdsT1 = (
  ids: string[],
  options?: ResourceModelQueryActionOptions,
) => {
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

// ===============================================================

export type QueryInfosT1 = {
  getCollection: QueryInfo<RawActionCreatorGetCollectionT1>;
  getByIds: QueryInfo<RawActionCreatorGetByIdsT1>;
};

export type ActionInfosT1 = {};

export type SelectorCreatorsT1 = {
  selectCollenctionItems: () => (state: any) => any;
};

export type Types = {
  RawActionCreatorGetCollection: RawActionCreatorGetCollectionT1;

  ActionInfos: ActionInfosT1;
  QueryInfos: QueryInfosT1;

  SelectorCreators: SelectorCreatorsT1;
};

export type ParseResponse = (state: ResourceState, action: QcBasicAction) => ResourceChange;

export const NOT_IN_RESOURCE_MAP = Symbol('NOT_IN_RESOURCE_MAP');
export default class CollectionT1 implements FeatureEx<Types> {
  Types!: Types;

  onError: (error : Error, state: ResourceState, action: QcBasicAction) => any;

  constructor() {
    this.onError = (error) => {};
  }

  getResourceChange : <
    CommonConfigType extends CommonConfig,
    ResourceModelType extends ResourceModel<CommonConfigType>,
  >(resourceModel : ResourceModelType) => GetResourceChange = resourceModel => (
    state,
    action,
  ) => {
    const parseResponse = (s, action) => {
      const featureDeps = resourceModel.featureDeps || {};
      if (featureDeps.parseResponse) {
        return featureDeps.parseResponse(s, action);
      }
      return {};
    };
    const resourceChange = parseResponse(state, action);
    if (resourceChange.update && resourceChange.update['']) {
      this.onError(new Error('failed to parse response'), state, action);
      return null;
    }
    return resourceChange;
  }

  getBuildRequestConfigMiddleware = <
    CommonConfigType extends CommonConfig,
    ModelMapType extends ModelMap<CommonConfigType>
  >() : BuildRequestConfigMiddleware<CommonConfigType, ModelMapType> => {
    return ({ action, runnerType, commonConfig, models, modelRootState }, next) => {
      let overwriteQueryId : any = action.queryId;
      if (!overwriteQueryId) {
        if (action.resourceId) {
          overwriteQueryId = `${action.crudType}?resourceId=${action.resourceId}`;
        } else {
          overwriteQueryId = action.crudType;
        }
      }

      if (!action.modelName || !crudToRestMap[action.crudType]) {
        return next();
      }
      return {
        overwriteQueryId,
        method: crudToRestMap[action.crudType],
        url: models[action.modelName].url,
        headers: action.options && action.options.headers,
        query: action.options && action.options.queryPart,
        body: action.data,
      };
    };
  }

  getQueryInfos : <
    CommonConfigType extends CommonConfig,
    ResourceModelType extends ResourceModel<CommonConfigType>,
  >(resourceModel : ResourceModelType) => QueryInfosT1 = resourceModel => ({
    getCollection: {
      actionCreator: (options?) => ({ options }),
      resourceMerger: changeResourceMerger('get-collection', this.getResourceChange(resourceModel)),
    },
    getByIds: {
      actionCreator: (ids, options?) => ({ ids, options }),
      resourceMerger: changeResourceMerger('get-collection', this.getResourceChange(resourceModel)),
    },
  })

  getActionInfos : <
    CommonConfigType extends CommonConfig,
    ResourceModelType extends ResourceModel<CommonConfigType>,
  >(resourceModel : ResourceModelType) => ActionInfosT1 = () => ({
  })

  getExtraSelectorInfos = <
    CommonConfigType extends CommonConfig,
    ModelMapType extends ModelMap<CommonConfigType>,
    ResourceModelType extends ResourceModel<CommonConfigType>,
    StateType extends State,
  >(resourceModel : ResourceModelType) : {
    selectCollenctionItems: {
      creatorCreator: (
        baseSelector : BaseSelector<ModelMapType>,
        builtinSelectorCreators: BuiltinSelectorCreators<StateType>,
        builtinSelectors: BuiltinSelectors<StateType>,
      ) => () => (state: StateType) => any;
    },
  } => {
    let getIdFromCollectionItem : (item : any) => string | null | undefined = (item) => item && item.id;
    const featureDeps = resourceModel.featureDeps || {};
    if (featureDeps.getIdFromCollectionItem) {
      getIdFromCollectionItem = featureDeps.getIdFromCollectionItem;
    }

    let getItemArrayFromCollection : (collection : any, resourceMap: ResourceStateValueMap) => any[] = (
      collection, resourceMap,
    ) => {
      if (!Array.isArray(collection)) {
        return [];
      }
      return collection.map((item) => {
        const id  = getIdFromCollectionItem(item);
        if (id != null) {
          return resourceMap[item.id];
        }
        return NOT_IN_RESOURCE_MAP;
      });
    };
    if (featureDeps.getItemArrayFromCollection) {
      getItemArrayFromCollection = featureDeps.getItemArrayFromCollection;
    }

    return {
      selectCollenctionItems: {
        creatorCreator: (baseSelector, builtinSelectorCreators) => {
          return () => createSelector(
            builtinSelectorCreators.selectQueryMapValues(),
            builtinSelectorCreators.selectResourceMapValues(),
            (queryMap, resourceMap) => {
              if (!queryMap
                || !queryMap.getCollection
              ) {
                return [];
              }
              return getItemArrayFromCollection(queryMap.getCollection, resourceMap);
            },
          );
        },
      },
    };
  }
}
