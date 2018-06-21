require("source-map-support").install();
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 27);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/get-iterator");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/classCallCheck");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/createClass");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/regenerator");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/asyncToGenerator");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

/**
 * Created by rsalesc on 14/06/16.
 */
var winston = __webpack_require__(30);
var process = __webpack_require__(19);

var logger = new winston.Logger({
    level: process.env.LOG_LEVEL || "info",
    transports: [new winston.transports.Console({
        // eslint-disable-next-line no-constant-condition
        level: process.env.VERBOSE || true ? "debug" : "warn"
        // handleExceptions: true
    }), new winston.transports.File({
        name: "info-file",
        level: "info",
        filename: __dirname + "/../logs/info.log"
    }), new winston.transports.File({
        name: "error-file",
        level: "warn",
        filename: __dirname + "/../logs/error.log"
        // handleExceptions: true, json: true
    })]
});

module.exports = logger;
/* WEBPACK VAR INJECTION */}.call(exports, "judge"))

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/object/keys");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/promise");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/slicedToArray");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("fs-extra");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _promise = __webpack_require__(9);

var _promise2 = _interopRequireDefault(_promise);

var _typeof2 = __webpack_require__(37);

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = __webpack_require__(8);

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = __webpack_require__(0);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = __webpack_require__(5);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = __webpack_require__(6);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var exists = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(p) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return fs.stat(p);

          case 3:
            return _context.abrupt("return", true);

          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", false);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 6]]);
  }));

  return function exists(_x) {
    return _ref.apply(this, arguments);
  };
}();

var fileExists = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(p) {
    var res;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return fs.stat(p);

          case 3:
            res = _context2.sent;
            return _context2.abrupt("return", res.isFile());

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            return _context2.abrupt("return", false);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 7]]);
  }));

  return function fileExists(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var dirExists = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(p) {
    var res;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return fs.statAsync(p);

          case 3:
            res = _context3.sent;
            return _context3.abrupt("return", res.isDirectory());

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](0);
            return _context3.abrupt("return", false);

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 7]]);
  }));

  return function dirExists(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

// eslint-disable-next-line require-await
var globAsync = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(pattern, opts) {
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt("return", new _promise2.default(function (resolve, reject) {
              glob(pattern, opts, function (err, files) {
                if (err) return reject(err);
                return resolve(files);
              });
            }));

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function globAsync(_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}();

var mkdtemp = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt("return", new _promise2.default(function (resolve, reject) {
              return fs.mkdtemp.apply(fs, args.concat([function (err, result) {
                if (err) return reject(err);
                return resolve(result);
              }]));
            }));

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function mkdtemp() {
    return _ref5.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by rsalesc on 14/06/16.
 */

var path = __webpack_require__(1);
var fs = __webpack_require__(11);
var util = __webpack_require__(38);
var glob = __webpack_require__(23);

function inspect(p) {
  return util.inspect(p, false, null);
}

function logInspect(p) {
  return console.log(inspect(p));
}

function fillUpTo(arr) {
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (n === 0) return [];
  if (!(arr instanceof Array) || arr.length === 0) arr = [undefined];

  while (arr.length > n) {
    arr.pop();
  }while (arr.length < n) {
    var el = arr.pop();
    arr.push(el);
    arr.push(el);
  }

  return arr;
}

function destroy(obj) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(obj)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var prop = _step.value;

      var property = obj[prop];
      if (property != null && (typeof property === "undefined" ? "undefined" : (0, _typeof3.default)(property)) === "object") destroy(property);else obj[prop] = null;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

function normalizePath(p) {
  var normalizedPath = path.normalize(p);
  if (normalizedPath[-1] === "/") return normalizedPath.slice(0, -1);
  return normalizedPath;
}

module.exports = {
  exists: exists,
  fileExists: fileExists,
  dirExists: dirExists,
  inspect: inspect,
  logInspect: logInspect,
  fillUpTo: fillUpTo,
  destroy: destroy,
  globAsync: globAsync,
  mkdtemp: mkdtemp
};

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/object/get-prototype-of");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/possibleConstructorReturn");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/inherits");

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _regenerator = __webpack_require__(5);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = __webpack_require__(6);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _slicedToArray2 = __webpack_require__(10);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getIterator2 = __webpack_require__(0);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _map = __webpack_require__(20);

var _map2 = _interopRequireDefault(_map);

var _classCallCheck2 = __webpack_require__(2);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(3);

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by rsalesc on 15/06/16.
 */

var fs = __webpack_require__(17);
var fse = __webpack_require__(11);
var tmp = __webpack_require__(31);
tmp.setGracefulCleanup();

var path = __webpack_require__(1);

var MongoQueue2 = __webpack_require__(21);

var JudgeConfig = {
  MAX_TRIES: 5,
  EPS: 1e-7,
  SANDBOX_OFFSET: parseInt(process.env.SANDBOX_OFFSET || 0, 10),
  MAX_SANDBOXES: parseInt(process.env.MAX_SANDBOXES || 10, 10),
  MAX_SIMUL_TESTS: parseInt(process.env.MAX_SIMUL_TESTS || 1, 10),
  COMPILATION_TL: 30,
  CHECKING_TL: 10,
  CHECKING_ML: 512,
  CHECKING_WTL: 20,
  WT_MULTIPLIER: 8,
  OUTPUT_LIMIT: 1 << 24,
  TEMP_DIR: "/tmp",
  ISOLATE_PATH: path.resolve("/usr/local/bin/isolate"),
  VISIBILITY_WINDOW: parseInt(process.env.VISIBILITY_WINDOW || 20, 10),
  BOUND_ML: 2048
};

var PackageCacher = function () {
  function PackageCacher() {
    var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20;
    (0, _classCallCheck3.default)(this, PackageCacher);

    this.path = tmp.dirSync({ prefix: "judecache-", unsafeCleanup: true }).name;
    this.has = new _map2.default();
    this.size = size;
  }

  (0, _createClass3.default)(PackageCacher, [{
    key: "popLessFrequent",
    value: function popLessFrequent() {
      var best = 1e9;
      var res = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(this.has), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = (0, _slicedToArray3.default)(_step.value, 2),
              key = _step$value[0],
              value = _step$value[1];

          if (value < best) res = [];
          if (value <= best) {
            best = value;
            res.push(key);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      try {
        if (res.length > 0) {
          var idx = Math.random() * res.length | 0;
          var p = this.getFilePath(res[idx]);
          fs.removeSync(p);
          this.has.delete(res[idx]);
          return true;
        }
        return false;
      } catch (ex) {
        return false;
      }
    }
  }, {
    key: "ensureSpace",
    value: function ensureSpace() {
      while (this.has.size >= this.size) {
        if (!this.popLessFrequent()) break;
      }
    }
  }, {
    key: "ping",
    value: function ping(p) {
      var nv = Math.max(this.has.get(p) || 0, 0) + 1;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(this.has), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _step2$value = (0, _slicedToArray3.default)(_step2.value, 2),
              key = _step2$value[0],
              value = _step2$value[1];

          this.has.set(key, value - 1);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this.has.set(p, nv);
    }
  }, {
    key: "addFromStream",
    value: function addFromStream(p, cb) {
      var _this = this;

      var writeStream = fs.createWriteStream(path.join(this.path, p));
      writeStream.on("finish", function () {
        _this.ensureSpace();
        _this.ping(p);
        cb(null);
      });

      writeStream.on("error", function (err) {
        cb(null);
      });

      return writeStream;
    }
  }, {
    key: "addFromFile",
    value: function addFromFile(p, d) {
      fse.copySync(d, this.getFilePath(p));
      this.ensureSpace();
      this.ping(p);
    }
  }, {
    key: "exists",
    value: function exists(p) {
      return this.has.has(p);
    }
  }, {
    key: "getFilePath",
    value: function getFilePath(p) {
      return path.resolve(this.path, p);
    }
  }]);
  return PackageCacher;
}();

var JudgeEnvironment = function () {
  function JudgeEnvironment(db, seaweed) {
    (0, _classCallCheck3.default)(this, JudgeEnvironment);

    this.sandboxes = [];
    this.nextSandboxId = 0;
    this.db = db;
    this.cache = new PackageCacher();
    this.ack = null;

    this.seaweed = seaweed;
    if (db) this.queue = new MongoQueue2(db, "jude-queue2");
  }

  (0, _createClass3.default)(JudgeEnvironment, [{
    key: "pingCurrent",
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (this.ack) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return", null);

              case 2:
                _context.prev = 2;
                _context.next = 5;
                return this.queue.ping(this.ack);

              case 5:
                console.log("pinged " + this.ack);
                _context.next = 11;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](2);

                console.error("couldnt ack " + this.ack);

              case 11:
                return _context.abrupt("return", null);

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 8]]);
      }));

      function pingCurrent() {
        return _ref.apply(this, arguments);
      }

      return pingCurrent;
    }()
  }, {
    key: "getNextBoxId",
    value: function getNextBoxId() {
      var res = this.nextSandboxId++;
      this.nextSandboxId %= JudgeConfig.MAX_SANDBOXES;
      return res % JudgeConfig.MAX_SANDBOXES + JudgeConfig.SANDBOX_OFFSET * JudgeConfig.MAX_SANDBOXES;
    }
  }]);
  return JudgeEnvironment;
}();

module.exports = {
  JudgeEnvironment: JudgeEnvironment,
  JudgeConfig: JudgeConfig
};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("process");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/map");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("mongo-queue2");

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mongoose = __webpack_require__(4);
var MongoQueue2 = __webpack_require__(21);
var weed = __webpack_require__(32);

// mongodb setup

var mongo_host = process.env.MONGO_HOST || 'localhost';
var weed_host = process.env.WEED_HOST || 'localhost';

var uri = 'mongodb://' + mongo_host + '/jude-dev';
if (!global.db) {
  global.db = mongoose.createConnection(uri);
  global.db.mods = {};
  global.judeQueue = new MongoQueue2(db, "jude-queue2");
  global.weedClient = new weed({
    server: weed_host,
    port: 9333
  });
}

module.exports = global.db;

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("glob");

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

var _keys = __webpack_require__(8);

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = __webpack_require__(0);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _getPrototypeOf = __webpack_require__(13);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = __webpack_require__(14);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(15);

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = __webpack_require__(2);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(3);

var _createClass3 = _interopRequireDefault(_createClass2);

var _regenerator = __webpack_require__(5);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = __webpack_require__(6);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = __webpack_require__(9);

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by rsalesc on 15/06/16.
 */

var yauzl = __webpack_require__(41);
var concatStream = __webpack_require__(42);
var utils = __webpack_require__(12);
var wildcard = __webpack_require__(43);
var path = __webpack_require__(1);
var logger = __webpack_require__(7);
var fs = __webpack_require__(11);
var promisify = __webpack_require__(44);
var glob = promisify(__webpack_require__(23).glob);

/* Helper Functions for storage */
function dealWithEntry(zipFile, entry) {
  return new _promise2.default(function (resolve, reject) {
    zipFile.openReadStream(entry, function (err, stream) {
      if (err) {
        zipFile.readEntry();
        return reject(err);
      }

      var concat = concatStream(function (buffer) {
        zipFile.readEntry();
        return resolve({ path: entry.fileName, buffer: buffer });
      });

      stream.on("error", function (err2) {
        zipFile.readEntry();
        return reject(err2);
      });

      return stream.pipe(concat);
    });
  });
}

function loadZipAsync(p) {
  var _this = this;

  var absPath = path.resolve(p);
  return new _promise2.default(function (resolve, reject) {
    yauzl.open(absPath, { lazyEntries: true }, function (err, zipFile) {
      if (err) return reject(err);
      var toWait = [];
      zipFile.readEntry();

      // process entries
      zipFile.on("entry", function (entry) {
        if (/\/$/.test(entry.fileName)) return zipFile.readEntry();

        return toWait.push(dealWithEntry(zipFile, entry));
      });

      zipFile.once("end", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var resWait;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                zipFile.close();
                // resolve or reject result
                _context.prev = 1;
                _context.next = 4;
                return _promise2.default.all(toWait);

              case 4:
                resWait = _context.sent;

                resolve(resWait);
                _context.next = 11;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](1);

                reject(_context.t0);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, _this, [[1, 8]]);
      })));

      return null;
    });
  });
}

/**
*   This is the base class for Storage
*   Make sure it runs inside an async environment
*   @abstract
 */

var Storage = function () {
  function Storage() {
    (0, _classCallCheck3.default)(this, Storage);

    if (this.constructor.name === Storage.name) throw "Cannot instantiate abstract class " + this.constructor.name;
  }

  /**
  *   Load a directory/file into the storage
  *   @param {string} path to the directory/file
      */
  // eslint-disable-next-line no-unused-vars


  (0, _createClass3.default)(Storage, [{
    key: "load",
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(p) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                throw "Function not implemented in " + this.constructor.name;

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function load(_x) {
        return _ref2.apply(this, arguments);
      }

      return load;
    }()

    /**
     * Relative path to be normalized
     * @param p to be normalized
     * @returns {string} normalized path
     */
    // eslint-disable-next-line no-unused-vars

  }, {
    key: "normalizePath",
    value: function normalizePath(p) {
      return p.length === 0 || p.charAt(0) !== "/" ? "/" + p : p;
    }

    /**
     *  Load a ZIP file into the storage
     *  @param {string} path to the zip file
     */
    // eslint-disable-next-line no-unused-vars

  }, {
    key: "loadZip",
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(p) {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                throw "Function not implemented in " + this.constructor.name;

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function loadZip(_x2) {
        return _ref3.apply(this, arguments);
      }

      return loadZip;
    }()

    /**
    *   Create a file in the storage from a provided buffer/string
    *   @param {string} path/ID of the new file in the Storage
    *   @param {buffer|string} content of the new file
      */
    // eslint-disable-next-line no-unused-vars

  }, {
    key: "createFileFromContent",
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(p, content) {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                throw "Function not implemented in " + this.constructor.name;

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function createFileFromContent(_x3, _x4) {
        return _ref4.apply(this, arguments);
      }

      return createFileFromContent;
    }()

    /**
    *   Get buffer from a file in Storage
    *   @param {string} path/ID to the file in storage
    *   @returns {buffer} buffer from the file
      */
    // eslint-disable-next-line no-unused-vars

  }, {
    key: "getFileBuffer",
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(p) {
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                throw "Function not implemented in " + this.constructor.name;

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getFileBuffer(_x5) {
        return _ref5.apply(this, arguments);
      }

      return getFileBuffer;
    }()

    /**
    *   Get string from a file in storage
    *   @param {string} path/ID to the file in storage
    *   @returns {string} string from the file
      */
    // eslint-disable-next-line no-unused-vars

  }, {
    key: "getFileString",
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(p) {
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                throw "Function not implemented in " + this.constructor.name;

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function getFileString(_x6) {
        return _ref6.apply(this, arguments);
      }

      return getFileString;
    }()

    /**
     *  Check if file is readable
     */

  }, {
    key: "isReadable",
    value: function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(p) {
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                _context7.next = 3;
                return this.getFileBuffer(p);

              case 3:
                return _context7.abrupt("return", true);

              case 6:
                _context7.prev = 6;
                _context7.t0 = _context7["catch"](0);
                return _context7.abrupt("return", false);

              case 9:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[0, 6]]);
      }));

      function isReadable(_x7) {
        return _ref7.apply(this, arguments);
      }

      return isReadable;
    }()

    /**
       * Get file names that match the given glob pattern
       * @param {string} glob pattern
       * @return {string[]} file names that match the given glob pattern
       */
    // eslint-disable-next-line no-unused-vars

  }, {
    key: "glob",
    value: function () {
      var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(p) {
        var sort = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                throw "Function not implemented in " + this.constructor.name;

              case 1:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function glob(_x8) {
        return _ref8.apply(this, arguments);
      }

      return glob;
    }()

    /**
       *  Dispose any resource cached in-memory by the storage
       *  (the Storage object should be unusable after that)
       */
    // eslint-disable-next-line no-unused-vars

  }, {
    key: "dispose",
    value: function () {
      var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(p) {
        return _regenerator2.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                throw "Function not implemented in " + this.constructor.name;

              case 1:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function dispose(_x10) {
        return _ref9.apply(this, arguments);
      }

      return dispose;
    }()
  }]);
  return Storage;
}();

var RealStorage = function (_Storage) {
  (0, _inherits3.default)(RealStorage, _Storage);

  // WARNING: class created only for testing purposes.
  // Non-persistent Storage should be used (in-memory, temporary dir, etc)
  // TODO: every function should check if dir exist and create it if it doesnt
  function RealStorage() {
    (0, _classCallCheck3.default)(this, RealStorage);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (RealStorage.__proto__ || (0, _getPrototypeOf2.default)(RealStorage)).call(this));

    _this2.path = "/";
    return _this2;
  }

  // eslint-disable-next-line require-await


  (0, _createClass3.default)(RealStorage, [{
    key: "load",
    value: function () {
      var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(p) {
        return _regenerator2.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                this.path = path.resolve(p);

              case 1:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function load(_x11) {
        return _ref10.apply(this, arguments);
      }

      return load;
    }()
  }, {
    key: "createFileFromContent",
    value: function () {
      var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(p, content) {
        var abs;
        return _regenerator2.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                abs = path.resolve(this.path, p);
                _context11.prev = 1;
                _context11.next = 4;
                return fs.writeFile(abs, content);

              case 4:
                _context11.next = 10;
                break;

              case 6:
                _context11.prev = 6;
                _context11.t0 = _context11["catch"](1);

                logger.error("[%s] File %s could not be created", this.constructor.name, p);
                throw _context11.t0;

              case 10:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this, [[1, 6]]);
      }));

      function createFileFromContent(_x12, _x13) {
        return _ref11.apply(this, arguments);
      }

      return createFileFromContent;
    }()
  }, {
    key: "getFileBuffer",
    value: function () {
      var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(p) {
        var abs, res;
        return _regenerator2.default.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                abs = path.resolve(this.path, p);
                _context12.prev = 1;
                _context12.next = 4;
                return fs.readFile(abs);

              case 4:
                res = _context12.sent;
                return _context12.abrupt("return", res);

              case 8:
                _context12.prev = 8;
                _context12.t0 = _context12["catch"](1);

                logger.error("[%s] File %s could not be retrieved", this.constructor.name, p);
                throw _context12.t0;

              case 12:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this, [[1, 8]]);
      }));

      function getFileBuffer(_x14) {
        return _ref12.apply(this, arguments);
      }

      return getFileBuffer;
    }()
  }, {
    key: "getFileString",
    value: function () {
      var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(p) {
        var abs, res;
        return _regenerator2.default.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                abs = path.resolve(this.path, p);
                _context13.prev = 1;
                _context13.next = 4;
                return fs.readFile(abs, "utf8");

              case 4:
                res = _context13.sent;
                return _context13.abrupt("return", res);

              case 8:
                _context13.prev = 8;
                _context13.t0 = _context13["catch"](1);

                logger.error("[%s] File %s could not be retrieved", this.constructor.name, p);
                throw _context13.t0;

              case 12:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this, [[1, 8]]);
      }));

      function getFileString(_x15) {
        return _ref13.apply(this, arguments);
      }

      return getFileString;
    }()
  }]);
  return RealStorage;
}(Storage);

