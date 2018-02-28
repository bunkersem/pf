const path = require('path');

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
    plugins: [],
    module: {
        loaders: [
            { test: /\.scss$/, loader: ['style-loader', 'css-loader', 'sass-loader'] },
            { test: /\.css$/, loader: ['style-loader', 'css-loader'] },
            // babel-loader: converts javascript (es6) to javascript (es5)
            {
                'test': /\.tsx?$/,
                'loaders': [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-env'],
                    },
                }, 'ts-loader'],
            },
            // babel-loader for pure javascript (es6) => javascript (es5)
            {
                'test': /\.(jsx?)$/,
                'loaders': [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-env'],
                    },
                }]
            }
        ]
    },
    output: {
        publicPath: '/bundle/',
        path: path.resolve(__dirname, './client/bundle'),
        filename: '[name].bundle.js',
        chunkFilename: '[id].chunk.js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'client'),
        compress: true,
        port: 3000
    }
}