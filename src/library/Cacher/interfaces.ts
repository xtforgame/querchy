import {
  QcAction,
  ResourceMetadata,
  ResourceMetadataMap,
  ResourceState,
} from '~/common/interfaces';

import {
  CommonConfig,
  ModelMap,
} from '~/core/interfaces';

export type Merger<
  ActionType extends QcAction
> = (state: ResourceState, action: ActionType) => ResourceState;

export type BasicMerger = Merger<QcAction>;

export type RootReducer = (state: any, action: QcAction) => any;

export type SliceReducer = BasicMerger;

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
