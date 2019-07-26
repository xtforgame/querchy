import { Epic, Action, createEpicMiddleware, combineEpics } from 'pure-epic';
import { ObservableInput } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { toUnderscore } from '~/common/common-functions';

import {
  QcAction,
  QcState,
  QcStore,
  QcActionCreator,
} from '~/common/interfaces';

import {
  CommonConfig,
  ResourceModel,
  ResourceModelActionTypes,
  ResourceModelActions,
  ModelMap,
  QueryCreatorMap,
  ExtraActionCreators,
  QuerchyDefinition,
  QcDependencies,
  INIT_FUNC,
  InitFunctionKeyType,
} from '~/core/interfaces';

import {
  ReplaceReturnType,
} from '~/utils/helper-functions';

export type ModelActionCreators<
  ActionType extends Action,
  CommonConfigType extends CommonConfig,
  T extends Required<ResourceModelActions<ActionType, CommonConfigType>>
> = {
  [P in keyof T] : QcActionCreator<ActionType>;
} & {
  [s : string] : QcActionCreator<ActionType>;
};

export type ModelActionCreatorSet<
  ActionType extends Action,
  CommonConfigType extends CommonConfig,
  T extends ModelMap<ActionType, CommonConfigType>,
  ExtraActionCreatorsType
> = {
  [P in keyof T] : Required<T[P]>['actions'];
} & {
  [P in keyof ExtraActionCreatorsType] : ExtraActionCreatorsType[P];
} & {
  [s : string] : QcActionCreator<ActionType>;
};

export type ActionCreatorSets<
  ActionType extends Action,
  CommonConfigType extends CommonConfig,
  T extends ModelMap<ActionType, CommonConfigType>,
  ExtraActionCreatorSetsType
> = ModelActionCreatorSet<ActionType, CommonConfigType, T, {}> & {
  extra : ExtraActionCreatorSetsType;
};

export default class Querchy<
  ActionType extends Action = QcAction,
  CommonConfigType extends CommonConfig = CommonConfig,
  ModelMapType extends ModelMap<
    ActionType, CommonConfigType
  > = ModelMap<ActionType, CommonConfigType>,
  QueryCreatorMapType extends QueryCreatorMap<
    ActionType, CommonConfigType, ModelMapType
  > = QueryCreatorMap<ActionType, CommonConfigType, ModelMapType>,
  ExtraActionCreatorsType extends ExtraActionCreators<
    ActionType, CommonConfigType, ModelMapType, QueryCreatorMapType
  > = ExtraActionCreators<
    ActionType, CommonConfigType, ModelMapType, QueryCreatorMapType
  >,

  QuerchyDefinitionType extends QuerchyDefinition<
    ActionType, CommonConfigType, ModelMapType, QueryCreatorMapType, ExtraActionCreatorsType
  > = QuerchyDefinition<
    ActionType, CommonConfigType, ModelMapType, QueryCreatorMapType, ExtraActionCreatorsType
  >,

  ExtraDependencies = any,
