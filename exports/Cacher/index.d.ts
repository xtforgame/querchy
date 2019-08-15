import { Epic } from 'pure-epic';
import { QcAction, QcState, RootReducer, SliceReducer, GlobalReducer, ResourceMerger, GlobalMerger } from '../common/interfaces';
import { QcBasicAction, QcDependencies, CommonConfig, ModelMap, QueryBuilderMap, ExtraActionCreators, QuerchyDefinition, QcResponseAction } from '../core/interfaces';
import { ReducerSets } from './interfaces';
import Querchy from '../Querchy';
export default class Updater<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, QueryBuilderMapType extends QueryBuilderMap<CommonConfigType, ModelMapType>, ExtraActionCreatorsType extends ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType>, QuerchyDefinitionType extends QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType>, ExtraDependencies = any> {
    querchy: Querchy<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependencies>;
    reducerSet: ReducerSets<CommonConfigType, ModelMapType>;
    allResourceReducers: {
        [s: string]: SliceReducer;
    };
    extraGlobalReducer?: GlobalReducer;
    rootReducer: RootReducer;
    constructor(querchy: Querchy<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependencies>);
    createResourceMergerForResponse: (actionType: string, merger: ResourceMerger<QcBasicAction>) => ResourceMerger<QcResponseAction>;
    createGlobalMergerForResponse: (actionType: string, merger: GlobalMerger<ModelMapType, QcBasicAction>) => GlobalMerger<ModelMapType, QcResponseAction>;
    init(): void;
    getEpicByActionType(actionType: string): Epic<QcAction, QcAction, QcState, QcDependencies<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependencies>>;
    getRootEpic(): Epic<QcAction, QcAction, QcState, QcDependencies<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependencies>>;
    reduce(state: any, action: QcAction): any;
}
