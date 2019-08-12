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
  SimpleQueryRunner,
  ModelMap,
  QueryCreatorDefinition,
  QueryCreatorMap,
  ExtraActionCreators,
  QuerchyDefinition,
  QcDependencies,
  INIT_FUNC,
  ModelQueryActionCreatorSet,
  ActionCreatorSets,
} from '~/core/interfaces';

import {
  ReplaceReturnType,
} from '~/utils/helper-functions';

import {
  createModelActionTypes,
  createModelActionCreators,
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
    ModelQueryActionCreatorSet<
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
        if (!runner) {
          throw new Error(`no runner found: ${queryRunner}`);
        }
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
      models[key].crudNames = models[key].crudNames || [];
      Object.keys(models[key].queryInfos).forEach((key2) => {
        if (!models[key].crudNames!.includes(key2)) {
          models[key].crudNames!.push(key2);
        }
      });
      models[key].actionNames = models[key].actionNames || [];
      Object.keys(models[key].actionInfos).forEach((key2) => {
        if (!models[key].actionNames!.includes(key2)) {
          models[key].actionNames!.push(key2);
        }
      });
      models[key].actionTypes = createModelActionTypes(key, commonConfig, models[key]);
      models[key].actions = createModelActionCreators(commonConfig, key, models[key]);
      (<any>this.actionCreatorSets)[key] = models[key].actions;
      models[key].buildUrl = models[key].buildUrl || (
        (action) => {
          if (action.crudType === 'create') {
            return models[key].url;
          }
          return `${models[key].url}/${action.id}`;
        }
      );
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

  getHandleQueryEpicFromQueryCreatorByActionType(
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
        return runner.handleQuery(action, queryCreator, {
          action$, store$, dependencies, args,
        });
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
            actionType => this.getHandleQueryEpicFromQueryCreatorByActionType(
              actionType!, queryCreator!,
            ),
          ),
        );
      }),
    );
  }
}
