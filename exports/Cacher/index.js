"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _pureEpic = require("pure-epic");

var _operators = require("rxjs/operators");

var _combineReducers = _interopRequireDefault(require("../redux/combineReducers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Updater = function () {
  function Updater(querchy) {
    _classCallCheck(this, Updater);

    _defineProperty(this, "querchy", void 0);

    _defineProperty(this, "reducerSet", void 0);

    _defineProperty(this, "allResourceReducers", void 0);

    _defineProperty(this, "extraGlobalReducer", void 0);

    _defineProperty(this, "rootReducer", void 0);

    _defineProperty(this, "createResourceMergerForResponse", function (actionType, merger) {
      return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
          queryMap: {},
          resourceMap: {}
        };
        var action = arguments.length > 1 ? arguments[1] : undefined;

        if (action.type === actionType) {
          return merger(state, action);
        }

        return state;
      };
    });

    _defineProperty(this, "createGlobalMergerForResponse", function (actionType, merger) {
      return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var action = arguments.length > 1 ? arguments[1] : undefined;

        if (action.type === actionType) {
          return merger(state, action);
        }

        return state;
      };
    });

    this.querchy = querchy;
    this.reducerSet = {};
    this.allResourceReducers = {};

    this.rootReducer = function () {};

    this.init();
  }

  _createClass(Updater, [{
    key: "init",
    value: function init() {
      var _this = this;

      var models = this.querchy.querchyDefinition.models;
      var extraActionCreators = this.querchy.querchyDefinition.extraActionCreators;
      Object.keys(models).forEach(function (key) {
        var reducers = {};
        var reducerArray = [];
        var model = models[key];
        var actions = model.actions;
        var queryInfos = model.queryInfos || {};
        Object.keys(queryInfos).forEach(function (actionKey) {
          if (queryInfos[actionKey] && queryInfos[actionKey].resourceMerger) {
            var actionType = actions[actionKey].creatorRefs.respond.actionType;

            var reducer = _this.createResourceMergerForResponse(actionType, queryInfos[actionKey].resourceMerger);

            reducers[actionKey] = reducer;
            reducerArray.push(reducer);
          }
        });
        _this.reducerSet[key] = reducers;

        _this.allResourceReducers[key] = function () {
          var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
            queryMap: {},
            resourceMap: {}
          };
          var action = arguments.length > 1 ? arguments[1] : undefined;
          return reducerArray.reduce(function (s, r) {
            return r(s, action);
          }, state);
        };
      });
      {
        var reducers = {};
        var reducerArray = [];
        var actions = extraActionCreators.actions;
        var queryInfos = extraActionCreators.queryInfos || {};
        Object.keys(extraActionCreators.queryInfos).forEach(function (actionKey) {
          if (queryInfos[actionKey] && queryInfos[actionKey].globalMerger) {
            var actionType = actions[actionKey].creatorRefs.respond.actionType;

            var reducer = _this.createGlobalMergerForResponse(actionType, queryInfos[actionKey].globalMerger);

            reducers[actionKey] = reducer;
            reducerArray.push(reducer);
          }
        });
        this.reducerSet.extra = reducers;

        this.extraGlobalReducer = function () {
          var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          var action = arguments.length > 1 ? arguments[1] : undefined;
          return reducerArray.reduce(function (s, r) {
            return r(s, action);
          }, state);
        };
      }
      var resourceReducerRoot = (0, _combineReducers["default"])(this.allResourceReducers);

      this.rootReducer = function (state) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var newState = resourceReducerRoot.apply(void 0, [state].concat(args));
        return _this.extraGlobalReducer.apply(void 0, [newState].concat(args));
      };
    }
  }, {
    key: "getEpicByActionType",
    value: function getEpicByActionType(actionType) {
      return function (action$, store$, dependencies) {
        return action$.pipe((0, _operators.filter)(function (action) {
          if (action.type !== actionType) {
            return false;
          }

          return true;
        }), (0, _operators.mergeMap)(function (action) {
          return [{
            type: "".concat(actionType, "_XXX")
          }];
        }));
      };
    }
  }, {
    key: "getRootEpic",
    value: function getRootEpic() {
      var _this2 = this;

      var models = this.querchy.querchyDefinition.models;
      var extraActionCreators = this.querchy.querchyDefinition.extraActionCreators;
      return _pureEpic.combineEpics.apply(void 0, _toConsumableArray(Object.keys(models).filter(function (modelName) {
        return models[modelName].actionTypes['updateCache'];
      }).map(function (modelName) {
        return _this2.getEpicByActionType(models[modelName].actionTypes['updateCache']);
      })));
    }
  }, {
    key: "reduce",
    value: function reduce(state, action) {
      return this.rootReducer(state, action);
    }
  }]);

  return Updater;
}();

exports["default"] = Updater;