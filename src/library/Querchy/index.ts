import { Epic, createEpicMiddleware, combineEpics } from 'pure-epic';
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
  SimpleQueryRunner,
  ModelMap,
  QueryCreatorDefinition,
  QueryCreatorMap,
  ExtraActionCreators,
  QuerchyDefinition,
  QcDependencies,
  INIT_FUNC,
  InitFunctionKeyType,

  ModelActionCreators,
  ModelActionCreatorSet,
  ActionCreatorSets,

  AnyActionCreatorWithProps,
} from '~/core/interfaces';

import {
  ReplaceReturnType,
} from '~/utils/helper-functions';

import {
  createModelActionTypes,
  createModelActions,
} from './actionCreatorHelpers';

export default class Querchy<
  CommonConfigType extends CommonConfig = CommonConfig,
  ModelMapType extends ModelMap<
    CommonConfigType
  > = ModelMap<CommonConfigType>,
  QueryCreatorMapType extends QueryCreatorMap<
    CommonConfigType, ModelMapType
  > = QueryCreatorMap<CommonConfigType, ModelMapType>,
  ExtraActionCreatorsType extends ExtraActionCreators<
    CommonConfigType, ModelMapType, QueryCreatorMapType
  > = ExtraActionCreators<
    CommonConfigType, ModelMapType, QueryCreatorMapType
  >,

  QuerchyDefinitionType extends QuerchyDefinition<
    CommonConfigType, ModelMapType, QueryCreatorMapType, ExtraActionCreatorsType
  > = QuerchyDefinition<
    CommonConfigType, ModelMapType, QueryCreatorMapType, ExtraActionCreatorsType
  >,

  ExtraDependencies = any,
> {
  querchyDefinition : QuerchyDefinitionType;
  deps : QcDependencies<
    CommonConfigType, ModelMapType, QueryCreatorMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependencies
  >;

  actionCreatorSets: ActionCreatorSets<
    CommonConfigType,
    ModelMapType,
    ModelActionCreatorSet<
      CommonConfigType, {}, ExtraActionCreatorsType
    >
  >;

  constructor(
    querchyDefinition : QuerchyDefinitionType,
    deps?: ExtraDependencies
  ) {
    this.actionCreatorSets = <any>{};
    this.querchyDefinition = querchyDefinition;
    this.normalizeQuerchyDefinition();
    this.deps = {
      ...deps!,
      querchyDef: this.querchyDefinition,
    };
  }

  normalizeQuerchyDefinition() {
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
      queryCreator!.queryRunner = runner;
    });

    // normalize extraActionCreators
    this.querchyDefinition.extraActionCreators = this.querchyDefinition.extraActionCreators || <any>{ [INIT_FUNC] : () => {} };
    this.querchyDefinition.extraActionCreators![INIT_FUNC](null);
    this.actionCreatorSets.extra = this.querchyDefinition.extraActionCreators!;
    Object.keys(models)
    .forEach((key) => {
      models[key].actionTypes = createModelActionTypes(key, commonConfig);
      models[key].actions = createModelActions(key, models[key].actionTypes!);
      (<any>this.actionCreatorSets)[key] = models[key].actions;
    });

    // normalize models P2
    Object.keys(models)
    .forEach((key) => {
      const model = models[key];
      if (model.queryCreator) {
        if (!queryCreators[model.queryCreator]) {
          throw new Error(`no queryCreator found: ${model.queryCreator}`);
        }
      } else {
        model.queryCreator = 'defaultCreator';
      }
    });
  }

  getEpicFromQueryCreatorByActionType(
    actionType : string,
    queryCreator: QueryCreatorDefinition<
      CommonConfigType,
      ModelMapType
    >,
  ) : Epic<
    QcAction,
    QcAction,
    QcState,
    QcDependencies<
      CommonConfigType,
      ModelMapType,
      QueryCreatorMapType,
      ExtraActionCreatorsType,
      QuerchyDefinitionType,
      ExtraDependencies
    >
  > {
    const runner = (<SimpleQueryRunner>queryCreator!.queryRunner!);
    return (action$, store$, dependencies, ...args) => action$.ofType(actionType)
    .pipe(
      mergeMap<QcAction, ObservableInput<QcAction>>((action) => {
        return runner.handle(action, queryCreator, {
          action$, store$, dependencies, args,
        });
      }),
    );
  }

  getAllEpics() : Epic<
    QcAction,
    QcAction,
    QcState,
    QcDependencies<
      CommonConfigType,
      ModelMapType,
      QueryCreatorMapType,
      ExtraActionCreatorsType,
      QuerchyDefinitionType,
      ExtraDependencies
    >
  > {
    const { queryCreators, models } = this.querchyDefinition;
    return combineEpics(
      ...Object.values(models)
      .map<Epic<
        QcAction,
        QcAction,
        QcState,
        QcDependencies<
          CommonConfigType,
          ModelMapType,
          QueryCreatorMapType,
          ExtraActionCreatorsType,
          QuerchyDefinitionType,
          ExtraDependencies
        >
      >>((model) => {
        const queryCreator = queryCreators[model.queryCreator!];
        // console.log('model.queryCreator :', model.queryCreator);
        return combineEpics(
          ...Object.values(model.actionTypes!)
          .map<Epic<
            QcAction,
            QcAction,
            QcState,
            QcDependencies<
              CommonConfigType,
              ModelMapType,
              QueryCreatorMapType,
              ExtraActionCreatorsType,
              QuerchyDefinitionType,
              ExtraDependencies
            >
          >>(
            (actionType) => {
              return this.getEpicFromQueryCreatorByActionType(
                actionType, queryCreator!,
              );
            },
          ),
        );
      }),
    );
  }

  testRun(resolve: Function, data : any) {
    const rootEpic = this.getAllEpics();

    const epicMiddleware = createEpicMiddleware<
      QcAction,
      QcState,
      QcStore<QcState>,
      QcDependencies<
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
        // console.log('action :', action.type);
        epicMiddlewareCb(() => {})(action);

        const actionCreator : AnyActionCreatorWithProps = (<any>action).actionCreator;
        if (actionCreator) {
          const {
            respond,
            respondError,
            cancel,
          } = actionCreator.creatorRefs;
          if (
            action.type === cancel.actionType
            || action.type === respond.actionType
            || action.type === respondError.actionType
          ) {
            resolve(data);
          }
        }
      },
      getState: () => ({ xxx: 1 }),
    });
    epicMiddleware.run(rootEpic);
    epicMiddlewareCb(() => {})(<QcAction><any>this.actionCreatorSets.httpBinRes.create({}));
    // epicMiddlewareCb(() => {})({ type: 'CANCEL' });

    // const readAction = this.actionCreatorSets.httpBinRes.read('ss');
    // console.log('readAction :', readAction);
    // const updateAction = this.actionCreatorSets.httpBinRes.update('ss', {});
    // console.log('updateAction :', updateAction);
    // const deleteAction = this.actionCreatorSets.httpBinRes.delete('ss');
    // console.log('deleteAction :', deleteAction);
  }
}
