"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _helperFunctions = require("../utils/helper-functions");

var _default = function _default(sendRequest, requestConfig, _ref, options) {
  var _ref$success = _ref.success,
      successAction = _ref$success === void 0 ? _helperFunctions.toNull : _ref$success,
      _ref$error = _ref.error,
      errorAction = _ref$error === void 0 ? _helperFunctions.toNull : _ref$error,
      _ref$cancel = _ref.cancel,
      cancelAction = _ref$cancel === void 0 ? _helperFunctions.toNull : _ref$cancel;
  var cancelStream$ = options.cancelStream$,
      cancelTokenSource = options.cancelTokenSource;
  var observable = (0, _rxjs.from)(sendRequest(requestConfig, cancelTokenSource)).pipe((0, _operators.map)(function (response) {
    return successAction(response, 'normal');
  }), (0, _operators.catchError)(function (error) {
    return (0, _rxjs.of)(errorAction(error));
  }));

  if (cancelStream$) {
    return (0, _rxjs.race)(observable, cancelStream$.pipe((0, _operators.map)(function (value) {
      cancelTokenSource.cancel('Operation canceled by the user.');
      return cancelAction(value);
    }), (0, _operators.take)(1)));
  }

  return observable;
};

exports["default"] = _default;