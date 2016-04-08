'use strict';

var gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  rename = require('gulp-rename'),
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  cleanCSS  = require('gulp-clean-css'),
  sass = require('gulp-sass'),
  mainBowerFiles = require('gulp-main-bower-files'),
  order = require('gulp-order'),
  filter = require('gulp-filter'),
  browserSync = require('browser-sync'),
  nodemon = require('gulp-nodemon'),
  browserify = require("browserify"),
  babelify = require("babelify"),
  source = require("vinyl-source-stream");

var BROWSER_SYNC_RELOAD_DELAY = 500;

gulp.task('nodemon', function(cb) {
  var called = false;
  return nodemon({
    script: './bin/www',
    ext: 'jade',
    ignore: ["node_modules","bower_components","gulpfile.js","public/*","app/*"],
    env: { 'NODE_ENV': 'development','DEBUG':'js-task-singree:*' }
    //watch: ['app.js']
  })
    .on('start', function onStart() {
      // ensure start only got called once
      if (!called) { cb(); }
      called = true;
    })
    .on('restart', function onRestart() {
      // reload connected browsers after a slight delay
      setTimeout(function reload() {
        browserSync.reload({
          stream: false
        });
      }, BROWSER_SYNC_RELOAD_DELAY);
    });
});

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync({
    proxy: 'http://localhost:3000',
    port: 4000,
    browser: ['chrome']
  });
});

gulp.task('react', () =>
  browserify({
    entries: './app/app.jsx',
    extensions: ['.jsx'],
    debug: true
  })
  .transform(babelify, {
    presets: ['es2015', 'react']
  })
  .bundle()
  .on('error', function(err) { console.error(err); this.emit('end'); })
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('public/js/'))
);

gulp.task('images', function() {
  gulp.src(['src/images/**/*.*'])
    .pipe(gulp.dest('public/images/'))
});

gulp.task('css', function() {
  gulp.src(['src/css/**/*.sass'])
    .pipe(plumber({
      errorHandler: function(error) {
        console.log(error.message);
        this.emit('end');
      }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cleanCSS())
    .pipe(gulp.dest('public/css/'))
});

gulp.task('js', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
      }}))
    .pipe(concat('main.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('public/js/'))
});

gulp.task('main-bower-files-js', function() {
  var filterJS = filter('**/*.js', { restore: true });
  return gulp.src('./bower.json')
    .pipe(mainBowerFiles({
      overrides: {
        bootstrap: {
          main: [
            './dist/js/bootstrap.js',
          ]
        }
      }
    }))
    .pipe(filterJS)
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});
gulp.task('main-bower-files-font', function() {
  return gulp.src([
      'bower_components/bootstrap/fonts/*.{eot,svg,ttf,woff,woff2}'])
    .pipe(gulp.dest('public/fonts'));
});
gulp.task('main-bower-files-css', function() {
  var filterCss = filter('**/*.css', { restore: true });
  return gulp.src('./bower.json')
    .pipe(mainBowerFiles({
      overrides: {
        bootstrap: {
          main: [
            './dist/css/bootstrap.min.css'
          ]
        }
      }
    }))
    .pipe(filterCss)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('public/css'));
});

gulp.task('bs-reload', function() {
  browserSync.reload();
});

gulp.task('build', ['images','js','css','main-bower-files-js','main-bower-files-css','main-bower-files-font','react']);

gulp.task('default', ['images','browser-sync','main-bower-files-js','main-bower-files-css','main-bower-files-font','react','js','css'], function() {
  gulp.watch('src/js/**/*.js',   ['js', 'bs-reload']);
  gulp.watch('src/css/**/*.sass',['css','bs-reload']);
  gulp.watch('app/**/*.jsx', ['react']);
  gulp.watch('public/js/bundle.js', ['bs-reload']);
});
