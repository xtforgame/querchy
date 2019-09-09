import { Epic, createEpicMiddleware, combineEpics, Action } from 'pure-epic';
import { ObservableInput } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { toUnderscore } from '../common/common-functions';

import {
  QcAction,
  QcState,
  QcEpic,
  QcActionCreatorWithProps,
} from '../common/interfaces';

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
  PromiseActionCreatorSets,
} from '../core/interfaces';

import {
  ReplaceReturnType,
} from '../utils/helper-functions';

import {
  createModelActionTypes,
  createModelActionCreators,
  createPromiseModelActionCreators,
  createExtraActionTypes,
  createExtraActionCreators,
  createExtraPromiseModelActionCreators,
} from './actionCreatorHelpers';

import toBuildRequestConfigFunction from '../utils/toBuildRequestConfigFunction';
import namespaces, { defaultNamespaceName } from './namespaces';

export * from './namespaces';
export { default as namespaces } from './namespaces';
export { default as createQuerchyMiddleware } from './createQuerchyMiddleware';

export type QuerchyTypeGroup<
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
> = {
  CommonConfigType: CommonConfigType;
  ModelMapType: ModelMapType;
  QueryBuilderMapType: QueryBuilderMapType;
  ExtraActionCreatorsType: ExtraActionCreatorsType;
  QuerchyDefinitionType: QuerchyDefinitionType;
  ExtraDependenciesType: ExtraDependenciesType;

  // ========================

  QcDependenciesType: QcDependencies<
    CommonConfigType,
    ModelMapType,
    QueryBuilderMapType,
    ExtraActionCreatorsType,
    QuerchyDefinitionType,
    ExtraDependenciesType
  >;

  ActionCreatorSetsType: ActionCreatorSets<
    CommonConfigType,
    ModelMapType,
    ExtraActionCreatorsType
  >;

  PromiseActionCreatorSetsType: PromiseActionCreatorSets<
    CommonConfigType,
    ModelMapType,
    ExtraActionCreatorsType
  >;

  QueryBuilderDefinitionType: QueryBuilderDefinition<
    CommonConfigType,
    ModelMapType
  >;

  EpicType: QcEpic;
};

export type QuerchyConstructor<
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

  QuerchyTypeGroupType extends QuerchyTypeGroup<
    CommonConfigType,
    ModelMapType,
    QueryBuilderMapType,
    ExtraActionCreatorsType,
    QuerchyDefinitionType,
    ExtraDependencies
  > = QuerchyTypeGroup<
    CommonConfigType,
    ModelMapType,
    QueryBuilderMapType,
    ExtraActionCreatorsType,
    QuerchyDefinitionType,
    ExtraDependencies
  >
> = (
  querchyDefinition : QuerchyDefinitionType,
  deps?: ExtraDependencies,
) => any;

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

  QuerchyTypeGroupType extends QuerchyTypeGroup<
    CommonConfigType,
    ModelMapType,
    QueryBuilderMapType,
    ExtraActionCreatorsType,
    QuerchyDefinitionType,
    ExtraDependencies
  > = QuerchyTypeGroup<
    CommonConfigType,
    ModelMapType,
    QueryBuilderMapType,
    ExtraActionCreatorsType,
    QuerchyDefinitionType,
    ExtraDependencies
  >
