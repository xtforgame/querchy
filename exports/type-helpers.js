"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "QuerchyTypeGroup", {
  enumerable: true,
  get: function get() {
    return _Querchy.QuerchyTypeGroup;
  }
});
Object.defineProperty(exports, "Querchy", {
  enumerable: true,
  get: function get() {
    return _Querchy["default"];
  }
});
Object.defineProperty(exports, "CacherTypeGroup", {
  enumerable: true,
  get: function get() {
    return _Cacher.CacherTypeGroup;
  }
});
Object.defineProperty(exports, "Cacher", {
  enumerable: true,
  get: function get() {
    return _Cacher["default"];
  }
});
exports.TypeHelperClass = void 0;

var _Querchy = _interopRequireWildcard(require("./Querchy"));

var _Cacher = _interopRequireWildcard(require("./Cacher"));

var _AxiosRunner = _interopRequireDefault(require("./query-runners/AxiosRunner"));

var _interfaces = require("./core/interfaces");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TypeHelperClass = function TypeHelperClass() {
  _classCallCheck(this, TypeHelperClass);

  _defineProperty(this, "Types", void 0);

  _defineProperty(this, "GetAxiosRunnerClass", function () {
    return _AxiosRunner["default"];
  });

  _defineProperty(this, "GetQuerchyClass", function () {
    return _Querchy["default"];
  });

  _defineProperty(this, "GetCacherClass", function () {
    return _Cacher["default"];
  });
};

exports.TypeHelperClass = TypeHelperClass;