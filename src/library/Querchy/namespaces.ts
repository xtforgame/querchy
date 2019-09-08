import {
  ActionsObservable,
  StateObservable,
  Action,
  Epic,
  State,
  Store,
  Dependencies,
} from 'pure-epic';

export interface CommonStore {
  dispatch(action: Action): any;
  getState(): State;
}

export type QuerchyNamespace = {
  name: string;
  store: CommonStore;
};

export type QuerchyNamespaces = {
  [s : string] : QuerchyNamespace;
};

export const defaultNamespaceName = 'default-ns';

const namespaces : QuerchyNamespaces = {};
export default namespaces;
