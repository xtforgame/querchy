"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _namespaces = _interopRequireWildcard(require("./namespaces"));

var _createWatcherMiddleware = _interopRequireDefault(require("../utils/createWatcherMiddleware"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var _default = function _default() {
  var namespace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _namespaces.defaultNamespaceName;
  var store;

  var epicMiddleware = function epicMiddleware(s) {
    store = s;
    _namespaces["default"][namespace] = {
      store: store,
      name: namespace
    };
    var watcherMiddleware = (0, _createWatcherMiddleware["default"])();
    var watcherMiddlewareCb = watcherMiddleware(store);
    return function (next) {
      return function (action) {
        var result = next(action);
        return watcherMiddlewareCb(function () {
          return result;
        })(action);
      };
    };
  };

  return epicMiddleware;
};

exports["default"] = _default;