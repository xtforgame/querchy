import {
  QcAction,
  ResourceMetadata,

  RootReducer,
  SliceReducer,
  Merger,
  BasicMerger,
} from '~/common/interfaces';

import {
  CommonConfig,
  ModelMap,
  QueryCreatorMap,
  ExtraActionCreators,
  QuerchyDefinition,

  QcResponseAction,
} from '~/core/interfaces';

import combineReducers from '~/redux/combineReducers';

import {
  ReducerSets,
} from './interfaces';

import Querchy from '~/Querchy';

export default class Updater<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<
    CommonConfigType
  >,
  QueryCreatorMapType extends QueryCreatorMap<
    CommonConfigType, ModelMapType
  >,
  ExtraActionCreatorsType extends ExtraActionCreators<
    CommonConfigType, ModelMapType, QueryCreatorMapType
  >,

  QuerchyDefinitionType extends QuerchyDefinition<
    CommonConfigType, ModelMapType, QueryCreatorMapType, ExtraActionCreatorsType
  >,

  ExtraDependencies = any,
> {
  querchy : Querchy<
    CommonConfigType,
    ModelMapType,
    QueryCreatorMapType,
    ExtraActionCreatorsType,
    QuerchyDefinitionType,
    ExtraDependencies
  >;

  reducerSet : ReducerSets<
    CommonConfigType,
    ModelMapType
  >;

  allReducers : { [s : string]: SliceReducer };

  rootReducer : RootReducer;

  constructor(
    querchy : Querchy<
      CommonConfigType,
      ModelMapType,
      QueryCreatorMapType,
      ExtraActionCreatorsType,
      QuerchyDefinitionType,
      ExtraDependencies
    >,
  ) {
    this.querchy = querchy;
    // console.log('querchy :', querchy.querchyDefinition);
    this.reducerSet = <any>{};
    this.allReducers = {};
    this.rootReducer = () => {};
    this.init();
  }

  createResponseMerger = (actionType : string) : Merger<QcResponseAction> => {
    return (
      state,
      action,
    ) => {
      const resourceId : string = (
        action.response
        && action.response.data
        && action.response.data.args
        && action.response.data.args.id
      ) || '1';

      const { metadataMap } = state;

      if (action.type === actionType /*  && action.crudSubType === 'respond' */) {
        const metadata : ResourceMetadata = {
          lastRequest: {
            ...(metadataMap[resourceId] && metadataMap[resourceId].lastRequest),
            requestTimestamp: action.requestTimestamp,
            responseTimestamp: action.responseTimestamp,
          },
        };
        return {
          ...state,
          metadataMap: {
            ...metadataMap,
            [resourceId]: metadata,
          },
          resourceMap: {
            ...state.resourceMap,
            [resourceId]: action.response.data,
          },
        };
      }
      return state;
    };
  }

  init() {
    const {
      models,
    } = this.querchy.querchyDefinition;
    Object.keys(models)
    .forEach((key) => {
      const model = models[key];
      const actions = model.actions!;

      const reducers : { [s : string] : SliceReducer } = {};
      const reducerArray : SliceReducer[] = [];
      Object.keys(actions).forEach((actionKey) => {
        const { actionType } = actions[actionKey].creatorRefs.respond;
        const reducer : BasicMerger = <BasicMerger>this.createResponseMerger(actionType);
        reducers[actionKey] = reducer;
        reducerArray.push(reducer);
      });
      (<any>this.reducerSet[key]) = reducers;
      this.allReducers[key] = (
        state = {
          metadataMap: {},
          resourceMap: {},
        },
        action,
      ) => {
        return reducerArray.reduce((s, r) => r(s, action), state);
      };
    });
    this.rootReducer = combineReducers(this.allReducers);
  }

  reduce(state: any, action: QcAction) : any {
    return this.rootReducer(state, action);
  }
}
