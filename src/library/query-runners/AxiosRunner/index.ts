import { Epic, Action, State, ActionsObservable, StateObservable } from 'pure-epic';
import { Observable, ObservableInput } from 'rxjs';
import axios from 'axios';
import { mergeMap, filter } from 'rxjs/operators';

import {
  QcAction,
  QcState,
  QcStore,
  RunnerType,
} from '~/common/interfaces';

import {
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

  ModelMapType extends ModelMap = ModelMap,
  QueryCreatorMapType extends QueryCreatorMap<ModelMap> = QueryCreatorMap<ModelMap>,
  QuerchyDefinitionType extends QuerchyDefinition<
    ModelMapType, QueryCreatorMapType> = QuerchyDefinition<ModelMapType, QueryCreatorMapType
  >,

  Dependencies extends QcDependencies<
    ModelMapType, QueryCreatorMapType, QuerchyDefinitionType
  > = QcDependencies<ModelMapType, QueryCreatorMapType, QuerchyDefinitionType>,
> implements QueryRunner<
  Input, Output, StateType, ModelMapType, QueryCreatorMapType, QuerchyDefinitionType, Dependencies
> {
  type : RunnerType;
  axiosObservable : any;

  constructor() {
    this.type = 'axios';
    this.axiosObservable = AxiosObservable();
  }

  handle : RunnerRun<
    Input, Output, StateType, ModelMapType, QueryCreatorMapType, QuerchyDefinitionType, Dependencies
  > = (
    action, { store$, action$, dependencies },
  ) => {
    const createSuccessAction = response => ({ type: `${action.type}_SUCCESS`, response });
    const createErrorAction = error => ({ type: `${action.type}_ERROR`, error });
    const createCancelAction = reason => ({ type: `${action.type}_CANCEL`, reason });

    // console.log('action :', action);
    // console.log('store :', store$.value);
    // console.log('dependencies :', dependencies);

    const queryCreator = dependencies!.querchyDef.queryCreators[action.type];
    if (!queryCreator) {
      return [createErrorAction(new Error(`QueryCreator not found: ${action.type}`))];
    }

    let requestConfig : RequestConfig;
    try {
      requestConfig = queryCreator.buildRequestConfig(this.type);
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
