const path = require('path');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const config = require('../config');

const env = config.build.env;

module.exports = {
  entry: {
    libs: [
      'babel-polyfill',
      'vue/dist/vue.esm.js',
      'vue-router',
      'vuex',
      'mint-ui',
      // 'vue-navigation',
      'fastclick',
      'echarts'
    ],
  },
  output: {
    path: path.resolve(__dirname, '../libs'),
    filename: '[name].[chunkhash:7].js',
    library: '[name]_library',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env,
    }),
    new webpack.DllPlugin({
      path: path.resolve(__dirname, '../libs/[name]-mainfest.json'),
      name: '[name]_library',
      context: __dirname, // 执行的上下文环境，对之后DllReferencePlugin有用
    }),
    new ExtractTextPlugin('[name].[contenthash:7].css'),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new AssetsPlugin({
      filename: 'bundle-config.json',
      path: './libs',
    }),
    new CleanWebpackPlugin(['libs'], {
      root: path.join(__dirname, '../'), // 绝对路径
      verbose: true,
      dry: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
};