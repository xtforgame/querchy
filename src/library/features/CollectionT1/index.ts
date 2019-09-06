import {
  ResourceMetadata,
  ResourceStateQueryMap,
  ResourceStateResourceMap,
  ResourceMerger,
  ResourceState,
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

export type ResourceChange = {
  update?: { [s : string] : any },
  delete?: string[],
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

  resourceMerger : ResourceMerger<QcBasicAction> = (
    state = createEmptyResourceState(),
    action,
  ) => {
    const resourceChange = this.parseResponse(state, action);
    if (resourceChange.update && resourceChange.update['']) {
      this.onError(new Error('failt to parse response'), state, action);
      return state;
    }

    const { queryMap, resourceMap } = state;

    const extraQueryMap : ResourceStateQueryMap = {
      metadata: {},
      values: {},
    };
    const queryId = action.queryId;
    if (queryId) {
      extraQueryMap.metadata[queryId] = {
        ...(queryMap[queryId] && queryMap[queryId].metadata.lastRequest),
        queryId,
        requestTimestamp: action.requestTimestamp,
        responseTimestamp: action.responseTimestamp,
      };
      extraQueryMap.values[queryId] = action.response.data;
    }

    const extraResourceMap : ResourceStateResourceMap = {
      metadata: {},
      values: {},
    };
    if (queryId) {
      const update = resourceChange.update || {};
      Object.keys(update)
      .forEach((key) => {
        extraResourceMap.metadata[key] = {
          ...(resourceMap[queryId] && resourceMap[queryId].metadata.lastRequest),
          lastUpdate: {
            updateType: 'get-collection',
            updateData: update[key],
            updateTimestamp: action.responseTimestamp,
          },
        };
        extraResourceMap.values[key] = update[key];
      });
      const deleteIds = resourceChange.delete || [];
      deleteIds.forEach((deleteId) => {
        extraResourceMap.metadata[deleteId] = {
          ...(resourceMap[queryId] && resourceMap[queryId].metadata.lastRequest),
          lastUpdate: {
            updateType: 'get-collection',
            updateData: update[deleteId],
            updateTimestamp: action.responseTimestamp,
          },
        };
        delete extraResourceMap.values[deleteId];
      });
    }
    const result = mergeResourceState(
      state,
      {
        queryMap: extraQueryMap,
        resourceMap: extraResourceMap,
      },
    );
    return result;
  }

  getQueryInfos : () => QueryInfosT1 = () => ({
    getCollection: {
      actionCreator: (options?) => ({ options }),
      resourceMerger: this.resourceMerger,
    },
    getByIds: {
      actionCreator: (ids, options?) => ({ ids, options }),
      resourceMerger: this.resourceMerger,
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
