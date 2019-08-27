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

export type ResourceChange = {
  update?: { [s : string] : any },
  delete?: string[],
};

export type ParseResponse = (state: ResourceState, action: QcBasicAction) => ResourceChange;

export default class CollectionT1 {
  static crudToRestMap(crudName) {
    return crudToRestMap[crudName];
  }

  parseResource : ParseResponse;
  onError: (error : Error, state: ResourceState, action: QcBasicAction) => any;

  constructor(parseResource?: ParseResponse) {
    this.parseResource = parseResource || (
      (s, action) => ({
        update: {
          '': action.response.data,
        },
      })
    );
    this.onError = (error) => {};
  }

  Types!: Types;

  resourceMerger : ResourceMerger<QcBasicAction> = (
    state = {
      queryMap: {},
      resourceMap: {},
    },
    action,
  ) => {
    const resourceChange = this.parseResource(state, action);
    if (resourceChange.update && resourceChange.update['']) {
      this.onError(new Error('failt to parse response'), state, action);
      return state;
    }

    const { queryMap, resourceMap } = state;

    const extraQueryMap : ResourceStateQueryMap = {};
    const queryId = action.queryId;
    if (queryId) {
      extraQueryMap[queryId] = {
        metadata: {
          ...(queryMap[queryId] && queryMap[queryId].metadata.lastRequest),
          queryId,
          requestTimestamp: action.requestTimestamp,
          responseTimestamp: action.responseTimestamp,
        },
        value: action.response.data,
      };
    }

    const extraResourceMap : ResourceStateResourceMap = {};
    if (queryId) {
      const update = resourceChange.update || {};
      Object.keys(update)
      .forEach((key) => {
        extraResourceMap[key] = {
          metadata: {
            ...(resourceMap[queryId] && resourceMap[queryId].metadata.lastRequest),
            lastUpdate: {
              updateType: 'get-collection',
              updateData: update[key],
              updateTimestamp: action.responseTimestamp,
            },
          },
          value: update[key],
        };
      });
    }
    const result = {
      ...state,
      queryMap: {
        ...queryMap,
        ...extraQueryMap,
      },
      resourceMap: {
        ...state.resourceMap,
        ...extraResourceMap,
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
