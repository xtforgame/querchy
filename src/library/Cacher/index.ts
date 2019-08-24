import { Epic, createEpicMiddleware, combineEpics } from 'pure-epic';
import { ObservableInput } from 'rxjs';
import { mergeMap, filter } from 'rxjs/operators';
import { toUnderscore } from '../common/common-functions';

import {
  QcAction,
  QcState,
  ResourceMetadata,

  RootReducer,
  SliceReducer,
  GlobalReducer,
  ResourceMerger,
  BasicResourceMerger,
  GlobalMerger,
  BasicGlobalMerger,
} from '../common/interfaces';

import {
  QcBasicAction,
  QcDependencies,
  CommonConfig,
  ModelMap,
  QueryBuilderMap,
  ExtraActionCreators,
  QuerchyDefinition,

  QcResponseAction,
} from '../core/interfaces';

import combineReducers from '../redux/combineReducers';

import {
  ReducerSets,
} from './interfaces';

import Querchy, { QuerchyTypeGroup } from '../Querchy';

export type CacherTypeGroup<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<
    CommonConfigType
  >,
  QueryBuilderMapType extends QueryBuilderMap<
    CommonConfigType, ModelMapType
  >,
  ExtraActionCreatorsType extends ExtraActionCreators<
    CommonConfigType, ModelMapType, QueryBuilderMapType
  >,

  QuerchyDefinitionType extends QuerchyDefinition<
    CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType
  >,

  ExtraDependenciesType,
> = QuerchyTypeGroup<
  CommonConfigType,
  ModelMapType,
  QueryBuilderMapType,
  ExtraActionCreatorsType,
  QuerchyDefinitionType,
  ExtraDependenciesType
> & {
  QuerchyType: Querchy<
    CommonConfigType,
    ModelMapType,
    QueryBuilderMapType,
    ExtraActionCreatorsType,
    QuerchyDefinitionType,
    ExtraDependenciesType
  >;

  ReducerSetsType: ReducerSets<
    CommonConfigType,
    ModelMapType
  >;

  GlobalMerger: GlobalMerger<
    ModelMapType,
    QcBasicAction
  >;
};

export type CacherConstructor<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<
    CommonConfigType
  >,
  QueryBuilderMapType extends QueryBuilderMap<
    CommonConfigType, ModelMapType
  >,
  ExtraActionCreatorsType extends ExtraActionCreators<
    CommonConfigType, ModelMapType, QueryBuilderMapType
  >,

  QuerchyDefinitionType extends QuerchyDefinition<
    CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType
  >,

  ExtraDependenciesType = any,

  // =============

  CacherTypeGroupType extends CacherTypeGroup<
    CommonConfigType,
    ModelMapType,
    QueryBuilderMapType,
    ExtraActionCreatorsType,
    QuerchyDefinitionType,
    ExtraDependenciesType
  > = CacherTypeGroup<
    CommonConfigType,
    ModelMapType,
    QueryBuilderMapType,
    ExtraActionCreatorsType,
    QuerchyDefinitionType,
    ExtraDependenciesType
  >
> = (
  querchy : CacherTypeGroupType['QuerchyType'],
) => any;

export default class Cacher<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<
    CommonConfigType
  >,
  QueryBuilderMapType extends QueryBuilderMap<
    CommonConfigType, ModelMapType
  >,
  ExtraActionCreatorsType extends ExtraActionCreators<
    CommonConfigType, ModelMapType, QueryBuilderMapType
  >,

  QuerchyDefinitionType extends QuerchyDefinition<
    CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType
  >,

  ExtraDependenciesType = any,

  // =============

  CacherTypeGroupType extends CacherTypeGroup<
    CommonConfigType,
    ModelMapType,
    QueryBuilderMapType,
    ExtraActionCreatorsType,
    QuerchyDefinitionType,
    ExtraDependenciesType
  > = CacherTypeGroup<
    CommonConfigType,
    ModelMapType,
    QueryBuilderMapType,
    ExtraActionCreatorsType,
    QuerchyDefinitionType,
    ExtraDependenciesType
  >
