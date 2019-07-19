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
  RequestConfig,
} from '~/core/interfaces';

import {
  RunnerRun,
  RunnerRunOption,
  QueryRunner,
  Canceler,
  CancelTokenSource,
} from '~/query-runners/interfaces';

import AxiosObservable from '../utils/AxiosObservable';

export default class AxiosRunner<
  Input extends Action = QcAction,
  Output extends Input = Input,
  StateType extends State = QcState,

  CommonConfigType extends CommonConfig = CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType> = ModelMap<CommonConfigType>,
  QueryCreatorMapType extends QueryCreatorMap<
    CommonConfigType, ModelMapType
  > = QueryCreatorMap<CommonConfigType, ModelMapType>,
  QuerchyDefinitionType extends QuerchyDefinition<
    CommonConfigType, ModelMapType, QueryCreatorMapType
  > = QuerchyDefinition<CommonConfigType, ModelMapType, QueryCreatorMapType>,

  ExtraDependencies = any,
> implements QueryRunner<
  Input,
  Output,
  StateType,
  CommonConfigType,
  ModelMapType,
  QueryCreatorMapType,
  QuerchyDefinitionType,
  ExtraDependencies
> {
  type : RunnerType;
  axiosObservable : any;

  constructor(a?: AxiosStatic) {
    this.type = 'axios';
    this.axiosObservable = AxiosObservable(a || axios);
  }

  handle : RunnerRun<
    Input,
    Output,
    StateType,
    CommonConfigType,
    ModelMapType,
    QueryCreatorMapType,
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

    const createSuccessAction = response => ({ type: `${action.type}_SUCCESS`, response });
    const createErrorAction = error => ({ type: `${action.type}_ERROR`, error });
    const createCancelAction = reason => ({ type: `${action.type}_CANCEL`, reason });

    const queryCreator = queryCreatorMap[action.type];
    if (!queryCreator) {
      return [createErrorAction(new Error(`QueryCreator not found: ${action.type}`))];
    }

    let requestConfig : RequestConfig;
    try {
      requestConfig = queryCreator.buildRequestConfig(this.type, commonConfig);
    } catch (error) {
      return [createErrorAction(error)];
    }

    const {
      rawConfig,
      method,
      url,
      headers,
      query,
      body,
    } = requestConfig;

    const source = axios.CancelToken.source();
    return this.axiosObservable(
      rawConfig || {
        method,
        url,
        headers: { ...headers },
        data: body,
        params: query,
      },
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
