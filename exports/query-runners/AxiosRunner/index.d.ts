import { State } from 'pure-epic';
import { AxiosStatic } from 'axios';
import { QcState, RunnerType } from '../../common/interfaces';
import { CommonConfig, ModelMap, QueryBuilderMap, QuerchyDefinition, QcRequestActionCreators, ExtraActionCreators } from '../../core/interfaces';
import { RunnerRun, QueryRunner } from '../../query-runners/interfaces';
import { AxiosObservableOptions } from './AxiosObservable';
export default class AxiosRunner<StateType extends State = QcState, CommonConfigType extends CommonConfig = CommonConfig, ModelMapType extends ModelMap<CommonConfigType> = ModelMap<CommonConfigType>, QueryBuilderMapType extends QueryBuilderMap<CommonConfigType, ModelMapType> = QueryBuilderMap<CommonConfigType, ModelMapType>, ExtraActionCreatorsType extends ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType> = ExtraActionCreators<CommonConfigType, ModelMapType, QueryBuilderMapType>, QuerchyDefinitionType extends QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType> = QuerchyDefinition<CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType>, ExtraDependencies = any> implements QueryRunner<StateType, CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependencies> {
    type: RunnerType;
    axiosObservable: (axiosRequestConfig: any, actionCreators: Partial<QcRequestActionCreators>, options: AxiosObservableOptions) => any;
    constructor(a?: AxiosStatic);
    handleQuery: RunnerRun<StateType, CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependencies>;
}
