const { src, dest, watch, series, parallel } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sassglob = require('gulp-sass-glob') ;
const autoprefixer = require('gulp-autoprefixer') ;
const cleanCSS = require('gulp-clean-css');
// const imagemin = require('gulp-imagemin');
const del = require('del');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
sass.compiler = require('sass');

const files = {
  html: 'src/**/*.html',
  css: 'src/**/*.css',
  sass: 'src/**/*.scss',
  js: 'src/**/*.js',
  imgs: 'src/images/*',
  assets: 'src/assets/*',
};

function copyhtml() {
  return src(files.html)
    .pipe(plumber())
    .pipe(dest('pub'))
    .pipe(browserSync.stream());
}

function copyAssets() {
  return src(files.assets).pipe(plumber()).pipe(dest('pub/assets'));
}

function jsTask() {
  return src(files.js)
    .pipe(concat('main.js'))
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(uglify())
    .pipe(dest('pub/js'))
    .pipe(browserSync.stream());
}

function imgTask() {
  return (src(files.imgs)
    .pipe(plumber())
    // .pipe(imagemin())
    .pipe(dest('pub/images'))
    .pipe(browserSync.stream())
    );
  }

function cssTask() {
  return src([files.css, 'pub/css/sass-semi-finished.css'])
    .pipe(plumber())
    .pipe(concat('style.css'))
    .pipe(cleanCSS())
    .pipe(autoprefixer('>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 10'))
    .pipe(dest('pub/css'))
    .pipe(browserSync.stream());
}

function sassTask() {
  return src(files.sass)
    .pipe(plumber())
    .pipe(sassglob())
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(concat('sass-semi-finished.css'))
    .pipe(dest('pub/css'))
    .pipe(browserSync.stream());
}

function clean() {
  return del(['pub']);
}

function startServer() {
  browserSync.init({
    server: { baseDir: 'pub/' },
    notify: false,
    online: true,
  });
}

function startwatch() {
  watch([files.html], copyhtml);
  watch([files.sass], series(sassTask, cssTask));
  watch([files.css], cssTask);
  watch([files.js], jsTask);
  watch([files.assets], copyAssets);
}

exports.default = series(clean, parallel(copyhtml, jsTask, imgTask, sassTask), cssTask, parallel(startServer, startwatch));

exports.clean = clean;
exports.sassTask = sassTask;
exports.copyhtml = copyhtml;
exports.jsTask = jsTask;
exports.cssTask = cssTask;
exports.imgTask = imgTask;
exports.copyAssets = copyAssets;
