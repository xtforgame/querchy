export declare function defaultToPromiseFunc(prev: any, curr: any, index: any, array: any): Promise<any>;
export declare function toSeqPromise(inArray: any, toPrmiseFunc?: typeof defaultToPromiseFunc): any;
export declare function promiseWait(waitMillisec: any): Promise<unknown>;
declare const toCamel: (str: string) => string;
declare const toUnderscore: (str: string) => string;
declare const capitalizeFirstLetter: (str: string) => string;
export { toCamel, toUnderscore, capitalizeFirstLetter, };
