const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const nodemon = require('gulp-nodemon');
const del = require('del');
const mocha = require('gulp-mocha');

gulp.task('clean', function() {
  return del.sync('lib/**');
});

gulp.task('script', function() {
  return gulp.src(['src/**/*.js'])
    .pipe(babel({presets: ['es2015']}))
    .pipe(gulp.dest('lib'));
});

gulp.task('eslint', function() {
  return gulp.src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('dev', function() {
  const options = {
    script: '',
    exec: 'babel-node',
    ignore: [
      'lib/**/*.js',
      'gulpfile.js',
      'node_modules'
    ],
    env: {
      NODE_ENV: 'development'
    }
  };

  const mon = nodemon(options);
  mon.on('start', ['eslint', 'clean', 'script', 'test']);

  return mon;
});

gulp.task('build', ['clean', 'script']);

gulp.task('test', function() {
  gulp.src('test/**/*.js', {read: false})
    // gulp-mocha needs filepaths so you can't have any plugins before it
    .pipe(mocha({reporter: 'nyan'}));
});
