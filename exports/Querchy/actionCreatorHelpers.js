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
    respondError: "".concat(actionType, "_ERROR"),
    cancel: "".concat(actionType, "_CANCEL")
  };
  var startFunc = Object.assign(function () {
    var requestTimestamp = new Date().getTime();

    var requestAction = _objectSpread({}, start.apply(void 0, arguments), {
      type: actionType,
      actionCreator: startFunc,
      modelName: modelName,
      actionTypes: actionTypes,
      crudType: crudType,
      crudSubType: 'start',
      requestTimestamp: requestTimestamp,
      transferables: {}
    });

    requestAction.transferables = {
      requestTimestamp: requestTimestamp,
      requestAction: requestAction
    };
    return requestAction;
  }, QueryActionCreatorProps, {
    actionType: actionType
  });
  QueryActionCreatorProps.creatorRefs.start = startFunc;
  QueryActionCreatorProps.creatorRefs.respond = Object.assign(function (response, responseType, options) {
    return {
      type: "".concat(actionType, "_RESPOND"),
      actionCreator: QueryActionCreatorProps.creatorRefs.respond,
      response: response,
      responseType: responseType,
      modelName: modelName,
      actionTypes: actionTypes,
      crudType: crudType,
      crudSubType: 'respond',
      responseTimestamp: new Date().getTime(),
      requestTimestamp: options && options.transferables && options.transferables.requestTimestamp,
      transferables: _objectSpread({}, options && options.transferables && options.transferables.requestAction.transferables, {}, options && options.transferables),
      options: options
    };
  }, QueryActionCreatorProps, {
    actionType: "".concat(actionType, "_RESPOND")
  });
  QueryActionCreatorProps.creatorRefs.respondError = Object.assign(function (error, options) {
    return {
      type: "".concat(actionType, "_ERROR"),
      actionCreator: QueryActionCreatorProps.creatorRefs.respondError,
      error: error,
      modelName: modelName,
      actionTypes: actionTypes,
      crudType: crudType,
      crudSubType: 'respondError',
      errorTimestamp: new Date().getTime(),
      requestTimestamp: options && options.transferables && options.transferables.requestTimestamp,
      transferables: _objectSpread({}, options && options.transferables && options.transferables.requestAction.transferables, {}, options && options.transferables),
      options: options
    };
  }, QueryActionCreatorProps, {
    actionType: "".concat(actionType, "_ERROR")
  });
  QueryActionCreatorProps.creatorRefs.cancel = Object.assign(function (reason, options) {
    return {
      type: "".concat(actionType, "_CANCEL"),
      actionCreator: QueryActionCreatorProps.creatorRefs.cancel,
      reason: reason,
      modelName: modelName,
      actionTypes: actionTypes,
      crudType: crudType,
      crudSubType: 'cancel',
      cancelTimestamp: new Date().getTime(),
      requestTimestamp: options && options.transferables && options.transferables.requestTimestamp,
      transferables: _objectSpread({}, options && options.transferables && options.transferables.requestAction.transferables, {}, options && options.transferables),
      options: options
    };
  }, QueryActionCreatorProps, {
    actionType: "".concat(actionType, "_CANCEL")
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