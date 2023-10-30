import api from '@/api/financial/turnmoney.js';
// importinstallment from '@/api/api.js';
import _ from 'lodash';
import {saAlert,track} from "@/assets/js/common.js"; //听云监听
const state={
    version:"1.0.0",
    homepage:{
        cardList:[
            // {CardNo:'1234',Atm:'124',CardName:'兴业银行信用卡',CardType:'信用卡'},
            // {CardNo:'2234',Atm:'224',CardName:'兴业银行信用卡',CardType:'信用卡'},
            // {CardNo:'3234',Atm:'324',CardName:'兴业银行信用卡',CardType:'借记卡'},
          ],
          mainCard:"",
          index:"",
          showMoney:true,  //标题用来显示金额的  
          err:false,
          msg:"不高于单笔转出限额",
          smppamt:"", //输入金额
          ageshow:true
    },
    ui:{
        unit:"万",
        text:"单笔转出限额",
    },
    turnenter:{                                   //
      text:'确认转出',
      dis:false,
  },
     // 短信
     manage:{
      smsCode:{
        smsText:"获取验证码",//倒计时
        smsCode:"", //验证码
        t:null, //定时器
        clickBl:true, //是否可点击
      },
      clickBl:false
    },
    handlebtn:{                                   //
        text:'确定',
        dis:true,
    },
    baseData: {
        openId: '',
        traceId: '',
        channel: '1',
        version: '1',
        data: {}
      },
};
const actions={
   outhome:({state,commit},payload)=>{
    api.outHome(payload).then((res)=>{
      if(res.success){
       console.log(res)
       let obj={}
       obj.cardList=res.data.cardList
       obj.index=res.data.index
       obj.mainCard=res.data.cardList[0]

       for(var i=0;i<obj.cardList.length;i++){
        if(obj.cardList[i].cardType == 2 ){
          obj.cardList[i].showText = true;
        }else{
          obj.cardList[i].showText = false;
        }
      }
      if(obj.mainCard.cardType==2){
         state.homepage.showMoney=true
      }else{
        state.homepage.showMoney=false 
      }

       let temp = Object.assign({},state.homepage,obj)
       commit('set_outhome',temp)
      }else{

      }
    }).catch((err)=>{
      console.log(err)
    })
   }
};
const mutations={
   set_outhome(state,payload){
       state.homepage=payload
   },
   SETBASEDATA(state, payload) {    //响应总参数
      state.baseData.data = payload; //突变data参数
      console.log(state.baseData.data )
    },
};
const getters={};
export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}