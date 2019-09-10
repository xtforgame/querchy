import { State } from 'pure-epic';
import { QcState, SliceReducer, GlobalReducer, ResourceMerger, GlobalMerger } from '../common/interfaces';
import { QcBasicAction, CommonConfig, ModelMap, QueryBuilderMap, ExtraActionCreators, QuerchyDefinition, QcResponseAction, ResourceModel } from '../core/interfaces';
import { ReducerSets, SelectorCreatorSets, SelectorSets, ExtraSelectorInfosMapForModelMap, ExtraModelSelectorCreators, ExtraModelSelectors, SelectorCreatorCreatorForModelMap, ExtraSelectorInfosForModelMap } from './interfaces';
import Querchy, { QuerchyTypeGroup } from '../Querchy';
export declare type CacherTypeGroup<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, QueryBuilderMapType extends QueryBuilderMap<CommonConfigType, ModelMapType>, ExtraActionCreatorsType extends ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType>, QuerchyDefinitionType extends QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType>, ExtraDependenciesType, StateType extends State, ExtraSelectorInfosForModelType extends ExtraSelectorInfosMapForModelMap<CommonConfigType, ModelMapType, StateType>> = QuerchyTypeGroup<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependenciesType> & {
    StateType: StateType;
    SelectorCreatorCreatorForModelMapType: SelectorCreatorCreatorForModelMap<CommonConfigType, ModelMapType, StateType>;
    ExtraSelectorInfosForModelMapType: ExtraSelectorInfosForModelMap<CommonConfigType, ModelMapType, StateType>;
    ExtraSelectorInfosForModelType: ExtraSelectorInfosForModelType;
    QuerchyType: Querchy<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependenciesType>;
    ReducerSetsType: ReducerSets<CommonConfigType, ModelMapType>;
    SelectorCreatorSetsType: SelectorCreatorSets<StateType, CommonConfigType, ModelMapType, ExtraModelSelectorCreators<CommonConfigType, ModelMapType, StateType, ExtraSelectorInfosForModelType>>;
    SelectorSetsType: SelectorSets<StateType, CommonConfigType, ModelMapType, ExtraModelSelectors<CommonConfigType, ModelMapType, StateType, ExtraSelectorInfosForModelType>>;
    GlobalMerger: GlobalMerger<ModelMapType, QcBasicAction>;
};
export declare type CacherConstructor<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, QueryBuilderMapType extends QueryBuilderMap<CommonConfigType, ModelMapType>, ExtraActionCreatorsType extends ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType>, QuerchyDefinitionType extends QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType>, ExtraDependenciesType = any, StateType extends State = QcState, ExtraSelectorInfosForModelType extends ExtraSelectorInfosMapForModelMap<CommonConfigType, ModelMapType, StateType> = ExtraSelectorInfosMapForModelMap<CommonConfigType, ModelMapType, StateType>, CacherTypeGroupType extends CacherTypeGroup<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependenciesType, StateType, ExtraSelectorInfosForModelType> = CacherTypeGroup<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependenciesType, StateType, ExtraSelectorInfosForModelType>> = (querchy: CacherTypeGroupType['QuerchyType'], extraSelectorInfosForModel: CacherTypeGroupType['ExtraSelectorInfosForModelType']) => any;
export default class Cacher<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, QueryBuilderMapType extends QueryBuilderMap<CommonConfigType, ModelMapType>, ExtraActionCreatorsType extends ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType>, QuerchyDefinitionType extends QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType>, ExtraDependenciesType = any, StateType extends State = QcState, ExtraSelectorInfosForModelType extends ExtraSelectorInfosMapForModelMap<CommonConfigType, ModelMapType, StateType> = ExtraSelectorInfosMapForModelMap<CommonConfigType, ModelMapType, StateType>, CacherTypeGroupType extends CacherTypeGroup<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependenciesType, StateType, ExtraSelectorInfosForModelType> = CacherTypeGroup<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependenciesType, StateType, ExtraSelectorInfosForModelType>> {
    querchy: CacherTypeGroupType['QuerchyType'];
    extraSelectorInfosForModel: CacherTypeGroupType['ExtraSelectorInfosForModelType'];
    reducerSet: CacherTypeGroupType['ReducerSetsType'];
    selectorCreatorSet: CacherTypeGroupType['SelectorCreatorSetsType'];
    selectorSet: CacherTypeGroupType['SelectorSetsType'];
    allResourceReducers: {
        [s: string]: SliceReducer;
    };
    extraGlobalReducer?: GlobalReducer<ModelMapType>;
    rootReducer: GlobalReducer<ModelMapType>;
    constructor(querchy: CacherTypeGroupType['QuerchyType'], extraSelectorInfosForModel: CacherTypeGroupType['ExtraSelectorInfosForModelType']);
    createResourceMergerForResponse: (actionType: string, merger: ResourceMerger<QcBasicAction>) => ResourceMerger<QcResponseAction>;
    createGlobalMergerForResponse: (actionType: string, merger: CacherTypeGroupType["GlobalMerger"]) => CacherTypeGroupType["GlobalMerger"];
    createSelectorAndSectorCreatorForResource(key: string, resourceModel: ResourceModel<CommonConfigType> | null, extraSelectorInfosForModelMap: CacherTypeGroupType['ExtraSelectorInfosForModelMapType']): void;
    init(): void;
    getEpicByActionType(actionType: string): CacherTypeGroupType['EpicType'];
    getRootEpic(): CacherTypeGroupType['EpicType'];
}
