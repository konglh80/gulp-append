/* eslint-disable no-unused-vars */
const should = require('should');
/* eslint-enable no-unused-vars */
const fs = require('fs');
const File = require('vinyl');
const concatStream = require('concat-stream');
const append = require('../lib');

describe('gulp-append', () => {
  describe('buffered input', () => {
    let file;
    let check;

    beforeEach(function() {
      file = new File({
        path: 'test/fixtures/helloworld.txt',
        contents: fs.readFileSync('test/fixtures/helloworld.txt')
      });

      check = function(stream, callback) {
        stream.on('data', function(newFile) {
          callback(newFile);
        });

        stream.write(file);
        stream.end();
      };
    });

    it('should append string end of the buffer', function(done) {
      const stream = append('foo\n');
      check(stream, function(newFile) {
        String(newFile.contents).should.equal(fs.readFileSync('test/expected/helloworld-end.txt', 'utf8'));
        done();
      });
    });

    it('should append string start of the buffer', function(done) {
      const stream = append('foo\n', 0);
      check(stream, function(newFile) {
        String(newFile.contents).should.equal(fs.readFileSync('test/expected/helloworld-start.txt', 'utf8'));
        done();
      });
    });

    it('should append string at the specified index of the buffer', function(done) {
      const stream = append(' foo', 5);
      check(stream, function(newFile) {
        String(newFile.contents).should.equal(fs.readFileSync('test/expected/helloworld-5.txt', 'utf8'));
        done();
      });
    });
  });

  describe('streamed input', function() {
    let file;
    let check;

    beforeEach(function() {
      file = new File({
        path: 'test/fixtures/helloworld.txt',
        contents: fs.createReadStream('test/fixtures/helloworld.txt')
      });

      check = function(stream, callback) {
        stream.on('data', function(newFile) {
          newFile.contents.pipe(concatStream({
            encoding: 'string'
          }, function(data) {
            callback(data);
          }));
        });

        stream.write(file);
        stream.end();
      };
    });

    it('should append string on a stream', function(done) {
      const stream = append('foo\n');
      check(stream, function(data) {
        data.should.equal(fs.readFileSync('test/expected/helloworld-end.txt', 'utf8'));
        done();
      });
    });

    it('should append string start of the stream', function(done) {
      const stream = append('foo\n', 0);
      check(stream, function(data) {
        data.should.equal(fs.readFileSync('test/expected/helloworld-start.txt', 'utf8'));
        done();
      });
    });

    it('should append string at the specified index of the stream', function(done) {
      const stream = append(' foo', 5);
      check(stream, function(data) {
        data.should.equal(fs.readFileSync('test/expected/helloworld-5.txt', 'utf8'));
        done();
      });
    });
  });
});
