'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _transform = require('readable-stream/transform');

var _transform2 = _interopRequireDefault(_transform);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _concatStream = require('concat-stream');

var _concatStream2 = _interopRequireDefault(_concatStream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var doAppend = function doAppend(original, str, index) {
  var outputString = void 0;
  if (index < 0 || index >= original.length - 1) {
    outputString = original.concat(str);
  } else if (index === 0) {
    outputString = str.concat(original);
  } else {
    outputString = [original.substring(0, index), str, original.substring(index)].join('');
  }

  return outputString;
};

var append = function append() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var index = _lodash2.default.isNumber(options) ? options : options.index || -1;

  return new _transform2.default({
    objectMode: true,
    transform: function transform(file, encoding, done) {
      if (file.isNull()) {
        return done(null, file);
      }

      if (file.isStream()) {
        return file.contents.pipe((0, _concatStream2.default)({
          encoding: 'string'
        }, function (original) {
          file.contents = new _transform2.default();
          file.contents.write(doAppend(original, str, index));
          file.contents.end();

          return done(null, file);
        }));
      } else if (file.isBuffer()) {
        var original = String(file.contents);
        file.contents = new Buffer(doAppend(original, str, index));

        return done(null, file);
      }

      return done(null, file);
    }
  });
};

module.exports = append;
exports.default = append;