var MemoryStorage = function (_Storage2) {
  (0, _inherits3.default)(MemoryStorage, _Storage2);

  function MemoryStorage() {
    (0, _classCallCheck3.default)(this, MemoryStorage);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (MemoryStorage.__proto__ || (0, _getPrototypeOf2.default)(MemoryStorage)).call(this));

    _this3.data = {};
    return _this3;
  }

  (0, _createClass3.default)(MemoryStorage, [{
    key: "load",
    value: function () {
      var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15(p) {
        var _this4 = this;

        var absPath, res;
        return _regenerator2.default.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                absPath = path.resolve(p);
                _context15.next = 3;
                return glob("**/*", { cwd: absPath, nodir: true });

              case 3:
                res = _context15.sent;
                _context15.next = 6;
                return _promise2.default.all(res.map(function () {
                  var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(file) {
                    return _regenerator2.default.wrap(function _callee14$(_context14) {
                      while (1) {
                        switch (_context14.prev = _context14.next) {
                          case 0:
                            _context14.next = 2;
                            return fs.readFile(path.join(absPath, file));

                          case 2:
                            _this4.data[_this4.normalizePath(file)] = _context14.sent;

                          case 3:
                          case "end":
                            return _context14.stop();
                        }
                      }
                    }, _callee14, _this4);
                  }));

                  return function (_x17) {
                    return _ref15.apply(this, arguments);
                  };
                }()));

              case 6:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function load(_x16) {
        return _ref14.apply(this, arguments);
      }

      return load;
    }()
  }, {
    key: "loadZip",
    value: function () {
      var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16(p) {
        var _this5 = this;

        var res, promises;
        return _regenerator2.default.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _context16.next = 2;
                return loadZipAsync(p);

              case 2:
                res = _context16.sent;
                promises = res.map(function (_ref17) {
                  var resPath = _ref17.path,
                      buffer = _ref17.buffer;
                  return _this5.createFileFromContent(resPath, buffer);
                });
                _context16.next = 6;
                return _promise2.default.all(promises);

              case 6:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function loadZip(_x18) {
        return _ref16.apply(this, arguments);
      }

      return loadZip;
    }()

    // eslint-disable-next-line require-await

  }, {
    key: "createFileFromContent",
    value: function () {
      var _ref18 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17(p, content) {
        var norm;
        return _regenerator2.default.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                norm = this.normalizePath(p);

                this.data[norm] = new Buffer(content);

              case 2:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function createFileFromContent(_x19, _x20) {
        return _ref18.apply(this, arguments);
      }

      return createFileFromContent;
    }()

    // eslint-disable-next-line require-await

  }, {
    key: "getFileBuffer",
    value: function () {
      var _ref19 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18(p) {
        var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var normalizedPath;
        return _regenerator2.default.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                normalizedPath = this.normalizePath(p);

                if (this.data.hasOwnProperty(normalizedPath)) {
                  _context18.next = 7;
                  break;
                }

                if (!(def === null)) {
                  _context18.next = 6;
                  break;
                }

                throw "File " + normalizedPath + " not found in MemoryStorage";

              case 6:
                return _context18.abrupt("return", new Buffer(def));

              case 7:
                return _context18.abrupt("return", this.data[normalizedPath]);

              case 8:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function getFileBuffer(_x21) {
        return _ref19.apply(this, arguments);
      }

      return getFileBuffer;
    }()

    // eslint-disable-next-line require-await

  }, {
    key: "getFileString",
    value: function () {
      var _ref20 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19(p) {
        var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var normalizedPath;
        return _regenerator2.default.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                normalizedPath = this.normalizePath(p);

                if (this.data.hasOwnProperty(normalizedPath)) {
                  _context19.next = 7;
                  break;
                }

                if (!(def === null)) {
                  _context19.next = 6;
                  break;
                }

                throw "File " + normalizedPath + " not found in MemoryStorage";

              case 6:
                return _context19.abrupt("return", def.toString());

              case 7:
                return _context19.abrupt("return", this.data[normalizedPath].toString());

              case 8:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      function getFileString(_x23) {
        return _ref20.apply(this, arguments);
      }

      return getFileString;
    }()

    // eslint-disable-next-line require-await

  }, {
    key: "glob",
    value: function () {
      var _ref21 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20(p) {
        var sort = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var normalizedPath, res, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, fn;

        return _regenerator2.default.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                normalizedPath = this.normalizePath(p);
                res = [];
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context20.prev = 5;

                for (_iterator = (0, _getIterator3.default)((0, _keys2.default)(this.data)); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  fn = _step.value;

                  if (wildcard(fn, normalizedPath)) res.push(fn);
                }
                _context20.next = 13;
                break;

              case 9:
                _context20.prev = 9;
                _context20.t0 = _context20["catch"](5);
                _didIteratorError = true;
                _iteratorError = _context20.t0;

              case 13:
                _context20.prev = 13;
                _context20.prev = 14;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 16:
                _context20.prev = 16;

                if (!_didIteratorError) {
                  _context20.next = 19;
                  break;
                }

                throw _iteratorError;

              case 19:
                return _context20.finish(16);

              case 20:
                return _context20.finish(13);

              case 21:
                if (sort) res.sort();
                return _context20.abrupt("return", res);

              case 23:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, this, [[5, 9, 13, 21], [14,, 16, 20]]);
      }));

      function glob(_x25) {
        return _ref21.apply(this, arguments);
      }

      return glob;
    }()

    // eslint-disable-next-line require-await

  }, {
    key: "dispose",
    value: function () {
      var _ref22 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21() {
        return _regenerator2.default.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                utils.destroy(this.data);
                this.data = null;

              case 2:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));

      function dispose() {
        return _ref22.apply(this, arguments);
      }

      return dispose;
    }()
  }]);
  return MemoryStorage;
}(Storage);

if (!module.parent && false) {
  // eslint-disable-next-line require-await
  (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee22() {
    var store;
    return _regenerator2.default.wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            console.log("Testing with async...");
            store = new MemoryStorage();
            _context22.next = 4;
            return store.load("test_contest");

          case 4:
            console.log(store.getFileString("jude.yml"));
            _context22.next = 7;
            return store.createFileFromContent("lola", "HAHAHA");

          case 7:
            console.log(store.getFileBuffer("jude.yml"));
            console.log(store.data);

          case 9:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee22, undefined);
  }))();
}

module.exports = {
  Storage: Storage,
  RealStorage: RealStorage,
  MemoryStorage: MemoryStorage
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)(module)))

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _getPrototypeOf = __webpack_require__(13);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = __webpack_require__(14);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(15);

var _inherits3 = _interopRequireDefault(_inherits2);

var _keys = __webpack_require__(8);

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = __webpack_require__(0);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = __webpack_require__(2);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(3);

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by rsalesc on 15/06/16.
 */

function submissionComparator(a, b) {
  if (a.timeInContest === b.timeInContest) return new Date(a.time).getTime() - new Date(b.time).getTime();
  return a.timeInContest - b.timeInContest;
}

var Scoring = function () {
  function Scoring(task) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, Scoring);

    // if (new.target == Scoring)
    //  throw `Cannot instantiate abstract class Scoring`;
    this._task = task;
    this._opts = opts;
  }

  (0, _createClass3.default)(Scoring, [{
    key: "isTaskValid",


    // eslint-disable-next-line no-unused-vars
    value: function isTaskValid(tk) {
      throw new Error("Function not implemented in this class");
    }
  }, {
    key: "hasWeight",
    value: function hasWeight() {
      throw new Error("Function not implemented in this class");
    }
  }, {
    key: "hasPenalty",
    value: function hasPenalty() {
      throw new Error("Function not implemented in this class");
    }

    // eslint-disable-next-line no-unused-vars

  }, {
    key: "solved",
    value: function solved(obj) {
      throw new Error("Function not implemented in this class");
    }

    // eslint-disable-next-line no-unused-vars

  }, {
    key: "attempted",
    value: function attempted(obj) {
      throw new Error("Function not implemented in this class");
    }

    // eslint-disable-next-line no-unused-vars

  }, {
    key: "eval",
    value: function _eval(verdicts) {
      throw new Error("Function not implemented in this class");
    }

    // eslint-disable-next-line no-unused-vars

  }, {
    key: "evalContest",
    value: function evalContest(submissions) {
      throw new Error("Function not implemented in this class");
    }
  }, {
    key: "skipped",
    value: function skipped() {
      return ["", "VERDICT_INQ", "VERDICT_JE", "VERDICT_CE", "VERDICT_FAIL", "VERDICT_CHTE", "VERDICT_UE", "VERDICT_CTE"];
    }
  }, {
    key: "hasSkipped",
    value: function hasSkipped(verdicts) {
      var toSkip = this.skipped();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(verdicts)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          var verdict = verdicts[key];
          if (toSkip.indexOf(verdict.verdict) !== -1) return true;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return false;
    }
  }, {
    key: "evalContext",
    value: function evalContext(submissions) {
      var _this = this;

      return this.evalContest(submissions.filter(function (s) {
        return s.timeInContest >= 0;
      }).filter(function (s) {
        return !_this.hasSkipped(s.verdict);
      }).sort(submissionComparator));
    }

    // eslint-disable-next-line no-unused-vars

  }, {
    key: "mergeEvaluations",
    value: function mergeEvaluations(evals) {
      throw new Error("Function not implemented in this class");
    }
  }, {
    key: "task",
    get: function get() {
      return this._task;
    }
  }, {
    key: "opts",
    get: function get() {
      return this._opts;
    }
  }]);
  return Scoring;
}();

var ProductScoring = function (_Scoring) {
  (0, _inherits3.default)(ProductScoring, _Scoring);

  function ProductScoring() {
    (0, _classCallCheck3.default)(this, ProductScoring);
    return (0, _possibleConstructorReturn3.default)(this, (ProductScoring.__proto__ || (0, _getPrototypeOf2.default)(ProductScoring)).apply(this, arguments));
  }

  (0, _createClass3.default)(ProductScoring, [{
    key: "isTaskValid",

    // eslint-disable-next-line no-unused-vars
    value: function isTaskValid(tk) {
      return true;
    }
  }, {
    key: "hasWeight",
    value: function hasWeight() {
      return true;
    }
  }, {
    key: "hasPenalty",
    value: function hasPenalty() {
      return true;
    }
  }, {
    key: "solved",
    value: function solved(obj) {
      return obj.score === this.task.getWeight();
    }
  }, {
    key: "attempted",
    value: function attempted(obj) {
      return obj.affect || obj.fails > 0;
    }
  }, {
    key: "fails",
    value: function fails(obj) {
      return obj.fails;
    }
  }, {
    key: "eval",
    value: function _eval(verdicts) {
      var res = 1;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)((0, _keys2.default)(verdicts)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;

          var verdict = verdicts[key];
          if (verdict.verdict === "VERDICT_INQ") {
            return {
              score: 0, affect: false, penalty: 0, fails: 0
            };
          }

          res *= verdict.verdict === "VERDICT_AC" ? 1 : 0;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return {
        score: parseInt(res * this.task.getWeight(), 10), penalty: 0, affect: true, fails: 0
      };
    }
  }, {
    key: "evalContest",
    value: function evalContest(submissions) {
      submissions.sort(submissionComparator);

      var fails = 0;

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = (0, _getIterator3.default)(submissions), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var submission = _step3.value;

          var evaluation = this.eval(submission.verdict);
          if (evaluation.affect) {
            if (evaluation.score === 0) fails++;else {
              return {
                score: evaluation.score,
                penalty: submission.timeInContest,
                affect: true,
                fails: fails
              };
            }
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return {
        score: 0, penalty: 0, affect: false, fails: fails
      };
    }
  }, {
    key: "mergeEvaluations",
    value: function mergeEvaluations(evals) {
      var opts = this.opts;


      return evals.reduce(function (old, cur) {
        return {
          score: old.score + cur.score,
          penalty: !cur.affect ? old.penalty : old.penalty + cur.penalty + cur.fails * (opts.penalty || 20)
        };
      }, { score: 0, penalty: 0 });
    }
  }]);
  return ProductScoring;
}(Scoring);

var SubtaskSumScoring = function (_Scoring2) {
  (0, _inherits3.default)(SubtaskSumScoring, _Scoring2);

  function SubtaskSumScoring() {
    (0, _classCallCheck3.default)(this, SubtaskSumScoring);
    return (0, _possibleConstructorReturn3.default)(this, (SubtaskSumScoring.__proto__ || (0, _getPrototypeOf2.default)(SubtaskSumScoring)).apply(this, arguments));
  }

  (0, _createClass3.default)(SubtaskSumScoring, [{
    key: "isTaskValid",

    // eslint-disable-next-line no-unused-vars
    value: function isTaskValid(tk) {
      return true;
    }
  }, {
    key: "hasWeight",
    value: function hasWeight() {
      return true;
    }
  }, {
    key: "hasPenalty",
    value: function hasPenalty() {
      return true;
    }
  }, {
    key: "solved",
    value: function solved(obj) {
      return obj.score > 0;
    }
  }, {
    key: "attempted",
    value: function attempted(obj) {
      return obj.affect || obj.fails > 0;
    }
  }, {
    key: "fails",
    value: function fails(obj) {
      return obj.fails;
    }
  }, {
    key: "eval",
    value: function _eval(verdicts) {
      var res = 0;

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = (0, _getIterator3.default)((0, _keys2.default)(verdicts)), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var key = _step4.value;

          var verdict = verdicts[key];
          if (verdict.verdict === "VERDICT_INQ") {
            return {
              score: 0, affect: false, penalty: 0, fails: 0
            };
          }

          res += verdict.verdict === "VERDICT_AC" ? this.task.getDatasetFromName(key).percentage : 0;
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return {
        score: parseInt(res * this.task.getWeight(), 10), penalty: 0, affect: true, fails: 0
      };
    }
  }, {
    key: "evalContest",
    value: function evalContest(submissions) {
      submissions.sort(submissionComparator);

      var bestIndex = submissions.length;
      var bestScore = 0;

      for (var i = 0; i < submissions.length; i++) {
        var evaluation = this.eval(submissions[i].verdict);
        if (evaluation.affect && evaluation.score > bestScore) {
          bestScore = evaluation.score;
          bestIndex = i;
        }
      }

      var fails = 0;

      for (var _i = 0; _i < bestIndex; _i++) {
        var submission = submissions[_i];

        var _evaluation = this.eval(submission.verdict);
        if (_evaluation.affect) fails++;
      }

      if (bestScore > 0) {
        var _submission = submissions[bestIndex];
        return {
          score: bestScore,
          penalty: _submission.timeInContest,
          affect: true,
          fails: fails
        };
      }

      return {
        score: 0, penalty: 0, affect: false, fails: fails
      };
    }
  }, {
    key: "mergeEvaluations",
    value: function mergeEvaluations(evals) {
      var opts = this.opts;


      return evals.reduce(function (old, cur) {
        return {
          score: old.score + cur.score,
          penalty: !cur.affect ? old.penalty : old.penalty + cur.penalty + cur.fails * (opts.penalty || 1)
        };
      }, { score: 0, penalty: 0 });
    }
  }]);
  return SubtaskSumScoring;
}(Scoring);

var SubtaskMaxScoring = function (_SubtaskSumScoring) {
  (0, _inherits3.default)(SubtaskMaxScoring, _SubtaskSumScoring);

  function SubtaskMaxScoring() {
    (0, _classCallCheck3.default)(this, SubtaskMaxScoring);
    return (0, _possibleConstructorReturn3.default)(this, (SubtaskMaxScoring.__proto__ || (0, _getPrototypeOf2.default)(SubtaskMaxScoring)).apply(this, arguments));
  }

  (0, _createClass3.default)(SubtaskMaxScoring, [{
    key: "mergeEvaluations",
    value: function mergeEvaluations(evals) {
      var opts = this.opts;


      var maxTime = evals.reduce(function (old, cur) {
        return Math.max(old, cur.affect ? cur.penalty : 0);
      }, 0);

      return evals.reduce(function (old, cur) {
        return {
          score: old.score + cur.score,
          penalty: !cur.affect ? old.penalty : old.penalty + cur.fails * (opts.penalty || 1)
        };
      }, { score: 0, penalty: maxTime });
    }
  }]);
  return SubtaskMaxScoring;
}(SubtaskSumScoring);

var IcpcScoring = function (_Scoring3) {
  (0, _inherits3.default)(IcpcScoring, _Scoring3);

  function IcpcScoring() {
    (0, _classCallCheck3.default)(this, IcpcScoring);
    return (0, _possibleConstructorReturn3.default)(this, (IcpcScoring.__proto__ || (0, _getPrototypeOf2.default)(IcpcScoring)).apply(this, arguments));
  }

  (0, _createClass3.default)(IcpcScoring, [{
    key: "isTaskValid",

    // eslint-disable-next-line no-unused-vars
    value: function isTaskValid(tk) {
      return true;
    }
  }, {
    key: "hasWeight",
    value: function hasWeight() {
      return false;
    }
  }, {
    key: "hasPenalty",
    value: function hasPenalty() {
      return true;
    }
  }, {
    key: "solved",
    value: function solved(obj) {
      return obj.score > 0;
    }
  }, {
    key: "attempted",
    value: function attempted(obj) {
      return obj.affect || obj.fails > 0;
    }
  }, {
    key: "fails",
    value: function fails(obj) {
      return obj.fails;
    }
  }, {
    key: "eval",
    value: function _eval(verdicts) {
      var res = 1;
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = (0, _getIterator3.default)((0, _keys2.default)(verdicts)), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var key = _step5.value;

          var verdict = verdicts[key];
          if (verdict.verdict === "VERDICT_INQ") {
            return {
              score: 0, affect: false, penalty: 0, fails: 0
            };
          }

          res *= verdict.verdict === "VERDICT_AC" ? 1 : 0;
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      return {
        score: res, penalty: 0, affect: true, fails: 0
      };
    }
  }, {
    key: "evalContest",
    value: function evalContest(submissions) {
      submissions.sort(submissionComparator);

      var fails = 0;

      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = (0, _getIterator3.default)(submissions), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var submission = _step6.value;

          var evaluation = this.eval(submission.verdict);
          if (evaluation.affect) {
            if (evaluation.score === 0) fails++;else {
              return {
                score: 1,
                penalty: submission.timeInContest,
                affect: true,
                fails: fails
              };
            }
          }
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      return {
        score: 0, penalty: 0, affect: false, fails: fails
      };
    }
  }, {
    key: "mergeEvaluations",
    value: function mergeEvaluations(evals) {
      var opts = this.opts;


      return evals.reduce(function (old, cur) {
        return {
          score: old.score + cur.score,
          penalty: !cur.affect ? old.penalty : old.penalty + cur.penalty + cur.fails * (opts.penalty || 20)
        };
      }, { score: 0, penalty: 0 });
    }
  }]);
  return IcpcScoring;
}(Scoring);

module.exports = {
  _Scoring: Scoring,
  ProductScoring: ProductScoring,
  IcpcScoring: IcpcScoring,
  SubtaskMaxScoring: SubtaskMaxScoring,
  SubtaskSumScoring: SubtaskSumScoring,
  // Maintaining backward-compatibility
  SubtaskScoring: SubtaskMaxScoring
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _getIterator2 = __webpack_require__(0);

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by rsalesc on 15/07/16.
 */

var path = __webpack_require__(1);
var mongoose = __webpack_require__(4);
var Schema = mongoose.Schema;

// TODO: add creation time (with a plugin)
module.exports = function () {
    if (db.models.Problem) return db.model('Problem');

    var ProblemSchema = new Schema({
        code: {
            type: String,
            minlength: 4,
            maxlength: 24,
            match: /[a-zA-Z][a-zA-Z0-9\-]*/,
            required: true
        },
        name: {
            type: String,
            minlength: 4,
            maxlength: 64,
            required: true
        },
        statementFid: String,
        fid: String,
        attr: Schema.Types.Mixed
    }, { timestamps: true });

    ProblemSchema.index({ code: 1 }, { unique: 1 });
    ProblemSchema.index({ name: 1 });
    ProblemSchema.index({ code: 'text', name: 'text' });

    ProblemSchema.pre("remove", function (next) {
        var _this = this;

        db.model("Submission").remove({ problem: this._id }, function (err) {
            if (err) console.error(err);
        });
        var contestQuery = {
            problems: {
                $elemMatch: {
                    problem: this._id
                }
            }
        };

        db.model("Contest").find(contestQuery, function (err, contests) {
            if (err) return console.error(err);

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(contests), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var contest = _step.value;

                    contest.problems = contest.problems.filter(function (problem) {
                        return !_this._id.equals(problem.problem);
                    });
                    contest.save(function (err) {
                        if (err) console.error(err);
                    });
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        });
        next();
    });

    return db.model('Problem', ProblemSchema);
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(28);


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _regenerator = __webpack_require__(5);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = __webpack_require__(6);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = __webpack_require__(9);

var _promise2 = _interopRequireDefault(_promise);

var startWatching = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(env) {
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return env.queue.clean();

          case 3:
            _context4.next = 9;
            break;

          case 5:
            _context4.prev = 5;
            _context4.t0 = _context4["catch"](0);

            console.log("error cleaning up the message queue");
            throw _context4.t0;

          case 9:
            if (false) {
              _context4.next = 21;
              break;
            }

            console.log("[judge] watching for new submissions");

          case 11:
            _context4.next = 13;
            return watch(env);

          case 13:
            _context4.t1 = _context4.sent;

            if (!(_context4.t1 === null)) {
              _context4.next = 19;
              break;
            }

            _context4.next = 17;
            return sleepAsync(POLLING_RATE);

          case 17:
            _context4.next = 11;
            break;

          case 19:
            _context4.next = 9;
            break;

          case 21:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this, [[0, 5]]);
  }));

  return function startWatching(_x3) {
    return _ref4.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = __webpack_require__(1);
var mongodb = __webpack_require__(29);
var logger = __webpack_require__(7);
var environment = __webpack_require__(16);
var db = __webpack_require__(22);
var grader = __webpack_require__(33);

var _require = __webpack_require__(51),
    Submission = _require.Submission;

var JudgeEnvironment = environment.JudgeEnvironment,
    JudgeConfig = environment.JudgeConfig;

var POLLING_RATE = 1000;

function sleepAsync(ms) {
  return new _promise2.default(function (resolve) {
    setTimeout(resolve, ms);
  });
}

function watch(env) {
  var _this = this;

  return new _promise2.default(function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(resolve) {
      var msg, req, ack, processMessage, writeStream;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              // dbg
              // console.log(await(env.queue.size()));

              msg = null;
              _context3.prev = 1;
              _context3.next = 4;
              return env.queue.get({ visibility: JudgeConfig.VISIBILITY_WINDOW });

            case 4:
              msg = _context3.sent;
              _context3.next = 11;
              break;

            case 7:
              _context3.prev = 7;
              _context3.t0 = _context3["catch"](1);

              console.log(_context3.t0);
              return _context3.abrupt("return", resolve(null));

            case 11:
              if (msg) {
                _context3.next = 13;
                break;
              }

              return _context3.abrupt("return", resolve(null));

            case 13:
              req = msg.payload;

              ack = function () {
                var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                  return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.prev = 0;
                          _context.next = 3;
                          return env.queue.ackById(new mongodb.ObjectID(msg.id));

                        case 3:
                          resolve(true);
                          _context.next = 10;
                          break;

                        case 6:
                          _context.prev = 6;
                          _context.t0 = _context["catch"](0);

                          console.log(_context.t0);
                          resolve(false);

                        case 10:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee, _this, [[0, 6]]);
                }));

                return function ack() {
                  return _ref2.apply(this, arguments);
                };
              }();

              if (!(msg.tries > JudgeConfig.MAX_TRIES)) {
                _context3.next = 17;
                break;
              }

              return _context3.abrupt("return", ack());

            case 17:

              env.ack = msg.ack;

              processMessage = function () {
                var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(err) {
                  var packPath, verdict;
                  return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          if (!err) {
                            _context2.next = 4;
                            break;
                          }

                          logger.error("error processing message %s", msg.id);
                          console.error(err);
                          return _context2.abrupt("return", resolve(false));

                        case 4:
                          _context2.prev = 4;
                          packPath = env.cache.getFilePath(req.fid.toString());
                          _context2.next = 8;
                          return grader.testPackage(env, packPath, req.code, req.lang);

                        case 8:
                          verdict = _context2.sent;


                          console.log(verdict);
                          Submission.findById(req.subid).exec(function (err2, sub) {
                            if (err2) {
                              logger.error("submission id %s not found", req.subid);
                              return resolve(false);
                            }
                            if (!sub) return ack();

                            sub.verdict = verdict;
                            return sub.save(function (err3) {
                              if (err3) {
                                logger.error("submission could not be saved");
                                console.error(err3);
                                return resolve(false);
                              }

                              logger.debug("verdict committed");
                              return ack();
                            });
                          });
                          _context2.next = 18;
                          break;

                        case 13:
                          _context2.prev = 13;
                          _context2.t0 = _context2["catch"](4);

                          logger.error("error testing package %s", req.id);
                          console.error(_context2.t0);
                          return _context2.abrupt("return", resolve(false));

                        case 18:
                          return _context2.abrupt("return", null);

                        case 19:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2, _this, [[4, 13]]);
                }));

                return function processMessage(_x2) {
                  return _ref3.apply(this, arguments);
                };
              }();

              if (!env.cache.exists(req.fid.toString())) {
                writeStream = env.cache.addFromStream(req.fid.toString(), processMessage);

                env.seaweed.read(req.fid, writeStream);
              } else processMessage();

              return _context3.abrupt("return", null);

            case 21:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, _this, [[1, 7]]);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
}

