const path = require('path');

module.exports = {
    // entry point of our application
    entry: ['./src/components/index.js'],
    // where to place the compiled bundle
    output: {
        path: path.join(__dirname, "/public/js"),
        filename: 'components.js'
    },
    module: {
        // `loaders` is an array of loaders to use.
        // here we are only configuring vue-loader
        loaders: [
            {
                test: /\.vue$/, // a regex for matching all files that end in `.vue`
                loader: 'vue'   // loader to use for matched files
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'stage-0'],
                    plugins: ['transform-runtime']
                }
            },
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    },
    resolve: {
        alias: {
            'Vue': path.join(__dirname, 'node_modules/vue')
        }
    }
}