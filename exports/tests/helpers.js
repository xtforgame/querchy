"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBasicActionInfos = exports.getBasicQueryInfos = exports.resMergerForColl = exports.resMerger = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var resMerger = function resMerger() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    queryMap: {},
    resourceMap: {}
  };
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var resourceId = action.response && action.response.data && action.response.data.args && action.response.data.args.id || '1';
  var queryMap = state.queryMap;
  var metadata = {
    lastRequest: _objectSpread({}, queryMap[resourceId] && queryMap[resourceId].lastRequest, {
      requestTimestamp: action.requestTimestamp,
      responseTimestamp: action.responseTimestamp
    })
  };

  var result = _objectSpread({}, state, {
    resourceMap: _objectSpread({}, state.resourceMap, _defineProperty({}, resourceId, {
      metadata: metadata,
      value: action.response.data
    }))
  });

  if (action.crudType === 'delete') {
    delete result.resourceMap[resourceId];
  }

  return result;
};

exports.resMerger = resMerger;

var resMergerForColl = function resMergerForColl() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    queryMap: {},
    resourceMap: {}
  };
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var resourceId = action.response && action.response.data && action.response.data.args && action.response.data.args.id || '1';
  var queryMap = state.queryMap;
  var metadata = {
    lastRequest: _objectSpread({}, queryMap[resourceId] && queryMap[resourceId].lastRequest, {
      requestTimestamp: action.requestTimestamp,
      responseTimestamp: action.responseTimestamp
    })
  };

  var result = _objectSpread({}, state, {
    resourceMap: _objectSpread({}, state.resourceMap, {
      '1': {
        metadata: metadata,
        value: action.response.data
      },
      '2': {
        metadata: metadata,
        value: action.response.data
      }
    })
  });

  return result;
};

exports.resMergerForColl = resMergerForColl;

var getBasicQueryInfos = function getBasicQueryInfos() {
  return {
    create: {
      actionCreator: function actionCreator(data, options) {
        return {
          data: data,
          options: options
        };
      },
      resourceMerger: resMerger
    },
    read: {
      actionCreator: function actionCreator(resourceId, options) {
        return {
          resourceId: resourceId,
          options: options
        };
      },
      resourceMerger: resMerger
    },
    update: {
      actionCreator: function actionCreator(resourceId, data, options) {
        return {
          resourceId: resourceId,
          data: data,
          options: options
        };
      },
      resourceMerger: resMerger
    },
    "delete": {
      actionCreator: function actionCreator(resourceId, options) {
        return {
          resourceId: resourceId,
          options: options
        };
      },
      resourceMerger: resMerger
    }
  };
};

exports.getBasicQueryInfos = getBasicQueryInfos;

var getBasicActionInfos = function getBasicActionInfos() {
  return {
    updateCache: {
      actionCreator: function actionCreator(cacheChange, options) {
        return {
          cacheChange: cacheChange,
          options: options
        };
      }
    }
  };
};

exports.getBasicActionInfos = getBasicActionInfos;