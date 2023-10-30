import Vue from 'vue';
import Vuex from 'vuex';
import enjoy from './modules/enjoy';
import IdUpdate from './modules/IdUpdate';
import Lendcash from './modules/lendcash';
import common from './modules/common';
import cashInstalment from './modules/cashInstalment';
import autostage from './modules/autostaging';
import installment from './modules/installment';
import login from './modules/login';
import entry from './modules/entry';
import borrowedMoney from './modules/borrowedMoney';
import ConsumeInstallment from './modules/ConsumeInstallment';
import opendoor from './modules/financial/opendoor';
import enterhome from './modules/financial/turnmoney/enterhome';
import outhome from './modules/financial/turnmoney/outhome';
import yindex from "./modules/financial/yindex";
import addcard from "./modules/financial/addcard";
import {saAlert,channel,hxdappIsSpecial} from "@/assets/js/common";
import api from '@/api/api.js';
import Sxf from './modules/sxf';
import _ from "lodash";

Vue.use(Vuex);

const state = {
  innerHeight:"",
  addDebitCard:{ //添加借记卡
    name:"",
    title:"",
    formData:{
      name:"",
      identNum:"", //身份证号
      add_cardNo:"", //卡号
      add_bankBin:"", 
      add_debitName:"", //发卡银行
      isActive:false
    },
    version:""
  },
  searchBank:{
    searchResult:"",
    bankList:[],        //[["兴业银行","3213223212"],[]]  银行名称  行号
  },
  fixed:false
}

const actions = {
  updateDebitName({state,commit},payload){  //添加借记卡 输入卡号 >10 时更新发卡行  
    var bankdata = {
      bankNO:payload.cardNum
    }
    let obj={
      data:bankdata,
      channel:"wechat"
    }
    if(channel()=="hxdapp" && hxdappIsSpecial()){
      obj.channel="hxdapp"
    }
    api.getCardBank(obj).then((res)=>{
      // console.log("getCardBank res",res);
        if(res.isSuccess==true){
            commit('SET_UPDATEDEBITNAME',res.data);
        }else if(res.isSuccess==false){
          commit('SET_UPDATEDEBITNAME',"");
          saAlert("借记卡添加页面","输入银行卡号",res.msg,"报错提示");
          commit("SET_BGFIXED",{fixed:true});
          $.alert(res.msg,"提示",()=>{
            commit("SET_BGFIXED",{fixed:false});
          });
        }
    }).catch((err)=>{
        console.log("getCardBank err",err);
        if(err.response.status){
          saAlert("借记卡添加页面","输入银行卡号",err.response.status+err.response.statusText,"请求报错");
          commit("SET_BGFIXED",{fixed:true});
          $.alert(err.response.status,"请求失败",()=>{
            commit("SET_BGFIXED",{fixed:false});
          });
        }else{
          saAlert("借记卡添加页面","输入银行卡号","请求失败","请求报错");
          commit("SET_BGFIXED",{fixed:true});
          $.alert("请求失败，请稍后重试","提示",()=>{
            commit("SET_BGFIXED",{fixed:false});
          });
        }
    });
  },
  getBankList({state,commit},payload){  //搜索银行
    let obj={
      data:payload,
      channel:"wechat"
    }
    if(channel()=="hxdapp" && hxdappIsSpecial()){
      obj.channel="hxdapp"
    }
    api.getBankList(obj).then((res)=>{
      // console.log("getBankList res",res);
        if(res.isSuccess==true){
            commit('GETBANKLIST',res.data);
        }else if(res.isSuccess==false){
            saAlert("借记卡搜索页面","输入搜索的关键字",res.msg,"报错提示");
            commit("SET_BGFIXED",{fixed:true});
            $.alert(res.msg,"提示",()=>{
              commit("SET_BGFIXED",{fixed:false});
            });
        }
    }).catch((err)=>{
        console.log("getBankList err",err);
        if(err.response.status){
          saAlert("借记卡搜索页面","输入搜索的关键字",err.response.status+err.response.statusText,"请求报错");
          commit("SET_BGFIXED",{fixed:true});
          $.alert(err.response.status,"请求失败",()=>{
            commit("SET_BGFIXED",{fixed:false});
          });
        }else{
          saAlert("借记卡搜索页面","输入搜索的关键字","请求失败","请求报错");
          commit("SET_BGFIXED",{fixed:true});
          $.alert("请求失败，请稍后重试","提示",()=>{
            commit("SET_BGFIXED",{fixed:false});
          });
        }
    });
  },
  addDebitCardCon({state,commit},payload){  //添加借记卡 确认按钮
    console.log("addDebitCardCon payload",payload);
    let obj={
      data:payload.data,
      channel:"wechat"
    }
    if(channel()=="hxdapp" && hxdappIsSpecial()){
      obj.channel="hxdapp"
    }
    api.addBankCard(obj).then((res)=>{
      // console.log("addBankCard res",res);
      if(res.isSuccess==true){
          commit('ADDDEBITCARDCON',payload.data);
          if(payload.title=="现金分期"){
            payload.router.push("/CashInstalment/HomePage");//跳转首页  做缓存
          }
      }else if(res.isSuccess==false){
          saAlert("借记卡添加页面","新增借记卡",res.msg,"报错提示");
          if(res.msg.length<4){
              commit("SET_BGFIXED",{fixed:true});
              $.alert("第三方存管账户不允许添加","提示",()=>{
                  // $(".main").removeClass("bg-fixed");
                  commit("SET_BGFIXED",{fixed:false});
              });
          }else if(res.msg.length>=4){
              commit("SET_BGFIXED",{fixed:true});
              $.alert(res.msg,"提示",()=>{
                commit("SET_BGFIXED",{fixed:false});
              });
          }
      }
    }).catch((err)=>{
        console.log("addBankCard err",err);
        if(err.response.status){
          saAlert("借记卡添加页面","新增借记卡",err.response.status+err.response.statusText,"请求报错");
          commit("SET_BGFIXED",{fixed:true});
          $.alert(err.response.status,"请求失败",()=>{
            commit("SET_BGFIXED",{fixed:false});
          });
        }else{
          saAlert("借记卡添加页面","新增借记卡","请求失败","请求报错");
          commit("SET_BGFIXED",{fixed:true});
          $.alert("请求失败，请稍后重试","提示",()=>{
            commit("SET_BGFIXED",{fixed:false});
          });
        }
    });
  },
  delBankInfo({state,commit},payload){  //确定删除
    let obj={
      data:{cardNo:payload.cardNo,bankNO:payload.bankNO},
      channel:"wechat"
    }
    if(channel()=="hxdapp" && hxdappIsSpecial()){
      obj.channel="hxdapp"
    }
    api.deleteBank(obj).then((res)=>{
      // console.log("deleteBank res",res);
      if(res.isSuccess){
        let arr = state.ci.home.debitcardList;
        let newArr = [];
        _.forEach(arr,(item,index)=>{
          if(index!=payload.index){
            newArr.push(item);
          }
        })
        state.ci.home.debitcardList = newArr;
        console.log("debitcardList",newArr);
        state.ci.home.debitIndex = 0;
        if(newArr.length>0){
          state.ci.home.debitCard = newArr[0];
          state.ci.home.hasCard=true;
        }else{
          state.ci.home.action="2";
          state.ci.home.debitCard = ["","","",""];
          state.ci.home.hasCard=false;
        }
      }else{
        saAlert("添加借记卡按钮","删除借记卡",res.msg,"报错提示");
        commit("SET_BGFIXED",{fixed:true});
        $.alert(res.msg,"提示",()=>{
          commit("SET_BGFIXED",{fixed:false});
            // commit('CONFIRMDELETEFAIL',payload); //删除失败
        });     
      }
    }).catch((err)=>{
      console.log("deleteBank err",err);
      if(err.response.status){
        saAlert("添加借记卡按钮","删除借记卡",err.response.status+err.response.statusText,"请求报错");
        commit("SET_BGFIXED",{fixed:true});
        $.alert(err.response.status,"请求失败",()=>{
          commit("SET_BGFIXED",{fixed:false});
        });
      }else{
        saAlert("添加借记卡按钮","删除借记卡","请求失败","请求报错");
        commit("SET_BGFIXED",{fixed:true});
        $.alert("请求失败，请稍后重试","提示",()=>{
          commit("SET_BGFIXED",{fixed:false});
        });
      }
  });

  }
}

