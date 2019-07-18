import { Action, State, ActionsObservable, StateObservable } from 'pure-epic';
import { Observable } from 'rxjs';

import {
  QcAction,
  QcState,
  RunnerType,
} from '~/common/interfaces';

import {
  ModelMap,
  QueryCreatorMap,
  QuerchyDefinition,
  QcDependencies,
} from '~/core/interfaces';

export interface Canceler {
  (message?: string): void;
}

export interface CancelTokenSource {
  token: any;
  cancel: Canceler;
}

export type RunnerRunOption<
  Input extends Action = QcAction,
  StateType extends State = QcState,

  ModelMapType extends ModelMap = ModelMap,
  QueryCreatorMapType extends QueryCreatorMap<ModelMap> = QueryCreatorMap<ModelMap>,
  QuerchyDefinitionType extends QuerchyDefinition<
    ModelMapType, QueryCreatorMapType> = QuerchyDefinition<ModelMapType, QueryCreatorMapType
  >,

  Dependencies extends QcDependencies<
    ModelMapType, QueryCreatorMapType, QuerchyDefinitionType
  > = QcDependencies<ModelMapType, QueryCreatorMapType, QuerchyDefinitionType>,
> = {
  action$: ActionsObservable<Input>;
  store$: StateObservable<StateType>;
  dependencies?: Dependencies;
  args: any[];
};

export type RunnerRun<
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
> = (
  action: Input,
  options: RunnerRunOption<
    Input, StateType, ModelMapType, QueryCreatorMapType, QuerchyDefinitionType, Dependencies
  >,
) => Observable<Output>;

export type QueryRunner<
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
> = {
  type: RunnerType;
  handle: RunnerRun<
    Input, Output, StateType, ModelMapType, QueryCreatorMapType, QuerchyDefinitionType, Dependencies
  >,
};
