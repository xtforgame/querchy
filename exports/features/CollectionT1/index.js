"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.NOT_IN_RESOURCE_MAP = exports.crudToRestMap = void 0;

var _reselect = require("reselect");

var _shared = require("../shared");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var crudToRestMap = {
  getCollection: 'get'
};
exports.crudToRestMap = crudToRestMap;
var NOT_IN_RESOURCE_MAP = Symbol('NOT_IN_RESOURCE_MAP');
exports.NOT_IN_RESOURCE_MAP = NOT_IN_RESOURCE_MAP;

var CollectionT1 = function CollectionT1() {
  var _this = this;

  _classCallCheck(this, CollectionT1);

  _defineProperty(this, "Types", void 0);

  _defineProperty(this, "onError", void 0);

  _defineProperty(this, "getResourceChange", function (resourceModel) {
    return function (state, action) {
      var parseResponse = function parseResponse(s, action) {
        var featureDeps = resourceModel.featureDeps || {};

        if (featureDeps.parseResponse) {
          return featureDeps.parseResponse(s, action);
        }

        return {};
      };

      var resourceChange = parseResponse(state, action);

      if (resourceChange.update && resourceChange.update['']) {
        _this.onError(new Error('failed to parse response'), state, action);

        return null;
      }

      return resourceChange;
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
      getCollection: {
        actionCreator: function actionCreator(options) {
          return {
            options: options
          };
        },
        resourceMerger: (0, _shared.changeResourceMerger)('get-collection', _this.getResourceChange(resourceModel))
      },
      getByIds: {
        actionCreator: function actionCreator(ids, options) {
          return {
            ids: ids,
            options: options
          };
        },
        resourceMerger: (0, _shared.changeResourceMerger)('get-collection', _this.getResourceChange(resourceModel))
      }
    };
  });

  _defineProperty(this, "getActionInfos", function () {
    return {};
  });

  _defineProperty(this, "getExtraSelectorInfos", function (resourceModel) {
    var getIdFromCollectionItem = function getIdFromCollectionItem(item) {
      return item && item.id;
    };

    var featureDeps = resourceModel.featureDeps || {};

    if (featureDeps.getIdFromCollectionItem) {
      getIdFromCollectionItem = featureDeps.getIdFromCollectionItem;
    }

    var getItemArrayFromCollection = function getItemArrayFromCollection(collection, resourceMap) {
      if (!Array.isArray(collection)) {
        return [];
      }

      return collection.map(function (item) {
        var id = getIdFromCollectionItem(item);

        if (id != null) {
          return resourceMap[item.id];
        }

        return NOT_IN_RESOURCE_MAP;
      });
    };

    if (featureDeps.getItemArrayFromCollection) {
      getItemArrayFromCollection = featureDeps.getItemArrayFromCollection;
    }

    return {
      selectCollenctionItems: {
        creatorCreator: function creatorCreator(baseSelector, builtinSelectorCreators) {
          return function () {
            return (0, _reselect.createSelector)(builtinSelectorCreators.selectQueryMapValues(), builtinSelectorCreators.selectResourceMapValues(), function (queryMap, resourceMap) {
              if (!queryMap || !queryMap.getCollection) {
                return [];
              }

              return getItemArrayFromCollection(queryMap.getCollection, resourceMap);
            });
          };
        }
      }
    };
  });

  this.onError = function (error) {};
};

exports["default"] = CollectionT1;