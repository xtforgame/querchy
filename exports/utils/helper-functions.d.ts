import { ResourceState } from '../common/interfaces';
export declare const toNull: (...args: any[]) => any;
export declare type ArgumentTypes<T> = T extends (...args: infer U) => infer R ? U : never;
export declare type ReturnType<T> = T extends (...args: infer U) => infer R ? R : never;
export declare type ReplaceReturnType<T, TNewReturn> = (...a: ArgumentTypes<T>) => TNewReturn;
export declare type WithOptional = ReplaceReturnType<(n?: number) => string, Promise<string>>;
export declare type OmitNever<T> = Pick<T, {
    [P in keyof T]: T[P] extends never ? never : P;
}[keyof T]>;
export declare type GetConstructorArgs<T> = T extends new (...args: infer U) => any ? U : never;
export interface Constructor<T> {
    new (...args: any[]): T;
}
export interface ConstructorWithFunction<T, ConstructorFunction> {
    new (...args: ArgumentTypes<ConstructorFunction>): T;
}
export declare const createEmptyResourceState: () => ResourceState;
export declare const mergeResourceState: (a: ResourceState, ...rest: Partial<ResourceState>[]) => ResourceState;
