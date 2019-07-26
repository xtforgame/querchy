import { State, ActionsObservable, StateObservable } from 'pure-epic';
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
  ExtraActionCreators,

  StartActionCreatorWithProps,
} from '~/core/interfaces';

export interface Canceler {
  (message?: string): void;
}

export interface CancelTokenSource {
  token: any;
  cancel: Canceler;
}

export type RunnerRunOption<
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
> = {
  action$: ActionsObservable<QcAction>;
  store$: StateObservable<StateType>;
  dependencies?: QcDependencies<
    CommonConfigType, ModelMapType, QueryCreatorMapType, ExtraActionCreatorsType, QuerchyDefinitionType, ExtraDependencies
  >;
  args: any[];
};

export type RunnerRun<
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
> = (
  action: QcAction & {
    actionCreator: StartActionCreatorWithProps<Function>,
  },
  options: RunnerRunOption<
    StateType,
    CommonConfigType,
    ModelMapType,
    QueryCreatorMapType,
    ExtraActionCreatorsType,
    QuerchyDefinitionType,
    ExtraDependencies
  >,
) => Observable<QcAction>;

export type QueryRunner<
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
> = {
  type: RunnerType;
  handle: RunnerRun<
    StateType,
    CommonConfigType,
    ModelMapType,
    QueryCreatorMapType,
    ExtraActionCreatorsType,
    QuerchyDefinitionType,
    ExtraDependencies
  >,
};
