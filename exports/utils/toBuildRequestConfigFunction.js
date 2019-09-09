"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var reduceMiddlewares = function reduceMiddlewares(buildRequestConfigMiddlewares) {
  var requestConfigFinal;

  var makeNextFunction = function makeNextFunction(context, next, index) {
    if (index >= buildRequestConfigMiddlewares.length) {
      return function (requestConfigArg) {
        if (requestConfigArg !== undefined) {
          requestConfigFinal = requestConfigArg;
        }

        return next(requestConfigFinal || null);
      };
    }

    return function (requestConfigArg) {
      if (requestConfigArg !== undefined) {
        requestConfigFinal = requestConfigArg;
      }

      return buildRequestConfigMiddlewares[index](_objectSpread({}, context, {
        requestConfig: requestConfigFinal
      }), makeNextFunction(context, next, index + 1));
    };
  };

  return function (context, next) {
    return makeNextFunction(context, next, 0)();
  };
};

var _default = function _default(buildRequestConfig) {
  if (Array.isArray(buildRequestConfig)) {
    return reduceMiddlewares(buildRequestConfig);
  }

  return buildRequestConfig;
};

exports["default"] = _default;