
'use strict'
// Template version: 1.1.3
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    host:"0.0.0.0",
    port: process.env.PORT || 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/appapi/**':{//app的后台api
        'target': 'http://192.168.25.80',
        // 'target': 'https://app.goldrock.cn',
        // 'target': 'http://192.168.30.185:6366',//谭琼
        changeOrigin: true,
        secure: false
      },
      '/sites/api/**':{//mall api
        // 'target': 'http://localhost:10080',//开发环境
        'target': 'http://192.168.25.75:10080',//测试环境
        // 'target': 'http://192.168.11.12:10080',//马宁
        // 'target': 'http://192.168.11.107:20080',//zhangbiao环境
        // 'target': 'http://192.168.25.76:10080',//开发环境
        // 'target': 'http://192.168.11.107:10080',//开发环境
        changeOrigin: true,
        secure: false
      },
      '/cmsservice/**':{//cmsservice
        'target': 'http://192.168.25.75:20080',//测试环境
        changeOrigin: true,
        secure: false
      },
      '/mockapi/**':{//app的后台api，测试数据
        'target': 'http://mockapi.itanko.com/mock/5bed12b656a09a453209f4e2',
        changeOrigin: true,
        secure: false
      },
      '/metis/**':{//统计数据 api
        'target': 'http://192.168.30.9:2752',//swagger环境
        changeOrigin: true,
        secure: false
      },
      '/goldbagappapi/**':{//app的后台api
        'target': 'http://testapp.goldrock.cn',
        // 'target': 'http://192.168.30.181:3473',
        // 'target': 'http://192.168.30.185:3473',
        changeOrigin: true,
        secure: false
      },
      '/cgi-bin/**':{//app的后台api
        'target': 'https://app.goldrock.cn',
        changeOrigin: true,
        secure: false
      },
      '/ws/events/**': {
         target: 'ws://192.168.30.251',
         logLevel:"debug",
         secure: false,
         ws: true
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