var seaweed = weedClient;

// TODO: dispose after interruption
startWatching(new JudgeEnvironment(db, seaweed));

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = require("mongodb");

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = require("winston");

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = require("tmp");

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = require("jude-seaweedfs");

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

var _getIterator2 = __webpack_require__(0);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _slicedToArray2 = __webpack_require__(10);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _promise = __webpack_require__(9);

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = __webpack_require__(5);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = __webpack_require__(6);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var evaluate = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(iso, store, command, input) {
    var output = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "output";
    var error = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "error";
    var res;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (input) iso.stdin = input;
            iso.stdout = output;
            iso.stderr = error;

            // remove stdout and stderr, only for dbg
            _context.next = 5;
            return iso.execute(command);

          case 5:
            res = _context.sent;
            return _context.abrupt("return", res);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function evaluate(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

/**
*   Compile the solution
*   @param {JudgeEnvironment}
*   @param {Storage}
*   @param {string} solution language
*   @param {string} path of the solution code in the storage
*   @param {string} path of the resulting executable file in the storage
*   @retuns {Object} compilation output/verdict (Isolate.execute() result
*     + Isolate.getLog() result)
 */
var compilationStepAsync = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(env, store, lang) {
    var sol = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : SOURCE_PATH;
    var solExec = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : SOURCE_EXEC_PATH;
    var iso, result;
    return _regenerator2.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            iso = new Isolate(env, store);
            _context12.prev = 1;
            _context12.next = 4;
            return iso.init();

          case 4:
            _context12.next = 6;
            return Compilation[lang](iso, store, sol, solExec);

          case 6:
            result = _context12.sent;
            _context12.next = 9;
            return iso.getLog();

          case 9:
            result.log = _context12.sent;
            _context12.prev = 10;
            _context12.next = 13;
            return iso.cleanup();

          case 13:
            _context12.next = 18;
            break;

          case 15:
            _context12.prev = 15;
            _context12.t0 = _context12["catch"](10);

            console.error(_context12.t0);

          case 18:
            return _context12.abrupt("return", result);

          case 21:
            _context12.prev = 21;
            _context12.t1 = _context12["catch"](1);

            logger.error("compilation step failed - %s", _context12.t1.toString());
            _context12.prev = 24;
            _context12.next = 27;
            return iso.cleanup();

          case 27:
            _context12.next = 32;
            break;

          case 29:
            _context12.prev = 29;
            _context12.t2 = _context12["catch"](24);

            console.error(_context12.t2);

          case 32:
            throw { code: 2 };

          case 33:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, this, [[1, 21], [10, 15], [24, 29]]);
  }));

  return function compilationStepAsync(_x37, _x38, _x39) {
    return _ref2.apply(this, arguments);
  };
}();

/*
*   Promisified testCase
 */
// eslint-disable-next-line require-await


var testCaseAsync = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(env, store, iso, task, lang, dataset, testcase) {
    var _this11 = this;

    return _regenerator2.default.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            return _context14.abrupt("return", new _promise2.default(function () {
              var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(resolve) {
                var timelimit, memorylimit, evaluationResult, checkingResult, execTime, exitWith, execLog, dummy, exitStatus, exitCode, output, _dummy, _exitStatus, _exitCode;

                return _regenerator2.default.wrap(function _callee13$(_context13) {
                  while (1) {
                    switch (_context13.prev = _context13.next) {
                      case 0:
                        logger.debug("running on testcase " + testcase.in);

                        // to seconds
                        timelimit = task.getTimelimit();

                        // to KB

                        memorylimit = task.getMemorylimit() * 1024;
                        evaluationResult = {};
                        checkingResult = {};
                        execTime = void 0;

                        exitWith = function exitWith(v) {
                          return resolve(v);
                        };

                        execLog = {};
                        // grading step

                        _context13.prev = 8;
                        _context13.next = 11;
                        return iso.init();

                      case 11:
                        _context13.next = 13;
                        return Evaluation[lang](iso, store, SOURCE_EXEC_PATH, testcase.in, timelimit, timelimit * JudgeConfig.WT_MULTIPLIER, memorylimit);

                      case 13:
                        evaluationResult = _context13.sent;
                        _context13.next = 16;
                        return iso.getLog();

                      case 16:
                        evaluationResult.log = _context13.sent;

                        execLog = evaluationResult.log;

                        // sandbox crashed

                        if (Isolate.translateBoxExitCode(evaluationResult.code)) {
                          _context13.next = 22;
                          break;
                        }

                        console.log("sandbox crashed in evaluation step");
                        console.log(evaluationResult);
                        return _context13.abrupt("return", exitWith(new Verdict(0, "VERDICT_JE")));

                      case 22:
                        dummy = new Isolate(env, store, evaluationResult.log);

                        execTime = dummy.getRunningTime();

                        // execution failed, do something and return

                        if (!(evaluationResult.code === 1)) {
                          _context13.next = 38;
                          break;
                        }

                        exitStatus = dummy.getExitStatus();
                        exitCode = dummy.getExitCode();

                        if (!(exitStatus === IsolateConst.EXIT_TIMEOUT)) {
                          _context13.next = 31;
                          break;
                        }

                        return _context13.abrupt("return", exitWith(new Verdict(0, "VERDICT_TLE", -1, { time: timelimit })));

                      case 31:
                        if (!(exitStatus === IsolateConst.EXIT_TIMEOUT_WALL)) {
                          _context13.next = 35;
                          break;
                        }

                        return _context13.abrupt("return", exitWith(new Verdict(0, "VERDICT_WTE", -1, { time: execTime })));

                      case 35:
                        if (!(exitStatus === IsolateConst.EXIT_OUTPUT_LIMIT)) {
                          _context13.next = 37;
                          break;
                        }

                        return _context13.abrupt("return", exitWith(new Verdict(0, "VERDICT_OLE", -1, { time: execTime })));

                      case 37:
                        return _context13.abrupt("return", exitWith(new Verdict(0, "VERDICT_RTE", -1, {
                          text: "exited with code " + exitCode,
                          time: execTime
                        })));

                      case 38:
                        _context13.next = 44;
                        break;

                      case 40:
                        _context13.prev = 40;
                        _context13.t0 = _context13["catch"](8);

                        logger.error("execution step failed - %s", _context13.t0.toString());
                        return _context13.abrupt("return", exitWith(new Verdict(0, "VERDICT_JE")));

                      case 44:
                        _context13.prev = 44;
                        _context13.next = 47;
                        return iso.createFileFromStorage("input", testcase.in);

                      case 47:
                        _context13.next = 49;
                        return iso.createFileFromStorage("answer", testcase.out);

                      case 49:
                        _context13.next = 51;
                        return Checking[task.getCheckerLanguage()](iso, store, CHECKER_EXEC_PATH);

                      case 51:
                        checkingResult = _context13.sent;
                        _context13.next = 54;
                        return iso.getLog();

                      case 54:
                        checkingResult.log = _context13.sent;

                        if (Isolate.translateBoxExitCode(checkingResult.code)) {
                          _context13.next = 59;
                          break;
                        }

                        console.log("error in checking step right after grading");
                        console.log(checkingResult);
                        return _context13.abrupt("return", exitWith(new Verdict(0, "VERDICT_JE")));

                      case 59:

                        iso.log = execLog;
                        output = checkingResult.stderr;

                        if (!(checkingResult.code === 1)) {
                          _context13.next = 70;
                          break;
                        }

                        _dummy = new Isolate(env, store, checkingResult.log);
                        _exitStatus = _dummy.getExitStatus();
                        _exitCode = _dummy.getExitCode();

                        if (!(_exitStatus === IsolateConst.EXIT_TIMEOUT || _exitStatus === IsolateConst.EXIT_TIMEOUT_WALL)) {
                          _context13.next = 67;
                          break;
                        }

                        return _context13.abrupt("return", exitWith(new Verdict(0, "VERDICT_CHTE")));

                      case 67:
                        if (!(_exitCode === 1 || _exitCode === 2)) {
                          _context13.next = 69;
                          break;
                        }

                        return _context13.abrupt("return", exitWith(new Verdict(0, "VERDICT_WA", 0, { text: output, time: execTime })));

                      case 69:
                        return _context13.abrupt("return", exitWith(new Verdict(0, "VERDICT_FAIL", 0, { text: output, time: execTime })));

                      case 70:
                        return _context13.abrupt("return", exitWith(new Verdict(1, "VERDICT_AC", 0, { text: output, time: execTime })));

                      case 73:
                        _context13.prev = 73;
                        _context13.t1 = _context13["catch"](44);

                        logger.error("checker step failed - %s", _context13.t1.toString());
                        console.log(_context13.t1);
                        return _context13.abrupt("return", exitWith(new Verdict(0, "VERDICT_JE")));

                      case 78:
                      case "end":
                        return _context13.stop();
                    }
                  }
                }, _callee13, _this11, [[8, 40], [44, 73]]);
              }));

              return function (_x49) {
                return _ref4.apply(this, arguments);
              };
            }()));

          case 1:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, this);
  }));

  return function testCaseAsync(_x42, _x43, _x44, _x45, _x46, _x47, _x48) {
    return _ref3.apply(this, arguments);
  };
}();

/**
*   Test to-be-executed solution against testcases of the given dataset
*   Files expected to be created beforehand are: _/checker_exec, _/sol_exec
*   @param {JudgeEnvironment}
*   @param {Storage}
*   @param {Task}   task
*   @param {string} language of the to-be-executed solution
*   @param {Object} dataset
 */


var testDataset = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16(env, store, task, lang, dataset) {
    var _this12 = this;

    var execTime, n, totalTime, wallTime, i, cases, boxes, j, iso, res, _j, status, caseResult;

    return _regenerator2.default.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            execTime = -1;
            _context16.prev = 1;
            n = dataset.testcases.length;
            totalTime = 0;
            wallTime = 0;
            i = 0;

          case 6:
            if (!(i < n)) {
              _context16.next = 35;
              break;
            }

            cases = [];
            boxes = [];

            for (j = 0; j < JudgeConfig.MAX_SIMUL_TESTS && i + j < n; j++) {
              iso = new Isolate(env, store);

              boxes.push(iso);
              cases.push(testCaseAsync(env, store, iso, task, lang, dataset, dataset.testcases[i + j]));
            }

            // eslint-disable-next-line no-await-in-loop
            _context16.next = 12;
            return _promise2.default.all(cases.map(promiseReflect));

          case 12:
            res = _context16.sent;

            env.pingCurrent().then(function () {
              return null;
            }).catch(console.error);

            _j = 0;

          case 15:
            if (!(_j < JudgeConfig.MAX_SIMUL_TESTS && i + _j < n)) {
              _context16.next = 30;
              break;
            }

            status = res[_j].status;

            if (!(status === "rejected")) {
              _context16.next = 19;
              break;
            }

            throw res[_j].error;

          case 19:
            caseResult = res[_j].data;

            totalTime += boxes[_j].getRunningTime();
            wallTime += boxes[_j].getWallTime();
            if (caseResult.info.hasOwnProperty("time")) execTime = Math.max(execTime, caseResult.info.time);

            if (!(caseResult.verdict !== "VERDICT_AC")) {
              _context16.next = 27;
              break;
            }

            caseResult.passed = i + _j;
            if (execTime >= 0) caseResult.info.time = execTime;
            return _context16.abrupt("return", caseResult);

          case 27:
            _j++;
            _context16.next = 15;
            break;

          case 30:
            _context16.next = 32;
            return _promise2.default.all(boxes.map(function () {
              var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15(box) {
                return _regenerator2.default.wrap(function _callee15$(_context15) {
                  while (1) {
                    switch (_context15.prev = _context15.next) {
                      case 0:
                        return _context15.abrupt("return", box.cleanup());

                      case 1:
                      case "end":
                        return _context15.stop();
                    }
                  }
                }, _callee15, _this12);
              }));

              return function (_x55) {
                return _ref6.apply(this, arguments);
              };
            }()));

          case 32:
            i += JudgeConfig.MAX_SIMUL_TESTS;
            _context16.next = 6;
            break;

          case 35:

            console.log("rt", totalTime);
            console.log("wt", wallTime);
            _context16.next = 43;
            break;

          case 39:
            _context16.prev = 39;
            _context16.t0 = _context16["catch"](1);

            logger.error("dataset test failed - %s", _context16.t0.toString());
            return _context16.abrupt("return", new Verdict(0, "VERDICT_JE"));

          case 43:
            return _context16.abrupt("return", new Verdict(1, "VERDICT_AC", dataset.testcases.length, { time: execTime }));

          case 44:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, this, [[1, 39]]);
  }));

  return function testDataset(_x50, _x51, _x52, _x53, _x54) {
    return _ref5.apply(this, arguments);
  };
}();

