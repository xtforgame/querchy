export declare const toNull: (...args: any[]) => any;
export declare type ArgumentTypes<T> = T extends (...args: infer U) => infer R ? U : never;
export declare type ReturnType<T> = T extends (...args: infer U) => infer R ? R : never;
export declare type ReplaceReturnType<T, TNewReturn> = (...a: ArgumentTypes<T>) => TNewReturn;
export declare type WithOptional = ReplaceReturnType<(n?: number) => string, Promise<string>>;
export declare type OmitNever<T> = Pick<T, {
    [P in keyof T]: T[P] extends never ? never : P;
}[keyof T]>;
