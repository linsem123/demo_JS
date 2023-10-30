// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import _ from "lodash";
import App from "./App";
import Router from "vue-router";

import router from "./router";
import Home from "@/views/Home.vue"; //商城

import utils from "@/assets/js/utils.js";
import API from "@/api/index.js";

import appconfig from "@/config/appconfig.js";

import Vuex from "vuex";

import 'mint-ui/lib/style.css'

import { MessageBox, Toast, Lazyload, Loadmore, CellSwipe, InfiniteScroll } from "mint-ui";

import store from "@/vuex/index.js";
// import Navigation from 'vue-navigation';

import FastClick from 'fastclick';


// import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css';
// Vue.use(VueAwesomeSwiper);


utils.extendApi(API);

Vue.use(utils);
Vue.use(Vuex);
Vue.use(Lazyload);
Vue.use(InfiniteScroll);

Vue.use(Router);
var _router = new Router(router);

// console.log(CellSwipe.methods)


/*************修复mint-ui和fastclick的冲突*************/

// CellSwipe.methods.endDrag = function(event) {
//   // event.stopPropagation();
//   // event.preventDefault();
//   this.direction = '';
//   this.setAnimations('');
//   if (!this.swiping) return;
//   this.swipeLeaveTransition(this.offsetLeft > 0 ? -1 : 1);
// }


Loadmore.methods.handleTouchEnd = function(event){
  if (this.direction === 'down' && this.getScrollTop(this.scrollEventTarget) === 0 && this.translate > 0) {
    this.topDropped = true;
    if (this.topStatus === 'drop') {
      this.translate = '50';
      this.topStatus = 'loading';
      this.topMethod();
    } else {
      this.translate = '0';
      this.topStatus = 'pull';
    }
    event.preventDefault();
    event.stopPropagation();
  }

  if (this.direction === 'up' && this.bottomReached && this.translate < 0) {
    this.bottomDropped = true;
    this.bottomReached = false;
    if (this.bottomStatus === 'drop') {
      this.translate = '-50';
      this.bottomStatus = 'loading';
      this.bottomMethod();
    } else {
      this.translate = '0';
      this.bottomStatus = 'pull';
    }
    event.preventDefault();
    event.stopPropagation();
  }
  this.$emit('translate-change', this.translate);
  this.direction = '';
}
/*************修复mint-ui和fastclick的冲突*************/


// FastClick.prototype.onTouchEnd = function(event) {
//   // event.preventDefault();
//   event.stopPropagation();　
//   // return false;
// }

/*************fastclick定义的全局变量*************/
var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0,
    deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone,
    deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);
/*************fastclick定义的全局变量*************/

/*************修复fastclick的select键盘闪退的bug*************/
FastClick.prototype.onTouchStart = function(event) {
  // debugger
  // console.log(event.target.type)
  if(event.target&&event.target.type&&event.target.type.indexOf('select') == 0){
    return;
  }

  var targetElement, touch, selection;

  // Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
  if (event.targetTouches.length > 1) {
    return true;
  }

  targetElement = this.getTargetElementFromEventTarget(event.target);
  touch = event.targetTouches[0];

  if (deviceIsIOS) {

    // Only trusted events will deselect text on iOS (issue #49)
    selection = window.getSelection();
    if (selection.rangeCount && !selection.isCollapsed) {
      return true;
    }

    if (!deviceIsIOS4) {

      // Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
      // when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
      // with the same identifier as the touch event that previously triggered the click that triggered the alert.
      // Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
      // immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
      // Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
      // which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
      // random integers, it's safe to to continue if the identifier is 0 here.
      if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
        event.preventDefault();
        return false;
      }

      this.lastTouchIdentifier = touch.identifier;

      // If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
      // 1) the user does a fling scroll on the scrollable layer
      // 2) the user stops the fling scroll with another tap
      // then the event.target of the last 'touchend' event will be the element that was under the user's finger
      // when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
      // is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
      this.updateScrollParent(targetElement);
    }
  }

  this.trackingClick = true;
  this.trackingClickStart = event.timeStamp;
  this.targetElement = targetElement;

  this.touchStartX = touch.pageX;
  this.touchStartY = touch.pageY;

  // Prevent phantom clicks on fast double-tap (issue #36)
  if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
    event.preventDefault();
  }

  return true;
};
/*************修复fastclick的select键盘闪退的bug*************/

