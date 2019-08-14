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
  Merger,
  BasicMerger,
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

  allReducers : { [s : string]: SliceReducer };

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
    this.allReducers = {};
    this.rootReducer = () => {};
    this.init();
  }

  createResponseMerger = (
    actionType : string,
    merger : Merger<QcBasicAction>,
  ) : Merger<QcResponseAction> => {
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

  init() {
    const { models } = this.querchy.querchyDefinition;
    Object.keys(models)
    .forEach((key) => {
      const reducers : { [s : string] : SliceReducer } = {};
      const reducerArray : SliceReducer[] = [];

      const model = models[key];
      const actions = model.actions!;
      const queryInfos = model.queryInfos! || {};

      Object.keys(queryInfos).forEach((actionKey) => {
        if (queryInfos[actionKey] && queryInfos[actionKey].mergerCreator) {
          const { actionType } = actions[actionKey].creatorRefs.respond;
          const reducer : BasicMerger = <BasicMerger>this.createResponseMerger(
            actionType,
            queryInfos[actionKey].mergerCreator!,
          );
          reducers[actionKey] = reducer;
          reducerArray.push(reducer);
        }
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
        return [{ type: 'XXX' }];
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
    return combineEpics(
      ...Object.values(models)
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
      >>((model) => {
        return combineEpics(
          ...Object.values(model.actions!)
          .filter(a => a.creatorRefs)
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
          >>(
            (action) => {
              return this.getEpicByActionType(
                action.creatorRefs.respond.actionType,
              );
            },
          ),
        );
      }),
    );
  }

  reduce(state: any, action: QcAction) : any {
    return this.rootReducer(state, action);
  }
}
