"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeResourceState = exports.createEmptyResourceState = exports.toNull = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var toNull = function toNull() {
  return {
    type: 'TO_NULL'
  };
};

exports.toNull = toNull;

var createEmptyResourceState = function createEmptyResourceState() {
  return {
    queryMap: {
      metadata: {},
      values: {}
    },
    resourceMap: {
      metadata: {},
      values: {}
    }
  };
};

exports.createEmptyResourceState = createEmptyResourceState;

var mergeResourceState = function mergeResourceState(a) {
  for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    rest[_key - 1] = arguments[_key];
  }

  if (rest.length === 0) {
    return a;
  }

  var b = rest[0],
      rest2 = rest.slice(1);
  var result = {
    resourceMap: {
      metadata: _objectSpread({}, a.resourceMap.metadata, {}, b.resourceMap && b.resourceMap.metadata),
      values: _objectSpread({}, a.resourceMap.values, {}, b.resourceMap && b.resourceMap.values)
    },
    queryMap: {
      metadata: _objectSpread({}, a.queryMap.metadata, {}, b.queryMap && b.queryMap.metadata),
      values: _objectSpread({}, a.queryMap.values, {}, b.queryMap && b.queryMap.values)
    }
  };

  if (rest2.length === 0) {
    return result;
  }

  return mergeResourceState.apply(void 0, [result].concat(_toConsumableArray(rest2)));
};

exports.mergeResourceState = mergeResourceState;