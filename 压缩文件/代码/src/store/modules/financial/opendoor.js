import api from '@/api/financial/opendoor.js';
// importinstallment from '@/api/api.js';
import _ from 'lodash';
import {saAlert,track,channel, hxdappIsSpecial} from "@/assets/js/common.js"; //听云监听
const state={
    version:"1.0.5",
    homepage:{
        cardList:[
                // {CardNo:'1234',Atm:'124',CardName:'兴业银行信用卡',CardType:'信用卡'},
                // {CardNo:'2234',Atm:'224',CardName:'兴业银行信用卡',CardType:'信用卡'},
                // {CardNo:'3234',Atm:'324',CardName:'兴业银行信用卡',CardType:'借记卡'},
              ],
         idNo:"",
         userName:"",
         phone:"",
         branchNo:"",
         cardNo:"",
        //  自定义
         fixed: false, 
         mainCard:"",     //主卡
         index:"0",       //卡列表索引
         pass:"",         //交易密码
         password:"",     //
         logo1:true,      //同意按钮  勾选
         logo2:"",        //未勾选
         ageshow:""  //用来控制短信栏位是否显示
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
    alert:{
        show :false,
        errTitle:'',
        errMsg:'',
        errCode:''
      },
    handlebtn:{                                   //
        text:'去购买',
        dis:true,
    },
    opendoor:{                                   //
        text:'确认开户',
        dis:false,
    },
    baseData: {
        openId: '',
        traceId: '',
        channel: '',
        version: '',
        data: {}
      },
};
const actions={
    // 首页查询接口
    set_doorhome({state,commit},payload){
        if(channel()=="hxdapp" &&  hxdappIsSpecial()){  //判断是否为好兴动
            payload.channel="hxdapp";                     //是 把channel赋值为""hxdapp"
          }
        api.doorHome(payload).then((res)=>{
           if(res.success){
              let obj={}
              obj.cardList=res.data.cardList
              obj.idNo=res.data.idNo
              obj.userName=res.data.userName
              obj.phone=res.data.phone
              obj.branchNo=res.data.branchNo
              obj.mainCard=res.data.cardList[0]
              let temp = Object.assign({}, state.homepage, obj)
              commit('set_doorhome', temp)
           }else{
            commit('SET_ERRALERT', {show: true,errTitle:"",errMsg: res.msg, errCode:res.code});
           }
        }).catch((err)=>{
          console.log(err)
          commit('SET_ERRALERT', {show: true,errTitle:"",errMsg: res.msg, errCode:res.code});
        })
    },
    //切卡接口
    set_changeCard({commit,state},payload){ 
        if(channel()=="hxdapp" &&  hxdappIsSpecial()){  //判断是否为好兴动
            let payload=payload.baseData
            payload.channel="hxdapp";                     //是 把channel赋值为""hxdapp"
          }
        api.changeCard(payload.baseData).then((res)=>{
            if(res.success){
              let obj={}
              obj.index=payload.index
              console.log(payload.index)
              state.homepage.mainCard = state.homepage.cardList[payload.index]
              console.log()
              obj.idNo=res.data.idNo
              obj.userName=res.data.userName
              obj.phone=res.data.phone
              obj.branchNo=res.data.branchNo
             let temp=Object.assign({},state.homepage,obj)
             commit('set_changecard',temp)
            }else{
             commit('SET_ERRALERT', {show: true,errTitle:"",errMsg: res.msg, errCode:res.code});
            }
        }).catch((err)=>{
          console.log(err)
          commit('SET_ERRALERT', {show: true,errTitle:"",errMsg: res.msg, errCode:res.code});
        })
    },
    // 提交开户
    set_applydoor:({state,commit},msg)=>{
      if(channel()=="hxdapp" &&  hxdappIsSpecial()){  //判断是否为好兴动
        payload.channel="hxdapp";                     //是 把channel赋值为""hxdapp"
      }
      api.applydoor(msg.data).then((res)=>{
            if(res.success){
              console.log(res.data)
              let obj={}
               obj.cardNo=res.data.cardNo
               let temp=Object.assign({},state.homepage,obj)
              // 路由传参
              let test={
                cardNo:res.data.cardNo,
              }
              test = JSON.stringify(test);  //把对象解析成字符
              console.log(test)
              msg.router.push({path:'/opendoor/Success',query:{value:test}});
               // 路由传参
               commit('set_applydoor',temp)
            }else{
              commit('SET_ERRALERT', {show: true,errTitle:"",errMsg: res.msg, errCode:res.code});
            }
          }).catch((err)=>{
             console.log(err)
             commit('SET_ERRALERT', {show: true,errTitle:"",errMsg: res.msg, errCode:res.code});
          })
    },
    // 短信
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
                type:'LCKH'
              }; 
              commit("SET_BASEDATA",obj); //提交参数
              dispatch("getSlider",state.baseData); //请求滑块接口
              commit("SET_SMSCLICLBL",true); //获取短信可点击
            }else{
    //倒计时
              commit("SET_INTERVAL",120);
              if(res.data.smsCode!=null&&res.data.smsCode!=undefined&&res.data.smsCode!=""){ //当短信存在时
                // commit("SET_SMSCODE",{smsCode:res.data.smsCode}); //测试   给短信smsCode字段赋值
                commit('SET_ERRALERT', {show: true,errTitle:"短信发送成功",errMsg:res.data.smsCode, errCode:""}); //弹框把短信弹出来
                console.log('短信长度2',state.manage.smsCode.smsCode.length)
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
              commit('SET_ERRALERT', {show: true,errTitle:"",errMsg: res.msg, errCode:res.code});
            }
          }
        }).catch((err)=>{
          console.log(err)
          commit("SET_SMSCLICLBL",true); //获取短信可点击
          if(err.response.status){
            commit('SET_ERRALERT', {show: true,errTitle:"",errMsg: "网络请求超时，请稍后重试~", errCode:err.response.status});
          }else{
            commit('SET_ERRALERT', {show: true,errTitle:"",errMsg: '请求失败，请稍后重试~', errCode: ''});
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
            commit('SET_ERRALERT', {show: true, errTitle: "", errMsg: res.msg, errCode: res.code});
          }
        }).catch((err) => {
          console.log("00000000");
          if (err.response.status) {
            commit('SET_ERRALERT', {show: true, errTitle: "", errMsg: "网络请求超时，请稍后重试~", errCode: err.response.status});
          } else {
            commit('SET_ERRALERT', {show: true, errTitle: "", errMsg: '请求失败，请稍后重试~', errCode: ''});
          }
        });
      },
};
const mutations={
  set_doorhome(state,payload){
      state.homepage=payload
      console.log(state.homepage)
  },
  set_changecard(state,payload){
      state.homepage=payload
  },
  set_applydoor(state,payload){
      state.homepage=payload
  },
  // 给短信赋值
  SETTEXTCODE(state, value) {
    state.manage.smsCode.smsCode = value;
    console.log(state.manage.smsCode.smsCode)
    console.log('短信长度3',state.manage.smsCode.smsCode)
  },
  SET_SMSCLICLBL:(state,payload)=>{ //短信是否可点击
    state.manage.smsCode.clickBl=payload;
  },
  //短信 + 最终确认按钮是否可点击
  SET_SMSCODE:(state,payload)=>{  
    state.manage.smsCode.smsCode=payload.smsCode;
    state.manage.clickBl=payload.bl;
  },
//   赋值imgCode
  SET_IMGCODE:(state,payload)=>{
    state.imgCode = payload;
  },
//   弹框
  SET_ERRALERT:(state,payload)=>{
    state.alert.show = payload.show;
    state.alert.errTitle =  payload.errTitle;
    state.alert.errMsg =  payload.errMsg;
    state.alert.errCode = payload.errCode;
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
 // 控制滚动穿透
  SET_BGFIXED(state, payload) {
    state.fixed = payload.fixed;
    console.log(state.fixed)
  },
  //处理传参
  SET_BASEDATA(state, payload) {    //响应总参数
    state.baseData.data = payload; //突变data参数
   },
};
const getters={
  dis: (state) => {
    return (state.homepage.pass==state.homepage.password && state.manage.smsCode.smsCode.length===6 
      && state.homepage.logo2)
  },
};
export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}