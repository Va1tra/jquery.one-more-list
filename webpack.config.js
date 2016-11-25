var path = require('path');
var webpack = require('webpack');
var WebpackConfig = require('webpack-config').Config;

module.exports = new WebpackConfig().merge({
    context: path.join(__dirname, 'src'),
    entry: {
        "jquery.one-more-list": './jquery.one-more-list.js'
    },
    externals: {
        jquery: 'jQuery'
    },
    resolve: {
        root: [
            path.join(__dirname, 'src')
        ],
        alias: {},
        modulesDirectories: [
            "node_modules"
        ]
    },
    resolveLoader: {
        root: [
            path.join(__dirname, 'node_modules')
        ]
    },
    output: {
        path: path.join(__dirname, 'lib'),
        publicPath: ('/js/'),
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'umd'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }}
        ),
        new webpack.DefinePlugin({
            'isDev': false
        })
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                include: [
                    path.join(__dirname, 'src')
                ],
                query: {
                    presets: ['babel-preset-es2015'].map(require.resolve),
                    plugins: ['babel-plugin-add-module-exports'].map(require.resolve)
                }
            }
        ]
    }
});
