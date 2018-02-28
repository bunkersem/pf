const MinifyPlugin = require('babel-minify-webpack-plugin');
var config = require('./webpack.config');

var prodConfig = {
    devtool: false,
}

Object.assign(config, prodConfig);
config.plugins.push(new MinifyPlugin());

console.log('using production config', JSON.stringify(config, null, 4));

module.exports = config;

