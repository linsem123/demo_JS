import axios from 'axios';
import {Loading} from 'element-ui';
// import {fetchGet} from "../../../fastIssue/src/api/api";
//全局配置携带跨源凭证
axios.defaults.withCredentials = true;

import {HTTP_URL} from "./totalApi";
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
  //消费分期首页数据(卡列表以及消费清单)
  payList(data){
    let url = HTTP_URL + "api/consumeInstalment/getInitInfo.json";
    if(data.channel=="hxdapp"){
      return hxdRESTPluginPost(url,data)
    }
    return fetchPost(url,data)
  },
  //切币种
  changeCurrency(data){
    let url = HTTP_URL + "api/consumeInstalment/changeType.json";
    if(data.channel=="hxdapp"){
      return hxdRESTPluginPost(url,data)
    }
    return fetchPost(url,data)
  },
  //申请消费分期
  applyConsume(data){
    let url = HTTP_URL + "api/consumeInstalment/applyConsume.json";
    if(data.channel=="hxdapp"){
      return hxdRESTPluginPost(url,data)
    }
    return fetchPost(url,data)
  },
  //红包计算
  countRedPacket(data) {
    let url = HTTP_URL+"api/redPacket/countRedPacketFee.json";
    if(data.channel=="hxdapp"){
      return hxdRESTPluginPost(url,data)
    }
    return fetchPost(url, data);
  }
};