/**
*   Test code against testcases of the given task, in the given language.
*   Created files in storage are: _/checker_exec, _/sol_exec
*
*   @param {JudgeEnvironment}
*   @param {Task}
*   @param {Storage}
*   @param {string} the submitted code
*   @param {string} language of the submitted code
*   @returns {Verdict} evalution output/verdict
 */


var testTask = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17(env, task, store, code, lang) {
    var _ref8, _ref9, compilationResult, checkerCompilationResult, dummy, exitStatus, output, _dummy2, _exitStatus2, exitCode, _output, verdicts, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, dataset, datasetVerdict;

    return _regenerator2.default.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.next = 2;
            return store.createFileFromContent(SOURCE_PATH, code);

          case 2:
            _context17.next = 4;
            return _promise2.default.all([compilationStepAsync(env, store, lang), compilationStepAsync(env, store, task.getCheckerLanguage(), task.getChecker(), CHECKER_EXEC_PATH)]);

          case 4:
            _ref8 = _context17.sent;
            _ref9 = (0, _slicedToArray3.default)(_ref8, 2);
            compilationResult = _ref9[0];
            checkerCompilationResult = _ref9[1];

            if (Isolate.translateBoxExitCode(compilationResult.code)) {
              _context17.next = 12;
              break;
            }

            console.log("sandbox crashed in compilation step");
            console.log(compilationResult);
            return _context17.abrupt("return", utils.fillUpTo([new Verdict(0, "VERDICT_JE")], task.getDatasetsCount()));

          case 12:
            if (!(compilationResult.code === 1)) {
              _context17.next = 19;
              break;
            }

            dummy = new Isolate(env, null, compilationResult.log);
            exitStatus = dummy.getExitStatus();
            output = compilationResult.stderr;

            if (!(exitStatus === IsolateConst.EXIT_TIMEOUT || exitStatus === IsolateConst.EXIT_TIMEOUT_WALL)) {
              _context17.next = 18;
              break;
            }

            return _context17.abrupt("return", utils.fillUpTo([new Verdict(0, "VERDICT_CTE")], task.getDatasetsCount()));

          case 18:
            return _context17.abrupt("return", utils.fillUpTo([new Verdict(0, "VERDICT_CE", -1, output)], task.getDatasetsCount()));

          case 19:
            if (Isolate.translateBoxExitCode(checkerCompilationResult.code)) {
              _context17.next = 23;
              break;
            }

            console.log("sandbox crashed in checker compilation step");
            console.log(checkerCompilationResult);
            return _context17.abrupt("return", utils.fillUpTo([new Verdict(0, "VERDICT_JE")], task.getDatasetsCount()));

          case 23:
            if (!(checkerCompilationResult.code === 1)) {
              _context17.next = 30;
              break;
            }

            _dummy2 = new Isolate(env, null, compilationResult.log);
            _exitStatus2 = _dummy2.getExitStatus();
            exitCode = _dummy2.getExitCode();
            _output = compilationResult.stderr;


            logger.error("checker compilation failed with error %s (%d):\n%s", _exitStatus2, exitCode, _output);

            return _context17.abrupt("return", utils.fillUpTo([new Verdict(0, "VERDICT_JE")], task.getDatasetsCount()));

          case 30:

            // now run solution against each of the datasets in ladder fashion
            verdicts = [];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context17.prev = 34;
            _iterator = (0, _getIterator3.default)(task.getDatasets());

          case 36:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context17.next = 47;
              break;
            }

            dataset = _step.value;
            _context17.next = 40;
            return testDataset(env, store, task, lang, dataset);

          case 40:
            datasetVerdict = _context17.sent;

            verdicts.push(datasetVerdict);

            // if it was not accepted, break here (ladder effect)

            if (!(datasetVerdict.verdict !== "VERDICT_AC")) {
              _context17.next = 44;
              break;
            }

            return _context17.abrupt("break", 47);

          case 44:
            _iteratorNormalCompletion = true;
            _context17.next = 36;
            break;

          case 47:
            _context17.next = 53;
            break;

          case 49:
            _context17.prev = 49;
            _context17.t0 = _context17["catch"](34);
            _didIteratorError = true;
            _iteratorError = _context17.t0;

          case 53:
            _context17.prev = 53;
            _context17.prev = 54;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 56:
            _context17.prev = 56;

            if (!_didIteratorError) {
              _context17.next = 59;
              break;
            }

            throw _iteratorError;

          case 59:
            return _context17.finish(56);

          case 60:
            return _context17.finish(53);

          case 61:

            // push skip verdict to enforce ladder effect
            verdicts.push(new Verdict(0, "VERDICT_SKIP"));
            return _context17.abrupt("return", utils.fillUpTo(verdicts, task.getDatasetsCount()));

          case 63:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17, this, [[34, 49, 53, 61], [54,, 56, 60]]);
  }));

  return function testTask(_x56, _x57, _x58, _x59, _x60) {
    return _ref7.apply(this, arguments);
  };
}();

/**
 * Test solution against package test cases
 * @param env
 * @param pack
 * @param code
 * @param lang
 */


var testPackage = function () {
  var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18(env, pack, code, lang) {
    var store, Loader, task, datasets, verdicts, res, i;
    return _regenerator2.default.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            store = new Storage();
            _context18.next = 3;
            return store.loadZip(pack);

          case 3:
            _context18.next = 5;
            return loader.autoDetect(store);

          case 5:
            Loader = _context18.sent;

            if (!(Loader === null)) {
              _context18.next = 8;
              break;
            }

            throw new Error("Package is not loadable");

          case 8:
            _context18.next = 10;
            return new Loader(store).load();

          case 10:
            task = _context18.sent;
            datasets = task.getDatasets();
            _context18.next = 14;
            return testTask(env, task, store, code, lang);

          case 14:
            verdicts = _context18.sent;
            res = {};

            for (i = 0; i < datasets.length; i++) {
              res[datasets[i].name] = verdicts[i];
            }return _context18.abrupt("return", res);

          case 18:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18, this);
  }));

  return function testPackage(_x61, _x62, _x63, _x64) {
    return _ref10.apply(this, arguments);
  };
}();

// testing


function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by rsalesc on 24/06/16.
 */

// eslint-disable-next-line no-unused-vars
var fs = __webpack_require__(17);
var path = __webpack_require__(1);
var promiseReflect = __webpack_require__(34);

var verdict = __webpack_require__(35);
var utils = __webpack_require__(12);
var logger = __webpack_require__(7);
var sandbox = __webpack_require__(39);
var environment = __webpack_require__(16);

var loader = __webpack_require__(46);
var Profiler = __webpack_require__(50);

var Storage = __webpack_require__(24).MemoryStorage;

var Verdict = verdict.Verdict;
var Isolate = sandbox.Isolate,
    IsolateConst = sandbox.IsolateConst;
var JudgeEnvironment = environment.JudgeEnvironment,
    JudgeConfig = environment.JudgeConfig;
var JudeLoader = loader.JudeLoader;


var policyPath = "/etc/java-sandbox/security.policy";
var javaExecutorPath = "/etc/java-sandbox/executor.jar";

var Evaluation = {
  CPP: function CPP(iso, store, execPath, test) {
    var timelimit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var wtlimit = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    var memorylimit = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
    var input = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : "input";

    var _this = this;

    var output = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : "output";
    var error = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : "error";
    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      var res;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              iso.timelimit = timelimit;
              iso.wallclockLimit = wtlimit;
              iso.memorySize = memorylimit;
              _context2.next = 5;
              return iso.createFileFromStorage(input, test);

            case 5:
              _context2.next = 7;
              return iso.createFileFromStorage("eval", execPath, true);

            case 7:
              _context2.next = 9;
              return evaluate(iso, store, ["./eval"], input, output, error);

            case 9:
              res = _context2.sent;
              _context2.next = 12;
              return iso.removeFile("eval");

            case 12:
              _context2.next = 14;
              return iso.removeFile(input);

            case 14:
              return _context2.abrupt("return", res);

            case 15:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, _this);
    }))();
  },
  Py2: function Py2(iso, store, execPath, test) {
    var timelimit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var wtlimit = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    var memorylimit = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
    var input = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : "input";

    var _this2 = this;

    var output = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : "output";
    var error = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : "error";
    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
      var res;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              iso.timelimit = timelimit;
              iso.wallclockLimit = wtlimit;
              iso.memorySize = memorylimit;
              iso.setEnv.HOME = "./";
              iso.dirs.push({ in: "/usr" });
              iso.dirs.push({ in: "/etc" });
              _context3.next = 8;
              return iso.createFileFromStorage(input, test);

            case 8:
              _context3.next = 10;
              return iso.createFileFromStorage("sol.pyc", "sol.pyc", true);

            case 10:
              _context3.next = 12;
              return evaluate(iso, store, ["/usr/bin/python2", "sol.pyc"], input, output, error);

            case 12:
              res = _context3.sent;

              iso.dirs.pop();
              iso.dirs.pop();

              _context3.next = 17;
              return iso.removeFile("sol.pyc");

            case 17:
              _context3.next = 19;
              return iso.removeFile(input);

            case 19:
              return _context3.abrupt("return", res);

            case 20:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, _this2);
    }))();
  },
  Py3: function Py3(iso, store, execPath, test) {
    var timelimit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var wtlimit = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    var memorylimit = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
    var input = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : "input";

    var _this3 = this;

    var output = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : "output";
    var error = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : "error";
    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
      var res;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              iso.timelimit = timelimit;
              iso.wallclockLimit = wtlimit;
              iso.memorySize = memorylimit;
              iso.setEnv.HOME = "./";
              iso.dirs.push({ in: "/usr" });
              iso.dirs.push({ in: "/etc" });
              _context4.next = 8;
              return iso.createFileFromStorage(input, test);

            case 8:
              _context4.next = 10;
              return iso.createFileFromStorage("sol.pyc", "sol.pyc", true);

            case 10:
              _context4.next = 12;
              return evaluate(iso, store, ["/usr/bin/python3", "sol.pyc"], input, output, error);

            case 12:
              res = _context4.sent;

              iso.dirs.pop();
              iso.dirs.pop();

              _context4.next = 17;
              return iso.removeFile("sol.pyc");

            case 17:
              _context4.next = 19;
              return iso.removeFile(input);

            case 19:
              return _context4.abrupt("return", res);

            case 20:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, _this3);
    }))();
  },
  Java: function Java(iso, store, execPath, test) {
    var timelimit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var wtlimit = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    var memorylimit = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
    var input = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : "input";

    var _this4 = this;

    var output = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : "output";
    var error = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : "error";
    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
      var oldProc, oldEnv, oldCgTiming, oldCgMemory, oldCg, command, res;
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              oldProc = iso.maxProcesses;
              oldEnv = iso.setEnv;
              oldCgTiming = iso.cgTiming;
              oldCgMemory = iso.cgMemorySize;
              oldCg = iso.cgroup;


              iso.setEnv.MALLOC_ARENA_MAX = "1";
              iso.maxProcesses = null;
              iso.timelimit = timelimit;
              iso.wallclockLimit = wtlimit;
              iso.dirs.push({ in: "/etc" });
              iso.dirs.push({ in: "/usr/lib/jvm" });
              iso.memorySize = 1300 * 1024 + memorylimit;
              iso.cgMemorySize = iso.memorySize;
              iso.cgTiming = true;
              iso.cgroup = true;

              _context5.next = 17;
              return iso.createFileFromStorage(input, test);

            case 17:
              _context5.next = 19;
              return iso.globFromStorage("*.class", path.basename);

            case 19:
              command = ["/usr/bin/java", "-client", "-javaagent:" + javaExecutorPath + "=policy:" + policyPath, "-Xss128m", "-Xmx" + (memorylimit / 1024 | 0) + "m", "-XX:MaxMetaspaceSize=256m", "-XX:CompressedClassSpaceSize=64m", "-XX:ErrorFile=submission_jvm_crash.log", "Main"];

              // console.log(iso.getRunArgs());

              _context5.next = 22;
              return evaluate(iso, store, command, input, output, error);

            case 22:
              res = _context5.sent;
              _context5.next = 25;
              return iso.fileExists("submission_jvm_crash.log");

            case 25:
              if (!_context5.sent) {
                _context5.next = 27;
                break;
              }

              throw new Error("JVM somehow crashed");

            case 27:
              _context5.next = 29;
              return iso.removeFile(input);

            case 29:
              iso.dirs.pop();
              iso.dirs.pop();
              iso.setEnv = oldEnv;
              iso.maxProcesses = oldProc;
              iso.cgTiming = oldCgTiming;
              iso.cgMemorySize = oldCgMemory;
              iso.cgroup = oldCg;

              return _context5.abrupt("return", res);

            case 37:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, _this4);
    }))();
  }
};
Evaluation.C = Evaluation.CPP;

var Checking = {
  CPP: function CPP(iso, store, execPath) {
    var input = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "input";
    var output = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "output";
    var answer = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "answer";
    var checkerInput = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;

    var _this5 = this;

    var checkerOutput = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : "checker_output";
    var checkerError = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : "checker_error";
    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
      var res;
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              iso.timelimit = JudgeConfig.CHECKING_TL;
              iso.wallclockLimit = JudgeConfig.CHECKING_WTL;
              iso.memorySize = JudgeConfig.CHECKING_ML * 1024;

              _context6.next = 5;
              return iso.createFileFromStorage("eval", execPath, true);

            case 5:
              _context6.next = 7;
              return evaluate(iso, store, ["./eval", input, output, answer], checkerInput, checkerOutput, checkerError);

            case 7:
              res = _context6.sent;
              _context6.next = 10;
              return iso.removeFile("eval");

            case 10:
              _context6.next = 12;
              return iso.removeFile(input);

            case 12:
              _context6.next = 14;
              return iso.getFileToString(checkerOutput);

            case 14:
              res.stdout = _context6.sent;
              _context6.next = 17;
              return iso.getFileToString(checkerError);

            case 17:
              res.stderr = _context6.sent;
              return _context6.abrupt("return", res);

            case 19:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, _this5);
    }))();
  }
};
Checking.C = Checking.CPP;

