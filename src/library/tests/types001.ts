import { Epic, createEpicMiddleware, combineEpics } from 'pure-epic';
import {
  CommonConfig,
  ResourceModel,
  ModelMap,
  QueryCreatorMap,
  QuerchyDefinition,
  QueryCreatorDefinition,
  QcAction,
  QcBasicAction,
  QcState,
  QcStore,
  QcActionCreator,
  QcDependencies,
  INIT_FUNC,
  InitFunctionKeyType,
  ActionCreatorsInitFunction,

  SimpleQueryRunner,

  crudToRestMap,

  Querchy,
  AxiosRunner,
  QcUpdater,
} from '~/index';

export interface CommonConfig001 extends CommonConfig {
  defaultQueryRunner: SimpleQueryRunner;
  queryRunners: {
    customRunner: SimpleQueryRunner;
    [s : string]: SimpleQueryRunner;
  };
  [s : string]: any;
}

export type QcModelMap001 = {
  httpBinRes: ResourceModel<CommonConfig001>;
  [s : string]: ResourceModel<CommonConfig001>;
};

export type QcQueryCreatorMap001 = {
  defaultCreator : QueryCreatorDefinition<CommonConfig001, QcModelMap001>;
  customPath : QueryCreatorDefinition<CommonConfig001, QcModelMap001>;
};

export class QcExtraActionCreators001 {
  [INIT_FUNC] : ActionCreatorsInitFunction;
  [s : string] : QcActionCreator;

  constructor() {
    this[INIT_FUNC] = () => {
      // console.log('constructor()');
    };
  }

  xxxx = (xxx : string, sss : number) : QcAction => {
    return <QcAction>{ type: 'xxxx' };
  }
}

export type QuerchyDefinition001 = QuerchyDefinition<
  CommonConfig001, QcModelMap001, QcQueryCreatorMap001, QcExtraActionCreators001
>;

export type MyState001 = any;

export type MyQcStore001 = QcStore<MyState001>;

export type ExtraDependencies001 = any;

export class MyAxiosRunner001 extends AxiosRunner<
  MyState001,
  CommonConfig001,
  QcModelMap001,
  QcQueryCreatorMap001,
  QcExtraActionCreators001,
  QuerchyDefinition001,
  ExtraDependencies001
> {}

export class MyQuerchy001 extends Querchy<
  CommonConfig001,
  QcModelMap001,
  QcQueryCreatorMap001,
  QcExtraActionCreators001,
  QuerchyDefinition001,
  ExtraDependencies001
> {}

export type QcDependencies001 = QcDependencies<
  CommonConfig001,
  QcModelMap001,
  QcQueryCreatorMap001,
  QcExtraActionCreators001,
  QuerchyDefinition001,
  ExtraDependencies001
>;

export const createEpicMiddleware001 = (...args : any[]) => createEpicMiddleware<
  QcAction,
  MyState001,
  MyQcStore001,
  QcDependencies001
>(...args);

export class MyQcExtraActionCreators001 extends QcExtraActionCreators001 {}

export class MyQcUpdater001 extends QcUpdater<
  CommonConfig001,
  QcModelMap001,
  QcQueryCreatorMap001,
  QcExtraActionCreators001,
  QuerchyDefinition001,
  ExtraDependencies001
> {
  reduce(action: QcAction, state: any) : any {
    return super.reduce(action, state);
  }
}
