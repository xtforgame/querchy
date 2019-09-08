"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExtraPromiseModelActionCreators = exports.createExtraActionCreators = exports.createExtraActionTypes = exports.createPromiseModelActionCreators = exports.createModelActionCreators = exports.createModelActionTypes = exports.wrapQueryActionCreator = exports.wrapActionCreator = exports.createActionTypes = void 0;

var _commonFunctions = require("../common/common-functions");

var _createWatcherMiddleware = require("../utils/createWatcherMiddleware");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var createActionTypes = function createActionTypes(actionTypePrefix2, commonConfig, names) {
  var _commonConfig$actionT = commonConfig.actionTypePrefix,
      actionTypePrefix = _commonConfig$actionT === void 0 ? '' : _commonConfig$actionT;
  return names.reduce(function (actionTypes, actionName) {
    return _objectSpread({}, actionTypes, _defineProperty({}, actionName, commonConfig.getActionTypeName(actionTypePrefix, "".concat(actionTypePrefix2).concat(actionName))));
  }, {});
};

exports.createActionTypes = createActionTypes;

var createBasicAction = function createBasicAction(type, actionCreator, result) {
  var props = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var transferables = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  var requestAction = _objectSpread({}, result, {
    type: type,
    actionCreator: actionCreator
  }, props, {
    transferables: _objectSpread({}, result.options && result.options.transferables)
  }, result.options && result.options.actionProps);

  if (requestAction.options) {
    _createWatcherMiddleware.symbolList.forEach(function (s) {
      if (!requestAction[s] && requestAction.options[s]) {
        requestAction[s] = requestAction.options[s];
      }
    });
  }

  requestAction.transferables = _objectSpread({}, result.transferables, {
    requestAction: requestAction
  }, transferables);
  return requestAction;
};

var createQueryAction = function createQueryAction(type, actionCreator, result) {
  var extraProps = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var extraTransferables = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var requestTimestamp = new Date().getTime();
  var basicResult = createBasicAction(type, actionCreator, result, _objectSpread({
    requestTimestamp: requestTimestamp
  }, extraProps), _objectSpread({
    requestTimestamp: requestTimestamp
  }, extraTransferables));
  var queryId = basicResult.options && basicResult.options.queryId;

  if (queryId) {
    basicResult.queryId = queryId;
    basicResult.transferables.queryId = queryId;
  }

  return basicResult;
};

var wrapActionCreator = function wrapActionCreator(modelName, actionTypes, actionName, actionInfo) {
  var rawFuncWrapper = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : function (f) {
    return f;
  };
  var finalFuncWrapper = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : function (f) {
    return f;
  };
  var start = rawFuncWrapper(actionInfo.actionCreator);
  var actionType = actionTypes[actionName];
  actionInfo.name = actionName;
  actionInfo.actionType = actionType;
  var startFunc = Object.assign(finalFuncWrapper(function () {
    return createBasicAction(actionType, startFunc, start.apply(void 0, arguments), {
      modelName: modelName,
      actionTypes: actionTypes,
      actionName: actionName
    }, {
      actionTimestamp: new Date().getTime()
    });
  }), {
    actionType: actionType
  });
  return startFunc;
};

exports.wrapActionCreator = wrapActionCreator;

var wrapQueryActionCreator = function wrapQueryActionCreator(modelName, actionTypes, crudType, actionInfo) {
  var rawFuncWrapper = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : function (f) {
    return f;
  };
  var finalFuncWrapper = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : function (f) {
    return f;
  };
  var queryActionCreatorProps = {
    creatorRefs: {}
  };
  var start = rawFuncWrapper(actionInfo.actionCreator);
  var actionType = actionTypes[crudType];
  actionInfo.name = crudType;
  actionInfo.actionType = actionType;
  actionInfo.querySubActionTypes = {
    start: actionType,
    respond: "".concat(actionType, "_RESPOND"),
    respondError: "".concat(actionType, "_RESPOND_ERROR"),
    cancel: "".concat(actionType, "_CANCEL")
  };
  var querySubActionTypes = actionInfo.querySubActionTypes;
  var startFunc = Object.assign(finalFuncWrapper(function () {
    return createQueryAction(actionType, startFunc, start.apply(void 0, arguments), {
      modelName: modelName,
      actionTypes: actionTypes,
      crudType: crudType,
      crudSubType: 'start'
    });
  }), queryActionCreatorProps, {
    actionType: actionType
  });

  var getQueryBuiltinProps = function getQueryBuiltinProps(crudSubType, options) {
    var transferables = options && options.transferables || {};
    return createQueryAction(querySubActionTypes[crudSubType], queryActionCreatorProps.creatorRefs[crudSubType], {
      options: options
    }, {
      modelName: modelName,
      actionTypes: actionTypes,
      crudType: crudType,
      crudSubType: crudSubType
    }, _objectSpread({}, transferables.requestAction && transferables.requestAction.transferables, {}, transferables));
  };

  queryActionCreatorProps.creatorRefs.start = startFunc;
  queryActionCreatorProps.creatorRefs.respond = Object.assign(function (response, responseType, options) {
    return _objectSpread({
      response: response,
      responseType: responseType,
      responseTimestamp: new Date().getTime()
    }, getQueryBuiltinProps('respond', options));
  }, queryActionCreatorProps, {
    actionType: querySubActionTypes.respond
  });
  queryActionCreatorProps.creatorRefs.respondError = Object.assign(function (error, options) {
    return _objectSpread({
      error: error,
      errorTimestamp: new Date().getTime()
    }, getQueryBuiltinProps('respondError', options));
  }, queryActionCreatorProps, {
    actionType: querySubActionTypes.respondError
  });
  queryActionCreatorProps.creatorRefs.cancel = Object.assign(function (reason, options) {
    return _objectSpread({
      reason: reason,
      cancelTimestamp: new Date().getTime()
    }, getQueryBuiltinProps('cancel', options));
  }, queryActionCreatorProps, {
    actionType: querySubActionTypes.cancel
  });
  return startFunc;
};

