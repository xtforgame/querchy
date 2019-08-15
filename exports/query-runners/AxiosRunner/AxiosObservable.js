"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _helperFunctions = require("../../utils/helper-functions");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = function _default(axios) {
  return function (axiosRequestConfig) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$success = _ref.success,
        successAction = _ref$success === void 0 ? _helperFunctions.toNull : _ref$success,
        _ref$error = _ref.error,
        errorAction = _ref$error === void 0 ? _helperFunctions.toNull : _ref$error,
        _ref$cancel = _ref.cancel,
        cancelAction = _ref$cancel === void 0 ? _helperFunctions.toNull : _ref$cancel;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var cancelStream$ = options.cancelStream$,
        _options$axiosCancelT = options.axiosCancelTokenSource,
        axiosCancelTokenSource = _options$axiosCancelT === void 0 ? axios.CancelToken.source() : _options$axiosCancelT;
    var observable = (0, _rxjs.from)(axios.request(_objectSpread({}, axiosRequestConfig, {
      cancelToken: axiosCancelTokenSource.token
    }))).pipe((0, _operators.map)(function (response) {
      return successAction(response, 'from-request');
    }), (0, _operators.catchError)(function (error) {
      return (0, _rxjs.of)(errorAction(error));
    }));

    if (cancelStream$) {
      return (0, _rxjs.race)(observable, cancelStream$.pipe((0, _operators.map)(function (value) {
        axiosCancelTokenSource.cancel('Operation canceled by the user.');
        return cancelAction(value);
      }), (0, _operators.take)(1)));
    }

    return observable;
  };
};

exports["default"] = _default;