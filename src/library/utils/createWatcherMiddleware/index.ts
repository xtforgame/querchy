// https://github.com/Chion82/redux-wait-for-action

// difference:
//   1. don't modified return value
//   2. use separate callbacks instead of promise

import { Action, State, Store } from 'pure-epic';

export const SUCCESS_ACTION = Symbol('SUCCESS_ACTION');
export const ERROR_ACTION = Symbol('ERROR_ACTION');
export const CANCEL_ACTION = Symbol('CANCEL_ACTION');

export const SUCCESS_CALLBACK = Symbol('SUCCESS_CALLBACK');
export const ERROR_CALLBACK = Symbol('ERROR_CALLBACK');
export const CANCEL_CALLBACK = Symbol('CANCEL_CALLBACK');

export const symbolList : symbol[] = [
  SUCCESS_ACTION,
  ERROR_ACTION,
  CANCEL_ACTION,

  SUCCESS_CALLBACK,
  ERROR_CALLBACK,
  CANCEL_CALLBACK,
];

export const watchList : symbol[] = [
  SUCCESS_ACTION,
  ERROR_ACTION,
  CANCEL_ACTION,
];

export const watchListPair : [symbol, symbol][] = [
  [SUCCESS_ACTION, SUCCESS_CALLBACK],
  [ERROR_ACTION, ERROR_CALLBACK],
  [CANCEL_ACTION, CANCEL_CALLBACK],
];

export type PassType = 'pass' | 'never';

export const PASS_ANYWAY : PassType = 'pass';
export const PASS_NEVER : PassType = 'never';

export type TestFunction<
  ActionType extends Action = Action,
> = (action : ActionType) => boolean;

export type Tester<
  ActionType extends Action = Action,
> = PassType | TestFunction<ActionType>;

export type CallbackFunction<
  ActionType extends Action = Action,
> = (action : ActionType) => any;

export let watchListMap : Map<symbol, symbol> = new Map<symbol, symbol>(watchListPair);

export type CheckInfo<
  ActionType extends Action = Action,
> = {
  test: TestFunction<ActionType>;
  callback: CallbackFunction<ActionType>;
};

export type PendingActionInfo<
  ActionType extends Action = Action,
> = {
  action: ActionType,
  checkList: CheckInfo<ActionType>[],
};

export default <
  ActionType extends Action = Action,
  StateType extends State = State,
  StoreType extends Store<ActionType, StateType> = Store<ActionType, StateType>,
>() => {
  const pendingActions : PendingActionInfo<ActionType>[] = [];
  const getPendingActions = () => pendingActions;

  const middleware = (store : StoreType) => next => (action : ActionType) => {
    for (let i = pendingActions.length - 1; i >= 0; i--) {
      const pendingActionInfo = pendingActions[i];
      for (let j = 0; j < pendingActionInfo.checkList.length; j++) {
        const checkInfo = pendingActionInfo.checkList[j];
        if (checkInfo.test(action)) {
          checkInfo.callback(action);
          pendingActions.splice(i, 1);
          break;
        }
      }
    }

    let pendingActionInfo : PendingActionInfo<ActionType> | undefined;
    for (let index = 0; index < watchList.length; index++) {
      const watchSymbol = watchList[index];
      if (action[watchSymbol]) {
        if (action[watchSymbol] === PASS_ANYWAY) {
          const callback = action[watchListMap.get(watchSymbol)!] || (() => {});
          setTimeout(() => callback(action));
          pendingActionInfo = undefined;
          break;
        } else if (action[watchSymbol] === PASS_NEVER) {
          continue;
        }
        pendingActionInfo = pendingActionInfo || {
          action,
          checkList: [],
        };
        pendingActionInfo.checkList.push({
          test: action[watchSymbol],
          callback: action[watchListMap.get(watchSymbol)!] || (() => {}),
        });
      }
    }

    if (!pendingActionInfo) {
      return next(action);
    }

    pendingActions.push(pendingActionInfo);

    return next(action);
  };

  return Object.assign(middleware, { getPendingActions });
};
