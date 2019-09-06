"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultToPromiseFunc = defaultToPromiseFunc;
exports.toSeqPromise = toSeqPromise;
exports.promiseWait = promiseWait;
exports.capitalizeFirstLetter = exports.toUnderscore = exports.toCamel = exports.PreservePromise = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var PreservePromise = function () {
  function PreservePromise() {
    var _this = this;

    _classCallCheck(this, PreservePromise);

    _defineProperty(this, "fulfilled", void 0);

    _defineProperty(this, "promise", void 0);

    _defineProperty(this, "result", void 0);

    _defineProperty(this, "_resolve", void 0);

    _defineProperty(this, "_reject", void 0);

    this.fulfilled = false;
    this.promise = new Promise(function (resolve, reject) {
      if (_this.result) {
        if (_this.result.type === 'resolve') {
          resolve(_this.result.value);
        } else {
          reject(_this.result.value);
        }
      } else {
        _this._resolve = resolve;
        _this._reject = reject;
      }
    });
  }

  _createClass(PreservePromise, [{
    key: "resolve",
    value: function resolve(value) {
      if (this.fulfilled) {
        return;
      }

      if (this._resolve) {
        this._resolve(value);
      } else {
        this.result = {
          type: 'resolve',
          value: value
        };
      }

      this.fulfilled = true;
    }
  }, {
    key: "reject",
    value: function reject(value) {
      if (this.fulfilled) {
        return;
      }

      if (this._reject) {
        this._reject(value);
      } else {
        this.result = {
          type: 'reject',
          value: value
        };
      }

      this.fulfilled = true;
    }
  }]);

  return PreservePromise;
}();

exports.PreservePromise = PreservePromise;

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