import lc from '@/api/lc.js';
import _ from 'lodash';
import {initsa,saAlert,channel,hxdappIsSpecial} from "@/assets/js/common.js";
const state = {
    // version:"1.0.6",   // 分支
    version:"2.0.6",   // 主干
    // version:"3.0.1",   // uat
    // version: "3.6.1",  // 生产版本
    uuid:"",
    login:{
        logui:{},
        logdata:{},
        logmenu:{}
    },
    home:{
        homeui:{
            hascard:false,
            nocard:true,
            imgshow_one:true,
            imgshow_two:false,
            disshow:false,
        },
        homedata:{
            source:"",                  // 交易来源
            channel:"",        
            creditcardNum:{},           // 信用卡卡号
            applyMoney:"",              // 申请金额
            maxMoney:"",                // 最高可借
            identNum:"",                // 身份证号
            bankName:"",                // 首页借记卡名称
            bankNum:"",                 // 首页借记卡卡号
            bankNo:"",                  // 首页借记卡卡bin
            creditIndex:0,
            debitIndex:0
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
    public:{
        pubui:{
            debitList:[],
            bankList:[],
            creditList:[]
        },
        pubdata:{},
        pubmenu:{    // 公共弹出框
            laystatu:"",                 // 蒙版
            reminderstatu:"",            // 温馨提示
            applyshow:""
        }
    },
    add:{           // 添加借记卡
        addui:{
            disshow:false,
            addFlag:false
        },
        adata:{
            hascardName:"",
            add_cardNo:"",            //添加借记卡页面 输入卡号
            add_debitName:"",         //添加借记卡页面 借记卡名 
            add_debitNum:"",          //添加借记卡页面 借记卡Bin 
        },
        alert:{
            msg:"",
            err:"",
            showAlert:""
        }
    },
    select:{       // 搜索借记卡
        searchResult:"",
        alert:{
            msg:"",
            err:"",
            showAlert:""
        }
    }
}
const getters = {

}
const actions = {
    saInit({commit, state}, title) {    
        state.uuid = initsa(title);
    },
    bsetinithome({commit,state},payload){                           // 初始化首页
        if(state.add.addui.addFlag==true){
            commit('CHANGEDATA',payload);
        }else if(state.add.addui.addFlag==false){
            if(channel()=="hxdapp"&&hxdappIsSpecial()){
                baseData.channel = "hxdapp";
            }else{
                baseData.channel = "normal";
            }
            lc.gethomeData(baseData).then((res)=>{
                if(res.success==true){
                    if(res.data.isSuccess==true){
                        commit("BSETINITHOME",res.data);
                    }else if(res.data.isSuccess==false){
                        commit("BHOMEALERT",{show: true, msg: res.data.data.msg, err: res.data.data.code});
                    }
                }else if(res.success==false){
                    saAlert("预借现金首页","初始化数据",res.data.data.msg,"报错提示");
                    if(res.message==""){
                        commit("BHOMEALERT",{show: true, msg: "服务器异常", err: ""});
                    }else{
                        commit("BHOMEALERT",{show: true, msg: res.data.data.msg, err: res.data.data.code});
                    }
                }
            }).catch((err)=>{
                console.log(err);
                if(err.response.status){
                    commit('BHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
                    saAlert("预借现金首页","初始化数据",err.response.status+err.response.statusText,"请求报错");
                }else{
                    commit('BHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
                    saAlert("预借现金首页","初始化数据","请求失败","请求报错");
                }
            });
        } 
    },
    bchangemaxmoney({commit,state},payload){                        // 切换信用卡
        baseData.data.cardKey = payload.creditcardNum.cardKey;
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            baseData.channel = "hxdapp";
        }else{
            baseData.channel = "normal";
        }
        lc.getnewHome(baseData).then((res)=>{
            if(res.success==true){
                if(res.data.isSuccess==true){
                    var obj = {"data":res.data,"creditcardNum":payload.creditcardNum};
                    commit("BCHANGEMAXMONEY",obj);
                }else if(res.data.isSuccess==false){
                    commit("BHOMEALERT",{show: true, msg: res.data.data.msg, err: res.data.data.code});
                }
            }else if(res.success==false){
                saAlert("预借现金首页","切换信用卡",res.data.data.msg,"报错提示");
                if(res.message==""){
                    commit("BHOMEALERT",{show: true, msg: "服务器异常", err: ""});
                }else{
                    commit("BHOMEALERT",{show: true, msg: res.data.data.msg, err: res.data.data.code});
                }
            }
        }).catch((err)=>{
            console.log(err);
            if(err.response.status){
                commit('BHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
                saAlert("预借现金首页","切换信用卡",err.response.status+err.response.statusText,"请求报错");
            }else{
                commit('BHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
                saAlert("预借现金首页","切换信用卡","请求失败","请求报错");
            }
        });
    },
    bupdatedebitname({commit,state},payload){                       //根据卡号查询银行名称
        var bankdata = {
            bankNO:payload.cardNum
        }
        var channel2 = "";
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            channel2 = "hxdapp";
        }else{
            channel2 = "normal";
        }
        lc.getCardBank({data:bankdata,channel:channel2}).then((res)=>{
            if(res.isSuccess==true){
                commit('BUPDATEDEBITNAME',res.data);
            }else if(res.isSuccess==false){
                saAlert("预借现金借记卡添加页面","输入银行卡号",res.msg,"报错提示");
                commit("BADDALERT",{show: true, msg: res.msg, err: ""});
            }
        }).catch((err)=>{
            console.log(err);
            if(err.response.status){
                commit('BADDALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
                saAlert("预借现金借记卡添加页面","输入银行卡号",err.response.status+err.response.statusText,"请求报错");
            }else{
                commit('BADDALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
                saAlert("预借现金借记卡添加页面","输入银行卡号","请求失败","请求报错");
            }
        });
    },
    baddbcard({commit,state},payload){                              // 新增借记卡
        var addInfo = {
            bankNO:payload.add_cardNo,
            cardNo:state.home.homedata.identNum,   
            userName:payload.hascardName,
            bankBin:state.add.adata.add_debitNum,
            busiType:"YJXJ"
        }
        var channel2 = "";
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            channel2 = "hxdapp";
        }else{
            channel2 = "normal";
        }
        lc.addBankCard({data:addInfo,channel:channel2}).then((res)=>{
            if(res.isSuccess==true){
                commit('BADDBCARD',addInfo);
                commit("BCHANGEHOMEBTN",{status:true});
                payload.router.push({path:'/LendCash/HomePage'});
            }else if(res.isSuccess==false){
                saAlert("预借现金借记卡添加页面","新增借记卡",res.msg,"报错提示");
                commit("BADDALERT",{show: true, msg:res.msg , err: ""});
            }
        }).catch((err)=>{
            console.log(err);
            if(err.response.status){
                commit('BADDALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
                saAlert("预借现金借记卡添加页面","新增借记卡",err.response.status+err.response.statusText,"请求报错");
            }else{
                commit('BADDALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
                saAlert("预借现金借记卡添加页面","新增借记卡","请求失败","请求报错");
            }
        });
    },
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
        lc.getbankList({data:searchInfo,channel:channel2}).then((res)=>{
            if(res.isSuccess==true){
                var obj = {"data":res.data,"result":payload.searchResult};
                commit('BSEARCHBANK',obj);
            }else if(res.isSuccess==false){
                saAlert("预借现金借记卡搜索页面","输入搜索的关键字",res.msg,"报错提示");
                commit("BSELECTALERT",{show: true, msg: res.msg, err: ""});
            }
        }).catch((err)=>{
            console.log(err);
            if(err.response.status){
                commit('BSELECTALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
                saAlert("预借现金借记卡搜索页面","输入搜索的关键字",err.response.status+err.response.statusText,"请求报错");
            }else{
                commit('BSELECTALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
                saAlert("预借现金借记卡搜索页面","输入搜索的关键字","请求失败","请求报错");
            }
        });
    },
    bshowbankname({commit,state},payload){                          // 选中银行
        commit('BSHOWBANKNAME',payload);
    }, 
    binitaddpage({commit,state},payload){                           // 切换借记卡
        commit('BINITADDPAGE',payload);
    },
    bconfirmdelete({commit,state},payload){                         // 确定删除借记卡
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
        lc.deleteBank({data:deleteInfo,channel:channel2}).then((res)=>{
            if(res.isSuccess==true){
                commit('BCONFIRMDELETE',payload); 
            }else if(res.isSuccess==false){
                saAlert("预借现金首页","删除借记卡",res.msg,"报错提示");
                commit("BHOMEALERT",{show: true, msg: res.msg, err: ""});
            }
        }).catch((err)=>{
	    console.log(err);
            if(err.response.status){
                commit('BHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
                saAlert("预借现金首页","删除借记卡",err.response.status+err.response.statusText,"请求报错");
            }else{
                commit('BHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
                saAlert("预借现金首页","删除借记卡","请求失败","请求报错");
            }
        });
    },
    bsubmitdata({commit,state},payload){                            // 预借现金首页提交
        baseData.data.pwd = payload.pwd;
        baseData.data.cardKey = payload.cardKey;
        baseData.data.cardNo = payload.cardNo;
        baseData.data.isLocal = payload.isLocal;
        baseData.data.applyAmt = payload.applyAmt;
        baseData.data.applyLimit = payload.applyLimit;
        baseData.data.channel = payload.channel;
        baseData.data.cardNoC = payload.cardNoC;
        baseData.data.nameC = payload.nameC;
        baseData.data.bankC = payload.bankC;
        baseData.data.bankName = payload.nameC;
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            baseData.channel = "hxdapp";
        }else{
            baseData.channel = "normal";
        }
        lc.submitHome(baseData).then((res)=>{
            if(res.success==true){
                if(res.data.isSuccess==true){
                    commit('BSUBMITDATA',baseData);
                    payload.router.push({path:"/LendCash/SuccessPage"});
                }else if(res.data.isSuccess==false){
                    commit("BAPPLYFAIL",{show:true,title:"申请失败",msg:res.data.data.msg,err:res.data.data.code});
                }
            }else if(res.success==false){
                saAlert("预借现金首页","首页提交数据",res.data.data.msg,"报错提示");
                if(res.message==""){
                    commit("BHOMEALERT",{show: true, msg: "服务器异常", err: ""});
                }else{
                    commit("BAPPLYFAIL",{show:true,title:"申请失败",msg:res.data.data.msg,err:res.data.data.code});
                }
            }
        }).catch((err)=>{
            console.log(err);
            if(err.response.status){
                commit('BHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
                saAlert("预借现金首页","首页提交数据",err.response.status+err.response.statusText,"请求报错");
            }else{
                commit('BHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
                saAlert("预借现金首页","首页提交数据","请求失败","请求报错");
            }
        });
    }
}
const mutations = {
    BSETINITHOME(state,res){                                                        // 初始化首页
        state.home.homedata.channel = res.channel;        
        state.home.homedata.maxMoney = res.data.applyLimit;                         // 最高可借金额
        if(Number(res.data.applyLimit)>=50000){                                     // 申请金额
            state.home.homedata.applyMoney = 50000;
        }else{
            state.home.homedata.applyMoney = res.data.applyLimit;
        }
        state.home.homedata.identNum = res.data.cretNo;                             // 身份证号
        state.add.adata.hascardName = res.data.nameString;                          // 持卡人姓名
        state.public.pubui.creditList = res.creditList;                             // 信用卡列表
        state.public.pubui.debitList = _.cloneDeep(res.data.debitList);             // 借记卡列表
        state.home.homedata.creditcardNum = _.cloneDeep(res.creditList[0]);         // 信用卡号
        if(res.data.debitList.length==0 || res.data.debitList==null){
            state.home.homeui.hascard = false;
            state.home.homeui.nocard = true;
        }else{
            state.home.homeui.hascard = true;
            state.home.homeui.nocard = false;
            state.home.homedata.bankNum = _.cloneDeep(res.data.debitList[0][0]);
            state.home.homedata.bankName = _.cloneDeep(res.data.debitList[0][1]);
            state.home.homedata.bankNo = _.cloneDeep(res.data.debitList[0][3]);
        }
    },
    BCHANGEMAXMONEY(state,res){                  
        state.home.homedata.maxMoney = res.data.data.applyLimit;                    // 最高可借金额
        if(Number(res.data.data.applyLimit)>=50000){                                // 申请金额
            state.home.homedata.applyMoney = 50000;
        }else{
            state.home.homedata.applyMoney = res.data.data.applyLimit; 
        }
        state.home.homedata.creditcardNum = res.creditcardNum;
        state.home.homedata.creditIndex = res.creditcardNum.index;
        state.add.adata.hascardName = res.data.data.nameString;
    },
    BCHANGECHECKSTATUS(state,data){                                                 // 更改按钮选中状态
        state.home.homeui.imgshow_one = data.unchecked;
        state.home.homeui.imgshow_two = data.checked;
    },
    BCHANGEREMIND(state,data){                                                      // 温馨提示显示/隐藏
        state.public.pubmenu.laystatu = data.layer;
        state.public.pubmenu.reminderstatu = data.remind;
    },
    BCHANGEPASS(state,data){                                                        // 金额上限显示/隐藏
        state.public.pubmenu.laystatu = data.layer;
        state.public.pubmenu.applystatu = data.apply;
    },
    BEMPTYCARDNO(state,data){                                                       // 清空输入的卡号
        state.add.adata.add_cardNo = data.cardNo;
    },
    BHOMEALERT(state,data){                                                         // 预借现金首页弹出框
        state.home.alert.showAlert = data.show;
        state.home.alert.msg = data.msg;
        state.home.alert.err = data.err;
    },
    BADDALERT(state,data){                                                          // 添加借记卡弹出框
        state.add.alert.showAlert = data.show;
        state.add.alert.msg = data.msg;
        state.add.alert.err = data.err;
    },
    BSELECTALERT(state,data){                                                       // 搜索借记卡弹出框
        state.select.alert.showAlert = data.show;
        state.select.alert.msg = data.msg;
        state.select.alert.err = data.err;
    },
    BCHANGEHOMEBTN(state,data){                                                     // 更改首页按钮状态
        state.home.homeui.disshow = data.status;
    },
    BCHANGEADDBTN(state,data){                                                      // 更改添加页面按钮状态
        state.add.addui.disshow = data.status;
    },
    CHANGEDATA(state,payload){                                                      // 添加借记卡标识
        state.add.addui.addFlag = false;
    },
    BSEARCHBANK(state,res){                                                         // 默认展示前13个银行           
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
    BSHOWBANKNAME(state,payload){                                                   // 选择银行
        state.add.adata.add_debitNum = payload.debitNum;
        state.add.adata.add_debitName = payload.debitName;
        state.select.searchResult = "";
        if(state.add.adata.add_cardNo!=""){
            state.add.addui.disshow = true;
        }else{
            state.add.addui.disshow = false;
        }
    },
    BUPDATEDEBITNAME(state,res){                                                    // 根据卡号返回对应的银行
        if(res.length!=0){
            state.add.adata.add_debitNum = res[0][0];    //卡Bin
            state.add.adata.add_debitName = res[0][1];   //卡名
        }
    },
    BADDBCARD(state,res){                                                           // 新增借记卡到借记卡列表
        var arr = [res.bankNO,state.add.adata.add_debitName,state.add.adata.hascardName,res.bankBin];
        state.add.adata.add_cardNo = "";
        state.add.adata.add_debitName = "";
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
    BINITADDPAGE(state,payload){                                                    // 切换借记卡
        state.home.homedata.bankNum = payload.addData.data[0];
        state.home.homedata.bankName = payload.addData.data[1];
        state.home.homedata.bankNo = payload.addData.data[3];
        state.home.homedata.debitIndex = payload.addData.debitIndex;
    },
    BCONFIRMDELETE(state,payload){                                                  // 删除借记卡成功
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
    BAPPLYFAIL(state,data){                                                         // 申请失败
        state.home.fail.showAlert = data.show;
        state.home.fail.title = data.title;
        state.home.fail.msg = data.msg;
        state.home.fail.err = data.err;
    },
    BSUBMITDATA(state,res){                                                         // 申请成功
        state.home.homedata.applyMoney = res.data.applyAmt;
    }   
}
const baseData = {
    openId: "",
    traceId: state.uuid,
    channel: "",
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