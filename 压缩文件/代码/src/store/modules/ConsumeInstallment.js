
import _ from 'lodash';
import api from '@/api/consumeInstallment.js';
import {getCookie,saAlert,track,channel,hxdappIsSpecial} from '@/assets/js/common.js';
import {Loading} from "element-ui";
const state = {
  fixed:false,
  version:'1.0.4',   // 生产版本
  // version:"3.0.1",   // Uat版本
  link:{
    //测试
    // toBill:'https://test.xliane.com/evercos/main/myhtml/cardPage/fins_index_%23_Installment_HomePage.html',      //跳账单
    // toMore:'https://ccshop.cib.com.cn:8010/evercos/main/actIndex/index.html'       // 跳热门活动
    //生产
    toBill:'https://ccshop.cib.com.cn:8010/evercos/main/myhtml/cardPage/fins_index_%23_installment_HomePage.html',
    toMore:'https://ccshop.cib.com.cn:8010/evercos/main/actIndex/index.html'       // 跳热门活动
  },
  request:0,     //请求次数
  home:{
    flag:'',     //是否可以办理分期，0可办，1不可办，默认显示空
    cardList:[     //卡列表
                   // {cardNo:'1234****12234', cardkey:''},
                   // {cardNo:'2222****33333', cardkey:''},
    ],
    cardIndex:0,   //默认图标在第一项
    rateList:[],   //消费清单
    currencyType :'',   //币种
    nextFlag:'',      //  是否能加载更多消费清单
    showCurrency:true,   //是否显示币种切换图片
    image:true,         //美元(false)或人民币(true)
    request:0,         //0为首次请求页面，点击加载更多请求时为1
    mainCard:{          // 主卡

    },
    fenqiRmb:[],
    fenqiDollar:[],
    oneRmb:[],
    oneDollar:[],
    redPacketNumRMB:'',    //红包个数 (人民币) 无红包：0
    redPacketNumUSD:''     //红包个数 (美元) 无红包：0
  },
  apply:{
    n:'',   //默认期数图标选中索引
    showPeriod:true,   //费率列表里面是否显示（期）
    mainNper:"",
    nperList:[],   //费率列表
    fenqiRmb:[],
    fenqiDollar:[],
    oneRmb:[],
    oneDollar:[],
    mainWay:'',
    payWay:[
      {payName:'分期支付', key:'02'},
      {payName:'一次性支付', key:'01'}
    ],
    tab:0 ,        //0显示分期，1显示一次性
    money:{
      payTotle:'',
      payEvery:'',        //每期应还
      everyBase:'',       //每期本金
      everyInterest:'',   //每期手续费
      oneBase:'',         //每期应还（一次性）
      oneInterest:'',    //一次性手续费
      //打折优惠前金额
      preOneInterest:'',     // 优惠前一次性手续费
      preEveryInterest:'',   //优惠前分期每期手续费
      prePayEvery:'',        //优惠前每期应还
      //减免费用金额
      // saleFee:"",
      //优惠前显示隐藏标志
      // showSale:false,      // 分期时一次性减免-金额折扣
      showEach:false,      // 打折每期应还始隐藏
      showEachTwo:false,    // 每期手续费初始隐藏
      showOnce:false        //优惠前一次性手续费初始隐藏
    },
    warm:false ,     //是否显示温馨提示的标志
    redBag:{
      show:false,    //默认红包选项隐藏
      text:'',
      flag:''      // 选取重置红包列表
    },
    redBagNum:"" , // 红包个数
    redId:'' ,   //红包id
  },
  result:{
    eachReturn:"", //每期应还金额
    eachPrincipal:"",    //每期应还本金
    eachRate:"",       //每期应还手续费
    oneRate:"" ,       //一次性手续费
    useRed:'',   //后台传过来的是否使用红包，1使用，0未使用
    showRed:false,  // 隐藏
  },
  baseData:{
    openId: '',
    traceId:'',
    channel: '',
    version: '',
    data: {}
  },
  alert:{
    show:false,
    msg:'',
    err:''
  },
  errAlert:{
    show:false,
    msg:'',
    err:''
  }
};
const getters = {

};
const actions = {
  getPayList({state,commit},payload){
    if(channel()=="hxdapp" && hxdappIsSpecial()){
      payload.channel="hxdapp";
    }
    api.payList(payload).then((res)=>{
      console.log("payList res",res);
      console.log('请求为0或1----',state.request);
      if(res.success){
        if(state.request == 0){        //进页面首次请求只要success==true;就有卡列表
          let obj = {};
          obj.cardList = res.data.cardList;
          obj.mainCard = res.data.cardList[0];
          obj.flag = res.data.flag;
          let temp = Object.assign({},state.home,obj);
          commit("SETHOME",temp);
          if(res.data.flag == '1'){    //flag==1,可办
            // let obj = {};
            // obj.cardList = res.data.cardList;
            // obj.flag = res.data.flag;
            obj.currencyType = res.data.currencyType;
            obj.consumeList = res.data.consumeList;
            obj.nextFlag = res.data.nextFlag;
            obj.rateList = res.data.rateList;
            obj.redPacketNumRMB = res.data.redPacketNumRMB;
            obj.redPacketNumUSD = res.data.redPacketNumUSD;
            if(obj.mainCard.currencyFlag == "L"){   //单币卡默认给人民币
              obj.showCurrency = false;
              obj.image = true;
            }else{
              obj.showCurrency = true;
              if(obj.currencyType == '156'){
                obj.image = true;
              }else{
                obj.image = false;
              }
            }
            //  将费率分类，分为人民币（一次性，分期），美元（一次性，分期）
            let arr=res.data.rateList;
            function sortPeriod(a,b){
              return a.period-b.period
            }
            obj.oneRmb = [];
            obj.fenqiRmb = [];
            obj.oneDollar = [];
            obj.fenqiDollar = [];
            for(var i=0;i<arr.length;i++){
              if(arr[i].currencyType =="156"){
                if(arr[i].payType =='01'){
                  obj.oneRmb.push(arr[i]);
                  obj.oneRmb.sort(sortPeriod);
                }else{
                  obj.fenqiRmb.push(arr[i]);
                  obj.fenqiRmb.sort(sortPeriod);
                }
              }else{
                if(arr[i].payType =='01'){
                  obj.oneDollar.push(arr[i]);
                  obj.oneDollar.sort(sortPeriod);
                }else{
                  obj.fenqiDollar.push(arr[i]);
                  obj.fenqiDollar.sort(sortPeriod);
                }
              }
            }
            let temp = Object.assign({},state.home,obj);
            commit("SETHOME",temp);
          }else{   //flag == 0
            commit('SET_ALERT', {show: true, msg: res.msg, err: res.code});
            saAlert("消费分期首页","首次进页面不可办理消费分期",res.code+res.msg,"报错提示");
          }
        }else{
          //request ==1(点击加载更多)
          console.log("9999",state.home);
          let oldObj = state.home;
              for(let i=0;i<res.data.consumeList.length;i++){
               let arrvalue = res.data.consumeList[i];
                // console.log(arrvalue);//把取出的值打印在控制台上
                oldObj.consumeList.push(arrvalue);
            }
              oldObj.nextFlag = res.data.nextFlag;
          let temp = Object.assign({},state.home,oldObj);
          commit("SETHOME",temp);
        }
      }else{
          commit('SET_ALERT', {show: true, msg: res.msg, err: res.code});
        saAlert("消费分期首页","首次进页面以及点加载更多",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log("payList err", err);
      if(err.response.status){
        commit('SET_ALERT', {show: true, msg:'网络请求超时，请稍后重试~', err: ''+err.response.status});
        saAlert("消费分期首页","首次进页面以及点加载更多",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('SET_ALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("消费分期首页","首次进页面以及点加载更多",'请求失败',"请求报错");
      }
    })
  },
  // 切卡
  changeCard({state,commit},payload){
    if(channel()=="hxdapp" && hxdappIsSpecial()){
      payload.data.channel="hxdapp";
    }
    api.payList(payload.data).then((res)=> {
      console.log("changeCard res", res);
      if(res.success){
        let obj = {};
        obj.cardList = res.data.cardList;
        obj.mainCard = res.data.cardList[payload.index];
        obj.cardIndex = payload.index;
        obj.flag = res.data.flag;
        let temp = Object.assign({},state.home,obj);
        commit("SETHOME",temp);
        if(res.data.flag == '1'){
          track("xffq_changeCardSuccess","消费分期切卡成功");
          obj.currencyType = res.data.currencyType;
          obj.consumeList = res.data.consumeList;
          obj.nextFlag = res.data.nextFlag;
          obj.rateList = res.data.rateList;
          obj.redPacketNumRMB = res.data.redPacketNumRMB;
          obj.redPacketNumUSD = res.data.redPacketNumUSD;
          if(obj.mainCard.currencyFlag == "L"){   //单币卡默认给人民币
            obj.showCurrency = false;
            obj.image = true;
          }else{
            obj.showCurrency = true;
            if(obj.currencyType == '156'){
              obj.image = true;
            }else{
              obj.image = false;
            }
          }
          //  将费率分类，分为人民币（一次性，分期），美元（一次性，分期）
          let arr=res.data.rateList;
          function sortPeriod(a,b){
            return a.period-b.period
          }
          obj.oneRmb = [];
          obj.fenqiRmb = [];
          obj.oneDollar = [];
          obj.fenqiDollar = [];
          for(var i=0;i<arr.length;i++){
            if(arr[i].currencyType =="156"){
              if(arr[i].payType =='01'){
                obj.oneRmb.push(arr[i]);
                obj.oneRmb.sort(sortPeriod);
              }else{
                obj.fenqiRmb.push(arr[i]);
                obj.fenqiRmb.sort(sortPeriod);
              }
            }else{
              if(arr[i].payType =='01'){
                obj.oneDollar.push(arr[i]);
                obj.oneDollar.sort(sortPeriod);
              }else{
                obj.fenqiDollar.push(arr[i]);
                obj.fenqiDollar.sort(sortPeriod);
              }
            }
          }
          let temp = Object.assign({},state.home,obj);
          commit("SETHOME",temp);
        }else{   //flag == 0
          commit('SET_ALERT', {show: true, msg: res.msg, err: res.code});
          saAlert("消费分期首页","切换卡片失败",res.code+res.msg,"报错提示");
        }
      }else{
        commit('SET_ALERT', {show: true, msg: res.msg, err: res.code});
        saAlert("消费分期首页","切换卡片",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log("changeCard err", err);

      if(err.response.status){
        commit('SET_ALERT', {show: true, msg:'网络请求超时，请稍后重试~', err: ''+err.response.status});
        saAlert("消费分期首页","切换卡片",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('SET_ALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("消费分期首页","切换卡片",'请求失败',"请求报错");
      }
    })
  },
  // 切币种
  changeCurrency({state,commit},payload){
    if(channel()=="hxdapp" && hxdappIsSpecial()){
      payload.channel="hxdapp";
    }
    api.changeCurrency(payload).then((res)=> {
      console.log("changeCard res", res);
      if(res.success){
        let obj = {};
        obj.currencyType = res.data.currencyType;
        obj.consumeList = res.data.consumeList;
        obj.nextFlag = res.data.nextFlag;
        if(obj.currencyType == '156'){
          obj.image = true;
        }else{
          obj.image = false;
        }
        let temp = Object.assign({},state.home,obj);
        commit("SETHOME",temp);
      }else{
        commit('SET_ALERT', {show: true, msg: res.msg, err: res.code});
        saAlert("消费分期首页","切换币种",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log("changeCard err", err);
      if(err.response.status){
        commit('SET_ALERT', {show: true, msg:'网络请求超时，请稍后重试~', err: ''+err.response.status});
        saAlert("消费分期首页","切换币种",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('SET_ALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("消费分期首页","切换币种",'请求失败',"请求报错");
      }
    })
  },
  //申请消费分期
  applyConsume({state,commit},payload){
    if(channel()=="hxdapp" && hxdappIsSpecial()){
      payload.data.channel="hxdapp";
    }
    api.applyConsume(payload.data).then((res)=>{
      console.log("applyConsume res", res);
      if(res.success){
        track('xffq_applySuccess','消费分期办理成功');
        let obj = {
          eachReturn: res.data.eachReturn,
          eachPrincipal: res.data.eachPrincipal,
          eachRate: res.data.eachRate,
          oneRate: res.data.oneRate,
          useRed : res.data.useRed,           //后台传过来的是否使用红包，1使用，0未使用
          card: state.home.mainCard,
          image: state.home.image,
          payWay: state.apply.mainWay,
          mainNper: state.apply.mainNper,
          money : state.apply.money.payTotle,
          tab : state.apply.tab,

        };
        obj = JSON.stringify(obj);
        payload.router.push({path:"/consume/SuccessPage",query:{val:obj}});
      }else{
        commit('SET_ERRALERT', {show: true, msg: res.msg, err: res.code});
        saAlert("消费分期申请页","申请按钮",res.code+res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log("applyConsume err", err);
      if(err.response.status){
        commit('SET_ALERT', {show: true, msg:'网络请求超时，请稍后重试~', err: ''+err.response.status});
        saAlert("消费分期申请页","申请按钮",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('SET_ALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("消费分期申请页","申请按钮",'请求失败',"请求报错");
      }
    })
  },
  //红包试算
  countRedPacket({state,commit},payload){
    if(channel()=="hxdapp" && hxdappIsSpecial()){
      payload.data.channel="hxdapp";
    }
    api.countRedPacket(payload.data).then((res)=>{
      console.log("countRedPacket res", res);
      if(res.success){
        let obj = {};
        if(payload.pass.value.valueType == 'z'){  //费率折扣
          obj.showEach = true;
          obj.showEachTwo = true;
          // obj.showSale = false;
          obj.showOnce = true;
        }else{   //折扣金额
          obj.showEach = false;
          obj.showEachTwo = true;
          // obj.showSale = false;
          obj.showOnce = true;
        }
        // payEvery:'',        //每期应还
        //   everyBase:'',       //每期本金
        //   everyInterest:'',   //每期手续费
        //   oneBase:'',         //每期应还（一次性）
        //   oneInterest:'',    //一次性手续费
        //   //打折优惠前金额
        //   preOneInterest:'',     // 优惠前一次性手续费
        //   preEveryInterest:'',   //优惠前分期每期手续费
        //   prePayEvery:'',        //优惠前每期应还
        //减免费用金额
        // saleFee:"",

        //分期赋值
        obj.payEvery = res.data.instalAmt;
        obj.everyBase = res.data.feachMoney;
        obj.everyInterest = res.data.eachCharge;
        obj.prePayEvery = res.data.discountAmt;
        obj.preEveryInterest = res.data.discountCharge;
        // obj.saleFee = res.data.saleFee;
        //一次性赋值
        obj.oneBase = res.data.yeachMoney;
        obj.oneInterest = res.data.oneCharge;
        obj.preOneInterest = res.data.discountOneCharge;
        let temp = Object.assign({},state.apply.money,obj);
        commit('SET_MONEY',temp);
      }else{
        commit('SET_ALERT', {show: true, msg: res.msg, err: res.code});
        saAlert("消费分期申请页","红包试算",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log("countRedPacket err", err);
      if(err.response.status){
        commit('SET_ALERT', {show: true, msg:'网络请求超时，请稍后重试~', err: ''+err.response.status});
        saAlert("消费分期申请页","红包试算",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('SET_ALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("消费分期申请页","红包试算",'请求失败',"请求报错");
      }
    })
  },
};
const mutations = {
    SETBASEDATA(state,payload){  //请求数据
    state.baseData.data=payload;
  },
    SETHOME(state,payload){
      state.home=payload;
    },

  SETREQUEST(state,payload){
    state.request=payload;
  },
  SET_ALERT(state,payload){
      state.alert.show = payload.show;
      state.alert.msg = payload.msg;
      state.alert.err = payload.err;
  },
  SET_ERRALERT(state,payload){
    state.errAlert.show = payload.show;
    state.errAlert.msg = payload.msg;
    state.errAlert.err = payload.err;
  },
  SET_BGFIXED(state,payload){
    state.fixed=payload.fixed;
  },
  SET_MONEY(state,payload){
      state.apply.money = payload;
  },
  SET_ID(state,payload){
    state.apply.redId = payload;
  }
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