/*************修复fastclick的input无法唤醒ios键盘的bug*************/
FastClick.prototype.focus = function(targetElement) {
  var length;// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.  
  if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {  
    length = targetElement.value.length;  
    targetElement.focus();  
    targetElement.setSelectionRange(length, length); 
  } else {  
    targetElement.focus();
  }
};
/*************修复fastclick的input无法唤醒ios键盘的bug*************/


FastClick.attach(document.body);

const cordova = window.cordova;

let   pjid = appconfig.PJID,
      pfc_code = appconfig.PFC_CODE,
      v_code = appconfig.VERSION,
      env = appconfig.env,
      auto_update = appconfig.AUTO_UPDATE,
      websocketbaseurl = appconfig.websocketbaseurl;
      // notification_jumping = false;


store.commit("setPfcCode", pfc_code);
store.commit("setPjid", pjid);


if(window.navigator.onLine == true){
  store.commit("setOnLine", true);
}else{
  store.commit("setOnLine", false);
}
window.addEventListener('online', function(){
  store.commit("setOnLine", true);
  if(_router.app.$route.can_refresh == false){
    return;
  }
  window.location.reload();
});
window.addEventListener('offline', function(){
  store.commit("setOnLine", false);
});

// setTimeout(function(){
//   _router.push({ path: "/activity/cjsj" });
// },5000)

