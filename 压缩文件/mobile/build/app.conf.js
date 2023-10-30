"use strict";
var appConfig = {
  PJID: "02", //应用编号
  AUTO_UPDATE:true, //是否自动更新
  VERSION: "2.3.4", //app版本
}
exports.appConfig = appConfig;

exports.ctxEnvConfig = {
  dev: {
    PFC_CODE: "111111", //渠道编号
    hcp_config: {
      //热更新地址
      name: "hjx",
      ios_identifier: "https://itunes.apple.com/app/id1316514754",
      android_identifier: "com.zhaoyin.hjx",
      update: "now",
      min_native_interface: 2,
      content_url: "http://192.168.25.76"
    },
    ctx_config: {
      //内容地址
      cmsbaseurl: "http://192.168.25.76",
      mallbaseurl: "http://192.168.25.76",
      appbaseurl: "http://192.168.25.76",
      activeurl: "http://192.168.25.76:81",
      websocketbaseurl: "ws://192.168.25.76",
      chcp_host: "http://192.168.25.76"
    }
  },
  test: {
    PFC_CODE: "222222", //渠道编号
    hcp_config: {
      name: "hjx",
      ios_identifier: "https://itunes.apple.com/app/id1316514754",
      android_identifier: "com.zhaoyin.hjx",
      update: "now",
      min_native_interface: 2,
      content_url: `http://testupdate.goldrock.cn/${appConfig.VERSION}`
    },
    ctx_config: {
      cmsbaseurl: "http://testapp.goldrock.cn",
      mallbaseurl: "http://testapp.goldrock.cn",
      appbaseurl: "http://testapp.goldrock.cn",
      activeurl: "http://192.168.25.75:81",
      websocketbaseurl: "ws://testapp.goldrock.cn",
      chcp_host: "http://testupdate.goldrock.cn"
    }
  },
  vnet: {//临时马甲包
    PFC_CODE: "222222", //渠道编号
    hcp_config: {
      name: "hjx",
      ios_identifier: "https://itunes.apple.com/app/id1316514754",
      android_identifier: "com.zhaoyin.hjx",
      update: "now",
      min_native_interface: 2,
      content_url: "http://testapp.goldrock.cn"
    },
    ctx_config: {
      cmsbaseurl: "http://testapp.goldrock.cn",
      mallbaseurl: "http://testapp.goldrock.cn",
      appbaseurl: "http://vapptest.goldrock.cn",
      activeurl: "http://192.168.25.75:81",
      websocketbaseurl: "ws://testapp.goldrock.cn",
      chcp_host: "http://testapp.goldrock.cn"
    }
  },
  // vnet: {
  //   PFC_CODE: "333333", //渠道编号
  //   hcp_config: {
  //     name: "hjx",
  //     ios_identifier: "https://itunes.apple.com/app/id1316514754",
  //     android_identifier: "com.zhaoyin.hjx",
  //     update: "now",
  //     min_native_interface: 2,
  //     content_url: "http://vapp.goldrock.cn"
  //   },
  //   ctx_config: {
  //     cmsbaseurl: "http://vcms.goldrock.cn",
  //     mallbaseurl: "http://vmall.goldrock.cn",
  //     appbaseurl: "http://vapp.goldrock.cn",
  //     activeurl: "http://192.168.25.75:81",
  //     websocketbaseurl: "ws://vapp.goldrock.cn",
  //     chcp_host: "http://vapp.goldrock.cn"
  //   }
  // },
  prod: {
    PFC_CODE: "010101", //渠道编号
    hcp_config: {
      name: "hjx",
      ios_identifier: "https://itunes.apple.com/app/id1316514754",
      android_identifier: "com.zhaoyin.hjx",
      update: "now",
      min_native_interface: 2,
      content_url: `http://update.goldrock.cn/${appConfig.VERSION}`
    },
    ctx_config: {
      cmsbaseurl: "http://app.goldrock.cn",
      mallbaseurl: "http://mall.goldrock.cn",
      appbaseurl: "https://app.goldrock.cn",
      activeurl: "http://activeapp.goldrock.cn",
      websocketbaseurl: "wss://app.goldrock.cn",
      chcp_host: "http://update.goldrock.cn"
    }
  }
}
