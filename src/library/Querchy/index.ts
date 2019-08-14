import { Epic, createEpicMiddleware, combineEpics } from 'pure-epic';
import { ObservableInput } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { toUnderscore } from '~/common/common-functions';

import {
  QcAction,
  QcState,
  QcActionCreatorWithProps,
} from '~/common/interfaces';

import {
  CommonConfig,
  SimpleQueryRunner,
  ModelMap,
  QueryBuilderDefinition,
  QueryBuilderMap,
  ExtraActionCreators,
  QuerchyDefinition,
  QcDependencies,
  INIT_FUNC,
  ModelQueryActionCreatorSet,
  ActionCreatorSets,
  ExtraActionInfoBase,
} from '~/core/interfaces';

import {
  ReplaceReturnType,
} from '~/utils/helper-functions';

import {
  createModelActionTypes,
  createModelActionCreators,
  createExtraActionTypes,
  createExtraActionCreators,
} from './actionCreatorHelpers';

export default class Querchy<
  CommonConfigType extends CommonConfig = CommonConfig,
  ModelMapType extends ModelMap<
    CommonConfigType
  > = ModelMap<CommonConfigType>,
  QueryBuilderMapType extends QueryBuilderMap<
    CommonConfigType, ModelMapType
  > = QueryBuilderMap<CommonConfigType, ModelMapType>,
  ExtraActionCreatorsType extends ExtraActionCreators<
    CommonConfigType, ModelMapType, QueryBuilderMapType
  > = ExtraActionCreators<
    CommonConfigType, ModelMapType, QueryBuilderMapType
  >,

  QuerchyDefinitionType extends QuerchyDefinition<
    CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType
  > = QuerchyDefinition<
    CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType
  >,

  ExtraDependencies = any,
> {
  querchyDefinition : QuerchyDefinitionType;
  deps : QcDependencies<
    CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependencies
  >;

  actionCreatorSets: ActionCreatorSets<
    CommonConfigType,
    ModelMapType,
    ExtraActionCreatorsType
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
    const { queryBuilders, commonConfig, models } = this.querchyDefinition;

    // normalize commonConfig
    if (!commonConfig.getActionTypeName) {
      commonConfig.getActionTypeName = (
        actionTypePrefix, queryName,
      ) => `${actionTypePrefix}${toUnderscore(queryName).toUpperCase()}`;
    }
    commonConfig.queryRunners = commonConfig.queryRunners || {};

    // normalize queryBuilders
    Object.keys(queryBuilders)
    .forEach((key) => {
      const queryBuilder = queryBuilders[key];
      const { queryRunner } = queryBuilder!;
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
      queryBuilder!.queryRunner = runner;
    });

    Object.keys(models)
    .forEach((key) => {
      models[key].crudNames = [];
      Object.keys(models[key].queryInfos).forEach((key2) => {
        if (!models[key].crudNames!.includes(key2)) {
          models[key].crudNames!.push(key2);
        }
      });
      models[key].actionNames = [];
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

      const model = models[key];
      if (model.queryBuilderName) {
        if (!queryBuilders[model.queryBuilderName]) {
          throw new Error(`no queryBuilder found: ${model.queryBuilderName}`);
        }
      } else {
        model.queryBuilderName = 'defaultBuilder';
      }
    });

    // normalize extraActionCreators
    this.querchyDefinition.extraActionCreators = this.querchyDefinition.extraActionCreators || <any>{ [INIT_FUNC] : () => {} };
    const extraActionCreators = this.querchyDefinition.extraActionCreators!;
    extraActionCreators[INIT_FUNC](models, this);
    const { actionTypePrefix = '' } = commonConfig;
    extraActionCreators.actionTypes = createExtraActionTypes(commonConfig, extraActionCreators);
    extraActionCreators.actions = createExtraActionCreators<CommonConfigType, ExtraActionCreatorsType>(commonConfig, extraActionCreators);
    this.actionCreatorSets.extra = Object.keys(extraActionCreators.actions!)
    .reduce(
      (extra, key) => {
        if (typeof key === 'string') {
          const type = commonConfig.getActionTypeName!(actionTypePrefix, `extra/${key}`);
          return { ...extra, [key]: extraActionCreators.actions![key] };
        }
        return extra;
      },
      <any>{},
    );

    Object.values(extraActionCreators.queryInfos!)
    .forEach((actionInfo) => {
      if (actionInfo.queryBuilderName) {
        if (!queryBuilders[actionInfo.queryBuilderName]) {
          throw new Error(`no queryBuilder found: ${actionInfo.queryBuilderName}`);
        }
      } else {
        actionInfo.queryBuilderName = 'defaultBuilder';
      }
    });
  }

  getHandleQueryEpicFromQueryBuilderByActionType(
    actionType : string,
    queryBuilder: QueryBuilderDefinition<
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
      QueryBuilderMapType,
      ExtraActionCreatorsType,
      QuerchyDefinitionType,
      ExtraDependencies
    >
  > {
    const runner = (<SimpleQueryRunner>queryBuilder!.queryRunner!);
    return (action$, store$, dependencies, ...args) => action$.ofType(actionType)
    .pipe(
      mergeMap<QcAction, ObservableInput<QcAction>>((action) => {
        return runner.handleQuery(action, queryBuilder, {
          action$, store$, dependencies, args,
        });
      }),
    );
  }

  getEpicForModels() : Epic<
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
    const { queryBuilders, models } = this.querchyDefinition;
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
        const queryBuilder = queryBuilders[model.queryBuilderName!];
        // console.log('model.queryBuilder :', model.queryBuilder);
        return combineEpics(
          ...Object.values(model.actionTypes!)
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
            actionType => this.getHandleQueryEpicFromQueryBuilderByActionType(
              actionType!, queryBuilder!,
            ),
          ),
        );
      }),
    );
  }

  getEpicForExtraActions() : Epic<
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
    const { queryBuilders } = this.querchyDefinition;
    const extraActionCreators = this.querchyDefinition.extraActionCreators!;
    return combineEpics(
      ...Object.values(extraActionCreators.queryInfos!)
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
      >>((actionInfo) => {
        console.log('extraActionCreators.actionTypes :', extraActionCreators.actionTypes);
        const queryBuilder = queryBuilders[actionInfo.queryBuilderName!];
        // console.log('actionInfo.queryBuilder :', actionInfo.queryBuilder);
        return <Epic<
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
        >>this.getHandleQueryEpicFromQueryBuilderByActionType(
          actionInfo.actionType!, queryBuilder!,
        );
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
    return combineEpics(
      this.getEpicForModels(),
      this.getEpicForExtraActions(),
    );
  }
}
