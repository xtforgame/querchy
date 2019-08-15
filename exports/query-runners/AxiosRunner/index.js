"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _operators = require("rxjs/operators");

var _helperFunctions = require("../../utils/helper-functions");

var _AxiosObservable = _interopRequireDefault(require("./AxiosObservable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var AxiosRunner = function AxiosRunner(a) {
  var _this = this;

  _classCallCheck(this, AxiosRunner);

  _defineProperty(this, "type", void 0);

  _defineProperty(this, "axiosObservable", void 0);

  _defineProperty(this, "handleQuery", function (action, queryBuilder, _ref) {
    var store$ = _ref.store$,
        action$ = _ref.action$,
        dependencies = _ref.dependencies;
    var _ref2 = dependencies,
        _ref2$querchyDef = _ref2.querchyDef,
        commonConfig = _ref2$querchyDef.commonConfig,
        models = _ref2$querchyDef.models;

    if (!queryBuilder) {
      throw new Error("QueryBuilder not found: ".concat(action.type));
    }

    var createSuccessAction = action.actionCreator.creatorRefs.respond;
    var createErrorAction = action.actionCreator.creatorRefs.respondError;
    var createCancelAction = action.actionCreator.creatorRefs.cancel;
    var requestConfig;

    try {
      requestConfig = queryBuilder.buildRequestConfig(action, {
        runnerType: _this.type,
        commonConfig: commonConfig,
        models: models
      });
    } catch (error) {
      return [createErrorAction(error)];
    }

    if (!requestConfig) {
      return [(0, _helperFunctions.toNull)()];
    }

    var _requestConfig = requestConfig,
        overwriteConfigs = _requestConfig.overwriteConfigs,
        method = _requestConfig.method,
        url = _requestConfig.url,
        headers = _requestConfig.headers,
        query = _requestConfig.query,
        body = _requestConfig.body;
    requestConfig.rawConfigs = _objectSpread({
      method: method,
      url: url,
      headers: _objectSpread({}, headers),
      data: body,
      params: query
    }, overwriteConfigs);

    var source = _axios["default"].CancelToken.source();

    var cancelActionType = action.actionCreator.creatorRefs.cancel.actionType;
    return _this.axiosObservable(requestConfig.rawConfigs, {
      success: createSuccessAction,
      error: createErrorAction,
      cancel: createCancelAction
    }, {
      axiosCancelTokenSource: source,
      cancelStream$: action$.pipe((0, _operators.filter)(function (cancelAction) {
        if (cancelAction.type !== cancelActionType) {
          return false;
        }

        return true;
      }))
    });
  });

  this.type = 'axios';
  this.axiosObservable = (0, _AxiosObservable["default"])(a || _axios["default"]);
};

exports["default"] = AxiosRunner;