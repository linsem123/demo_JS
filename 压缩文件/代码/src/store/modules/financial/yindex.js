import api from "@/api/financial/yindex.js";
import {channel,hxdappIsSpecial,drawLine,saAlert} from "@/assets/js/common.js";
import _ from "lodash";
const state={
    yindex:{
        isRegister:"",   //是否注册添利账户  1-已注册 0-未注册 3-加载失败 ""-空白页
        version:"1.0.0"  
    },
    home:{
        tradeFlag:"0",    //是否有过交易记录 0-无 1有
        proBalance:"0.00",      //理财持仓
        lastEarning:"0.00",      //昨日收益
        acctBalance:"0.00",      //添利账户余额
        totalAmt:"0.00",      //总资产
    },
    prodes:{
        qiriAnnualized:"0.00",  //七日年化
        wanfenIncome:"0.00",    //万分收益
        proBalance:"",   //理财持仓
        lastEarning:"",  //昨日收益
        qiriTrend:[],
        qiriDate:[],
        qiriData:[],
        qiriMax:'',
        qiriMin:"",
        wanfenTrend:[],
        wanfenDate:[],
        wanfenData:[],
        wanfenMax:"",
        wanfenMin:"",
        name:"七日年化",
        trend:1,  //1--七日年化 2-万份收益
        proInfo:{
            name:"",   //全称
            org:"",    //机构
            risk:"",   //风险  1-基本无风险 2-低风险 3-较低风险 4-中等风险 5-较高风险 6-高风险
            capitalFlag:"",   //是否保本 0-非保本 1-是
            adv:"",           //公告详情
            lowAmt:"",        //最低狗购买金额
            stepAmt:""        //递增金额
        },
        tradeFlag:"",  //是否有交易记录 0-无 1有 2-未注册
        showProBook:false,  //产品说明
        showProdetail:false,
        showProedu:false,
    },
    licaiDetail:{
        type:"",  //类型 全部""  购买1 赎回2 收益3
        detailList:[
            // {
            //     name:"买买买",
            //     date:"2019/09/10",
            //     amount:"2.222"
            // }
        ],
        showDate:false,
        dateNow:"",
        dateList:[
            // {
            //     text:"2019年6月",
            //     key:"1"
            // }
        ]  
    },
    baseData:{
        openId:"",
        traceId:""+Date.now(),
        channel:"wechat",
        version:"",
        data:{}
    },
    alert:{
        show: false,
        msg: '',
        err: ''
    }

}

