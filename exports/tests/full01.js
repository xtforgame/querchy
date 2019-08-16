"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.MyStore = exports.createEpicMiddleware001 = exports.crudToRestMap = void 0;

var _pureEpic = require("pure-epic");

var _index = require("../index");

var _types = require("./types001");

var _helpers = require("./helpers");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var crudToRestMap = {
  create: 'post',
  read: 'get',
  update: 'patch',
  "delete": 'delete',
  getCollection: 'get'
};
exports.crudToRestMap = crudToRestMap;

var createEpicMiddleware001 = function createEpicMiddleware001() {
  return _pureEpic.createEpicMiddleware.apply(void 0, arguments);
};

exports.createEpicMiddleware001 = createEpicMiddleware001;

var MyStore = function MyStore(cacher, epicMiddleware, cb) {
  var _this = this;

  _classCallCheck(this, MyStore);

  _defineProperty(this, "state", void 0);

  _defineProperty(this, "cacher", void 0);

  _defineProperty(this, "epicMiddleware", void 0);

  _defineProperty(this, "epicMiddlewareCb", void 0);

  _defineProperty(this, "cb", void 0);

  _defineProperty(this, "dispatch", function (action) {
    console.log('action.type :', action.type);

    if (action.crudSubType === 'respond') {} else if (action.crudSubType === 'respondError') {}

    if (action.response) {
      if (action.response.data.headers) {}

      if (action.response.data.args) {}
    }

    _this.state = _this.cacher.reduce(_this.getState(), action);

    _this.epicMiddlewareCb(function () {})(action);

    if (action.response) {
      console.log('this.state :', _this.state);
    }

    _this.cb(action);
  });

  _defineProperty(this, "getState", function () {
    return _this.state;
  });

  this.state = {};
  this.cacher = cacher;
  this.epicMiddleware = epicMiddleware;
  this.epicMiddlewareCb = this.epicMiddleware(this);
  this.cb = cb;
};

exports.MyStore = MyStore;

var testRun = function testRun(querchy, cacher, resolve) {
  var querchyRootEpic = querchy.getRootEpic();
  var cacherRootEpic = cacher.getRootEpic();
  var rootEpic = (0, _pureEpic.combineEpics)(querchyRootEpic, cacherRootEpic);
  var epicMiddleware = createEpicMiddleware001();

  var cb = function cb(action) {
    var actionCreator = action.actionCreator;

    if (actionCreator) {
      var _querchy$actionCreato = querchy.actionCreatorSets.httpBinRes["delete"].creatorRefs,
          respond = _querchy$actionCreato.respond,
          respondError = _querchy$actionCreato.respondError,
          cancel = _querchy$actionCreato.cancel;

      if (action.type === cancel.actionType || action.type === respond.actionType || action.type === respondError.actionType) {
        resolve(1);
      }
    }
  };

  var store = new MyStore(cacher, epicMiddleware, cb);
  var epicMiddlewareCb = store.epicMiddlewareCb;
  epicMiddleware.run(rootEpic);
  var _querchy$actionCreato2 = querchy.actionCreatorSets,
      httpBinRes = _querchy$actionCreato2.httpBinRes,
      httpBinRes2 = _querchy$actionCreato2.httpBinRes2,
      extra = _querchy$actionCreato2.extra;
  store.dispatch(httpBinRes.create({}, {
    query: {
      id: 1
    },
    headers: {
      Ppp: 'xxx'
    }
  }));
  store.dispatch(httpBinRes.read(1, {
    query: {
      id: 1
    },
    headers: {
      Ppp: 'xxx'
    }
  }));
  store.dispatch(httpBinRes.update(1, {}, {
    query: {
      id: 1
    },
    headers: {
      Ppp: 'xxx'
    }
  }));
  store.dispatch(httpBinRes2.getCollection({
    query: {
      id: 1
    },
    headers: {
      Ppp: 'xxx'
    }
  }));
  store.dispatch(httpBinRes["delete"](1, {
    query: {
      id: 1
    },
    headers: {
      Ppp: 'xxx'
    }
  }));
  store.dispatch(extra.extraQuery1({
    query: {
      id: 1
    },
    headers: {
      Ppp: 'xxx'
    }
  }));
};

