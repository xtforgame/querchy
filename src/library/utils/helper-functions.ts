export const toNull = (...args) : any => ({ type: 'TO_NULL' });

// https://stackoverflow.com/questions/50011616/typescript-change-function-type-so-that-it-returns-new-value
export type ArgumentTypes<T> = T extends (... args: infer U ) => infer R ? U: never;
export type ReplaceReturnType<T, TNewReturn> = (...a: ArgumentTypes<T>) => TNewReturn;
export type WithOptional = ReplaceReturnType<(n?: number) => string, Promise<string>>;

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
