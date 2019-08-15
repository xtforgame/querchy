"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  INIT_FUNC: true
};
exports.INIT_FUNC = void 0;

var _crudSubActionInterfaces = require("./crud-sub-action-interfaces");

Object.keys(_crudSubActionInterfaces).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _crudSubActionInterfaces[key];
    }
  });
});
var INIT_FUNC = Symbol('init');
exports.INIT_FUNC = INIT_FUNC;