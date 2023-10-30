import axios from 'axios';
import {HTTP_URL} from "./totalApi";
import { Loading, Message } from 'element-ui';

axios.defaults.withCredentials = true;
var token = null;
token = localStorage.getItem("token");
// var loadinginstace;
// 请求拦截器
axios.defaults.timeout = 6000;
axios.interceptors.request.use(function (config) {
  token = localStorage.getItem("token");
  config.headers = {
    'Content-Type': 'application/json', //设置跨域头部
    'timeout': 6000,
    "token": "TOKEN=" + token
  };
  // loadinginstace = Loading.service({
  //   fullscreen: true,
  //   lock: true,
  //   text: 'Loading',
  //   spinner: 'el-icon-loading',
  //   background: 'rgba(0, 0, 0, 0.5)'
  // });
  return config;
}, function(error) {
  Message.error({
      message: '请求失败'
  })
  return Promise.reject(error);
})
axios.interceptors.response.use(function(response){
  return response;
},function axiosRetryInterceptor(err) {
  var config = err.config;
  if(!config||!config.retry){
      Message.error({
          message: err.response.status+err.response.statusText
      });
      return Promise.reject(err);
  }
  config._retryCount = config._retryCount || 0;
  if(config._retryCount>=config.retry){
      // Message.error({
      //     message: '请求超时，请重试'
      // })
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


export default {

  //红包
  applyRedPacketFeesList(data) {
    let url = HTTP_URL+"api/redPacket/applyRedPacketFeesList.json";
    return fetchPost(url, data);
  }
};
