import brm from "@/api/brm.js";
import {saAlert,addDate,channel,hxdappIsSpecial} from "@/assets/js/common.js";
const state = {
  // version:"1.0.6",   // 分支
  version:"2.0.6",   // 主干
  // version:"3.0.1",   // uat 
  // version:"3.6.1",   // 生产
  fixed:false,
  home:{                // 首页
    homedata:{
      payTime:"",
      identNum:"",               // 身份证号
      creditcardNum:{},          // 默认卡号
      creditIndex:0,             // 卡号索引
      applyMoney:"",             // 申请金额
      maxMoney:"",               // 最高可借金额
      bankName:"",               // 借记卡银行名
      bankNum:"",                // 借记卡卡号
      bankNo:"",                 // 借记卡卡bin
      debitIndex:0,              // 借记卡索引
      timeShow:false,            // 约定还款日显示/隐藏状态
      paybackTime:"",            // 约定还款日
      minDate:new Date(new Date().getTime()+24*60*60*1000),        // 约定还款日最小值
      maxDate:"",                // 约定还款日最大值
      minDay:"",                 // 借款天数最小值
      maxDay:"",                 // 借款天数最大值
      lendDay:"",                // 借款天数
      dayList:[],                // 借款天数数组
      repayTotal:"",             // 手续费总计
      repayOne:"",               // 一次性手续费
      repayRate:"",              // 利息
      funduse:"家用电器消费",     // 资金用途 
      funduseList:[],            // 资金用途数组
      usageList:[],              // 资金用途总数组
    },
    homeui:{
      hascard:false,
      nocard:true,
      disshow:false,
    },
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
      length: ""
    },
    alert:{
      msg:"",
      err:"",
      showAlert:""
    },
    fail:{
      msg:"",
      err:"",
      showAlert:"",
      title:"",
    }
  },
  public:{              // 公共
    pubui:{
      creditList:[],            // 信用卡列表
      debitList:[],             // 借记卡列表 
      bankList:[],              // 银行列表
    },
    pubmenu:{
      laystatu:"",               // 蒙版
      applyshow:"",              // 申请金额错误弹框
      reminderstatu:"",          // 温馨提示
    }
  },
  add:{                 // 添加借记卡
    addui:{
      disshow:false,            // 添加借记卡页面 新增按钮状态
      addFlag:false
    },
    addData:{
      hascardName:"",           // 添加借记卡页面 持卡人姓名
      add_cardNo:"",            // 添加借记卡页面 输入卡号
      add_debitName:"",         // 添加借记卡页面 借记卡名 
      add_debitNum:"",          // 添加借记卡页面 借记卡Bin 
    },
    alert:{
      msg:"",
      err:"",
      showAlert:""
    }
  },
  select:{              // 搜索借记卡
    searchResult:"",
    alert:{
      msg:"",
      err:"",
      showAlert:""
    }
  }
};

const getters = {};

