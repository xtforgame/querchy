import {
  QcAction,
} from '~/common/interfaces';

import {
  CommonConfig,
  ModelMap,
} from '~/core/interfaces';

export type SliceReducer = (state: any, action: QcAction) => any;

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
