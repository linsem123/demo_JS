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
//响应拦截器
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
    // 登录界面  
    // 登录提交
    loginIn(data){
        let url = GLOBAL.URL+"/main/login3/login.json";
        let params = data.data;
        if(data.channel=="hxdapp"){
            return hxdRESTPluginPost(url,params);
        }
        return fetchPost(url,params); 
    },

    // 登录短信验证码
    loginIdentCode(data){
        let url = GLOBAL.URL+"/main/login3/getSliderForLogin.json";
        let params = data.data;
        if(data.channel=="hxdapp"){
            return hxdRESTPluginPost(url,params);
        }
        return fetchPost(url,params); 
    },

    // 登录滑块验证码
    loginImgCode(data){
        let url = GLOBAL.URL+"/main/login3/sendLoginMessage.json";
        let params = data.data;
        if(data.channel=="hxdapp"){
            return hxdRESTPluginPost(url,params);
        }
        return fetchPost(url,params); 
    },

    // 兴享贷首页(授权)
    getIndex(data){
        let url = GLOBAL.URL+"/main/largeSale/mainScale.json";
        let params = data.data;
        if(data.channel=="hxdapp"){
            return hxdRESTPluginPost(url,params);
        }
        return fetchPost(url,params); 
    },
    // 不授权
    getWebIndex(data){
        let url = GLOBAL.URL+"/main/largeSale/mainScaleWeb.json";
        let params = data.data;
        if(data.channel=="hxdapp"){
            return hxdRESTPluginPost(url,params);
        }
        return fetchPost(url,params); 
    },

    // 更改账单日期
    changeAccountData(data){
        let url = GLOBAL.URL+"/main/largeSale/mainSeScale.json";
        let params = data.data;
        if(data.channel=="hxdapp"){
            return hxdRESTPluginPost(url,params);
        }
        return fetchPost(url,params);
    },

     // 申请金额变更
     changeMoney(data){
        let url = GLOBAL.URL+"/main/largeSale/trialByStages.json";
        let params = data.data;
        if(data.channel=="hxdapp"){
            return hxdRESTPluginPost(url,params);
        }
        return fetchPost(url,params); 
    },

    // 短信验证码
    getIdent(data){
        let url = GLOBAL.URL+"/main/checkSlider/getSlider.json";
        let params = data.data;
        if(data.channel=="hxdapp"){
            return hxdRESTPluginPost(url,params);
        }
        return fetchPost(url,params);
    },

    // 滑块验证码
    getImgCode(data){
        let url = GLOBAL.URL+"/main/checkSlider/checkSlideAndSendSms.json";
        let params = data.data;
        if(data.channel=="hxdapp"){
            return hxdRESTPluginPost(url,params);
        }
        return fetchPost(url,params);
    },

    // 根据卡号查对应行
    getCardBank(data){
        let url = GLOBAL.URL+"/main/defq/getCardBank";
        let params = data.data;
        if(data.channel=="hxdapp"){
            return hxdRESTPluginPost(url,params);
        }
        return fetchPost(url,params);
    },

    // 新增借记卡
  addBankCard(data){   //确认添加按钮
        let url = GLOBAL.URL+"/main/defq/addBankInfo";
        let params = data.data;
        if(data.channel=="hxdapp"){
            return hxdRESTPluginPost(url,params);
        }
        return fetchPost(url,params);
    },
 
    // 获取所有借记卡
    getBankList(data){
        let url = GLOBAL.URL+"/main/defq/getBankInfo";
        let params = data.data;
        if(data.channel=="hxdapp"){
            return hxdRESTPluginPost(url,params);
        }
        return fetchPost(url,params);
    },

    // 删除借记卡
    deleteBank(data){
        let url = GLOBAL.URL+"/main/defq/delBankInfo";
        let params = data.data;
        if(data.channel=="hxdapp"){
            return hxdRESTPluginPost(url,params);
        }
        return fetchPost(url,params);
    },

    // 提交申请
    submitData(data){
        let url = GLOBAL.URL+"/main/largeSale/applyTrade.json";
        let params = data.data; 
        if(data.channel=="hxdapp"){
            return hxdRESTPluginPost(url,params);
        }
        return fetchPost(url,params);
    }
}