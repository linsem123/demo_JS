import com from "@/api/com.js";
import {saAlert,channel,hxdappIsSpecial} from "@/assets/js/common.js";
const state = {
  login:{
    loginkhid:"",
    loginuuid:"",
    loginFlag:false,    // 未登录
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
        sendlen: 0
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
  getphonecode({dispatch,commit,state},payload){ 
    var phoneInfo = {
      phoneNum:payload.loginData.PhoneNum,
      type:payload.workType
    }
    commit('com/BIMAGECODEMOVE',0);  // 设置滑动距离为0
    commit('BCHANGESTATUS', 0);  // 更改按钮状态(不可点)
    var channel2 = "";
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      channel2 = "hxdapp";
    }else{
      channel2 = "normal";
    }
    com.cloginIdentCode({data:phoneInfo,channel:channel2}).then((res)=>{
      commit('BCHANGESTATUS', 1);  // 更改按钮状态(不可点)
      if(res.isSuccess==true){
        if(res.code=="firstSend"){   // 第一次发送短信成功
          var phoneimgInfo = {
            phoneNum:payload.loginData.PhoneNum,
            type:payload.workType,
            captchaCode:payload.imageCode.sendlen
          }
          var channel2 = "";
          if(channel()=="hxdapp"&&hxdappIsSpecial()){
            channel2 = "hxdapp";
          }else{
            channel2 = "normal";
          }
          com.cloginImgCode({data:phoneimgInfo,channel:channel2}).then((res)=>{
            if(res.isSuccess==true){
              if(res.smsCode=="" || res.smsCode==undefined){
                commit('BSHOWLOGINALERT', {show: true, msg: '发送成功', err: ''});
                $("#identCode").focus();
              }else{
                commit('BSHOWLOGINALERT', {show: true, msg: "短信验证码:"+res.smsCode, err: ''});
                $("#identCode").focus();
              }
              commit('BSHOWIMAGECODE',false);        // 隐藏滑块验证码 
              dispatch('autoCountDown',120);         // 倒数计时
              commit('BIMAGECODEMOVE',0);            // 设置滑动距离为0
            }else if(res.isSuccess==false){
              saAlert("登录页","第一次直接获取短信验证码",res.msg,"报错提示");
              commit('BSHOWLOGINALERT', {show: true, msg: res.msg, err: res.code});
            }
          }).catch((err)=>{
            console.log(err);
            if(err.response.status){
              commit('BSHOWLOGINALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
              saAlert("登录页","第一次直接获取短信验证码",err.response.status+err.response.statusText,"请求报错");
            }else{
              commit('BSHOWLOGINALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
              saAlert("登录页","第一次直接获取短信验证码","请求失败","请求报错");
            } 
          })
        }else{ // 非第一次发送短信
          commit('BSHOWIMAGECODE',true);  // 显示滑块验证码
          commit('BASSIGNIMAGE',res);     // 给滑块验证码的图片赋值
        }
      }else if(res.isSuccess==false){
        saAlert("登录页","获取滑块验证码",res.msg,"报错提示");
        commit('BSHOWLOGINALERT', {show: true, msg: res.msg, err: res.code});
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BSHOWLOGINALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        saAlert("登录页","获取滑块验证码",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BSHOWLOGINALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("登录页","获取滑块验证码","请求失败","请求报错");
      } 
      commit('BCHANGESTATUS', 1);
    });
  },

  // 发送滑块距离
  sendphonelen({dispatch,commit,state},payload){
    var lenInfo = {
      phoneNum:payload.loginData.PhoneNum,
      type:payload.workType,
      captchaCode:payload.imageCode.sendlen
    }
    var channel2 = "";
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      channel2 = "hxdapp";
    }else{
      channel2 = "normal";
    }
    com.cloginImgCode({data:lenInfo,channel:channel2}).then((res)=>{
      if(res.isSuccess==true){
        if(res.smsCode=="" || res.smsCode==undefined){
          commit('BSHOWLOGINALERT', {show: true, msg: '发送成功', err: ''});
          $("#identCode").focus();
        }else{
          commit('BSHOWLOGINALERT', {show: true, msg: "短信验证码:"+res.smsCode, err: ''});
          $("#identCode").focus();
        }
        commit('BSHOWIMAGECODE',false);        // 隐藏滑块验证码 
        dispatch('autoCountDown',120);         // 倒数计时120S
        commit('BIMAGECODEMOVE',0);        // 设置滑动距离为0        
      }else if(res.isSuccess==false){
        saAlert("登录页","滑动滑块验证码",res.msg,"报错提示");
        if(res.fal=="pinfan"){
          commit('BSHOWIMAGECODE',false);    // 隐藏滑块验证码 
          commit('BSHOWLOGINALERT', {show: true, msg: res.msg, err: res.code});  
        }else{
          commit('BSHOWLOGINALERT', {show: true, msg: res.msg, err: res.code});
          var identInfo = {
            phoneNum:payload.loginData.PhoneNum,
            type:payload.workType
          }
          var channel2 = "";
          if(channel()=="hxdapp"&&hxdappIsSpecial()){
            channel2 = "hxdapp";
          }else{
            channel2 = "normal";
          }
          com.cloginIdentCode({data:identInfo,channel:channel2}).then((res)=>{
            if(res.isSuccess==true){
              commit('BASSIGNIMAGE',res);     // 给滑块验证码的图片赋值
            }else if(res.isSuccess==false){
              saAlert("登录页","重复滑动滑块验证码",res.msg,"报错提示");
              if(res.flag=="error"){
                commit('BSHOWIMAGECODE',false);        // 隐藏滑块验证码 
                dispatch('autoCountDown',60);          // 倒数计时60S
              }else{
                commit('BSHOWLOGINALERT', {show: true, msg: res.msg, err: res.code});
              }
            }
          }).catch((err)=>{
            console.log(err);
            if(err.response.status){
              commit('BSHOWLOGINALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
              saAlert("登录页","重复滑动滑块验证码",err.response.status+err.response.statusText,"请求报错");
            }else{
              commit('BSHOWLOGINALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
              saAlert("登录页","重复滑动滑块验证码","请求失败","请求报错");
            }
          });
        }
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BSHOWLOGINALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        saAlert("登录页","滑动滑块验证码",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BSHOWLOGINALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("登录页","滑动滑块验证码","请求失败","请求报错");
      }
    });
  },
  
  // 更换滑块图片
  refreshImage({dispatch,commit,state},payload){
    var refreshInfo = {
      phoneNum:payload.loginData.PhoneNum,
      type:payload.workType
    }
    var channel2 = "";
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      channel2 = "hxdapp";
    }else{
      channel2 = "normal";
    }
    com.cloginIdentCode({data:refreshInfo,channel:channel2}).then((res)=>{
      if(res.isSuccess==true){
        commit('BASSIGNIMAGE',res);     // 给滑块验证码的图片赋值
      }else if(res.isSuccess==false){
        saAlert("登录页","刷新按钮点击",res.msg,"报错提示");
        if(res.flag=="error"){
          commit('BSHOWIMAGECODE',false);        // 隐藏滑块验证码 
          commit('BSHOWLOGINALERT', {show: true, msg: "滑块请求次数过多,请60秒后重试", err: res.code});
          dispatch('autoCountDown',60);          // 倒数计时60S
        }else{
          commit('BSHOWLOGINALERT', {show: true, msg: res.msg, err: res.code});
        }
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BSHOWLOGINALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        saAlert("登录页","滑动滑块验证码",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BSHOWLOGINALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("登录页","滑动滑块验证码","请求失败","请求报错");
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

  // 登录
  login({commit,state},payload){
    var loginInfo = {
      idNo:payload.idNo,
      idType:payload.idType,
      phone:payload.phone,
      smsValidateNo:payload.code,
      khid:payload.loginkhid,
      type:payload.workType
    }
    var channel2 = "";
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      channel2 = "hxdapp";
    }else{
      channel2 = "normal";
    }
    com.cloginIn({data:loginInfo,channel:channel2}).then((res)=>{
      if(res.isSuccess==true){
        var obj = {
          khid:payload.loginkhid,
          uuid:res.data.uuid
        }
        commit("SAVEKHID",obj);
        payload.router.push({path:'/IdUpdate/UploadIdCard'});
      }else if(res.isSuccess==false){
        saAlert("登录页","兴享贷登录页进行登录",res.msg,"报错提示");
        commit('BSHOWLOGINALERT', {show: true, msg: res.msg, err: res.code});
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BSHOWLOGINALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        saAlert("登录页","兴享贷登录页进行登录",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BSHOWLOGINALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("登录页","兴享贷登录页进行登录","请求失败","请求报错");
      }
    });
  },
};

const mutations={
  SAVEKHID(state,data){             // 保存听云唯一标识
    state.login.loginkhid = data.khid;
    state.login.loginuuid = data.uuid;
    state.login.loginFlag = true;
  },
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
  BIMAGECODEMOVE(state,value){   // 滑块滑动距离赋值 默认是0
    state.login.identify.imageCode.sendlen = value;
  }, 
  BSHOWIMAGECODE(state, value) {   // 判断是否出现滑块验证码 默认false
    state.login.identify.imageCode.show = value;
  },
  BCHANGESTATUS(state, value) {   // 更改按钮状态。防止多次点击
    state.login.identify.textMsg.status = value;
  },
  BCHANGETEXT(state, data) {  // 更换按钮文字
    state.login.identify.textMsg.msg = data;
  },
  SETINTERVAL(state, value) {
    state.login.identify.textMsg.t = value;
  },
  BASSIGNIMAGE(state,res){       // 给滑块验证码图片赋值
    state.login.identify.imageCode.bgImg = "data:image/jpg;base64,"+res.bigimg;
    state.login.identify.imageCode.slideImg = "data:image/jpg;base64,"+res.tarimg;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
