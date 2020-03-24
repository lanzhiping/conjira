const path = require('path');
var ZipPlugin = require('zip-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: process.env.NODE_ENV || 'development',

    entry: {
        background: './src/background.js',
        options: './src/options.js',
        popup: './src/popup.js'
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },

    target: 'web',

    devtool: false,

    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin([
            { from: 'icons/*', to: 'icons/[name].[ext]' },
            { from: 'src/*', to: '[name].[ext]', test: /([^/]+)\/(.+)\.(json|html|css)$/ },
        ]),
        (process.env.NODE_ENV === 'production' ? new ZipPlugin({
            filename: 'conjira.zip',
        }) : undefined)
    ],
};
