import { Epic, createEpicMiddleware, combineEpics, State } from 'pure-epic';
import {
  SliceReducer,
  ResourceStateResourceMap,
  ResourceStateQueryMap,
} from '../common/interfaces';

import {
  CommonConfig,
  ModelMap,
} from '../core/interfaces';

export * from './update-cache-action-interfaces';

export type ReducerSet<T> = {
  [P in keyof T] : SliceReducer;
} & {
  [s : string] : SliceReducer;
};

export type ReducerSets<
  CommonConfigType extends CommonConfig,
  T extends ModelMap<CommonConfigType>
> = {
  [P in keyof T] : ReducerSet<Required<T[P]>['actions']>;
} & {
  [s : string] : { [s : string] : SliceReducer };
};

// ======================================

export type SliceSelectorCreator = any;

export type SelectorCreatorSet<StateType extends State, T> = {
  selectQueryMap: () => (state : StateType) => ResourceStateQueryMap;
  selectResourceMap: () => (state : StateType) => ResourceStateResourceMap;
} & T;

export type SelectorCreatorSets<
  StateType extends State,
  CommonConfigType extends CommonConfig,
  T extends ModelMap<CommonConfigType>,
> = {
  [P in keyof T] : SelectorCreatorSet<StateType, {}>;
} & {
  [s : string] : SelectorCreatorSet<StateType, {}>;
};

// ======================================

export type SliceSelector = any;

export type SelectorSet<StateType extends State, T> = {
  selectQueryMap: (state : StateType) => ResourceStateQueryMap;
  selectResourceMap: (state : StateType) => ResourceStateResourceMap;
} & T;

export type SelectorSets<
  StateType extends State,
  CommonConfigType extends CommonConfig,
  T extends ModelMap<CommonConfigType>,
> = {
  [P in keyof T] : SelectorSet<StateType, {}>;
} & {
  [s : string] : SelectorSet<StateType, {}>;
};
