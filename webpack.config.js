const path = require('path');
const ModernizrWebpackPlugin = require('modernizr-webpack-plugin')

module.exports = {
    entry: {
        vendor: path.resolve(__dirname, './client/scripts/vendor.ts'),
        main: path.resolve(__dirname, './client/scripts/main.ts')
    },
    cache: true,
    devtool: 'source-map',
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
        alias: {
            angular: path.resolve(__dirname, './node_modules/angular/angular.min.js'),
            sanitize: path.resolve(__dirname, './node_modules/angular-sanitize/angular-sanitize.min.js'),
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
            { test: /\.tsx?$/, loader: ['ts-loader'] },
        ]
    },
    output: {
        publicPath: '/bundle/',
        path: path.resolve(__dirname, './client/bundle' ),
        filename: '[name].bundle.js',
        chunkFilename: '[id].chunk.js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'client'),
        compress: true,
        port: 3000
    }
}