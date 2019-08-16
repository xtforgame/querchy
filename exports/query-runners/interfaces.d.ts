import { State, ActionsObservable, StateObservable } from 'pure-epic';
import { Observable } from 'rxjs';
import { QcAction, QcState, RunnerType } from '../common/interfaces';
import { CommonConfig, ModelMap, QueryBuilderDefinition, QueryBuilderMap, QuerchyDefinition, QcDependencies, ExtraActionCreators, QcBasicAction } from '../core/interfaces';
export interface Canceler {
    (message?: string): void;
}
export interface CancelTokenSource {
    token: any;
    cancel: Canceler;
}
export declare type RunnerRunOption<StateType extends State = QcState, CommonConfigType extends CommonConfig = CommonConfig, ModelMapType extends ModelMap<CommonConfigType> = ModelMap<CommonConfigType>, QueryBuilderMapType extends QueryBuilderMap<CommonConfigType, ModelMapType> = QueryBuilderMap<CommonConfigType, ModelMapType>, ExtraActionCreatorsType extends ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType> = ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType>, QuerchyDefinitionType extends QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType> = QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType>, ExtraDependencies = any> = {
    action$: ActionsObservable<QcAction>;
    state$: StateObservable<StateType>;
    args: any[];
};
export declare type RunnerRun<StateType extends State = QcState, CommonConfigType extends CommonConfig = CommonConfig, ModelMapType extends ModelMap<CommonConfigType> = ModelMap<CommonConfigType>, QueryBuilderMapType extends QueryBuilderMap<CommonConfigType, ModelMapType> = QueryBuilderMap<CommonConfigType, ModelMapType>, ExtraActionCreatorsType extends ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType> = ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType>, QuerchyDefinitionType extends QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType> = QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType>, ExtraDependencies = any> = (action: QcBasicAction, queryBuilder: QueryBuilderDefinition<CommonConfigType, ModelMapType>, dependencies: QcDependencies<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependencies>, options: RunnerRunOption<StateType, CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependencies>) => Observable<QcAction>;
export declare type QueryRunner<StateType extends State = QcState, CommonConfigType extends CommonConfig = CommonConfig, ModelMapType extends ModelMap<CommonConfigType> = ModelMap<CommonConfigType>, QueryBuilderMapType extends QueryBuilderMap<CommonConfigType, ModelMapType> = QueryBuilderMap<CommonConfigType, ModelMapType>, ExtraActionCreatorsType extends ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType> = ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType>, QuerchyDefinitionType extends QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType> = QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType>, ExtraDependencies = any> = {
    type: RunnerType;
    handleQuery: RunnerRun<StateType, CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependencies>;
};
