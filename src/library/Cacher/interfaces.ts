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

export type SelectorCreatorSet = {
  queryMapSelectorCreator: () => (state : any) => ResourceStateQueryMap;
  resourceMapSelectorCreator: () => (state : any) => ResourceStateResourceMap;
};

export type SelectorCreatorSets<
  CommonConfigType extends CommonConfig,
  T extends ModelMap<CommonConfigType>
> = {
  [P in keyof T] : SelectorCreatorSet;
} & {
  [s : string] : SelectorCreatorSet;
};

// ======================================

export type SliceSelector = any;

export type SelectorSet = {
  queryMapSelector: (state : any) => ResourceStateQueryMap;
  resourceMapSelector: (state : any) => ResourceStateResourceMap;
};

export type SelectorSets<
  CommonConfigType extends CommonConfig,
  T extends ModelMap<CommonConfigType>
> = {
  [P in keyof T] : SelectorSet;
} & {
  [s : string] : SelectorSet;
};
