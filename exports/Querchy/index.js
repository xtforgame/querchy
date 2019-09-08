"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  namespaces: true,
  createQuerchyMiddleware: true
};
Object.defineProperty(exports, "namespaces", {
  enumerable: true,
  get: function get() {
    return _namespaces["default"];
  }
});
Object.defineProperty(exports, "createQuerchyMiddleware", {
  enumerable: true,
  get: function get() {
    return _createQuerchyMiddleware["default"];
  }
});
exports["default"] = void 0;

var _pureEpic = require("pure-epic");

var _operators = require("rxjs/operators");

var _commonFunctions = require("../common/common-functions");

var _interfaces = require("../core/interfaces");

var _actionCreatorHelpers = require("./actionCreatorHelpers");

var _toBuildRequestConfigFunction = _interopRequireDefault(require("../utils/toBuildRequestConfigFunction"));

var _namespaces = _interopRequireWildcard(require("./namespaces"));

Object.keys(_namespaces).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _namespaces[key];
    }
  });
});

var _createQuerchyMiddleware = _interopRequireDefault(require("./createQuerchyMiddleware"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Querchy = function () {
  function Querchy(querchyDefinition, deps) {
    var _this = this;

    _classCallCheck(this, Querchy);

    _defineProperty(this, "querchyDefinition", void 0);

    _defineProperty(this, "deps", void 0);

    _defineProperty(this, "actionCreatorSets", void 0);

    _defineProperty(this, "promiseActionCreatorSets", void 0);

    _defineProperty(this, "getStore", function () {
      return _namespaces["default"][_this.querchyDefinition.namespace].store;
    });

    _defineProperty(this, "dispatch", function (action) {
      var store = _this.getStore();

      if (!store) {
        throw new Error("store not found for namespace: ".concat(_this.querchyDefinition.namespace, ", did you forget to attach 'createQuerchyMiddleware' to redux ?"));
      }

      return _this.getStore().dispatch(action);
    });

    this.actionCreatorSets = {};
    this.promiseActionCreatorSets = {};
    this.querchyDefinition = querchyDefinition;
    this.normalizeQuerchyDefinition();
    this.deps = _objectSpread({}, deps, {
      querchyDef: this.querchyDefinition
    });
  }

  _createClass(Querchy, [{
    key: "normalizeQuerchyDefinition",
    value: function normalizeQuerchyDefinition() {
      var _this2 = this;

      this.querchyDefinition.namespace = this.querchyDefinition.namespace || _namespaces.defaultNamespaceName;
      var _this$querchyDefiniti = this.querchyDefinition,
          queryBuilders = _this$querchyDefiniti.queryBuilders,
          commonConfig = _this$querchyDefiniti.commonConfig,
          models = _this$querchyDefiniti.models;

      if (!commonConfig.getActionTypeName) {
        commonConfig.getActionTypeName = function (actionTypePrefix, queryName) {
          return "".concat(actionTypePrefix).concat((0, _commonFunctions.toUnderscore)(queryName).toUpperCase());
        };
      }

      commonConfig.queryRunners = commonConfig.queryRunners || {};
      Object.keys(queryBuilders).forEach(function (key) {
        var queryBuilder = queryBuilders[key];

        if (queryBuilder) {
          queryBuilder.buildRequestConfig = (0, _toBuildRequestConfigFunction["default"])(queryBuilder.buildRequestConfig);
        }
      });
      Object.keys(queryBuilders).forEach(function (key) {
        var queryBuilder = queryBuilders[key];
        var _ref = queryBuilder,
            queryRunner = _ref.queryRunner;
        var runner = queryRunner;

        if (typeof queryRunner === 'string') {
          runner = commonConfig.queryRunners[queryRunner];

          if (!runner) {
            throw new Error("no runner found: ".concat(queryRunner));
          }
        } else if (!queryRunner) {
          runner = commonConfig.defaultQueryRunner;
        }

        if (!runner) {
          throw new Error("no runner found: ".concat(key));
        }

        queryBuilder.queryRunner = runner;
      });
      Object.keys(models).forEach(function (key) {
        if (models[key].feature) {
          var featureForModel = models[key].feature.getFeatureForModel(models[key]);
          models[key].queryInfos = _objectSpread({}, models[key].queryInfos, {}, featureForModel.getQueryInfos());
          models[key].actionInfos = _objectSpread({}, models[key].actionInfos, {}, featureForModel.getActionInfos());
        }

        models[key].crudNames = [];
        Object.keys(models[key].queryInfos).forEach(function (key2) {
          if (!models[key].crudNames.includes(key2)) {
            models[key].crudNames.push(key2);
          }
        });
        models[key].actionNames = [];
        Object.keys(models[key].actionInfos).forEach(function (key2) {
          if (!models[key].actionNames.includes(key2)) {
            models[key].actionNames.push(key2);
          }
        });
        models[key].buildUrl = models[key].buildUrl || commonConfig.defaultBuildUrl.bind(commonConfig);
        models[key].actionTypes = (0, _actionCreatorHelpers.createModelActionTypes)(key, commonConfig, models[key]);
        models[key].actions = (0, _actionCreatorHelpers.createModelActionCreators)(commonConfig, key, models[key]);
        _this2.actionCreatorSets[key] = models[key].actions;
        var promiseActions = (0, _actionCreatorHelpers.createPromiseModelActionCreators)(_this2.dispatch, commonConfig, key, models[key]);
        _this2.promiseActionCreatorSets[key] = promiseActions;
        var model = models[key];

        if (model.queryBuilderName) {
          if (!queryBuilders[model.queryBuilderName]) {
            throw new Error("no queryBuilder found: ".concat(model.queryBuilderName));
          }
        } else {
          model.queryBuilderName = 'defaultBuilder';
        }
      });
      this.querchyDefinition.extraActionCreators = this.querchyDefinition.extraActionCreators || _defineProperty({}, _interfaces.INIT_FUNC, function () {});
      var extraActionCreators = this.querchyDefinition.extraActionCreators;

      extraActionCreators[_interfaces.INIT_FUNC](models, this);

      var _commonConfig$actionT = commonConfig.actionTypePrefix,
          actionTypePrefix = _commonConfig$actionT === void 0 ? '' : _commonConfig$actionT;
      extraActionCreators.actionTypes = (0, _actionCreatorHelpers.createExtraActionTypes)(commonConfig, extraActionCreators);
      extraActionCreators.actions = (0, _actionCreatorHelpers.createExtraActionCreators)(commonConfig, extraActionCreators);
      this.actionCreatorSets.extra = Object.keys(extraActionCreators.actions).reduce(function (extra, key) {
        if (typeof key === 'string') {
          var type = commonConfig.getActionTypeName(actionTypePrefix, "extra/".concat(key));
          return _objectSpread({}, extra, _defineProperty({}, key, extraActionCreators.actions[key]));
        }

        return extra;
      }, {});
      var promiseActions = (0, _actionCreatorHelpers.createExtraPromiseModelActionCreators)(this.dispatch, commonConfig, extraActionCreators);
      this.promiseActionCreatorSets.extra = Object.keys(promiseActions).reduce(function (extra, key) {
        if (typeof key === 'string') {
          var type = commonConfig.getActionTypeName(actionTypePrefix, "extra/".concat(key));
          return _objectSpread({}, extra, _defineProperty({}, key, promiseActions[key]));
        }

        return extra;
      }, {});
      Object.values(extraActionCreators.queryInfos).forEach(function (actionInfo) {
        if (actionInfo.queryBuilderName) {
          if (!queryBuilders[actionInfo.queryBuilderName]) {
            throw new Error("no queryBuilder found: ".concat(actionInfo.queryBuilderName));
          }
        } else {
          actionInfo.queryBuilderName = 'defaultBuilder';
        }
      });
    }
  }, {
    key: "getHandleQueryEpicFromQueryBuilderByActionType",
    value: function getHandleQueryEpicFromQueryBuilderByActionType(actionType, queryBuilder) {
      var _this3 = this;

      var runner = queryBuilder.queryRunner;
      return function (action$, state$) {
        for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }

        return action$.ofType(actionType).pipe((0, _operators.mergeMap)(function (action) {
          var modelRootState = _this3.deps.querchyDef.baseSelector(state$.value);

          return runner.handleQuery(action, queryBuilder, _this3.deps, {
            action$: action$,
            state$: state$,
            args: args,
            modelRootState: modelRootState
          });
        }));
      };
    }
  }, {
    key: "getEpicForModels",
    value: function getEpicForModels() {
      var _this4 = this;

      var _this$querchyDefiniti2 = this.querchyDefinition,
          queryBuilders = _this$querchyDefiniti2.queryBuilders,
          models = _this$querchyDefiniti2.models;
      return _pureEpic.combineEpics.apply(void 0, _toConsumableArray(Object.values(models).map(function (model) {
        var queryBuilder = queryBuilders[model.queryBuilderName];
        var queryInfos = model.queryInfos;
        return _pureEpic.combineEpics.apply(void 0, _toConsumableArray(Object.keys(queryInfos).map(function (key) {
          return _this4.getHandleQueryEpicFromQueryBuilderByActionType(queryInfos[key].actionType, queryBuilder);
        })));
      })));
    }
  }, {
    key: "getEpicForExtraActions",
    value: function getEpicForExtraActions() {
      var _this5 = this;

      var queryBuilders = this.querchyDefinition.queryBuilders;
      var extraActionCreators = this.querchyDefinition.extraActionCreators;
      return _pureEpic.combineEpics.apply(void 0, _toConsumableArray(Object.values(extraActionCreators.queryInfos).map(function (actionInfo) {
        var queryBuilder = queryBuilders[actionInfo.queryBuilderName];
        return _this5.getHandleQueryEpicFromQueryBuilderByActionType(actionInfo.actionType, queryBuilder);
      })));
    }
  }, {
    key: "getRootEpic",
    value: function getRootEpic() {
      return (0, _pureEpic.combineEpics)(this.getEpicForModels(), this.getEpicForExtraActions());
    }
  }]);

  return Querchy;
}();

exports["default"] = Querchy;