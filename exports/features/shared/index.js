"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changeResourceMerger = exports.crudToRestMap = void 0;

var _utils = require("../../utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var crudToRestMap = {
  getCollection: 'get'
};
exports.crudToRestMap = crudToRestMap;

var changeResourceMerger = function changeResourceMerger(updateType, getResourceChange) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utils.createEmptyResourceState)();
    var action = arguments.length > 1 ? arguments[1] : undefined;
    var resourceChange = getResourceChange(state, action);

    if (!resourceChange) {
      return state;
    }

    var queryMap = state.queryMap,
        resourceMap = state.resourceMap;
    var extraQueryMap = {
      metadata: {},
      values: {}
    };
    var queryId = action.queryId;

    if (queryId) {
      extraQueryMap.metadata[queryId] = _objectSpread({}, queryMap[queryId] && queryMap[queryId].metadata.lastRequest, {
        queryId: queryId,
        requestTimestamp: action.requestTimestamp,
        responseTimestamp: action.responseTimestamp
      });
      extraQueryMap.values[queryId] = action.response.data;
    }

    var extraResourceMap = {
      metadata: {},
      values: {}
    };

    if (queryId) {
      var update = resourceChange.update || {};
      Object.keys(update).forEach(function (key) {
        extraResourceMap.metadata[key] = _objectSpread({}, resourceMap[queryId] && resourceMap[queryId].metadata.lastRequest, {
          lastUpdate: {
            updateType: updateType,
            updateData: update[key],
            updateTimestamp: action.responseTimestamp
          }
        });
        extraResourceMap.values[key] = update[key];
      });
      var deleteIds = resourceChange["delete"] || [];
      deleteIds.forEach(function (deleteId) {
        extraResourceMap.metadata[deleteId] = _objectSpread({}, resourceMap[queryId] && resourceMap[queryId].metadata.lastRequest, {
          lastUpdate: {
            updateType: updateType,
            updateData: update[deleteId],
            updateTimestamp: action.responseTimestamp
          }
        });
        delete extraResourceMap.values[deleteId];
      });
    }

    var result = (0, _utils.mergeResourceState)(state, {
      queryMap: extraQueryMap,
      resourceMap: extraResourceMap
    });
    return result;
  };
};

exports.changeResourceMerger = changeResourceMerger;