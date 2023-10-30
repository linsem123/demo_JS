import api from "@/api/financial/addcard.js";
import {saAlert,channel,hxdappIsSpecial} from "@/assets/js/common.js";
const state = {
  // version:"1.0.6",           // 分支
  version:"2.0.6",           // 主干
  // version:"3.0.1",           // uat
  // version:"3.6.1",           // 生产
  fixed:true,
  carddata:{
    lcptCardList:[],            // 借记卡列表
    alert:{
      msg:"",
      err:"",
      showAlert:""
    },
  },
  adddata:{
    add_cardNo:"",               // 银行卡号
    add_debitName:"",            // 所属银行
    add_code:"",                 // 银行代号
    custName:"",                 // 持卡人姓名
    phone:"",                    // 手机号码
    idNo:"",                     // 证件号码
    // overdueMoney:"",             // 溢缴款金额
    disshow:"",                  // 按钮状态
    alert:{
      msg:"",
      err:"",
      showAlert:""
    }
  },
  selectdata:{
    searchResult:"",              // 搜索内容
    lcptBankInfoList:[],          // 银行数组  
    bankList:[],                  // 总数组
    alert:{
      msg:"",
      err:"",
      showAlert:""
    }
  }
};

const getters={};
const actions = {
  // 获取所有卡信息
  bgetInfo({commit,state},payload){
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    api.achieveCardList(baseData).then((res)=>{
      console.log(res);
      if(res.success==true){
        commit('BSETINITCARDLIST',res.data);
      }else if(res.success==false){
        commit('BHOMEALERT', {show: true, msg: res.msg, err: res.code,fixed:true});
        // saAlert("添利三号借记卡列表页","获取卡信息",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status,fixed:true});
        // saAlert("添利三号借记卡列表页","获取卡信息",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: '',fixed:true});
        // saAlert("添利三号借记卡列表页","获取卡信息","请求失败","请求报错");
      }
    });
  },
  // 跳转选择银行页
  btoAdd({commit,state},payload){
    var obj = {
      custName:payload.adddata.custName,
      phone:payload.adddata.phone,
      idNo:payload.adddata.idNo,
      lcptBankInfoList:payload.selectdata.lcptBankInfoList
    }
    payload.router.push({path:"/TimLee/selectPage?Sdata="+JSON.stringify(obj)});
  },
  // 根据卡号查询所属银行
  bupdatedebitname({commit,state},payload){
    baseData.data.debitCardNo = payload.cardNum;
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    api.searchBank(baseData).then((res)=>{
      console.log(res);
      if(res.success==true){
        commit('BSETADDDATA',res.data.lcptBankInfoList);
      }else if(res.success==false){
        commit('BADDALERT', {show: true, msg: res.msg, err: res.code});
        // saAlert("添利三号借记卡新增页","查询卡号对应银行",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BADDALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        // saAlert("添利三号借记卡新增页","查询卡号对应银行",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BADDALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        // saAlert("添利三号借记卡新增页","查询卡号对应银行","请求失败","请求报错");
      }
    });
  },
  // 添加银行
  baddbcard({commit,state},payload){
    baseData.data.debitCardNo = payload.add_cardNo;
    baseData.data.bankCode = payload.adddata.add_code;
    baseData.data.bankName = payload.add_debitName;
    if(channel()=="hxdapp"&&hxdappIsSpecial()){
      baseData.channel = "hxdapp";
    }else{
      baseData.channel = "normal";
    }
    api.addCard(baseData).then((res)=>{
      console.log(res);
      if(res.success==true){
        commit("BADDBCARD",payload);
        payload.router.push({path:"/TimLee/cardPage"});
      }else if(res.success==false){
        commit('BADDALERT', {show: true, msg: res.msg, err: res.code});
        // saAlert("添利三号借记卡新增页","新增借记卡",res.msg,"报错提示");
      }
    }).catch((err)=>{
      console.log(err);
      if(err.response.status){
        commit('BADDALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
        // saAlert("添利三号借记卡新增页","新增借记卡",err.response.status+err.response.statusText,"请求报错");
      }else{
        commit('BADDALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
        // saAlert("添利三号借记卡新增页","新增借记卡","请求失败","请求报错");
      }
    });
  },
  // 搜索银行
  bsearchbank({commit,state},payload){
    var newArr = [];
    for(var i=0;i<payload.bankList.length;i++){
      if(payload.searchResult!=""){
        if(payload.bankList[i].bankName.indexOf(payload.searchResult) != -1){
          newArr.push(payload.bankList[i]);
        }
      }
    }
    var obj = {
      newArr:newArr,
      bankList:payload.bankList
    }
    commit("BSEARCHBANK",obj);
  }
};

const mutations={
  // 一、添利三号借记卡列表页
  // 更改页面状态
  BCHANGEFIXED(state,value){
    state.fixed = value;
  },
  // 更改列表页错误弹框状态
  BHOMEALERT(state,data){
    state.carddata.alert.showAlert = data.show;
    state.carddata.alert.msg = data.msg;
    state.carddata.alert.err = data.err;
    state.fixed = data.fixed;
  },
  // 初始化数据
  BSETINITCARDLIST(state,data){
    // 卡列表
    var arr = data.lcptCardList.slice(1,data.lcptCardList.length);
    arr[0].limitMoney = data.overdueMoney;
    state.carddata.lcptCardList = arr;
    // 新增借记卡
    state.adddata.custName = data.custName;
    state.adddata.phone = data.phone;
    state.adddata.idNo = data.idNo;
    // 选择银行
    state.selectdata.lcptBankInfoList = data.lcptBankInfoList;
    state.selectdata.bankList = data.bankList;
  },

  // 二、添利三号借记卡新增页 
  // 更改银行卡号
  BCHANGECARDNO(state,value){
    state.adddata.add_cardNo = value;
  },
  // 更改按钮状态
  BCHANGEHOMEBTN(state,value){
    state.adddata.disshow = value;
  },
  // 更改新增页错误弹框状态
  BADDALERT(state,data){
    state.adddata.alert.showAlert = data.show;
    state.adddata.alert.msg = data.msg;
    state.adddata.alert.err = data.err;
  },
  // 借记卡列表初始化
  BSETADDDATA(state,data){
    state.adddata.add_debitName = data[0].bankName;
    state.adddata.add_code = data[0].bankCode;
    state.adddata.disshow = true;
  },
  // 银行列表初始化
  BSETBANKLIST(state,value){
    state.selectdata.lcptBankInfoList = value;
    state.selectdata.bankList = value;
  },
  // 选择银行
  BSHOWBANKNAME(state,data){
    state.adddata.add_debitName = data.bankName;
    state.adddata.add_code = data.bankCode;
    state.selectdata.searchResult = "";
  },
  // 添加银行
  BADDBCARD(state,payload){
    state.adddata.add_cardNo = "";
    state.adddata.add_debitName = "";
    state.adddata.disshow = false;
  },
  // 三、添利三号搜索借记卡页
  // 搜索银行
  BSEARCHBANK(state,data){
    if(data.newArr.length==0){
      state.selectdata.lcptBankInfoList = data.bankList;
    }else{
      state.selectdata.lcptBankInfoList = data.newArr;
    }
  }
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