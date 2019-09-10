"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFeatureGroup = createFeatureGroup;
exports["default"] = void 0;

var _EmptyFeature = require("./EmptyFeature");

var _toBuildRequestConfigFunction = _interopRequireDefault(require("../utils/toBuildRequestConfigFunction"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var FeatureGroup = function FeatureGroup() {
  var _this = this;

  _classCallCheck(this, FeatureGroup);

  _defineProperty(this, "features", void 0);

  _defineProperty(this, "Types", void 0);

  _defineProperty(this, "getActionInfos", function (resourceModel) {
    return _this.features.reduce(function (map, feature) {
      return _objectSpread({}, map, {}, feature.getActionInfos(resourceModel));
    }, {});
  });

  _defineProperty(this, "getQueryInfos", function (resourceModel) {
    return _this.features.reduce(function (map, feature) {
      return _objectSpread({}, map, {}, feature.getQueryInfos(resourceModel));
    }, {});
  });

  _defineProperty(this, "getExtraSelectorInfos", function (resourceModel) {
    return _this.features.reduce(function (m, feature) {
      if (feature.getExtraSelectorInfos) {
        var featureEx = feature;
        return _objectSpread({}, m, {}, featureEx.getExtraSelectorInfos(resourceModel));
      }

      return m;
    }, {});
  });

  _defineProperty(this, "getBuildRequestConfigMiddleware", function () {
    return (0, _toBuildRequestConfigFunction["default"])(_this.features.map(function (feature) {
      return feature.getBuildRequestConfigMiddleware();
    }));
  });

  for (var _len = arguments.length, features = new Array(_len), _key = 0; _key < _len; _key++) {
    features[_key] = arguments[_key];
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