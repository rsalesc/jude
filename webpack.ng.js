const path = require("path");

module.exports = {
  // entry point of our application
  entry: ["./public/js/admin/admin.js"],
  // where to place the compiled bundle
  output: {
    path: path.join(__dirname, "public/js/admin"),
    filename: "bundle.js"
  },
  module: {
    // `loaders` is an array of loaders to use.
    // here we are only configuring vue-loader
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        query: {
          presets: ["es2015", "es2016", "es2017", "stage-3"],
          plugins: ["transform-runtime"]
        }
      },
      { test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  }
};
