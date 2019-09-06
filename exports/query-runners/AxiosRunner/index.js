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

  _defineProperty(this, "handleQuery", function (action, queryBuilder, dependencies, _ref) {
    var state$ = _ref.state$,
        action$ = _ref.action$,
        modelRootState = _ref.modelRootState;
    var _ref2 = dependencies,
        _ref2$querchyDef = _ref2.querchyDef,
        commonConfig = _ref2$querchyDef.commonConfig,
        models = _ref2$querchyDef.models;

    if (!queryBuilder) {
      throw new Error("QueryBuilder not found: ".concat(action.type));
    }

    var _action$actionCreator = action.actionCreator.creatorRefs,
        respond = _action$actionCreator.respond,
        respondError = _action$actionCreator.respondError,
        cancel = _action$actionCreator.cancel;
    var overwriteOptions = {};

    var getOptions = function getOptions() {
      return _objectSpread({}, overwriteOptions, {
        transferables: _objectSpread({
          requestTimestamp: action.transferables && action.transferables.requestTimestamp,
          requestAction: action
        }, overwriteOptions.transferables)
      });
    };

    var createSuccessAction = function createSuccessAction(response, responseType) {
      return respond(response, responseType, getOptions());
    };

    var createErrorAction = function createErrorAction(error) {
      return respondError(error, getOptions());
    };

    var createCancelAction = function createCancelAction(reason) {
      return cancel(reason, getOptions());
    };

    var requestConfig;

    try {
      requestConfig = queryBuilder.buildRequestConfig({
        requestConfig: undefined,
        action: action,
        runnerType: _this.type,
        commonConfig: commonConfig,
        models: models,
        modelRootState: modelRootState
      }, function (requestConfigArg) {
        return requestConfigArg || null;
      });
    } catch (error) {
      return [createErrorAction(error)];
    }

    if (!requestConfig) {
      return [(0, _helperFunctions.toNull)()];
    }

    var fromCacheRequestConfig = requestConfig;

    if (fromCacheRequestConfig.fromCache) {
      if ('overwriteQueryId' in fromCacheRequestConfig) {
        overwriteOptions.queryId = fromCacheRequestConfig.overwriteQueryId;
      }

      return [createSuccessAction(fromCacheRequestConfig.responseFromCache, 'from-cache')];
    }

    var normalRequestConfig = requestConfig;
    var overwriteConfigs = normalRequestConfig.overwriteConfigs,
        method = normalRequestConfig.method,
        url = normalRequestConfig.url,
        headers = normalRequestConfig.headers,
        query = normalRequestConfig.query,
        body = normalRequestConfig.body;

    if ('overwriteQueryId' in normalRequestConfig) {
      overwriteOptions.queryId = normalRequestConfig.overwriteQueryId;
    }

    normalRequestConfig.rawConfigs = _objectSpread({
      method: method,
      url: url,
      headers: _objectSpread({}, headers),
      data: body,
      params: query
    }, overwriteConfigs);

    var source = _axios["default"].CancelToken.source();

    var cancelActionType = action.actionCreator.creatorRefs.cancel.actionType;
    return _this.axiosObservable(normalRequestConfig.rawConfigs, {
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