import { Epic, createEpicMiddleware, combineEpics, State } from 'pure-epic';
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
  oooo: () => (state: any) => number;
};

export type Types = {
  RawActionCreatorGetCollection: RawActionCreatorGetCollectionT1;

  ActionInfos: ActionInfosT1;
  QueryInfos: QueryInfosT1;

  SelectorCreators: SelectorCreatorsT1;
};

export type ParseResponse = (state: ResourceState, action: QcBasicAction) => ResourceChange;

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
    oooo: {
      creatorCreator: (
        baseSelector : BaseSelector<ModelMapType>,
        builtinSelectorCreators: BuiltinSelectorCreators<StateType>,
        builtinSelectors: BuiltinSelectors<StateType>,
      ) => () => (state: StateType) => number;
    },
  } => ({
    oooo: {
      creatorCreator: () => () => () => 1,
    },
  })
}
