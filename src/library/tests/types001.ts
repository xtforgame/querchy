import { Epic, createEpicMiddleware, combineEpics } from 'pure-epic';
import {
  ExtraActionCreators,
  CommonConfig,
  ResourceModel,
  ModelMap,
  QueryBuilderMap,
  QuerchyDefinition,
  QueryBuilderDefinition,
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
  ExtraQueryInfo,
  ExtraActionInfo,
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
  // queryBuilderName?: string;
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
  // queryBuilderName?: string;
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

export type QcQueryBuilderMap001 = {
  defaultBuilder : QueryBuilderDefinition<CommonConfig001, QcModelMap001>;
  customPath : QueryBuilderDefinition<CommonConfig001, QcModelMap001>;
  forExtra : QueryBuilderDefinition<CommonConfig001, QcModelMap001>;
};

export type RawActionCreatorExtraAction1 = (
  options?: ResourceModelQueryActionOptions,
) => {
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};

export type ExtraQueryInfoT1 = {
  extraQuery1: ExtraQueryInfo<QcModelMap001, RawActionCreatorExtraAction1>;
};

export type RawActionCreatorUpdateCacheExtra = (
  cacheChange: any, options?: ResourceModelQueryActionOptions,
) => {
  cacheChange: any;
  options?: ResourceModelQueryActionOptions;
  [s : string] : any;
};
export type ExtraActionInfoT1 = {
  updateCacheExtra: ExtraActionInfo<QcModelMap001, RawActionCreatorUpdateCacheExtra>;
};

export class QcExtraActionCreators001 implements ExtraActionCreators<
  CommonConfig001,
  QcModelMap001,
  QcQueryBuilderMap001
> {
  [INIT_FUNC] : ActionCreatorsInitFunction<CommonConfig001, QcModelMap001>;

  queryInfos: ExtraQueryInfoT1;

  actionInfos: ExtraActionInfoT1;

  actionTypes?: ResourceModelActionTypes<
    ResourceModelQueryActions<Required<ExtraQueryInfoT1>>
  > & ResourceModelActionTypes<
    ResourceModelActions<Required<ExtraActionInfoT1>>
  >;

  actions?: ResourceModelQueryActions<
    Required<ExtraQueryInfoT1>
  > & ResourceModelActions<
    Required<ExtraActionInfoT1>
  >;

  constructor() {
    this[INIT_FUNC] = (models) => {
      // console.log('models :', models);
    };

    this.queryInfos = {
      extraQuery1: {
        actionCreator: (options?) => ({ options }),
        queryBuilderName: 'forExtra',
        globalMerger: (s) => {
          delete s.httpBinRes.resourceMap['1'];
          delete s.httpBinRes.resourceMap['2'];
          delete s.httpBinRes2.resourceMap['1'];
          delete s.httpBinRes2.resourceMap['2'];
          console.log('===================== s :', s);
          return s;
        },
      },
    };

    this.actionInfos = {
      updateCacheExtra: {
        actionCreator: (options) => {
          return {
            cacheChange: null,
          };
        },
      },
    };
  }
}

export type QuerchyDefinition001 = QuerchyDefinition<
  CommonConfig001, QcModelMap001, QcQueryBuilderMap001, QcExtraActionCreators001
>;

export type MyState001 = any;

export type MyQcStore001 = QcStore<MyState001>;

export type ExtraDependencies001 = any;

export class MyAxiosRunner001 extends AxiosRunner<
  MyState001,
  CommonConfig001,
  QcModelMap001,
  QcQueryBuilderMap001,
  QcExtraActionCreators001,
  QuerchyDefinition001,
  ExtraDependencies001
> {}

export class MyQuerchy001 extends Querchy<
  CommonConfig001,
  QcModelMap001,
  QcQueryBuilderMap001,
  QcExtraActionCreators001,
  QuerchyDefinition001,
  ExtraDependencies001
> {}

export type QcDependencies001 = QcDependencies<
  CommonConfig001,
  QcModelMap001,
  QcQueryBuilderMap001,
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
  QcQueryBuilderMap001,
  QcExtraActionCreators001,
  QuerchyDefinition001,
  ExtraDependencies001
> {
  reduce(action: QcAction, state: any) : any {
    return super.reduce(action, state);
  }
}
