"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.crudToRestMap = void 0;

var _utils = require("../../utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var crudToRestMap = {
  create: 'post',
  read: 'get',
  update: 'patch',
  "delete": 'delete'
};
exports.crudToRestMap = crudToRestMap;

var CrudT1 = function CrudT1() {
  var _this = this;

  _classCallCheck(this, CrudT1);

  _defineProperty(this, "Types", void 0);

  _defineProperty(this, "onError", void 0);

  _defineProperty(this, "getResourceId", function (resourceModel) {
    return function (state, action) {
      if (action.transferables && action.transferables.requestAction && action.transferables.requestAction.resourceId) {
        return action.transferables.requestAction.resourceId;
      }

      var featureDeps = resourceModel.featureDeps || {};

      if (featureDeps.getId) {
        return featureDeps.getId(action);
      }

      return null;
    };
  });

  _defineProperty(this, "resourceMerger", function (resourceModel) {
    var getResourceId = _this.getResourceId(resourceModel);

    return function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utils.createEmptyResourceState)();
      var action = arguments.length > 1 ? arguments[1] : undefined;
      var resourceId = getResourceId(state, action);

      if (!resourceId) {
        _this.onError(new Error('failed to parse resource id'), state, action);

        return state;
      }

      var queryMap = state.queryMap;
      var metadata = {
        lastRequest: _objectSpread({}, queryMap[resourceId] && queryMap[resourceId].metadata.lastRequest, {
          requestTimestamp: action.requestTimestamp,
          responseTimestamp: action.responseTimestamp
        }),
        lastUpdate: {
          updateType: 'crud',
          updateData: action.response.data,
          updateTimestamp: action.responseTimestamp
        }
      };

      if (action.queryId) {
        metadata.lastRequest.queryId = action.queryId;
      }

      if (action.response) {
        metadata.lastRequest.lastResponse = action.response;
      }

      var result = (0, _utils.mergeResourceState)(state, {
        resourceMap: {
          metadata: _defineProperty({}, resourceId, metadata),
          values: _defineProperty({}, resourceId, action.response.data)
        }
      });

      if (action.crudType === 'delete') {
        delete result.resourceMap.values[resourceId];
      }

      return result;
    };
  });

  _defineProperty(this, "getBuildRequestConfigMiddleware", function () {
    return function (_ref, next) {
      var action = _ref.action,
          runnerType = _ref.runnerType,
          commonConfig = _ref.commonConfig,
          models = _ref.models,
          modelRootState = _ref.modelRootState;
      var overwriteQueryId = action.queryId;

      if (!overwriteQueryId) {
        if (action.resourceId) {
          overwriteQueryId = "".concat(action.crudType, "?resourceId=").concat(action.resourceId);
        } else {
          overwriteQueryId = action.crudType;
        }
      }

      if (!action.modelName || !crudToRestMap[action.crudType]) {
        return next();
      }

      return {
        overwriteQueryId: overwriteQueryId,
        method: crudToRestMap[action.crudType],
        url: models[action.modelName].buildUrl(models[action.modelName].url, action),
        headers: action.options && action.options.headers,
        query: action.options && action.options.queryPart,
        body: action.data
      };
    };
  });

  _defineProperty(this, "getQueryInfos", function (resourceModel) {
    return {
      create: {
        actionCreator: function actionCreator(data, options) {
          return {
            data: data,
            options: options
          };
        },
        resourceMerger: _this.resourceMerger(resourceModel)
      },
      read: {
        actionCreator: function actionCreator(resourceId, options) {
          return {
            resourceId: resourceId,
            options: options
          };
        },
        resourceMerger: _this.resourceMerger(resourceModel)
      },
      update: {
        actionCreator: function actionCreator(resourceId, data, options) {
          return {
            resourceId: resourceId,
            data: data,
            options: options
          };
        },
        resourceMerger: _this.resourceMerger(resourceModel)
      },
      "delete": {
        actionCreator: function actionCreator(resourceId, options) {
          return {
            resourceId: resourceId,
            options: options
          };
        },
        resourceMerger: _this.resourceMerger(resourceModel)
      }
    };
  });

  _defineProperty(this, "getActionInfos", function () {
    return {};
  });

  this.onError = function (error) {};
};

exports["default"] = CrudT1;