import { State } from 'pure-epic';
import { Observable, ObservableInput } from 'rxjs';
import axios, { AxiosStatic } from 'axios';
import { mergeMap, filter } from 'rxjs/operators';
import {
  toNull,
} from '../../utils/helper-functions';

import {
  QcAction,
  QcState,
  QcStore,
  RunnerType,
} from '../../common/interfaces';

import {
  CommonConfig,
  ModelMap,
  QueryBuilderMap,
  QuerchyDefinition,
  QcDependencies,
  QcRequestConfig,
  QcRequestActionCreators,
  ExtraActionCreators,
} from '../../core/interfaces';

import {
  RunnerRun,
  RunnerRunOption,
  QueryRunner,
  Canceler,
  CancelTokenSource,
} from '../../query-runners/interfaces';

import AxiosObservable, { AxiosObservableOptions } from './AxiosObservable';

export type AxiosRunnerConstructor<
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
> = QuerchyDefinition<
  CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType
>,

ExtraDependencies = any,

StateType extends State = QcState,
> = (a?: AxiosStatic) => any;

export default class AxiosRunner<
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
  > = QuerchyDefinition<
    CommonConfigType, ModelMapType, QueryBuilderMapType, ExtraActionCreatorsType
  >,

  ExtraDependencies = any,

  StateType extends State = QcState,
> implements QueryRunner<
  StateType,
  CommonConfigType,
  ModelMapType,
  QueryBuilderMapType,
  ExtraActionCreatorsType,
  QuerchyDefinitionType,
  ExtraDependencies
> {
  type : RunnerType;
  axiosObservable : (
    axiosRequestConfig : any,
    actionCreators: Partial<QcRequestActionCreators>,
    options : AxiosObservableOptions,
  ) => any;

  constructor(a?: AxiosStatic) {
    this.type = 'axios';
    this.axiosObservable = AxiosObservable(a || axios);
  }

  handleQuery : RunnerRun<
    StateType,
    CommonConfigType,
    ModelMapType,
    QueryBuilderMapType,
    ExtraActionCreatorsType,
    QuerchyDefinitionType,
    ExtraDependencies
  > = (
    action, queryBuilder, dependencies, { state$, action$ },
  ) => {
    // console.log('action :', action);
    // console.log('state :', state$.value);
    // console.log('dependencies :', dependencies);

    const { querchyDef: { commonConfig, models } } = dependencies!;

    if (!queryBuilder) {
      throw new Error(`QueryBuilder not found: ${action.type}`);
    }

    const createSuccessAction = action.actionCreator.creatorRefs.respond;

    const createErrorAction = action.actionCreator.creatorRefs.respondError;

    const createCancelAction = action.actionCreator.creatorRefs.cancel;

    let requestConfig : QcRequestConfig;
    try {
      requestConfig = queryBuilder.buildRequestConfig(action, {
        runnerType: this.type,
        commonConfig,
        models,
      });
    } catch (error) {
      return [createErrorAction(error)];
    }

    if (!requestConfig) {
      return [toNull()];
    }

    const {
      overwriteConfigs,
      method,
      url,
      headers,
      query,
      body,
    } = requestConfig;

    requestConfig.rawConfigs = {
      method,
      url,
      headers: { ...headers },
      data: body,
      params: query,
      ...overwriteConfigs,
    };

    const source = axios.CancelToken.source();
    const cancelActionType = action.actionCreator.creatorRefs.cancel.actionType;
    return this.axiosObservable(
      requestConfig.rawConfigs,
      {
        success: createSuccessAction,
        error: createErrorAction,
        cancel: createCancelAction,
      },
      {
        axiosCancelTokenSource: source,
        cancelStream$: action$.pipe(
          filter<QcAction>((cancelAction) => {
            if (cancelAction.type !== cancelActionType) {
              return false;
            }
            return true;
          }),
        ),
      },
    );
  }
}
