export declare function defaultToPromiseFunc(prev: any, curr: any, index: any, array: any): Promise<any>;
export declare function toSeqPromise(inArray: any, toPrmiseFunc?: typeof defaultToPromiseFunc): any;
export declare function promiseWait(waitMillisec: any): Promise<unknown>;
export declare class PreservePromise<T> {
    fulfilled: boolean;
    promise: Promise<T>;
    result?: {
        type: 'resolve' | 'reject';
        value: T | Error;
    };
    _resolve?: (value?: T | PromiseLike<T> | undefined) => void;
    _reject?: (reason?: any) => void;
    constructor();
    resolve(value: any): void;
    reject(value: any): void;
}
declare const toCamel: (str: string) => string;
declare const toUnderscore: (str: string) => string;
declare const capitalizeFirstLetter: (str: string) => string;
export { toCamel, toUnderscore, capitalizeFirstLetter, };
