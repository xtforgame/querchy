"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExtraActionCreators = exports.createExtraActionTypes = exports.createModelActionCreators = exports.createModelActionTypes = exports.wrapQueryActionCreator = exports.wrapActionCreator = exports.createActionTypes = void 0;

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

var wrapActionCreator = function wrapActionCreator(modelName, actionTypes, actionName, actionInfo) {
  var start = actionInfo.actionCreator;
  var actionType = actionTypes[actionName];
  actionInfo.name = actionName;
  actionInfo.actionType = actionType;
  var startFunc = Object.assign(function () {
    var requestTimestamp = new Date().getTime();

    var requestAction = _objectSpread({}, start.apply(void 0, arguments), {
      type: actionType,
      actionCreator: startFunc,
      modelName: modelName,
      actionTypes: actionTypes,
      actionName: actionName,
      transferables: {}
    });

    requestAction.transferables = {
      requestTimestamp: requestTimestamp,
      requestAction: requestAction
    };
    return requestAction;
  }, {
    actionType: actionType
  });
  return startFunc;
};

exports.wrapActionCreator = wrapActionCreator;

var wrapQueryActionCreator = function wrapQueryActionCreator(modelName, actionTypes, crudType, actionInfo) {
  var QueryActionCreatorProps = {
    creatorRefs: {}
  };
  var start = actionInfo.actionCreator;
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
  var startFunc = Object.assign(function () {
    var requestTimestamp = new Date().getTime();
    var result = start.apply(void 0, arguments);

    var requestAction = _objectSpread({}, result, {
      type: actionType,
      actionCreator: startFunc,
      modelName: modelName,
      actionTypes: actionTypes,
      crudType: crudType,
      crudSubType: 'start',
      requestTimestamp: requestTimestamp,
      transferables: {},
      options: result.options
    });

    requestAction.transferables = _objectSpread({}, result.transferables, {
      requestTimestamp: requestTimestamp,
      requestAction: requestAction
    });
    var queryId = result.options && result.options.queryId;

    if (queryId) {
      requestAction.queryId = queryId;
      requestAction.transferables.queryId = queryId;
    }

    return requestAction;
  }, QueryActionCreatorProps, {
    actionType: actionType
  });

  var getQueryBuiltinProps = function getQueryBuiltinProps(crudSubType, options) {
    var transferables = options && options.transferables || {};
    transferables = _objectSpread({}, transferables.requestAction && transferables.requestAction.transferables, {}, transferables);

    if (options.queryId) {
      transferables.queryId = options.queryId;
    }

    var result = {
      type: querySubActionTypes[crudSubType],
      actionCreator: QueryActionCreatorProps.creatorRefs[crudSubType],
      modelName: modelName,
      actionTypes: actionTypes,
      crudType: crudType,
      crudSubType: crudSubType,
      requestTimestamp: transferables.requestTimestamp,
      transferables: transferables,
      options: options
    };

    if (transferables.queryId) {
      result.queryId = transferables.queryId;
    }

    return result;
  };

  QueryActionCreatorProps.creatorRefs.start = startFunc;
  QueryActionCreatorProps.creatorRefs.respond = Object.assign(function (response, responseType, options) {
    return _objectSpread({
      response: response,
      responseType: responseType,
      responseTimestamp: new Date().getTime()
    }, getQueryBuiltinProps('respond', options));
  }, QueryActionCreatorProps, {
    actionType: querySubActionTypes.respond
  });
  QueryActionCreatorProps.creatorRefs.respondError = Object.assign(function (error, options) {
    return _objectSpread({
      error: error,
      errorTimestamp: new Date().getTime()
    }, getQueryBuiltinProps('respondError', options));
  }, QueryActionCreatorProps, {
    actionType: querySubActionTypes.respondError
  });
  QueryActionCreatorProps.creatorRefs.cancel = Object.assign(function (reason, options) {
    return _objectSpread({
      reason: reason,
      cancelTimestamp: new Date().getTime()
    }, getQueryBuiltinProps('cancel', options));
  }, QueryActionCreatorProps, {
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