var Compilation = {
  CPP: function CPP(iso, store, file, execPath) {
    var _this6 = this;

    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
      var sourceFile, oldEnv, oldProc, oldTL, oldWTL, res;
      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              sourceFile = "source.cpp";
              _context7.next = 3;
              return iso.createFileFromStorage(sourceFile, file);

            case 3:
              oldEnv = iso.preserveEnv;
              oldProc = iso.maxProcesses;
              oldTL = iso.timelimit;
              oldWTL = iso.wallclockLimit;

              iso.preserveEnv = true;
              iso.maxProcesses = null;
              iso.dirs.push({ in: "/etc" });
              iso.timelimit = JudgeConfig.COMPILATION_TL;
              iso.wallclockLimit = JudgeConfig.COMPILATION_TL;

              _context7.next = 14;
              return evaluate(iso, store, ["/usr/bin/g++", "-lm", "-std=c++11", sourceFile, "-O2"]);

            case 14:
              res = _context7.sent;


              iso.maxProcesses = oldProc;
              iso.preserveEnv = oldEnv;
              iso.timelimit = oldTL;
              iso.wallclockLimit = oldWTL;
              iso.dirs.pop();

              _context7.next = 22;
              return iso.removeFile(sourceFile);

            case 22:
              if (!(res.code === 0 && execPath)) {
                _context7.next = 27;
                break;
              }

              _context7.next = 25;
              return iso.getFileToStorage("a.out", execPath);

            case 25:
              _context7.next = 27;
              return iso.removeFile("a.out");

            case 27:
              _context7.next = 29;
              return iso.getFileToString("output");

            case 29:
              res.stdout = _context7.sent;
              _context7.next = 32;
              return iso.getFileToString("error");

            case 32:
              res.stderr = _context7.sent;
              _context7.next = 35;
              return iso.removeFile("output");

            case 35:
              _context7.next = 37;
              return iso.removeFile("error");

            case 37:
              return _context7.abrupt("return", res);

            case 38:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, _this6);
    }))();
  },
  C: function C(iso, store, file, execPath) {
    var _this7 = this;

    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
      var sourceFile, oldEnv, oldProc, oldTL, oldWTL, res;
      return _regenerator2.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              sourceFile = "source.c";
              _context8.next = 3;
              return iso.createFileFromStorage(sourceFile, file);

            case 3:
              oldEnv = iso.preserveEnv;
              oldProc = iso.maxProcesses;
              oldTL = iso.timelimit;
              oldWTL = iso.wallclockLimit;

              iso.preserveEnv = true;
              iso.maxProcesses = null;
              iso.dirs.push({ in: "/etc" });
              iso.timelimit = JudgeConfig.COMPILATION_TL;
              iso.wallclockLimit = JudgeConfig.COMPILATION_TL;

              _context8.next = 14;
              return evaluate(iso, store, ["/usr/bin/gcc", "-lm", "-std=c11", sourceFile, "-O2"]);

            case 14:
              res = _context8.sent;


              iso.maxProcesses = oldProc;
              iso.preserveEnv = oldEnv;
              iso.timelimit = oldTL;
              iso.wallclockLimit = oldWTL;
              iso.dirs.pop();

              _context8.next = 22;
              return iso.removeFile(sourceFile);

            case 22:
              if (!(res.code === 0 && execPath)) {
                _context8.next = 27;
                break;
              }

              _context8.next = 25;
              return iso.getFileToStorage("a.out", execPath);

            case 25:
              _context8.next = 27;
              return iso.removeFile("a.out");

            case 27:
              _context8.next = 29;
              return iso.getFileToString("output");

            case 29:
              res.stdout = _context8.sent;
              _context8.next = 32;
              return iso.removeFile("output");

            case 32:
              return _context8.abrupt("return", res);

            case 33:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, _this7);
    }))();
  },
  Java: function Java(iso, store, file) {
    var _this8 = this;

    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
      var sourceFile, oldEnv, oldProc, oldTL, oldWTL, res;
      return _regenerator2.default.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              sourceFile = "Main.java";
              _context9.next = 3;
              return iso.createFileFromStorage(sourceFile, file);

            case 3:
              oldEnv = iso.preserveEnv;
              oldProc = iso.maxProcesses;
              oldTL = iso.timelimit;
              oldWTL = iso.wallclockLimit;

              iso.preserveEnv = true;
              iso.maxProcesses = null;
              iso.dirs.push({ in: "/etc" });
              iso.dirs.push({ in: "/usr/lib/jvm" });
              iso.timelimit = JudgeConfig.COMPILATION_TL;
              iso.wallclockLimit = JudgeConfig.COMPILATION_TL;

              _context9.next = 15;
              return evaluate(iso, store, ["/usr/bin/javac", "-Xlint", "-encoding", "UTF-8", sourceFile]);

            case 15:
              res = _context9.sent;


              iso.maxProcesses = oldProc;
              iso.preserveEnv = oldEnv;
              iso.timelimit = oldTL;
              iso.wallclockLimit = oldWTL;
              iso.dirs.pop();
              iso.dirs.pop();

              _context9.next = 24;
              return iso.removeFile(sourceFile);

            case 24:
              if (!(res.code === 0)) {
                _context9.next = 27;
                break;
              }

              _context9.next = 27;
              return iso.globToStorage("*.class", path.basename);

            case 27:
              _context9.next = 29;
              return iso.getFileToString("output");

            case 29:
              res.stdout = _context9.sent;
              _context9.next = 32;
              return iso.getFileToString("error");

            case 32:
              res.stderr = _context9.sent;
              _context9.next = 35;
              return iso.removeFile("output");

            case 35:
              _context9.next = 37;
              return iso.removeFile("error");

            case 37:
              return _context9.abrupt("return", res);

            case 38:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, _this8);
    }))();
  },
  Py2: function Py2(iso, store, file, execPath) {
    var _this9 = this;

    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
      var sourceFile, oldEnv, oldProc, oldTL, oldWTL, res;
      return _regenerator2.default.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              sourceFile = "sol.py";
              _context10.next = 3;
              return iso.createFileFromStorage(sourceFile, file);

            case 3:
              oldEnv = iso.preserveEnv;
              oldProc = iso.maxProcesses;
              oldTL = iso.timelimit;
              oldWTL = iso.wallclockLimit;

              iso.preserveEnv = true;
              iso.maxProcesses = null;
              iso.dirs.push({ in: "/etc" });
              iso.dirs.push({ in: "/usr" });
              iso.timelimit = JudgeConfig.COMPILATION_TL;
              iso.wallclockLimit = JudgeConfig.COMPILATION_TL;

              _context10.next = 15;
              return evaluate(iso, store, ["/usr/bin/python2", "-m", "py_compile", sourceFile]);

            case 15:
              res = _context10.sent;


              iso.maxProcesses = oldProc;
              iso.preserveEnv = oldEnv;
              iso.timelimit = oldTL;
              iso.wallclockLimit = oldWTL;
              iso.dirs.pop();
              iso.dirs.pop();

              _context10.next = 24;
              return iso.removeFile(sourceFile);

            case 24:
              if (!(res.code === 0 && execPath)) {
                _context10.next = 27;
                break;
              }

              _context10.next = 27;
              return iso.globToStorage("**/*.pyc", function (_) {
                return "sol.pyc";
              });

            case 27:
              _context10.next = 29;
              return iso.getFileToString("output");

            case 29:
              res.stdout = _context10.sent;
              _context10.next = 32;
              return iso.getFileToString("error");

            case 32:
              res.stderr = _context10.sent;
              _context10.next = 35;
              return iso.removeFile("output");

            case 35:
              _context10.next = 37;
              return iso.removeFile("error");

            case 37:
              return _context10.abrupt("return", res);

            case 38:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, _this9);
    }))();
  },
  Py3: function Py3(iso, store, file, execPath) {
    var _this10 = this;

    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
      var sourceFile, oldEnv, oldProc, oldTL, oldWTL, res;
      return _regenerator2.default.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              sourceFile = "sol.py";
              _context11.next = 3;
              return iso.createFileFromStorage(sourceFile, file);

            case 3:
              oldEnv = iso.preserveEnv;
              oldProc = iso.maxProcesses;
              oldTL = iso.timelimit;
              oldWTL = iso.wallclockLimit;

              iso.preserveEnv = true;
              iso.maxProcesses = null;
              iso.dirs.push({ in: "/etc" });
              iso.dirs.push({ in: "/usr" });
              iso.timelimit = JudgeConfig.COMPILATION_TL;
              iso.wallclockLimit = JudgeConfig.COMPILATION_TL;

              _context11.next = 15;
              return evaluate(iso, store, ["/usr/bin/python3", "-m", "py_compile", sourceFile]);

            case 15:
              res = _context11.sent;


              iso.maxProcesses = oldProc;
              iso.preserveEnv = oldEnv;
              iso.timelimit = oldTL;
              iso.wallclockLimit = oldWTL;
              iso.dirs.pop();
              iso.dirs.pop();

              _context11.next = 24;
              return iso.removeFile(sourceFile);

            case 24:
              if (!(res.code === 0 && execPath)) {
                _context11.next = 27;
                break;
              }

              _context11.next = 27;
              return iso.globToStorage("**/*.pyc", function (_) {
                return "sol.pyc";
              });

            case 27:
              _context11.next = 29;
              return iso.getFileToString("output");

            case 29:
              res.stdout = _context11.sent;
              _context11.next = 32;
              return iso.getFileToString("error");

            case 32:
              res.stderr = _context11.sent;
              _context11.next = 35;
              return iso.removeFile("output");

            case 35:
              _context11.next = 37;
              return iso.removeFile("error");

            case 37:
              return _context11.abrupt("return", res);

            case 38:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11, _this10);
    }))();
  }
};

/* Path constants to be used in the grading steps */
var SOURCE_PATH = "_/sol";
var SOURCE_EXEC_PATH = "_/sol_exec";
var CHECKER_PATH = "_/checker";
var CHECKER_EXEC_PATH = "_/checker_exec";if (!module.parent && false) {
  (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19() {
    var env, store, judeLoader, task, code, slow_code, tle_code, fake_mle_code, slow2_code, java_wacode, java_mlecode, java_rtecode, crazy_code, pycode;
    return _regenerator2.default.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            env = new JudgeEnvironment();
            store = new Storage();
            _context19.next = 4;
            return store.loadZip("test/test_contest.zip");

          case 4:
            judeLoader = new JudeLoader(store);
            _context19.next = 7;
            return judeLoader.load();

          case 7:
            task = _context19.sent;


            /* eslint-disable */
            code = "\#include \<bits/stdc++.h>\nusing namespace std;\nint main(){int x, y; cin >> x >> y; cout << x+y << ' ' << x*y << endl;}";
            slow_code = "\#include \<bits/stdc++.h>\nusing namespace std;\nint main(){for(int i = 0; i < 1000000/2; i++) cerr << 129312 << '\\n'; int x, y; cin >> x >> y; cout << x+y << ' ' << x*y << endl;}";
            tle_code = "\#include \<bits/stdc++.h>\nusing namespace std;\nint main(){for(int i = 0; i < 1000000000000LL; i++);}";
            fake_mle_code = "\#include \<bits/stdc++.h>\nusing namespace std;\nint main(){vector<int> v(1000000000);}";
            slow2_code = "\#include \<bits/stdc++.h>\nusing namespace std;\nint main(){int acc = 0; for(int i = 0; i < 1000000000; i++) acc += i; cout << acc << endl;}";
            // console.log(code)
            // utils.logInspect(testTask(env, task, store, slow_code, "CPP"))

            java_wacode = "\n        public class Main {\n            public static void main(String[] args) {\n                System.out.println(\"Hello!\");\n            }\n        }";
            java_mlecode = "\n        public class Main {\n            public static void main(String[] args) {\n                long a[] = new long[1024*1024*21];\n                for(int i = 0; i < 1024*1024*21; i++) a[i] = i;\n                System.out.println(\"Hello!\");\n            }\n        }";
            java_rtecode = "import java.util.*;\n \npublic class Main\n{\n\tpublic static void main (String[] args)\n\t{\n\t\tint n;\n\t\tScanner in = new Scanner(System.in);\n\t\tn = in.nextInt();\n\t\tif (n % 100 >= 65) \n\t\t\tn = 100 * (n / 100 + 1);\n\t\tif (n % 20 > 15) \n\t\t\tn = 20 * (n / 20 + 1);\n\t\tSystem.out.println((n / 100) * 100 + (n % 100 / 20) * 30 + 2 * (n % 20));\n\t}\n}";
            crazy_code = "import java.io.OutputStream;\nimport java.io.IOException;\nimport java.io.InputStream;\nimport java.io.PrintWriter;\nimport java.util.StringTokenizer;\nimport java.io.IOException;\nimport java.io.BufferedReader;\nimport java.io.InputStreamReader;\nimport java.io.InputStream;\n\n/**\n * Built using CHelper plug-in\n * Actual solution is at the top\n */\npublic class Main {\n    public static void main(String[] args) {\n        TaskG solver = new TaskG();\n        solver.solve();\n    }\n\n    static class TaskG {\n        static final long MODULO = (long) (1e9 + 7);\n\n        public void solve() {\n        \tSystem.out.println(5);\n        }\n\n        private int gcd(int a, int b) {\n            while (b > 0) {\n                int t = a % b;\n                a = b;\n                b = t;\n            }\n            return a;\n        }\n    }\n}";
            pycode = "print '5'";
            _context19.t0 = utils;
            _context19.next = 21;
            return testTask(env, task, store, java_rtecode, "Java");

          case 21:
            _context19.t1 = _context19.sent;

            _context19.t0.logInspect.call(_context19.t0, _context19.t1);

          case 23:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19, undefined);
  }))();
}

/* eslint-enable */
var availableLanguages = {
  CPP: "C++ 11",
  C: "C 11",
  Java: "Java 8",
  Py2: "Python 2",
  Py3: "Python 3"
};

module.exports = { testTask: testTask, testPackage: testPackage, availableLanguages: availableLanguages };
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)(module)))

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = require("promise-reflect");

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _assign = __webpack_require__(36);

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = __webpack_require__(2);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(3);

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VerdictConst = {
  "": "won't be judged",
  VERDICT_INQ: "in queue",
  VERDICT_SKIP: "skipped",

  VERDICT_WA: "wrong answer",
  VERDICT_RTE: "runtime error",
  VERDICT_MLE: "memory limit exceeded",
  VERDICT_TLE: "time limit exceeded",
  VERDICT_WTE: "walltime limit exceeded",
  VERDICT_OLE: "output limit exceeded",

  VERDICT_CE: "compilation error",
  VERDICT_CTE: "compilation timed out",

  VERDICT_FAIL: "checker failed",
  VERDICT_CHTE: "checker timed out",

  VERDICT_JE: "judge crashed",
  VERDICT_UE: "unknown error",

  VERDICT_AC: "accepted"
};

var VerdictTag = {
  "": "white",
  VERDICT_INQ: "light",
  VERDICT_SKIP: "dark",

  VERDICT_WA: "danger",
  VERDICT_RTE: "danger",
  VERDICT_MLE: "danger",
  VERDICT_TLE: "danger",
  VERDICT_WTE: "danger",
  VERDICT_OLE: "danger",

  VERDICT_CE: "warning",
  VERDICT_CTE: "warning",

  VERDICT_FAIL: "info",
  VERDICT_CHTE: "info",

  VERDICT_JE: "black",
  VERDICT_UE: "black",

  VERDICT_AC: "success"
};

var Verdict = function () {
  function Verdict(score, verdict) {
    var passed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
    var info = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    (0, _classCallCheck3.default)(this, Verdict);

    this.score = score || 0;
    this.verdict = verdict;
    this.passed = passed;
    this.info = {};
    if (typeof info === "string") (0, _assign2.default)(this.info, { text: info });else (0, _assign2.default)(this.info, info || {});
  }

  (0, _createClass3.default)(Verdict, [{
    key: "wasExecuted",
    value: function wasExecuted() {
      return this.passed >= 0;
    }
  }, {
    key: "getTextInfo",
    value: function getTextInfo() {
      return this.info.text || "";
    }
  }, {
    key: "getVerdictCode",
    value: function getVerdictCode() {
      return this.verdict;
    }
  }, {
    key: "getVerdictText",
    value: function getVerdictText() {
      return VerdictConst.hasOwnProperty(this.verdict) ? VerdictConst[this.verdict] : this.verdict;
    }
  }, {
    key: "getScore",
    value: function getScore() {
      return this.score;
    }
  }, {
    key: "getPassed",
    value: function getPassed() {
      return Math.max(0, this.passed);
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        score: this.score,
        verdict: this.verdict,
        passed: this.passed,
        info: this.info
      };
    }
  }], [{
    key: "fromJSON",
    value: function fromJSON(json) {
      return new Verdict(json.score || 0, json.verdict, json.passed || -1, json.info || {});
    }
  }]);
  return Verdict;
}();

module.exports = {
  Verdict: Verdict,
  VerdictConst: VerdictConst,
  VerdictTag: VerdictTag
};

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/object/assign");

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/typeof");

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

var _slicedToArray2 = __webpack_require__(10);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _keys = __webpack_require__(8);

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = __webpack_require__(0);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _getPrototypeOf = __webpack_require__(13);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = __webpack_require__(14);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(15);

var _inherits3 = _interopRequireDefault(_inherits2);

var _regenerator = __webpack_require__(5);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = __webpack_require__(6);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = __webpack_require__(2);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(3);

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by rsalesc on 15/06/16.
 */
var Promise = __webpack_require__(40);

var fs = __webpack_require__(11);

var path = __webpack_require__(1);
var logger = __webpack_require__(7);
var jenv = __webpack_require__(16);
var utils = __webpack_require__(12);
var globAsync = utils.globAsync;


var Storage = __webpack_require__(24).MemoryStorage;
var JudgeConfig = jenv.JudgeConfig;

var spawnDetachedPromise = __webpack_require__(45).spawn;

/*
*   spawnDetached async version (promisified)
 *
function spawnDetachedAsync(command, args=[], options={}){
    return new Promise((resolve, reject) => {
        options.stdio = ['ignore']
        options.detached = true;
        let successfulExitCodes = (options && options.successfulExitCodes) || [0];

        let proc = spawn(command, args, options)
        proc.unref();

        proc.on("close", (code) => {
            if(successfulExitCodes.indexOf(code) === -1) {
                let commandStr = command + (args.length ? (' ' + args.join(' ')) : '');
                let err = {
                    code,
                    message: '`' + commandStr + '` failed with code ' + code,
                    toString(){
                        return this.message
                    }
                }

                reject(err)
            } else {
                resolve({code})
            }
        })

        proc.on("error", reject)
    })
}*/

// debug
function spawnDetachedAsync(command) {
  var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (options.hasOwnProperty("stdio")) {
    options.capture = options.stdio;
    delete options.stdio;
  }
  return spawnDetachedPromise(command, args, options);
}

/*
* This is the base class for sandboxes
* All sandboxes should be extended from this
* Make sure it runs inside an async environment
* @abstract
 */

