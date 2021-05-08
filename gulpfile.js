const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const rename = require("gulp-rename");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const ts = require('gulp-typescript');

const dist = './dist'
const src = './src'

const reload = (done) => {
    browserSync.reload();
    done();
}

const serve = (done) => {
    browserSync.init({
        server: {
            baseDir: `${dist}`
        }
    })
    done();
}

const html = () => {
    return gulp.src(`${src}/*.html`)
        .pipe(gulp.dest(`${dist}`));
}

const css = () => {
    return gulp.src(`${src}/**/*.sass`)
        .pipe(sass.sync({outputStyle: 'compressed'})).on('error', sass.logError)
        .pipe(gulp.dest(`${dist}`))
        .pipe(browserSync.stream());
}

const js = () => {
    return gulp.src(`${src}/**/*.ts`)
        .pipe(ts({noImplicitAny: true, outFile: 'main.js'}))
        .pipe(gulp.dest(`${dist}`))
}

const watch = () => gulp.watch(
    [`${src}/*.html`, `${src}/*.sass`],
    gulp.series(js, css, html, reload)
)

const dev = gulp.series(js, css, html, serve, watch);
const build = gulp.series(js, css, html)
  
exports.serve = dev;
exports.build = build;