
'use strict'
const path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: false,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: process.env.PORT || 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
        // '/api': {
        //     target: 'http://168.5.100.17:8080/cardapp/api/',
        //     // target: 'https://web.cupdata.com/application2/api/',
        //     changeOrigin: true,     //  切换起源,跨域
        //     pathRewrite: {          //需要重写的
        //     '^/api': ''
        //     }
        // }
    },
    cssSourceMap: false
  }
}