var Sandbox = function () {
  /*
    * @param {Storage} storage which will provide quick interaction (in-memory)
    *           between host FS and sandbox FS
    * @param {JudgeEnvironment} judge environment used by the sandbox
     */
  function Sandbox(env, store) {
    (0, _classCallCheck3.default)(this, Sandbox);

    //if (new.target == Sandbox)
    //  throw `Cannot instantiate abstract class Sandbox`;
    this.cacher = store;
    this.env = env;
  }

  (0, _createClass3.default)(Sandbox, [{
    key: "setStorage",
    value: function setStorage(store) {
      this.cacher = store;
    }
  }, {
    key: "setEnvironment",
    value: function setEnvironment(env) {
      this.env = env;
    }
  }, {
    key: "getRootPath",
    value: function getRootPath() {
      throw "Concrete sandboxes must implement this function";
    }
  }, {
    key: "getRunningTime",
    value: function getRunningTime() {
      throw "Concrete sandboxes must implement this function";
    }
  }, {
    key: "getMemoryUsage",
    value: function getMemoryUsage() {
      throw "Concrete sandboxes must implement this function";
    }
  }, {
    key: "getExitCode",
    value: function getExitCode() {
      throw "Concrete sandboxes must implement this function";
    }

    /*
      * @param {string} path in sandbox (relative to its bound directory)
      * @returns {string} absolute path in host
      **/

  }, {
    key: "resolvePath",
    value: function resolvePath(p) {
      return path.join(this.getRootPath(), p);
    }
  }, {
    key: "_getMode",
    value: function _getMode(exec) {
      if (exec === true) return 511;else if (exec === false) return 436;
      return exec;
    }

    /*
      *   Open a new file in sandbox
      *   @param {string} path in sandbox
      *   @param {string} flags to fs.open
      *   @param {boolean|integer} [exec=false] is the new file executable, or octal mode
      *   @returns {number} file descriptor
       */

  }, {
    key: "openFile",
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(p) {
        var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "wx+";
        var exec = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var absPath, fd;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                absPath = this.resolvePath(p);
                _context.prev = 1;
                _context.next = 4;
                return fs.open(absPath, flags, this._getMode(exec));

              case 4:
                fd = _context.sent;
                return _context.abrupt("return", fd);

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](1);

                logger.error("Sandbox %s could not open file %s", this.constructor.name, p);
                throw _context.t0;

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 8]]);
      }));

      function openFile(_x3) {
        return _ref.apply(this, arguments);
      }

      return openFile;
    }()

    /*
      * Create a new file in sandbox and close it
      * @param {string} path in sandbox
      * @param {boolean|integer} [exec=false] is the new file executable, or octal mode
       */

  }, {
    key: "createFile",
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(p) {
        var exec = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var absPath, fd;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                absPath = this.resolvePath(p);
                _context2.prev = 1;
                _context2.next = 4;
                return fs.open(absPath, "wx+");

              case 4:
                fd = _context2.sent;
                _context2.next = 7;
                return fs.chmod(absPath, this._getMode(exec));

              case 7:
                _context2.next = 9;
                return fs.close(fd);

              case 9:
                _context2.next = 15;
                break;

              case 11:
                _context2.prev = 11;
                _context2.t0 = _context2["catch"](1);

                logger.error("Sandbox %s could not create file %s", this.constructor.name, p);
                throw _context2.t0;

              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[1, 11]]);
      }));

      function createFile(_x6) {
        return _ref2.apply(this, arguments);
      }

      return createFile;
    }()

    /*
      * Same as {Sandbox#createFile}, but writes file from {FileCacher}
      * @param {string} path in sandbox
      * @param {string} path/ID in {FileCacher}
      * @param {boolean|integer} [exec=false] is the new file executable, or octal mode
       */

  }, {
    key: "createFileFromStorage",
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(p, d) {
        var exec = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var absPath, buf;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                absPath = this.resolvePath(p);
                _context3.prev = 1;
                _context3.next = 4;
                return this.cacher.getFileBuffer(d);

              case 4:
                buf = _context3.sent;
                _context3.next = 7;
                return fs.writeFile(absPath, buf, { flag: "wx+" });

              case 7:
                _context3.next = 9;
                return fs.chmod(absPath, this._getMode(exec));

              case 9:
                _context3.next = 15;
                break;

              case 11:
                _context3.prev = 11;
                _context3.t0 = _context3["catch"](1);

                logger.error("Sandbox %s could not create file from storage", this.constructor.name);
                throw _context3.t0;

              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[1, 11]]);
      }));

      function createFileFromStorage(_x8, _x9) {
        return _ref3.apply(this, arguments);
      }

      return createFileFromStorage;
    }()
  }, {
    key: "createFileFromString",
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(p, content) {
        var exec = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var absPath;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                absPath = this.resolvePath(p);
                _context4.prev = 1;
                _context4.next = 4;
                return fs.writeFile(absPath, content, { flag: "wx+" });

              case 4:
                _context4.next = 6;
                return fs.chmod(absPath, this._getMode(exec));

              case 6:
                _context4.next = 12;
                break;

              case 8:
                _context4.prev = 8;
                _context4.t0 = _context4["catch"](1);

                logger.error("Sandbox %s could not create file from storage", this.constructor.name);
                throw _context4.t0;

              case 12:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[1, 8]]);
      }));

      function createFileFromString(_x11, _x12) {
        return _ref4.apply(this, arguments);
      }

      return createFileFromString;
    }()

    /*
      *   Get an opened file from sandbox
      *   @param {string} path in sandbox
      *   @returns {number} file descriptor
       */

  }, {
    key: "getFile",
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(p) {
        var absPath, fd;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                absPath = this.resolvePath(p);
                _context5.next = 4;
                return fs.open(absPath, "r");

              case 4:
                fd = _context5.sent;
                return _context5.abrupt("return", fd);

              case 8:
                _context5.prev = 8;
                _context5.t0 = _context5["catch"](0);

                logger.error("Sandbox %s could not retrieve file %s", this.constructor.name, p);
                throw _context5.t0;

              case 12:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 8]]);
      }));

      function getFile(_x14) {
        return _ref5.apply(this, arguments);
      }

      return getFile;
    }()
  }, {
    key: "getFileToString",
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(p) {
        var absPath;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                absPath = this.resolvePath(p);
                _context6.next = 4;
                return fs.readFile(absPath, "utf8");

              case 4:
                return _context6.abrupt("return", _context6.sent);

              case 7:
                _context6.prev = 7;
                _context6.t0 = _context6["catch"](0);

                if (!(_context6.t0.code === "ENOENT")) {
                  _context6.next = 11;
                  break;
                }

                return _context6.abrupt("return", "");

              case 11:
                logger.error("Sandbox %s could not retrieve file %s", this.constructor.name, p);
                throw _context6.t0;

              case 13:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 7]]);
      }));

      function getFileToString(_x15) {
        return _ref6.apply(this, arguments);
      }

      return getFileToString;
    }()

    /*
      *   Get file from sandbox and read it into {FileCacher} storage
      *   @param {string} path in sandbox
      *   @param {string} path/ID in {FileCacher} storage
       */

  }, {
    key: "getFileToStorage",
    value: function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(p, d) {
        var absPath;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                absPath = this.resolvePath(p);
                _context7.t0 = this.cacher;
                _context7.t1 = d;
                _context7.next = 6;
                return fs.readFile(absPath);

              case 6:
                _context7.t2 = _context7.sent;
                _context7.next = 9;
                return _context7.t0.createFileFromContent.call(_context7.t0, _context7.t1, _context7.t2);

              case 9:
                _context7.next = 14;
                break;

              case 11:
                _context7.prev = 11;
                _context7.t3 = _context7["catch"](0);

                logger.error("Sandbox %s could not retrieve file %s to storage", this.constructor.name, p);

              case 14:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[0, 11]]);
      }));

      function getFileToStorage(_x16, _x17) {
        return _ref7.apply(this, arguments);
      }

      return getFileToStorage;
    }()
  }, {
    key: "globToStorage",
    value: function () {
      var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(pattern, fun) {
        var _this = this;

        var files;
        return _regenerator2.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;
                _context9.next = 3;
                return globAsync(pattern, { cwd: this.getRootPath(), absolute: true });

              case 3:
                files = _context9.sent;
                _context9.next = 6;
                return Promise.all(files.map(function () {
                  var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(file) {
                    return _regenerator2.default.wrap(function _callee8$(_context8) {
                      while (1) {
                        switch (_context8.prev = _context8.next) {
                          case 0:
                            _context8.t0 = _this.cacher;
                            _context8.t1 = fun(file);
                            _context8.next = 4;
                            return fs.readFile(file);

                          case 4:
                            _context8.t2 = _context8.sent;

                            _context8.t0.createFileFromContent.call(_context8.t0, _context8.t1, _context8.t2);

                          case 6:
                          case "end":
                            return _context8.stop();
                        }
                      }
                    }, _callee8, _this);
                  }));

                  return function (_x20) {
                    return _ref9.apply(this, arguments);
                  };
                }()));

              case 6:
                _context9.next = 12;
                break;

              case 8:
                _context9.prev = 8;
                _context9.t0 = _context9["catch"](0);

                console.log(_context9.t0);
                logger.error("Sandbox could not save class files");

              case 12:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this, [[0, 8]]);
      }));

      function globToStorage(_x18, _x19) {
        return _ref8.apply(this, arguments);
      }

      return globToStorage;
    }()
  }, {
    key: "globFromStorage",
    value: function () {
      var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(pattern, fun) {
        var _this2 = this;

        var matches;
        return _regenerator2.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return this.cacher.glob(pattern);

              case 2:
                matches = _context11.sent;
                _context11.next = 5;
                return Promise.all(matches.map(function () {
                  var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(match) {
                    return _regenerator2.default.wrap(function _callee10$(_context10) {
                      while (1) {
                        switch (_context10.prev = _context10.next) {
                          case 0:
                            _context10.next = 2;
                            return _this2.createFileFromStorage(fun(match), match);

                          case 2:
                          case "end":
                            return _context10.stop();
                        }
                      }
                    }, _callee10, _this2);
                  }));

                  return function (_x23) {
                    return _ref11.apply(this, arguments);
                  };
                }()));

              case 5:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function globFromStorage(_x21, _x22) {
        return _ref10.apply(this, arguments);
      }

      return globFromStorage;
    }()
  }, {
    key: "getFileStats",
    value: function () {
      var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(p) {
        var res;
        return _regenerator2.default.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return fs.stat(this.resolvePath(p));

              case 2:
                res = _context12.sent;
                return _context12.abrupt("return", res);

              case 4:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function getFileStats(_x24) {
        return _ref12.apply(this, arguments);
      }

      return getFileStats;
    }()
  }, {
    key: "chmod",
    value: function () {
      var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(p) {
        var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 436;
        return _regenerator2.default.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.next = 2;
                return fs.chmod(this.resolvePath(p), mode);

              case 2:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function chmod(_x25) {
        return _ref13.apply(this, arguments);
      }

      return chmod;
    }()
  }, {
    key: "pathExists",
    value: function () {
      var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(p) {
        return _regenerator2.default.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.prev = 0;
                _context14.next = 3;
                return this.getFileStats(p);

              case 3:
                return _context14.abrupt("return", true);

              case 6:
                _context14.prev = 6;
                _context14.t0 = _context14["catch"](0);
                return _context14.abrupt("return", false);

              case 9:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this, [[0, 6]]);
      }));

      function pathExists(_x27) {
        return _ref14.apply(this, arguments);
      }

      return pathExists;
    }()
  }, {
    key: "fileExists",
    value: function () {
      var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15(p) {
        var res;
        return _regenerator2.default.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.prev = 0;
                _context15.next = 3;
                return this.getFileStats(p);

              case 3:
                res = _context15.sent;
                return _context15.abrupt("return", res.isFile());

              case 7:
                _context15.prev = 7;
                _context15.t0 = _context15["catch"](0);

                console.log(_context15.t0);
                return _context15.abrupt("return", false);

              case 11:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this, [[0, 7]]);
      }));

      function fileExists(_x28) {
        return _ref15.apply(this, arguments);
      }

      return fileExists;
    }()
  }, {
    key: "dirExists",
    value: function () {
      var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16(p) {
        var res;
        return _regenerator2.default.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _context16.prev = 0;
                _context16.next = 3;
                return this.getFileStats(p);

              case 3:
                res = _context16.sent;
                return _context16.abrupt("return", res.isDirectory());

              case 7:
                _context16.prev = 7;
                _context16.t0 = _context16["catch"](0);
                return _context16.abrupt("return", false);

              case 10:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this, [[0, 7]]);
      }));

      function dirExists(_x29) {
        return _ref16.apply(this, arguments);
      }

      return dirExists;
    }()
  }, {
    key: "removeDir",
    value: function () {
      var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17(p) {
        return _regenerator2.default.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                _context17.prev = 0;
                _context17.next = 3;
                return fs.rmdir(this.resolvePath(p));

              case 3:
                _context17.next = 9;
                break;

              case 5:
                _context17.prev = 5;
                _context17.t0 = _context17["catch"](0);

                if (!(_context17.t0.code !== "ENOENT")) {
                  _context17.next = 9;
                  break;
                }

                throw _context17.t0;

              case 9:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this, [[0, 5]]);
      }));

      function removeDir(_x30) {
        return _ref17.apply(this, arguments);
      }

      return removeDir;
    }()
  }, {
    key: "removeFile",
    value: function () {
      var _ref18 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18(p) {
        return _regenerator2.default.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                _context18.prev = 0;
                _context18.next = 3;
                return fs.unlink(this.resolvePath(p));

              case 3:
                _context18.next = 9;
                break;

              case 5:
                _context18.prev = 5;
                _context18.t0 = _context18["catch"](0);

                if (!(_context18.t0.code !== "ENOENT")) {
                  _context18.next = 9;
                  break;
                }

                throw _context18.t0;

              case 9:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this, [[0, 5]]);
      }));

      function removeFile(_x31) {
        return _ref18.apply(this, arguments);
      }

      return removeFile;
    }()
  }]);
  return Sandbox;
}();

var IsolateConst = {
  EXIT_SANDBOX_ERROR: "sandbox error",
  EXIT_OK: "ok",
  EXIT_SIGNAL: "signal",
  EXIT_TIMEOUT: "timeout",
  EXIT_TIMEOUT_WALL: "wall timeout",
  EXIT_FILE_ACCESS: "file access",
  EXIT_SYSCALL: "syscall",
  EXIT_OUTPUT_LIMIT: "output limit exceeded",
  EXIT_NONZERO_RETURN: "nonzero return"
};

