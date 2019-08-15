"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultToPromiseFunc = defaultToPromiseFunc;
exports.toSeqPromise = toSeqPromise;
exports.promiseWait = promiseWait;
exports.capitalizeFirstLetter = exports.toUnderscore = exports.toCamel = void 0;

function defaultToPromiseFunc(prev, curr, index, array) {
  return Promise.resolve(curr);
}

function toSeqPromise(inArray) {
  var toPrmiseFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultToPromiseFunc;
  return inArray.reduce(function (prev, curr, index, array) {
    return prev.then(function () {
      return toPrmiseFunc(prev, curr, index, array);
    });
  }, Promise.resolve());
}

function promiseWait(waitMillisec) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, waitMillisec);
  });
}

var toCamel = function toCamel(str) {
  return str.replace(/_([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
};

exports.toCamel = toCamel;

var toUnderscore = function toUnderscore(str) {
  return str.replace(/([A-Z])/g, function (g) {
    return "_".concat(g.toLowerCase());
  });
};

exports.toUnderscore = toUnderscore;

var capitalizeFirstLetter = function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

exports.capitalizeFirstLetter = capitalizeFirstLetter;