import { ResourceState } from '../common/interfaces';

export const toNull = (...args) : any => ({ type: 'TO_NULL' });

// https://stackoverflow.com/questions/50011616/typescript-change-function-type-so-that-it-returns-new-value
export type ArgumentTypes<T> = T extends (... args: infer U ) => infer R ? U: never;
export type ReturnType<T> = T extends (...args: infer U ) => infer R ? R: never;
export type ReplaceReturnType<T, TNewReturn> = (...a: ArgumentTypes<T>) => TNewReturn;
export type WithOptional = ReplaceReturnType<(n?: number) => string, Promise<string>>;

// https://juejin.im/post/5cb96c65e51d4578c35e7287
export type OmitNever<T> = Pick<T, {[P in keyof T]: T[P] extends never ? never : P}[keyof T]>;

export type GetConstructorArgs<T> = T extends new (...args: infer U) => any ? U : never;

export interface Constructor<T> {
  new (...args): T;
}

export interface ConstructorWithFunction<T, ConstructorFunction> {
  new (...args : ArgumentTypes<ConstructorFunction>): T;
}

// https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c

// type Y<T extends { [s : string] : (...args) => string }> = {
//   [P in keyof T] : ReplaceReturnType<T[P], Promise<string>> & {pp : string};
// };

// ===============================

// interface ActionCreators {
//   a: (s : string) => any;
//   [s : string] : (...args) => string;
// }

// type Y<T extends { [s : string] : (...args) => string }> = {
//   [P in keyof T] : ReplaceReturnType<T[P], Promise<string>> & {pp : string};
// };

// const testx = () => {
//   const wrapActionCreator : (actionCreators : ActionCreators) => Y<ActionCreators> = () => { return <any>null; };

//   const x = wrapActionCreator({
//     a: (dd : string) => 's',
//   });
//   x.a.pp = '';
// };

// type Y2<T extends { [s : string] : ActionCreators }> = {
//   [P in keyof T] : ReplaceReturnType<T[P]['a'], Promise<string>> & {pp : string};
// };

// interface ActionCreatorsx {
//   a: ActionCreators;
//   [s : string] : ActionCreators;
// }

// const testxx = () => {
//   const wrapActionCreator : (actionCreatorsx : ActionCreatorsx) => Y2<ActionCreatorsx> = () => { return <any>null; };

//   const x = wrapActionCreator({
//     a: {
//       a: (dd : string) => 's',
//     },
//   });
//   x.a('s');
// };

export const createEmptyResourceState = () : ResourceState => ({
  queryMap: {
    metadata: {},
    values: {},
  },
  resourceMap: {
    metadata: {},
    values: {},
  },
});

export const mergeResourceState = (
  a : ResourceState,
  ...rest : Partial<ResourceState>[]
) : ResourceState => {
  if (rest.length === 0) {
    return a;
  }
  const [b, ...rest2] = rest;
  const result : ResourceState =  {
    resourceMap: {
      metadata: {
        ...a.resourceMap.metadata,
        ...b.resourceMap && b.resourceMap.metadata,
      },
      values: {
        ...a.resourceMap.values,
        ...b.resourceMap && b.resourceMap.values,
      },
    },
    queryMap: {
      metadata: {
        ...a.queryMap.metadata,
        ...b.queryMap && b.queryMap.metadata,
      },
      values: {
        ...a.queryMap.values,
        ...b.queryMap && b.queryMap.values,
      },
    },
  };
  if (rest2.length === 0) {
    return result;
  }
  return mergeResourceState(result, ...rest2);
};