var Isolate = function (_Sandbox) {
  (0, _inherits3.default)(Isolate, _Sandbox);

  function Isolate(env, store) {
    var log = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _classCallCheck3.default)(this, Isolate);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (Isolate.__proto__ || (0, _getPrototypeOf2.default)(Isolate)).call(this, env, store));

    _this3.log = log;
    _this3.path = null;
    _this3.initialized = false;
    return _this3;
  }

  (0, _createClass3.default)(Isolate, [{
    key: "getRootPath",
    value: function getRootPath() {
      if (!this.path) throw "sandbox was not init'd";
      return this.path;
    }
  }, {
    key: "getChdirPath",
    value: function getChdirPath(p) {
      return path.join(this.innerDir, p);
    }
  }, {
    key: "setDefaultConfigs",
    value: function setDefaultConfigs() {
      this.cgroup = true;
      this.chdir = this.innerDir;
      this.dirs = [{ in: this.innerDir, out: this.path, opts: "rw" }];

      this.preserveEnv = false;
      this.inheritEnv = [];
      this.setEnv = {};
      this.fsize = null;
      this.stdin = null;
      this.stdout = null;
      this.stderr = null;
      this.stackSize = null;
      this.memorySize = null;
      this.maxProcesses = 1;
      this.timelimit = null;
      this.wallclockLimit = null;
      this.extraTimelimit = null;
      this.verbosity = 0;
      this.bufferize = null;

      this.cgMemorySize = null;
      this.cgTiming = false;
    }
  }, {
    key: "init",
    value: function () {
      var _ref19 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19() {
        var params;
        return _regenerator2.default.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                if (!this.initialized) {
                  _context19.next = 5;
                  break;
                }

                this.setDefaultConfigs();
                _context19.next = 4;
                return fs.emptyDir(this.path);

              case 4:
                return _context19.abrupt("return");

              case 5:

                this.boxId = this.env.getNextBoxId();
                this.executable = JudgeConfig.ISOLATE_PATH;
                this.execs = -1;

                _context19.next = 10;
                return fs.mkdtemp(path.join(JudgeConfig.TEMP_DIR, "iso-"));

              case 10:
                this.outerDir = _context19.sent;

                this.innerDir = "/tmp";

                // have to use sum, absoluteness of tmp will mess things up
                this.path = this.outerDir + this.innerDir;

                // defaults to 0o777
                _context19.next = 15;
                return fs.mkdir(this.path);

              case 15:
                _context19.next = 17;
                return fs.chmod(this.path, 511);

              case 17:

                logger.debug("Creating isolate sandbox %s (%d)", this.path, this.boxId);
                this.setDefaultConfigs();

                params = [];

                if (this.cgroup) params.push("--cg");
                params.push("--box-id=" + this.boxId);
                params.push("--init");

                _context19.prev = 23;
                _context19.next = 26;
                return spawnDetachedAsync(this.executable, params, { stdio: ["ignore"] });

              case 26:
                this.initialized = true;
                _context19.next = 33;
                break;

              case 29:
                _context19.prev = 29;
                _context19.t0 = _context19["catch"](23);

                logger.error("[Isolate] Sandbox could not be initialized");
                throw _context19.t0;

              case 33:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this, [[23, 29]]);
      }));

      function init() {
        return _ref19.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "getBoxFilePath",
    value: function getBoxFilePath(p) {
      if (this.bufferize) return this.resolvePath(p);
      return this.getChdirPath(p);
    }
  }, {
    key: "getRunArgs",
    value: function getRunArgs() {
      var res = ["--box-id=" + this.boxId];
      // remember to add meta parameter (for logging) before execing

      if (this.bufferize) res.push("--bufferize=" + this.bufferize);
      if (this.chdir) res.push("--chdir=" + this.chdir);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(this.dirs), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var dir = _step.value;

          var s = dir.in;
          if (dir.out) s += "=" + dir.out;
          if (dir.opts) s += ":" + dir.opts;
          res.push("--dir=" + s);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (this.preserveEnv) res.push("--full-env");

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(this.inheritEnv), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var v = _step2.value;

          res.push("--env=" + v);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = (0, _getIterator3.default)((0, _keys2.default)(this.setEnv)), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var key = _step3.value;

          res.push("--env=" + key + "=" + this.setEnv[key]);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      if (this.fsize) res.push("--fsize=" + this.fsize);
      if (this.stdin) res.push("--stdin=" + this.getChdirPath(this.stdin));
      if (this.stdout) res.push("--stdout=" + this.getBoxFilePath(this.stdout));
      if (this.stderr) res.push("--stderr=" + this.getBoxFilePath(this.stderr));
      if (this.stackSize) res.push("--stack=" + this.stackSize);
      if (this.memorySize) res.push("--mem=" + this.memorySize);
      if (this.maxProcesses) res.push("--processes=" + this.maxProcesses);else res.push("--processes");

      if (this.timelimit) res.push("--time=" + this.timelimit);
      if (this.wallclockLimit) res.push("--wall-time=" + this.wallclockLimit);
      if (this.extraTimelimit) res.push("--extra-time=" + this.extraTimelimit);

      for (var i = 0; i < this.verbose; i++) {
        res.push("--verbose");
      }if (this.cgroup) res.push("--cg");
      if (this.cgMemorySize) res.push("--cg-mem=" + this.cgMemorySize);
      if (this.cgTiming) res.push("--cg-timing");

      return res;
    }
  }, {
    key: "getLog",
    value: function () {
      var _ref20 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20(ex) {
        var exec, fn, res, log, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, line, _line$split, _line$split2, key, value;

        return _regenerator2.default.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                if (!(this.execs < 0)) {
                  _context20.next = 2;
                  break;
                }

                throw "No execution took place in this sandbox";

              case 2:
                exec = ex || this.execs;

                if (!(exec > this.execs)) {
                  _context20.next = 5;
                  break;
                }

                throw "This execution did not take place in this sandbox";

              case 5:
                if (!(this.log && this.log.exec === exec)) {
                  _context20.next = 7;
                  break;
                }

                return _context20.abrupt("return", this.log);

              case 7:
                fn = "run.log." + exec;
                res = {};
                _context20.prev = 9;
                _context20.next = 12;
                return this.getFileToString(fn);

              case 12:
                log = _context20.sent;
                _iteratorNormalCompletion4 = true;
                _didIteratorError4 = false;
                _iteratorError4 = undefined;
                _context20.prev = 16;

                for (_iterator4 = (0, _getIterator3.default)(log.split(/[\r?\n]+/g)); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                  line = _step4.value;
                  _line$split = line.split(":", 2), _line$split2 = (0, _slicedToArray3.default)(_line$split, 2), key = _line$split2[0], value = _line$split2[1];

                  if (res.key) res[key].push(value);else res[key] = [value];
                }

                _context20.next = 24;
                break;

              case 20:
                _context20.prev = 20;
                _context20.t0 = _context20["catch"](16);
                _didIteratorError4 = true;
                _iteratorError4 = _context20.t0;

              case 24:
                _context20.prev = 24;
                _context20.prev = 25;

                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
                }

              case 27:
                _context20.prev = 27;

                if (!_didIteratorError4) {
                  _context20.next = 30;
                  break;
                }

                throw _iteratorError4;

              case 30:
                return _context20.finish(27);

              case 31:
                return _context20.finish(24);

              case 32:
                this.log = res;
                this.log.exec = exec;
                _context20.next = 40;
                break;

              case 36:
                _context20.prev = 36;
                _context20.t1 = _context20["catch"](9);

                logger.error("Error trying to read the log file %s", this.resolvePath(fn));
                throw _context20.t1;

              case 40:
                return _context20.abrupt("return", this.log);

              case 41:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, this, [[9, 36], [16, 20, 24, 32], [25,, 27, 31]]);
      }));

      function getLog(_x33) {
        return _ref20.apply(this, arguments);
      }

      return getLog;
    }()

    // seconds (float)

  }, {
    key: "getRunningTime",
    value: function getRunningTime() {
      if (this.log.hasOwnProperty("time")) return parseFloat(this.log.time[0]);
      return null;
    }

    // in kilobytes (int)

  }, {
    key: "getMemoryUsage",
    value: function getMemoryUsage() {
      if (this.log.hasOwnProperty("cg-mem")) return parseInt(this.log["cg-mem"][0], 10);
      return null;
    }
  }, {
    key: "getWallTime",
    value: function getWallTime() {
      if (this.log.hasOwnProperty("time-wall")) return parseFloat(this.log["time-wall"][0], 10);
      return null;
    }
  }, {
    key: "getExitCode",
    value: function getExitCode() {
      if (this.log.hasOwnProperty("exitcode")) return parseInt(this.log.exitcode[0], 10);
      return 0;
    }
  }, {
    key: "getKillingSignal",
    value: function getKillingSignal() {
      if (this.log.hasOwnProperty("exitsig")) return parseInt(this.log.exitsig[0], 10);
      return 0;
    }
  }, {
    key: "getStatusList",
    value: function getStatusList() {
      if (this.log.hasOwnProperty("status")) return this.log.status;
      return [];
    }
  }, {
    key: "getExitStatus",
    value: function getExitStatus() {
      var checkWall = function checkWall(message) {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = (0, _getIterator3.default)(message), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var msg = _step5.value;

            if (msg.indexOf("wall") !== -1) return true;
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        return false;
      };

      var list = this.getStatusList();
      if (list.indexOf("XX") !== -1) return IsolateConst.EXIT_SANDBOX_ERROR;
      if (list.indexOf("FO") !== -1) return IsolateConst.EXIT_SYSCALL;
      if (list.indexOf("FA") !== -1) return IsolateConst.EXIT_FILE_ACCESS;
      if (list.indexOf("TO") !== -1) {
        if (this.log.hasOwnProperty("message") && checkWall(this.log.message)) return IsolateConst.EXIT_TIMEOUT_WALL;
        return IsolateConst.EXIT_TIMEOUT;
      }
      if (list.indexOf("SG") !== -1) return IsolateConst.EXIT_SIGNAL;
      if (list.indexOf("OL") !== -1) return IsolateConst.EXIT_OUTPUT_LIMIT;

      if (list.indexOf("RE") !== -1) return IsolateConst.NONZERO_RETURN;
      return IsolateConst.EXIT_OK;
    }
  }, {
    key: "executeBufferized",
    value: function () {
      var _ref21 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21() {
        var oldVal,
            res,
            _args21 = arguments;
        return _regenerator2.default.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                oldVal = this.bufferize;
                _context21.prev = 1;

                this.bufferize = JudgeConfig.OUTPUT_LIMIT;
                _context21.next = 5;
                return this.execute.apply(this, _args21);

              case 5:
                res = _context21.sent;

                this.bufferize = oldVal;
                return _context21.abrupt("return", res);

              case 10:
                _context21.prev = 10;
                _context21.t0 = _context21["catch"](1);

                this.bufferize = oldVal;
                throw _context21.t0;

              case 14:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, this, [[1, 10]]);
      }));

      function executeBufferized() {
        return _ref21.apply(this, arguments);
      }

      return executeBufferized;
    }()
  }, {
    key: "execute",
    value: function () {
      var _ref22 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee22(comm) {
        var capture = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ["ignore"];
        var promise = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var args, command, res, ret, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, cap;

        return _regenerator2.default.wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                this.execs += 1;
                this.log = null;
                args = this.getRunArgs();

                args.push("--meta=" + this.resolvePath("run.log." + this.execs));
                args.push("--run");
                args.push("--");

                command = Array.isArray(comm) ? comm : [comm];

                args = args.concat(command);

                if (!promise) {
                  _context22.next = 10;
                  break;
                }

                return _context22.abrupt("return", spawnDetachedAsync(this.executable, args, { stdio: capture }));

              case 10:
                res = null;
                _context22.prev = 11;
                _context22.next = 14;
                return spawnDetachedAsync(this.executable, args, { stdio: capture });

              case 14:
                res = _context22.sent;
                _context22.next = 20;
                break;

              case 17:
                _context22.prev = 17;
                _context22.t0 = _context22["catch"](11);

                res = _context22.t0;

              case 20:
                ret = {
                  code: res.code,
                  message: res.message
                };
                _iteratorNormalCompletion6 = true;
                _didIteratorError6 = false;
                _iteratorError6 = undefined;
                _context22.prev = 24;

                for (_iterator6 = (0, _getIterator3.default)(capture); !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                  cap = _step6.value;

                  if (res.hasOwnProperty(cap)) ret[cap] = res[cap].toString();
                }
                _context22.next = 32;
                break;

              case 28:
                _context22.prev = 28;
                _context22.t1 = _context22["catch"](24);
                _didIteratorError6 = true;
                _iteratorError6 = _context22.t1;

              case 32:
                _context22.prev = 32;
                _context22.prev = 33;

                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                  _iterator6.return();
                }

              case 35:
                _context22.prev = 35;

                if (!_didIteratorError6) {
                  _context22.next = 38;
                  break;
                }

                throw _iteratorError6;

              case 38:
                return _context22.finish(35);

              case 39:
                return _context22.finish(32);

              case 40:
                return _context22.abrupt("return", ret);

              case 41:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee22, this, [[11, 17], [24, 28, 32, 40], [33,, 35, 39]]);
      }));

      function execute(_x34) {
        return _ref22.apply(this, arguments);
      }

      return execute;
    }()
  }, {
    key: "cleanup",
    value: function () {
      var _ref23 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee23() {
        var args;
        return _regenerator2.default.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                logger.debug("Deleting Isolate sandbox %s (%d)", this.path, this.boxId);
                args = ["--box-id=" + this.boxId];

                if (this.cgroup) args.push("--cg");
                args.push("--cleanup");

                _context23.prev = 4;

                if (!this.initialized) {
                  _context23.next = 8;
                  break;
                }

                _context23.next = 8;
                return spawnDetachedAsync(this.executable, args, { stdio: ["ignore"] });

              case 8:
                _context23.next = 10;
                return fs.remove(this.outerDir);

              case 10:
                _context23.next = 16;
                break;

              case 12:
                _context23.prev = 12;
                _context23.t0 = _context23["catch"](4);

                logger.error("Isolate sandbox %s (%d) could not be deleted", this.path, this.boxId);
                throw _context23.t0;

              case 16:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23, this, [[4, 12]]);
      }));

      function cleanup() {
        return _ref23.apply(this, arguments);
      }

      return cleanup;
    }()
  }], [{
    key: "translateBoxExitCode",
    value: function translateBoxExitCode(code) {
      if (code === 2) return false;
      if (code === 1 || code === 0) return true;
      throw "Unknown sandbox exitcode (" + code + ")";
    }
  }]);
  return Isolate;
}(Sandbox);

var IsolatePool = function () {
  function IsolatePool(size) {
    (0, _classCallCheck3.default)(this, IsolatePool);

    this.size = size;
    this.sandboxes = [];
    this.ptr = 0;
    for (var i = 0; i < size; i++) {
      this.sandboxes.push(new Isolate());
    }
  }

  (0, _createClass3.default)(IsolatePool, [{
    key: "getNext",
    value: function getNext(env, store) {
      var log = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

      var sandbox = this.sandboxes[this.ptr];
      this.ptr += 1;
      this.ptr %= this.size;
      sandbox.setEnvironment(env);
      sandbox.setStorage(store);
      sandbox.log = log;
      return sandbox;
    }
  }, {
    key: "cleanup",
    value: function cleanup() {
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = (0, _getIterator3.default)(this.sandboxes), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var sandbox = _step7.value;

          sandbox.cleanup();
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }
    }
  }]);
  return IsolatePool;
}();

if (!module.parent && false) {
  // eslint-disable-next-line require-await
  (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee24() {
    var env, store, iso;
    return _regenerator2.default.wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            console.log("Testing with async...");
            env = new jenv.JudgeEnvironment();
            store = new Storage();
            iso = new Isolate(env, store);
            _context24.next = 6;
            return store.load("test_contest/");

          case 6:
            _context24.next = 8;
            return iso.init();

          case 8:

            iso.dirs.push({ in: "/etc" });

            iso.preserveEnv = true;
            iso.maxProcesses = null;
            iso.timelimit = 20;
            iso.wallclockLimit = 30;
            console.log(iso.getRunArgs());

            _context24.next = 16;
            return iso.createFileFromStorage("source.cpp", "checker.cpp");

          case 16:
            _context24.prev = 16;
            _context24.t0 = console;
            _context24.next = 20;
            return iso.execute(["/usr/bin/g++", "source.cpp", "-static", "-std=c++11", "-O2", "-lm"], ["stdout", "stderr"]);

          case 20:
            _context24.t1 = _context24.sent;

            _context24.t0.log.call(_context24.t0, _context24.t1);

            _context24.next = 24;
            return iso.getFileToStorage("a.out", "_/a.out");

          case 24:
            _context24.next = 26;
            return iso.getLog();

          case 26:
            console.log(iso.log);
            _context24.next = 33;
            break;

          case 29:
            _context24.prev = 29;
            _context24.t2 = _context24["catch"](16);

            logger.error("Could not execute a.out");
            console.log(_context24.t2);

          case 33:
            _context24.next = 35;
            return iso.cleanup();

          case 35:
          case "end":
            return _context24.stop();
        }
      }
    }, _callee24, undefined, [[16, 29]]);
  }))();
}

module.exports = {
  Sandbox: Sandbox,
  Isolate: Isolate,
  IsolateConst: IsolateConst,
  IsolatePool: IsolatePool
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)(module)))

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = require("bluebird");

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = require("yauzl");

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = require("concat-stream");

/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = require("node-wildcard");

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = require("es6-promisify");

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = require("child-process-promise");

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray2 = __webpack_require__(10);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _map = __webpack_require__(20);

var _map2 = _interopRequireDefault(_map);

var _getIterator2 = __webpack_require__(0);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _getPrototypeOf = __webpack_require__(13);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = __webpack_require__(14);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(15);

var _inherits3 = _interopRequireDefault(_inherits2);

var _regenerator = __webpack_require__(5);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = __webpack_require__(6);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = __webpack_require__(2);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(3);

var _createClass3 = _interopRequireDefault(_createClass2);

/**
*   Returns a loader capable of loading package informed
*   @param {Storage} storage object
*/
var autoDetect = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(store) {
    var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _step3$value, _, loader;

    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context7.prev = 3;
            _iterator3 = (0, _getIterator3.default)(LOADERS);

          case 5:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context7.next = 14;
              break;
            }

            _step3$value = (0, _slicedToArray3.default)(_step3.value, 2), _ = _step3$value[0], loader = _step3$value[1];
            _context7.next = 9;
            return loader.isLoadable(store);

          case 9:
            if (!_context7.sent) {
              _context7.next = 11;
              break;
            }

            return _context7.abrupt("return", loader);

          case 11:
            _iteratorNormalCompletion3 = true;
            _context7.next = 5;
            break;

          case 14:
            _context7.next = 20;
            break;

          case 16:
            _context7.prev = 16;
            _context7.t0 = _context7["catch"](3);
            _didIteratorError3 = true;
            _iteratorError3 = _context7.t0;

          case 20:
            _context7.prev = 20;
            _context7.prev = 21;

            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }

          case 23:
            _context7.prev = 23;

            if (!_didIteratorError3) {
              _context7.next = 26;
              break;
            }

            throw _iteratorError3;

          case 26:
            return _context7.finish(23);

          case 27:
            return _context7.finish(20);

          case 28:
            return _context7.abrupt("return", null);

          case 29:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, this, [[3, 16, 20, 28], [21,, 23, 27]]);
  }));

  return function autoDetect(_x6) {
    return _ref7.apply(this, arguments);
  };
}();

// exports names manually since it's still not supported


function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by rsalesc on 14/06/16.
 */

var path = __webpack_require__(1);
var task = __webpack_require__(47);
var YAML = __webpack_require__(49);
var logger = __webpack_require__(7);
var utils = __webpack_require__(12);
var scoring = __webpack_require__(25);

var JUDE_FN = "jude.yml";

/**
*   Base class for all Loaders
*   Make sure it runs inside an aysnc or blockable environment
*   @abstract
 */

var Loader = function () {
  function Loader(store) {
    (0, _classCallCheck3.default)(this, Loader);

    //if (new.target == Loader)
    //  throw `Cannot instantiate abstract class Loader`;
    this.store = store;
  }

  /**
    *   Check if a package can be loaded by this Loader
    *   @param {Storage} Storage object
    *   @returns {boolean} if package can be loaded or not
     */
  // eslint-disable-next-line no-unused-vars


  (0, _createClass3.default)(Loader, [{
    key: "load",


    /**
      *   Load package and return a Task
      *   @returns {Task} resulting task or null if some error occurs
       */
    value: function load() {
      throw "Load function not implemented in " + this.constructor.name;
    }
  }], [{
    key: "isLoadable",
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(store) {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                throw "Auto-detection not implemented in " + this.name;

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function isLoadable(_x) {
        return _ref.apply(this, arguments);
      }

      return isLoadable;
    }()
  }]);
  return Loader;
}();

var JudeLoader = function (_Loader) {
  (0, _inherits3.default)(JudeLoader, _Loader);

  function JudeLoader() {
    (0, _classCallCheck3.default)(this, JudeLoader);
    return (0, _possibleConstructorReturn3.default)(this, (JudeLoader.__proto__ || (0, _getPrototypeOf2.default)(JudeLoader)).apply(this, arguments));
  }

  (0, _createClass3.default)(JudeLoader, [{
    key: "getTestcases",


    /**
      *   Get paths for the tests of dataset
      *   @param {string} dataset directory
      *   @returns {Object[]} tests found
       */
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(datasetPath) {
        var testsPath, inputs, res, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, input, output;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                testsPath = path.join("tests", datasetPath);
                _context2.next = 3;
                return this.store.glob(path.join(testsPath, "/*.in"));

              case 3:
                inputs = _context2.sent.sort();
                res = [];
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context2.prev = 8;
                _iterator = (0, _getIterator3.default)(inputs);

              case 10:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context2.next = 22;
                  break;
                }

                input = _step.value;
                output = input.replace(/\.in$/, ".out");
                // eslint-disable-next-line no-await-in-loop

                _context2.next = 15;
                return this.store.isReadable(output);

              case 15:
                if (_context2.sent) {
                  _context2.next = 18;
                  break;
                }

                logger.error("[%s] test %s should exist", JudeLoader.name, output);
                throw "Missing output file in dataset";

              case 18:

                res.push({
                  in: input,
                  out: output
                });

              case 19:
                _iteratorNormalCompletion = true;
                _context2.next = 10;
                break;

              case 22:
                _context2.next = 28;
                break;

              case 24:
                _context2.prev = 24;
                _context2.t0 = _context2["catch"](8);
                _didIteratorError = true;
                _iteratorError = _context2.t0;

              case 28:
                _context2.prev = 28;
                _context2.prev = 29;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 31:
                _context2.prev = 31;

                if (!_didIteratorError) {
                  _context2.next = 34;
                  break;
                }

                throw _iteratorError;

              case 34:
                return _context2.finish(31);

              case 35:
                return _context2.finish(28);

              case 36:
                if (!(res.length === 0)) {
                  _context2.next = 39;
                  break;
                }

                logger.error("[%s] dataset %s is empty", JudeLoader.name, datasetPath);
                throw "Dataset has no tests";

              case 39:
                return _context2.abrupt("return", res);

              case 40:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[8, 24, 28, 36], [29,, 31, 35]]);
      }));

      function getTestcases(_x2) {
        return _ref2.apply(this, arguments);
      }

      return getTestcases;
    }()

    /**
      * Returns parsed datasets given their properties in datasets
      * @param {Object[]} datasets to be parsed in Jude format
      * @throws if data is inconsistent
       */

  }, {
    key: "parseDatasets",
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(datasets) {
        var res, percentageSum, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, dataset, cur;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(!datasets || datasets.length === 0)) {
                  _context3.next = 3;
                  break;
                }

                logger.error("[%s] package has no dataset", JudeLoader.name);
                throw "Package has no dataset";

              case 3:
                res = [];
                percentageSum = 0;
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context3.prev = 8;
                _iterator2 = (0, _getIterator3.default)(datasets);

              case 10:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context3.next = 24;
                  break;
                }

                dataset = _step2.value;
                _context3.t0 = dataset.name || dataset.path;
                _context3.t1 = dataset.percentage || 0;
                _context3.next = 16;
                return this.getTestcases(dataset.path);

              case 16:
                _context3.t2 = _context3.sent;
                cur = {
                  name: _context3.t0,
                  percentage: _context3.t1,
                  testcases: _context3.t2
                };


                cur.checkerParams = dataset.checkerParams || cur.name;

                percentageSum += cur.percentage;
                res.push(cur);

              case 21:
                _iteratorNormalCompletion2 = true;
                _context3.next = 10;
                break;

              case 24:
                _context3.next = 30;
                break;

              case 26:
                _context3.prev = 26;
                _context3.t3 = _context3["catch"](8);
                _didIteratorError2 = true;
                _iteratorError2 = _context3.t3;

              case 30:
                _context3.prev = 30;
                _context3.prev = 31;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 33:
                _context3.prev = 33;

                if (!_didIteratorError2) {
                  _context3.next = 36;
                  break;
                }

                throw _iteratorError2;

              case 36:
                return _context3.finish(33);

              case 37:
                return _context3.finish(30);

              case 38:
                if (!(Math.abs(percentageSum - 1) > utils.EPS)) {
                  _context3.next = 41;
                  break;
                }

                logger.error("[%s] datasets percentages should sum to 1", JudeLoader.name);
                throw "Datasets percentages do not sum to 1";

              case 41:
                return _context3.abrupt("return", res);

              case 42:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[8, 26, 30, 38], [31,, 33, 37]]);
      }));

      function parseDatasets(_x3) {
        return _ref3.apply(this, arguments);
      }

      return parseDatasets;
    }()

    /**
      *   Get a {Task} object correspondent to the loaded Jude file
      *   @param {string} loaded Jude file
      *   @returns {Task} task loaded or null if some error occurred
       */

  }, {
    key: "getTask",
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(cfg) {
        var lims, checks, multiplier, ratio, attr;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                lims = cfg.limits || {};
                checks = cfg.checker || {};
                multiplier = lims.timeMultiplier || 1;
                ratio = lims.timeApproximation || 500;
                _context4.t0 = cfg.weight || 1;
                _context4.next = 7;
                return this.parseDatasets(cfg.datasets);

              case 7:
                _context4.t1 = _context4.sent;
                _context4.t2 = cfg.scoring || "ProductScoring";
                _context4.t3 = cfg.author || "";
                _context4.t4 = {
                  // in ms
                  time: lims.time ? Math.ceil(lims.time * multiplier / ratio) * ratio : 1000,
                  memory: lims.memory || 256,
                  source: lims.source || 500
                };
                _context4.t5 = [];
                _context4.t6 = {
                  language: (checks.language || "cpp").toUpperCase(),
                  path: checks.path || "checker.cpp"
                };
                _context4.t7 = cfg.statement || null;
                attr = {
                  weight: _context4.t0,
                  datasets: _context4.t1,
                  scoring: _context4.t2,
                  author: _context4.t3,
                  limits: _context4.t4,
                  blockedLanguages: _context4.t5,
                  checker: _context4.t6,
                  statement: _context4.t7
                };

                if (!(!attr.scoring || !scoring.hasOwnProperty(attr.scoring))) {
                  _context4.next = 18;
                  break;
                }

                logger.error("[%s] scoring type %s does not exist", JudeLoader.name, attr.scoring);
                return _context4.abrupt("return", null);

              case 18:
                _context4.t8 = attr.statement;

                if (!_context4.t8) {
                  _context4.next = 23;
                  break;
                }

                _context4.next = 22;
                return this.store.isReadable(attr.statement);

              case 22:
                _context4.t8 = !_context4.sent;

              case 23:
                if (!_context4.t8) {
                  _context4.next = 26;
                  break;
                }

                logger.error("[%s] statement was specified but could not be find in %s", JudeLoader.name, attr.statement);
                return _context4.abrupt("return", null);

              case 26:
                _context4.next = 28;
                return this.store.isReadable(attr.checker.path);

              case 28:
                if (_context4.sent) {
                  _context4.next = 31;
                  break;
                }

                logger.error("[%s] checker could not be found in %s", JudeLoader.name, attr.checker.path);
                return _context4.abrupt("return", null);

              case 31:
                return _context4.abrupt("return", new task.Task(attr));

              case 32:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getTask(_x4) {
        return _ref4.apply(this, arguments);
      }

      return getTask;
    }()
  }, {
    key: "load",
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
        var cfg;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.constructor.isLoadable(this.store);

              case 2:
                if (_context5.sent) {
                  _context5.next = 5;
                  break;
                }

                logger.error("[%s] package is not loadable or does not exist", JudeLoader.name);
                return _context5.abrupt("return", null);

              case 5:
                _context5.prev = 5;
                _context5.t0 = YAML;
                _context5.next = 9;
                return this.store.getFileString(JUDE_FN);

              case 9:
                _context5.t1 = _context5.sent;
                cfg = _context5.t0.parse.call(_context5.t0, _context5.t1);
                return _context5.abrupt("return", this.getTask(cfg));

              case 14:
                _context5.prev = 14;
                _context5.t2 = _context5["catch"](5);

                logger.error("[%s] package could not be read or parsed", JudeLoader.name);
                logger.debug(_context5.t2);
                return _context5.abrupt("return", null);

              case 19:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[5, 14]]);
      }));

      function load() {
        return _ref5.apply(this, arguments);
      }

      return load;
    }()
  }], [{
    key: "isLoadable",
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(store) {
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", store.isReadable(JUDE_FN));

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function isLoadable(_x5) {
        return _ref6.apply(this, arguments);
      }

      return isLoadable;
    }()
  }]);
  return JudeLoader;
}(Loader);

