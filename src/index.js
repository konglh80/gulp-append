import Transform from 'readable-stream/transform';
import lodash from 'lodash';
import concatStream from 'concat-stream';

const doAppend = function(original, str, index) {
  let outputString;
  if (index < 0 || index >= original.length - 1) {
    outputString = original.concat(str);
  } else if (index === 0) {
    outputString = str.concat(original);
  } else {
    outputString = [
      original.substring(0, index),
      str,
      original.substring(index)
    ].join('');
  }

  return outputString;
};

const append = function(str = '', options = {}) {
  const index = lodash.isNumber(options) ? options : options.index || -1;

  return new Transform({
    objectMode: true,
    transform(file, encoding, done) {
      if (file.isNull()) {
        return done(null, file);
      }

      if (file.isStream()) {
        return file.contents.pipe(concatStream({
          encoding: 'string'
        }, function(original) {
          file.contents = new Transform();
          file.contents.write(doAppend(original, str, index));
          file.contents.end();

          return done(null, file);
        }));
      } else if (file.isBuffer()) {
        const original = String(file.contents);
        file.contents = new Buffer(doAppend(original, str, index));

        return done(null, file);
      }

      return done(null, file);
    }
  });
};

module.exports = append;
export default append;