> {
  querchy : CacherTypeGroupType['QuerchyType'];

  reducerSet : CacherTypeGroupType['ReducerSetsType'];

  allResourceReducers : {
    [s : string]: SliceReducer,
  };

  extraGlobalReducer?: GlobalReducer<ModelMapType>;

  rootReducer : GlobalReducer<ModelMapType>;

  constructor(
    querchy : CacherTypeGroupType['QuerchyType'],
  ) {
    this.querchy = querchy;
    // console.log('querchy :', querchy.querchyDefinition);
    this.reducerSet = <any>{};
    this.allResourceReducers = {};
    this.rootReducer = s => s;
    this.init();
  }

  createResourceMergerForResponse = (
    actionType : string,
    merger : ResourceMerger<QcBasicAction>,
  ) : ResourceMerger<QcResponseAction> => {
    return (
      state = {
        queryMap: {},
        resourceMap: {},
      },
      action,
    ) => {
      if (action.type === actionType) { /* action.crudSubType === 'respond' */
        return merger(state, action);
      }
      return state;
    };
  }

  createGlobalMergerForResponse = (
    actionType : string,
    merger : CacherTypeGroupType['GlobalMerger'],
  ) : CacherTypeGroupType['GlobalMerger'] => {
    return (
      state = <any>{},
      action,
    ) => {
      if (action.type === actionType) { /* action.crudSubType === 'respond' */
        return merger(state, action);
      }
      return state;
    };
  }

  init() {
    const { models } = this.querchy.querchyDefinition;
    const extraActionCreators = this.querchy.querchyDefinition.extraActionCreators!;

    Object.keys(models)
    .forEach((key) => {
      const reducers : { [s : string] : SliceReducer } = {};
      const reducerArray : SliceReducer[] = [];

      const model = models[key];
      const actions = model.actions!;
      const queryInfos = model.queryInfos! || {};

      Object.keys(queryInfos).forEach((actionKey) => {
        if (queryInfos[actionKey] && queryInfos[actionKey].resourceMerger) {
          const { actionType } = actions[actionKey].creatorRefs.respond;
          const reducer = <BasicResourceMerger>this.createResourceMergerForResponse(
            actionType,
            queryInfos[actionKey].resourceMerger!,
          );
          reducers[actionKey] = reducer;
          reducerArray.push(reducer);
        }
      });

      (<any>this.reducerSet[key]) = reducers;
      this.allResourceReducers[key] = (
        state = {
          queryMap: {},
          resourceMap: {},
        },
        action,
      ) => {
        return reducerArray.reduce((s, r) => r(s, action), state);
      };
    });

    {
      const reducers : { [s : string] : GlobalReducer<ModelMapType> } = {};
      const reducerArray : GlobalReducer<ModelMapType>[] = [];

      const actions = extraActionCreators.actions!;
      const queryInfos = extraActionCreators.queryInfos! || {};

      Object.keys(extraActionCreators.queryInfos).forEach((actionKey) => {
        if (queryInfos[actionKey] && queryInfos[actionKey].globalMerger) {
          const { actionType } = actions[actionKey].creatorRefs.respond;
          const reducer = <BasicGlobalMerger>this.createGlobalMergerForResponse(
            actionType,
            queryInfos[actionKey].globalMerger!,
          );
          reducers[actionKey] = reducer;
          reducerArray.push(reducer);
        }
      });
      (<any>this.reducerSet.extra) = reducers;
      this.extraGlobalReducer = (
        state = <any>{},
        action,
      ) => {
        return reducerArray.reduce((s, r) => r(s, action), state);
      };
    }
    this.allResourceReducers.extra = (
      state = {
        queryMap: {},
        resourceMap: {},
      },
      action,
    ) => {
      return state;
    };
    const resourceReducerRoot = combineReducers(this.allResourceReducers);
    this.rootReducer = (state, action) => {
      const newState = resourceReducerRoot(state, action);
      return this.extraGlobalReducer!(newState, action);
    };
  }

  getEpicByActionType(
    actionType : string,
  ) : CacherTypeGroupType['EpicType'] {
    return (action$, state$, ...args) => action$.pipe(
      filter<QcAction>((action) => {
        // console.log('action :', action);
        if (action.type !== actionType) {
          return false;
        }
        return true;
      }),
      mergeMap<QcAction, ObservableInput<QcAction>>((action) => {
        return [{ type: `${actionType}_XXX` }];
      }),
    );
  }

  getRootEpic() : CacherTypeGroupType['EpicType'] {
    const { models } = this.querchy.querchyDefinition;
    const extraActionCreators = this.querchy.querchyDefinition.extraActionCreators!;
    return combineEpics(
      ...Object.keys(models)
      .filter(modelName => models[modelName].actionTypes!['updateCache'])
      .map<CacherTypeGroupType['EpicType']>(modelName => this.getEpicByActionType(
        models[modelName].actionTypes!['updateCache'],
      )),
      // ...Object.values(extraActionCreators.queryInfos)
      // .map<CacherTypeGroupType['EpicType']>(
      //   (queryInfo) => {
      //     return this.getEpicByActionType(
      //       queryInfo.querySubActionTypes!.respond,
      //     );
      //   },
      // ),
    );
  }

  reduce(state: any, action: QcAction) : any {
    return this.rootReducer(state, action);
  }
}
