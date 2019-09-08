"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = require("../../utils");

var _shared = require("../shared");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var UpdateCacheForModelT1 = function UpdateCacheForModelT1() {
  _classCallCheck(this, UpdateCacheForModelT1);

  _defineProperty(this, "Types", void 0);

  _defineProperty(this, "getQueryInfos", function () {
    return {};
  });

  _defineProperty(this, "getActionInfos", function () {
    return {
      updateCache: {
        actionCreator: function actionCreator(resourceId, value, options) {
          return {
            resourceId: resourceId,
            value: value,
            options: options
          };
        },
        resourceMerger: (0, _shared.changeResourceMerger)('update-cache', function (state, action) {
          return {
            update: _defineProperty({}, action.resourceId, action.value)
          };
        })
      },
      updateSomeCache: {
        actionCreator: function actionCreator(update, options) {
          return {
            update: update,
            options: options
          };
        },
        resourceMerger: (0, _shared.changeResourceMerger)('update-cache', function (state, action) {
          return {
            update: action.update
          };
        })
      },
      clearCache: {
        actionCreator: function actionCreator(resourceId, value, options) {
          return {
            resourceId: resourceId,
            value: value,
            options: options
          };
        },
        resourceMerger: (0, _shared.changeResourceMerger)('update-cache', function (state, action) {
          return {
            "delete": [action.resourceId]
          };
        })
      },
      clearSomeCache: {
        actionCreator: function actionCreator(deleteIds, options) {
          return {
            "delete": deleteIds,
            options: options
          };
        },
        resourceMerger: (0, _shared.changeResourceMerger)('update-cache', function (state, action) {
          return {
            "delete": action["delete"]
          };
        })
      },
      clearAllCache: {
        actionCreator: function actionCreator(options) {
          return {
            options: options
          };
        },
        resourceMerger: function resourceMerger() {
          var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utils.createEmptyResourceState)();
          var action = arguments.length > 1 ? arguments[1] : undefined;
          return (0, _utils.createEmptyResourceState)();
        }
      },
      changeSomeCache: {
        actionCreator: function actionCreator(change, options) {
          return {
            change: change,
            options: options
          };
        },
        resourceMerger: (0, _shared.changeResourceMerger)('update-cache', function (state, action) {
          return action.change;
        })
      }
    };
  });
};

var UpdateCacheT1 = function UpdateCacheT1() {
  _classCallCheck(this, UpdateCacheT1);

  _defineProperty(this, "Types", void 0);

  _defineProperty(this, "getFeatureForModel", function () {
    return new UpdateCacheForModelT1();
  });

  _defineProperty(this, "getBuildRequestConfigMiddleware", function () {
    return function (_, next) {
      return next();
    };
  });
};

exports["default"] = UpdateCacheT1;