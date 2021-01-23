const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const SOURCE_ROOT = __dirname + '/src/main/webpack';

const pageList = [
    'index',
    'all-components',
    'elements-typography',
    'elements-buttons'
];
module.exports = merge(common, {
    mode: 'development',
    watch: true,
    devtool: 'inline-source-map',
    performance: { hints: "warning" },
    plugins: [
        ...pageList.map((event) => {
            return new HtmlWebpackPlugin({
                title: `${event} page`,
                filename: `${event}.html`,
                template: path.resolve(__dirname, SOURCE_ROOT + `/static/${event}.hbs`)
            })
        })
    ]
    
});