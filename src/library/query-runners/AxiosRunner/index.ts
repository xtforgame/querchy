import { State } from 'pure-epic';
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
  StateType extends State = QcState,

  CommonConfigType extends CommonConfig = CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType> = ModelMap<CommonConfigType>,
  QueryCreatorMapType extends QueryCreatorMap<
    CommonConfigType, ModelMapType
  > = QueryCreatorMap<CommonConfigType, ModelMapType>,
  ExtraActionCreatorsType extends ExtraActionCreators<
    CommonConfigType, ModelMapType, QueryCreatorMapType
  > = ExtraActionCreators<
    CommonConfigType, ModelMapType, QueryCreatorMapType
  >,
  QuerchyDefinitionType extends QuerchyDefinition<
    CommonConfigType, ModelMapType, QueryCreatorMapType, ExtraActionCreatorsType
  > = QuerchyDefinition<CommonConfigType, ModelMapType, QueryCreatorMapType, ExtraActionCreatorsType>,

  ExtraDependencies = any,
> implements QueryRunner<
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
    this.axiosObservable = AxiosObservable<any>(a || axios);
  }

  handle : RunnerRun<
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

    const createSuccessAction = action.actionCreator.creatorRefs.respond;

    const createErrorAction = action.actionCreator.creatorRefs.respondError;

    const createCancelAction = action.actionCreator.creatorRefs.cancel;

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
