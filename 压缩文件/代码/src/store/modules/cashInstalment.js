import _ from 'lodash';
import api from '@/api/cashInstalment.js';
import {getCookie,saAlert,environment,channel,hxdappIsSpecial} from '@/assets/js/common.js';
// import { Alert } from 'element-ui';

const state = {
  innerHeight:"",
  version: '1.2.1',  // 生产版本
  // version:'3.0.1', // Uat版本
  home: {
    promoteCode:"", //推广标记
    action:"3",  //用于提交按钮是否可点击处理  0-可以点击 1-金额有误  2-没有借记卡 3-短信验证码
    num:0,    //用于屏蔽多次请求试算接口
    name:"",     //持卡人姓名
    identNum:"", //身份证号
    bankBin:"",  
    xjfq: '',   //是否可办
    index: 0,   //卡列表标记
    mainCard:{},
    cardList: [],   //卡列表
    lastCalava: '', //最高可借
    applyNum:"",    //申请金额
    period:  '12',  //分期期数   
    usage: '1',     //资金用途     
    instalmentResult: {
      flag: '02',       //支付方式					（01：一次性支付，02：分期）
      discount: false,  //是否有优惠			（false:优惠，true不优惠）
      instalAmt: '', //每期应还
      eachMoney: '', //每期本金
      eachCharge: '', //每期手续费
      discountAmt: '', //优惠前每期应还
      discountMoney: '', //优惠前每期本金
      discountCharge: '', //优惠前每期手续费
      oneAmt: '', //一次性每期本金
      oneCharge: '', //一次性手续费
      discountOneCharge: '', //优惠前一次性手续费
      onePay: '', //一次性每期应还
      extra: ''//跨行转账另收
    },
    usageListStrings:[], //资金用途
    hasCard:false,  //是否有借记卡
    debitIndex:0,
    debitCard:['',''],  //当前选择的借记卡
    debitcardList: [],   //借记卡列表
    advList: [
      {path: require('@/assets/images/cashInstalment/adv.png'),href:"http://mobile.cib.com.cn/creditcard/promotion/other/20181011.html"}
    ],
    rateInfos:[],   //费率
    textMsg: {
      status: 1,
      msg: '获取验证码',
      t: null,
      code: '',  //验证码
      clickBl:true
    },
    checkRule:false, //条款
    showRemind:false, //温馨提示
  },
  successPage:{
    applyNum:"",       //申请金额
    debitBank:"",      //借记卡行
    debitCard:"",      //借记卡号
    sqyh:"",           //首期应还
    sqhkr:"",          //首期还款日
  },
  promotion:{  //推广首页
    name:'',
    nameErr:"",
    bank:[],
    saleCode:"",
    saleCodeErr:"",
    tel:"",
    telErr:"",
    smsCode:"",
    smsCodeErr:"",
    smsBtn:"获取验证码",
    smsCodeBl:true,
    timer:"",
    confirmBl:false,
    showPick:false,
    pickBank:"",
    bankColumns:[ //分行
      {key: '1',text:'北京分行'},
      {key: '2',text:'广州分行'},
      {key: '3',text:'福州分行'},
      {key: '5',text:'杭州分行'},
      {key: '6',text:'南京分行'},
      {key: '7',text:'上海分行'},
      {key: '8',text:'深圳分行'},
      {key: '9',text:'济南分行'},
      {key: '10',text:'太原分行'},
      {key: '11',text:'郑州分行'},
      {key: '12',text:'武汉分行'},
      {key: '13',text:'石家庄分行'},
      {key: '14',text:'西安分行'},
      {key: '15',text:'成都分行'},
      {key: '16',text:'重庆分行'},
      {key: '17',text:'长沙分行'},
      {key: '18',text:'沈阳分行'},
      {key: '19',text:'天津分行'},
      {key: '20',text:'南昌分行'},
      {key: '21',text:'南宁分行'},
      {key: '22',text:'长春分行'},
      {key: '23',text:'合肥分行'},
      {key: '24',text:'贵阳分行'},
      {key: '25',text:'哈尔滨分行'},
      {key: '26',text:'西宁分行'},
      {key: '27',text:'昆明分行'},
      {key: '28',text:'银川分行'},
      {key: '29',text:'海口分行'},
      {key: '30',text:'乌鲁木齐分行'},
      {key: '31',text:'呼和浩特分行'},
      {key: '32',text:'兰州分行'},
      {key: '33',text:'拉萨分行'},
      {key: '34',text:'宁波分行'},
      {key: '35',text:'厦门分行'},
      {key: '36',text:'苏州分行'},
      {key: '37',text:'泉州分行'},
      {key: '38',text:'青岛分行'},
      {key: '39',text:'大连分行'},
      {key: '40',text:'龙岩分行'},
      {key: '41',text:'三明分行'},
      {key: '42',text:'宁德分行'},
      {key: '43',text:'漳州分行'},
      {key: '44',text:'南平分行'},
      {key: '45',text:'莆田分行'},
      {key: '46',text:'客服中心'}
    ]
  },
  share:{
    layer:false,
    // link:"https://test.xliane.com/html3/webapp/ylFins/index.html?promoteCode=312333#/CashInstalment/HomePage",
    link:"",
    data:{
      title:"",
      desc:"",
      name:"",
      imgUrl:"",
      appId:"",
      timestamp:"",
      nonceStr:"",
      signature:"",
    },
    remcode:""   //分享到现金分期
  },
  alert: {
    home: {
      show: false,
      msg: '',
      err: ''
    },
    applyFail:{
      show: false,
      msg: '',
      err: ''
    }
  },
  imgCode:{
    show:false,
    moveX:"",
    bigImgSrc:"",
    tarImgSrc:"",
    blockId:""
  },
  baseData:{
    openId: getCookie('openId'),
    traceId: Date.now() + '',
    channel: 'wechat',
    version: "1.2.1",
    data: {}
  }
};

