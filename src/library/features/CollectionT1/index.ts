import {
  ResourceMetadata,
  ResourceStateQueryMap,
  ResourceStateResourceMap,
  ResourceMerger,
  ResourceState,

  ResourceUpdate,
  ResourceDelete,
  ResourceChange,
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
  Feature,
  FeatureForModel,
} from '../../core/interfaces';
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

export type Types = {
  RawActionCreatorGetCollection: RawActionCreatorGetCollectionT1;

  ActionInfos: ActionInfosT1;
  QueryInfos: QueryInfosT1;
};

export type ParseResponse = (state: ResourceState, action: QcBasicAction) => ResourceChange;

class CollectionForModelT1 implements FeatureForModel<Types> {
  resourceModel : ResourceModel;
  parseResponse : ParseResponse;
  onError: (error : Error, state: ResourceState, action: QcBasicAction) => any;

  constructor(resourceModel : ResourceModel) {
    this.resourceModel = resourceModel;
    this.parseResponse = (s, action) => {
      const featureDeps = this.resourceModel.featureDeps || {};
      if (featureDeps.parseResponse) {
        return featureDeps.parseResponse(s, action);
      }
      return {};
    };
    this.onError = (error) => {};
  }

  Types!: Types;

  getResourceChange : GetResourceChange = (
    state,
    action,
  ) => {
    const resourceChange = this.parseResponse(state, action);
    if (resourceChange.update && resourceChange.update['']) {
      this.onError(new Error('failed to parse response'), state, action);
      return null;
    }
    return resourceChange;
  }

  getQueryInfos : () => QueryInfosT1 = () => ({
    getCollection: {
      actionCreator: (options?) => ({ options }),
      resourceMerger: changeResourceMerger('get-collection', this.getResourceChange),
    },
    getByIds: {
      actionCreator: (ids, options?) => ({ ids, options }),
      resourceMerger: changeResourceMerger('get-collection', this.getResourceChange),
    },
  })

  getActionInfos : () => ActionInfosT1 = () => ({
  })
}

export default class CollectionT1 implements Feature<Types> {
  Types!: Types;

  getFeatureForModel = (resourceModel : ResourceModel) => new CollectionForModelT1(resourceModel);

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
}
