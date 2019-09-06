import {
  ResourceMetadata,
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
  create: 'post',
  read: 'get',
  update: 'patch',
  delete: 'delete',
};

export type RawActionCreatorCreateT1 = (
  data: any, options?: ResourceModelQueryActionOptions,
) => {
  data: any;
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type RawActionCreatorReadT1 = (
  resourceId: any, options?: ResourceModelQueryActionOptions,
) => {
  resourceId: any;
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type RawActionCreatorUpdateT1 = (
  resourceId: any, data: any, options?: ResourceModelQueryActionOptions,
) => {
  resourceId: any;
  data: any;
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type RawActionCreatorDeleteT1 = (
  resourceId: any, options?: ResourceModelQueryActionOptions,
) => {
  resourceId: any;
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

// ===============================================================

export type QueryInfosT1 = {
  create: QueryInfo<RawActionCreatorCreateT1>;
  read: QueryInfo<RawActionCreatorReadT1>;
  update: QueryInfo<RawActionCreatorUpdateT1>;
  delete: QueryInfo<RawActionCreatorDeleteT1>;
};

export type ActionInfosT1 = {};

export type Types = {
  RawActionCreatorCreate: RawActionCreatorCreateT1;
  RawActionCreatorRead: RawActionCreatorReadT1;
  RawActionCreatorUpdate: RawActionCreatorUpdateT1;
  RawActionCreatorDelete: RawActionCreatorDeleteT1;

  ActionInfos: ActionInfosT1;
  QueryInfos: QueryInfosT1;
};

export type GetResourceId = (state: ResourceState, action: QcBasicAction) => string | void;

export type GetBuildRequestConfigMiddleware<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>
> = () => BuildRequestConfigMiddleware<
  CommonConfigType ,
  ModelMapType
>;

class CrudForModelT1 implements FeatureForModel<Types> {
  resourceModel : ResourceModel;
  getResourceId : GetResourceId;
  onError: (error : Error, state: ResourceState, action: QcBasicAction) => any;

  constructor(resourceModel : ResourceModel) {
    this.resourceModel = resourceModel;
    this.getResourceId = (
      (s, action) => {
        if (
          action.transferables
          && action.transferables.requestAction
          && action.transferables.requestAction.resourceId
        ) {
          return action.transferables.requestAction.resourceId;
        }
        const featureDeps = this.resourceModel.featureDeps || {};
        if (featureDeps.getId) {
          return featureDeps.getId(action);
        }
        return null;
      }
    );
    this.onError = (error) => {};
  }

  Types!: Types;

  resourceMerger : ResourceMerger<QcBasicAction> = (
    state = createEmptyResourceState(),
    action,
  ) => {
    const resourceId = this.getResourceId(state, action);
    if (!resourceId) {
      this.onError(new Error('failt to parse resource id'), state, action);
      return state;
    }

    const { queryMap } = state;

    const metadata : ResourceMetadata = {
      lastRequest: {
        ...(queryMap[resourceId] && queryMap[resourceId].metadata.lastRequest),
        requestTimestamp: action.requestTimestamp,
        responseTimestamp: action.responseTimestamp,
      },
      lastUpdate: {
        updateType: 'crud',
        updateData: action.response.data,
        updateTimestamp: action.responseTimestamp,
      },
    };
    if (action.queryId) {
      metadata.lastRequest!.queryId = action.queryId;
    }
    if (action.response) {
      metadata.lastRequest!.lastResponse = action.response;
    }
    const result = mergeResourceState(state, {
      resourceMap: {
        metadata: {
          [resourceId]: metadata,
        },
        values: {
          [resourceId]: action.response.data,
        },
      },
    });
    if (action.crudType === 'delete') {
      delete result.resourceMap.values[resourceId];
      // delete result.resourceMap.metadata[resourceId];
    }
    return result;
  }

  getQueryInfos : () => QueryInfosT1 = () => ({
    create: {
      actionCreator: (data, options?) => ({ data, options }),
      resourceMerger: this.resourceMerger,
    },
    read: {
      actionCreator: (resourceId, options?) => ({ resourceId, options }),
      resourceMerger: this.resourceMerger,
    },
    update: {
      actionCreator: (resourceId, data, options?) => ({ resourceId, data, options }),
      resourceMerger: this.resourceMerger,
    },
    delete: {
      actionCreator: (resourceId, options?) => ({ resourceId, options }),
      resourceMerger: this.resourceMerger,
    },
  })

  getActionInfos : () => ActionInfosT1 = () => ({
  })
}

export default class CrudT1 implements Feature<Types> {
  Types!: Types;

  getFeatureForModel = (resourceModel : ResourceModel) => new CrudForModelT1(resourceModel);

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

      // console.log('action', action);
      if (!action.modelName || !crudToRestMap[action.crudType]) {
        return next();
      }
      return {
        overwriteQueryId,
        method: crudToRestMap[action.crudType],
        url: models[action.modelName].buildUrl!(models[action.modelName].url, action),
        headers: action.options && action.options.headers,
        query: action.options && action.options.queryPart,
        body: action.data,
      };
    };
  }
}
