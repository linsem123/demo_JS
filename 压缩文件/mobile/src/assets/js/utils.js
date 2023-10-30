import { Indicator, Toast } from "mint-ui";

import axios from "axios";
import _ from "lodash";
import querystring from "querystring";

import Vue from "vue";

import appconfig from "@/config/appconfig.js";

// import Router from "vue-router";

import constants from "./constants.js";

import "../lib/geolocation.min.js";

import store from "@/vuex/index.js";

// import VueCookies from 'vue-cookies';

// Vue.use(Router);

// var RSA = require('./RSA.js');
// var UT = require('./ut.js');

const axios_instance = axios.create({
  timeout: 20000,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    "goldbag-version" : appconfig.VERSION,
    // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
  }
});

window._storage = window.localStorage || {};

// let instance;

// Indicator.open = function(options) {
//   if (!instance) {
//     instance = new Indicator({
//       el: document.createElement('div')
//     });
//   }
//   if (instance.visible) return;
//   instance.text = typeof options === 'string' ? options : options.text || '';
//   instance.spinnerType = options.spinnerType || 'snake';
//   document.body.appendChild(instance.$el);

//   Vue.nextTick(() => {
//     instance.visible = true;
//   });
// };

// Indicator.close = function() {
//   if (instance) {
//     instance.visible = false;
//   }
// };