const getters={}
const actions={
    isopened({state,commit},payload){  //是否注册添利账户
        if(channel()=="hxdapp" && hxdappIsSpecial()){
            payload.data.channel="hxdapp";
        }
        api.isopened(payload.data).then((res)=>{
            if(res.success){   //0-未开户  1-已开户
                // state.yindex.isRegister = Number(res.data);
                commit("SET_isRegister",Number(res.data))
                if(res.data==1){
                    payload.$router.push("/tianli/home");
                }else if(res.data==0){
                    payload.$router.push({path:"/tianli/prodes"});
                }
            }else{
                commit("SET_isRegister",3);
                let obj = {
                    show:true,
                    msg:res.msg,
                    err:""+res.code
                }
                commit("SET_ALERT",obj);
                saAlert("添利入口","是否注册理财账户",res.msg,res.code);
            }
        }).catch((err)=>{
            commit("SET_isRegister",3);
            if(err.response.status){
                commit('SET_ALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
                saAlert("添利入口","是否注册理财账户",err.response.status+err.response.statusText,"请求报错");
              }else{
                commit('SET_ALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
                saAlert("添利入口","是否注册理财账户","请求失败","请求报错");
              }  
        })
    },
    bankAccount({state,commit},payload){  //是否有交易记录
        if(channel()=="hxdapp" && hxdappIsSpecial()){
            payload.channel="hxdapp";
        }
        api.bankingAccount(payload).then((res)=>{
            let obj={};
            if(res.success){   //true-未开户  false-已开户
                if(res.data.tradeFlag==0){  //0 -无交易记录
                    obj = {
                        tradeFlag:res.data.tradeFlag,    //是否有过交易记录 0-无 1有
                        proBalance:"0.00",       //理财持仓
                        lastEarning:"0.00",      //昨日收益
                        acctBalance:"0.00",      //添利账户余额
                        totalAmt:"0.00",         //总资产
                    }
                }else if(res.data.tradeFlag==1){  //1-有交易记录
                    obj = {
                        tradeFlag:res.data.tradeFlag,    //是否有过交易记录 0-无 1有
                        proBalance:res.data.proBalance,      //理财持仓
                        lastEarning:res.data.lastEarning,      //昨日收益
                        acctBalance:res.data.acctBalance,      //添利账户余额
                        totalAmt:res.data.totalAmt,      //总资产
                    }
                }
                let temp = Object.assign({},state.home,obj);
                commit("SET_HOME",temp)
            }else{
                let obj = {
                    show:true,
                    msg:res.msg,
                    err:""+res.code
                }
                commit("SET_ALERT",obj);
                saAlert("添利我的理财","是否有交易记录",res.msg,res.code);
            }
        }).catch((err)=>{
            if(err.response.status){
                commit('SET_ALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
                saAlert("添利我的理财","是否有交易记录",err.response.status+err.response.statusText,"请求报错");
            }else{
                commit('SET_ALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
                saAlert("添利我的理财","是否有交易记录","请求失败","请求报错");
            }  
        })
    },
    wealthProduct({state,commit},payload){  //产品说明
        if(channel()=="hxdapp" && hxdappIsSpecial()){
            payload.data.channel="hxdapp";
        }
        api.wealthProduct(payload.data).then((res)=>{
            if(res.success){
                let obj = {};
                obj.qiriAnnualized = res.data.qiriAnnualized;
                obj.wanfenIncome=res.data.wanfenIncome;
                obj.wanfenTrend=res.data.wanfenTrend;
                obj.wanfenDate=[];
                obj.wanfenData=[];
                obj.wanfenMax =  res.data.wanfenTrend[0].wanfen;
                obj.wanfenMin = res.data.wanfenTrend[0].wanfen;
                _.forEach(res.data.wanfenTrend,(item,index)=>{
                    obj.wanfenDate.push(item.date);
                    obj.wanfenData.push(Number(item.wanfen));
                    if(item.wanfen>obj.wanfenMax){
                        obj.wanfenMax = item.wanfen;
                    }
                    if(item.date<obj.wanfenMin){
                        obj.wanfenMin=item.wanfen;
                    }
                })
                obj.wanfenDate = obj.wanfenDate.reverse();
                obj.wanfenData =  obj.wanfenData.reverse();

                obj.qiriTrend = res.data.qiriTrend;
                obj.qiriDate=[];
                obj.qiriData=[];
                obj.qiriMax =  res.data.qiriTrend[0].qiri;
                obj.qiriMin = res.data.qiriTrend[0].qiri;
                _.forEach(res.data.qiriTrend,(item,index)=>{
                    obj.qiriDate.push(item.date);
                    obj.qiriData.push(Number(item.qiri));
                    if(item.qiri>obj.qiriMax){
                        obj.qiriMax = item.qiri;
                    }
                    if(item.qiri<obj.qiriMin){
                        obj.qiriMin = item.qiri;
                    }
                })
                obj.qiriDate = obj.qiriDate.reverse();
                obj.qiriData = obj.qiriData.reverse();
                obj.proInfo=Object.assign({},res.data.proInfo);
                switch(res.data.proInfo.risk){
                    case "1":
                        obj.proInfo.risk = "基本无风险"
                        break
                    case "2":
                        obj.proInfo.risk = "低风险"
                        break
                    case "3":
                        obj.proInfo.risk = "较低风险"
                        break
                    case "4":
                        obj.proInfo.risk = "中等风险"
                        break
                    case "5":
                        obj.proInfo.risk = "较高风险"
                        break
                    case "6":
                        obj.proInfo.risk = "高风险"
                        break
                    default:break
                }
                if(res.data.proInfo.capitalFlag==0){
                    obj.proInfo.capitalFlag="非保本"
                }else if(res.data.proInfo.capitalFlag==1){
                    obj.proInfo.capitalFlag="保本"
                }
                drawLine(payload.$echarts,payload.$dom,obj.qiriMax,obj.qiriMin,obj.qiriDate,obj.qiriData,"七日年化走势图")
                let temp = Object.assign({},state.prodes,obj);
                commit("SET_PRODES",temp);
               
            }else{
                let obj = {
                    show:true,
                    msg:res.msg,
                    err:""+res.code
                }
                commit("SET_ALERT",obj);
                saAlert("添利产品说明","基本信息获取",res.msg,res.code);
            }
        }).catch((err)=>{
            if(err.response.status){
                commit('SET_ALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
                saAlert("添利产品说明","基本信息获取",err.response.status+err.response.statusText,"请求报错");
            }else{
                commit('SET_ALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
                saAlert("添利产品说明","基本信息获取","请求失败","请求报错");
            }
        })
    },
    bankDetail({state,commit},payload){  //我的理财明细
        if(channel()=="hxdapp" && hxdappIsSpecial()){
            payload.channel="hxdapp";
        }
        api.bankingDetail(payload).then((res)=>{
            if(res.success){
                commit("SET_DETAILLIST",res.data.detailList);
            }else{
                let obj = {
                    show:true,
                    msg:res.msg,
                    err:""+res.code
                }
                commit("SET_ALERT",obj);
                saAlert("添利产品说明","基本信息获取",res.msg,res.code);
            }
        }).catch((err)=>{
            if(err.response.status){
                commit('SET_ALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
                saAlert("添利产品说明","基本信息获取",err.response.status+err.response.statusText,"请求报错");
            }else{
                commit('SET_ALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
                saAlert("添利产品说明","基本信息获取","请求失败","请求报错");
            }
        })
    }
}
const mutations={
    SET_BASEDATA(state,payload){
        state.baseData.data=payload
    },
    SET_ALERT(state,payload){
        state.alert=payload;
    },
    SET_HOME(state,payload){   //设置添利主页数据
        state.home=payload;
    },
    SET_TRADEFLAG(state,payload){  //交易记录  理财持仓 昨日收益
        state.prodes.tradeFlag=payload.tradeFlag;
        state.prodes.proBalance=payload.proBalance;
        state.prodes.lastEarning=payload.lastEarning;
    },
    SET_isRegister(state,payload){  //设置是否注册过
        state.yindex.isRegister=payload;
    },
    SET_PRODES(state,payload){  // 产品说明
        state.prodes=payload
    },
    SET_TRENDFLAG(state,payload){  //点击切换走势图
        state.prodes.name=payload.name;
        state.prodes.trend=payload.trend;
    },
    SET_DATELIST(state,payload){  //理财明细picker时间
        state.licaiDetail.dateList=payload;
        state.licaiDetail.dateNow = payload[0].text;
    },
    SET_MXTYPE(state,payload){  //明细类型
        state.licaiDetail.type=payload;
    },
    SET_DETAILLIST(state,payload){  //理财明细
        state.licaiDetail.detailList=payload;
    },
    SET_DATECONFIRM(state,payload){  //点击选择时间后
        state.licaiDetail.showDate=payload.showDate;
        state.licaiDetail.dateNow= payload.dateNow;
    }
}
export default {
    namespaced:true,
    state,
    getters,
    actions,
    mutations
}