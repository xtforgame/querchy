import { QcAction, RootReducer, SliceReducer, GlobalReducer, ResourceMerger, GlobalMerger } from '../common/interfaces';
import { QcBasicAction, CommonConfig, ModelMap, QueryBuilderMap, ExtraActionCreators, QuerchyDefinition, QcResponseAction } from '../core/interfaces';
import { ReducerSets } from './interfaces';
import Querchy, { QuerchyTypeGroup } from '../Querchy';
export declare type CacherTypeGroup<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, QueryBuilderMapType extends QueryBuilderMap<CommonConfigType, ModelMapType>, ExtraActionCreatorsType extends ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType>, QuerchyDefinitionType extends QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType>, ExtraDependenciesType> = QuerchyTypeGroup<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependenciesType> & {
    QuerchyType: Querchy<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependenciesType>;
    ReducerSetsType: ReducerSets<CommonConfigType, ModelMapType>;
    GlobalMerger: GlobalMerger<ModelMapType, QcBasicAction>;
};
export default class Updater<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, QueryBuilderMapType extends QueryBuilderMap<CommonConfigType, ModelMapType>, ExtraActionCreatorsType extends ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType>, QuerchyDefinitionType extends QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType>, ExtraDependenciesType = any, CacherTypeGroupType extends CacherTypeGroup<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependenciesType> = CacherTypeGroup<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependenciesType>> {
    querchy: CacherTypeGroupType['QuerchyType'];
    reducerSet: CacherTypeGroupType['ReducerSetsType'];
    allResourceReducers: {
        [s: string]: SliceReducer;
    };
    extraGlobalReducer?: GlobalReducer;
    rootReducer: RootReducer;
    constructor(querchy: CacherTypeGroupType['QuerchyType']);
    createResourceMergerForResponse: (actionType: string, merger: ResourceMerger<QcBasicAction>) => ResourceMerger<QcResponseAction>;
    createGlobalMergerForResponse: (actionType: string, merger: CacherTypeGroupType["GlobalMerger"]) => CacherTypeGroupType["GlobalMerger"];
    init(): void;
    getEpicByActionType(actionType: string): CacherTypeGroupType['EpicType'];
    getRootEpic(): CacherTypeGroupType['EpicType'];
    reduce(state: any, action: QcAction): any;
}