exports.wrapQueryActionCreator = wrapQueryActionCreator;

var createModelActionTypes = function createModelActionTypes(modelName, commonConfig, model) {
  return _objectSpread({}, createActionTypes("".concat(modelName, "_"), commonConfig, model.crudNames), {}, createActionTypes("".concat(modelName, "_"), commonConfig, model.actionNames));
};

exports.createModelActionTypes = createModelActionTypes;

var createModelActionCreators = function createModelActionCreators(commonConfigType, modelName, model) {
  var actionTypes = model.actionTypes;
  var queryInfos = model.queryInfos;
  var crudNames = model.crudNames;
  var actionInfos = model.actionInfos;
  var actionNames = model.actionNames;
  return _objectSpread({}, crudNames.reduce(function (actionCreators, crudType) {
    return _objectSpread({}, actionCreators, _defineProperty({}, crudType, wrapQueryActionCreator(modelName, actionTypes, crudType, queryInfos[crudType])));
  }, {}), {}, actionNames.reduce(function (actionCreators, actionName) {
    return _objectSpread({}, actionCreators, _defineProperty({}, actionName, wrapActionCreator(modelName, actionTypes, actionName, actionInfos[actionName])));
  }, {}));
};

exports.createModelActionCreators = createModelActionCreators;

var getRawFuncWrapperForAction = function getRawFuncWrapperForAction() {
  return function (f) {
    return function () {
      var result = f.apply(void 0, arguments);
      var pp = new _commonFunctions.PreservePromise();
      var symbol = Symbol('req_action');
      result._pp = pp;
      result.options = _objectSpread({}, result.options, {
        actionProps: _objectSpread({}, result.options && result.options.actionProps, {
          _symbol: symbol
        })
      });
      result.options.actionProps[_createWatcherMiddleware.SUCCESS_ACTION] = result.options.actionProps[_createWatcherMiddleware.SUCCESS_ACTION] || _createWatcherMiddleware.PASS_ANYWAY;

      var originSuccess = result.options.actionProps[_createWatcherMiddleware.SUCCESS_CALLBACK] || function () {};

      result.options.actionProps[_createWatcherMiddleware.SUCCESS_CALLBACK] = function (a) {
        originSuccess(a);
        pp.resolve(a);
      };

      result.options.actionProps[_createWatcherMiddleware.ERROR_ACTION] = result.options.actionProps[_createWatcherMiddleware.ERROR_ACTION] || _createWatcherMiddleware.PASS_ANYWAY;

      var originError = result.options.actionProps[_createWatcherMiddleware.ERROR_CALLBACK] || function () {};

      result.options.actionProps[_createWatcherMiddleware.ERROR_CALLBACK] = function (a) {
        originError(a);
        pp.reject(a);
      };

      return result;
    };
  };
};

