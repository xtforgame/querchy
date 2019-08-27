"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var UpdateCacheT1 = function UpdateCacheT1() {
  _classCallCheck(this, UpdateCacheT1);

  _defineProperty(this, "Types", void 0);

  _defineProperty(this, "getQueryInfos", function () {
    return {};
  });

  _defineProperty(this, "getActionInfos", function () {
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
  });

  _defineProperty(this, "getBuildRequestConfigMiddleware", function () {
    return function (_, next) {
      return next();
    };
  });
};

exports["default"] = UpdateCacheT1;