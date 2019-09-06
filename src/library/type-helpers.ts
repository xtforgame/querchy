import { State } from 'pure-epic';
import Querchy, { QuerchyTypeGroup, QuerchyConstructor } from './Querchy';
import Cacher, { CacherTypeGroup, CacherConstructor } from './Cacher';

export { default as Querchy } from './Querchy';
export { default as Cacher } from './Cacher';
import AxiosRunner, { AxiosRunnerConstructor } from './query-runners/AxiosRunner';

import {
  ResourceModelActions,
  QcState,
} from './common/interfaces';

import {
  CommonConfig,
  ResourceModel,
  ModelMap,
  INIT_FUNC,
  ActionCreatorsInitFunction,

  ResourceModelActionTypes,
  ResourceModelQueryActions,
  QueryInfo,
  ActionInfo,
  ExtraQueryInfo,
  ExtraActionInfo,
  QueryBuilderMap,
  ExtraActionCreators,
  QuerchyDefinition,
  Feature,
  FeatureTypes,
} from './core/interfaces';

import {
  ExtraSelectorInfosMapForModelMap,
} from './Cacher/interfaces';

import {
  Constructor,
  ConstructorWithFunction,
} from './utils/helper-functions';

export {
  QuerchyTypeGroup,
  CacherTypeGroup,
};

export type FullTypeGroup<
  CommonConfigType extends CommonConfig = CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType> = ModelMap<CommonConfigType>,
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
  > = QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType>,

  ExtraDependenciesType = any,

  StateType extends State = QcState,

  ExtraSelectorInfosForModelType extends ExtraSelectorInfosMapForModelMap<
    CommonConfigType, ModelMapType, StateType
  > = ExtraSelectorInfosMapForModelMap<
    CommonConfigType, ModelMapType, StateType
  >
> = CacherTypeGroup<
  CommonConfigType,
  ModelMapType,
  QueryBuilderMapType,
  ExtraActionCreatorsType,
  QuerchyDefinitionType,
  ExtraDependenciesType,
  StateType,

  ExtraSelectorInfosForModelType
>;


export type QueryInfosTypeWithFeature<
  QueryInfosType extends {
    [s : string]: QueryInfo<Function>;
  },
  FeatureTypesType extends FeatureTypes
> = QueryInfosType & Partial<FeatureTypesType['QueryInfos']>;

export type ActionInfosTypeWithFeature<
  ActionInfosType extends {
    [s : string]: ActionInfo<Function>;
  },
  FeatureTypesType extends FeatureTypes
> = ActionInfosType & Partial<FeatureTypesType['ActionInfos']>;

export type MakeResourceModelTypeTypes<
  QueryInfosType extends {
    [s : string]: QueryInfo<Function>;
  },
  ActionInfosType extends {
    [s : string]: ActionInfo<Function>;
  },
  FeatureTypesType extends FeatureTypes
> = {
  QueryInfosType: QueryInfosTypeWithFeature<QueryInfosType, FeatureTypesType>;
  ActionInfosType: ActionInfosTypeWithFeature<ActionInfosType, FeatureTypesType>;
};

export type MakeResourceModelType<
  CommonConfigType extends CommonConfig,
  FeatureTypesType extends FeatureTypes = FeatureTypes,
  QueryInfosType extends {
    [s : string]: QueryInfo<Function>;
  } = {
    [s : string]: QueryInfo<Function>;
  },
  ActionInfosType extends {
    [s : string]: ActionInfo<Function>;
  } = {
    [s : string]: ActionInfo<Function>;
  },

  TypesType extends MakeResourceModelTypeTypes<
    QueryInfosType,
    ActionInfosType,
    FeatureTypesType
  > = MakeResourceModelTypeTypes<
    QueryInfosType,
    ActionInfosType,
    FeatureTypesType
  >
> = ResourceModel<CommonConfigType> & {
  queryInfos: TypesType['QueryInfosType'];
  actionInfos: TypesType['ActionInfosType'];
  actionTypes?: ResourceModelActionTypes<
    ResourceModelQueryActions<Required<TypesType['QueryInfosType']>>
  > & ResourceModelActionTypes<
    ResourceModelActions<Required<TypesType['ActionInfosType']>>
  >;
  actions?: ResourceModelQueryActions<
    Required<TypesType['QueryInfosType']>
  > & ResourceModelActions<
    Required<TypesType['ActionInfosType']>
  >;
  feature?: Feature<FeatureTypesType>;
  featureDeps?: any;
};

export type MakeExtraActionCreatorsType<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfig>,
  ExtraQueryInfosType extends {
    [s : string]: ExtraQueryInfo<ModelMapType, Function>;
  },
  ExtraActionInfosType extends {
    [s : string]: ExtraActionInfo<ModelMapType, Function>;
  }
> = {
  [INIT_FUNC] : ActionCreatorsInitFunction<CommonConfigType, ModelMapType>;

  queryInfos: ExtraQueryInfosType;

  actionInfos: ExtraActionInfosType;

  actionTypes?: ResourceModelActionTypes<
    ResourceModelQueryActions<Required<ExtraQueryInfosType>>
  > & ResourceModelActionTypes<
    ResourceModelActions<Required<ExtraActionInfosType>>
  >;

  actions?: ResourceModelQueryActions<
    Required<ExtraQueryInfosType>
  > & ResourceModelActions<
    Required<ExtraActionInfosType>
  >;
};

