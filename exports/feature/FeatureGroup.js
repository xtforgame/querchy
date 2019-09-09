"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFeatureGroup = createFeatureGroup;
exports["default"] = exports.FeatureGroupForModel = void 0;

var _EmptyFeature = require("./EmptyFeature");

var _toBuildRequestConfigFunction = _interopRequireDefault(require("../utils/toBuildRequestConfigFunction"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var FeatureGroupForModel = function FeatureGroupForModel() {
  var _this = this;

  _classCallCheck(this, FeatureGroupForModel);

  _defineProperty(this, "featuresForModel", void 0);

  _defineProperty(this, "Types", void 0);

  _defineProperty(this, "getActionInfos", function () {
    return _this.featuresForModel.reduce(function (map, featureForModel) {
      return _objectSpread({}, map, {}, featureForModel.getActionInfos());
    }, {});
  });

  _defineProperty(this, "getQueryInfos", function () {
    return _this.featuresForModel.reduce(function (map, featureForModel) {
      return _objectSpread({}, map, {}, featureForModel.getQueryInfos());
    }, {});
  });

  for (var _len = arguments.length, featuresForModel = new Array(_len), _key = 0; _key < _len; _key++) {
    featuresForModel[_key] = arguments[_key];
  }

  this.featuresForModel = featuresForModel;
};

exports.FeatureGroupForModel = FeatureGroupForModel;

var FeatureGroup = function FeatureGroup() {
  var _this2 = this;

  _classCallCheck(this, FeatureGroup);

  _defineProperty(this, "features", void 0);

  _defineProperty(this, "Types", void 0);

  _defineProperty(this, "getFeatureForModel", function (resourceModel) {
    var featuresForModel = _this2.features.map(function (feature) {
      return feature.getFeatureForModel(resourceModel);
    });

    return _construct(FeatureGroupForModel, _toConsumableArray(featuresForModel));
  });

  _defineProperty(this, "getBuildRequestConfigMiddleware", function () {
    return (0, _toBuildRequestConfigFunction["default"])(_this2.features.map(function (feature) {
      return feature.getBuildRequestConfigMiddleware();
    }));
  });

  for (var _len2 = arguments.length, features = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    features[_key2] = arguments[_key2];
  }

  this.features = features;
};

exports["default"] = FeatureGroup;

function createFeatureGroup(feature1, feature2) {
  var feature3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _EmptyFeature.emptyFeature;
  var feature4 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _EmptyFeature.emptyFeature;
  var feature5 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _EmptyFeature.emptyFeature;
  var feature6 = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _EmptyFeature.emptyFeature;
  var feature7 = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _EmptyFeature.emptyFeature;
  var feature8 = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : _EmptyFeature.emptyFeature;
  return new FeatureGroup(feature1, feature2, feature3, feature4, feature5, feature6, feature7, feature8);
}