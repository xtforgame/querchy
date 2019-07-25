import { Epic, Action, State, ActionsObservable, StateObservable } from 'pure-epic';
import { Observable, ObservableInput } from 'rxjs';
import axios, { AxiosStatic } from 'axios';
import { mergeMap, filter } from 'rxjs/operators';

import {
  QcAction,
  QcState,
  QcStore,
  RunnerType,
} from '~/common/interfaces';

import {
  CommonConfig,
  ModelMap,
  QueryCreatorMap,
  QuerchyDefinition,
  QcDependencies,
  QcRequestConfig,
  QcRequestActionCreators,
  ExtraActionCreators,
} from '~/core/interfaces';

import {
  RunnerRun,
  RunnerRunOption,
  QueryRunner,
  Canceler,
  CancelTokenSource,
} from '~/query-runners/interfaces';

import AxiosObservable, { AxiosObservableOptions } from './AxiosObservable';

export default class AxiosRunner<
  Input extends Action = QcAction,
  Output extends Input = Input,
  StateType extends State = QcState,

  CommonConfigType extends CommonConfig = CommonConfig,
  ModelMapType extends ModelMap<Input, CommonConfigType> = ModelMap<Input, CommonConfigType>,
  QueryCreatorMapType extends QueryCreatorMap<
    Input, CommonConfigType, ModelMapType
  > = QueryCreatorMap<Input, CommonConfigType, ModelMapType>,
  ExtraActionCreatorsType extends ExtraActionCreators<
    Input, CommonConfigType, ModelMapType, QueryCreatorMapType
  > = ExtraActionCreators<
    Input, CommonConfigType, ModelMapType, QueryCreatorMapType
  >,
  QuerchyDefinitionType extends QuerchyDefinition<
    Input, CommonConfigType, ModelMapType, QueryCreatorMapType, ExtraActionCreatorsType
  > = QuerchyDefinition<Input, CommonConfigType, ModelMapType, QueryCreatorMapType, ExtraActionCreatorsType>,

  ExtraDependencies = any,
> implements QueryRunner<
  Input,
  Output,
  StateType,
  CommonConfigType,
  ModelMapType,
  QueryCreatorMapType,
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
    this.axiosObservable = AxiosObservable<any, Input>(a || axios);
  }

  handle : RunnerRun<
    Input,
    Output,
    StateType,
    CommonConfigType,
    ModelMapType,
    QueryCreatorMapType,
    ExtraActionCreatorsType,
    QuerchyDefinitionType,
    ExtraDependencies
  > = (
    action, { store$, action$, dependencies },
  ) => {

    // console.log('action :', action);
    // console.log('store :', store$.value);
    // console.log('dependencies :', dependencies);

    const { querchyDef, queryCreatorMap } = dependencies!;
    const { commonConfig } = querchyDef;
    const queryCreator = queryCreatorMap[action.type];
    if (!queryCreator) {
      throw new Error(`QueryCreator not found: ${action.type}`);
    }

    const createSuccessAction = (response, responseType) => ({
      type: `${action.type}_SUCCESS`,
      response,
      responseType,
      options: {},
    });

    const createErrorAction = (error) => ({
      type: `${action.type}_ERROR`,
      error,
      options: {},
    });

    const createCancelAction = (reason) => ({
      type: `${action.type}_CANCEL`,
      reason,
      options: {},
    });

    let requestConfig : QcRequestConfig;
    try {
      requestConfig = queryCreator.buildRequestConfig(action, this.type, commonConfig);
    } catch (error) {
      return [createErrorAction(error)];
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
          filter<Input>((cancelAction) => {
            if (cancelAction.type !== `${action.type}_CANCEL`) {
              return false;
            }
            return true;
          }),
        ),
      },
    );
  }
}