const app = {
  // Application Constructor
  init: function() {
    // cordova env
    if (cordova) {
      app.bindAppEvents();
    } else {
      app.bootstrap();
    }
  
  },
  initService: function() {
    utils.initTrackService();
    // utils.getCurrentPosition().then(function(res) {
    //   store.commit("setLocation",res);
    // }).catch(function(res){
    //   Toast("获取地址失败~");
    // })
   
    // utils.initWebSocket(websocketbaseurl,function(e) {

    //   var res = JSON.parse(e.data);

    //   if(res.price) {
    //     store.state.socket.count++;
    //     store.state.price_list.push(res.price);
    //     store.state.time_list.push(res.time);
    //     store.state.socket.silver_time = res.time;
    //     store.state.socket.price = res.price;
    //     store.state.socket.increase = res.increase;
    //   }

    //   if(res.Message) {
    //     store.state.socket.message_count++;
    //     store.state.socket.message_content = res.Message.MessageContent;
    //     store.state.socket.message_messageId = res.Message.MessageId;
    //     store.state.socket.message_recordId = res.Message.MessageRecordId;
    //   }
    // });
  },
  // startWebsocket:function(){
  //   this.initWebSocket();
  // },
  // stopWebsocket: function() {
  //   utils.websocket.close();
  // },
  bindAppEvents: function() {
    document.addEventListener("deviceready", app.onDeviceReady, false);
  },
  onDeviceReady: function() {
    window.JPush.init();//极光推送初始化

    StatusBar.backgroundColorByName("white");

    window.open = cordova.InAppBrowser.open;

    document.addEventListener("backbutton", app.eventBackButton, false);
    document.addEventListener("resume", app.onAppResume, false);
    document.addEventListener("pause", app.onAppPause, false);

    document.addEventListener("jpush.openNotification",function(event){
      // notification_jumping = true;
      var path = '/';

      // setTimeout(function(){
      //   notification_jumping = false;
      // },500);

      if(utils.checkUserAgent().is_ios){
        path = event.jump_path||'/';
      }else if(utils.checkUserAgent().is_android){
        path = event.extras.jump_path||'/';
      };
      
      setTimeout(function(){
        store.commit("setReceivePush",{path:path,stamp:new Date().getTime()});
      },500);

    },false);


    if(auto_update == true){
      app.bootstrap();
    }else{
      app.getAppStatus(pjid, pfc_code, v_code);
    }
  },

  onAppResume: function() {
    setTimeout(function(){
      app.initService();
      window.JPush.setApplicationIconBadgeNumber(0);//极光推送初始化清零角标，强迫症救星
      store.commit("setResumeStamp", new Date().getTime());
      utils.syncSetStorageFromNativeStorage(["mall_token","mall_uid","mobile"]);

      // if(_router.currentRoute.meta.resume_load && !notification_jumping){
      //   window.location.reload();
      // }
    },0);
    // app.startWebsocket();
    // document.dispatchEvent(new Event("AppReume"));
  },

  onAppPause: function() {
    store.commit("setPauseResumeStamp", new Date().getTime());
    //app进入后台
    // app.stopWebsocket();
  },
  //返回键点击响应
  eventBackButton: function() {
    //进入后台
    Toast("再点击一次退出!");

    document.removeEventListener("backbutton", app.eventBackButton, false); //注销返回键
    document.addEventListener("backbutton", app.exitApp, false); //绑定退出事件 //3秒后重新注册

    var intervalID = window.setInterval(function() {
      window.clearInterval(intervalID);
      document.removeEventListener("backbutton", app.exitApp, false); // 注销返回键
      document.addEventListener("backbutton", app.eventBackButton, false); //返回键
    }, 3000);
  },
  exitApp: function() {
    navigator && navigator.app && navigator.app.exitApp();
  },
  getChannelSuccessCallback: function(msg) {
    var chcp_url = "",
        v_code_without_dot = v_code.replace(/\./g, "");

      pfc_code = msg?msg:pfc_code;

      switch (env) {
        case "dev":
        case "test":
          chcp_url = `${appconfig.chcp_host}/${v_code}/chcp.json`;
          break;
        case "prod":
          chcp_url = `${ appconfig.chcp_host }/${pjid}${pfc_code}${v_code_without_dot}/chcp.json`;
          break;
      }

      // store.commit("setPjid", pjid);
      store.commit("setPfcCode", pfc_code);

      chcp.configure(
        {
          "auto-download": true,
          "auto-install": true,
          "config-file": chcp_url
          // "config-file":`http://192.168.30.46:8080/chcp.json`
        },
        app.chcpConfigureCallback
      );
  },
  getChannelErrorCallback: function(msg) {
    store.commit("setPfcCode", "001");
    app.getAppStatus(pjid, "", v_code);
  },
  chcpConfigureCallback: function(error, data) {
    chcp.isUpdateAvailableForInstallation(
      app.isUpdateAvailableForInstallationCallback
    );
  },
  isUpdateAvailableForInstallationCallback: function(error, data) {
    if (error) {
      console.log("Nothing to install. Executing fetch.");
      chcp.fetchUpdate(function(error, data) {
        // app.bootstrap();
        app.getAppStatus(pjid, pfc_code, v_code);
      });
      return;
    }

    // update is in cache and can be installed - install it
    console.log("Current version: " + data.currentVersion);
    console.log("About to install: " + data.readyToInstallVersion);
    if (data.currentVersion == data.readyToInstallVersion) {
      // app.bootstrap();
      app.getAppStatus(pjid, pfc_code, v_code);
      return;
    }

    if (utils.checkUserAgent().is_ios && ProgressIndicator) {
      ProgressIndicator.showAnnularWithLabel(
        false,
        50000,
        "发现新版本，正在更新..."
      );
    } else if (cordova.plugin && cordova.plugin.progressDialog) {
      cordova.plugin.progressDialog.init({
        theme: "HOLO_DARK",
        progressStyle: "SPINNER",
        cancelable: false,
        autoHide: 50000,
        title: "请稍候",
        message: "发现新版本，正在更新..."
      });
    }

    chcp.installUpdate(function(error, data) {
      if (error) {
        console.log("自动更新失败:" + error.description);
      }
      app.getAppStatus(pjid, pfc_code, v_code);
    });
  },

  bootstrap: function() {
    
    if (cordova) {
      if (utils.checkUserAgent().is_ios && ProgressIndicator) {
        ProgressIndicator.dismissProgress();
      } else if (cordova.plugin && cordova.plugin.progressDialog) {
        cordova.plugin.progressDialog.dismiss();
      }
      cordova.plugins.ChannelPlugin.getChannel(app.getChannelSuccessCallback, app.getChannelErrorCallback);
    } else {
      app.getAppStatus(pjid, pfc_code, v_code);
    }
  },

  getAppStatus: function(pjid, pfc_code, version_code) {
    utils.API.get_channel_version_info({
      data: {
        projectCode: pjid,
        channelCode: pfc_code,
        appVersion: version_code
      }
    })
    .then(function(ret) {
      var macross = false;
      if (ret.model&&ret.model.status == "3") {//审核通过
        macross = true;
      } else {
        macross = false;
      }

      if(pfc_code == "111111"){
        macross = true;
      }

      store.commit("setMacross", macross);
      app.build(macross,ret.model);
    })
    .catch(function(ret) {
      app.build(false,ret.model);
    });

    // utils.API.appapi_get_status({
    //   data: {
    //     projectCode: pjid,
    //     channelCode: pfc_code,
    //     appVersion: version_code
    //   }
    // })
    // .then(function(ret) {
    //   var macross = true;
    //   if (ret.model.status == "3") {
    //     macross = false;
    //   } else {
    //     macross = true;
    //   }

    //   store.commit("setMacross", macross);
    //   app.build(macross);
    // })
    // .catch(function(ret) {
    //   app.build();
    // });
  },
  build: function(macross,version_info) {
    // macross = macross ? macross : store.getters.getMacross;

    // if (macross) {
    //   ["/index", "/goods", "/mine"].forEach(function(item) {
    //     var index = _.findIndex(router.routes, function(o) {
    //       return o.path == item;
    //     });
    //     index >= 0 && router.routes.splice(index, 1);
    //   });
    //   router.routes.unshift({
    //     path: "/",
    //     redirect: "/mall"
    //   });
    //   router.routes.push({
    //     path: "*",
    //     redirect: "/mall"
    //   });
    // } else {
    //   router.routes.unshift({
    //     path: "/",
    //     redirect: "/index"
    //   });
    //   router.routes.push({
    //     path: "*",
    //     redirect: "/index"
    //   });
    //   cordova && cordova.plugin && cordova.plugin.GuidePagerPlugin.openGuidePager();
    // }
    if(!utils.getCookie("metis")){
      utils.getTrackEventCookie();//获取黄金象统计数据cookie
    }
    


    cordova && cordova.plugin && cordova.plugins.JBDevice.getInfo(function(info){
      if(_.isObject(info)){
        store.commit("setTrackInfo",info);
      }
      // var html = "<br/> 设备上的cordova版本：" + info.cordova +
      //  "<br/> 设备名称：" + info.model +
      //  "<br/> 设备平台系统：" + info.platform +
      //  "<br/> 设备唯一标识符" + info.uniqueid +
      //  "<br/> 设备平台操作系统版本号：" + info.version +
      //  "<br/> 设备平台制造商：" + info.manufacturer+"<br/> idfa：" + info.idfa ;

      //    alert(html);
    },function(error){


    });



    

    // let start;

    _router.beforeEach((to, from, next) => {
      // console.log("from:",from);
      // console.log("to:",to);

      // if(window.navigator.onLine == false){
      //   return;
      // }
      
      if(to.meta){
        //必须登录
        if(to.meta.need_login == 1){
          if(!utils.storageGet("mall_token")){
            next({
              path: "/login" 
            });
            return;
          }
        }else if(to.meta.need_login == -1){
          //必须不登录
          utils.storageClear();
        }
      } 

      // console.log("_router.isBack:",_router.isBack)
      if(to.meta.keepAlive){
        // this.transitionName = "slide-right";
        if(_router.isBack){
          store.commit("setTransitionName","slide-right");
        }else{
          store.commit("setTransitionName","slide-left");
        }
        // debugger
      }

      store.commit("setShowBottomBar", (to.meta && to.meta.show_bottom_bar) );

      store.commit("setRouter", {
        "to":to,
        "from":from,
      });

      // debugger

      if(_router.isBack){
        if(to.meta.no_history){
          _router.go(-1);
          setTimeout(function(){
            next(vm => {});
          },100);
        }else{
          next(vm => {});
        }
      }else{
        next(vm => {});
      }

      // start = new Date().getTime();
    });

    // Vue.use(Navigation, {router:_router,store:store});


    if (cordova) {
      navigator.splashscreen.hide();
      StatusBar&&StatusBar.show();
    }

    utils.syncSetStorageFromNativeStorage(["mall_token","mall_uid","mobile"])
    .then(function(){
      new Vue({
        el: "#app",
        router: _router,
        store,
        template: "<App/>",
        components: {
          App
        },
        created() {
          //从外部打开就跳转
          var _this = this;

          app.initService();

          utils.trackEvent("frontpage_app_activate");

          window.JPush&&window.JPush.setApplicationIconBadgeNumber(0);//极光推送初始化清零角标，强迫症救星

          store.commit("setVersionInfo",version_info);

          window.handleOpenURL = function(url) {
            setTimeout(function() {
              let hash = url.split("#");
              _this.$router.push(`${hash[1]}`);
            }, 1000);
          };
          //阻止移动端中长按页面弹框问题
          document.addEventListener("contextmenu", function(e) {
            e.preventDefault();
          });
        }
      });
    });

  }
};

app.init();