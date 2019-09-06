"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emptyFeature = exports["default"] = exports.EmptyFeatureForModel = void 0;

var _utils = require("../utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var EmptyFeatureForModel = function EmptyFeatureForModel(nothing) {
  _classCallCheck(this, EmptyFeatureForModel);

  _defineProperty(this, "Types", void 0);

  _defineProperty(this, "resourceMerger", function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utils.createEmptyResourceState)();
    var action = arguments.length > 1 ? arguments[1] : undefined;
    return state;
  });

  _defineProperty(this, "getQueryInfos", function () {
    return {};
  });

  _defineProperty(this, "getActionInfos", function () {
    return {};
  });
};

exports.EmptyFeatureForModel = EmptyFeatureForModel;

var EmptyFeature = function EmptyFeature(nothing) {
  _classCallCheck(this, EmptyFeature);

  _defineProperty(this, "Types", void 0);

  _defineProperty(this, "resourceMerger", function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utils.createEmptyResourceState)();
    var action = arguments.length > 1 ? arguments[1] : undefined;
    return state;
  });

  _defineProperty(this, "getFeatureForModel", function () {
    return new EmptyFeatureForModel();
  });

  _defineProperty(this, "getQueryInfos", function () {
    return {};
  });

  _defineProperty(this, "getActionInfos", function () {
    return {};
  });

  _defineProperty(this, "getBuildRequestConfigMiddleware", function () {
    return function (_ref, next) {
      var action = _ref.action,
          runnerType = _ref.runnerType,
          commonConfig = _ref.commonConfig,
          models = _ref.models,
          modelRootState = _ref.modelRootState;
      return next();
    };
  });
};

exports["default"] = EmptyFeature;
var emptyFeature = new EmptyFeature();
exports.emptyFeature = emptyFeature;