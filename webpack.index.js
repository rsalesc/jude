const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  devtool: "sourcemap",
  // entry point of our application
  entry: ["./index.js"],
  // where to place the compiled bundle
  output: {
    path: path.join(__dirname, "build"),
    filename: "index.bundle.js"
  },
  target: "node",
  module: {
    // `loaders` is an array of loaders to use.
    // here we are only configuring vue-loader
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: {
          presets: ["es2015", "es2016", "es2017", "stage-3"],
          plugins: ["transform-runtime"]
        }
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({ banner: 'require("source-map-support").install();', raw: true, entryOnly: false })
  ],
  externals: [nodeExternals()],
  node: {
    __filename: true,
    __dirname: true
  }
};
