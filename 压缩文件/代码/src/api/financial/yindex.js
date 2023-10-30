import axios from 'axios';

import {environment} from "@/assets/js/common.js"
let  HTTP_URL = environment();

import { Message,Loading } from 'element-ui';
axios.defaults.withCredentials = true;

var token = null;
token = localStorage.getItem("token");
var loadinginstace;
// 请求拦截器
axios.defaults.timeout = 15000;
axios.interceptors.request.use(function (config) {
  token = localStorage.getItem("token");
  config.headers = {
    'Content-Type': 'application/json', //设置跨域头部
    'timeout': 15000,
    "token": "TOKEN=" + token
  };
  loadinginstace = Loading.service({
    fullscreen: true,
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.5)'
  });
  return config;
}, function(error) {
  loadinginstace.close();
  Message.error({
      message: '请求失败，请稍后重试~'
  })
  return Promise.reject(error);
})
// 响应拦截器
axios.interceptors.response.use(function(response){
  loadinginstace.close();
  return response;
},function axiosRetryInterceptor(err) {
  loadinginstace.close();
  var config = err.config;
  if(!config||!config.retry){
      Message.error({
          message: err.response.status+err.response.statusText
      });
      return Promise.reject(err);
  }
  config._retryCount = config._retryCount || 0;
  if(config._retryCount>=config.retry){
      Message.error({
          message: '请求失败，请重试~'
      })
      return Promise.reject(err);
  }
  config._retryCount += 1;
  var backoff = new Promise(function(resolve){
      setTimeout(function(){
          resolve();
      },config._retryCount||1);
  })
  return backoff.then(function(){
      return axios(config)
  });
})
// 封装axios的post请求
export function fetchPost(url, params){
  return new Promise((resolve, reject) => {
      axios.post(url, params).then((response) => {
          resolve(response.data);
      }).catch((error) => {
          reject(error);
      })
 })
}
//get请求
export function fetchGet(url, params) {
  return new Promise((resolve, reject) => {
      axios.get(url,params).then((response) => {
          resolve(response.data);
      }).catch((error) => {
          reject(error);
      })
 })
}

// 好兴动post请求 输入请求地址和参数
export function hxdRESTPluginPost(url, params) {
  return new Promise((resolve, reject) => {
      window.plugins.RESTPlugin.post({
          url:url,
          requestData:params,
          headers: {'Content-Type': 'application/json;charset=utf-8',"timeout":15000},
          success:function(_result){
              let obj = JSON.parse(_result);
              let data = obj.data.content
              resolve(data)
          },
          error:function(_ex){
              reject(_ex);
          }
      })
  })
}

// 好兴动get请求 输入请求地址和参数
export function hxdRESTPluginGet(url, params) {
  return new Promise((resolve, reject) => {
      window.plugins.RESTPlugin.get({
          url:url,
          requestData:params,
          headers: {'Content-Type': 'application/json;charset=utf-8', 'custom':'getData',"timeout":15000},
          success:function(_result){
              resolve(_result.data)
          },
          error:function(_ex){
              reject(_ex);
          }
      })
  })
}

export default {

    isopened(data){  //是否注册添利账户
        let url = HTTP_URL + "api2/wealth/openaccount/isopened.json";
        if(data.channel=="hxdapp"){
            return hxdRESTPluginPost(url,data);
        }
        return fetchPost(url,data);
    },
    bankingAccount(data){  //是否有交易记录
        let url = HTTP_URL + "api2/wealth/query/bankingAccount.json";
        if(data.channel=="hxdapp"){
            return hxdRESTPluginPost(url,data);
        }
        return fetchPost(url,data);
    },
    wealthProduct(data){  //产品说明页
        let url = HTTP_URL + "api2/wealth/query/wealthProduct.json";
        if(data.channel=="hxdapp"){
            return hxdRESTPluginPost(url,data);
        }
        return fetchPost(url,data);
    },
    bankingDetail(data){  //理财明显
        let url = HTTP_URL + "api2/wealth/query/bankingDetail.json";
        if(data.channel=="hxdapp"){
            return hxdRESTPluginPost(url,data);
        }
        return fetchPost(url,data);
    },
};