var _default = function _default() {
  return new Promise(function (resolve) {
    var _extraActionCreators;

    var querchy = new _types.MyQuerchy001({
      commonConfig: {
        defaultQueryRunner: new _types.MyAxiosRunner001(),
        queryRunners: {
          customRunner: new _types.MyAxiosRunner001()
        },
        actionTypePrefix: 'QC_ACTS/'
      },
      models: {
        httpBinRes: {
          url: 'https://httpbin.org',
          buildUrl: function buildUrl(action) {
            return "https://httpbin.org/".concat(crudToRestMap[action.crudType]);
          },
          queryInfos: (0, _helpers.getBasicQueryInfos)(),
          actionInfos: (0, _helpers.getBasicActionInfos)()
        },
        httpBinRes2: {
          url: 'https://httpbin.org/post',
          queryBuilderName: 'customPath',
          queryInfos: _objectSpread({}, (0, _helpers.getBasicQueryInfos)(), {
            getCollection: {
              actionCreator: function actionCreator(options) {
                return {
                  options: options
                };
              },
              resourceMerger: _helpers.resMergerForColl
            }
          }),
          actionInfos: (0, _helpers.getBasicActionInfos)()
        }
      },
      queryBuilders: {
        defaultBuilder: {
          buildRequestConfig: function buildRequestConfig(action, _ref) {
            var runnerType = _ref.runnerType,
                commonConfig = _ref.commonConfig,
                models = _ref.models;

            if (!action.modelName) {
              return null;
            }

            return {
              method: crudToRestMap[action.crudType],
              url: models[action.modelName].buildUrl(action),
              headers: action.options.headers,
              query: action.options.query,
              body: action.data
            };
          }
        },
        customPath: {
          queryRunner: 'customRunner',
          buildRequestConfig: function buildRequestConfig(action, _ref2) {
            var runnerType = _ref2.runnerType,
                commonConfig = _ref2.commonConfig,
                models = _ref2.models;

            if (!action.modelName) {
              return null;
            }

            return {
              method: crudToRestMap[action.crudType],
              url: "https://httpbin.org/".concat(crudToRestMap[action.crudType]),
              headers: action.options.headers,
              query: action.options.query,
              body: action.data
            };
          }
        },
        forExtra: {
          queryRunner: 'customRunner',
          buildRequestConfig: function buildRequestConfig(action, _ref3) {
            var runnerType = _ref3.runnerType,
                commonConfig = _ref3.commonConfig,
                models = _ref3.models;
            return {
              method: 'get',
              url: 'https://httpbin.org/get',
              headers: action.options.headers,
              query: action.options.query,
              body: action.data
            };
          }
        }
      },
      extraActionCreators: (_extraActionCreators = {}, _defineProperty(_extraActionCreators, _index.INIT_FUNC, function (models) {}), _defineProperty(_extraActionCreators, "queryInfos", {
        extraQuery1: {
          actionCreator: function actionCreator(options) {
            return {
              options: options
            };
          },
          queryBuilderName: 'forExtra',
          globalMerger: function globalMerger(s) {
            delete s.httpBinRes.resourceMap['1'];
            delete s.httpBinRes.resourceMap['2'];
            delete s.httpBinRes2.resourceMap['1'];
            delete s.httpBinRes2.resourceMap['2'];
            console.log('===================== s :', s);
            return s;
          }
        }
      }), _defineProperty(_extraActionCreators, "actionInfos", {
        updateCacheExtra: {
          actionCreator: function actionCreator(options) {
            return {
              cacheChange: null
            };
          }
        }
      }), _extraActionCreators)
    });
    var cacher = new _types.MyCacher001(querchy);
    testRun(querchy, cacher, resolve);
  });
};

exports["default"] = _default;