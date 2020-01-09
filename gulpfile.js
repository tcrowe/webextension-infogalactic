const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cssnano = require("gulp-cssnano");
const gulpif = require("gulp-if");
const plumber = require("gulp-plumber");
const stylus = require("gulp-stylus");
const sourcemaps = require("gulp-sourcemaps");
const chalk = require("chalk");
const isNil = require("lodash/isNil");
const isString = require("lodash/isString");
const { NODE_ENV } = process.env;
const isDev = NODE_ENV === "development";
const isPrd = NODE_ENV === "production";
let webpack;
let bundlerConfig;
let bundler;

const patterns = {
  staticFiles: "src/{popup.html,manifest.json,favicon.ico}",
  js: "src/**/*.js",
  styl: "src/**/*.styl"
};

const staticFiles = () =>
  gulp.src(patterns.staticFiles).pipe(gulp.dest("dist"));

const styles = () =>
  gulp
    .src("src/index.styl")
    .pipe(plumber())
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(stylus())
    .pipe(autoprefixer())
    .pipe(gulpif(isPrd, cssnano()))
    .pipe(gulpif(isDev, sourcemaps.write(".")))
    .pipe(gulp.dest("dist"));

function bundlerInit(done) {
  webpack = require("webpack");
  bundlerConfig = require("./webpack.config");
  bundler = webpack(bundlerConfig);
  done();
}

function bundle(done) {
  bundler.run(function(err, stats) {
    if (isNil(err) === false) {
      console.error("error bundling");
      console.log("err.message", err.message);
      console.log("err.stack", err.stack);
    }

    if (isNil(stats) === false) {
      if (stats.hasErrors() === true) {
        stats.toJson().errors.forEach(function(item) {
          console.log(chalk.red("bundle error"));

          if (isString(item) === true) {
            console.error(item);
          }

          if (isString(item.moduleId) === true) {
            console.error(item.moduleId);
          }

          if (isString(item.message) === true) {
            console.error(item.message);
          }
        });
      }

      if (stats.hasWarnings() === true) {
        stats.toJson().warnings.forEach(function(item) {
          console.warn(chalk.yellow("bundle warning"), item);
        });
      }
    }

    done();
  });
}

function watch() {
  gulp.watch(patterns.staticFiles, gulp.series([staticFiles]));
  gulp.watch(patterns.styl, gulp.series([styles]));
  gulp.watch(patterns.js, gulp.series([bundle]));
}

const dev = gulp.series([staticFiles, styles, bundlerInit, bundle, watch]);
const prd = gulp.series([staticFiles, styles, bundlerInit, bundle]);

module.exports = { staticFiles, styles, bundlerInit, bundle, watch, dev, prd };
