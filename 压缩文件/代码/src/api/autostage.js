import axios from 'axios';
import {Message} from 'element-ui';
import GLOBAL from "@/assets/js/global.js";

//全局配置携带跨源凭证
axios.defaults.withCredentials=true;  

// 请求拦截器
axios.interceptors.request.use(function (config) {
    config.headers = {
        // 'Content-Type':'text/plain'
        // 'Content-Type':'application/json' //设置跨域头部
        // 'Content-Type':'application/x-www-json-urlencoded'
    };
    return config;
  }, function(error) {
    Message.error({
        message: '请求失败'
    })
    return Promise.reject(error);
})
// 响应拦截器
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
        Message.error({
            message: '请求失败，请稍后重试~'
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
// 封装axios的post请求 输入请求地址和参数
export function fetchPost(url, params){
    return new Promise((resolve, reject) => {
        axios.post(url,params).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        })
   })
}
// 封装axios的get请求 输入请求地址和参数
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
export function hxdRESTPluginPost(url, params){
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
    // 自动分期申请页
    getapplyData(data){
        let url = GLOBAL.URL+"/main/api/autoInstallment/autoInstallmentInfo.json";
        let params = data;
        if(data.channel=="hxdapp"){
            return hxdRESTPluginPost(url,params);
        }
        return fetchPost(url,params);
    },
    // 切换信用卡
    changeCredit(data){
        let url =  GLOBAL.URL+"/main/api/autoInstallment/changeCard.json";
        let params = data;
        if(data.channel=="hxdapp"){
            return hxdRESTPluginPost(url,params);
        }
        return fetchPost(url,params);
    },
    // 自动分期获取费率
    getperiodRate(data){
        let url =  GLOBAL.URL+"/main/api/autoInstallment/changeMoney.json";
        let params = data;
        if(data.channel=="hxdapp"){
            return hxdRESTPluginPost(url,params);
        }
        return fetchPost(url,params);
    },
    // 提交信息(申请/修改)
    submitInfo(data){
        let url =  GLOBAL.URL+"/main/api/autoInstallment/applyAutoInstallment.json";
        let params = data;
        if(data.channel=="hxdapp"){
            return hxdRESTPluginPost(url,params);
        }
        return fetchPost(url,params);
    }
}