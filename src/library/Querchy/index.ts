import { Epic, createEpicMiddleware, combineEpics } from 'pure-epic';
import { ObservableInput } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import AxiosRunner from '~/query-runners/AxiosRunner';
import { toUnderscore } from '~/common/common-functions';

import {
  QcAction,
  QcState,
  QcStore,
} from '~/common/interfaces';

import {
  CommonConfig,
  ModelMap,
  QueryCreatorMap,
  QuerchyDefinition,
  QcDependencies,
} from '~/core/interfaces';

export default class Querchy<
  CommonConfigType extends CommonConfig = CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType> = ModelMap<CommonConfigType>,
  QueryCreatorMapType extends QueryCreatorMap<
    CommonConfigType, ModelMapType
  > = QueryCreatorMap<CommonConfigType, ModelMapType>,
  QuerchyDefinitionType extends QuerchyDefinition<
    CommonConfigType, ModelMapType, QueryCreatorMapType
  > = QuerchyDefinition<CommonConfigType, ModelMapType, QueryCreatorMapType>,

  ExtraDependencies = any,
> {
  querchyDefinition : QuerchyDefinitionType;
  deps : QcDependencies<
    CommonConfigType, ModelMapType, QueryCreatorMapType, QuerchyDefinitionType, ExtraDependencies
  >;

  constructor(querchyDefinition : QuerchyDefinitionType, deps?: ExtraDependencies) {
    this.querchyDefinition = querchyDefinition;
    const queryCreatorMap = this.normalizeQuerchyDefinition();
    this.deps = {
      ...deps!,
      queryCreatorMap,
      querchyDef: this.querchyDefinition,
    };
  }

  normalizeQuerchyDefinition() : QueryCreatorMap<CommonConfigType, ModelMapType> {
    const queryCreatorMap : QueryCreatorMap<CommonConfigType, ModelMapType> = {};
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
    return queryCreatorMap;
  }

  getAllEpics() : Epic<
    QcAction,
    QcAction,
    QcState,
    QcDependencies<
      CommonConfigType,
      ModelMapType,
      QueryCreatorMapType,
      QuerchyDefinitionType,
      ExtraDependencies
    >
  > {
    const { queryCreators, commonConfig } = this.querchyDefinition;
    return combineEpics(
      ...Object.keys(queryCreators)
      .map<Epic<
        QcAction,
        QcAction,
        QcState,
        QcDependencies<
          CommonConfigType,
          ModelMapType,
          QueryCreatorMapType,
          QuerchyDefinitionType,
          ExtraDependencies
        >
      >>((key) => {
        // queryCreator!.queryRunner = new AxiosRunner<
        //   QcAction,
        //   QcAction,
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
          mergeMap<QcAction, ObservableInput<QcAction>>((action) => {
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
      QcAction,
      QcState,
      QcStore<
        QcAction,
        QcState
      >,
      QcDependencies<
        CommonConfigType,
        ModelMapType,
        QueryCreatorMapType,
        QuerchyDefinitionType,
        ExtraDependencies
      >>({
        dependencies: this.deps,
      });
    const epicMiddlewareCb = epicMiddleware({
      dispatch: (action) => {
        // console.log('action :', action);
        epicMiddlewareCb(() => {})(action);
        if (action.type === 'XX/FIRST_CANCEL' || action.type === 'XX/FIRST_SUCCESS' || action.type === 'XX/FIRST_ERROR') {
          resolve(data);
        }
      },
      getState: () => ({ xxx: 1 }),
    });
    epicMiddleware.run(rootEpic);
    epicMiddlewareCb(() => {})({ type: 'XX/FIRST' });
    // epicMiddlewareCb(() => {})({ type: 'CANCEL' });
  }
}
