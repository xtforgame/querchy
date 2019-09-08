"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.crudToRestMap = void 0;

var _shared = require("../shared");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var crudToRestMap = {
  getCollection: 'get'
};
exports.crudToRestMap = crudToRestMap;

var CollectionForModelT1 = function CollectionForModelT1(resourceModel) {
  var _this = this;

  _classCallCheck(this, CollectionForModelT1);

  _defineProperty(this, "resourceModel", void 0);

  _defineProperty(this, "parseResponse", void 0);

  _defineProperty(this, "onError", void 0);

  _defineProperty(this, "Types", void 0);

  _defineProperty(this, "getResourceChange", function (state, action) {
    var resourceChange = _this.parseResponse(state, action);

    if (resourceChange.update && resourceChange.update['']) {
      _this.onError(new Error('failed to parse response'), state, action);

      return null;
    }

    return resourceChange;
  });

  _defineProperty(this, "getQueryInfos", function () {
    return {
      getCollection: {
        actionCreator: function actionCreator(options) {
          return {
            options: options
          };
        },
        resourceMerger: (0, _shared.changeResourceMerger)('get-collection', _this.getResourceChange)
      },
      getByIds: {
        actionCreator: function actionCreator(ids, options) {
          return {
            ids: ids,
            options: options
          };
        },
        resourceMerger: (0, _shared.changeResourceMerger)('get-collection', _this.getResourceChange)
      }
    };
  });

  _defineProperty(this, "getActionInfos", function () {
    return {};
  });

  this.resourceModel = resourceModel;

  this.parseResponse = function (s, action) {
    var featureDeps = _this.resourceModel.featureDeps || {};

    if (featureDeps.parseResponse) {
      return featureDeps.parseResponse(s, action);
    }

    return {};
  };

  this.onError = function (error) {};
};

var CollectionT1 = function CollectionT1() {
  _classCallCheck(this, CollectionT1);

  _defineProperty(this, "Types", void 0);

  _defineProperty(this, "getFeatureForModel", function (resourceModel) {
    return new CollectionForModelT1(resourceModel);
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
        url: models[action.modelName].url,
        headers: action.options && action.options.headers,
        query: action.options && action.options.queryPart,
        body: action.data
      };
    };
  });
};

exports["default"] = CollectionT1;