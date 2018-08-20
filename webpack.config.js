'use strict';

const path                  = require('path');
const UglifyJSPlugin        = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin     = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        index: path.resolve(__dirname, 'es6.js')
    },
    output: {
        path: __dirname,
        filename: "es5.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc: false,
                        presets: [
                            'babel-preset-env',
                            'babel-preset-es2015',
                            'babel-preset-stage-0'
                        ],
                        plugins: [
                            'babel-plugin-transform-decorators-legacy',
                        ]
                    }
                }
            },
            {
                // https://webpack.js.org/loaders/style-loader/
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: {
                        loader: 'style-loader',
                    },
                    use: [
                        {
                            loader: 'css-loader',
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                // Necessary for external CSS imports to work
                                // https://github.com/facebookincubator/create-react-app/issues/2677
                                ident: 'postcss',
                                plugins: () => [
                                    require('postcss-flexbugs-fixes'),
                                    require('autoprefixer')({
                                        browsers: [
                                            '>1%',
                                            'last 4 versions',
                                            'Firefox ESR',
                                            'not ie < 9', // React doesn't support IE8 anyway
                                        ],
                                        flexbox: 'no-2009',
                                    }),
                                ],
                            },
                        },
                        { // https://webpack.js.org/contribute/writing-a-loader/#complex-usage
                            loader: path.resolve(__dirname, './loaders/test_loader.js'),
                            options: {
                                sufix: '_two' // executed second
                            }
                        },
                        {
                            loader: path.resolve(__dirname, './loaders/test_loader.js'),
                            options: {
                                sufix: '_one' // executed first
                            }
                        },
                    ]
                }),
            },
        ]
    },
    plugins: [
        new ExtractTextPlugin("es6.css"),
        new UglifyJSPlugin({
            sourceMap: true,
            parallel: true
        })
    ]
};
