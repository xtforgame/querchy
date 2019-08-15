import { Epic } from 'pure-epic';
import { QcAction, QcState } from '~/common/interfaces';
import { CommonConfig, ModelMap, QueryBuilderDefinition, QueryBuilderMap, ExtraActionCreators, QuerchyDefinition, QcDependencies, ActionCreatorSets } from '~/core/interfaces';
export default class Querchy<CommonConfigType extends CommonConfig = CommonConfig, ModelMapType extends ModelMap<CommonConfigType> = ModelMap<CommonConfigType>, QueryBuilderMapType extends QueryBuilderMap<CommonConfigType, ModelMapType> = QueryBuilderMap<CommonConfigType, ModelMapType>, ExtraActionCreatorsType extends ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType> = ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType>, QuerchyDefinitionType extends QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType> = QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType>, ExtraDependencies = any> {
    querchyDefinition: QuerchyDefinitionType;
    deps: QcDependencies<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependencies>;
    actionCreatorSets: ActionCreatorSets<CommonConfigType, ModelMapType, ExtraActionCreatorsType>;
    constructor(querchyDefinition: QuerchyDefinitionType, deps?: ExtraDependencies);
    normalizeQuerchyDefinition(): void;
    getHandleQueryEpicFromQueryBuilderByActionType(actionType: string, queryBuilder: QueryBuilderDefinition<CommonConfigType, ModelMapType>): Epic<QcAction, QcAction, QcState, QcDependencies<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependencies>>;
    getEpicForModels(): Epic<QcAction, QcAction, QcState, QcDependencies<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependencies>>;
    getEpicForExtraActions(): Epic<QcAction, QcAction, QcState, QcDependencies<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependencies>>;
    getRootEpic(): Epic<QcAction, QcAction, QcState, QcDependencies<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependencies>>;
}
