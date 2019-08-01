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

  Querchy,
  AxiosRunner,
  CacheUpdater,

  CrudType,
  CrudSubType,

  ResourceModelActionTypes,
  ResourceModelActionsOptions,
  ResourceModelActions,
  StartActionCreatorWithProps,
  QueryInfo,
} from '~/index';

export type RawActionCreatorCreate = (
  data: any, options?: ResourceModelActionsOptions,
) => {
  data: any;
  options?: ResourceModelActionsOptions;
  [s : string] : any;
};

export type RawActionCreatorRead = (
  resourceId: any, options?: ResourceModelActionsOptions,
) => {
  resourceId: any;
  options?: ResourceModelActionsOptions;
  [s : string] : any;
};

export type RawActionCreatorUpdate = (
  resourceId: any, data: any, options?: ResourceModelActionsOptions,
) => {
  resourceId: any;
  data: any;
  options?: ResourceModelActionsOptions;
  [s : string] : any;
};

export type RawActionCreatorDelete = (
  resourceId: any, options?: ResourceModelActionsOptions,
) => {
  resourceId: any;
  options?: ResourceModelActionsOptions;
  [s : string] : any;
};

export type QueryInfos = {
  create: QueryInfo<RawActionCreatorCreate>;
  read: QueryInfo<RawActionCreatorRead>;
  update: QueryInfo<RawActionCreatorUpdate>;
  delete: QueryInfo<RawActionCreatorDelete>;
} & {
  [s : string]: QueryInfo<Function>;
};

export interface CommonConfig001 extends CommonConfig {
  builtinCrudTypes : string[];
  builtinQueryInfos : QueryInfos;
  defaultQueryRunner: SimpleQueryRunner;
  queryRunners: {
    customRunner: SimpleQueryRunner;
    [s : string]: SimpleQueryRunner;
  };
  [s : string]: any;
}

export type RawActionCreatorGetCollection = (
  options?: ResourceModelActionsOptions,
) => {
  options?: ResourceModelActionsOptions;
  [s : string] : any;
};

export type QueryInfosXxx<
  CommonConfigType extends CommonConfig
> = Partial<CommonConfigType['builtinQueryInfos']> & {
  getCollection: QueryInfo<RawActionCreatorGetCollection>;
} & {
  [s : string]: QueryInfo<Function>;
};

export type ResourceModelXxx<
  CommonConfigType extends CommonConfig
> = {
  url: string;
  queryInfos: QueryInfosXxx<CommonConfigType>;
  buildUrl?: (action: QcBasicAction) => string;
  queryCreator?: string;
  crudTypes?: string[];
  actionTypes?: ResourceModelActionTypes<ResourceModelActions<Required<QueryInfosXxx<CommonConfigType>>>>,
  actions?: ResourceModelActions<Required<QueryInfosXxx<CommonConfigType>>>,
};

export type QcModelMap001 = {
  httpBinRes: ResourceModel<CommonConfig001>;
  httpBinRes2: ResourceModelXxx<CommonConfig001>;
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

export class MyCacheUpdater001 extends CacheUpdater<
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
