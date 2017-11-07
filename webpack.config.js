'use strict';

const path                  = require('path');
const UglifyJSPlugin        = require('uglifyjs-webpack-plugin');

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
        ]
    },
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true,
            parallel: true
        })
    ]
};
