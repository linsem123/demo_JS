import iu from "@/api/iu.js";
import {initsa,supportFileReader,compress,getBlob,getFormData,getCookie,saAlert,channel,hxdappIsSpecial} from "@/assets/js/common.js";
import GLOBAL from "@/assets/js/global.js";
import {Loading} from "element-ui";
import EXIF from "exif-js";
const state = {
  // version: "1.0.6",   // 分支
  version: "2.0.6",   // 主干
  // version: "3.0.1",   // 准生产
  // version: "3.6.1",   // 生产
  closeFlag:false,
  freeFlag:false,     // true为web/wx
  keyUUID: '',
  khid:"",
  home: {
    photo: require('@/assets/images/idupdate/photo.png'),
    btn: false,
    name:'',
    homeShow:false
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
      length: 0
    }
  },
  alert: {
    login: {
      showAlert: false,
      msg: '',
      err: ''
    },
    home: {
      showAlert: false,
      msg: '',
      err: ''
    },
    identify: {
      showAlert: false,
      msg: '',
      err: ''
    },
    idcard:{
      showAlert: false,
      msg: '',
      err: ''
    },
    coninfo:{
      showAlert: false,
      msg: '',
      err: ''
    }
  },
  public:{
    pubui:{
      telShow:""
    },
    pubdata:{
      remindMsg:"",
    },
    pubmenu:{
      laystatu:"",
      reminderstatu:"",            
    }
  },
  info:{
    infodata:{
        Name:"",             // 姓名
        indentNum:"",        // 证件号码
        startTime:"",        // 起始日期
        endTime:"",          // 失效日期
        startShow:false,
        endShow:false
    },
    infoui:{
        shortShow:false,      // 正常显示
        longShow:false,       // 长期有效
    }
  },
  success:{
    Sflag:false
  },
  free:{
    imageCode: {
      show: false,
      bgImg: '',
      slideImg: '',
      sendlen: 0
    },
    alert: {
        showAlert: false,
        msg: '',
        err: ''
    },
  },
  bintang:{
    alert: {
      showAlert: false,
      msg: '',
      err: ''
    },
  }
};
const getters = {
  identifyBtn: (state) => {
    return state.identify.textMsg.code.length > 0;
  }
};
const actions = {
  // 身份验证判断页面监听
  saInit({commit, state}, title) {    
    state.khid = initsa(title);
  },
  // 登陆判断是否是18位身份证
  judgeLogin({commit, state}, _this) {
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    iu.updateValidity(baseData).then((res) => {
      if(res.success){
        commit('SETKEYUUID', res.data.keyUUID);
        commit('SETHOMESHOW',true);
      }else{
        saAlert("证件有效期更新人脸拍摄页","登录判断",res.msg,"报错提示");
        commit('SETLOGINALERT', {show: true, msg: res.msg, err: res.code})
      }
    }).catch((err) => {
      console.log(err);
      if(err.response.status){
        commit('SETLOGINALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        saAlert("证件有效期更新人脸拍摄页","登录判断",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('SETLOGINALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("证件有效期更新人脸拍摄页","登录判断","请求失败","请求报错");
      }
    })
  },
  //上传图片预处理
  handleImg({dispatch, commit, state}, data) {
    var file = data.file;
    var _this = data._this;
    var loadinginstace = Loading.service({
      fullscreen: true,
      lock: true,
      text: '图片上传中...',
      spinner: 'el-icon-loading2',
      background: 'rgba(0, 0, 0, 0.5)'
    });
    let Orientation;
    //旋转问题
    EXIF.getData(file, function () {
      Orientation = EXIF.getTag(this, 'Orientation');
    });
    //是否支持FileReader
    if(!supportFileReader(file)){
      commit('SETHOMEALERT', {show: true, msg: '很抱歉您的设备不支持上传此类图片', err: ''});
      return false;
    }
    if(/(jpeg|jpg|png|bmp)$/.test(file.type)){
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = (e) => {
        var result = e.target.result;
        var img = new Image();
        img.src = result;
        if(result.length <= (20 * 1024)){
          commit('SETHOMEALERT', {show: true, msg: '您上传的图片不清晰,请重试', err: ''});
          loadinginstace.close();
        }else if(result.length <= (600 * 1024)){
          var d = {
            str: result,
            file: file,
            loadinginstace: loadinginstace
          };
          dispatch('imgupload', d);
          return false;
        }else{
          img.onload = () => {
            var data = compress(img, Orientation, file.type);
            if(data.length <= 20 * 1024){
              commit('SETHOMEALERT', {show: true, msg: '您上传的图片不清晰,请重试', err: ''});
              loadinginstace.close();
              return false;
            }
            var d = {
              str: data,
              file: file,
              loadinginstace: loadinginstace,
              _this: _this
            };
            dispatch('imgupload', d);
          }
        }
      }
    }
  },
  //上传图片预处理
  imgupload({dispatch, commit, state}, data) {
    var str = data.str;
    var file = data.file;
    var loadinginstace = data.loadinginstace;
    var text = window.atob(str.split(',')[1]);
    var buffer = new Uint8Array(text.length);
    for (var i = 0; i < text.length; i++) {
      buffer[i] = text.charCodeAt(i);
    }
    var blob = getBlob([buffer], file.type);
    var formData = getFormData();
    var filename = 'img' + Date.now() + '.jpg';
    formData.append('photoFile', blob, filename);
    formData.append('openId', getCookie('openId'));
    formData.append('traceId', Date.now() + '');
    formData.append('channel', 'wechat');
    formData.append('version', state.version);
    formData.append('keyUUID', state.keyUUID);
    var d = {
      formData: formData,
      str: str,
      loadinginstace: loadinginstace,
      _this: data._this
    };
    dispatch('postImg', d);
  },
  //上传图片
  postImg({dispatch, commit, state}, value) {
    value.loadinginstace.close();
    iu.uploadPicture(value.formData).then((res) => {
      if(res.success){
        commit('SETHOMEPHOTO', {str: value.str,btn: true});
        commit('SETHOMEPHOTONAME',res.data.pictureName);
      }else{
        saAlert("证件有效期更新人脸拍摄页","上传人脸图片",res.msg,"报错提示");
        commit('SETHOMEALERT', {show: true, msg: res.msg, err: res.code});
      }
    }).catch((err) => {
      console.log(err);
      if(err.response.status){
        commit('SETHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        saAlert("证件有效期更新人脸拍摄页","上传人脸图片",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('SETHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("证件有效期更新人脸拍摄页","上传人脸图片","请求失败","请求报错");
      }
    });
  },
  //验证人脸识别
  recoFace({dispatch, commit, state}, _this) {
    baseData.data.keyUUID = state.keyUUID;
    baseData.data.pictureName = state.home.name;
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    iu.recoFace(baseData).then((res)=>{
      if(res.success){
        if(res.data.sendSmsFlag === '1'){
          _this.$router.push('/IdUpdate/IdentifyPage');
        }else{
          //跳转身份证
          _this.$router.push('/IdUpdate/UploadIdCard');
          commit('SETHOMEPHOTO',{str: require('@/assets/images/idupdate/photo.png'),btn:false})
        }
      }else{
        saAlert("证件有效期更新人脸拍摄页","验证人脸识别",res.msg,"报错提示");
        commit('SETHOMEPHOTO',{str: require('@/assets/images/idupdate/photo.png'),btn:false})
        commit('SETHOMEALERT', {show: true, msg: res.msg, err: res.code});
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('SETHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        saAlert("证件有效期更新人脸拍摄页","验证人脸识别",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('SETHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("证件有效期更新人脸拍摄页","验证人脸识别","请求失败","请求报错");
      }
    })
  },
  //进页面自动发短信(倒计时)
  autoSendSms({dispatch, commit, state}) {
    baseData.data.keyUUID = state.keyUUID;
    baseData.data.hkLength = state.identify.imageCode.length;
    commit('SETIDENTIFYSTATUS', 0);  // 更改按钮状态
    commit('SETIMAGECODEMOVE',0); 
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    iu.getSmsCodeHk(baseData).then((res) => {
      commit('SETIDENTIFYSTATUS', 1);  // 更改按钮状态
      if(res.success){
        if(res.data.noFirstSend === '1'){ //第一次-直接发短信
          commit('SETIMAGECODE',false);  // 不显示滑块验证码
          dispatch('autoCountDown',120);      // 倒数计时
          commit('iu/SETIMAGECODEMOVE',0);
          if(!res.data.smsCode==""){
            commit('SETIDENTIFYALERT', {show: true, msg: res.data.smsCode, err: ''})
          }
        }else{ //不是第一次-滑块
          commit('SETIMAGECODE',true);  // 显示滑块验证码
          dispatch('getSlider');        // 获取滑块信息
        }
      }else{
        if(res.code=="ERR_01"){
          commit('SETIMAGECODE',false); 
        }else if(res.code=="ERR_02"){
          commit('SETIMAGECODE',false);
          dispatch('autoCountDown',60);
        }else if(res.code=="ERR_04"){
          commit('SETIMAGECODE',false); 
        }else{
          dispatch('getSlider');          // 获取滑块信息
        }
        saAlert("证件有效期更新短信验证页","进页面自动发短信",res.msg,"报错提示");
        commit('SETIDENTIFYALERT', {show: true, msg: res.msg, err: res.code});
      }
    }).catch((err) => {
      console.log(err);
      if(err.response.status){
        commit('SETIDENTIFYALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        saAlert("证件有效期更新短信验证页","进页面自动发短信",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('SETIDENTIFYALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("证件有效期更新短信验证页","进页面自动发短信","请求失败","请求报错");
      }
      commit('SETIDENTIFYSTATUS', 1);
    })
  },
  //页面倒计时
  autoCountDown({dispatch, commit, state},cnt) {
    commit('SETIDENTIFYSTATUS', 0);  // 更改按钮状态
    var times = cnt;
    var t = setInterval(() => {
      times--;
      commit('SETIDENTIFYTEXTMSG', times + 's');
      if (times <= 0) {
        commit('SETIDENTIFYTEXTMSG', '获取验证码');
        commit('SETIDENTIFYSTATUS', 1);
        clearInterval(t);
      }
    }, 1000);
    commit('SETINTERVAL', t);
  },
  //获取滑块信息
  getSlider({dispatch, commit, state}){
    baseData.data.keyUUID = state.keyUUID;
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    iu.getSlider(baseData).then((res)=>{
      if(res.success){
        commit('SETIMAGECODEIMG',res.data);
      }else{
        saAlert("证件有效期更新短信验证页","获取滑块信息",res.msg,"报错提示");
        commit('SETIDENTIFYALERT', {show: true, msg: res.msg, err: res.code})
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('SETIDENTIFYALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        saAlert("证件有效期更新短信验证页","获取滑块信息",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('SETIDENTIFYALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("证件有效期更新短信验证页","获取滑块信息","请求失败","请求报错");
      }
    })
  },
  //校验短信验证码
  checkSmsCode({ commit, state},_this){
    baseData.data.keyUUID = state.keyUUID;
    baseData.data.smsCode = state.identify.textMsg.code;
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    iu.checkSmsCode(baseData).then((res)=>{
      if(res.success){
        //跳转身份证
        _this.$router.push('/IdUpdate/UploadIdCard');
      }else{
        saAlert("证件有效期更新短信验证页","校验短信验证码",res.msg,"报错提示");
        commit('SETIDENTIFYALERT', {show: true, msg: res.msg, err: res.code})
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('SETIDENTIFYALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        saAlert("证件有效期更新短信验证页","校验短信验证码",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('SETIDENTIFYALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("证件有效期更新短信验证页","校验短信验证码","请求失败","请求报错");
      }
    })
  },
  // 第二部分
  showstartdate({commit,state},payload){      // 显示起始日期
    commit('SHOWSTARTDATE',payload);
  },
  hidestartdate({commit,state},payload){      // 隐藏起始日期
    commit('HIDESTARTDATE',payload);
  },
  changestartdate({commit,state},payload){    // 更改起始日期
    commit('CHANGESTARTDATE',payload);
  },
  showenddate({commit,state},payload){        // 显示失效日期
    commit('SHOWENDDATE',payload);
  },
  hideenddate({commit,state},payload){        // 隐藏失效日期
    commit('HIDEENDDATE',payload);
  },
  changeenddate({commit,state},payload){      // 更改失效日期
    commit('CHANGEENDDATE',payload);
  },
  picerror({commit,state},payload){         // 照片信息
    commit('PICERROR',payload);
  },
  showremind({commit,state},payload){         // 显示提示信息
    commit('SHOWREMIND',payload);
  },
  hideremind({commit,state},payload){         // 隐藏提示信息
    commit('HIDEREMIND',payload);
  },
  failmoretime({commit,state},payload){       // 失败次数过多
    commit('FAILMORETIME',payload);
  },
  uploadidcard({commit,state},payload){      // 给证件号赋值 
    var idcardInfo = {
      uuid:state.keyUUID,
      khid:state.khid
    };
    var channel2 = "";
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
        channel2 = "hxdapp";
    }else{
        channel2 = "normal";
    }
    iu.uploadIdCard({data:idcardInfo,channel:channel2}).then((res)=>{
      if(res.success==true){
        if(res.code=="RO200099"){
          commit('NAMECHANGED',data);
        }
        commit('UPLOADIDCARD',res.data);
        payload.router.push({path:'/IdUpdate/InfoConfirm'});
      }else if(res.success==false){
        if(res.message==""){
          commit('SETIDCARDALERT', {show: true, msg: '页面失效，请重试！', err: ''});
        }else{
          saAlert("证件有效期更新身份证上传","身份证上传确认",res.msg,"报错提示");
          $("#fileName1").val("");
          $("#img1").attr({'src':require("@/assets/images/idupdate/pros.png"),'width':257+'px','height':160+'px'});
          $("#img1").next().css('display','block');
          $("#img1").next().next().next().css('display','block');
          $("#img1").next().next().next().next().css('display','block');
          $("#fileName2").val("");
          $("#img2").attr({'src':require("@/assets/images/idupdate/cons.png"),'width':257+'px','height':160+'px'}); 
          $("#img2").next().css('display','block');
          $("#img2").next().next().next().css('display','block');
          $("#img2").next().next().next().next().css('display','block');
          if(res.code=="RO200066"){
            var data = "身份证号码有误，请确认并重新上传本人证件。如您的证件号码有变更，请您至我行营业网点办理，详情请咨询我行客服热线";
            commit('THREEFAIL',data);
          }else if(res.code=="RO200003"){
            var data = "身份证号码有误，请确认并重新上传本人证件。如您的证件号码有变更，请您至我行营业网点办理，详情请咨询我行客服热线";
            commit('ONEFAIL',data);
          }else if(res.code=="RO200004"){
            var data = "身份证号码有误，请确认并重新上传本人证件。如您的身份证号码有变更，请您至我行营业网点办理，详情请咨询我行客服热线";
            commit('ONEFAIL',data);
          }else{
            commit('UPLOADFAIL',res.msg);
          } 
        }
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('SETIDCARDALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        saAlert("证件有效期更新身份证上传","身份证上传确认",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('SETIDCARDALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("证件有效期更新身份证上传","身份证上传确认","请求失败","请求报错");
      }
    });
  },  
  submitinfo({commit,state},payload){        // 信息确认提交
    var dity = "";
    var activeFlag = "";
    if(payload.infoui.shortShow==true){
      dity = payload.infodata.endTime.replace(/\//g,"");
    }else if(payload.infoui.shortShow==false){
      dity = "99991231";
    }
    if(payload.freeFlag==true){
      activeFlag = "1";
    }else if(payload.freeFlag==false){
      if(payload.loginFlag==true){
        activeFlag = "1";
      }else if(payload.loginFlag==false){
        activeFlag = "0";
      }
    }
    baseData.data.idValidity = dity;
    baseData.data.activeFlag = activeFlag;
    baseData.data.custUuid = state.keyUUID;
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    iu.submitInfo(baseData).then((res)=>{
      if(res.success==true){
        payload.router.push({path:'/IdUpdate/SuccessPage'});
      }else if(res.success==false){
        saAlert("证件有效期更新信息确认页","信息确认提交",res.msg,"报错提示");
        commit('SETINFOALERT', {show: true, msg: res.msg, err: res.code});
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('SETINFOALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        saAlert("证件有效期更新信息确认页","信息确认提交",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('SETINFOALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("证件有效期更新信息确认页","信息确认提交","请求失败","请求报错");
      }
    });
  },
  // 微信进入
  binitwxhome({commit,state},payload){      
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    iu.loginWx(baseData).then((res)=>{
      if(res.success==true){
        commit("BSETUUID",{uuid:res.data.uuid,khid:payload.khid,freeFlag:true});
        payload._this.$router.push('/IdUpdate/UploadIdCard');
      }else if(res.success==false){
        commit('BWXHOMEALERT',{show:true,msg:res.msg,err:res.code});
        saAlert("证件更新微信免登","微信免登",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BWXHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        saAlert("证件更新微信免登","微信免登",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BWXHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("证件更新微信免登","微信免登","请求失败","请求报错");
      }
    });
  },        
  // 网页进入
  binitwebhome({commit,state},payload){
    var sliderId = "123456"+Date.now();
    baseData.data.sliderId = sliderId;
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    iu.achieveSlider(baseData).then((res)=>{
      if(res.success==true){
        commit("BSHOWIMAGE",res);
      }else if(res.success==false){
        commit('BWEBHOMEALERT',{show:true,msg:res.msg,err:res.code});
        saAlert("证件更新网页免登","图片赋值",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BWEBHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        saAlert("证件更新网页免登","图片赋值",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BWEBHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("证件更新网页免登","图片赋值","请求失败","请求报错");
      }
    });
  },
  // 验证滑块验证码距离并提交
  bsendlen({commit,state},payload){
    baseData.data.tokenId = payload.tokenId;
    baseData.data.sliderCode = payload.imageCode.sendlen;
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    iu.loginWeb(baseData).then((res)=>{
      if(res.success==true){
        commit("BHIDEIMAGE",res);
        if(res.data==null || res.data==undefined){
          window.location.href = GLOBAL.FRONT_URL+"/webapp/fins/index.html?type=ZJYX#/IdUpdate/LoginPage";
          // window.location.href = "https://test.xliane.com/html/webapp/fins/index.html?type=ZJYX#/IdUpdate/LoginPage";
          // window.location.href = "https://ccshop.cib.com.cn:8010/html/webapp/fins/index.html?type=ZJYX#/IdUpdate/LoginPage";
        }else{
          commit("BSETUUID",{uuid:res.data.uuid,khid:payload.khid,freeFlag:true})
          payload._this.$router.push('/IdUpdate/UploadIdCard');
        }
      }else if(res.success==false){
        if(res.code=="CMS_100005"){
          commit('BWEBHOMEALERT', {show: true, msg: res.msg, err: res.code});
          if(channel()=="hxdapp"&&hxdappIsSpecial()){
            baseData.channel = "hxdapp";
          }else{
            baseData.channel = "normal";
          }
          iu.achieveSlider(baseData).then((res)=>{
            if(res.success==true){
              commit("BCHANGEIMGSTATUS",res);
            }else if(res.success==false){
              commit('BWEBHOMEALERT',{show:true,msg:res.msg,err:res.code});
              saAlert("证件更新网页免登","图片赋值",res.msg,"报错提示");
            }
          }).catch((err)=>{
            console.log(err);
            if(err.response.status){
              commit('BWEBHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
              saAlert("证件更新网页免登","图片赋值",err.response.status+err.response.statusText,"请求报错");
            }else{
              commit('BWEBHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
              saAlert("证件更新网页免登","图片赋值","请求失败","请求报错");
            }
          });
        }else{
          commit("BHIDEIMAGE",res);
          window.location.href = GLOBAL.FRONT_URL+"/webapp/fins/index.html?type=ZJYX#/IdUpdate/LoginPage";
          // window.location.href = "https://test.xliane.com/html/webapp/fins/index.html?type=ZJYX#/IdUpdate/LoginPage";
          // window.location.href = "https://ccshop.cib.com.cn:8010/html/webapp/fins/index.html?type=ZJYX#/IdUpdate/LoginPage";
        }
        saAlert("证件更新网页免登","滑动滑块",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log(err);
        if(err.response.status){
            commit('BWEBHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
            saAlert("证件更新网页免登","滑动滑块",err.response.status+err.response.statusText,"请求报错");
        }else{
            commit('BWEBHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
            saAlert("证件更新网页免登","滑动滑块","请求失败","请求报错");
        }
    });
  },
  // 更换滑块图片
  bchangeimg({commit,state},payload){
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    iu.achieveSlider(baseData).then((res)=>{
      if(res.success==true){
        commit("BCHANGEIMGSTATUS",res);
      }else if(res.success==false){
        commit('BWEBHOMEALERT',{show:true,msg:res.msg,err:res.code});
        saAlert("证件更新网页免登","更新滑块图片",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BWEBHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        saAlert("证件更新网页免登","更新滑块图片",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BWEBHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("证件更新网页免登","更新滑块图片","请求失败","请求报错");
      }
    });
  }
};
const mutations = {
  SETKEYUUID(state, value) {       // 获取Uuid
    state.keyUUID = value;
  },
  SETHOMESHOW(state,data){
    state.home.homeShow = data;
  },
  SETLOGINALERT(state, data) {     // 登录验证alert弹窗
    state.alert.login.showAlert = data.show;
    state.alert.login.msg = data.msg;
    state.alert.login.err = data.err;
  },
  SETIDCARDALERT(state, data) {     // 身份证上传弹窗
    state.alert.idcard.showAlert = data.show;
    state.alert.idcard.msg = data.msg;
    state.alert.idcard.err = data.err;
  },
  SETINFOALERT(state, data) {     // 信息确认弹窗
    state.alert.coninfo.showAlert = data.show;
    state.alert.coninfo.msg = data.msg;
    state.alert.coninfo.err = data.err;
  },
  SETHOMEPHOTO(state, value) {     // 控制图片、按钮
    state.home.photo = value.str;
    state.home.btn = value.btn;
  },
  SETHOMEALERT(state, data) {    // 验证首页弹窗
    state.alert.home.showAlert = data.show;
    state.alert.home.msg = data.msg;
    state.alert.home.err = data.err;
  },
  SETHOMEPHOTONAME(state, value){ // 上传图片名称赋值
    state.home.name = value;
  },
  SETIMAGECODEMOVE(state,value){ // 给验证码长度赋值
    state.identify.imageCode.length = value;
  }, 
  SETIMAGECODE(state, value) { // 判断是否出现滑块验证码
    state.identify.imageCode.show = value;
  },
  SETIDENTIFYALERT(state, data) { // 滑块验证提示信息
    state.alert.identify.showAlert = data.show;
    state.alert.identify.msg = data.msg;
    state.alert.identify.err = data.err;
  }, 
  SETIDENTIFYSTATUS(state, value) {   // 更改按钮状态。防止多次点击
    state.identify.textMsg.status = value;
  },
  SETIDENTIFYTEXTMSG(state, data) {  // 更换按钮文字
    state.identify.textMsg.msg = data;
  },
  SETINTERVAL(state, value) {
    state.identify.textMsg.t = value;
  },
  SETIMAGECODEIMG(state,value){      // 滑块验证码图片赋值
    state.identify.imageCode.bgImg = value.bigimgStr;
    state.identify.imageCode.slideImg = value.tarimgStr;
  },
  SETIDENTIFYCODE(state, value) {    // 获取输入的6位验证码
    state.identify.textMsg.code = value;
  },
  // 第二部分
  SHOWSTARTDATE(state,payload){    //显示起始日期
    state.info.infodata.startShow = true;
  },
  HIDESTARTDATE(state,payload){    // 隐藏起始日期
    state.info.infodata.startShow = false;
  },
  CHANGESTARTDATE(state,payload){  // 更改起始日期
    state.info.infodata.startTime = payload.newTime;
    state.info.infodata.startShow = false;
  },
  SHOWENDDATE(state,payload){    //显示失效日期
    state.info.infodata.endShow = true;
  },
  HIDEENDDATE(state,payload){    // 隐藏失效日期
    state.info.infodata.endShow = false;
  },
  CHANGEENDDATE(state,payload){  // 更改失效日期
    state.info.infodata.endTime = payload.newTime;
    state.info.infodata.endShow = false;
  },
  PICERROR(state,payload){      // 显示提示
    state.public.pubdata.remindMsg = "您上传的图片不清晰，请重试";
    state.public.pubui.telShow = false;
    state.public.pubmenu.laystatu = true;
    state.public.pubmenu.reminderstatu = true;
  },
  SHOWREMIND(state,payload){      // 显示提示
    state.public.pubdata.remindMsg = payload.msg;
    state.public.pubui.telShow = false;
    state.public.pubmenu.laystatu = true;
    state.public.pubmenu.reminderstatu = true;
  },
  HIDEREMIND(state,payload){       // 隐藏提示
    state.public.pubmenu.laystatu = false;
    state.public.pubmenu.reminderstatu = false;
  },
  FAILMORETIME(state,payload){      // 显示提示
    state.public.pubdata.remindMsg = payload.msg;
    state.public.pubui.telShow = false;
    state.public.pubmenu.laystatu = true;
    state.public.pubmenu.reminderstatu = true;
    // state.closeFlag = false;
  },
  UPLOADIDCARD(state,res){         // 确认上传成功
    state.info.infodata.Name = res.name;
    state.info.infodata.indentNum = res.idCard;
    state.info.infodata.startTime = res.startDate
    state.info.infodata.endTime = res.endDate;
    if(res.endDate=="长期"){
        state.info.infoui.shortShow = false;
        state.info.infoui.longShow = true;
    }else{
        state.info.infoui.shortShow = true;
        state.info.infoui.longShow = false;
    }
  },
  UPLOADFAIL(state,data){          // 确认上传失败
    state.public.pubdata.remindMsg = data;
    state.public.pubui.telShow = false;
    state.public.pubmenu.laystatu = true;
    state.public.pubmenu.reminderstatu = true;
  },
  NAMECHANGED(state,data){ // 姓名不一致
    state.success.Sflag = true;
  },
  ONEFAIL(state,data){  // 上传失败
    state.public.pubdata.remindMsg = data;
    state.public.pubui.telShow = true;
    state.public.pubmenu.laystatu = true;
    state.public.pubmenu.reminderstatu = true;
    state.closeFlag = false;
  },
  THREEFAIL(state,data){  // 上传3次失败
    state.public.pubdata.remindMsg = data;
    state.public.pubui.telShow = true;
    state.public.pubmenu.laystatu = true;
    state.public.pubmenu.reminderstatu = true;
    state.closeFlag = true;
  },
  CHANGELOGINID(state,data){  // 更改khid uuid为登录状态id
    state.keyUUID = data.loginuuid;
    state.khid = data.loginkhid;
  },
  // 网页版免登首页
  BWEBHOMEALERT(state,data){                // 网页版免登首页错误弹框
    state.free.alert.showAlert = data.show;
    state.free.alert.msg = data.msg;       
    state.free.alert.err = data.err;     
  },
  BWXHOMEALERT(state,data){                 // 微信版免登首页错误弹框
    state.bintang.alert.showAlert = data.show;
    state.bintang.alert.msg = data.msg;       
    state.bintang.alert.err = data.err;     
  },
  BSHOWIMAGE(state,res){                    // 显示滑块验证码
    state.free.imageCode.show = true;
    state.free.imageCode.bgImg = res.data.bigimgStr;
    state.free.imageCode.slideImg = res.data.tarimgStr;
  },
  BHIDEIMAGE(state,res){                    // 隐藏滑块验证码
    state.free.imageCode.show = false;
  },
  BSETSENDLEN(state,value){                 // 滑块距离赋值 
    state.free.imageCode.sendlen = value;
  },
  BCHANGEIMGSTATUS(state,res){              // 更换图片
    state.free.imageCode.bgImg = res.data.bigimgStr;
    state.free.imageCode.slideImg = res.data.tarimgStr;
  },
  BSETUUID(state,data){
    state.keyUUID = data.uuid;
    state.khid = data.khid;
    state.freeFlag = data.freeFlag;
  }
};
const baseData = {
    openId: getCookie('openId'),
    traceId: Date.now() + '',
    channel: 'wechat',
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