import axios from 'axios';
import {Loading} from 'element-ui';
// import {fetchGet} from "../../../fastIssue/src/api/api";
//全局配置携带跨源凭证
axios.defaults.withCredentials = true;

import {HTTP_URL} from "../totalApi";
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
}, function (error) {
  loadinginstace.close();
  return Promise.reject(error);
});
// 响应拦截器
axios.interceptors.response.use(function (response) {
  loadinginstace.close();
  return response;
}, function (error) {
  loadinginstace.close();
  return Promise.reject(error);
});

// 封装axios的post请求
export function fetchPost(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params).then((response) => {
      // alert(response.data);
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
 // 开户首页接口信息
 doorHome(data){
  let  url = HTTP_URL+'api2/wealth/openaccount/readyopen.json';
  let params = data;
  if(params.channel=='hxdapp'){
    return hxdRESTPluginPost(url,params);
  }
  return fetchPost(url,params);
},
// 切换卡片的
changeCard(data){
    let  url = HTTP_URL+'api2/wealth/openaccount/changeCard.json'
    let params = data;
    if(params.channel=='hxdapp'){
        return hxdRESTPluginPost(url,params);
      }
    return fetchPost(url,params);
  },
  //  开户提交
  applydoor(data){
    let url =  HTTP_URL+'api2/wealth/openaccount/opencommit.json'
    let params = data
    if(params.channel=='hxdapp'){
        return hxdRESTPluginPost(url,params);
      }
    return fetchPost(url,params);
  },
   //  短信
   sendSmsCode(data){
    let url =  HTTP_URL+'api2/wealth/openaccount/sendSmsCode.json'
    let params = data
    if(params.channel=='hxdapp'){
        return hxdRESTPluginPost(url,params);
      }
    return fetchPost(url,params);
  },
  //  滑块
  getSlider(data){
    let url =  HTTP_URL+'api2/wealth/openaccount/getSlider.json'
    let params = data
    if(params.channel=='hxdapp'){
        return hxdRESTPluginPost(url,params);
      }
    return fetchPost(url,params);
  },
 
};
