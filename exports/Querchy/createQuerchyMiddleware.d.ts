import { Action, Store } from 'pure-epic';
declare const _default: <ActionType extends Action = Action, StateType extends any = any, StoreType extends Store<ActionType, StateType> = Store<ActionType, StateType>>(namespace?: string) => (s: StoreType) => (next: Function) => (action: ActionType) => any;
export default _default;
