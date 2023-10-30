import log from "@/api/log.js";
import {saAlert,channel,hxdappIsSpecial} from "@/assets/js/common.js";
const state = {
  // version:"1.0.6",  // 分支
  version:"2.0.6",  // 主干
  // version:"3.0.1",  // uat
  // version:"3.6.1",  // 生产版本
  login:{
    loginData:{
      IdNum:"",         // 证件号码
      PhoneNum:"",      // 手机号
      remindmsg:{
        indentMsg:"",   // 证件号码提示信息
        phoneMsg:"",    // 手机号提示信息
        codeMsg:""      // 验证码提示信息
      }
    },
    identify: {
      textMsg: {
        status: 1,
        msg: '获取验证码',
        t: null,
        code: ''
      },
      imageCode: {
        show: false,
        bgImg: '',
        slideImg: '',
        sendlen: ""
      }
    },
    alert: {
      showAlert: false,
      msg: '',
      err: ''
    },
  }
};

const getters={
  identifyBtn: (state) => {
    return state.identify.textMsg.code.length > 0;
  }
};
const actions = {
  // 获取短信验证码
  bgetphonecode({dispatch,commit,state},payload){ 
    baseData.data.mobile = payload.mobile;
    baseData.data.sliderId = payload.sliderId;
    baseData.data.sliderCode = "";
    baseData.data.timestamp = payload.timestamp;
    commit('com/BIMAGECODEMOVE',"");                      // 设置滑动距离为空
    commit('BCHANGESTATUS', 0);                           // 更改按钮状态(不可点)
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    log.sendSmsCode(baseData).then((res)=>{
      commit('BCHANGESTATUS', 1);                         // 更改按钮状态(不可点)
      if(res.success==true){
        if(res.data.needSlider==false){                   // false=>隐藏滑块
          if(res.data.smsCodeAlert=="" || res.data.smsCodeAlert==undefined){
            commit('BSHOWLOGINALERT', {show: true, msg: '发送成功', err: ''}); 
          }else{
            commit('BSHOWLOGINALERT', {show: true, msg: "短信验证码:"+res.data.smsCodeAlert, err: ''});
          }
          dispatch('autoCountDown',120);                  // 倒数计时
        }else if(res.data.needSlider==true){              // true=>显示滑块
          commit('BSHOWIMAGECODE',true);                  // 显示滑块验证码
          if(channel()=="hxdapp"&&hxdappIsSpecial()){
            baseData.channel = "hxdapp";
          }else{
            baseData.channel = "normal";
          }
          log.getSlider(baseData).then((res)=>{
            if(res.success==true){
              commit('BASSIGNIMAGE',res.data);            // 滑块赋图
            }else if(res.success==false){
              saAlert("授权登录页","滑块图片赋值失败",res.msg,"报错提示");
              commit('BSHOWLOGINALERT', {show: true, msg: res.msg, err: res.code});
            }
          }).catch((err)=>{
            console.log(err);
            if(err.response.status){
              commit('BSHOWLOGINALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
              saAlert("授权登录页","滑块图片赋值失败",err.response.status+err.response.statusText,"请求报错");
            }else{
              commit('BSHOWLOGINALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
              saAlert("授权登录页","滑块图片赋值失败","请求失败","请求报错");
            }
          });
        }
      }else if(res.success==false){
        saAlert("授权登录页","获取滑块验证码",res.msg,"报错提示");
        commit('BSHOWLOGINALERT', {show: true, msg: res.msg, err: res.code});
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BSHOWLOGINALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        saAlert("授权登录页","获取滑块验证码",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BSHOWLOGINALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("授权登录页","获取滑块验证码","请求失败","请求报错");
      }
      commit('BCHANGESTATUS', 1);
    });
  },

  // 发送滑块距离
  sendphonelen({dispatch,commit,state},payload){
    baseData.data.mobile = payload.mobile;
    baseData.data.sliderId = payload.sliderId;
    baseData.data.sliderCode = payload.imageCode.sendlen;
    baseData.data.timestamp = payload.timestamp;
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    log.sendSmsCode(baseData).then((res)=>{
      if(res.success==true){
        if(res.data.smsCodeAlert=="" || res.data.smsCodeAlert==undefined){
          commit('BSHOWLOGINALERT', {show: true, msg: '发送成功', err: ''}); 
        }else{
          commit('BSHOWLOGINALERT', {show: true, msg: "短信验证码:"+res.data.smsCodeAlert, err: ''});
        }
        commit('BSHOWIMAGECODE',false);        // 隐藏滑块验证码 
        dispatch('autoCountDown',120);         // 倒数计时
        commit('BIMAGECODEMOVE',"");           // 设置滑动距离为空
      }else if(res.success==false){
        saAlert("授权登录页","滑动滑块",res.msg,"报错提示");
        commit('BSHOWIMAGECODE',false);    // 隐藏滑块验证码 
        if(res.code=="sliderTooFrequently"){
          commit('BSHOWLOGINALERT', {show: true, msg: res.msg, err: res.code});
          dispatch('autoCountDown',60); 
        }else{
          commit('BSHOWLOGINALERT', {show: true, msg: res.msg, err: res.code}); 
        }
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BSHOWLOGINALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        saAlert("授权登录页","滑动滑块",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BSHOWLOGINALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("授权登录页","滑动滑块","请求失败","请求报错");
      }
    });
  },

  // 更换滑块图片
  refreshImage({dispatch,commit,state},payload){
    baseData.data.sliderId = payload.sliderId;
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    log.getSlider(baseData).then((res)=>{
      if(res.success==true){
        commit('BASSIGNIMAGE',res.data);              // 滑块赋图
      }else if(res.success==false){
        saAlert("授权登录页","更新滑块图片",res.msg,"报错提示");
        commit('BSHOWLOGINALERT', {show: true, msg: res.msg, err: res.code});
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BSHOWLOGINALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        saAlert("授权登录页","更新滑块图片",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BSHOWLOGINALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("授权登录页","更新滑块图片","请求失败","请求报错");
      }
    });
  },

  // 页面倒计时
  autoCountDown({dispatch, commit, state},n) {
    commit('BCHANGESTATUS', 0);  // 更改按钮状态(不可点)
    var times = n;
    var t = setInterval(() => {
      times--;
      commit('BCHANGETEXT', times + 's');
      if (times <= 0) {
        commit('BCHANGETEXT', '获取验证码'); // 更换按钮文字
        commit('BCHANGESTATUS', 1);
        clearInterval(t);
      }
    }, 1000);
    commit('SETINTERVAL', t);
  },
};

const mutations={
  BASSINID(state,data){             // 证件号码赋值
    state.login.loginData.IdNum = data.IdNum;
  },
  BASSINPHONE(state,data){          // 手机号赋值
    state.login.loginData.PhoneNum = data.PhoneNum;
  },
  BSHOWINDENTMSG(state,data){       // 显示证件号码错误提示
    state.login.loginData.remindmsg.indentMsg = data.msg;
  },
  BSHOWPHONEMSG(state,data){        // 显示手机号错误提示
    state.login.loginData.remindmsg.phoneMsg = data.msg;
  },
  BSHOWCODEMSG(state,data){         // 显示验证码错误提示
    state.login.loginData.remindmsg.codeMsg = data.msg;
  },
  BSHOWLOGINALERT(state,data){      // 登录页面信息弹框
    state.login.alert.showAlert = data.show;
    state.login.alert.msg = data.msg;
    state.login.alert.err = data.err;
  },
  BIMAGECODEMOVE(state,value){      // 滑块滑动距离赋值 默认是0
    state.login.identify.imageCode.sendlen = value;
  }, 
  BSHOWIMAGECODE(state, value) {    // 判断是否出现滑块验证码 默认false
    state.login.identify.imageCode.show = value;
  },
  BCHANGESTATUS(state, value) {     // 更改按钮状态。防止多次点击
    state.login.identify.textMsg.status = value;
  },
  BCHANGETEXT(state, data) {        // 更换按钮文字
    state.login.identify.textMsg.msg = data;
  },
  SETINTERVAL(state, value) {       // 设置倒计时时间
    state.login.identify.textMsg.t = value;
  },
  BASSIGNIMAGE(state,res){          // 给滑块验证码图片赋值
    state.login.identify.imageCode.bgImg = res.bigimgStr;
    state.login.identify.imageCode.slideImg = res.tarimgStr;
  },
};

const baseData = {
  openId: "",
  traceId: Date.now() + '',
  channel: '',
  version: state.version,
  data: {}
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}