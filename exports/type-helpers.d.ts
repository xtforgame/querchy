import { State } from 'pure-epic';
import Querchy, { QuerchyTypeGroup } from './Querchy';
import Cacher, { CacherTypeGroup } from './Cacher';
export { default as Querchy } from './Querchy';
export { default as Cacher } from './Cacher';
import AxiosRunner from './query-runners/AxiosRunner';
import { ResourceModelActions, QcState } from './common/interfaces';
import { CommonConfig, ResourceModel, ModelMap, INIT_FUNC, ActionCreatorsInitFunction, ResourceModelActionTypes, ResourceModelQueryActions, QueryInfo, ActionInfo, ExtraQueryInfo, ExtraActionInfo, QueryBuilderMap, ExtraActionCreators, QuerchyDefinition } from './core/interfaces';
import { Constructor } from './utils/helper-functions';
export { QuerchyTypeGroup, CacherTypeGroup, };
export declare type FullTypeGroup<CommonConfigType extends CommonConfig = CommonConfig, ModelMapType extends ModelMap<CommonConfigType> = ModelMap<CommonConfigType>, QueryBuilderMapType extends QueryBuilderMap<CommonConfigType, ModelMapType> = QueryBuilderMap<CommonConfigType, ModelMapType>, ExtraActionCreatorsType extends ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType> = ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType>, QuerchyDefinitionType extends QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType> = QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType>, ExtraDependenciesType = any, StateType extends State = QcState> = CacherTypeGroup<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependenciesType> & {
    StateType: StateType;
};
export declare type MakeResourceModelType<CommonConfigType extends CommonConfig, QueryInfosType extends {
    [s: string]: QueryInfo<Function>;
}, ActionInfosType extends {
    [s: string]: ActionInfo<Function>;
}> = ResourceModel<CommonConfigType> & {
    queryInfos: QueryInfosType;
    actionInfos: ActionInfosType;
    actionTypes?: ResourceModelActionTypes<ResourceModelQueryActions<Required<QueryInfosType>>> & ResourceModelActionTypes<ResourceModelActions<Required<ActionInfosType>>>;
    actions?: ResourceModelQueryActions<Required<QueryInfosType>> & ResourceModelActions<Required<ActionInfosType>>;
};
export declare type MakeExtraActionCreatorsType<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfig>, ExtraQueryInfosType extends {
    [s: string]: ExtraQueryInfo<ModelMapType, Function>;
}, ExtraActionInfosType extends {
    [s: string]: ExtraActionInfo<ModelMapType, Function>;
}> = {
    [INIT_FUNC]: ActionCreatorsInitFunction<CommonConfigType, ModelMapType>;
    queryInfos: ExtraQueryInfosType;
    actionInfos: ExtraActionInfosType;
    actionTypes?: ResourceModelActionTypes<ResourceModelQueryActions<Required<ExtraQueryInfosType>>> & ResourceModelActionTypes<ResourceModelActions<Required<ExtraActionInfosType>>>;
    actions?: ResourceModelQueryActions<Required<ExtraQueryInfosType>> & ResourceModelActions<Required<ExtraActionInfosType>>;
};
export declare type MakeQuerchyDefinition<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfig>, QueryBuilderMapType extends QueryBuilderMap<CommonConfigType, ModelMapType>, ExtraQueryInfosType extends {
    [s: string]: ExtraQueryInfo<ModelMapType, Function>;
}, ExtraActionInfosType extends {
    [s: string]: ExtraActionInfo<ModelMapType, Function>;
}> = QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, MakeExtraActionCreatorsType<CommonConfigType, ModelMapType, ExtraQueryInfosType, ExtraActionInfosType>>;
export declare type MakeFullTypeGroup<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfig>, QueryBuilderMapType extends QueryBuilderMap<CommonConfigType, ModelMapType>, ExtraQueryInfosType extends {
    [s: string]: ExtraQueryInfo<ModelMapType, Function>;
}, ExtraActionInfosType extends {
    [s: string]: ExtraActionInfo<ModelMapType, Function>;
}, ExtraDependenciesType = any, StateType extends State = QcState> = FullTypeGroup<CommonConfigType, ModelMapType, QueryBuilderMapType, MakeExtraActionCreatorsType<CommonConfigType, ModelMapType, ExtraQueryInfosType, ExtraActionInfosType>, MakeQuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraQueryInfosType, ExtraActionInfosType>, ExtraDependenciesType, StateType>;
export declare class TypeHelperClass<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfig>, QueryBuilderMapType extends QueryBuilderMap<CommonConfigType, ModelMapType>, ExtraQueryInfosType extends {
    [s: string]: ExtraQueryInfo<ModelMapType, Function>;
}, ExtraActionInfosType extends {
    [s: string]: ExtraActionInfo<ModelMapType, Function>;
}, ExtraDependenciesType, StateType extends State> {
    Types: MakeFullTypeGroup<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraQueryInfosType, ExtraActionInfosType, ExtraDependenciesType, StateType>;
    GetAxiosRunnerClass: () => Constructor<AxiosRunner<this["Types"]["CommonConfigType"], this["Types"]["ModelMapType"], this["Types"]["QueryBuilderMapType"], this["Types"]["ExtraActionCreatorsType"], this["Types"]["QuerchyDefinitionType"], this["Types"]["ExtraDependenciesType"], this["Types"]["StateType"]>>;
    GetQuerchyClass: () => Constructor<Querchy<this["Types"]["CommonConfigType"], this["Types"]["ModelMapType"], this["Types"]["QueryBuilderMapType"], this["Types"]["ExtraActionCreatorsType"], this["Types"]["QuerchyDefinitionType"], this["Types"]["ExtraDependenciesType"], QuerchyTypeGroup<this["Types"]["CommonConfigType"], this["Types"]["ModelMapType"], this["Types"]["QueryBuilderMapType"], this["Types"]["ExtraActionCreatorsType"], this["Types"]["QuerchyDefinitionType"], this["Types"]["ExtraDependenciesType"]>>>;
    GetCacherClass: () => Constructor<Cacher<this["Types"]["CommonConfigType"], this["Types"]["ModelMapType"], this["Types"]["QueryBuilderMapType"], this["Types"]["ExtraActionCreatorsType"], this["Types"]["QuerchyDefinitionType"], this["Types"]["ExtraDependenciesType"], CacherTypeGroup<this["Types"]["CommonConfigType"], this["Types"]["ModelMapType"], this["Types"]["QueryBuilderMapType"], this["Types"]["ExtraActionCreatorsType"], this["Types"]["QuerchyDefinitionType"], this["Types"]["ExtraDependenciesType"]>>>;
}