export type MakeQuerchyDefinition<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfig>,
  QueryBuilderMapType extends QueryBuilderMap<
    CommonConfigType, ModelMapType
  >,
  ExtraQueryInfosType extends {
    [s : string]: ExtraQueryInfo<ModelMapType, Function>;
  },
  ExtraActionInfosType extends {
    [s : string]: ExtraActionInfo<ModelMapType, Function>;
  }
> = QuerchyDefinition<
  CommonConfigType,
  ModelMapType,
  QueryBuilderMapType,
  MakeExtraActionCreatorsType<
    CommonConfigType,
    ModelMapType,
    ExtraQueryInfosType,
    ExtraActionInfosType
  >
>;

export type MakeFullTypeGroup<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfig>,
  QueryBuilderMapType extends QueryBuilderMap<
    CommonConfigType, ModelMapType
  >,
  ExtraQueryInfosType extends {
    [s : string]: ExtraQueryInfo<ModelMapType, Function>;
  },
  ExtraActionInfosType extends {
    [s : string]: ExtraActionInfo<ModelMapType, Function>;
  },

  ExtraDependenciesType = any,

  StateType extends State = QcState,

  ExtraSelectorInfosForModelType extends ExtraSelectorInfosMapForModelMap<
    CommonConfigType, ModelMapType, StateType
  > = ExtraSelectorInfosMapForModelMap<
    CommonConfigType, ModelMapType, StateType
  >
> = FullTypeGroup<
  CommonConfigType,
  ModelMapType,
  QueryBuilderMapType,
  MakeExtraActionCreatorsType<
    CommonConfigType,
    ModelMapType,
    ExtraQueryInfosType,
    ExtraActionInfosType
  >,
  MakeQuerchyDefinition<
    CommonConfigType,
    ModelMapType,
    QueryBuilderMapType,
    ExtraQueryInfosType,
    ExtraActionInfosType
  >,
  ExtraDependenciesType,
  StateType,

  ExtraSelectorInfosForModelType
>;

export class TypeHelperClass<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfig>,
  QueryBuilderMapType extends QueryBuilderMap<
    CommonConfigType, ModelMapType
  >,
  ExtraQueryInfosType extends {
    [s : string]: ExtraQueryInfo<ModelMapType, Function>;
  },
  ExtraActionInfosType extends {
    [s : string]: ExtraActionInfo<ModelMapType, Function>;
  },

  ExtraDependenciesType,

  StateType extends State,

  ExtraSelectorInfosForModelType extends ExtraSelectorInfosMapForModelMap<
    CommonConfigType, ModelMapType, StateType
  >
> {
  Types!: MakeFullTypeGroup<
    CommonConfigType,
    ModelMapType,
    QueryBuilderMapType,
    ExtraQueryInfosType,
    ExtraActionInfosType,
    ExtraDependenciesType,
    StateType,

    ExtraSelectorInfosForModelType
  >;

  GetAxiosRunnerClass = () : (
    ConstructorWithFunction<AxiosRunner<
      this['Types']['CommonConfigType'],
      this['Types']['ModelMapType'],
      this['Types']['QueryBuilderMapType'],
      this['Types']['ExtraActionCreatorsType'],
      this['Types']['QuerchyDefinitionType'],
      this['Types']['ExtraDependenciesType'],

      this['Types']['StateType']
    >, AxiosRunnerConstructor<
      this['Types']['CommonConfigType'],
      this['Types']['ModelMapType'],
      this['Types']['QueryBuilderMapType'],
      this['Types']['ExtraActionCreatorsType'],
      this['Types']['QuerchyDefinitionType'],
      this['Types']['ExtraDependenciesType'],

      this['Types']['StateType']
    >>
  ) => {
    return AxiosRunner;
  }

  GetQuerchyClass = () : (
    ConstructorWithFunction<Querchy<
      this['Types']['CommonConfigType'],
      this['Types']['ModelMapType'],
      this['Types']['QueryBuilderMapType'],
      this['Types']['ExtraActionCreatorsType'],
      this['Types']['QuerchyDefinitionType'],
      this['Types']['ExtraDependenciesType']
    >, QuerchyConstructor<
      this['Types']['CommonConfigType'],
      this['Types']['ModelMapType'],
      this['Types']['QueryBuilderMapType'],
      this['Types']['ExtraActionCreatorsType'],
      this['Types']['QuerchyDefinitionType'],
      this['Types']['ExtraDependenciesType']
    >>
  ) => {
    return Querchy;
  }

  GetCacherClass = () : (
    ConstructorWithFunction<Cacher<
      this['Types']['CommonConfigType'],
      this['Types']['ModelMapType'],
      this['Types']['QueryBuilderMapType'],
      this['Types']['ExtraActionCreatorsType'],
      this['Types']['QuerchyDefinitionType'],
      this['Types']['ExtraDependenciesType'],

      this['Types']['StateType'],

      this['Types']['ExtraSelectorInfosForModelType']
    >, CacherConstructor<
      this['Types']['CommonConfigType'],
      this['Types']['ModelMapType'],
      this['Types']['QueryBuilderMapType'],
      this['Types']['ExtraActionCreatorsType'],
      this['Types']['QuerchyDefinitionType'],
      this['Types']['ExtraDependenciesType'],

      this['Types']['StateType'],

      this['Types']['ExtraSelectorInfosForModelType']
    >>
  ) => {
    return Cacher;
  }
}
