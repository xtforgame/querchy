import { Epic, createEpicMiddleware } from 'pure-epic';
import { ObservableInput } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import AxiosRunner from '~/query-runners/AxiosRunner';

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
  deps : QcDependencies<CommonConfigType, ModelMapType, QueryCreatorMapType, QuerchyDefinitionType, ExtraDependencies>;

  constructor(querchyDefinitionType : QuerchyDefinitionType, deps?: ExtraDependencies) {
    this.deps = {
      ...deps!,
      querchyDef: querchyDefinitionType,
    };
  }

  testRun(resolve: Function, data : any) {
    const runner = new AxiosRunner<QcAction, QcAction, QcState, CommonConfigType, ModelMapType, QueryCreatorMapType, QuerchyDefinitionType, QcDependencies<CommonConfigType, ModelMapType, QueryCreatorMapType, QuerchyDefinitionType, ExtraDependencies>>();
    const rootEpic : Epic<QcAction, QcAction, QcState, QcDependencies<CommonConfigType, ModelMapType, QueryCreatorMapType, QuerchyDefinitionType, ExtraDependencies>> = (
      action$, store$, dependencies, ...args
    ) => action$.ofType('XX/FIRST')
    .pipe(
      mergeMap<QcAction, ObservableInput<QcAction>>((action) => {
        return runner.handle(action, {
          action$, store$, dependencies, args,
        });
      }),
    );

    const epicMiddleware =
      createEpicMiddleware<QcAction, QcState, QcStore<QcAction, QcState>, QcDependencies<CommonConfigType, ModelMapType, QueryCreatorMapType, QuerchyDefinitionType, ExtraDependencies>>({
        dependencies: this.deps,
      });
    const epicMiddlewareCb = epicMiddleware({
      dispatch: (action) => {
        // console.log('action :', action);
        epicMiddlewareCb(() => {})(action);
        if (action.type === 'XX/FIRST_CANCEL' || action.type === 'XX/FIRST_SUCCESS') {
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
