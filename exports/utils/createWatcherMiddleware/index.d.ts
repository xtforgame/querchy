import { Action, Store } from 'pure-epic';
export declare const SUCCESS_ACTION: unique symbol;
export declare const ERROR_ACTION: unique symbol;
export declare const CANCEL_ACTION: unique symbol;
export declare const SUCCESS_CALLBACK: unique symbol;
export declare const ERROR_CALLBACK: unique symbol;
export declare const CANCEL_CALLBACK: unique symbol;
export declare const symbolList: symbol[];
export declare const watchList: symbol[];
export declare const watchListPair: [symbol, symbol][];
export declare type PassType = 'pass' | 'never';
export declare const PASS_ANYWAY: PassType;
export declare const PASS_NEVER: PassType;
export declare type TestFunction<ActionType extends Action = Action> = (action: ActionType) => boolean;
export declare type Tester<ActionType extends Action = Action> = PassType | TestFunction<ActionType>;
export declare type CallbackFunction<ActionType extends Action = Action> = (action: ActionType) => any;
export declare let watchListMap: Map<symbol, symbol>;
export declare type CheckInfo<ActionType extends Action = Action> = {
    test: TestFunction<ActionType>;
    callback: CallbackFunction<ActionType>;
};
export declare type PendingActionInfo<ActionType extends Action = Action> = {
    action: ActionType;
    checkList: CheckInfo<ActionType>[];
};
declare const _default: <ActionType extends Action = Action, StateType extends any = any, StoreType extends Store<ActionType, StateType> = Store<ActionType, StateType>>() => ((store: StoreType) => (next: any) => (action: ActionType) => any) & {
    getPendingActions: () => PendingActionInfo<ActionType>[];
};
export default _default;
