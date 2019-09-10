"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _pureEpic = require("pure-epic");

var _operators = require("rxjs/operators");

var _reselect = require("reselect");

var _combineReducers = _interopRequireDefault(require("../redux/combineReducers"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Cacher = function () {
  function Cacher(querchy, extraSelectorInfosForModel) {
    _classCallCheck(this, Cacher);

    _defineProperty(this, "querchy", void 0);

    _defineProperty(this, "extraSelectorInfosForModel", void 0);

    _defineProperty(this, "reducerSet", void 0);

    _defineProperty(this, "selectorCreatorSet", void 0);

    _defineProperty(this, "selectorSet", void 0);

    _defineProperty(this, "allResourceReducers", void 0);

    _defineProperty(this, "extraGlobalReducer", void 0);

    _defineProperty(this, "rootReducer", void 0);

    _defineProperty(this, "createResourceMergerForResponse", function (actionType, merger) {
      return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utils.createEmptyResourceState)();
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
    this.extraSelectorInfosForModel = extraSelectorInfosForModel;
    this.reducerSet = {};
    this.selectorCreatorSet = {};
    this.selectorSet = {};
    this.allResourceReducers = {};

    this.rootReducer = function (s) {
      return s;
    };

    this.init();
  }

  _createClass(Cacher, [{
    key: "createSelectorAndSectorCreatorForResource",
    value: function createSelectorAndSectorCreatorForResource(key, resourceModel, extraSelectorInfosForModelMap) {
      var _this = this;

      this.selectorCreatorSet[key] = {};

      this.selectorCreatorSet[key].selectResourceMap = function () {
        return (0, _reselect.createSelector)(_this.querchy.querchyDefinition.baseSelector, function (s) {
          return s[key] && s[key].resourceMap || {};
        });
      };

      this.selectorCreatorSet[key].selectResourceMapMetadata = function () {
        return (0, _reselect.createSelector)(_this.selectorCreatorSet[key].selectResourceMap(), function (s) {
          return s.metadata;
        });
      };

      this.selectorCreatorSet[key].selectResourceMapValues = function () {
        return (0, _reselect.createSelector)(_this.selectorCreatorSet[key].selectResourceMap(), function (s) {
          return s.values;
        });
      };

      this.selectorCreatorSet[key].selectQueryMap = function () {
        return (0, _reselect.createSelector)(_this.querchy.querchyDefinition.baseSelector, function (s) {
          return s[key] && s[key].queryMap || {};
        });
      };

      this.selectorCreatorSet[key].selectQueryMapMetadata = function () {
        return (0, _reselect.createSelector)(_this.selectorCreatorSet[key].selectQueryMap(), function (s) {
          return s.metadata;
        });
      };

      this.selectorCreatorSet[key].selectQueryMapValues = function () {
        return (0, _reselect.createSelector)(_this.selectorCreatorSet[key].selectQueryMap(), function (s) {
          return s.values;
        });
      };

      this.selectorSet[key] = {};
      Object.keys(this.selectorCreatorSet[key]).forEach(function (selectorName) {
        _this.selectorSet[key][selectorName] = _this.selectorCreatorSet[key][selectorName]();
      });
      Object.keys(extraSelectorInfosForModelMap).forEach(function (selectorName) {
        _this.selectorCreatorSet[key][selectorName] = extraSelectorInfosForModelMap[selectorName].creatorCreator(_this.querchy.querchyDefinition.baseSelector, _this.selectorCreatorSet[key], _this.selectorSet[key]);
      });
      Object.keys(this.selectorCreatorSet[key]).filter(function (selectorName) {
        return !_this.selectorSet[key][selectorName];
      }).forEach(function (selectorName) {
        _this.selectorSet[key][selectorName] = _this.selectorCreatorSet[key][selectorName]();
      });

      if (resourceModel && resourceModel.feature.getExtraSelectorInfos) {
        var feature = resourceModel.feature;
        var esf = resourceModel.feature;
        var esfInfos = esf.getExtraSelectorInfos(resourceModel);
        Object.keys(esfInfos).forEach(function (selectorName) {
          _this.selectorCreatorSet[key][selectorName] = esfInfos[selectorName].creatorCreator(_this.querchy.querchyDefinition.baseSelector, _this.selectorCreatorSet[key], _this.selectorSet[key]);
        });
        Object.keys(esfInfos).forEach(function (selectorName) {
          _this.selectorSet[key][selectorName] = _this.selectorCreatorSet[key][selectorName]();
        });
      }
    }
  }, {
    key: "init",
    value: function init() {
      var _this2 = this;

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

            var reducer = _this2.createResourceMergerForResponse(actionType, queryInfos[actionKey].resourceMerger);

            reducers[actionKey] = reducer;
            reducerArray.push(reducer);
          }
        });
        var actionInfos = model.actionInfos || {};
        Object.keys(actionInfos).forEach(function (actionKey) {
          if (actionInfos[actionKey] && actionInfos[actionKey].resourceMerger) {
            var actionType = actions[actionKey].actionType;

            var reducer = _this2.createResourceMergerForResponse(actionType, actionInfos[actionKey].resourceMerger);

            reducers[actionKey] = reducer;
            reducerArray.push(reducer);
          }
        });
        _this2.reducerSet[key] = reducers;

        _this2.allResourceReducers[key] = function () {
          var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utils.createEmptyResourceState)();
          var action = arguments.length > 1 ? arguments[1] : undefined;
          return reducerArray.reduce(function (s, r) {
            return r(s, action);
          }, state);
        };

        var extraSelectorInfoForModel = _this2.extraSelectorInfosForModel[key] || {};

        _this2.createSelectorAndSectorCreatorForResource(key, model, extraSelectorInfoForModel);
      });
      {
        var reducers = {};
        var reducerArray = [];
        var actions = extraActionCreators.actions;
        var queryInfos = extraActionCreators.queryInfos || {};
        Object.keys(extraActionCreators.queryInfos).forEach(function (actionKey) {
          if (queryInfos[actionKey] && queryInfos[actionKey].globalMerger) {
            var actionType = actions[actionKey].creatorRefs.respond.actionType;

            var reducer = _this2.createGlobalMergerForResponse(actionType, queryInfos[actionKey].globalMerger);

            reducers[actionKey] = reducer;
            reducerArray.push(reducer);
          }
        });
        var actionInfos = extraActionCreators.actionInfos || {};
        Object.keys(extraActionCreators.actionInfos).forEach(function (actionKey) {
          if (actionInfos[actionKey] && actionInfos[actionKey].globalMerger) {
            var actionType = actions[actionKey].actionType;

            var reducer = _this2.createGlobalMergerForResponse(actionType, actionInfos[actionKey].globalMerger);

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

        var extraSelectorInfoForModel = this.extraSelectorInfosForModel.extra || {};
        this.createSelectorAndSectorCreatorForResource('extra', null, extraSelectorInfoForModel);
      }

      this.allResourceReducers.extra = function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utils.createEmptyResourceState)();
        var action = arguments.length > 1 ? arguments[1] : undefined;
        return state;
      };

      var resourceReducerRoot = (0, _combineReducers["default"])(this.allResourceReducers);

      this.rootReducer = function (state, action) {
        var newState = resourceReducerRoot(state, action);
        return _this2.extraGlobalReducer(newState, action);
      };
    }
  }, {
    key: "getEpicByActionType",
    value: function getEpicByActionType(actionType) {
      return function (action$, state$) {
        return action$.pipe((0, _operators.filter)(function (action) {
          if (action.type !== actionType) {
            return false;
          }

          return true;
        }), (0, _operators.mergeMap)(function (action) {
          return [];
        }));
      };
    }
  }, {
    key: "getRootEpic",
    value: function getRootEpic() {
      var _this3 = this;

      var models = this.querchy.querchyDefinition.models;
      var extraActionCreators = this.querchy.querchyDefinition.extraActionCreators;
      return _pureEpic.combineEpics.apply(void 0, _toConsumableArray(Object.keys(models).filter(function (modelName) {
        return models[modelName].actionTypes['updateCache'];
      }).map(function (modelName) {
        return _this3.getEpicByActionType(models[modelName].actionTypes['updateCache']);
      })));
    }
  }]);

  return Cacher;
}();

exports["default"] = Cacher;