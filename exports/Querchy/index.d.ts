import { Epic } from 'pure-epic';
import { QcAction, QcState } from '../common/interfaces';
import { CommonConfig, ModelMap, QueryBuilderDefinition, QueryBuilderMap, ExtraActionCreators, QuerchyDefinition, QcDependencies, ActionCreatorSets } from '../core/interfaces';
export declare type QuerchyTypeGroup<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, QueryBuilderMapType extends QueryBuilderMap<CommonConfigType, ModelMapType>, ExtraActionCreatorsType extends ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType>, QuerchyDefinitionType extends QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType>, ExtraDependenciesType> = {
    CommonConfigType: CommonConfigType;
    ModelMapType: ModelMapType;
    QueryBuilderMapType: QueryBuilderMapType;
    ExtraActionCreatorsType: ExtraActionCreatorsType;
    QuerchyDefinitionType: QuerchyDefinitionType;
    ExtraDependenciesType: ExtraDependenciesType;
    QcDependenciesType: QcDependencies<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependenciesType>;
    ActionCreatorSetsType: ActionCreatorSets<CommonConfigType, ModelMapType, ExtraActionCreatorsType>;
    QueryBuilderDefinitionType: QueryBuilderDefinition<CommonConfigType, ModelMapType>;
    EpicType: Epic<QcAction, QcAction, QcState, QcDependencies<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependenciesType>>;
};
export default class Querchy<CommonConfigType extends CommonConfig = CommonConfig, ModelMapType extends ModelMap<CommonConfigType> = ModelMap<CommonConfigType>, QueryBuilderMapType extends QueryBuilderMap<CommonConfigType, ModelMapType> = QueryBuilderMap<CommonConfigType, ModelMapType>, ExtraActionCreatorsType extends ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType> = ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType>, QuerchyDefinitionType extends QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType> = QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType>, ExtraDependencies = any, QuerchyTypeGroupType extends QuerchyTypeGroup<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependencies> = QuerchyTypeGroup<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependencies>> {
    querchyDefinition: QuerchyDefinitionType;
    deps: QuerchyTypeGroupType['QcDependenciesType'];
    actionCreatorSets: QuerchyTypeGroupType['ActionCreatorSetsType'];
    constructor(querchyDefinition: QuerchyDefinitionType, deps?: ExtraDependencies);
    normalizeQuerchyDefinition(): void;
    getHandleQueryEpicFromQueryBuilderByActionType(actionType: string, queryBuilder: QuerchyTypeGroupType['QueryBuilderDefinitionType']): QuerchyTypeGroupType['EpicType'];
    getEpicForModels(): QuerchyTypeGroupType['EpicType'];
    getEpicForExtraActions(): QuerchyTypeGroupType['EpicType'];
    getRootEpic(): QuerchyTypeGroupType['EpicType'];
}
