"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.watchListMap = exports.PASS_NEVER = exports.PASS_ANYWAY = exports.watchListPair = exports.watchList = exports.symbolList = exports.CANCEL_CALLBACK = exports.ERROR_CALLBACK = exports.SUCCESS_CALLBACK = exports.CANCEL_ACTION = exports.ERROR_ACTION = exports.SUCCESS_ACTION = void 0;
var SUCCESS_ACTION = Symbol('SUCCESS_ACTION');
exports.SUCCESS_ACTION = SUCCESS_ACTION;
var ERROR_ACTION = Symbol('ERROR_ACTION');
exports.ERROR_ACTION = ERROR_ACTION;
var CANCEL_ACTION = Symbol('CANCEL_ACTION');
exports.CANCEL_ACTION = CANCEL_ACTION;
var SUCCESS_CALLBACK = Symbol('SUCCESS_CALLBACK');
exports.SUCCESS_CALLBACK = SUCCESS_CALLBACK;
var ERROR_CALLBACK = Symbol('ERROR_CALLBACK');
exports.ERROR_CALLBACK = ERROR_CALLBACK;
var CANCEL_CALLBACK = Symbol('CANCEL_CALLBACK');
exports.CANCEL_CALLBACK = CANCEL_CALLBACK;
var symbolList = [SUCCESS_ACTION, ERROR_ACTION, CANCEL_ACTION, SUCCESS_CALLBACK, ERROR_CALLBACK, CANCEL_CALLBACK];
exports.symbolList = symbolList;
var watchList = [SUCCESS_ACTION, ERROR_ACTION, CANCEL_ACTION];
exports.watchList = watchList;
var watchListPair = [[SUCCESS_ACTION, SUCCESS_CALLBACK], [ERROR_ACTION, ERROR_CALLBACK], [CANCEL_ACTION, CANCEL_CALLBACK]];
exports.watchListPair = watchListPair;
var PASS_ANYWAY = 'pass';
exports.PASS_ANYWAY = PASS_ANYWAY;
var PASS_NEVER = 'never';
exports.PASS_NEVER = PASS_NEVER;
var watchListMap = new Map(watchListPair);
exports.watchListMap = watchListMap;

var _default = function _default() {
  var pendingActions = [];

  var getPendingActions = function getPendingActions() {
    return pendingActions;
  };

  var middleware = function middleware(store) {
    return function (next) {
      return function (action) {
        for (var i = pendingActions.length - 1; i >= 0; i--) {
          var _pendingActionInfo = pendingActions[i];

          for (var j = 0; j < _pendingActionInfo.checkList.length; j++) {
            var checkInfo = _pendingActionInfo.checkList[j];

            if (checkInfo.test(action)) {
              checkInfo.callback(action);
              pendingActions.splice(i, 1);
              break;
            }
          }
        }

        var pendingActionInfo;

        for (var index = 0; index < watchList.length; index++) {
          var watchSymbol = watchList[index];

          if (action[watchSymbol]) {
            if (action[watchSymbol] === PASS_ANYWAY) {
              var _ret = function () {
                var callback = action[watchListMap.get(watchSymbol)] || function () {};

                setTimeout(function () {
                  return callback(action);
                });
                pendingActionInfo = undefined;
                return "break";
              }();

              if (_ret === "break") break;
            } else if (action[watchSymbol] === PASS_NEVER) {
              continue;
            }

            pendingActionInfo = pendingActionInfo || {
              action: action,
              checkList: []
            };
            pendingActionInfo.checkList.push({
              test: action[watchSymbol],
              callback: action[watchListMap.get(watchSymbol)] || function () {}
            });
          }
        }

        if (!pendingActionInfo) {
          return next(action);
        }

        pendingActions.push(pendingActionInfo);
        return next(action);
      };
    };
  };

  return Object.assign(middleware, {
    getPendingActions: getPendingActions
  });
};

exports["default"] = _default;