> {
  querchyDefinition : QuerchyDefinitionType;
  deps : QuerchyTypeGroupType['QcDependenciesType'];

  actionCreatorSets: QuerchyTypeGroupType['ActionCreatorSetsType'];
  promiseActionCreatorSets: QuerchyTypeGroupType['PromiseActionCreatorSetsType'];

  constructor(
    querchyDefinition : QuerchyDefinitionType,
    deps?: ExtraDependencies,
  ) {
    this.actionCreatorSets = <any>{};
    this.promiseActionCreatorSets = <any>{};
    this.querchyDefinition = querchyDefinition;
    this.normalizeQuerchyDefinition();
    this.deps = {
      ...deps!,
      querchyDef: this.querchyDefinition,
    };
  }

  normalizeQuerchyDefinition() {
    this.querchyDefinition.namespace = this.querchyDefinition.namespace || defaultNamespaceName;
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
      if (queryBuilder) {
        queryBuilder
          .buildRequestConfig = toBuildRequestConfigFunction<CommonConfigType, ModelMapType>(
            queryBuilder.buildRequestConfig,
          );
      }
    });
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
      if (models[key].feature) {
        const featureForModel = models[key].feature!.getFeatureForModel(models[key]);
        models[key].queryInfos = {
          ...models[key].queryInfos,
          ...featureForModel.getQueryInfos(),
        };
        models[key].actionInfos = {
          ...models[key].actionInfos,
          ...featureForModel.getActionInfos(),
        };
      }
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
      models[key].buildUrl = models[key].buildUrl
        || commonConfig.defaultBuildUrl.bind(commonConfig);
      models[key].actionTypes = createModelActionTypes(key, commonConfig, models[key]);
      models[key].actions = createModelActionCreators(commonConfig, key, models[key]);
      (<any>this.actionCreatorSets)[key] = models[key].actions;
      const promiseActions = createPromiseModelActionCreators(
        this.dispatch, commonConfig, key, models[key],
      );
      (<any>this.promiseActionCreatorSets)[key] = promiseActions;

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
    this.querchyDefinition.extraActionCreators = this.querchyDefinition.extraActionCreators
      || <any>{ [INIT_FUNC] : () => {} };
    const extraActionCreators = this.querchyDefinition.extraActionCreators!;
    extraActionCreators[INIT_FUNC](models, this);
    const { actionTypePrefix = '' } = commonConfig;
    extraActionCreators.actionTypes = createExtraActionTypes(commonConfig, extraActionCreators);
    extraActionCreators
      .actions = createExtraActionCreators<CommonConfigType, ExtraActionCreatorsType>(
        commonConfig, extraActionCreators,
      );
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
    const promiseActions = createExtraPromiseModelActionCreators(
      this.dispatch, commonConfig, extraActionCreators,
    );
    this.promiseActionCreatorSets.extra = Object.keys(promiseActions)
    .reduce(
      (extra, key) => {
        if (typeof key === 'string') {
          const type = commonConfig.getActionTypeName!(actionTypePrefix, `extra/${key}`);
          return { ...extra, [key]: promiseActions[key] };
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

  getStore = () => {
    return namespaces[this.querchyDefinition.namespace!].store;
  }

  dispatch = (action : Action) => {
    const store = this.getStore();
    if (!store) {
      throw new Error(`store not found for namespace: ${
        this.querchyDefinition.namespace
      }, did you forget to attach 'createQuerchyMiddleware' to redux ?`);
    }
    return this.getStore().dispatch(action);
  }

  getHandleQueryEpicFromQueryBuilderByActionType(
    actionType : string,
    queryBuilder: QuerchyTypeGroupType['QueryBuilderDefinitionType'],
  ) : QuerchyTypeGroupType['EpicType'] {
    const runner = (<SimpleQueryRunner>queryBuilder!.queryRunner!);
    return (action$, state$, ...args) => action$.ofType(actionType)
    .pipe(
      mergeMap<QcAction, ObservableInput<any>>((action) => {
        const modelRootState = this.deps.querchyDef.baseSelector(state$.value);
        return runner.handleQuery(action, queryBuilder, this.deps, {
          action$, state$, args, modelRootState,
        });
      }),
    );
  }

  getEpicForModels() : QuerchyTypeGroupType['EpicType'] {
    const { queryBuilders, models } = this.querchyDefinition;
    return combineEpics(
      ...Object.values(models)
      .map<QuerchyTypeGroupType['EpicType']>((model) => {
        const queryBuilder = queryBuilders[model.queryBuilderName!];
        // console.log('model.queryBuilder :', model.queryBuilder);
        const { queryInfos } = model;
        return combineEpics(
          ...Object.keys(queryInfos)
          .map<QuerchyTypeGroupType['EpicType']>(
            key => this.getHandleQueryEpicFromQueryBuilderByActionType(
              queryInfos[key].actionType!, queryBuilder!,
            ),
          ),
        );
      }),
    );
  }

  getEpicForExtraActions() : QuerchyTypeGroupType['EpicType'] {
    const { queryBuilders } = this.querchyDefinition;
    const extraActionCreators = this.querchyDefinition.extraActionCreators!;
    return combineEpics(
      ...Object.values(extraActionCreators.queryInfos!)
      .map<QuerchyTypeGroupType['EpicType']>((actionInfo) => {
        const queryBuilder = queryBuilders[actionInfo.queryBuilderName!];
        // console.log('actionInfo.queryBuilder :', actionInfo.queryBuilder);
        return <QuerchyTypeGroupType[
          'EpicType'
        ]>this.getHandleQueryEpicFromQueryBuilderByActionType(
          actionInfo.actionType!, queryBuilder!,
        );
      }),
    );
  }

  getRootEpic() : QuerchyTypeGroupType['EpicType'] {
    return combineEpics(
      this.getEpicForModels(),
      this.getEpicForExtraActions(),
    );
  }
}
