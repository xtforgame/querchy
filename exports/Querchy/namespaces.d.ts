import { Action, State } from 'pure-epic';
export interface CommonStore {
    dispatch(action: Action): any;
    getState(): State;
}
export declare type QuerchyNamespace = {
    name: string;
    store: CommonStore;
};
export declare type QuerchyNamespaces = {
    [s: string]: QuerchyNamespace;
};
export declare const defaultNamespaceName = "default-ns";
declare const namespaces: QuerchyNamespaces;
export default namespaces;
