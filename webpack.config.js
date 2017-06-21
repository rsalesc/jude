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
                loader: 'vue-loader',   // loader to use for matched files,
                options: {
                    loaders: {
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            },
            // maybe its load too much CSS?
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    },
    resolve: {
        alias: {
            'vue$': path.join(__dirname, 'node_modules/vue/dist/vue.js')
        }
    }
}