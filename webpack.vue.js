const path = require("path");
const webpack = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CompressionPlugin = require("compression-webpack-plugin");
const BrotliPlugin = require("brotli-webpack-plugin");

module.exports = {
  // entry point of our application
  entry: ["./src/bulma/index.js"],
  // where to place the compiled bundle
  output: {
    path: path.join(__dirname, "/public/js/bulma"),
    filename: "bulma-site.js"
  },
  module: {
    // `loaders` is an array of loaders to use.
    // here we are only configuring vue-loader
    loaders: [
      {
        test: /\.tpl$/,
        loader: "raw-loader"
      },
      {
        test: /\.vue$/, // a regex for matching all files that end in `.vue`
        loader: "vue-loader", // loader to use for matched files,
        options: {
          loaders: {
            scss: "vue-style-loader!css-loader!sass-loader",
            sass: "vue-style-loader!css-loader!sass-loader?indentedSyntax"
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        // include: /node_modules[/\\]vue-paginate/,
        loader: "babel-loader",
        options: {
          presets: [["env", { modules: false, loose: true }]],
          plugins: ["transform-runtime"]
        }
      },
      // maybe its load too much CSS?
      { test: /\.css$/, loader: "style-loader!css-loader" },
      {
        test: /\.s(c|a)ss$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }, { loader: "sass-loader" }]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader",
        query: {
          name: "assets/[name].[ext]",
          publicPath: "/static-jude/js/bulma/"
        }
      }
    ]
  },
  resolve: { alias: { vue$: path.join(__dirname, "node_modules/vue/dist/vue.js") }},
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en-gb/),
    new webpack.ContextReplacementPlugin(/brace[/\\]theme$/, /github/),
    new webpack.ContextReplacementPlugin(/brace[/\\]mode$/, /(c_cpp|java|python)/),
    new webpack.optimize.UglifyJsPlugin(),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.(js|html|css|svg|woff(2)?|ttf|eot)$/,
      threshold: 10 * 1024
    }),
    new BrotliPlugin({
      asset: "[path].br[query]",
      test: /\.(js|html|css|svg|woff(2)?|ttf|eot)$/,
      threshold: 10 * 1024
    })
  ]
};
