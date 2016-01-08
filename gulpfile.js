var gulp = require('gulp');
var fs = require('fs');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');
var _ = require('lodash');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var config = {
  entryFile: './src/main.js',
  vendorFolder: './src/_libs/',
  outputDir: './dist/',
  outputFile: 'app.js'
};

// clean the output directory
gulp.task('clean', function(cb){
    rimraf(config.outputDir, cb);
});

var bundler;
function getBundler() {
  if (!bundler) {
    bundler = watchify(browserify(config.entryFile, _.extend({ debug: true }, watchify.args)));
  }
  return bundler;
};

function bundle() {
  return getBundler()
    .transform(babelify)
    .bundle()
    .on('error', function(err) { console.log('Error: ' + err.message); })
    .pipe(source(config.outputFile))
    .pipe(gulp.dest(config.outputDir))
    .pipe(reload({ stream: true }));
}

gulp.task('build-persistent', [], function() {
  return bundle();
});

gulp.task('build-vendor', function() {
  return gulp.src([
      config.vendorFolder+'jquery.min.js',
      config.vendorFolder+'underscore.min.js',
      config.vendorFolder+'easeljs.min.js',
      config.vendorFolder+'tween.js'
    ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(config.outputDir));
});

gulp.task('build', ['build-persistent','build-vendor'], function() {
  process.exit(0);
});

gulp.task('watch', ['build-persistent'], function() {

  browserSync({
    server: {
      baseDir: './'
    }
  });

  getBundler().on('update', function() {
    gulp.start('build-persistent')
  });
});

// WEB SERVER
gulp.task('serve', function () {
  browserSync({
    server: {
      baseDir: './'
    }
  });
});