/**
* Contains the loaders available for use
* They can be accessed by their names
 */


var LOADERS = new _map2.default([
// add loaders here in the following format
[JudeLoader.name, JudeLoader]]);module.exports = {
  Loader: Loader,
  JudeLoader: JudeLoader,
  autoDetect: autoDetect,
  LOADERS: LOADERS
};

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _getIterator2 = __webpack_require__(0);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = __webpack_require__(2);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(3);

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by rsalesc on 14/06/16.
 */

var scoring = __webpack_require__(25);
var deepcopy = __webpack_require__(48);

var Task = function () {
  function Task(attr) {
    (0, _classCallCheck3.default)(this, Task);

    this.attr = attr;
  }

  // function to check if task is valid

  /**
     * Get scoring class
     */


  (0, _createClass3.default)(Task, [{
    key: "getScoringClass",
    value: function getScoringClass() {
      return scoring[this.attr.scoring];
    }

    /**
       * Get scoring
       */

  }, {
    key: "getScoring",
    value: function getScoring() {
      return new (this.getScoringClass())(this);
    }

    /*
      *   Get task directory
      *   @returns {string} task directory
       */

  }, {
    key: "getDirectory",
    value: function getDirectory() {
      return this.attr.wd;
    }

    /*
      *   Get checker path
      *   @returns {string} checker path
       */

  }, {
    key: "getChecker",
    value: function getChecker() {
      return this.attr.checker.path;
    }

    /*
      *   Get checker language
      *   @returns {string} checker language
       */

  }, {
    key: "getCheckerLanguage",
    value: function getCheckerLanguage() {
      return this.attr.checker.language;
    }

    /*
      *   Get datasets
       */

  }, {
    key: "getDatasets",
    value: function getDatasets() {
      return this.attr.datasets;
    }

    /*
      *   Get count of datasets
       */

  }, {
    key: "getDatasetsCount",
    value: function getDatasetsCount() {
      try {
        return this.attr.datasets.length;
      } catch (e) {
        return 0;
      }
    }

    /*
      *   Get timelimit (in secs)
       */

  }, {
    key: "getTimelimit",
    value: function getTimelimit() {
      try {
        return this.attr.limits.time / 1000;
      } catch (e) {
        return 1.0;
      }
    }
  }, {
    key: "getTimelimitMs",
    value: function getTimelimitMs() {
      return this.attr.limits.time;
    }

    /*
      *   Get memory limit (in MB)
       */

  }, {
    key: "getMemorylimit",
    value: function getMemorylimit() {
      try {
        return this.attr.limits.memory;
      } catch (e) {
        return 256;
      }
    }
  }, {
    key: "getWeight",
    value: function getWeight() {
      return this.weight || this.attr.weight || 1;
    }
  }, {
    key: "getDataset",
    value: function getDataset(index) {
      var datasets = this.getDatasets();
      if (index >= datasets.length) return null;

      return datasets[index];
    }
  }, {
    key: "getDatasetFromName",
    value: function getDatasetFromName(name) {
      var datasets = this.getDatasets();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(datasets), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var dataset = _step.value;

          if (dataset.name === name) return dataset;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return null;
    }

    /**
       * @return {Boolean} if task has a statement specified in package
       */

  }, {
    key: "hasStatement",
    value: function hasStatement() {
      return Boolean(this.attr.statement);
    }
  }, {
    key: "getStatement",
    value: function getStatement() {
      if (!this.attr.statement) return null;
      return this.attr.statement;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      var res = deepcopy(this.attr);
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(res.datasets), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var dataset = _step2.value;

          delete dataset.testcases;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return res;
    }
  }]);
  return Task;
}();

module.exports = { Task: Task };

/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = require("deepcopy");

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = require("yamljs");

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _keys = __webpack_require__(8);

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = __webpack_require__(0);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = __webpack_require__(2);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(3);

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var process = __webpack_require__(19);

function getSeconds(tuple) {
  return tuple[0] + tuple[1] / 1e9;
}

var Profiler = function () {
  function Profiler() {
    (0, _classCallCheck3.default)(this, Profiler);

    this.start = {};
    this.acc = {};
  }

  (0, _createClass3.default)(Profiler, [{
    key: "fire",
    value: function fire() {
      var task = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "default";

      if (!this.acc.hasOwnProperty(task)) this.acc[task] = 0;
      this.start[task] = process.hrtime();
    }
  }, {
    key: "reset",
    value: function reset() {
      var task = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "default";

      this.acc[task] = 0;
      this.start[task] = process.hrtime();
    }
  }, {
    key: "elapsed",
    value: function elapsed() {
      var task = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "default";

      var started = this.start[task];
      return this.acc[task] + (started ? getSeconds(process.hrtime(started)) : 0);
    }
  }, {
    key: "stop",
    value: function stop() {
      var task = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "default";

      this.acc[task] = this.elapsed(task);
      this.start[task] = null;
    }
  }, {
    key: "dump",
    value: function dump() {
      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : console.log;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(this.acc)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var task = _step.value;

          cb(task + ": " + this.elapsed(task));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }]);
  return Profiler;
}();

module.exports = Profiler;

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable */
var path = __webpack_require__(1),
    fs = __webpack_require__(17),
    mongoose = __webpack_require__(4);
// files = fs.readdirSync(__dirname);

__webpack_require__(22);

/* files.forEach(function(file) {
    var name = path.basename(file, '.js');
    if (name === 'index')
        return;

    var mod = require('./' + name);
    module.exports[name] = mod();
});*/

module.exports = {
  Contest: __webpack_require__(52)(),
  User: __webpack_require__(55)(),
  Submission: __webpack_require__(57)(),
  Problem: __webpack_require__(26)(),
  Clarification: __webpack_require__(58)(),
  Printout: __webpack_require__(59)()
};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _set = __webpack_require__(53);

var _set2 = _interopRequireDefault(_set);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by rsalesc on 14/07/16.
 */
var mongoose = __webpack_require__(4);
var deepPopulate = __webpack_require__(54)(mongoose);
var Schema = mongoose.Schema;


module.exports = function () {
  if (db.models.Contest) return db.model("Contest");

  var Problem = __webpack_require__(26)();

  var ContestProblem = new Schema({
    letter: {
      type: String,
      required: true,
      match: /[A-Z][0-9]*/
    },
    problem: { type: Schema.Types.ObjectId, ref: "Problem", required: true },
    color: { type: String, default: "000" }
  }, { _id: false });

  var ContestSchema = new Schema({
    name: { type: String, minlength: 4, maxlength: 64 },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    scoring: { type: String, required: true },
    problems: {
      type: [ContestProblem],
      validate: {
        validator: function validator(v) {
          if (!Array.isArray(v)) return false;
          var letters = v.map(function (val) {
            return val.letter;
          });

          return new _set2.default(letters).size === letters.length;
        },

        message: "Contest cannot have repeated letters and problems must be an array"
      }
    },
    hidden: Boolean,
    upseeing: { type: Boolean, required: true, default: false },
    blind: { type: Number, default: 0 },
    freeze: { type: Number, default: 0 },
    unfreeze: { type: Boolean, default: false }
  }, { timestamps: true });

  ContestSchema.index({ name: 1 });
  ContestSchema.index({ name: "text" });
  ContestSchema.plugin(deepPopulate);

  ContestSchema.pre("save", function (next) {
    this.problems.sort(function (a, b) {
      try {
        return function (x, y) {
          var xd = parseInt(x.slice(1), 10) || 0;
          var yd = parseInt(y.slice(1), 10) || 0;

          if (x[0] === y[0]) return xd < yd ? -1 : xd > yd ? 1 : 0;

          return x[0] < y[0] ? -1 : 1;
        }(a.letter, b.letter);
      } catch (ex) {
        return false;
      }
    });

    next();
  });

  ContestSchema.methods.hasStarted = function () {
    return this.start_time.getTime() <= Date.now();
  };

  ContestSchema.methods.hasEnded = function () {
    return this.end_time.getTime() <= Date.now();
  };

  ContestSchema.methods.isRunning = function () {
    return this.hasStarted() && !this.hasEnded();
  };

  ContestSchema.methods.getTimeInContest = function (x) {
    var cur = x != null ? x : Date.now();
    return parseInt((cur - this.start_time.getTime()) / 60 / 1000, 10);
  };

  ContestSchema.methods.getDurationInContest = function () {
    var diff = this.end_time.getTime() - this.start_time.getTime();
    return parseInt(Math.ceil(diff / 60 / 1000), 10);
  };

  ContestSchema.methods.getRemainingInContest = function (x) {
    return this.getDurationInContest() - (x != null ? x : this.getTimeInContest());
  };

  ContestSchema.methods.isFrozen = function (x) {
    return this.getRemainingInContest(x) <= this.freeze && (this.isRunning() || this.hasEnded() && !this.unfreeze && this.freeze > 0);
  };

  ContestSchema.methods.isBlind = function (x) {
    return this.getRemainingInContest(x) <= this.blind && (this.isRunning() || this.hasEnded() && !this.unfreeze && this.blind > 0);
  };

  ContestSchema.pre("remove", function (next) {
    db.model("Submission").remove({ contest: this._id }, function (err) {
      if (err) console.error(err);
    });
    db.model("User").remove({ contest: this._id }, function (err) {
      if (err) console.error(err);
    });
    db.model("Clarification").remove({ contest: this._id }, function (err) {
      if (err) console.error(err);
    });
    db.model("Printout").remove({ contest: this._id }, function (err) {
      if (err) console.error(err);
    });
    next();
  });

  return db.model("Contest", ContestSchema);
};

/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/set");

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = require("mongoose-deep-populate");

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by rsalesc on 14/07/16.
 */
var mongoose = __webpack_require__(4);
var Schema = mongoose.Schema;
var sha256 = __webpack_require__(56);

module.exports = function () {
    if (db.models.User) return db.model("User");

    var UserSchema = new Schema({
        handle: {
            type: String,
            minlength: 4,
            maxlength: 16,
            match: /[a-zA-Z][a-zA-Z0-9_\.]*/,
            required: true
        },
        name: {
            type: String,
            maxlength: 48,
            default: "unnamed"
        },
        description: String,
        password: { type: String },
        email: {
            type: String,
            maxlength: 64
            // TODO: put email regex here
        },
        contest: { type: Schema.Types.ObjectId, ref: 'Contest' },
        unofficial: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        role: { type: String, default: "contestant" }
    }, { timestamps: true });

    UserSchema.index({ handle: 1, contest: 1 }, { unique: true });
    UserSchema.index({ handle: 'text', name: 'text' }, {
        weights: {
            handle: 2,
            name: 1
        }
    });

    UserSchema.pre('save', function (next) {
        if (this.isModified('password')) {
            this.password = sha256(this.password);
        }

        next();
    });

    UserSchema.methods.matchPasswords = function (candidate) {
        return this.password == sha256(candidate);
    };

    UserSchema.pre("remove", function (next) {
        db.model("Submission").remove({ _creator: this._id }, function (err) {
            if (err) console.error(err);
        });
        next();
    });

    return db.model('User', UserSchema);
};

/***/ }),
/* 56 */
/***/ (function(module, exports) {

module.exports = require("sha256");

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _getIterator2 = __webpack_require__(0);

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by rsalesc on 15/07/16.
 */

var mongoose = __webpack_require__(4);
var Schema = mongoose.Schema;


var DEFAULT_VERDICT = {
  verdict: "", info: "", passed: -1, score: 0
};

// TODO: add creation time (with a plugin)
module.exports = function () {
  if (db.models.Submission) return db.model("Submission");

  var SubmissionSchema = new Schema({
    _creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    contest: { type: Schema.Types.ObjectId, ref: "Contest" },
    problem: { type: Schema.Types.ObjectId, ref: "Problem", required: true },
    time: { type: Date, default: Date.now },
    timeInContest: { type: Number, default: 0 },
    // add enum validator? maybe not, language set is mutable
    language: String,
    code: String,
    codeHash: { type: String, default: "" },
    verdict: Schema.Types.Mixed
  }, { timestamps: true });

  SubmissionSchema.index({ contest: 1, _creator: 1 });
  SubmissionSchema.index({ contest: 1, problem: 1 });
  SubmissionSchema.index({ contest: 1, time: 1 });
  SubmissionSchema.index({ contest: 1, timeInContest: 1 });
  SubmissionSchema.index({ problem: 1, _creator: 1 });
  SubmissionSchema.index({ _creator: 1 });

  SubmissionSchema.pre("save", function (next) {
    var _this = this;

    if (this.problem) {
      db.model("Problem").findById(this.problem).exec(function (err, problem) {
        if (err) next(err);
        _this.verdict = _this.verdict || {};
        var res = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)(problem.attr.datasets), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var data = _step.value;

            res[data.name] = _this.verdict[data.name] || DEFAULT_VERDICT;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        _this.verdict = res;
        next();
      });
    }
  });

  return db.model("Submission", SubmissionSchema);
};

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mongoose = __webpack_require__(4);
var Schema = mongoose.Schema;


module.exports = function () {
  if (db.models.Clarification) return db.model("Clarification");

  var CommentSchema = new Schema({
    _creator: { type: Schema.Types.ObjectId, ref: "User" },
    text: String
  }, { timestamps: true });

  var ClarificationSchema = new Schema({
    _creator: { type: Schema.Types.ObjectId, ref: "User" },
    contest: { type: Schema.Types.ObjectId, ref: "Contest" },
    problem: { type: Schema.Types.ObjectId, ref: "Problem" },
    broadcast: { type: Boolean, default: false },
    comments: [CommentSchema]
  }, { timestamps: true });

  ClarificationSchema.index({ _creator: 1, contest: 1 });
  ClarificationSchema.index({ contest: 1, broadcast: 1 });

  return db.model("Clarification", ClarificationSchema);
};

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mongoose = __webpack_require__(4);
var Schema = mongoose.Schema;


module.exports = function () {
  if (db.models.Printout) return db.model("Printout");

  var PrintoutSchema = new Schema({
    _creator: { type: Schema.Types.ObjectId, ref: "User" },
    contest: { type: Schema.Types.ObjectId, ref: "Contest" },
    text: String,
    lines: Number,
    done: Boolean
  }, { timestamps: true });

  PrintoutSchema.index({ _creator: 1, contest: 1 });

  return db.model("Printout", PrintoutSchema);
};

/***/ })
/******/ ]);
//# sourceMappingURL=judge.bundle.js.map