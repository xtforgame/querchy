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
  Cacher,

  CrudType,
  CrudSubType,

  ResourceModelActions,

  ResourceModelActionTypes,
  ResourceModelQueryActionOptions,
  ResourceModelQueryActions,
  StartQueryActionCreatorWithProps,
  QueryInfo,
  ActionInfo,
} from '~/index';

export type RawActionCreatorCreate = (
  data: any, options?: ResourceModelQueryActionOptions,
) => {
  data: any;
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type RawActionCreatorRead = (
  resourceId: any, options?: ResourceModelQueryActionOptions,
) => {
  resourceId: any;
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type RawActionCreatorUpdate = (
  resourceId: any, data: any, options?: ResourceModelQueryActionOptions,
) => {
  resourceId: any;
  data: any;
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type RawActionCreatorDelete = (
  resourceId: any, options?: ResourceModelQueryActionOptions,
) => {
  resourceId: any;
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type RawActionCreatorUpdateCache = (
  cacheChange: any, options?: ResourceModelQueryActionOptions,
) => {
  cacheChange: any;
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type QueryInfosBase = {
} & {
  [s : string]: QueryInfo<Function>;
};

export interface CommonConfig001 extends CommonConfig {
  defaultQueryRunner: SimpleQueryRunner;
  queryRunners: {
    customRunner: SimpleQueryRunner;
    [s : string]: SimpleQueryRunner;
  };
  [s : string]: any;
}

export type RawActionCreatorGetCollection = (
  options?: ResourceModelQueryActionOptions,
) => {
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type ActionInfos001 = {
  updateCache: ActionInfo<RawActionCreatorUpdateCache>;
} & {
  [s : string]: ActionInfo<Function>;
};

export type QueryInfos001 = {
  create: QueryInfo<RawActionCreatorCreate>;
  read: QueryInfo<RawActionCreatorRead>;
  update: QueryInfo<RawActionCreatorUpdate>;
  delete: QueryInfo<RawActionCreatorDelete>;
} & {
  [s : string]: QueryInfo<Function>;
};

export type ActionInfosXxx = {
  updateCache: ActionInfo<RawActionCreatorUpdateCache>;
} & {
  [s : string]: ActionInfo<Function>;
};

export type QueryInfosXxx = QueryInfos001 & {
  getCollection: QueryInfo<RawActionCreatorGetCollection>;
} & {
  [s : string]: QueryInfo<Function>;
};

export type ResourceModel001<
  CommonConfigType extends CommonConfig
> = {
  url: string;
  crudNames?: string[];
  queryInfos: QueryInfos001;
  actionNames?: string[];
  actionInfos: ActionInfos001;
  buildUrl?: (action: QcBasicAction) => string;
  parseResponse?: (action: QcBasicAction) => {};
  queryCreator?: string;
  actionTypes?: ResourceModelActionTypes<
    ResourceModelQueryActions<Required<QueryInfos001>>
  > & ResourceModelActionTypes<
    ResourceModelActions<Required<ActionInfos001>>
  >,
  actions?: ResourceModelQueryActions<
    Required<QueryInfos001>
  > & ResourceModelActions<
    Required<ActionInfos001>
  >,
};

export type ResourceModelXxx<
  CommonConfigType extends CommonConfig
> = {
  url: string;
  crudNames?: string[];
  queryInfos: QueryInfosXxx;
  actionNames?: string[];
  actionInfos: ActionInfosXxx;
  buildUrl?: (action: QcBasicAction) => string;
  parseResponse?: (action: QcBasicAction) => {};
  queryCreator?: string;
  actionTypes?: ResourceModelActionTypes<
    ResourceModelQueryActions<Required<QueryInfosXxx>>
  > & ResourceModelActionTypes<
    ResourceModelActions<Required<ActionInfosXxx>>
  >,
  actions?: ResourceModelQueryActions<
    Required<QueryInfosXxx>
  > & ResourceModelActions<
    Required<ActionInfosXxx>
  >,
};

export type QcModelMap001 = {
  httpBinRes: ResourceModel001<CommonConfig001>;
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

export class MyCacher001 extends Cacher<
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
