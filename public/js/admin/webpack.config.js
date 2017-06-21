const path = require('path');

module.exports = {
    // entry point of our application
    entry: ['./admin.js'],
    // where to place the compiled bundle
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    module: {
        // `loaders` is an array of loaders to use.
        // here we are only configuring vue-loader
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'stage-0'],
                    plugins: ['transform-runtime']
                }
            },
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    }
}