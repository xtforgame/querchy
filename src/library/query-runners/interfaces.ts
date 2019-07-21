import { Action, State, ActionsObservable, StateObservable } from 'pure-epic';
import { Observable } from 'rxjs';

import {
  QcAction,
  QcState,
  RunnerType,
} from '~/common/interfaces';

import {
  CommonConfig,
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

  CommonConfigType extends CommonConfig = CommonConfig,
  ModelMapType extends ModelMap<Input, CommonConfigType> = ModelMap<Input, CommonConfigType>,
  QueryCreatorMapType extends QueryCreatorMap<
    Input, CommonConfigType, ModelMapType
  > = QueryCreatorMap<Input, CommonConfigType, ModelMapType>,
  QuerchyDefinitionType extends QuerchyDefinition<
    Input, CommonConfigType, ModelMapType, QueryCreatorMapType
  > = QuerchyDefinition<Input, CommonConfigType, ModelMapType, QueryCreatorMapType>,

  ExtraDependencies = any,
> = {
  action$: ActionsObservable<Input>;
  store$: StateObservable<StateType>;
  dependencies?: QcDependencies<
    Input, CommonConfigType, ModelMapType, QueryCreatorMapType, QuerchyDefinitionType, ExtraDependencies
  >;
  args: any[];
};

export type RunnerRun<
  Input extends Action = QcAction,
  Output extends Input = Input,
  StateType extends State = QcState,

  CommonConfigType extends CommonConfig = CommonConfig,
  ModelMapType extends ModelMap<Input, CommonConfigType> = ModelMap<Input, CommonConfigType>,
  QueryCreatorMapType extends QueryCreatorMap<
    Input, CommonConfigType, ModelMapType
  > = QueryCreatorMap<Input, CommonConfigType, ModelMapType>,
  QuerchyDefinitionType extends QuerchyDefinition<
    Input, CommonConfigType, ModelMapType, QueryCreatorMapType
  > = QuerchyDefinition<Input, CommonConfigType, ModelMapType, QueryCreatorMapType>,

  ExtraDependencies = any,
> = (
  action: Input,
  options: RunnerRunOption<
    Input,
    StateType,
    CommonConfigType,
    ModelMapType,
    QueryCreatorMapType,
    QuerchyDefinitionType,
    ExtraDependencies
  >,
) => Observable<Output>;

export type QueryRunner<
  Input extends Action = QcAction,
  Output extends Input = Input,
  StateType extends State = QcState,

  CommonConfigType extends CommonConfig = CommonConfig,
  ModelMapType extends ModelMap<Input, CommonConfigType> = ModelMap<Input, CommonConfigType>,
  QueryCreatorMapType extends QueryCreatorMap<
    Input, CommonConfigType, ModelMapType
  > = QueryCreatorMap<Input, CommonConfigType, ModelMapType>,
  QuerchyDefinitionType extends QuerchyDefinition<
    Input, CommonConfigType, ModelMapType, QueryCreatorMapType
  > = QuerchyDefinition<Input, CommonConfigType, ModelMapType, QueryCreatorMapType>,

  ExtraDependencies = any,
> = {
  type: RunnerType;
  handle: RunnerRun<
    Input,
    Output,
    StateType,
    CommonConfigType,
    ModelMapType,
    QueryCreatorMapType,
    QuerchyDefinitionType,
    ExtraDependencies
  >,
};
