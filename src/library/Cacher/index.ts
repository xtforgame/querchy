import { Epic, createEpicMiddleware, combineEpics } from 'pure-epic';
import { ObservableInput } from 'rxjs';
import { mergeMap, filter } from 'rxjs/operators';
import { toUnderscore } from '~/common/common-functions';

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
} from '~/common/interfaces';

import {
  QcBasicAction,
  QcDependencies,
  CommonConfig,
  ModelMap,
  QueryBuilderMap,
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
  QueryBuilderMapType extends QueryBuilderMap<
    CommonConfigType, ModelMapType
  >,
  ExtraActionCreatorsType extends ExtraActionCreators<
    CommonConfigType, ModelMapType, QueryBuilderMapType
  >,

  QuerchyDefinitionType extends QuerchyDefinition<
    CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType
  >,

  ExtraDependencies = any,
> {
  querchy : Querchy<
    CommonConfigType,
    ModelMapType,
    QueryBuilderMapType,
    ExtraActionCreatorsType,
    QuerchyDefinitionType,
    ExtraDependencies
  >;

  reducerSet : ReducerSets<
    CommonConfigType,
    ModelMapType
  >;

  allResourceReducers : {
    [s : string]: SliceReducer,
  };

  extraGlobalReducer?: GlobalReducer;

  rootReducer : RootReducer;

  constructor(
    querchy : Querchy<
      CommonConfigType,
      ModelMapType,
      QueryBuilderMapType,
      ExtraActionCreatorsType,
      QuerchyDefinitionType,
      ExtraDependencies
    >,
  ) {
    this.querchy = querchy;
    // console.log('querchy :', querchy.querchyDefinition);
    this.reducerSet = <any>{};
    this.allResourceReducers = {};
    this.rootReducer = () => {};
    this.init();
  }

  createResourceMergerForResponse = (
    actionType : string,
    merger : ResourceMerger<QcBasicAction>,
  ) : ResourceMerger<QcResponseAction> => {
    return (
      state = {
        metadataMap: {},
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
    merger : GlobalMerger<QcBasicAction>,
  ) : GlobalMerger<QcResponseAction> => {
    return (
      state = {},
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
          const reducer : BasicResourceMerger = <BasicResourceMerger>this.createResourceMergerForResponse(
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
          metadataMap: {},
          resourceMap: {},
        },
        action,
      ) => {
        return reducerArray.reduce((s, r) => r(s, action), state);
      };
    });

    {
      const reducers : { [s : string] : GlobalReducer } = {};
      const reducerArray : GlobalReducer[] = [];

      const actions = extraActionCreators.actions!;
      const queryInfos = extraActionCreators.queryInfos! || {};

      Object.keys(extraActionCreators.queryInfos).forEach((actionKey) => {
        if (queryInfos[actionKey] && queryInfos[actionKey].globalMerger) {
          const { actionType } = actions[actionKey].creatorRefs.respond;
          const reducer : BasicGlobalMerger = <BasicGlobalMerger>this.createGlobalMergerForResponse(
            actionType,
            queryInfos[actionKey].globalMerger!,
          );
          reducers[actionKey] = reducer;
          reducerArray.push(reducer);
        }
      });
      (<any>this.reducerSet.extra) = reducers;
      this.extraGlobalReducer = (
        state = {},
        action,
      ) => {
        return reducerArray.reduce((s, r) => r(s, action), state);
      };
    }
    const resourceReducerRoot = combineReducers(this.allResourceReducers);
    this.rootReducer = (state : any, ...args : any) => {
      const newState = resourceReducerRoot(state, ...args);
      return (<any>this.extraGlobalReducer!)(newState, ...args);
    };
  }

  getEpicByActionType(
    actionType : string,
  ) : Epic<
    QcAction,
    QcAction,
    QcState,
    QcDependencies<
      CommonConfigType,
      ModelMapType,
      QueryBuilderMapType,
      ExtraActionCreatorsType,
      QuerchyDefinitionType,
      ExtraDependencies
    >
  > {
    return (action$, store$, dependencies, ...args) => action$.pipe(
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

  getRootEpic() : Epic<
    QcAction,
    QcAction,
    QcState,
    QcDependencies<
      CommonConfigType,
      ModelMapType,
      QueryBuilderMapType,
      ExtraActionCreatorsType,
      QuerchyDefinitionType,
      ExtraDependencies
    >
  > {
    const { models } = this.querchy.querchyDefinition;
    const extraActionCreators = this.querchy.querchyDefinition.extraActionCreators!;
    return combineEpics(
      ...Object.keys(models)
      .filter(modelName => models[modelName].actionTypes!['updateCache'])
      .map<Epic<
        QcAction,
        QcAction,
        QcState,
        QcDependencies<
          CommonConfigType,
          ModelMapType,
          QueryBuilderMapType,
          ExtraActionCreatorsType,
          QuerchyDefinitionType,
          ExtraDependencies
        >
      >>(modelName => this.getEpicByActionType(
        models[modelName].actionTypes!['updateCache'],
      )),
      // ...Object.values(extraActionCreators.queryInfos)
      // .map<Epic<
      //   QcAction,
      //   QcAction,
      //   QcState,
      //   QcDependencies<
      //     CommonConfigType,
      //     ModelMapType,
      //     QueryBuilderMapType,
      //     ExtraActionCreatorsType,
      //     QuerchyDefinitionType,
      //     ExtraDependencies
      //   >
      // >>(
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
