"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.crudToRestMap = void 0;
var crudToRestMap = {
  create: 'post',
  read: 'get',
  update: 'patch',
  "delete": 'delete'
};
exports.crudToRestMap = crudToRestMap;