const mutations = {
  SET_HEIGHT:(state,payload)=>{state.innerHeight = payload.innerHeight},
  SET_ADDDEBIT(state,payload){  //设置  新增借记卡 当前项目信息
    // console.log("SET_ADDDEBIT",payload);
    state.addDebitCard.name=payload.name;
    state.addDebitCard.title=payload.title;
    state.addDebitCard.version=payload.version;
    state.addDebitCard.formData.identNum = payload.identNum;
  },
  SET_UPDATEDEBITNAME(state,payload){ //根据卡号返回对应的银行
    if(payload.length!=0){
      state.addDebitCard.formData.add_bankBin = payload[0][0];    //卡Bin
      state.addDebitCard.formData.add_debitName = payload[0][1];   //卡名
      state.addDebitCard.formData.isActive = true;
    }else{
      state.addDebitCard.formData.add_bankBin = "";    //卡Bin
      state.addDebitCard.formData.add_debitName = "";   //卡名
      state.addDebitCard.formData.isActive = false;
    }
  },
  GETBANKLIST(state,payload){    //搜索结果           
    state.searchBank.bankList = payload;
  },
  TICKBANKNAME(state,payload){  // 选择银行返回对应银行卡名 和 卡Bin
    state.addDebitCard.formData.add_bankBin = payload.debitNum;
    state.addDebitCard.formData.add_debitName = payload.debitName;
    state.searchBank.searchResult = "";
    if(state.addDebitCard.formData.add_cardNo==""){
        state.addDebitCard.formData.isActive = false;
    }else{
        state.addDebitCard.formData.isActive = true;
    }
  },
  ADDDEBITCARDCON(state,payload){
    var arr = [payload.bankNO,state.addDebitCard.formData.add_debitName,payload.userName,payload.bankBin];
    localStorage.setItem("debitCard",JSON.stringify(arr));
    state.addDebitCard.formData.add_cardNo="";
    state.addDebitCard.formData.add_debitName="";
    state.addDebitCard.formData.isActive=false;
    // state.ci.home.debitcardList.unshift(arr);
    // state.ci.home.debitCard = state.ci.home.debitcardList[0];
    state.ci.home.bankBin = payload.bankBin;
    // state.ci.home.hascard = true;
  },
  SET_BGFIXED(state,payload){
    state.fixed=payload.fixed;
  },
}

const getters = {
    
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: {
    a: enjoy,
    iu:IdUpdate,
    lc:Lendcash,
    com: common,
    log:login,
    autostage:autostage,
    ci:cashInstalment,
    co:ConsumeInstallment,
    entry:entry,
    zd:installment,
    brm:borrowedMoney,
    sxf:Sxf,
    open:opendoor,   //开户
    lc_enter:enterhome,
    yindex:yindex,
    lc_out:outhome,
    baddcard:addcard
  }
})
