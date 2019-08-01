import {
  QcAction,
} from '~/common/interfaces';

import {
  CommonConfig,
  ModelMap,
  QueryCreatorMap,
  ExtraActionCreators,
  QuerchyDefinition,
} from '~/core/interfaces';

import {
  SliceReducer,
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

  allReducers : SliceReducer[];

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
    this.allReducers = [];
    this.init();
  }

  init() {
    const {
      models,
    } = this.querchy.querchyDefinition;
    Object.keys(models).forEach((key) => {
      const model = models[key];
      const actions = model.actions!;

      const reducers : { [s : string] : SliceReducer } = {};
      Object.keys(actions).forEach((actionKey) => {
        const { actionType } = actions[actionKey].creatorRefs.respond;
        reducers[actionKey] = (state, action) => {
          if (
            action.type === actionType
            // action.crudSubType === 'respond'
            && action.response
            && action.response.data
            && action.response.data.args
            && action.response.data.args.id
          ) {
            return {
              ...state,
              [action.response.data.args.id]: action.response.data,
            };
          }
          return state;
        };
        this.allReducers.push(reducers[actionKey]);
      });
      (<any>this.reducerSet[key]) = reducers;
    });
  }

  reduce(state: any, action: QcAction) : any {
    return this.allReducers.reduce((s, r) => r(s, action), state);
  }
}
