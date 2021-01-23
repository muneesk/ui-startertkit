'use strict';

const path = require('path');
const webpack = require('webpack');
const handlebars = require('handlebars');
const hbs = require('hbs');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TSConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const TSLintPlugin = require('tslint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const RtlCssPlugin = require('rtlcss-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const SOURCE_ROOT = __dirname + '/src/main/webpack';

module.exports = {
    resolve: {
        extensions: ['.js', '.ts'],
        plugins: [new TSConfigPathsPlugin({
            configFile: "./tsconfig.json"
        })]
    },
    entry: {
        site: SOURCE_ROOT + '/site/main.ts',
    },
    output: {
        filename: (chunkData) => {
            return chunkData.chunk.name === 'dependencies' ? 'clientlib-dependencies/[name].js' : 'clientlib-[name]/[name].js';
        },
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
                test: /\.tsx?$/,
                exclude: [
                    /(node_modules)/
                ],
                use: [{
                        loader: "ts-loader"
                    },
                    {
                        loader: "webpack-import-glob-loader",
                        options: {
                            url: false
                        }
                    }
                ]
            },
            {
                test: /\.(handlebars|hbs)$/,
                loader: "handlebars-loader?runtime=handlebars/runtime",
                query: {
                    helperDirs: [path.resolve(__dirname, './src/main/webpack/static/partials/helpers')],
                    precompileOptions: {
                        knownHelpersOnly: false,
                    },
                    partialDirs: [
                        path.join(SOURCE_ROOT, 'static', 'partials'),
                        path.join(SOURCE_ROOT, 'static', 'components'),
                    ]
                }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            url: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins() {
                                return [
                                    require('autoprefixer')
                                ];
                            },
                            minimize: false
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            //url: false
                            minimize: false,
                            outputStyle: 'expanded'
                        }
                    },
                    {
                        loader: "webpack-import-glob-loader",
                        options: {
                            // url: false
                            minimize: false,
                            outputStyle: 'expanded'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlugin({
            filename: 'clientlib-[name]/[name].css'
        }),

        // BELOW COMMENTED CODE IS FOR RTL SPECIFIC SCSS to CSS COMPILATION - DO NOT DELETE  

        // new RtlCssPlugin({
        //     filename: 'clientlib-[name]/[name]-rtl.css'
        // }),

        new TSLintPlugin({
            files: [SOURCE_ROOT + '/**/*.ts', SOURCE_ROOT + '/**/*.tsx'],
            config: './tslint.json'
        }),
        new CopyWebpackPlugin([
            { from: path.resolve(__dirname, SOURCE_ROOT + '/resources'), to: './clientlib-site/resources' }
        ]),
    ],
    stats: {
        assetsSort: "chunks",
        builtAt: true,
        children: false,
        chunkGroups: true,
        chunkOrigins: true,
        colors: false,
        errors: true,
        errorDetails: true,
        env: true,
        modules: false,
        performance: true,
        providedExports: false,
        source: false,
        warnings: true
    }
};