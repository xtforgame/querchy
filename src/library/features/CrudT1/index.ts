import {
  ResourceMetadata,
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

export default class CrudT1 {
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

    const { queryMap } = state;

    const metadata : ResourceMetadata = {
      lastRequest: {
        ...(queryMap[resourceId] && queryMap[resourceId].lastRequest),
        requestTimestamp: action.requestTimestamp,
        responseTimestamp: action.responseTimestamp,
      },
    };
    if (action.queryId) {
      metadata.lastRequest!.queryId = action.queryId;
    }
    if (action.response) {
      metadata.lastRequest!.lastResponse = action.response;
    }
    const result = {
      ...state,
      resourceMap: {
        ...state.resourceMap,
        [resourceId]: {
          metadata,
          value: action.response.data,
        },
      },
    };
    if (action.crudType === 'delete') {
      if (result.resourceMap[resourceId]) {
        delete result.resourceMap[resourceId].value;
      }
      // delete result.resourceMap[resourceId];
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
        headers: action.options.headers,
        query: action.options.queryPart,
        body: action.data,
      };
    };
  }
}