const getters = {};


const actions = {
  getCashIntalStart({state, commit},payload) { //首页初始化
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      payload.data.channel="hxdapp";
    }
    api.getCashIntalStart(payload.data).then((res) => {
      // console.log("getCashIntalStart res",res);
      if (res.success) {
        let obj = {
          applyNum:''
        };
        obj.name = res.data.accountName;
        obj.xjfq = res.data.xjfq;
        obj.identNum = res.data.certNo;            //身份证
        obj.cardList = res.data.cardList;
        obj.mainCard=res.data.cardList[0];
        obj.index=0;
        res.data.lastCalava = Math.floor(Number(res.data.lastCalava));
        obj.lastCalava = res.data.lastCalava;      //最高可借
        obj.instalmentResult = {};  
        obj.debitcardList = res.data.debitcardList;  //借记卡列表
        if(res.data.debitcardList.length>0){
          obj.debitCard = res.data.debitcardList[0];
          obj.hasCard = true;
        }else{
          obj.debitCard=['',''];
          obj.action = "2";
          obj.hasCard = false;
        }
        obj.usageListStrings=res.data.usageListStrings,   //资金用途
        _.forEach(obj.usageListStrings,(item,index)=>{
          obj.usageListStrings[index].text = item.dsc;
          obj.usageListStrings[index].key = item.useageKey;
        });
        obj.rateInfos = res.data.rateInfos;  //费率表
        if(localStorage.getItem("XJFQ")){    //添加借记卡  条款与细则
            let XJFQ = JSON.parse(localStorage.getItem("XJFQ"));
            console.log("XJFQ",XJFQ);
            obj.action = "3";
            obj.name = XJFQ.name;
            obj.identNum = XJFQ.identNum;
            obj.lastCalava = XJFQ.lastCalava;
            obj.applyNum = XJFQ.applyNum;
            state.home.applyNum = XJFQ.applyNum;
            obj.mainCard = XJFQ.mainCard;              //选择的卡片
            obj.index = XJFQ.cardIndex;                //选择卡片标记
            obj.instalmentResult=XJFQ.instalmentResult;          //支付方式
            obj.instalmentResult = Object.assign({},state.home.instalmentResult,obj.instalmentResult);
            obj.period=XJFQ.period;                    //分期期数
            obj.debitIndex=XJFQ.debitIndex;            //借记卡选择
            obj.usage=XJFQ.usage;                      //资金用途
            if(localStorage.getItem("debitCard")){
              let debitCard = JSON.parse(localStorage.getItem("debitCard"));
              console.log(debitCard);
              _.forEach(obj.debitcardList,(item,index)=>{
                if(item[0]==debitCard[0]&&item[1]==debitCard[1]){
                  obj.debitCard=debitCard;
                  obj.debitIndex = index;
                }
              });
              localStorage.removeItem("debitCard");
            }else{
              obj.debitCard = obj.debitcardList[obj.debitIndex];
            }
            localStorage.removeItem("XJFQ"); 
            if(obj.xjfq=="NO"){  //若主卡不能办理，强制获取上一次的数据
              obj.xjfq = "YES";
            }
        }else{             //首次进入页面
          if(res.data.xjfq=="NO"){  //不能办现金分期
            obj.period = state.home.period;
            Object.assign(obj.instalmentResult,state.home.instalmentResult);
          }else{
            Object.assign(obj.instalmentResult, res.data.instalmentResult);
          }
        } 
        if(res.data.debitcardList.length>0){
          if(obj.debitCard[1]=="兴业银行"){            //兴业银行借记卡
            if(obj.lastCalava>=300000){
              if(state.home.applyNum>=300000){
                obj.applyNum = 300000;
              }else{
                obj.applyNum=state.home.applyNum==0?300000:state.home.applyNum;
              }
            }else{
              if(state.home.applyNum>obj.lastCalava){
                obj.applyNum = obj.lastCalava;
              }else{
                obj.applyNum=state.home.applyNum==0?obj.lastCalava:state.home.applyNum;
              }
            }
          }else{
            if(obj.lastCalava>=50000){
              if(state.home.applyNum>=50000){
                obj.applyNum = 50000;
              }else{
                obj.applyNum=state.home.applyNum==0?50000:state.home.applyNum;
              }
            }else{
              if(state.home.applyNum>obj.lastCalava){
                obj.applyNum = obj.lastCalava;
              }else{
                obj.applyNum=state.home.applyNum==0?obj.lastCalava:state.home.applyNum;
              }
            }
          }
        }else{
          if(obj.lastCalava>=300000){
            if(state.home.applyNum>=300000){
              obj.applyNum = 300000;
            }else{
              obj.applyNum=state.home.applyNum==0?300000:state.home.applyNum;
            }
          }else{
            if(state.home.applyNum>obj.lastCalava){
              obj.applyNum = obj.lastCalava;
            }else{
              obj.applyNum=state.home.applyNum==0?obj.lastCalava:state.home.applyNum;
            }
          }
        }
        let addDebitCard = {
          name:obj.name,   //持卡人姓名
          title:"现金分期",
          version:state.version,     //版本号
          identNum:obj.identNum   //持卡人身份证号
        }
        payload.store.commit("SET_ADDDEBIT",addDebitCard)  //添加借记卡页面所 公共的属性
        let temp = Object.assign({},state.home,obj)
        commit('SETINITINFO', temp);
      }else{
        if(localStorage.getItem("XJFQ")){
          localStorage.removeItem("XJFQ");
        }
        if(localStorage.getItem("debitCard")){
          localStorage.removeItem("debitCard");
        }
        if(res.data!=null&&(res.data.flag!=undefined||res.data.flag!=null)){
          if(res.data.flag=="0"){ //有数据  
            let obj1 = {};
            obj1.xjfq="NO"; 
            obj1.cardList = res.data.cardList;
            obj1.mainCard= res.data.cardList[state.home.index];
            obj1.usageListStrings=[{text:"",key:""},{text:"",key:""},{text:"",key:""},{text:"",key:""},{text:"",key:""},{text:"",key:""},{text:"",key:""},{text:"",key:""}],   //资金用途
            _.forEach(res.data.usageListStrings,(item,index)=>{
              obj1.usageListStrings[index].text = item.dsc;
              obj1.usageListStrings[index].key = item.useageKey;
            });
            obj1.rateInfos = res.data.rateInfos;
            obj1.debitcardList = res.data.debitcardList;  //借记卡列表
            if(res.data.debitcardList.length>0){
              obj1.debitCard = res.data.debitcardList[0];
              obj1.hasCard = true;
            }else{
              obj1.debitCard=['',''];
              obj1.action = "2";
              obj1.hasCard = false;
            }
            // obj1.instalmentResult.extra = res.data.extra;
            // Object.assign(state.home.instalmentResult, obj1.instalmentResult);
            let temp1 = Object.assign({},state.home,obj1);
            commit('SETINITINFO', temp1);
          }
        }
        saAlert("现金分期","初始化",res.msg,"报错提示");
        commit('SETHOMEALERT', {show: true, msg: res.msg, err: res.code});
      }
    }).catch((err) => {
      if(err.response.status){
        commit('SETHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        saAlert("现金分期","初始化",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('SETHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("现金分期","初始化","请求失败","请求报错");
      }
    });
  },
  trialByCashInstall({state,commit},payload){ //试算
    if(channel()=="hxdapp" && hxdappIsSpecial()){
      payload.channel="hxdapp";
    }
    api.trialByCashInstall(payload).then((res)=>{
      // console.log("trialByCashInstall res",res);
      if(res.success){
        let temp = Object.assign({},state.home.instalmentResult,res.data);
        commit("SETTRIALCASH",temp);
      }else{
        commit('SETHOMEALERT', {show: true, msg:res.msg, err: res.code});
        saAlert("现金分期","试算",res.msg,"报错提示");
      }
    }).catch((err)=>{
      if(err.response.status){
        commit('SETHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        saAlert("现金分期","试算",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('SETHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("现金分期","试算","请求失败","请求报错");
      }
    })
  },
  changeCard({state, commit}, payload) {  //切卡
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      payload.data.channel="hxdapp";
    }
    api.changeCard(payload.data).then((res)=>{
      // console.log("changeCard res",res);
      if(res.success){
          let obj = {};
          obj.num=0;
          obj.name = res.data.accountName;
          obj.xjfq = res.data.xjfq;
          obj.identNum = res.data.certNo;              //身份证
          res.data.lastCalava = Math.floor(Number(res.data.lastCalava));
          obj.lastCalava = res.data.lastCalava;        //最高可借
          // obj.applyNum = res.data.lastCalava;
          obj.index=payload.index[1];
          obj.mainCard = state.home.cardList[payload.index[1]];
          obj.instalmentResult = {};  
          if(res.data.xjfq=="NO"){  //不能办现金分期
            obj.period = state.home.period;
            Object.assign(obj.instalmentResult,state.home.instalmentResult);
          }else{
            Object.assign(obj.instalmentResult, res.data.instalmentResult);
          }
          if(state.home.debitcardList.length>0){
            if(state.home.debitCard[1]=="兴业银行"){  //兴业银行借记卡
              if(obj.lastCalava>=300000){
                obj.applyNum = 300000;
              }else{
                obj.applyNum = obj.lastCalava;
              }
            }else{
              if(obj.lastCalava>=50000){
                  obj.applyNum = 50000;
              }else{
                  obj.applyNum = obj.lastCalava;
              }
            }
          }else{
            if(obj.lastCalava>=300000){
              obj.applyNum = 300000;
            }else{
              obj.applyNum = obj.lastCalava;
            }
          }
          let addDebitCard = {
            name:obj.name,  //持卡人姓名
            title:"现金分期",
            version:state.version,     //版本号
            identNum:obj.identNum      //持卡人身份证号
          }
          payload.store.commit("SET_ADDDEBIT",addDebitCard)  //添加借记卡页面所 公共的属性
          let temp = Object.assign({},state.home,obj)
          commit('SETINITINFO', temp);
          
      }else{
        state.home.index=payload.index[0];
        state.home.mainCard = state.home.cardList[payload.index[0]];
        commit('SETHOMEALERT', {show: true, msg:res.msg, err: res.code});
        saAlert("现金分期","切换卡",res.msg,"报错提示");
      }
    }).catch((err)=>{
      if(err.response.status){
        commit('SETHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        saAlert("现金分期","切换卡",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('SETHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("现金分期","切换卡","请求失败","请求报错");
      }  
    })
  },
  applyCashInstal({state,commit},payload){  //申请接口
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      payload.data.channel="hxdapp";
    }
    api.applyCashInstal(payload.data).then((res)=>{
      if(res.success){
        let obj = {}
        state.home.action = "0";
        obj.applyNum = res.data.jyje;
        obj.sqyh = res.data.finalAmt;
        obj.sqhkr = res.data.sqhkr;
        obj.debitBank = res.data.debitBank;
        obj.debitCard = res.data.debitCard;
        commit("SET_SPPLYSUCCESS",obj);
        payload.router.push("/CashInstalment/applySuccess");
      }else{
        commit('SETHOMEALERT', {show: true, msg:res.msg, err: res.code});
        saAlert("现金分期","申请按钮",res.msg,"报错提示");
      }
    }).catch((err)=>{
      if(err.response.status){
        commit('SETHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        saAlert("现金分期","申请按钮",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('SETHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert("现金分期","申请按钮","请求失败","请求报错");
      }  
    });
  },
  setImgcode:({state,commit},payload)=>{   //设置滑动验证码图片
    let obj = Object.assign({},state.imgCode,payload);
    commit("SET_IMGCODE",obj)
  },  
  shareConfig({state,commit},payload){  //推广 config 到分享页
    if(channel()=="hxdapp" && hxdappIsSpecial()){
      payload.data.channel="hxdapp";
    }
    api.shareConfig(payload.data).then((res)=>{
      // console.log("shareConfig res",res);
      if(res.success){
        let obj = {};
        obj.appId=res.data.data.appId;
        obj.timestamp=res.data.data.timestamp;
        obj.nonceStr=res.data.data.noncstr;
        obj.signature=res.data.data.signature;
        obj.name = payload.data.data.name;
        obj.title="我要借钱，实时放款分期还，"+payload.data.data.name+"诚邀！" ;
        obj.desc="资金周转不用愁，现金分期分您忧！";
        
        let str = environment();
        if(payload.type=="XJTJ"){
          obj.title="我要借钱，实时放款分期还，"+payload.data.data.name+"诚邀！" ;
          obj.desc="资金周转不用愁，现金分期分您忧！";
          obj.imgUrl="http://ccshop.cib.com.cn/html/page/xjfq0320.jpg";
          // state.share.link = str+"myhtml/cardPage/fins_index_%23_CashInstalment_HomePage.html?promoteCode="+res.data.remcode;  
          // state.share.link = "https://test.xliane.com/evercos/main/myhtml/cardPage/ylFins_index_%23_CashInstalment_HomePage.html?promoteCode="+res.data.remcode;  
          // state.share.link = "https://test.xliane.com/evercos2/main/myhtml/cardPage/ylFins_index_%23_CashInstalment_HomePage.html?promoteCode="+res.data.remcode;  
          state.share.link = str+"myhtml/cardPage/fins_index_%23_CashInstalment_HomePage.html?promoteCode="+res.data.remcode;          
        }else if(payload.type=="SXTG"){
          obj.title="消费随兴分,生活随兴享";
          obj.desc="最长3年,最高30万,借万元仅需手续费2.67元!";
          // obj.imgUrl ="https://test.xliane.com/html3/webapp/resource/sxfIcon.png";
          obj.imgUrl ="http://ccshop.cib.com.cn/html/webapp/resource/sxfIcon.png";
          state.share.link = str+"myhtml/cardPage/fins_index_%23_Sxf_HomePage.html?promoteCode="+res.data.remcode;          
        }
        let temp = Object.assign({},state.share.data,obj); 
        commit("SET_SHARECONFIG",temp);
        payload.router.push({path:"/CashInstalment/share"});
      }else{
        commit('SETHOMEALERT', {show: true, msg:res.msg, err: res.code});
        saAlert(payload.type+"推广","生成推荐链接",res.msg,"报错提示");
      }
    }).catch((err)=>{
      if(err.response.status){
        commit('SETHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        saAlert(payload.type+"推广","生成推荐链接",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('SETHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        saAlert(payload.type+"推广","生成推荐链接","请求失败","请求报错");
      }  
    })
  }
};

const mutations = {
  SETBASEDATA(state,payload){  //请求数据
    state.baseData.data=payload;
  },
  SETINITINFO(state, value) { //首页初始化 /切换卡片
    state.home=value;
  },
  SETHOMEALERT(state, value) {  //弹框
    state.alert.home.show = value.show;
    state.alert.home.msg = value.msg;
    state.alert.home.err = value.err;
  },
  SETAPPLYFAIL(state,value){ //申请失败 请求报错弹框
    state.alert.applyFail.show=value.show;
    state.alert.applyFail.msg = value.msg;
    state.alert.applyFail.err = value.err;
  },
  SETTRIALCASH(state,payload){
    state.home.instalmentResult = payload;
  },
  SETAPPLYNUM(state,payload){ //申请金额
    state.home.applyNum = payload;
  },
  SETPAYMETHOD(state, key){  //支付方式
    state.home.instalmentResult.flag = key;
  },
  SETINSTALPERIOD(state, index){ //分期数
    state.home.period = index;
  },
  SET_IMGCODE(state,payload){ //图片滑动验证码
    state.imgCode=payload
  },
  SETFUNDUSAGE(state, key){ //资金用途
    state.home.usage = key;
  },
  SET_SPPLYSUCCESS(state,payload){ //申请成功
    state.successPage = payload
  },
  SETPRCKDATA(state,payload){ //分行
    state.promotion.pickBank=payload;
  },
  SET_SHARECONFIG(state,payload){  //分享配置
    state.share.data = payload;
  }

};


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
