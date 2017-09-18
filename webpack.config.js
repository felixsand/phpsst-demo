let webpack = require('webpack');
let path = require('path');

module.exports = {
    entry: {
        app: './resources/assets/js/app.js'
    },

    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: '[name].js',
        //filename: '[name].[hash].js',
        publicPath: './public'
    },

    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },

    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },

    plugins: []
}

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        })
    );
}
