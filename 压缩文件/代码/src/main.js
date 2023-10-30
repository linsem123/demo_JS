import Vue from 'vue';
import vuex from "vuex";
import App from './App';
import router from './router';
import store from './store';
Vue.config.productionTip = false;

import $ from 'jquery';               //引入jquery
import weui from 'jquery-weui/dist/js/jquery-weui.min';
import Vant from 'vant';
import 'vant/lib/index.css';
import sa from 'sa-sdk-javascript';   //埋点
import ElementUI from 'element-ui';   //全局引入element-ui
import 'element-ui/lib/theme-chalk/index.css';   //单独引入样式文件,全局
Vue.use(ElementUI);    //传入一个全局配置对象。该对象目前仅支持 size 字段，用于改变组件的默认尺寸
Vue.use(Vant);

// require("./mock.js");

import axios from 'axios';            //引入axios请求

import { Popup } from 'vant';
Vue.use(Popup);

import charts from 'echarts'
Vue.prototype.$echarts = charts

Vue.prototype.$tab=function(tab){
  return Number(tab)
}
Vue.prototype.$flt=function(num){
  return num.toFixed(2)
}
import global from './assets/js/global';
Vue.prototype.GLOBAL = global
axios.defaults.withCredentials=true;
axios.defaults.timeout = 15000;
axios.defaults.retry = 0;
axios.defaults.retryDelay = 1000;
// axios.defaults.headers.common['token'] = 'f4c902c9ae5a2a9d8f84868ad064e706';
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
