const path = require('path')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const { IgnorePlugin } = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: {
        main: path.resolve(__dirname, './src/index.js'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'index.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
        ],
    },
    target: 'node',
    plugins: [
        new NodePolyfillPlugin(),
        new IgnorePlugin({
            resourceRegExp: /^pg-native$/,
        }),
        new Dotenv({
            path: './.env',
            safe: true,
        })
    ]
}