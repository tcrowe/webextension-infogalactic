/*

# webpack config

https://webpack.js.org
https://webpack.js.org/configuration

*/

const path = require("path");
let env = process.env.NODE_ENV;
const isDev = env === "development";
let isPrd = env === "production";
const srcPath = path.join(__dirname, "src");
const backgroundPath = path.join(srcPath, "background.js");
const popupPath = path.join(srcPath, "popup.js");
const distPath = path.join(__dirname, "dist");

if (env !== "development") {
  env = "production";
  isPrd = true;
}

const opts = {
  target: "web",
  mode: env,
  entry: {
    background: backgroundPath,
    popup: popupPath
  },
  output: {
    path: distPath,
    filename: "[name].js"
  },
  watch: false,
  cache: isDev,
  performance: {
    hints: false
  },
  stats: {
    assets: false,
    colors: isDev,
    errors: true,
    errorDetails: true,
    hash: false
  }
};

if (isDev === true) {
  opts.devtool = "source-map";
}

if (isPrd === true) {
  opts.optimization = { minimize: true };
}

module.exports = opts;
