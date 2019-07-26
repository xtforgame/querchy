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
} & {
  [s : string] : { [s : string] : QcActionCreator<ActionType> };
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
  > = QuerchyDefinition<ActionType, CommonConfigType, ModelMapType, QueryCreatorMapType, ExtraActionCreatorsType>,

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
    this.querchyDefinition = querchyDefinition;
    const queryCreatorMap = this.normalizeQuerchyDefinition();
    this.deps = {
      ...deps!,
      queryCreatorMap,
      querchyDef: this.querchyDefinition,
    };
    this.actionCreatorSets = <any>{};
  }

  normalizeQuerchyDefinition() : QueryCreatorMap<ActionType, CommonConfigType, ModelMapType> {
    const queryCreatorMap : QueryCreatorMap<ActionType, CommonConfigType, ModelMapType> = {};
    const { queryPrefix = '' } = this.querchyDefinition.commonConfig;
    const { queryCreators, commonConfig } = this.querchyDefinition;
    if (!commonConfig.getActionTypeName) {
      commonConfig.getActionTypeName = (
        queryPrefix, queryName,
      ) => `${queryPrefix}${toUnderscore(queryName).toUpperCase()}`;
    }
    commonConfig.queryRunners = commonConfig.queryRunners || {};
    Object.keys(queryCreators)
    .forEach((key) => {
      const newKey = commonConfig.getActionTypeName!(queryPrefix, key);
      queryCreatorMap[newKey] = queryCreators[key];
    });
    this.querchyDefinition.extraActionCreators = this.querchyDefinition.extraActionCreators || <any>{ [INIT_FUNC] : () => {} };
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
        epicMiddlewareCb(() => {})(action);
        if (action.type === 'XX/POST_HTTP_BIN_CANCEL' || action.type === 'XX/POST_HTTP_BIN_SUCCESS' || action.type === 'XX/POST_HTTP_BIN_ERROR') {
          resolve(data);
        }
      },
      getState: () => ({ xxx: 1 }),
    });
    epicMiddleware.run(rootEpic);
    epicMiddlewareCb(() => {})(<ActionType>{ type: 'XX/POST_HTTP_BIN' });
    // epicMiddlewareCb(() => {})({ type: 'CANCEL' });
  }
}
