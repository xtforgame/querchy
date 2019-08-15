import { SliceReducer } from '~/common/interfaces';
import { CommonConfig, ModelMap } from '~/core/interfaces';
export * from './update-cache-action-interfaces';
export declare type ReducerSet<T> = {
    [P in keyof T]: SliceReducer;
} & {
    [s: string]: SliceReducer;
};
export declare type ReducerSets<CommonConfigType extends CommonConfig, T extends ModelMap<CommonConfigType>> = {
    [P in keyof T]: ReducerSet<Required<T[P]>['actions']>;
} & {
    [s: string]: {
        [s: string]: SliceReducer;
    };
};
