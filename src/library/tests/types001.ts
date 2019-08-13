import { Epic, createEpicMiddleware, combineEpics } from 'pure-epic';
import {
  ExtraActionCreators,
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

import {
  ActionInfosT1,
  QueryInfosT1,
} from './builtin-t1';

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

export type ActionInfosXxx = ActionInfosT1;

export type QueryInfosXxx = QueryInfosT1 & {
  getCollection: QueryInfo<RawActionCreatorGetCollection>;
};

export type ResourceModel001<
  CommonConfigType extends CommonConfig
> = ResourceModel<CommonConfigType> & {
  // url: string;
  // crudNames?: string[];
  queryInfos: QueryInfosT1;
  // actionNames?: string[];
  actionInfos: ActionInfosT1;
  // buildUrl?: (action: QcBasicAction) => string;
  // queryCreator?: string;
  actionTypes?: ResourceModelActionTypes<
    ResourceModelQueryActions<Required<QueryInfosT1>>
  > & ResourceModelActionTypes<
    ResourceModelActions<Required<ActionInfosT1>>
  >,
  actions?: ResourceModelQueryActions<
    Required<QueryInfosT1>
  > & ResourceModelActions<
    Required<ActionInfosT1>
  >,
};

export type ResourceModelXxx<
  CommonConfigType extends CommonConfig
> = ResourceModel<CommonConfigType> & {
  // crudNames?: string[];
  queryInfos: QueryInfosXxx;
  // actionNames?: string[];
  actionInfos: ActionInfosXxx;
  // buildUrl?: (action: QcBasicAction) => string;
  // queryCreator?: string;
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

export class QcExtraActionCreators001 implements ExtraActionCreators<
  CommonConfig001,
  QcModelMap001,
  QcQueryCreatorMap001
> {
  [INIT_FUNC] : ActionCreatorsInitFunction<CommonConfig001, QcModelMap001>;
  [s : string] : QcActionCreator;

  constructor() {
    this[INIT_FUNC] = (models) => {
      // console.log('models :', models);
    };
  }

  extraAction1 = (xxx : string, sss : number) : any => {
    return {};
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