> {
  querchyDefinition : QuerchyDefinitionType;
  deps : QcDependencies<
    ActionType, CommonConfigType, ModelMapType, QueryCreatorMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependencies
  >;

  actionCreatorSets: ActionCreatorSets<
    ActionType,
    CommonConfigType,
    ModelMapType,
    ModelActionCreatorSet<
      ActionType, CommonConfigType, {}, ExtraActionCreatorsType
    >
  >;

  constructor(
    querchyDefinition : QuerchyDefinitionType,
    deps?: ExtraDependencies
  ) {
    this.actionCreatorSets = <any>{};
    this.querchyDefinition = querchyDefinition;
    const queryCreatorMap = this.normalizeQuerchyDefinition();
    this.deps = {
      ...deps!,
      queryCreatorMap,
      querchyDef: this.querchyDefinition,
    };
  }

  createModelActionTypes(modelName : string, commonConfig : CommonConfigType) : ResourceModelActionTypes<ActionType, CommonConfigType> {
    const { queryPrefix = '' } = this.querchyDefinition.commonConfig;
    return {
      create: commonConfig.getActionTypeName!(queryPrefix, `create_${modelName}`),
      read: commonConfig.getActionTypeName!(queryPrefix, `read_${modelName}`),
      update: commonConfig.getActionTypeName!(queryPrefix, `update_${modelName}`),
      delete: commonConfig.getActionTypeName!(queryPrefix, `delete_${modelName}`),
    };
  }

  createModelActions(modelName : string, actionTypes : ResourceModelActionTypes<ActionType, CommonConfigType>, commonConfig : CommonConfigType) : ResourceModelActions<ActionType, CommonConfigType> {
    return {
      create: Object.assign(
        (data, options?) => (<ActionType><any>{
          type: actionTypes.create,
          modelName,
          actionTypes,
          crudType: 'create',
          data,
          options,
        }),
        { actionType: actionTypes.create },
      ),
      read: Object.assign(
        (resourceId, options?) => (<ActionType><any>{
          type: actionTypes.read,
          modelName,
          actionTypes,
          crudType: 'read',
          id: resourceId,
          options,
        }),
        { actionType: actionTypes.read },
      ),
      update: Object.assign(
        (resourceId, data, options?) => (<ActionType><any>{
          type: actionTypes.update,
          modelName,
          actionTypes,
          crudType: 'update',
          id: resourceId,
          data,
          options,
        }),
        { actionType: actionTypes.update },
      ),
      delete: Object.assign(
        (resourceId, options?) => (<ActionType><any>{
          type: actionTypes.delete,
          modelName,
          actionTypes,
          crudType: 'delete',
          id: resourceId,
          options,
        }),
        { actionType: actionTypes.delete },
      ),
    };
  }

  normalizeQuerchyDefinition() : QueryCreatorMap<ActionType, CommonConfigType, ModelMapType> {
    const queryCreatorMap : QueryCreatorMap<ActionType, CommonConfigType, ModelMapType> = {};
    const { queryPrefix = '' } = this.querchyDefinition.commonConfig;
    const { queryCreators, commonConfig, models } = this.querchyDefinition;

    // normalize commonConfig
    if (!commonConfig.getActionTypeName) {
      commonConfig.getActionTypeName = (
        queryPrefix, queryName,
      ) => `${queryPrefix}${toUnderscore(queryName).toUpperCase()}`;
    }
    commonConfig.queryRunners = commonConfig.queryRunners || {};

    // normalize queryCreators
    Object.keys(queryCreators)
    .forEach((key) => {
      const newKey = commonConfig.getActionTypeName!(queryPrefix, key);
      queryCreatorMap[newKey] = queryCreators[key];
    });

    // normalize extraActionCreators
    this.querchyDefinition.extraActionCreators = this.querchyDefinition.extraActionCreators || <any>{ [INIT_FUNC] : () => {} };
    this.actionCreatorSets.extra = this.querchyDefinition.extraActionCreators!;
    Object.keys(models)
    .forEach((key) => {
      models[key].actionTypes = this.createModelActionTypes(key, commonConfig);
      models[key].actions = this.createModelActions(key, models[key].actionTypes!, commonConfig);
      (<any>this.actionCreatorSets)[key] = models[key].actions;
    });
    return queryCreatorMap;
  }

  getAllEpics() : Epic<
    ActionType,
    ActionType,
    QcState,
    QcDependencies<
      ActionType,
      CommonConfigType,
      ModelMapType,
      QueryCreatorMapType,
      ExtraActionCreatorsType,
      QuerchyDefinitionType,
      ExtraDependencies
    >
  > {
    const { queryCreators, commonConfig } = this.querchyDefinition;
    return combineEpics(
      ...Object.keys(queryCreators)
      .map<Epic<
        ActionType,
        ActionType,
        QcState,
        QcDependencies<
          ActionType,
          CommonConfigType,
          ModelMapType,
          QueryCreatorMapType,
          ExtraActionCreatorsType,
          QuerchyDefinitionType,
          ExtraDependencies
        >
      >>((key) => {
        // queryCreator!.queryRunner = new AxiosRunner<
        //   ActionType,
        //   ActionType,
        //   QcState,
        //   CommonConfigType,
        //   ModelMapType,
        //   QueryCreatorMapType,
        //   QuerchyDefinitionType,
        //   ExtraDependencies>();
        const queryCreator = queryCreators[key];
        const { queryRunner } = queryCreator!;
        let runner : any = queryRunner;
        if (typeof queryRunner === 'string') {
          runner = commonConfig.queryRunners![queryRunner];
        } else if (!queryRunner) {
          runner = commonConfig.defaultQueryRunner;
        }
        if (!runner) {
          throw new Error(`no runner found: ${key}`);
        }
        const actionType = commonConfig.getActionTypeName!(commonConfig.queryPrefix!, key);
        return (action$, store$, dependencies, ...args) => action$.ofType(actionType)
        .pipe(
          mergeMap<ActionType, ObservableInput<ActionType>>((action) => {
            return runner.handle(action, {
              action$, store$, dependencies, args,
            });
          }),
        );
      }),
    );
  }

  testRun(resolve: Function, data : any) {
    const rootEpic = this.getAllEpics();

    const epicMiddleware = createEpicMiddleware<
      ActionType,
      QcState,
      QcStore<
        ActionType,
        QcState
      >,
      QcDependencies<
        ActionType,
        CommonConfigType,
        ModelMapType,
        QueryCreatorMapType,
        ExtraActionCreatorsType,
        QuerchyDefinitionType,
        ExtraDependencies
      >>({
        dependencies: this.deps,
      });
    const epicMiddlewareCb = epicMiddleware({
      dispatch: (action) => {
        // console.log('action.type :', action.type);
        epicMiddlewareCb(() => {})(action);
        if (
          action.type === 'XX/CREATE_HTTP_BIN_RES_CANCEL'
          || action.type === 'XX/CREATE_HTTP_BIN_RES_SUCCESS'
          || action.type === 'XX/CREATE_HTTP_BIN_RES_ERROR'
        ) {
          resolve(data);
        }
      },
      getState: () => ({ xxx: 1 }),
    });
    epicMiddleware.run(rootEpic);
    epicMiddlewareCb(() => {})(this.actionCreatorSets.httpBinRes.create({}));
    // epicMiddlewareCb(() => {})({ type: 'CANCEL' });

    // const readAction = this.actionCreatorSets.httpBinRes.read('ss');
    // console.log('readAction :', readAction);
    // const updateAction = this.actionCreatorSets.httpBinRes.update('ss', {});
    // console.log('updateAction :', updateAction);
    // const deleteAction = this.actionCreatorSets.httpBinRes.delete('ss');
    // console.log('deleteAction :', deleteAction);
  }
}
