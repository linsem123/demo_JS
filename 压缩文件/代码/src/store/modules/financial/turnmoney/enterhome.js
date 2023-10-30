import api from '@/api/financial/turnmoney.js';
// importinstallment from '@/api/api.js';
import _ from 'lodash';
import {saAlert,track,channel, hxdappIsSpecial,encryptByDES} from "@/assets/js/common.js"; //听云监听
const state={
    version:"1.0.0",
    homepage:{
        cardList:[],

        money:"",
        balance:"",
        cardName:"",
        cardNo:"",
        operationTime:"",
        //自定义
        mainCard:"",  //主卡
        index:"0",    //卡索引
        smppamt:"",   //输入金额
        pass:""  ,     //密码
        err:false,     //是否显示报错
        msg:"" ,     //报错信息
        text:"可用余额",
        unit:"元",
        showMoney:true  //显示 金额的
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
      imgCode:{
        show:false, //是否显示滑块
        bigimgStr:"",
        tarimgStr:"",
        moveX:"", //滑块距离
        // sliderId:"" //滑块标识
      },
      applyfail: {                              //错误弹框
        show: false,                            //是否显示
        title: "资金失败",                   //标题
        msg: "",                                //错误信息
        err: "",
        btnTxt: "",
      },
      turnenter:{                                   //
        text:'确认转入',
        dis:false,
    },
    baseData: {
      openId: '',
      traceId: '',
      channel: '',
      version: '',
      data: {}
    },
    erroralert: {
      show: false,
      msg: '',
      err: '',
      title: '',
    },
    handlebtn:{                                   //
      text:'完成',
      dis:true,
  },
};
const actions={
  turnhome:({state,commit},payload)=>{
    api.turnHome(payload).then((res)=>{
      if(res.success){
       console.log(res)
       let obj={}
       obj.mainCard=res.data.cardList[0]
       obj.cardList=res.data.cardList

       for(var i=0;i<obj.cardList.length;i++){
        if(obj.cardList[i].cardType == 1 ){
          obj.cardList[i].showText = true;
        }else{
          obj.cardList[i].showText = false;
        }
      }

       let temp = Object.assign({}, state.homepage, obj)
       commit('set_turnhome', temp)
        if(state.homepage.mainCard.cardType=='1'){
          console.log('aaaaaaaa')
        state.homepage.ageshow=true
       }else{
        state.homepage.ageshow=false
        }
     console.log(state.homepage.ageshow)
      }else{
        commit('SET_ERRORAJERT', {show: true, msg: res.msg, err: res.code});
      }
    }).catch((err)=>{
        commit('SET_ERRORAJERT',{show:true,msg:res.msg,err:res.code})
      console.log(err)
    })
  },
  subenter({state,commit},msg){
    api.subEnter(msg.data).then((res)=>{
      if(res.success){
        console.log(res)
        let test={
          money:res.data.money,
          balance:res.data.balance,
          cardName:res.data.cardName,
          cardNo:res.data.cardNo,
          operationTime:res.data.operationTime
        }
        console.log(test)
         test=JSON.stringify(test)
        //  msg.router.push({path:'/opendoor/Success',query:{value:test}});
        msg.router.push({path:"/turnmoney/enterSuccess",query:{val:test}})
        console.log(val)
      }else{
        // commit('SET_ERRORAJERT',{show:true,msg:res.msg,err:res.code})
        commit('SET_APPLYFAIL', {show: true, msg: res.msg, title:state.applyfail.title , err:res.code});
      }
    }).catch((err)=>{
      console.log('aaaaaaa')
       commit('SET_ERRORAJERT',{show:true,msg:res.msg,err:res.code})
      console.log(err)
    })
  },
  sendSmsCode:({state,commit,dispatch},payload)=>{
    if(channel()=="hxdapp" &&  hxdappIsSpecial()){  //判断是否为好兴动
      payload.channel="hxdapp";                     //是 把channel赋值为""hxdapp"
     }
    api.sendSmsCode(payload).then((res)=>{
        console.log("sendSmsCode res:",res);
        if(res.success){
          console.log('短信',res.data)
          if(res.data.noFirstSend=="0"){  //1短信，0滑块
            let obj = { //请求滑块时传的参数
              cardKey:state.homepage.cardList[state.homepage.index].cardKey,
              type:'FRIO'
            }; 
            commit("SETBASEDATA",obj); //提交参数
            dispatch("getSlider",state.baseData); //请求滑块接口
            commit("SET_SMSCLICLBL",true); //获取短信可点击
          }else{
  //倒计时
            commit("SET_INTERVAL",120);
            if(res.data.smsCode!=null&&res.data.smsCode!=undefined&&res.data.smsCode!=""){ //当短信存在时
              commit("SET_SMSCODE",{smsCode:res.data.smsCode}); //测试   给短信smsCode字段赋值
              console.log('bbbbbbbbbbbb')
              console.log(res.data)
              commit('SET_ERRORAJERT', {show:true, title:"短信发送成功", msg:res.data.smsCode, err:""}); //弹框把短信弹出来
              console.log(state.homepage.pass.length)
              console.log('bgggggggggggggg')
            }else{
              commit("SET_SMSCODE",{smsCode:""});
            }
          }
        }else{
          if(res.code=="ERR_02"){
            commit("SET_SMSCLICLBL",false); //获取短信不可点击
            commit("SET_INTERVAL",60);
          }else{
            commit("SET_SMSCLICLBL",true); //获取短信可点击
            commit('SET_ERRORAJERT', {show: true,title:"",msg: res.msg, err:res.code});
          }
        }
      }).catch((err)=>{
        console.log(err)
        commit("SET_SMSCLICLBL",true); //获取短信可点击
        if(err.response.status){
          commit('SET_ERRORAJERT', {show: true,title:"",msg: "网络请求超时，请稍后重试~", err:err.response.status});
        }else{
          commit('SET_ERRORAJERT', {show: true,title:"",msg: '请求失败，请稍后重试~', err: ''});
        }
      });
    },
    getSlider:({state,commit},payload)=> {
      if(channel()=="hxdapp" &&  hxdappIsSpecial()){  //判断是否为好兴动
        payload.channel="hxdapp";                     //是 把channel赋值为""hxdapp"
      }
      api.getSlider(payload).then((res) => {
          console.log("getSlider res",res);
          if (res.success) {
            console.log(res.data)
            let obj = {
              show: true,
              bigimgStr: res.data.bigimgStr,
              tarimgStr: res.data.tarimgStr,
              moveX: "",
              // sliderId: res.data.sliderId
            };
            let temp = Object.assign({}, state.imgCode, obj);
            commit("SET_IMGCODE", temp);
          } else {
            console.log('走报错')
            commit('SET_ERRORAJERT', {show: true, title: "", msg: res.msg, err: res.code});
          }
        }).catch((err) => {
          console.log("00000000");
          if (err.response.status) {
            commit('SET_ERRORAJERT', {show: true, title: "", msg: "网络请求超时，请稍后重试~", err: err.response.status});
          } else {
            commit('SET_ERRORAJERT', {show: true, title: "", msg: '请求失败，请稍后重试~', err: ''});
          }
        });
      },
};
const mutations={
  //   赋值imgCode
  SET_IMGCODE:(state,payload)=>{
    state.imgCode = payload;
  },
  SET_SMSCLICLBL:(state,payload)=>{ //短信是否可点击
    state.manage.smsCode.clickBl=payload;
  },
  //短信 + 最终确认按钮是否可点击
  SET_SMSCODE:(state,payload)=>{ 
    state.manage.smsCode.smsCode=payload.smsCode;
    state.manage.clickBl=payload.bl;
  },
  // 给短信赋值
  SETTEXTCODE(state, value) {
    state.manage.smsCode.smsCode = value;
    console.log(state.manage.smsCode.smsCode)
  },
   //短信倒计时
   SET_INTERVAL:(state,payload)=>{ 
    let n = Number(payload);
    clearInterval(state.manage.smsCode.t);
    state.manage.smsCode.smsText=n+'s';
    state.manage.smsCode.t=setInterval(()=>{
      n--;
      if(n<10&&n>0){
        n="0"+n;
      }
      let b = n+'s'
      state.manage.smsCode.smsText=b;
      if(Number(n)<0){
        clearInterval(state.manage.smsCode.t);
        state.manage.smsCode.smsText="重新获取";
        state.manage.smsCode.clickBl=true;  //按钮变可点
        state.manage.clickBl=false;
      }
    },1000)
  },
  SETBASEDATA(state, payload) {    //响应总参数
    state.baseData.data = payload; //突变data参数
   },
   set_turnhome(state,payload){
     state.homepage=payload
     console.log(state.homepage)
   },
   //处理报错弹框
  SET_ERRORAJERT(state, payload) {
    state.erroralert.show = payload.show;
    state.erroralert.msg = payload.msg;
    state.erroralert.err = payload.err;
    state.erroralert.title = payload.title
    console.log(state.erroralert.title)
  },
  SET_APPLYFAIL(state,payload){   //交易密码支付错误
    state.applyfail.show = payload.show;
    state.applyfail.title = payload.title
    state.applyfail.msg = payload.msg;
    state.applyfail.err = payload.err;
},
};
const getters={
  dis: (state) => {
    return (state.homepage.pass.length===6  && state.homepage.smppamt.length>0
      && state.homepage.err==false  && state.manage.smsCode.smsCode.length===6)
      // && state.manage.smsCode.smsCode.length===6 
  },
};
export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}