var gulp = require('gulp');
var shell = require('gulp-shell');
var fs = require('fs');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');
var _ = require('lodash');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var config = {
  entryFile: './src/app.js',
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

gulp.task('js-doc', function() {
 // process.stdout.write('[js-doc]\n')
  shell.task(['node_modules/jsdoc/jsdoc src/.'])
});

gulp.task('copyfiles', ['js-doc'], function() {
  //process.stdout.write('[copyfiles]\n')
  gulp.src('./src/**/*.{html,css}').pipe(gulp.dest(config.outputDir));
});

gulp.task('build-persistent', ['copyfiles'], function() {
  //process.stdout.write('[build-persistent]\n')
  return bundle();
});

gulp.task('build', ['build-persistent', 'copyfiles'], function() {
  //process.stdout.write('[build]\n')
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

  gulp.watch('src/**/*.html', ['copyfiles'])
  gulp.watch('src/**/*.css', ['copyfiles'])

});

// WEB SERVER
gulp.task('serve', function () {
  browserSync({
    server: {
      baseDir: './'
    }
  });
});
