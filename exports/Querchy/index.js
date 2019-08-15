"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _pureEpic = require("pure-epic");

var _operators = require("rxjs/operators");

var _commonFunctions = require("../common/common-functions");

var _interfaces = require("../core/interfaces");

var _actionCreatorHelpers = require("./actionCreatorHelpers");

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
    _classCallCheck(this, Querchy);

    _defineProperty(this, "querchyDefinition", void 0);

    _defineProperty(this, "deps", void 0);

    _defineProperty(this, "actionCreatorSets", void 0);

    this.actionCreatorSets = {};
    this.querchyDefinition = querchyDefinition;
    this.normalizeQuerchyDefinition();
    this.deps = _objectSpread({}, deps, {
      querchyDef: this.querchyDefinition
    });
  }

  _createClass(Querchy, [{
    key: "normalizeQuerchyDefinition",
    value: function normalizeQuerchyDefinition() {
      var _this = this;

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
        models[key].actionTypes = (0, _actionCreatorHelpers.createModelActionTypes)(key, commonConfig, models[key]);
        models[key].actions = (0, _actionCreatorHelpers.createModelActionCreators)(commonConfig, key, models[key]);
        _this.actionCreatorSets[key] = models[key].actions;

        models[key].buildUrl = models[key].buildUrl || function (action) {
          if (action.crudType === 'create') {
            return models[key].url;
          }

          return "".concat(models[key].url, "/").concat(action.id);
        };

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
      var runner = queryBuilder.queryRunner;
      return function (action$, store$, dependencies) {
        for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
          args[_key - 3] = arguments[_key];
        }

        return action$.ofType(actionType).pipe((0, _operators.mergeMap)(function (action) {
          return runner.handleQuery(action, queryBuilder, {
            action$: action$,
            store$: store$,
            dependencies: dependencies,
            args: args
          });
        }));
      };
    }
  }, {
    key: "getEpicForModels",
    value: function getEpicForModels() {
      var _this2 = this;

      var _this$querchyDefiniti2 = this.querchyDefinition,
          queryBuilders = _this$querchyDefiniti2.queryBuilders,
          models = _this$querchyDefiniti2.models;
      return _pureEpic.combineEpics.apply(void 0, _toConsumableArray(Object.values(models).map(function (model) {
        var queryBuilder = queryBuilders[model.queryBuilderName];
        return _pureEpic.combineEpics.apply(void 0, _toConsumableArray(Object.values(model.actionTypes).map(function (actionType) {
          return _this2.getHandleQueryEpicFromQueryBuilderByActionType(actionType, queryBuilder);
        })));
      })));
    }
  }, {
    key: "getEpicForExtraActions",
    value: function getEpicForExtraActions() {
      var _this3 = this;

      var queryBuilders = this.querchyDefinition.queryBuilders;
      var extraActionCreators = this.querchyDefinition.extraActionCreators;
      return _pureEpic.combineEpics.apply(void 0, _toConsumableArray(Object.values(extraActionCreators.queryInfos).map(function (actionInfo) {
        var queryBuilder = queryBuilders[actionInfo.queryBuilderName];
        return _this3.getHandleQueryEpicFromQueryBuilderByActionType(actionInfo.actionType, queryBuilder);
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