var utils = (window.utils = {
  toastObj:null,
  API: {},
  ua: navigator.userAgent.toLowerCase(),
  _interval: null,
  _generateApiFun: function(api_list) {
    var me = this;
    _.forEach(api_list, function(val, key) {
      me.API[key] = (function(val) {
        return function(option) {
          // option = option || {};
          option = _.merge(
            {
              show_loading: false,
              querystring: false
            },
            option || {}
          );
          return new Promise(function(resolve, reject) {
            option.show_loading && Indicator.open({
              spinnerType: "fading-circle"
            });

            var method = option.method || "post",
              url = option.url || val.url,
              //querystring.stringify是用来对理只有一级key value时数据结构的处理(访问accountweb接口只有一级),JSON.stringify处理多级key value这样的数据结构(访问tradeweb接口时有多级)
              data = option.querystring
                ? querystring.stringify((option && option.data) || {})
                : JSON.stringify((option && option.data) || {});

            if (url.indexOf(".json") != -1) {
              method = "get";
            }

            // console.log("data:",data)
            if(/\[filter\]/.test(url)){
              url = url.replace("[filter]",option.data.filter||"");
            }else if(/get|GET/.test(method) && /\?_format=json/.test(url) && data != "{}"){
              url = url+"&"+data
            }

            // if (option.restful_param_filter) {
            //   //把restful里边的%参数替换成传参里边的restful_param_filter
            //   url = url.replace(/%/g, option.restful_param_filter);
            // }

            option.data = data;

            axios_instance.defaults.headers.common["Authorization"] =
              utils.storageGet("token") || "";

            axios_instance(
              _.assign(
                {
                  method: method,
                  url: url
                },
                option
              )
            )
              .then(response => {
                option.show_loading && Indicator.close();
                if(/cmsservice/.test(url)){//cmsservice后台接口
                  // console.log("response:",response);
                  var res = {
                    api_type: "cms",
                    errorCode: 0,
                    errorMessage: "",
                    model:{},
                  };
                  if(/^2/.test(response.status)){
                    res = _.assign(res, {
                      errorCode: 0,
                      errorMessage: "",
                      model: response.data,
                    });
                    resolve(res);
                  }else{
                    res = _.assign(res, {
                      errorCode: -1,
                      errorMessage: response.data.error||"接口错误!",
                      model:{},
                    });
                    reject(res);
                  }
                }else if(/sites\/api\//.test(url)){
                  //商城后台数据接口格式
                  var res = {
                    errorCode: 0,
                    errorMessage: "",
                    api_type: "mall",
                    model: {}
                  };
                  if(!response || !response.data){
                    return;
                  }else if(response.data.status && response.data.status.succeed == 1) {
                    res = _.assign(res, {
                      errorCode: 0,
                      errorMessage: "",
                      model: response.data
                    });
                    resolve(res);
                  }else if(response.data.status.succeed == 0 && response.data.status.error_code == 100) {
                    Toast({
                      message: "请登录",
                      duration: 3000,
                      position: "bottom"
                    });
                    me.storageClear();
                    window.setTimeout(function() {
                      window.location.hash = "#/login";
                    }, 1000);
                  }else{
                    res = _.assign(res, {
                      errorCode: response.data.status.error_code,
                      errorMessage: response.data.status.error_desc,
                      model: {}
                    });
                    reject(res);
                  }
                }else if(/\/appapi/.test(url)){
                  var res = {
                    errorCode:response.data.errorCode,
                    errorMessage:response.data.errorMessage,
                    api_type: "appapi",
                    model: response.data.model,
                  };

                  if(response.data.errorCode == 0){
                    resolve(res);
                  }else{
                    reject(res);
                  }
                }else{
                  //自己后台的数据接口格式
                  var res = {
                    errorCode: 0,
                    errorMessage: "",
                    api_type:"backend",
                    model: {}
                  };

                  if (response.data.resCode == "GR000000") {//成功
                    res = _.assign(res,{
                      model: response.data.resBody,
                    });
                    resolve(res);
                  }else if(response.data.resCode == "GR333333"){
                    Toast({
                      message: "请登录",
                      duration: 3000,
                      position: "bottom"
                    });
                    me.storageClear();
                    window.setTimeout(function() {
                      window.location.hash = "#/login";
                    }, 1000);
                  }else {
                    res = _.assign(res,{
                      errorCode:response.data.resCode,
                      errorMessage:response.data.resMsg,
                    });
                    reject(res);
                  }
                }
              })
              .catch(function(error) {
                option.show_loading && Indicator.close();
                var message = "",
                    response = error.response || {
                      data: {}
                    };
                error.__servererror__ = true;

                if(/\/metis/.test(url)){
                  return;
                }

                if(/\/appapi/.test(url)){
                  reject(error);
                }

                // console.log(error.response.data);
                // console.log(error.response.status);
                // console.log(error.response.headers);

                if(error.response){
                  // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                  if(error.response.status >= 300 && error.response.status < 400){
                    message = "请求资源不存在，请稍后尝试";
                  }else if(error.response.status >= 400 && error.response.status < 500){
                    message = "当前网络环境较差，请稍后尝试";
                  }else if(error.response.status >= 500){
                    message = "网络请求失败，请稍后尝试";
                  }
                }else{
                  // Something happened in setting up the request that triggered an Error
                  if(/timeout/.test(error.message)){
                    message = "网络连接超时，请稍后尝试";
                  }
                }

                if(message){
                  Toast({
                    message: message,
                    duration: 3000,
                    position: "bottom"
                  });
                }
                reject(error);
              });
          });
        };
      })(val);
    });
  },
  extendApi: function(api_list) {
    this._generateApiFun(api_list);
  },
  filters: {  
    filterPhone: function (val) {  
      return val.replace(/\B(?=(?:\d{4})+$)/g, ' '); 
    }  
  },
  Toast:function(msg){
    if (utils.toastObj) {
      utils.toastObj.close();
    }
    utils.toastObj = Toast(msg);
  },
  countDown: function(option) {
    //倒计时
    var me = this,
      counter = option.seconds || 59,
      stamp = new Date().getTime();

    window.clearInterval(this._interval);
      
    // text = counter+'秒后重发';
    option.beforeInterval && option.beforeInterval(counter);
    counter--;
    this._interval = window.setInterval(function() {
      var new_stamp = new Date().getTime(),
        delta_time = Math.round((new Date().getTime() - stamp) / 1000);
      if (new_stamp - stamp >= 900) {
        //校正时间戳
        stamp = new_stamp;
        if (counter <= 0) {
          counter = 59;
          window.clearInterval(me._interval);
          option.end && option.end();
        } else {
          counter -= delta_time;
          option.readingSeconds && option.readingSeconds(counter);
        }
      }
    }, 500);
  },
  resetCountDown:function(cb){
    window.clearInterval(this._interval);
    cb&&cb();
  },
  gotoNode:function(item){
    // console.log(item)
    if(item.link == ""){//无法点击
      return;
    }else if(item.link == "##"){//cms本身的详情页
      window.location.hash = "#/node/"+item.nid;
    }else if(/http[s]?:\/\//.test(item.link)){//外链
      try{
        var url = item.link,
            target = "_system",
            options = "location=no,hidden=no,hardwareback=no";
        window.cordova.InAppBrowser.open(url, target, options);
      }
      catch(e){
        location.href = item.link;
      }
    }else if(/\/.+/.test(item.link)){//路由
      window.location.hash = "#"+item.link;
    }
  },
  getLocationQueryString: function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var hasharr = window.location.hash.split("?");
    var r = "";
    if (hasharr.length > 1) {
      r = hasharr[1].match(reg);
    }
    if (r) return unescape(r[2]);
    return null;
  },
  getRemain:function(timestamp){
    var hours,minutes,seconds;

    hours = Math.floor(timestamp/3600000).toString();
    minutes = Math.floor((timestamp%3600000)/60000).toString();
    seconds = Math.floor(((timestamp%3600000)%60000)/1000).toString();

    hours = hours.length<=1?"0"+hours:hours;
    minutes = minutes.length<=1?"0"+minutes:minutes;
    seconds = seconds.length<=1?"0"+seconds:seconds;

    return `${hours}:${minutes}:${seconds}`;
  },
  formatDate: function(timestamp, format, default_value) {
    /* format : yyyy-MM-dd-HH-mm-ss */
    var timestamp = Number(timestamp) || 0,
      default_value = default_value || "",
      ret;

    var covertNumberToTwoDigit = function(number) {
      return number.toString().replace(/^(\d)$/, "0$1");
    };
    if (!timestamp || timestamp == "0") {
      ret = default_value;
    } else {
      if (timestamp.toString().length == 10) {
        timestamp = timestamp * 1000;
      }
      var date = new Date(timestamp),
        full_year = date.getFullYear() || "0000",
        month = covertNumberToTwoDigit(date.getMonth() + 1) || "00",
        day = covertNumberToTwoDigit(date.getDate()) || "00",
        hour = covertNumberToTwoDigit(date.getHours()) || "00",
        minute = covertNumberToTwoDigit(date.getMinutes()) || "00",
        second = covertNumberToTwoDigit(date.getSeconds()) || "00",
        milli = covertNumberToTwoDigit(date.getMilliseconds()) || "000";
      ret = format
        .replace(/yyyy/, full_year)
        .replace(/MM/, month)
        .replace(/dd/, day)
        .replace(/HH/, hour)
        .replace(/mm/, minute)
        .replace(/ss/, second)
        .replace(/SSS/, milli);
    }
    return ret;
  },
  hideString:function(string,from,remain){//用‘*’隐藏字符串的位数，from：从第几位开始，remain：剩余的位数
    if(typeof string != "number" && typeof string != "string"){
      return string;
    }
    var arr = string.toString().split('');

    arr = arr.map(function(item,index,arr){
      if(remain != undefined){
        if(index >= from && index < arr.length-remain){
            return "*";
        }else{
            return item;
        }
      }else{
        if(index == from){
            return "*";
        }else{
            return item;
        }
      }
    });

    return arr.join("");
  },
  follow:function(){
    try {
      if (utils.checkUserAgent().is_ios || utils.checkUserAgent().is_android) {
        //移动端
        Wechat.isInstalled(function(installed) {
          if (installed) {
            Wechat.wechatSubscribe({
              scene: Wechat.Scene.SubscribeAuthorization
            }, function(authresponse) {
              //授权发送订阅消息成功
              //获取微信accesstoken

              axios.get(appconfig.appbaseurl + "/cgi-bin/token?grant_type=client_credential&appid=wxfaaa01a5cb67b1d1&secret=07c08e2103bce0996d2734ae161fc0ee")
                .then(function(ret) {

                  // alert(JSON.stringify(ret));
                  //向微信发送订阅消息
                  axios.post(appconfig.appbaseurl + "/cgi-bin/message/template/subscribe?access_token=" + ret.data.access_token, {
                      touser: authresponse.openId,
                      template_id: authresponse.templateId,
                      scene: authresponse.scene,
                      title: "关注黄金象公众号",
                      data: "黄金象专注售卖平价金银商品，并提供多种存储服务。",
                      url: "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzUyMDk3Mzg3Nw==&scene=126&subscene=0"
                    })
                    .then(function(response) {})
                    .catch(function(error) {});
                })
                .catch(function(error) {

                });
              //分享成功
            }, function(reason) {
              //分享失败
            });
          } else {
            Toast("请先安装微信客户端!");
          }
        }, function(reason) {});
      } else if (utils.checkUserAgent().is_weixin) {
        //微信端
        Toast("该功能暂不更新!");
      }
    } catch (error) {
      MessageBox.alert('请升级app至最新版本!');
      //由于app外壳版本过低，未安装微信分享cordova插件
    }
  },
  identityCodeValid: function(code) {
    var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外 "
      },
      ret = {
        tip: "",
        success: true
      };

    if (!city[code.toString().substr(0, 2)]) {
      //验证区位码真实性
      ret = _.assign(ret, {
        tip: "身份证地址编码错误",
        success: false
      });
    } else {
      //18位身份证需要验证最后一位校验位
      if (code.length == 18) {
        code = code.split("");
        //∑(ai×Wi)(mod 11)
        //加权因子
        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
          //校验位
          parity = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2],
          sum = 0,
          ai = 0,
          wi = 0,
          last;

        for (var i = 0; i < 17; i++) {
          ai = code[i];
          wi = factor[i];
          sum += ai * wi;
        }

        last = parity[sum % 11];
        //最后一位可以是大写X，也可以是小写x
        if (
          last == "X"
            ? last != code[17] && last.toLowerCase() != code[17]
            : last != code[17]
        ) {
          ret = _.assign(ret, {
            tip: "身份证最后一位校验错误!",
            success: false
          });
        }
      }
    }

    return ret;
  },
  // setCookie:function(name,expireTimes,path,secure) {
  //   return VueCookies.set(name,expireTimes,path,secure);
  // },
  // getCookie:function(name) {
  //   return VueCookies.get(name);
  // },
  // delCookie:function (name,path,domain) {
  //   return VueCookies.remove(name,path,domain);
  // },
  storageGet: function(key) {
    let value = window._storage.getItem(key) || window._storage[key];
    try {
      value = JSON.parse(value);
    } catch (err) {
      // console.log("不能解析, [" + key + "]:[" + value + "]");
    } finally {
      return value;
    }
  },
  storageRemove: function(key) {
    window._storage.removeItem(key);
    delete window._storage[key];
  },
  storageClear: function() {
    [
      "mobile",
      "mall_token",
      "mall_uid",
    ].map(function(item, index) {
      utils.storageRemove(item);
      try{
        NativeStorage && NativeStorage.remove(item,function(){},function(){});
      }
      catch(e){

      }
    });

    store.commit("setMallToken","");
  },
  storageSet: function(key, value) {
    if (typeof value == "object") {
      value = JSON.stringify(value);
    }
    window._storage.setItem(key, value);
    window._storage[key] = value;
  },

  syncSetStorageFromNativeStorage:function(keys_array){
    try{
      NativeStorage;

      keys_array = keys_array||[];

      var funs = [];

      keys_array.forEach(function(item){
        funs.push(new Promise(function(resolve, reject) {

          NativeStorage.getItem(item,function(value){
            utils.storageSet(item,value);
            resolve();
          },function(){
            utils.storageSet(item,"");
            resolve();
          });
          
        }));
      });

      return new Promise(function(resolve, reject) {
        Promise.all(funs)
        .then(function (res) {
          resolve();
        })
        .catch(function(ret) {
          reject();
        });
      });
    }
    catch(e){
      return new Promise(function(resolve, reject) {
        resolve();
      });
    }
  },
  syncSetNativeStorage: function(obj){
    try{
      NativeStorage;

      obj = obj||{};

      _.forEach(obj,function(val,key){
        NativeStorage.setItem(key,val,function(){

        },function(){

        });
      });
    }
    catch(e){
      return;
    }
  },
  isSupportSticky() {//判断是否支持sticky
    var prefixTestList = ['', '-webkit-'];
    var stickyText = '';
    for (var i = 0; i < prefixTestList.length; i++ ) {
      stickyText += 'position:' + prefixTestList[i] + 'sticky;';
    }
    // 创建一个dom来检查
    var div = document.createElement('div');
    div.style.cssText = stickyText;
    document.body.appendChild(div);
    var isSupport = /sticky/i.test(window.getComputedStyle(div).position);
    document.body.removeChild(div);
    div = null;
    return isSupport;
  },
  checkUserAgent: function() {
    var ua = {};
    ua.is_android = false;
    ua.is_ios = false;
    ua.is_weixin = false;
    ua.is_web = false;

    var userAgent = navigator.userAgent;
    if (/MicroMessenger/.test(userAgent)) {
      ua.is_weixin = true;
    } else if (/hjx\.ios\.launcher/.test(userAgent)) {
      ua.is_ios = true;
    } else if (/hjx\.android\.launcher/.test(userAgent)) {
      ua.is_android = true;
    } else {
      ua.is_web = true;
    }

    return ua;
  },
  isGtIphonex:function(){
    if (typeof window !== 'undefined' && window) {
      return /iphone/gi.test(window.navigator.userAgent) && window.screen.height >= 812;
    }
    return false;
  },
  getCurrentPosition: function() {
    // var geolocation = new qq.maps.Geolocation(
    //   "DZYBZ-73WWI-FG6GZ-5JRFR-PNVIE-4OFUL",
    //   "myapp"
    // );
    return new Promise(function(resolve, reject) {
        var geoUtils = window.cordova ? window.cordova.geolocation : navigator.geolocation;
        geoUtils.getCurrentPosition(
          function(position) {
            resolve({
              longitude: position.coords.longitude,
              latitude: position.coords.latitude
            });
          }
          // ,
          // function(position) {
            // geolocation.getLocation(
            //   function(res) {
            //     resolve({
            //       longitude: res.lng,
            //       latitude: res.lat
            //     });
            //   },
            //   function(error) {
            //     reject({});
            //   }
            // );
          // }
        );
    });
  },
  /*
		event:事件名称，
		data:事件相关的数据
    */
  initTrackService: function() {
    if (utils.checkUserAgent().is_ios || utils.checkUserAgent().is_android) {
    } else {
      var head = document.getElementsByTagName("head")[0];
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "https://s22.cnzz.com/z_stat.php?id=1275559404&web_id=1275559404";
      head.appendChild(script);
    }
  },
  trackEvent: function(event, data, eventNum) {
    // console.log(event, data, eventNum)
    var $router = store.getters.getRouter,
        category = category || "",
        eventNum = eventNum || 0,
        action = event || "undefined event",
        origin_data = data,
        source_code = store.getters.getPfcCode,
        user_account = utils.storageGet("mobile")?utils.storageGet("mobile").toString():"",
        data = _.merge({
          source_code:source_code,
          user_account:user_account,
          referer:($router&&$router.from&&$router.from.fullPath)||"",
        },data),
        hjxData = JSON.stringify(data) || "",
        opt_label = JSON.stringify(data) || "",
        opt_value = JSON.stringify(data) || "",
        userAgent = navigator.userAgent;

    utils.hjxTrackEvent({
      eventId:event,
      additional:hjxData,
    });

    if(source_code == "111111" || source_code == "222222"){//开发和测试环境不发送
      return;
    }

    if (utils.checkUserAgent().is_weixin) {
      category = "weixin";
      window._czc &&
        window._czc.push([
          "_trackEvent",
          category,
          action,
          opt_label,
          opt_value
        ]);
    } else if (utils.checkUserAgent().is_ios) {
      category = "ios";
      // AnalyticsAgent && AnalyticsAgent.onEventWithLabel(action, category);
      AnalyticsAgent && AnalyticsAgent.onEventWithCounter(action, data, eventNum);
    } else if (utils.checkUserAgent().is_android) {
      category = "android";
      // AnalyticsAgent && AnalyticsAgent.onEventWithLabel(action, category);
      AnalyticsAgent && AnalyticsAgent.onEventWithCounter(action, data, eventNum);
    } else if (utils.checkUserAgent().is_web) {
      category = "web";
      window._czc &&
        window._czc.push([
          "_trackEvent",
          category,
          action,
          opt_label,
          opt_value
        ]);
    } else {
      category = "undefined";
    }


    
  },

  getCookie:function(name){ 
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)"); 
　　 return (arr=document.cookie.match(reg))?unescape(arr[2]):null;
  },
  getTrackEventCookie:function(cb){
    var me = this;

    utils.API.get_cookie({
      data:{}
    })
    .then(function (ret) {
      cb&&cb();
    })
    .catch(function(ret){
    });
  },
  hjxTrackEvent:function(option){
    let data = {
          // additional:"", //(string, optional): JSON格式事件附加属性eg:{goods_id:1,amount:10} ,
          appChannel:store.getters.getPfcCode||"", //(string, optional),
          appVersion:appconfig.VERSION||"", //(string, optional),
          eventId:"", //(string, optional),
          projectId:appconfig.PJID||"", //(string, optional),
          source:"", //(string, optional): 请求源,取值{APP|WEB}
        };

    if(utils.checkUserAgent().is_ios || utils.checkUserAgent().is_android) {
      // let track_info = {},
      //     appData = {
      //       cordovaVersion:track_info.cordovaVersion||"", //(string, optional),设备上的cordova版本
      //       idfa:track_info.idfa||"", //(string, optional),idfa
      //       manufacturer:track_info.manufacturer||"", //(string, optional),
      //       model:track_info.model||"", //(string, optional),设备名称
      //       platform:track_info.platform||"", //(string, optional),设备平台系统：
      //       uniqueid:track_info.uniqueid||"", //(string, optional),设备唯一标识符
      //       version:track_info.version||"", //(string, optional)设备平台操作系统版本号：
      //       triggerTime:utils.formatDate(new Date().getTime(),"yyyy-MM-dd HH:mm:ss.SSS"),//(string, optional)触发时间
      //       status:true,//(Bool, optional)触发成功或失败,，目前记录都是true
      //     };

      data = _.merge(data,{
        source:"APP",
        // appData:appData,
      },option);

      try{
        if(cordova.plugins.JBAnalyticsPlugin){
          cordova.plugins.JBAnalyticsPlugin.onEventWithData(option.eventId,data);
        } 
      }
      catch(e){
      }
    }else{
      data = _.merge(data,{
        source:"WEB",
      },option);

      utils.sendHjxTrackEvent(data);
    }
    // utils.sendHjxTrackEvent(data);
  },
  sendHjxTrackEvent:function(data){
    utils.API.put_event({
      data:data,
    })
    .then(function (ret) {
    })
    .catch(function(ret){
      // !ret.__servererror__ && Toast(ret.errorMessage||"未知错误！");
    });
  },
});
/*
	给函数增加切面统计
	@example
	refreshPrice:function(){
      //执行
      console.log(222);
    }.before(function(){
      //执行后
      utils.trackEvent('click_home_buy',{
        contract_id:1,
        timestamp:new Date().getTime(),
        user_id:1
      });
    }).after(function(){
      //执行前
      console.log(333);
    }),
*/
Function.prototype.before = function(func) {
  var __self = this;
  return function() {
    if (func.apply(this.arguments) === false) {
      return false;
    }
    return __self.apply(this, arguments);
  };
};
Function.prototype.after = function(func) {
  var __self = this;
  var __arguments;
  return function() {
    var ret = __self.apply(this, arguments);
    __arguments = arguments;
    if (ret === false) {
      return false;
    }
    func.apply(this, __arguments);
    return ret;
  };
};

export default utils;

// module.exports = utils;