const actions = {
  // 首页
  // 初始化首页
  bsetInitHome({commit,state},payload){
    if(state.add.addui.addFlag==true){
      commit('BCHANGEDATA',payload);
    }else if(state.add.addui.addFlag==false){
      baseData.data.cardKey = "";
      if(channel()=="hxdapp"&&hxdappIsSpecial()){
        baseData.channel = "hxdapp";
      }else{
        baseData.channel = "normal";
      }
      brm.initHome(baseData).then((res)=>{
        if(res.success==true){
          commit('BSETCREDITLIST',res);
          commit("BSETINITHOME",res);
        }else if(res.success==false){
          if(res.code.indexOf("RB") != -1){ // 授权失败
            commit('BHOMEALERT', {show: true, msg: res.msg, err:res.code,fixed:true});
          }else{                            // 授权成功，其他失败原因
            if(res.message==""){
              commit('BHOMEALERT', {show: true, msg: "服务器异常", err:"",fixed:true});
            }else{
              commit('BSETCREDITLIST',res);   
              commit("BSETINITHOME",res);
              commit('BHOMEALERT', {show: true, msg: res.msg, err:res.code,fixed:true});
            } 
          }
          saAlert("随借金首页","初始化数据",res.msg,"报错提示");
        }
      }).catch((err)=>{
        console.log(err);
        if(err.response.status){
          commit('BHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status,fixed:true});
          saAlert("随借金首页","初始化数据",err.response.status+err.response.statusText,"请求报错");
        }else{
          commit('BHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: '',fixed:true});
          saAlert("随借金首页","初始化数据","请求失败","请求报错");
        }
      });
    }
  },
  // 切换信用卡
  bchangecreditcard({commit,state},payload){          
    baseData.data.cardKey = payload.creditcardNum.cardKey;
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    brm.initHome(baseData).then((res)=>{
      commit('BCHANGECREDITCARD',payload); 
      if(res.success==true){
        commit("BSETINITHOME",res);
      }else if(res.success==false){
        commit("BSETINITHOME",res);
        commit('BHOMEALERT', {show: true, msg: res.msg, err:res.code,fixed:true});
        saAlert("随借金首页","切换信用卡",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status,fixed:true});
        saAlert("随借金首页","切换信用卡",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: '',fixed:true});
        saAlert("随借金首页","切换信用卡","请求失败","请求报错");
      }
    });
  }, 
  // 约定还款日选择
  bchangepaytime({commit,state},payload){
    commit("BCHANGEPAYTIME",payload);
  },
  // 借款天数选择
  bchangelendday({commit,state},payload){
    commit("BCHANGELENDDAY",payload);
  },
  // 资金用途选择
  bchangefunduse({commit,state},payload){
    commit("BCHANGEFUNDUSE",payload);
  },
  // 切换借记卡
  binitaddpage({commit,state},payload){                           
    commit('BINITADDPAGE',payload);
  },
  // 试算
  bchangeapply({commit,state},payload){
    baseData.data.cardKey = payload.creditcardNum.cardKey;
    baseData.data.applyMoney = payload.applyMoney;
    baseData.data.name = payload.addData.hascardName;
    baseData.data.borrowDay = payload.homedata.lendDay;
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    brm.changeMoney(baseData).then((res)=>{
      if(res.success==true){
        commit("BCHANGEAPPLY",res);
      }else if(res.success==false){
        commit('BHOMEALERT', {show: true, msg: res.msg, err:res.code,fixed:true});
        saAlert("随借金首页","金额试算",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status,fixed:true});
        saAlert("随借金首页","金额试算",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: '',fixed:true});
        saAlert("随借金首页","金额试算","请求失败","请求报错");
      }
    });
  },
  // 确定删除借记卡
  bconfirmdelete({commit,state},payload){                         
    var deleteInfo  = {
      cardNo:state.home.homedata.identNum,  
      bankNO:payload.cardNum
    }
    var channel2 = "";
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      channel2 = "hxdapp";
    }else{
      channel2 = "normal";
    }
    brm.deleteBank({data:deleteInfo,channel:channel2}).then((res)=>{
      if(res.isSuccess==true){
        commit('BCONFIRMDELETE',payload); 
      }else if(res.isSuccess==false){
        commit("BHOMEALERT",{show: true, msg: res.msg, err: "",fixed:true});
        saAlert("随借金首页","删除借记卡",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status,fixed:true});
        saAlert("随借金首页","删除借记卡",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: '',fixed:true});
        saAlert("随借金首页","删除借记卡","请求失败","请求报错");
      }
    });
  },
  bgetcode({dispatch,commit,state},payload){
    baseData.data.cardKey = payload.homedata.creditcardNum.cardKey;
    baseData.data.type = "SJJ";
    baseData.data.hkLength = "0";
    commit('BSETMOVELENGTH',"");                          // 设置滑动距离为空
    commit('BCHANGESTATUS', 0);                           // 更改按钮状态(不可点)
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    brm.getSmsCode(baseData).then((res)=>{
      commit('BCHANGESTATUS', 1);
      if(res.success==true){
        if(res.data.noFirstSend=="1"){                         // 直接发短信
          if(res.data.smsCode=="" || res.data.smsCode==undefined){
            commit('BHOMEALERT', {show: true, msg: '发送成功', err: '',fixed:true}); 
          }else{
            commit('BHOMEALERT', {show: true, msg: "短信验证码:"+res.data.smsCode, err: '',fixed:true});
          }
          dispatch('autoCountDown',120);                       // 倒数计时
        }else if(res.data.noFirstSend=="0"){                   // 请求滑块
          if(channel()=="hxdapp"&&hxdappIsSpecial()){
            baseData.channel = "hxdapp";
          }else{
            baseData.channel = "normal";
          }       
          brm.getSlider(baseData).then((res)=>{
            if(res.success==true){
              commit('BSHOWIMAGECODE',true);                   // 显示滑块
              commit('BASSIGNIMAGE',res.data);                 // 滑块图片赋值
            }else if(res.success==false){
              commit('BHOMEALERT', {show: true, msg: res.msg, err: res.code,fixed:true});
              saAlert("随借金首页","滑块图片赋值",res.msg,"报错提示");
            }
          }).catch((err)=>{
            if(err.response.status){
              commit('BHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status,fixed:true});
              saAlert("随借金首页","滑块图片赋值",err.response.status+err.response.statusText,"请求报错");
            }else{
              commit('BHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: '',fixed:true});
              saAlert("随借金首页","滑块图片赋值","请求失败","请求报错");
            }
          });
        }
      }else if(res.success==false){
        if(res.code=="ERR_02"){
          commit('BHOMEALERT', {show: true, msg: res.msg, err:res.code,fixed:true});
          dispatch('autoCountDown',60);                    // 倒数计时
        }else{
          commit('BHOMEALERT', {show: true, msg: res.msg, err:res.code,fixed:true});
        }
        saAlert("随借金首页","获取验证码",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status,fixed:true});
        saAlert("随借金首页","获取验证码",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: '',fixed:true});
        saAlert("随借金首页","获取验证码","请求失败","请求报错");
      }
    });
  },
  bsendmovelen({dispatch,commit,state},payload){
    baseData.data.cardKey = payload.homedata.creditcardNum.cardKey;
    baseData.data.type = "SJJ";
    baseData.data.hkLength = payload.imageCode.length;
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    brm.getSmsCode(baseData).then((res)=>{
      if(res.success==true){                     // 直接发短信
        if(res.data.smsCode=="" || res.data.smsCode==undefined){
          commit('BHOMEALERT', {show: true, msg: '发送成功', err: '',fixed:true}); 
        }else{
          commit('BHOMEALERT', {show: true, msg: "短信验证码:"+res.data.smsCode, err: '',fixed:true});
        }
        commit('BSHOWIMAGECODE',false);                      // 隐藏滑块验证码 
        dispatch('autoCountDown',120);                       // 倒数计时
        commit('BSETMOVELENGTH',"");                         // 设置滑动距离为空
      }else if(res.success==false){
        if(res.code=="ERR_01"){
          commit('BHOMEALERT', {show: true, msg: res.msg, err:res.code,fixed:true});
          commit('BSHOWIMAGECODE',false);
        }
        if(res.code=="ERR_02"){
          commit('BHOMEALERT', {show: true, msg: res.msg, err:res.code,fixed:true});
          commit('BSHOWIMAGECODE',false);
          dispatch('autoCountDown',60);                    // 倒数计时
        }else{
          commit('BHOMEALERT', {show: true, msg: res.msg, err:res.code,fixed:true});
          if(channel()=="hxdapp"&&hxdappIsSpecial()){
            baseData.channel = "hxdapp";
          }else{
            baseData.channel = "normal";
          }
          brm.getSlider(baseData).then((res)=>{
            if(res.success==true){
              commit('BASSIGNIMAGE',res.data);                 // 滑块图片赋值
            }else if(res.success==false){     
              commit('BHOMEALERT', {show: true, msg: res.msg, err: res.code,fixed:true});
              saAlert("随借金首页","滑块图片赋值",res.msg,"报错提示");
            }
          }).catch((err)=>{
            console.log(err);
            if(err.response.status){
              commit('BHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status,fixed:true});
              saAlert("随借金首页","滑块图片赋值",err.response.status+err.response.statusText,"请求报错");
            }else{
              commit('BHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: '',fixed:true});
              saAlert("随借金首页","滑块图片赋值","请求失败","请求报错");
            }
          });
        }
        saAlert("随借金首页","获取验证码",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status,fixed:true});
        saAlert("随借金首页","获取验证码",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: '',fixed:true});
        saAlert("随借金首页","获取验证码","请求失败","请求报错");
      }
    });
  },
  // 点击刷新
  refreshImage({commit,state},payload){
    baseData.data.cardKey = payload.homedata.creditcardNum.cardKey;
    baseData.data.type = "SJJ";
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    brm.getSlider(baseData).then((res)=>{
      if(res.success==true){
        commit('BASSIGNIMAGE',res.data);                 // 滑块图片赋值
      }else if(res.success==false){
        commit('BHOMEALERT', {show: true, msg: res.msg, err: res.code,fixed:true});
        saAlert("随借金首页","刷新按钮更新图片",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status,fixed:true});
        saAlert("随借金首页","刷新按钮更新图片",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: '',fixed:true});
        saAlert("随借金首页","刷新按钮更新图片","请求失败","请求报错");
      }
    });
  },
  // 页面倒计时
  autoCountDown({dispatch, commit, state},n) {
    commit('BCHANGESTATUS', 0);             // 更改按钮状态(不可点)
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
  bsubmitinfo({commit,state},payload){
    baseData.data.cardKey = payload.cardKey;
    baseData.data.applyMoney = payload.applyMoney;
    baseData.data.name = payload.name;
    baseData.data.borrowDay = payload.borrowDay;
    baseData.data.idCardNo = payload.idCardNo;
    baseData.data.debitcardName = payload.debitcardName;
    baseData.data.debitcardNo = payload.debitcardNo;
    baseData.data.debitbankNo = payload.debitbankNo;
    baseData.data.isFlag = payload.isFlag;
    baseData.data.repayDate = payload.repayDate;
    baseData.data.fqyt = payload.fqyt;
    baseData.data.channel = payload.channel;
    baseData.data.smsCode = payload.smsCode;
    baseData.data.timestamp = payload.timestamp;
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    brm.submitInfo(baseData).then((res)=>{
      if(res.success==true){
        var obj = {
          applyMoney:res.data.applyMoney,
          repayDate:res.data.repayDate,
          borrowDay:res.data.borrowDay,
          debitcardName:res.data.debitcardName,
          debitcardNo:res.data.debitcardNo
        }
        payload.router.push({path:"/BorrowedMoney/SuccessPage?Sdata="+JSON.stringify(obj)});
      }else if(res.success==false){
        commit("BHOMEFAIL",{show:true,title:"申请失败",msg:res.msg,err:res.code,fixed:true});
        saAlert("随借金首页","首页信息提交",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status,fixed:true});
        saAlert("随借金首页","首页信息提交",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: '',fixed:true});
        saAlert("随借金首页","首页信息提交","请求失败","请求报错");
      }
    });
  },
  // 二、新增借记卡
  // 根据卡号查询银行名称
  bupdatedebitname({commit,state},payload){                       
    var bankdata = {
      bankNO:payload.cardNum
    }
    var channel2 = "";
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      channel2 = "hxdapp";
    }else{
      channel2 = "normal";
    }
    brm.getCardBank({data:bankdata,channel:channel2}).then((res)=>{
      if(res.isSuccess==true){
        commit('BUPDATEDEBITNAME',res.data);
      }else if(res.isSuccess==false){
        commit("BADDALERT",{show: true, msg: res.msg, err: ""});
        saAlert("随借金借记卡添加页面","输入银行卡号",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BADDALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        saAlert("随借金借记卡添加页面","输入银行卡号",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BADDALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("随借金借记卡添加页面","输入银行卡号","请求失败","请求报错");
      }
    });
  },
  // 新增借记卡
  baddbcard({commit,state},payload){                              
    var addInfo = {
      bankNO:payload.add_cardNo,
      cardNo:state.home.homedata.identNum,   
      userName:payload.hascardName,
      bankBin:state.add.addData.add_debitNum,
    }
    var channel2 = "";
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      channel2 = "hxdapp";
    }else{
      channel2 = "normal";
    }
    brm.addBankCard({data:addInfo,channel:channel2}).then((res)=>{
      commit("BCHANGEFIXED",false);
      if(res.isSuccess==true){
        commit('BADDBCARD',addInfo);
        payload.router.push({path:'/BorrowedMoney/HomePage'});
      }else if(res.isSuccess==false){
        commit("BADDALERT",{show: true, msg:res.msg , err: ""});
        saAlert("随借金借记卡添加页面","新增借记卡",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BADDALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        saAlert("随借金借记卡添加页面","新增借记卡",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BADDALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("随借金借记卡添加页面","新增借记卡","请求失败","请求报错");
      }
    });
  },

  // 三、搜索银行
  bsearchbank({commit,state},payload){                            // 银行选择页初始化数据
    var searchInfo = {
      bankName:payload.searchResult
    }
    var channel2 = "";
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      channel2 = "hxdapp";
    }else{
      channel2 = "normal";
    }
    brm.getbankList({data:searchInfo,channel:channel2}).then((res)=>{
      if(res.isSuccess==true){
        var obj = {"data":res.data,"result":payload.searchResult};
        commit('BSEARCHBANK',obj);
      }else if(res.isSuccess==false){
        commit("BSELECTALERT",{show: true, msg: res.msg, err: ""});
        saAlert("随借金借记卡搜索页面","输入搜索的关键字",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BSELECTALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        saAlert("随借金借记卡搜索页面","输入搜索的关键字",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BSELECTALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("随借金借记卡搜索页面","输入搜索的关键字","请求失败","请求报错");
      }
    });
  },
  // 选中银行
  bshowbankname({commit,state},payload){                          
    commit('BSHOWBANKNAME',payload);
  }, 
};

const mutations={
  // 一、首页
  // 初始化赋值
  BSETINITHOME(state,res){
    state.home.homedata.maxMoney = res.data.avLimt;                                // 最高可借金额
    if(Number(res.data.avLimt) >= 50000){
      state.home.homedata.applyMoney = "50000";
      $("#applyMoney").focus();
    }else{
      state.home.homedata.applyMoney = res.data.avLimt;                              // 申请金额
    }
    state.home.homedata.repayTotal = res.data.costPlus;                            // 手续费总计
    state.home.homedata.repayOne = res.data.oneFee;                                // 一次性手续费
    state.home.homedata.repayRate = res.data.interest;                             // 利息
    state.home.homedata.minDay = res.data.minDay;                                  // 借款天数最小值
    state.home.homedata.maxDay = res.data.maxDay;                                  // 借款天数最大值
    state.home.homedata.lendDay = res.data.maxDay;                                 // 借款天数默认值、
    state.home.homedata.dayList = [];
    for(var i=Number(res.data.minDay);i<Number(res.data.maxDay)+1;i++){
      state.home.homedata.dayList.push(i+"");
    }
    state.home.homedata.paybackTime = res.data.repayDate;                          // 约定还款日
    var arr = res.data.repayDate.split("/");
    state.home.homedata.maxDate = new Date(Number(arr[0]),Number(arr[1])-1,Number(arr[2]));
    state.home.homedata.payTime = new Date(Number(arr[0]),Number(arr[1])-1,Number(arr[2]));
    state.home.homedata.usageList = res.data.usageListStrings;                     // 资金用途总数组
    state.home.homedata.funduseList = [];
    for(var i=0;i<state.home.homedata.usageList.length;i++){
      state.home.homedata.funduseList.push(state.home.homedata.usageList[i].dsc);  // 资金用途数组
    }
    state.home.homedata.identNum = res.data.idCardNo;                              // 身份证号
    state.add.addData.hascardName = res.data.name;                                 // 持卡人姓名
    state.public.pubui.debitList = _.cloneDeep(res.data.debitcardList);            // 借记卡列表
    if(res.data.debitcardList.length==0 || res.data.debitcardList==null){
      state.home.homeui.hascard = false;
      state.home.homeui.nocard = true;
    }else{
      state.home.homeui.hascard = true;
      state.home.homeui.nocard = false;
      state.home.homedata.bankNum = _.cloneDeep(res.data.debitcardList[0][0]);
      state.home.homedata.bankName = _.cloneDeep(res.data.debitcardList[0][1]);
      state.home.homedata.bankNo = _.cloneDeep(res.data.debitcardList[0][3]);
    }
  },
  // 控制静态页面是否可移动                               
  BCHANGEFIXED(state,value){
    state.fixed = value;
  },
  // 信用卡列表赋值
  BSETCREDITLIST(state,res){
    state.public.pubui.creditList = res.data.cardlist;           // 信用卡列表赋值
    for(var i=0;i<res.data.cardlist.length;i++){
      if(res.data.cardlist[i].cardKey==res.data.cardKey){
        state.home.homedata.creditcardNum = res.data.cardlist[i];// 默认信用卡
        state.home.homedata.creditIndex = i;                     // 默认信用卡索引
      }
    }
  },
  // 试算
  BCHANGEAPPLY(state,res){
    state.home.homedata.repayTotal = res.data.costPlus;          // 手续费总计
    state.home.homedata.repayOne = res.data.oneFee;              // 一次性手续费
    state.home.homedata.repayRate = res.data.interest;           // 利息
  },
  // 切换信用卡
  BCHANGECREDITCARD(state,payload){                   
    state.home.homedata.creditcardNum = payload.creditcardNum;
    state.home.homedata.creditIndex = payload.creditcardNum.index;
    state.fixed = false;
  },
  // 约定还款日选择
  BCHANGEPAYTIME(state,payload){
    state.home.homedata.paybackTime = payload.newTime;
    var newDate = new Date(payload.newTime);
    var days = newDate.getTime() - new Date(); 
    state.home.homedata.lendDay = (parseInt(days / (1000 * 60 * 60 * 24)) + 1) + "";
  },
  // 借款天数选择
  BCHANGELENDDAY(state,payload){
    state.home.homedata.lendDay = payload.dayvalue[0];
    state.home.homedata.paybackTime = addDate(state.home.homedata.minDate,Number(payload.dayvalue));
    state.home.homedata.payTime = new Date(state.home.homedata.paybackTime);
  },
  // 资金用途选择
  BCHANGEFUNDUSE(state,payload){
    state.home.homedata.funduse = payload.fundusevalue[0];
  },
  // 切换借记卡
  BINITADDPAGE(state,payload){                                                    
    state.home.homedata.bankNum = payload.addData.data[0];
    state.home.homedata.bankName = payload.addData.data[1];
    state.home.homedata.bankNo = payload.addData.data[3];
    state.home.homedata.debitIndex = payload.addData.debitIndex;
    state.fixed = false;
  },
  // 更改申请金额数额 
  BCHANGEAPPLYNUM(state,value){
    state.home.homedata.applyMoney = value;
  },
  // 更改申请金额错误弹框状态              
  BCHANGEAPPLYSTATUS(state,data){
    state.public.pubmenu.laystatu = data.layshow;
    state.public.pubmenu.applyshow = data.applyshow;
  },
  // 更改温馨提示弹框状态
  BCHANGEREMINDSTATUS(state,data){
    state.public.pubmenu.laystatu = data.layshow;
    state.public.pubmenu.reminderstatu = data.remindshow;
  },
  // 更改首页错误弹框状态
  BHOMEALERT(state,data){
    state.home.alert.showAlert = data.show;
    state.home.alert.msg = data.msg;
    state.home.alert.err = data.err;
    state.fixed = data.fixed;
  },
  // 更改首页失败弹框状态
  BHOMEFAIL(state,data){
    state.home.fail.showAlert = data.show;
    state.home.fail.title = data.title;
    state.home.fail.msg = data.msg;
    state.home.fail.err = data.err;
    state.fixed = data.fixed;
  },
  // 判断首页状态
  BCHANGETIME(state,value){
    state.home.homedata.timeShow = value;
  },
  // 删除借记卡成功
  BCONFIRMDELETE(state,payload){                                                  
    var arr = state.public.pubui.debitList;
    var newarr = [];
    for(var i=0;i<arr.length;i++){
      if(i!=payload.cardIndex){
        newarr.push(arr[i]);
      }
    }
    state.public.pubui.debitList = newarr;
    if(newarr.length!=0){
      state.home.homeui.hascard = true;
      state.home.homeui.nocard = false;
      state.home.homedata.bankNum = newarr[0][0];
      state.home.homedata.bankName = newarr[0][1];
      state.home.homedata.debitIndex = 0;
    }else if(newarr==null || newarr.length==0){
      state.home.homeui.hascard = false;
      state.home.homeui.nocard = true;
    }
  },
  // 设置滑块移动距离
  BSETMOVELENGTH(state,value){
    state.home.imageCode.length = value;
  },
  // 设置按钮状态
  BCHANGESTATUS(state,value){
    state.home.textMsg.status = value;
  },
  // 更换按钮文字
  BCHANGETEXT(state, value) {        
    state.home.textMsg.msg = value;
  },
  // 设置倒计时时间
  SETINTERVAL(state, value) {       
    state.home.textMsg.t = value;
  },
  // 判断是否出现滑块验证码 默认false
  BSHOWIMAGECODE(state, value) {    
    state.home.imageCode.show = value;
  },
  // 给滑块验证码图片赋值
  BASSIGNIMAGE(state,res){          
    state.home.imageCode.bgImg = res.bigimgStr;
    state.home.imageCode.slideImg = res.tarimgStr;
  },
  // 更改按钮状态
  BCHANGEHOMEBTN(state,value){
    state.home.homeui.disshow = value;
  },
  // 二、添加借记卡
  // 更改错误弹框状态
  BADDALERT(state,data){
    state.add.alert.showAlert = data.show;
    state.add.alert.msg = data.msg;
    state.add.alert.err = data.err;
  },
  // 更改按钮状态
  BCHANGEADDBTN(state,value){
    state.add.addui.disshow = value;
  },
  // 更改输入的卡号
  BEMPTYCARDNO(state,value){       
    state.add.addData.add_cardNo = value;
  },
  // 根据卡号返回对应的银行
  BUPDATEDEBITNAME(state,res){                                                    
    if(res.length!=0){
      state.add.addData.add_debitNum = res[0][0];    //卡Bin
      state.add.addData.add_debitName = res[0][1];   //卡名
    }
  },
  // 新增借记卡到借记卡列表
  BADDBCARD(state,res){                                                           
    var arr = [res.bankNO,state.add.addData.add_debitName,state.add.addData.hascardName,res.bankBin];
    state.add.addData.add_cardNo = "";
    state.add.addData.add_debitName = "";
    state.add.addui.disshow = false;
    state.public.pubui.debitList.unshift(arr);
    state.home.homedata.bankNum = state.public.pubui.debitList[0][0];
    state.home.homedata.bankName = state.public.pubui.debitList[0][1];
    state.home.homedata.bankNo = res.bankBin;
    state.home.homedata.debitIndex = 0;
    state.home.homeui.hascard = true;
    state.home.homeui.nocard = false;
    state.add.addui.disshow = false;
    state.add.addui.addFlag = true;
  },
  BCHANGEDATA(state,payload){                                                      // 添加借记卡标识
    state.add.addui.addFlag = false;
  },
  // 三、搜索银行
  // 搜索错误弹框
  BSELECTALERT(state,data){
    state.select.alert.showAlert = data.show;
    state.select.alert.msg = data.msg;
    state.select.alert.err = data.err;
  },
  // 默认展示前13个银行 
  BSEARCHBANK(state,res){                                                                   
    var arr = [];
    if(res.result == ""){
      for(var i=0;i<14;i++){
        arr.push(res.data[i]);
      }
      state.public.pubui.bankList = arr; 
    }else{
      state.public.pubui.bankList = res.data;
    }
  },
  // 选择银行
  BSHOWBANKNAME(state,payload){                                                   
    state.add.addData.add_debitNum = payload.debitNum;
    state.add.addData.add_debitName = payload.debitName;
    state.select.searchResult = "";
    if(state.add.addData.add_cardNo!=""){
      state.add.addui.disshow = true;
    }else{
      state.add.addui.disshow = false;
    }
  },
};

const baseData = {
  openId: "",
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