var gulp = require('gulp');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var del = require('del');

//Image compression
var imagemin = require('gulp-imagemin');
var imageminPngquant = require('imagemin-pngquant');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');

//File paths
var DIST_PATH = 'public/dist';
var SCRIPTS_PATH = 'public/scripts/**/*.js';
var CSS_PATH = 'public/css/**/*.css';
var IMAGES_PATH = 'public/images/**/*.{png,jpeg,jpg,svg,gif}';

// Styles (without scss)
// gulp.task('styles', function() {
//   return gulp.src([
//     'public/css/reset.css',
//     CSS_PATH
//   ]).pipe(plumber(function(err) {
//       console.log('Styles Task Error');
//       console.log(err);
//       this.emit('end');
//     }))
//     .pipe(sourcemaps.init())
//     .pipe(autoprefixer())
//     .pipe(concat('styles.css'))
//     .pipe(minifyCss())
//     .pipe(sourcemaps.write())
//     .pipe(gulp.dest(DIST_PATH))
//     .pipe(livereload());
// });

// Styles (with scss)
gulp.task('styles', function() {
  return gulp.src('public/scss/styles.scss')
    .pipe(plumber(function(err) {
      console.log('Styles Task Error');
      console.log(err);
      this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload());
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src(SCRIPTS_PATH)
    .pipe(plumber(function(err) {
      console.log('Scripts Task Error');
      console.log(err);
      this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(concat('scripts.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload());
});

// Images
gulp.task('images', function() {
  return gulp.src(IMAGES_PATH)
    .pipe(imagemin(
      [
        imagemin.gifsicle(),
        imagemin.jpegtran(),
        imagemin.optipng(),
        imagemin.svgo(),
        imageminPngquant(),
        imageminJpegRecompress()
      ]
    ))
    .pipe(gulp.dest(DIST_PATH + '/images'));
});

gulp.task('clean', function() {
  return del.sync([
    DIST_PATH
  ]);
});

gulp.task('default', ['clean', 'images', 'styles', 'scripts'], function() {
  console.log('Starting default task');
});

gulp.task('watch', ['default'], function() {
  console.log('Starting watch task');
  require('./server.js');
  livereload.listen();
  gulp.watch(SCRIPTS_PATH, ['scripts'])
  // gulp.watch(CSS_PATH, ['styles']); for non-scss
  gulp.watch('public/scss/**/*.scss', ['styles']);
});
