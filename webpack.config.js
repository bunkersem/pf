const path = require('path');
const ModernizrWebpackPlugin = require('modernizr-webpack-plugin')

module.exports = {
    entry: {
        vendor: path.resolve(__dirname, './client/scripts/vendor.ts'),
        main: path.resolve(__dirname, './client/scripts/main.ts')
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
        alias: {
            angular: path.resolve(__dirname, './node_modules/angular/angular.min.js'),
            normalizecss: path.resolve(__dirname, './node_modules/normalize.css/normalize.css')
        }
    },
    plugins: [
        new ModernizrWebpackPlugin()
    ],
    module: {
        loaders: [
            { test: /\.scss$/, loader: ['style-loader', 'css-loader', 'sass-loader'] },
            { test: /\.css$/, loader: ['style-loader', 'css-loader'] },
            { test: /\.tsx?$/, loader: ['ts-loader'] }
        ]
    },
    output: {
        path: path.resolve(__dirname, './client/dist' ),
        filename: '[name].bundle.js',
        chunkFilename: '[id].chunk.js'
    }
}