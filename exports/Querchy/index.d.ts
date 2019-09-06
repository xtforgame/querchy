import { Action } from 'pure-epic';
import { QcEpic } from '../common/interfaces';
import { CommonConfig, ModelMap, QueryBuilderDefinition, QueryBuilderMap, ExtraActionCreators, QuerchyDefinition, QcDependencies, ActionCreatorSets, PromiseActionCreatorSets } from '../core/interfaces';
export * from './namespaces';
export { default as namespaces } from './namespaces';
export { default as createQuerchyMiddleware } from './createQuerchyMiddleware';
export declare type QuerchyTypeGroup<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, QueryBuilderMapType extends QueryBuilderMap<CommonConfigType, ModelMapType>, ExtraActionCreatorsType extends ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType>, QuerchyDefinitionType extends QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType>, ExtraDependenciesType> = {
    CommonConfigType: CommonConfigType;
    ModelMapType: ModelMapType;
    QueryBuilderMapType: QueryBuilderMapType;
    ExtraActionCreatorsType: ExtraActionCreatorsType;
    QuerchyDefinitionType: QuerchyDefinitionType;
    ExtraDependenciesType: ExtraDependenciesType;
    QcDependenciesType: QcDependencies<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependenciesType>;
    ActionCreatorSetsType: ActionCreatorSets<CommonConfigType, ModelMapType, ExtraActionCreatorsType>;
    PromiseActionCreatorSetsType: PromiseActionCreatorSets<CommonConfigType, ModelMapType, ExtraActionCreatorsType>;
    QueryBuilderDefinitionType: QueryBuilderDefinition<CommonConfigType, ModelMapType>;
    EpicType: QcEpic;
};
export declare type QuerchyConstructor<CommonConfigType extends CommonConfig = CommonConfig, ModelMapType extends ModelMap<CommonConfigType> = ModelMap<CommonConfigType>, QueryBuilderMapType extends QueryBuilderMap<CommonConfigType, ModelMapType> = QueryBuilderMap<CommonConfigType, ModelMapType>, ExtraActionCreatorsType extends ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType> = ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType>, QuerchyDefinitionType extends QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType> = QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType>, ExtraDependencies = any, QuerchyTypeGroupType extends QuerchyTypeGroup<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependencies> = QuerchyTypeGroup<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependencies>> = (querchyDefinition: QuerchyDefinitionType, deps?: ExtraDependencies) => any;
export default class Querchy<CommonConfigType extends CommonConfig = CommonConfig, ModelMapType extends ModelMap<CommonConfigType> = ModelMap<CommonConfigType>, QueryBuilderMapType extends QueryBuilderMap<CommonConfigType, ModelMapType> = QueryBuilderMap<CommonConfigType, ModelMapType>, ExtraActionCreatorsType extends ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType> = ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType>, QuerchyDefinitionType extends QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType> = QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType>, ExtraDependencies = any, QuerchyTypeGroupType extends QuerchyTypeGroup<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependencies> = QuerchyTypeGroup<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependencies>> {
    querchyDefinition: QuerchyDefinitionType;
    deps: QuerchyTypeGroupType['QcDependenciesType'];
    actionCreatorSets: QuerchyTypeGroupType['ActionCreatorSetsType'];
    promiseActionCreatorSets: QuerchyTypeGroupType['PromiseActionCreatorSetsType'];
    constructor(querchyDefinition: QuerchyDefinitionType, deps?: ExtraDependencies);
    normalizeQuerchyDefinition(): void;
    getStore: () => import("./namespaces").CommonStore;
    dispatch: (action: Action) => any;
    getHandleQueryEpicFromQueryBuilderByActionType(actionType: string, queryBuilder: QuerchyTypeGroupType['QueryBuilderDefinitionType']): QuerchyTypeGroupType['EpicType'];
    getEpicForModels(): QuerchyTypeGroupType['EpicType'];
    getEpicForExtraActions(): QuerchyTypeGroupType['EpicType'];
    getRootEpic(): QuerchyTypeGroupType['EpicType'];
}