var getRawFuncWrapperForQueryAction = function getRawFuncWrapperForQueryAction() {
  return function (f) {
    return function () {
      var result = f.apply(void 0, arguments);
      var pp = new _commonFunctions.PreservePromise();
      var symbol = Symbol('req_action');
      result._pp = pp;
      result.options = _objectSpread({}, result.options, {
        actionProps: _objectSpread({}, result.options && result.options.actionProps, {
          _symbol: symbol
        })
      });

      var getCheckFunc = function getCheckFunc(crudSubType) {
        return function (action) {
          return action.crudSubType === crudSubType && action.transferables && action.transferables.requestAction && action.transferables.requestAction._symbol === symbol;
        };
      };

      result.options.actionProps[_createWatcherMiddleware.SUCCESS_ACTION] = result.options.actionProps[_createWatcherMiddleware.SUCCESS_ACTION] || getCheckFunc('respond');

      var originSuccess = result.options.actionProps[_createWatcherMiddleware.SUCCESS_CALLBACK] || function () {};

      result.options.actionProps[_createWatcherMiddleware.SUCCESS_CALLBACK] = function (a) {
        originSuccess(a);
        pp.resolve(a);
      };

      result.options.actionProps[_createWatcherMiddleware.ERROR_ACTION] = result.options.actionProps[_createWatcherMiddleware.ERROR_ACTION] || getCheckFunc('respondError');

      var originError = result.options.actionProps[_createWatcherMiddleware.ERROR_CALLBACK] || function () {};

      result.options.actionProps[_createWatcherMiddleware.ERROR_CALLBACK] = function (a) {
        originError(a);
        pp.reject(a);
      };

      return result;
    };
  };
};

var getFinalFuncWrapper = function getFinalFuncWrapper(dispatch) {
  return function (f) {
    return function () {
      var result = f.apply(void 0, arguments);
      var pp = result._pp;
      delete result._pp;
      dispatch(result);
      return pp.promise;
    };
  };
};

var createPromiseModelActionCreators = function createPromiseModelActionCreators(dispatch, commonConfigType, modelName, model) {
  var actionTypes = model.actionTypes;
  var queryInfos = model.queryInfos;
  var crudNames = model.crudNames;
  var actionInfos = model.actionInfos;
  var actionNames = model.actionNames;
  return _objectSpread({}, crudNames.reduce(function (actionCreators, crudType) {
    return _objectSpread({}, actionCreators, _defineProperty({}, crudType, wrapQueryActionCreator(modelName, actionTypes, crudType, queryInfos[crudType], getRawFuncWrapperForQueryAction(), getFinalFuncWrapper(dispatch))));
  }, {}), {}, actionNames.reduce(function (actionCreators, actionName) {
    return _objectSpread({}, actionCreators, _defineProperty({}, actionName, wrapActionCreator(modelName, actionTypes, actionName, actionInfos[actionName], getRawFuncWrapperForAction(), getFinalFuncWrapper(dispatch))));
  }, {}));
};

exports.createPromiseModelActionCreators = createPromiseModelActionCreators;

var createExtraActionTypes = function createExtraActionTypes(commonConfig, extraActionCreators) {
  var extraSetName = 'extra/';
  return _objectSpread({}, createActionTypes(extraSetName, commonConfig, Object.keys(extraActionCreators.queryInfos)), {}, createActionTypes(extraSetName, commonConfig, Object.keys(extraActionCreators.actionInfos)));
};

exports.createExtraActionTypes = createExtraActionTypes;

var createExtraActionCreators = function createExtraActionCreators(commonConfigType, extraActionCreators) {
  var actionTypes = extraActionCreators.actionTypes;
  var queryInfos = extraActionCreators.queryInfos;
  var crudNames = Object.keys(queryInfos);
  var actionInfos = extraActionCreators.actionInfos;
  var actionNames = Object.keys(actionInfos);
  return _objectSpread({}, crudNames.reduce(function (actionCreators, crudType) {
    return _objectSpread({}, actionCreators, _defineProperty({}, crudType, wrapQueryActionCreator('', actionTypes, crudType, queryInfos[crudType])));
  }, {}), {}, actionNames.reduce(function (actionCreators, actionName) {
    return _objectSpread({}, actionCreators, _defineProperty({}, actionName, wrapActionCreator('', actionTypes, actionName, actionInfos[actionName])));
  }, {}));
};

exports.createExtraActionCreators = createExtraActionCreators;

var createExtraPromiseModelActionCreators = function createExtraPromiseModelActionCreators(dispatch, commonConfigType, extraActionCreators) {
  var actionTypes = extraActionCreators.actionTypes;
  var queryInfos = extraActionCreators.queryInfos;
  var crudNames = Object.keys(queryInfos);
  var actionInfos = extraActionCreators.actionInfos;
  var actionNames = Object.keys(actionInfos);
  return _objectSpread({}, crudNames.reduce(function (actionCreators, crudType) {
    return _objectSpread({}, actionCreators, _defineProperty({}, crudType, wrapQueryActionCreator('', actionTypes, crudType, queryInfos[crudType], getRawFuncWrapperForQueryAction(), getFinalFuncWrapper(dispatch))));
  }, {}), {}, actionNames.reduce(function (actionCreators, actionName) {
    return _objectSpread({}, actionCreators, _defineProperty({}, actionName, wrapActionCreator('', actionTypes, actionName, actionInfos[actionName], getRawFuncWrapperForAction(), getFinalFuncWrapper(dispatch))));
  }, {}));
};

exports.createExtraPromiseModelActionCreators = createExtraPromiseModelActionCreators;