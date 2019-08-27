import { Epic, createEpicMiddleware, combineEpics, State } from 'pure-epic';
import {
  SliceReducer,
  ResourceStateResourceMap,
  ResourceStateQueryMap,
  BaseSelector,
  ResourceStateMetadataMap,
  ResourceStateValueMap,
} from '../common/interfaces';

import {
  CommonConfig,
  ModelMap,
} from '../core/interfaces';

import {
  ReturnType,
} from '../utils/helper-functions';

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

export type SelectorInfo<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>,
> = {
  creatorCreator: (baseSelector : BaseSelector<ModelMapType>) => Function,
};

export type SelectorInfos<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>,
> = {
  selectorInfos: {
    [s : string]: SelectorInfo<CommonConfigType, ModelMapType>;
  };
};

// ======================================

export type SliceSelectorCreator = any;

export type BuiltinSelectorCreators<StateType extends State> = {
  selectResourceMap: () => (state : StateType) => ResourceStateResourceMap;
  selectResourceMapMetadata: () => (state : StateType) => ResourceStateMetadataMap;
  selectResourceMapValues: () => (state : StateType) => ResourceStateValueMap;
  selectQueryMap: () => (state : StateType) => ResourceStateQueryMap;
  selectQueryMapMetadata: () => (state : StateType) => ResourceStateMetadataMap;
  selectQueryMapValues: () => (state : StateType) => ResourceStateValueMap;
};

export type SelectorCreatorSet<StateType extends State, T> = BuiltinSelectorCreators<StateType> & T;

export type SelectorCreatorSets<
  StateType extends State,
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>,
  ExtraSelectorCreators
> = {
  [P in keyof ModelMapType] : SelectorCreatorSet<StateType, {}>;
} & ExtraSelectorCreators & {
  [s : string] : SelectorCreatorSet<StateType, {}>;
};

// ======================================

export type SliceSelector = any;

export type BuiltinSelectors<StateType extends State> = {
  [P in keyof BuiltinSelectorCreators<StateType>] : ReturnType<BuiltinSelectorCreators<StateType>[P]>
};

export type SelectorSet<StateType extends State, T> = BuiltinSelectors<StateType> & T;

export type SelectorSets<
  StateType extends State,
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>,
  ExtraSelectorCreators
> = {
  [P in keyof ModelMapType] : SelectorSet<StateType, {}>;
} & ExtraSelectorCreators & {
  [s : string] : SelectorSet<StateType, {}>;
};
