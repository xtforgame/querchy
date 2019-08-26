import {
  ResourceMetadata,
  ResourceStateQueryMap,
  ResourceMerger,
  ResourceState,
} from '../../common/interfaces';
import {
  QcBasicAction,
  ResourceModelQueryActionOptions,
  // ActionInfo,
  QueryInfo,
  CommonConfig,
  ModelMap,
  BuildRequestConfigMiddleware,
} from '../../core/interfaces';

export const crudToRestMap = {
  getCollection: 'get',
};

export type RawActionCreatorGetCollectionT1 = (
  options?: ResourceModelQueryActionOptions,
) => {
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

// ===============================================================

export type QueryInfosT1 = {
  getCollection: QueryInfo<RawActionCreatorGetCollectionT1>;
};

export type ActionInfosT1 = {};

export type Types = {
  RawActionCreatorGetCollection: RawActionCreatorGetCollectionT1;

  ActionInfos: ActionInfosT1;
  QueryInfos: QueryInfosT1;
};

export type GetResourceId = (state: ResourceState, action: QcBasicAction) => string | void;

export default class CollectionT1 {
  static crudToRestMap(crudName) {
    return crudToRestMap[crudName];
  }

  getResourceId : GetResourceId;
  onError: (error : Error, state: ResourceState, action: QcBasicAction) => any;

  constructor(getResourceId?: GetResourceId) {
    this.getResourceId = getResourceId || (
      (s, action) => (
        action.response
        && action.response.data
        && action.response.data.args
        && action.response.data.args.id
      ) || '1'
    );
    this.onError = (error) => {}
  }

  Types!: Types;

  resourceMerger : ResourceMerger<QcBasicAction> = (
    state = {
      queryMap: {},
      resourceMap: {},
    },
    action,
  ) => {
    const resourceId = this.getResourceId(state, action);
    if (!resourceId) {
      this.onError(new Error('failt to parse resource id'), state, action);
      return state;
    }

    const { queryMap, resourceMap } = state;

    const metadata : ResourceMetadata = {
      lastRequest: {
        ...(resourceMap[resourceId] && resourceMap[resourceId].metadata.lastRequest),
        requestTimestamp: action.requestTimestamp,
        responseTimestamp: action.responseTimestamp,
      },
    };
    if (action.queryId) {
      metadata.lastRequest!.queryId = action.queryId;
    }
    let extraQueryMap : ResourceStateQueryMap = {};
    if (metadata.lastRequest!.queryId) {
      extraQueryMap[metadata.lastRequest!.queryId] = {
        metadata,
        value: action.response.data,
      };
    }
    const result = {
      ...state,
      queryMap: {
        ...queryMap,
        ...extraQueryMap,
      },
      resourceMap: {
        ...state.resourceMap,
        '1': {
          metadata,
          value: action.response.data,
        },
        '2': {
          metadata,
          value: action.response.data,
        },
      },
    };
    return result;
  }

  getQueryInfos : () => QueryInfosT1 = () => ({
    getCollection: {
      actionCreator: (options?) => ({ options }),
      resourceMerger: this.resourceMerger,
    },
  })

  getActionInfos : () => ActionInfosT1 = () => ({
  })

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
      console.log('models[action.modelName].url :', models[action.modelName].url);
      return {
        overwriteQueryId,
        method: crudToRestMap[action.crudType],
        url: models[action.modelName].url,
        headers: action.options.headers,
        query: action.options.queryPart,
        body: action.data,
      };
    };
  }
}
