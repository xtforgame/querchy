"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MyCacher001 = exports.createEpicMiddleware001 = exports.MyQuerchy001 = exports.MyAxiosRunner001 = void 0;

var _pureEpic = require("pure-epic");

var _ = require("./..");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var MyAxiosRunner001 = function (_AxiosRunner) {
  _inherits(MyAxiosRunner001, _AxiosRunner);

  function MyAxiosRunner001() {
    _classCallCheck(this, MyAxiosRunner001);

    return _possibleConstructorReturn(this, _getPrototypeOf(MyAxiosRunner001).apply(this, arguments));
  }

  return MyAxiosRunner001;
}(_.AxiosRunner);

exports.MyAxiosRunner001 = MyAxiosRunner001;

var MyQuerchy001 = function (_Querchy) {
  _inherits(MyQuerchy001, _Querchy);

  function MyQuerchy001() {
    _classCallCheck(this, MyQuerchy001);

    return _possibleConstructorReturn(this, _getPrototypeOf(MyQuerchy001).apply(this, arguments));
  }

  return MyQuerchy001;
}(_.Querchy);

exports.MyQuerchy001 = MyQuerchy001;

var createEpicMiddleware001 = function createEpicMiddleware001() {
  return _pureEpic.createEpicMiddleware.apply(void 0, arguments);
};

exports.createEpicMiddleware001 = createEpicMiddleware001;

var MyCacher001 = function (_Cacher) {
  _inherits(MyCacher001, _Cacher);

  function MyCacher001() {
    _classCallCheck(this, MyCacher001);

    return _possibleConstructorReturn(this, _getPrototypeOf(MyCacher001).apply(this, arguments));
  }

  _createClass(MyCacher001, [{
    key: "reduce",
    value: function reduce(action, state) {
      return _get(_getPrototypeOf(MyCacher001.prototype), "reduce", this).call(this, action, state);
    }
  }]);

  return MyCacher001;
}(_.Cacher);

exports.MyCacher001 = MyCacher001;