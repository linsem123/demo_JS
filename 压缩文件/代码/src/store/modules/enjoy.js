import api from '@/api/api.js';
import _ from 'lodash';
import {saAlert,channel,hxdappIsSpecial} from "@/assets/js/common.js";
const state = {
    home:{ //首页数据
        hdata:{ //首页渲染数据
            timeShow:false,                              //倒计时标识
            countdown:"",                                //是否出现倒计时 
            countTime:"10",                                //倒计时时间
            creditcardNum:{},        //信用卡卡号
            // 可变数据 需请求
            applyNum:"",                          //申请金额
            maxNum:"",                            //申请最大金额
            // 分期支付
            disepayPart:"",                              //每期应还金额(优惠前)
            epayPart:"",                                 //每期应还金额(优惠后)
            disemoneyPart:"",                            //每期应还本金(优惠前)
            emoneyPart:"",                               //每期应还本金(优惠后)
            disechargePart:"",                           //每期手续费(优惠前)
            echargePart:"",                              //每期手续费(优惠后)
            // 一次性支付
            epayAll:"",                                  //每期应还本金
            emoneyAll:"",                                 //一次性手续费
            paytype:"分期支付",
            stage:"12期",
            funduse:"家用电器消费",
            paytypeList:[
                '分期支付','一次性支付'
            ],
            stageList:[
                '3期','6期','12期','18期','24期','36期'
            ],
            funduseList:[],
            listDo:[],
            hascardName:"",       //持卡人姓名
            bankNum:"",           //借记卡卡号(0)
            bankName:"",          //借记卡卡名(1)
            userName:"",          //持卡人姓名(2)
            bankNo:"",            //行号
            bimgSrc:"",
            timgSrc:"",
            bigimgStr:"",         //大图路径
            tarimgStr:"",         //小图路径
            billdate:"",
            failmsg:"",              //错误信息
            failcode:"",              //错误标志
            imgshow_one:true,
            imgshow_two:false,
            loginFlag:"",
            uuid:"",
            khid:"",
            // copyright:"1.0.6"           // 分支
            copyright:"2.0.6"           // 主干
            // copyright:"3.0.1"           // uat
            // copyright:"3.6.2"           // 生产
        },
        sub:{ //提交所带额外参数
            identNum:"",             //身份证号
            planCode:"",
            planName:"",
            source:"",
            channel:"",
            onePay:"",
            accountDate:"",
            Bflag:"0"
        },
        menu:{ //弹出框
            laystatu:"",                 //蒙版
            creditstatu:"",              //信用卡列表
            debitstatu:"",               //借记卡列表
            applystatu:"",               //输入金额有误
            deletestatu:"",              //删除借记卡提示
            reminderstatu:"",            //温馨提示
            failstatu:"",                //申请失败页面
            imagestatu:""                //滑块验证码   
        },
        ui:{ // 控制模块显示/隐藏
            repaypart:true,              //分期支付
            repayall:"",                 //一次性支付
            discount:"",                 //是否优惠
            hascard:false,                  //有借记卡
            nocard:false,                   //无借记卡
            other:"",                    //是否跨行
            subShow:false,
            subClick:true
        }
    },
    public:{ //公共组件数据
        pdata:{
            identflag:true,
            identTxt:"获取验证码",
        },
        ui:{
            creditList:[],
            debitList:[],
            bankList:[]   
        },
        menu:{
            removeShow: "",
        }
    },
    add:{ //借记卡新增页数据
        ui:{
            add_cardNo:"",
            add_debitName:"",         //添加借记卡页面 借记卡名 
            add_debitNum:"",          //添加借记卡页面 借记卡Bin 
            isActive:""
        }
    },
    search:{ //借记卡搜索页数据
        ui:{
            searchResult:""
        }
    },
    login:{
        logui:{
            IndentNum:"",          //证件号码
            TelNum:"",             //电话号码
        },
        ldata:{
            identflag:true,
            identTxt:"获取验证码",
            indentMsg:"",
            phoneMsg:"",
            codeMsg:""
        }
    }
}
const getters = {
    // getBillMain: state => state.billMain.ui
}
const actions = {
    // 登录页
    assginid({commit,state},payload){      // 给证件号赋值 
        commit('ASSGINID',payload);
    },     
    assgintel({commit,state},payload){     // 给手机号赋值
        commit('ASSGINTEL',payload);
    },     
    dianjialert({commit,state},payload){     // 给手机号赋值
        commit('DIANJIALERT',payload);
    },     

    showcredit({commit,state},payload) {   // 1.信用卡列表显示
        commit('SHOWCREDIT',payload);
    },
    hidecredit({commit,state},payload) {   // 2.信用卡列表隐藏
        commit('HIDECREDIT',payload);
    },
    showdebit({commit,state},payload) {    // 3.借记卡列表显示
        commit('SHOWDEBIT',payload);
    },
    hidedebit({commit,state},payload) {    // 4.借记卡列表隐藏
        commit('HIDEDEBIT',payload);
    },
    showdelete({commit,state},payload){    // 5.删除借记卡出现
        commit('SHOWDELETE',payload);
    },
    showapply({commit,state},payload){     // 6.输入金额有误显示
        commit('SHOWAPPLY',payload);
    },
    hideapply({commit,state},payload){     // 7.输入金额有误隐藏
        commit('HIDEAPPLY',payload);  
    },
    showremind({commit,state},payload){    // 8.温馨提示显示
        commit('SHOWREMIND',payload);
    },
    hideremind({commit,state},payload){    // 9.温馨提示隐藏
        commit('HIDEREMIND',payload);
    },
    showtrash({commit,state},payload){     // 10.更换垃圾桶图标
        commit('SHOWTRASH',payload);
    },
    hidetrash({commit,state},payload){     // 10.更换垃圾桶图标
        commit('HIDETRASH',payload);
    },
    changestage({commit,state},payload){   // 11.更换期数
        commit('CHANGESTAGE',payload);
    },
    changepay({commit,state},payload){    //  12.更换支付方式
        commit('CHANGEPAY',payload);
    },
    changefunduse({commit,state},payload){    //  13.更换资金用途
        commit('CHANGEFUNDUSE',payload);
    },
    changenocheck({commit,state},payload){
        commit('CHANGENOCHECK',payload);
    },
    changeischeck({commit,state},payload){
        commit('CHANGEISCHECK',payload);
    },
    failconfirm({commit,state},payload){
        commit('FAILCONFIRM',payload);
    },

    canceldelete({commit,state},payload){  // 取消删除借记卡
        commit('CANCELDELETE',payload);
    },

    confirmdelete({commit,state},payload){ // 确定删除借记卡
        var deleteInfo  = {
            cardNo:state.home.sub.identNum,
            bankNO:payload.kaNum
        }
        var channel2 = "";
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            channel2 = "hxdapp";
        }else{
            channel2 = "normal";
        }
        api.deleteBank({data:deleteInfo,channel:channel2}).then((res)=>{
            if(res.isSuccess==true){
                commit('CONFIRMDELETE',payload); //删除成功
            }else if(res.isSuccess==false){
                saAlert("兴享贷首页","删除借记卡",res.msg,"报错提示");
                $(".main").addClass("bg-fixed");
                $.alert(res.msg,"提示",()=>{
                    $(".main").removeClass("bg-fixed");
                    commit('CONFIRMDELETEFAIL',payload); //删除失败
                });     
            }
        }).catch((err)=>{
            console.log(err);
            saAlert("兴享贷首页","删除借记卡",err,"请求失败");
            $(".main").addClass("bg-fixed");
            $.alert("请求超时，请稍后再试","提示",()=>{
                $(".main").removeClass("bg-fixed");
            });
        });
    },

    // 登录
    login({commit,state},payload){
        var loginInfo = {
            idNo:payload.idNo,
            idType:payload.idType,
            phone:payload.phone,
            smsValidateNo:payload.code,
            khid:payload.khid,
            type:"DFLG"
        }
        var channel2 = "";
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            channel2 = "hxdapp";
        }else{
            channel2 = "normal";
        }
        api.loginIn({data:loginInfo,channel:channel2}).then((res)=>{
            if(res.isSuccess==true){
                var obj = {
                    khid:payload.khid,
                    uuid:res.data.uuid
                }
                commit("LOGIN",obj);
                payload.router.push({path:'/Enjoyloan/HomePage'});
            }else if(res.isSuccess==false){
                saAlert("兴享贷登录页","兴享贷登录页进行登录",res.msg,"报错提示");
                $(".main").addClass("bg-fixed");
                $.alert(res.msg,"提示",()=>{
                    $(".main").removeClass("bg-fixed");
                });
            }
        }).catch((err)=>{
            console.log(err);
            saAlert("兴享贷登录页","兴享贷登录页进行登录",err,"请求失败");
            $(".main").addClass("bg-fixed");
            $.alert("请求超时,请稍后再试","提示",()=>{
                $(".main").removeClass("bg-fixed");
            });
        });
    },

    // 一、首页action
    setInitHome({commit,state},payload){      //首页初始化数据
        if(state.home.sub.Bflag=="1"){
            commit('CHANGEDATA',payload);
        }else if(state.home.sub.Bflag=="0"){
            if(state.home.hdata.loginFlag=="1"){
                var webInfo = {
                    uuid:state.home.hdata.uuid,
                    khid:state.home.hdata.khid
                }
                var channel2 = "";
                if(channel()=="hxdapp"&&hxdappIsSpecial()){
                    channel2 = "hxdapp";
                }else{
                    channel2 = "normal";
                }
                api.getWebIndex({data:webInfo,channel:channel2}).then((res)=>{
                    if(res.isSuccess==false){
                        saAlert("兴享贷首页","进入兴享贷首页",res.msg,"报错提示");
                        $(".main").addClass("bg-fixed");
                        $.alert(res.msg,"提示",()=>{
                            $(".main").removeClass("bg-fixed");
                        });
                    }else if(res.isSuccess==true){
                        if(res.data.code=="RL_000000"){
                            commit('SETINITHOME',res);
                        }else if(res.data.code=="RL_000001"){
                            payload.router.push({path:'/Enjoyloan/FailPage'});
                        }else if(res.data.code=="RL_100000"){
                            $(".main").addClass("bg-fixed");
                            $.alert(res.data.msg,'提示',()=>{
                                $(".main").removeClass("bg-fixed");
                            });
                        }else{
                            $(".main").addClass("bg-fixed");
                            $.alert("系统异常，请稍后再试","提示",()=>{
                                $(".main").removeClass("bg-fixed");
                            });
                        }
                    }
                }).catch((err)=>{
                    console.log(err);
                    saAlert("兴享贷首页","进入兴享贷首页",err,"请求失败");
                    $(".main").addClass("bg-fixed");
                    $.alert("请求超时，请稍后再试","提示",()=>{
                        $(".main").removeClass("bg-fixed");
                    });
                });
            }else{
                var wxInfo = {};
                var channel2 = "";
                if(channel()=="hxdapp"&&hxdappIsSpecial()){
                    channel2 = "hxdapp";
                }else{
                    channel2 = "normal";
                }
                api.getIndex({data:wxInfo,channel:channel2}).then((res)=>{
                    if(res.isSuccess==false){
                        saAlert("兴享贷首页","进入兴享贷首页",res.msg,"报错提示");
                        $(".main").addClass("bg-fixed");
                        $.alert(res.msg,"提示",()=>{
                            $(".main").removeClass("bg-fixed");
                        });
                    }else if(res.isSuccess==true){
                        if(res.data.code=="RL_000000"){
                            commit('SETINITHOME',res);
                        }else if(res.data.code=="RL_000001"){
                            payload.router.push({path:'/Enjoyloan/FailPage'});
                        }else if(res.data.code=="RL_100000"){
                            $(".main").addClass("bg-fixed");
                            $.alert(res.data.msg,'提示',()=>{
                                $(".main").removeClass("bg-fixed");
                            });
                        }else{
                            $(".main").addClass("bg-fixed");
                            $.alert("系统异常，请稍后再试","提示",()=>{
                                $(".main").removeClass("bg-fixed");
                            });
                        }
                    }
                }).catch((err)=>{
                    console.log(err);
                    saAlert("兴享贷首页","进入兴享贷首页",err,"请求失败");
                    $(".main").addClass("bg-fixed");
                    $.alert("请求超时，请稍后再试","提示",()=>{
                        $(".main").removeClass("bg-fixed");
                    });
                });
            }
            
        }
    },

    changeaccount({commit,state},payload){ //重新获取账单日
        var accountInfo = {
            realCardNo:payload.realCardNo,
            fakeCardNo:payload.fakeCardNo,
            idNo:state.home.sub.identNum
        }
        var channel2 = "";
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            channel2 = "hxdapp";
        }else{
            channel2 = "normal";
        }
        api.changeAccountData({data:accountInfo,channel:channel2}).then((res)=>{
            if(res.isSuccess==false){
                saAlert("兴享贷首页","切换信用卡",res.msg,"报错提示");
                $(".main").addClass("bg-fixed");
                $.alert(res.msg,"提示",()=>{
                    $(".main").removeClass("bg-fixed");
                });
            }else if(res.isSuccess==true){
                if(res.data.code=="RL_000000"){
                    commit('CHANGEACCOUNT',res);
                }else if(res.data.code=="RL_000001"){
                    payload.router.push({path:'/Enjoyloan/FailPage'});
                }else{
                    $(".main").addClass("bg-fixed");
                    $.alert("系统异常，请稍后再试","提示",()=>{
                        $(".main").removeClass("bg-fixed");
                    });
                }
            }
        }).catch((err)=>{
            console.log(err);
            saAlert("兴享贷首页","切换信用卡",err,"请求失败");
            $(".main").addClass("bg-fixed");
            $.alert("请求超时，请稍后再试","提示",()=>{
                $(".main").removeClass("bg-fixed");
            });
        });
    },

    changeapply({commit,state},payload){ // 申请金额改变
        var period = "";
        var payType = "";
        var planCode = "";
        var planName = "";
        var rate = "";
        if(payload.stage=="3期"){
            period = "3";
        }else if(payload.stage=="6期"){
            period = "6";
        }else if(payload.stage=="12期"){
            period = "12";
        }else if(payload.stage=="18期"){
            period = "18";
        }else if(payload.stage=="24期"){
            period = "24";
        }else if(payload.stage=="36期"){
            period = "36";
        }
        if(payload.paytype=="一次性支付"){
            payType = "01";
        }else if(payload.paytype=="分期支付"){
            payType = "02";
        }
        for(var i=0;i<state.home.hdata.listDo.length;i++){
            if(period==state.home.hdata.listDo[i].period && payType == state.home.hdata.listDo[i].pay_type){
                planCode = state.home.hdata.listDo[i].plan_code;
                planName = state.home.hdata.listDo[i].plan_name;
                rate = state.home.hdata.listDo[i].rate;
                break;
            }
        }
        var applyInfo = {
            realCardNo:payload.creditcardNum.realCardNo,
            fakeCardNo:payload.creditcardNum.fakeCardNo,
            applyAmt:payload.applyNum,
            period:period,
            planCode:planCode,
            payType:payType,
            rate:rate
        }
        var obj = {
            planCode:planCode,
            planName:planName,
            rate:rate,
            stage:payload.stage,
            paytype:payload.paytype
        }
        var channel2 = "";
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            channel2 = "hxdapp";
        }else{
            channel2 = "normal";
        }
        api.changeMoney({data:applyInfo,channel:channel2}).then((res)=>{
            if(res.isSuccess==true){
                var newobj = Object.assign(res.data,obj);
                commit('CHANGEAPPLY',newobj);
            }else if(res.isSuccess==false){
                saAlert("兴享贷首页","更改输入金额",res.msg,"报错提示");
                $(".main").addClass("bg-fixed");
                $.alert(res.msg,"提示",()=>{
                    $(".main").removeClass("bg-fixed");
                });
            }
        }).catch((err)=>{
            console.log(err);
            saAlert("兴享贷首页","更改输入金额",err,"请求失败");
            $(".main").addClass("bg-fixed");
            $.alert("请求超时，请稍后再试","提示",()=>{
                $(".main").removeClass("bg-fixed");
            });
        });
    }, 

    // 二、借记卡新增页action
    updatedebitname({commit,state},payload){ //根据卡号查询银行名称
        var bankdata = {
            bankNO:payload.cardNum
        }
        var channel2 = "";
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            channel2 = "hxdapp";
        }else{
            channel2 = "normal";
        }
        api.getCardBank({data:bankdata,channel:channel2}).then((res)=>{
            if(res.isSuccess==true){
                commit('UPDATEDEBITNAME',res.data);
            }else if(res.isSuccess==false){
                saAlert("借记卡添加页面","输入银行卡号",res.msg,"报错提示");
                $(".main").addClass("bg-fixed");
                $.alert(res.msg,"提示",()=>{
                    $(".main").removeClass("bg-fixed");
                });
            }
        }).catch((err)=>{
            console.log(err);
            saAlert("借记卡添加页面","输入银行卡号",err,"请求失败");
            $(".main").addClass("bg-fixed");
            $.alert("请求超时，请稍后再试","提示",()=>{
                $(".main").removeClass("bg-fixed");
            });
        });
    },

    showbankname({commit,state},payload){ //选择好银行并显示
        commit('SHOWBANKNAME',payload);
    },

    addbcard({commit,state},payload){   //新增借记卡
        var addInfo = {
            bankNO:payload.add_cardNo,
            cardNo:state.home.sub.identNum,
            userName:payload.hascardName,
            bankBin:state.add.ui.add_debitNum
        }
        var channel2 = "";
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            channel2 = "hxdapp";
        }else{
            channel2 = "normal";
        }
        api.addBankCard({data:addInfo,channel:channel2}).then((res)=>{
            if(res.isSuccess==true){
                commit('ADDBCARD',addInfo);
                payload.router.push({path:'/Enjoyloan/HomePage'});
            }else if(res.isSuccess==false){
                saAlert("借记卡添加页面","新增借记卡",res.msg,"报错提示");
                if(res.msg.length<4){
                    $(".main").addClass("bg-fixed");
                    $.alert("第三方存管账户不允许添加","提示",()=>{
                        $(".main").removeClass("bg-fixed");
                    });
                }else if(res.msg.length>=4){
                    $(".main").addClass("bg-fixed");
                    $.alert(res.msg,"提示",()=>{
                        $(".main").removeClass("bg-fixed");
                    });
                }
            }
        }).catch((err)=>{
            console.log(err);
            saAlert("借记卡添加页面","新增借记卡",err,"请求失败");
            $(".main").addClass("bg-fixed");
            $.alert("请求超时，请稍后再试","提示",()=>{
                $(".main").removeClass("bg-fixed");
            });
        });
    },

    initaddpage({commit,state},payload){ //更新页面显示卡号后 是否隐藏跨行转账
        commit('INITADDPAGE',payload);
    },
    // 三、搜索页action
    searchbank({commit,state},payload){ // 银行选择页初始化数据
        var searchInfo = {
            bankName:payload.searchResult
        }
        var channel2 = "";
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            channel2 = "hxdapp";
        }else{
            channel2 = "normal";
        }
        api.getBankList({data:searchInfo,channel:channel2}).then((res)=>{
            if(res.isSuccess==true){
                var obj = {"data":res.data,"result":payload.searchResult};
                commit('SEARCHBANK',obj);
            }else if(res.isSuccess==false){
                saAlert("借记卡搜索页面","输入搜索的关键字",res.msg,"报错提示");
                $(".main").addClass("bg-fixed");
                $.alert(res.msg,"提示",()=>{
                    $(".main").removeClass("bg-fixed");
                });
            }
        }).catch((err)=>{
            console.log(err);
            saAlert("借记卡搜索页面","输入搜索的关键字",err,"请求失败");
            $(".main").addClass("bg-fixed");
            $.alert("请求超时，请稍后再试","提示",()=>{
                $(".main").removeClass("bg-fixed");
            });
        });
    },

    // 四、短信验证码
    getcardcode({commit,state},payload){ //获取短信验证码
        var identInfo = {
            realCardNo:payload.hdata.creditcardNum.realCardNo,
            fakeCardNo:payload.hdata.creditcardNum.fakeCardNo,
            type:"DEFQ"
        }
        var sendlen = "";
        var channel2 = "";
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            channel2 = "hxdapp";
        }else{
            channel2 = "normal";
        }
        api.getIdent({data:identInfo,channel:channel2}).then((res)=>{
            if(res.isSuccess==true){
                if(res.code=="firstSend"){
                    sendlen = "0";
                    var imgInfo = {
                        realCardNo:payload.hdata.creditcardNum.realCardNo,
                        fakeCardNo:payload.hdata.creditcardNum.fakeCardNo,
                        type:"DEFQ",
                        captchaCode:sendlen
                    }
                    var channel2 = "";
                    if(channel()=="hxdapp"&&hxdappIsSpecial()){
                        channel2 = "hxdapp";
                    }else{
                        channel2 = "normal";
                    }
                    api.getImgCode({data:imgInfo,channel:channel2}).then((res)=>{
                        if(res.isSuccess==true){
                            if(res.smsCode=="" || res.smsCode==undefined){
                                $(".main").addClass("bg-fixed");
                                $.alert("发送成功","提示",()=>{
                                    $(".main").removeClass("bg-fixed");
                                    $("#identCode").focus();
                                });
                            }else{
                                $(".main").addClass("bg-fixed");
                                $.alert("短信验证码:"+res.smsCode,"提示",()=>{
                                    $(".main").removeClass("bg-fixed");
                                    $("#identCode").focus();
                                });
                            }
                            commit('FIRSTSEND',payload);
                        }else if(res.isSuccess==false){
                            saAlert("兴享贷首页","第一次直接获取短信验证码",res.msg,"报错提示");
                            $(".main").addClass("bg-fixed");
                            $.alert(res.msg,"提示",()=>{
                                $(".main").removeClass("bg-fixed");
                            });
                        }
                    }).catch((err)=>{
                        console.log(err);
                        saAlert("兴享贷首页","第一次直接获取短信验证码",err,"请求失败");
                        $(".main").addClass("bg-fixed");
                        $.alert("请求超时，请稍后再试","提示",()=>{
                            $(".main").removeClass("bg-fixed");
                        });
                    })
                }else{
                    commit('GETCARDCODE',res);
                }
                
            }else if(res.isSuccess==false){
                saAlert("兴享贷首页","获取滑块验证码",res.msg,"报错提示");
                $(".main").addClass("bg-fixed");
                $.alert(res.msg,"提示",()=>{
                    $(".main").removeClass("bg-fixed");
                });
            }
        }).catch((err)=>{
            console.log(err);
            saAlert("兴享贷首页","获取滑块验证码",err,"请求失败");
            $(".main").addClass("bg-fixed");
            $.alert("请求超时，请稍后再试","提示",()=>{
                $(".main").removeClass("bg-fixed");
            });
        })
    },

    // 登录页
    getphonecode({commit,state},payload){ //获取短信验证码
        var phoneInfo = {
            phoneNum:payload.logui.TelNum,
            type:"DFLG"
        }
        var sendlen = "";
        var channel2 = "";
        if(channel()=="hxdapp" && hxdappIsSpecial()){
            channel2 = "hxdapp";
        }else{
            channel2 = "normal";
        }
        api.loginIdentCode({data:phoneInfo,channel:channel2}).then((res)=>{
            if(res.isSuccess==true){
                if(res.code=="firstSend"){
                    sendlen = "0";
                    var phoneimgInfo = {
                        phoneNum:payload.logui.TelNum,
                        type:"DFLG",
                        captchaCode:sendlen
                    }
                    var channel2 = "";
                    if(channel()=="hxdapp"&&hxdappIsSpecial()){
                        channel2 = "hxdapp";
                    }else{
                        channel2 = "normal";
                    }
                    api.loginImgCode({data:phoneimgInfo,channel:channel2}).then((res)=>{
                        if(res.isSuccess==true){
                            if(res.smsCode=="" || res.smsCode==undefined){
                                $(".main").addClass("bg-fixed");
                                $.alert("发送成功","提示",()=>{
                                    $(".main").removeClass("bg-fixed");
                                    $("#identCode").focus();
                                });
                            }else{
                                $(".main").addClass("bg-fixed");
                                $.alert("短信验证码:"+res.smsCode,"提示",()=>{
                                    $(".main").removeClass("bg-fixed");
                                    $("#identCode").focus();
                                });
                            }
                            commit('PHONEFIRSTSEND',payload);
                        }else if(res.isSuccess==false){
                            saAlert("兴享贷登录页","第一次直接获取短信验证码",res.msg,"报错提示");
                            $(".main").addClass("bg-fixed");
                            $.alert(res.msg,"提示",()=>{
                                $(".main").removeClass("bg-fixed");
                            });
                        }
                    }).catch((err)=>{
                        console.log(err);
                        saAlert("兴享贷登录页","第一次直接获取短信验证码",err,"请求失败");
                        $(".main").addClass("bg-fixed");
                        $.alert("请求超时,请稍后再试","提示",()=>{
                            $(".main").removeClass("bg-fixed");
                        });
                    })
                }else{
                    commit('GETPHONECODE',res);
                }
                
            }else if(res.isSuccess==false){
                saAlert("兴享贷登录页","获取滑块验证码",res.msg,"报错提示");
                $(".main").addClass("bg-fixed");
                $.alert(res.msg,"提示",()=>{
                    $(".main").removeClass("bg-fixed");
                });
            }
        }).catch((err)=>{
            console.log(err);
            saAlert("兴享贷登录页","获取滑块验证码",err,"请求失败");
            $(".main").addClass("bg-fixed");
            $.alert("请求超时,请稍后再试","提示",()=>{
                $(".main").removeClass("bg-fixed");
            });
        })
    },

    sendmovelen({commit,state},payload){
        var imgInfo = {
            realCardNo:payload.hdata.creditcardNum.realCardNo,
            fakeCardNo:payload.hdata.creditcardNum.fakeCardNo,
            type:"DEFQ",
            captchaCode:payload.sendlen
        }
        var channel2 = "";
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            channel2 = "hxdapp";
        }else{
            channel2 = "normal";
        }
        api.getImgCode({data:imgInfo,channel:channel2}).then((res)=>{
            if(res.isSuccess==true){
                if(res.smsCode==""){
                    $(".main").addClass("bg-fixed");
                    $.alert("发送成功","提示",()=>{
                        $(".main").removeClass("bg-fixed");
                        $("#identCode").focus();
                    });
                }else{
                    $(".main").addClass("bg-fixed");
                    $.alert("短信验证码:"+res.smsCode,"提示",()=>{
                        $(".main").removeClass("bg-fixed");
                        $("#identCode").focus();
                    });
                }
                commit('SENDMOVELEN',payload);         
            }else if(res.isSuccess==false){
                saAlert("兴享贷首页","滑动滑块验证码",res.msg,"报错提示");
                if(res.fal=="pinfan"){
                    $(".main").addClass("bg-fixed");
                    $.alert(res.msg,"提示",()=>{
                        $(".main").removeClass("bg-fixed");
                    });
                    commit("SENDPINFAN",payload);
                }else{
                    $(".main").addClass("bg-fixed");
                    $.alert(res.msg,"提示",()=>{
                        $(".main").removeClass("bg-fixed");
                    });
                    var identInfo_two = {
                        realCardNo:payload.hdata.creditcardNum.realCardNo,
                        fakeCardNo:payload.hdata.creditcardNum.fakeCardNo,
                        type:"DEFQ"
                    }
                    var channel2 = "";
                    if(channel()=="hxdapp"&&hxdappIsSpecial()){
                        channel2 = "hxdapp";
                    }else{
                        channel2 = "normal";
                    }
                    api.getIdent({data:identInfo_two,channel:channel2}).then((res)=>{
                        if(res.isSuccess==true){
                            commit('CHANGEIMG',res);
                        }else if(res.isSuccess==false){
                            saAlert("兴享贷首页","重复滑动滑块验证码",res.msg,"报错提示");
                            if(res.flag=="error"){
                                $(".main").addClass("bg-fixed");
                                $.alert("滑块校验失败，请60s后重试","提示",()=>{
                                    $(".main").removeClass("bg-fixed");
                                });
                                commit('MORETIME',payload); 
                            }else{
                                $(".main").addClass("bg-fixed");
                                $.alert(res.msg,"提示",()=>{
                                    $(".main").removeClass("bg-fixed");
                                });
                            }
                        }
                    }).catch((err)=>{
                        console.log(err);
                        saAlert("兴享贷首页","重复滑动滑块验证码",err,"请求失败");
                        $(".main").addClass("bg-fixed");
                        $.alert("请求超时，请稍后再试","提示",()=>{
                            $(".main").removeClass("bg-fixed");
                        });
                    });
                }
            }
        }).catch((err)=>{
            console.log(err);
            saAlert("兴享贷首页","滑动滑块验证码",err,"请求失败");
            $(".main").addClass("bg-fixed");
            $.alert("请求超时，请稍后再试","提示",()=>{
                $(".main").removeClass("bg-fixed");
            });
        });
    },

    // 登录页
    sendphonelen({commit,state},payload){
        var imgInfo2 = {
            phoneNum:payload.logui.TelNum,
            type:"DFLG",
            captchaCode:payload.sendlen
        }
        var channel2 = "";
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            channel2 = "hxdapp";
        }else{
            channel2 = "normal";
        }
        api.loginImgCode({data:imgInfo2,channel:channel2}).then((res)=>{
            if(res.isSuccess==true){
                if(res.smsCode==""){
                    $(".main").addClass("bg-fixed");
                    $.alert("发送成功","提示",()=>{
                        $(".main").removeClass("bg-fixed");
                        $("#identCode").focus();
                    });
                }else{
                    $(".main").addClass("bg-fixed");
                    $.alert("短信验证码:"+res.smsCode,"提示",()=>{
                        $(".main").removeClass("bg-fixed");
                        $("#identCode").focus();
                    });
                }
                commit('SENDPHONEMOVELEN',payload);         
            }else if(res.isSuccess==false){
                saAlert("兴享贷登录页","滑动滑块验证码",res.msg,"报错提示");
                if(res.fal=="pinfan"){
                    $(".main").addClass("bg-fixed");
                    $.alert(res.msg,"提示",()=>{
                        $(".main").removeClass("bg-fixed");
                    });
                    commit("SENDPINFAN",payload);
                }else{
                    $(".main").addClass("bg-fixed");
                    $.alert(res.msg,"提示",()=>{
                        $(".main").removeClass("bg-fixed");
                    });
                    var identInfo_four = {
                        phoneNum:payload.logui.TelNum,
                        type:"DFLG"
                    }
                    var channel2 = "";
                    if(channel()=="hxdapp"&&hxdappIsSpecial()){
                        channel2 = "hxdapp";
                    }else{
                        channel2 = "normal";
                    }
                    api.loginIdentCode({data:identInfo_four,channel:channel2}).then((res)=>{
                        if(res.isSuccess==true){
                            commit('CHANGEPHONEIMG',res);
                        }else if(res.isSuccess==false){
                            saAlert("兴享贷登录页","重复滑动滑块验证码",res.msg,"报错提示");
                            if(res.flag=="error"){
                                $(".main").addClass("bg-fixed");
                                $.alert("滑块校验失败，请60s后重试","提示",()=>{
                                    $(".main").removeClass("bg-fixed");
                                });
                                commit('PHONEMORETIME',payload); 
                            }else{
                                $(".main").addClass("bg-fixed");
                                $.alert(res.msg,"提示",()=>{
                                    $(".main").removeClass("bg-fixed");
                                });
                            }
                        }
                    }).catch((err)=>{
                        console.log(err);
                        saAlert("兴享贷登录页","重复滑动滑块验证码",err,"请求失败");
                        $(".main").addClass("bg-fixed");
                        $.alert("请求超时,请稍后再试","提示",()=>{
                            $(".main").removeClass("bg-fixed");
                        });
                    });
                }
            }
        }).catch((err)=>{
            console.log(err);
            saAlert("兴享贷登录页","滑动滑块验证码",err,"请求失败");
            $(".main").addClass("bg-fixed");
            $.alert("请求超时,请稍后再试","提示",()=>{
                $(".main").removeClass("bg-fixed");
            });
        });
    },

    changepic({commit,state},payload){ //点击刷新
        var identInfo_three = {
            realCardNo:payload.hdata.creditcardNum.realCardNo,
            fakeCardNo:payload.hdata.creditcardNum.fakeCardNo,
            type:"DEFQ"
        }
        var channel2 = "";
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            channel2 = "hxdapp";
        }else{
            channel2 = "normal";
        }
        api.getIdent({data:identInfo_three,channel:channel2}).then((res)=>{
            if(res.isSuccess==true){
                commit('CHANGEIMG',res);
            }else if(res.isSuccess==false){
                saAlert("兴享贷首页","刷新按钮点击",res.msg,"报错提示");
                if(res.flag=="error"){
                    $(".main").addClass("bg-fixed");
                    $.alert("滑块校验失败，请60s后重试","提示",()=>{
                        $(".main").removeClass("bg-fixed");
                    });
                    commit('MORETIME',payload); 
                }else{
                    $(".main").addClass("bg-fixed");
                    $.alert(res.msg,"提示",()=>{
                        $(".main").removeClass("bg-fixed");
                    });
                }
            }
        }).catch((err)=>{
            console.log(err);
            saAlert("兴享贷首页","刷新按钮点击",err,"请求失败");
            $(".main").addClass("bg-fixed");
            $.alert("请求超时，请稍后再试","提示",()=>{
                $(".main").removeClass("bg-fixed");
            });
        });
    },

    // 登录
    changephone({commit,state},payload){
        var identInfo_five = {
            phoneNum:payload.logui.TelNum,
            type:"DFLG"
        }
        var channel2 = "";
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            channel2 = "hxdapp";
        }else{
            channel2 = "normal";
        }
        api.loginIdentCode({data:identInfo_five,channel:channel2}).then((res)=>{
            if(res.isSuccess==true){
                commit('CHANGEPHONEIMG',res);
            }else if(res.isSuccess==false){
                saAlert("兴享贷登录页","刷新按钮点击",res.msg,"报错提示");
                if(res.flag=="error"){
                    $(".main").addClass("bg-fixed");
                    $.alert("滑块校验失败，请60s后重试","提示",()=>{
                        $(".main").removeClass("bg-fixed");
                    });
                    commit('PHONEMORETIME',payload); 
                }else{
                    $(".main").addClass("bg-fixed");
                    $.alert(res.msg,"提示",()=>{
                        $(".main").removeClass("bg-fixed");
                    });
                }
            }
        }).catch((err)=>{
            console.log(err);
            saAlert("兴享贷登录页","刷新按钮点击",err,"请求失败");
            $(".main").addClass("bg-fixed");
            $.alert("请求超时,请稍后再试","提示",()=>{
                $(".main").removeClass("bg-fixed");
            });
        });
    },

    // 五、最终提交页
    submitdata({commit,state},payload){
        var period = "";
        var payType = "";
        var planCode = "";
        var planName = "";
        var isLocal = "";
        if(state.home.hdata.bankName=="兴业银行"){
            isLocal = "0";
        }else{
            isLocal = "1";
        }
        if(payload.stage=="3期"){
            period = "3";
        }else if(payload.stage=="6期"){
            period = "6";
        }else if(payload.stage=="12期"){
            period = "12";
        }else if(payload.stage=="18期"){
            period = "18";
        }else if(payload.stage=="24期"){
            period = "24";
        }else if(payload.stage=="36期"){
            period = "36";
        }
        if(payload.paytype=="一次性支付"){
            payType = "01";
        }else if(payload.paytype=="分期支付"){
            payType = "02";
        }
        for(var i=0;i<state.home.hdata.listDo.length;i++){
            if(period==state.home.hdata.listDo[i].period && payType == state.home.hdata.listDo[i].pay_type){
                planCode = state.home.hdata.listDo[i].plan_code;
                planName = state.home.hdata.listDo[i].plan_name;
                break;
            }
        }
        var userAgent = navigator.userAgent;
        if(userAgent.indexOf("cibbank") != -1){
            state.home.sub.source = "AP";
        }
        var submitInfo = {
            type:"DEFQ",
            idNo:state.home.sub.identNum,               //身份证号
            usePurpose:payload.funduse,                 //资金用途
            realCardNo:payload.creditcardNum.realCardNo,//加密真实卡号
            fakeCardNo:payload.creditcardNum.fakeCardNo,//掩码卡号
            smsCode:payload.identcode,                  //短信验证码
            isLocal:isLocal,                            //是否本行
            applyAmt:payload.applyNum,                  //申请金额
            planName:planName,
            planCode:planCode,
            source:state.home.sub.source,               //交易来源
            channel:state.home.sub.channel,             //子渠道(允许为空)
            period:period,                              //分期期数
            payType:payType,                            //支付方式
            cardNoC:state.home.hdata.bankNum,           //借记卡卡号
            nameC:state.home.hdata.hascardName,         //持卡人姓名
            bankName:state.home.hdata.bankName,         //借记卡所属银行名
            bankC:state.home.hdata.bankNo               //借记卡行号
        }
        var channel2 = "";
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            channel2 = "hxdapp";
        }else{
            channel2 = "normal";
        }
        if(state.home.hdata.countdown==true){
            commit('BCHANGETIMESTATUS',true);
        }
        api.submitData({data:submitInfo,channel:channel2}).then((res)=>{
            commit('BCHANGETIMESTATUS',false);
            state.home.ui.subClick = true;
            if(res.isSuccess==true){
                var zhanghuInfo = {
                    payType:payType, 
                    applyDate:res.applyDate
                }
                commit('SUBMITDATA',zhanghuInfo);
                payload.router.push({path:'/Enjoyloan/SuccessPage'});
            }else if(res.isSuccess==false){
                if(res.code=="RL_000001"){
                    payload.router.push({path:'/Enjoyloan/FailPage'});
                }
                state.home.ui.subShow = true;
                var failInfo = {
                    msg:res.msg,
                    code:res.code
                }
                commit('GETFAILINFO',failInfo);
                saAlert("兴享贷首页","首页点击提交按钮",res.msg,"报错提示");
            }
        }).catch((err)=>{
            console.log(err);
            saAlert("兴享贷首页","首页点击提交按钮",err,"请求失败");
            commit('BCHANGETIMESTATUS',false);
            $(".main").addClass("bg-fixed");
            $.alert("请求超时，请稍后再试","提示",()=>{
                $(".main").removeClass("bg-fixed");
            });
        })
    },
}
const mutations = {
    // 登录页
    ASSGINID(state,payload){      // 证件号赋值
        state.login.logui.IndentNum = payload.IdNum;
    },
    ASSGINTEL(state,payload){     // 手机号赋值
        state.login.logui.TelNum = payload.PhoneNum;
    },

    DIANJIALERT(state,payload){
        state.home.menu.laystatu = false;    
        state.alert.adata.alertShow = false;
    },

    SHOWCREDIT(state,payload){    // 1.信用卡列表显示
        state.home.menu.laystatu = true;
        state.home.menu.creditstatu = true;
    },
    HIDECREDIT(state,payload){    // 2.信用卡列表隐藏
        state.home.menu.laystatu = false;
        state.home.menu.creditstatu = false;
    },
    SHOWDEBIT(state,payload){     // 3.借记卡列表显示
        state.home.menu.laystatu = true;
        state.home.menu.debitstatu = true;
    },
    HIDEDEBIT(state,payload){     // 4.借记卡列表隐藏
        state.home.menu.laystatu = false;
        state.home.menu.debitstatu = false;
        state.public.menu.removeShow = false;
        state.add.ui.add_cardNo = "";
        state.add.ui.add_debitName = "";
    },
    SHOWDELETE(state,payload){    // 5.删除借记卡出现
        state.home.menu.laystatu = true;
        state.home.menu.deletestatu = true;
    },
    SHOWAPPLY(state,payload){     // 6.超过指定金额显示
        state.home.menu.laystatu = true;
        state.home.menu.applystatu = true;
    },
    HIDEAPPLY(state,payload){     // 7.超过指定金额隐藏
        state.home.menu.laystatu = false;
        state.home.menu.applystatu = false;
    },
    SHOWREMIND(state,payload){    // 8.温馨提示显示
        state.home.menu.laystatu = true;
        state.home.menu.reminderstatu = true;
    },
    HIDEREMIND(state,payload){    // 9.温馨提示隐藏
        state.home.menu.laystatu = false;
        state.home.menu.reminderstatu = false;
    },
    SHOWTRASH(state,payload){     // 10.显示垃圾桶图标
        state.public.menu.removeShow = true;
    },
    HIDETRASH(state,payload){     // 10.隐藏垃圾桶图标
        state.public.menu.removeShow = false;
    },
    CHANGESTAGE(state,payload){   // 11.更换期数
        state.home.hdata.stage = payload.stagevalue;
    },
    CHANGEPAY(state,payload){   // 12.更换支付方式
        state.home.hdata.paytype = payload.payvalue;
    },
    CHANGEFUNDUSE(state,payload){   // 13.更换资金用途
        state.home.hdata.funduse = payload.fundusevalue;
    },
    CHANGENOCHECK(state,payload){
        state.home.hdata.imgshow_one = false;
        state.home.hdata.imgshow_two = true;
    },
    CHANGEISCHECK(state,payload){
        state.home.hdata.imgshow_one = true;
        state.home.hdata.imgshow_two = false;
    },
    FAILCONFIRM(state,payload){
        state.home.menu.laystatu = false;
        state.home.menu.failstatu = false;
    },
    CANCELDELETE(state,payload){  // 取消删除借记卡
        state.home.menu.deletestatu = false;
    },
    CONFIRMDELETE(state,payload){ // 确定删除借记卡 (成功)
        state.home.menu.deletestatu = false;
        var arr = state.public.ui.debitList;
        var newarr = [];
        for(var i=0;i<arr.length;i++){
            if(i!=payload.num){
                newarr.push(arr[i]);
            }
        }
        state.public.ui.debitList = newarr;
        if(newarr.length!=0){
            state.home.ui.hascard = true;
            state.home.ui.nocard = false;
            if(newarr[0][1]=="兴业银行"){
                state.home.hdata.bankNum = newarr[0][0];
                state.home.hdata.bankName = newarr[0][1];
                state.home.ui.other = false;
            }else if(newarr[0][1]!="兴业银行"){
                state.home.hdata.bankNum = newarr[0][0];
                state.home.hdata.bankName = newarr[0][1];
                state.home.ui.other = true;
            }
        }else if(newarr==null || newarr.length==0){
            state.home.ui.other = false;
            state.home.ui.hascard = false;
            state.home.ui.nocard = true;
        }
    },

    CONFIRMDELETEFAIL(state,payload){ // 确定删除借记卡(失败)
        state.home.menu.deletestatu = false;
        state.home.menu.laystatu = false;
        state.home.menu.debitstatu = false;
    },
    
    LOGIN(state,res){ 
        state.home.hdata.khid = res.khid;
        state.home.hdata.uuid = res.uuid;
        state.home.hdata.loginFlag = "1"; //走不授权
    },

    // 一、首页mulation
    SETINITHOME(state,res){   //初始化首页数据
        state.home.hdata.countdown = res.countdown;                                // 倒计时标识
        state.home.hdata.billdate = res.data.billdate;                             // 账单日
        state.home.hdata.hascardName = res.data.nameString;                        // 持卡人姓名
        state.home.sub.source = res.source;                                        // 交易来源
        state.home.sub.channel = res.channel;                                      // 子渠道
        state.home.sub.identNum = res.data.cretNo;                                 // 身份证号
        state.home.hdata.creditcardNum = _.cloneDeep(res.data.creditcardList[0]);  // 信用卡号
        state.public.ui.creditList = res.data.creditcardList;                      // 信用卡列表
        state.public.ui.debitList = _.cloneDeep(res.data.debitcardList);           // 借记卡列表
        state.home.hdata.maxNum = res.data.applyLimit;                             // 最高可借
        state.home.hdata.applyNum = res.data.applyLimit;                           // 申请金额
        state.home.hdata.listDo = res.data.listDo;                                 // 根据支付方式、期数获取plancode
        state.home.ui.discount = res.data.discount;                                // 是否优惠
        state.home.hdata.disepayPart = res.data.discountAmt;                       //每期应还(优惠前)
        state.home.hdata.disemoneyPart = res.data.discountMoney;                   //每期本金(优惠前)
        state.home.hdata.disechargePart = res.data.discountCharge;                 //每期手续费(优惠前)
        state.home.hdata.epayPart = res.data.instalAmt;                            // 每期应还金额
        state.home.hdata.emoneyPart = res.data.eachMoney;                          // 每期本金
        state.home.hdata.echargePart = res.data.eachCharge;                        // 每期手续费
        state.home.hdata.funduseList = res.data.usageListStrings;                  // 资金用途 
        if(res.data.discount==true){
            state.home.ui.showshort = true;
            state.home.ui.showlong = false;
        }else if(res.data.discount==false){
            state.home.ui.showshort = false;
            state.home.ui.showlong = true;
        }
        if(res.data.debitcardList.length!=0){
            if(res.data.debitcardList[0][1]=="兴业银行"){
                state.home.ui.other = false;
                state.home.ui.hascard = true;
                state.home.ui.nocard = false;
                state.home.hdata.bankNum = _.cloneDeep(res.data.debitcardList[0][0]);
                state.home.hdata.bankName = _.cloneDeep(res.data.debitcardList[0][1]);
                state.home.hdata.bankNo = _.cloneDeep(res.data.debitcardList[0][3]);
            }else{
                state.home.ui.other = true;
                state.home.ui.hascard = true;
                state.home.ui.nocard = false;
                state.home.hdata.bankNum = _.cloneDeep(res.data.debitcardList[0][0]);
                state.home.hdata.bankName = _.cloneDeep(res.data.debitcardList[0][1]);
                state.home.hdata.bankNo = _.cloneDeep(res.data.debitcardList[0][3]);
            }
        }else if(res.data.debitcardList==null || res.data.debitcardList.length==0){
            state.home.ui.other = false;
            state.home.ui.hascard = false;
            state.home.ui.nocard = true;
        }
    },

    CHANGEDATA(state,payload){
        state.home.sub.Bflag = "0";
    },

    CHANGEACCOUNT(state,res){  // 账单改变
        state.home.hdata.billdate = res.data.billdate;                             // 账单日
        state.home.hdata.maxNum = res.data.applyLimit;                             // 最高可借
        state.home.hdata.applyNum = res.data.applyLimit;                           // 申请金额
        state.home.ui.discount = res.data.discount;                                // 是否优惠
        state.home.hdata.disepayPart = res.data.discountAmt;                       //每期应还(优惠前)
        state.home.hdata.disemoneyPart = res.data.discountMoney;                   //每期本金(优惠前)
        state.home.hdata.disechargePart = res.data.discountCharge;                 //每期手续费(优惠前)
        state.home.hdata.epayPart = res.data.instalAmt;                            // 每期应还金额
        state.home.hdata.emoneyPart = res.data.eachMoney;                          // 每期本金
        state.home.hdata.echargePart = res.data.eachCharge;                        // 每期手续费
        if(state.home.hdata.paytype!="分期支付"){
            state.home.hdata.paytype = "分期支付";
            $("#paytype").data().picker.value = ["分期支付"];
        }
        if(state.home.hdata.stage!="12期"){
            state.home.hdata.stage = "12期";
            $("#stage").data().picker.value = ["12期"];
        }
        if(state.home.hdata.funduse!="家用电器消费"){
            state.home.hdata.funduse = "家用电器消费";
            $("#funduse").data().picker.value = ["家用电器消费"];
        }
        state.home.ui.repaypart = true;
        state.home.ui.repayall = false;
    },
    
    CHANGEAPPLY(state,res){   //申请金额改变
        state.home.ui.discount = res.discount;               //是否优惠
        // 分期支付
        state.home.hdata.disepayPart = res.discountAmt;         //每期应还(优惠前)
        state.home.hdata.epayPart = res.instalAmt;               //每期应还(优惠后)
        state.home.hdata.disemoneyPart = res.discountMoney;     //每期本金(优惠前)
        state.home.hdata.emoneyPart = res.eachMoney;            //每期本金(优惠后) 
        state.home.hdata.disechargePart = res.discountCharge;   //每期手续费(优惠前)
        state.home.hdata.echargePart = res.eachCharge;          //每期手续费(优惠后)
        // 一次性支付
        state.home.hdata.epayAll = res.oneAmt;                  //一次性应还
        state.home.hdata.disemoneyAll = res.discountOneCharge;  //一次性手续费(优惠前)      
        state.home.hdata.emoneyAll = res.oneCharge;             //一次性手续费(优惠后)
        state.home.sub.onePay = res.onePay;                     // 账户应还金额
        state.home.hdata.paytype = res.paytype;                 // 支付方式
        state.home.hdata.stage = res.stage;                     // 期数

        if(res.flag=="01"){
            state.home.ui.repayall = true;
            state.home.ui.repaypart = false;
        }else if(res.flag=="02"){
            state.home.ui.repayall = false;
            state.home.ui.repaypart = true;
        }
        if(res.discount==true){
            state.home.ui.showshort = true;
            state.home.ui.showlong = false;
        }else if(res.discount==false){
            state.home.ui.showshort = false;
            state.home.ui.showlong = true;
        }
        state.home.sub.planCode = res.planCode;
        state.home.sub.planName = res.planName;
    },

    // 二、新增页mulation
    UPDATEDEBITNAME(state,res){ //根据卡号返回对应的银行
        if(res.length!=0){
            state.add.ui.add_debitNum = res[0][0];    //卡Bin
            state.add.ui.add_debitName = res[0][1];   //卡名
            state.add.ui.isActive = true;
        }
    },

    SHOWBANKNAME(state,payload){  // 选择银行返回对应银行卡名 和 卡Bin
        state.add.ui.add_debitNum = payload.debitNum;
        state.add.ui.add_debitName = payload.debitName;
        state.search.ui.searchResult = "";
        if(state.add.ui.add_cardNo==""){
            state.add.ui.isActive = false;
        }else{
            state.add.ui.isActive = true;
        }
    },

    ADDBCARD(state,res){         //新增借记卡到借记卡列表
        var arr = [res.bankNO,state.add.ui.add_debitName,state.home.hdata.hascardName,res.bankBin];
        state.add.ui.add_cardNo = "";
        state.add.ui.add_debitName = "";
        state.add.ui.isActive = false;
        state.home.sub.Bflag = "1";
        state.public.ui.debitList.unshift(arr);
        state.home.hdata.bankNum = state.public.ui.debitList[0][0];
        state.home.hdata.bankName = state.public.ui.debitList[0][1];
        state.home.hdata.bankNo = res.bankBin;
        state.home.ui.hascard = true;
        state.home.ui.nocard = false;
    },

    INITADDPAGE(state,payload){  //更新页面显示卡号后 是否隐藏跨行转账
        state.home.hdata.bankNum = payload.addData[0];
        state.home.hdata.bankName = payload.addData[1];
        state.home.hdata.userName = payload.addData[2];
        state.home.hdata.bankNo = payload.addData[3];
        if(payload.addData[1]=="兴业银行"){
            state.home.ui.other = false;
        }else{
            state.home.ui.other = true;
        }
    },
    // 三、搜索页mulation
    SEARCHBANK(state,res){             
        // 默认展示后台传来list的前8个
        var arr = [];
        if(res.result == ""){
            for(var i=0;i<8;i++){
                arr.push(res.data[i]);
            }
            state.public.ui.bankList = arr; 
        }else{
            state.public.ui.bankList = res.data;
        }
    },

    // 四、短信验证码

    // 首页
    GETCARDCODE(state,res){ //第一次滑块验证码
        state.home.hdata.bimgSrc = "data:image/jpg;base64,"+res.bigimg;
        state.home.hdata.timgSrc = "data:image/jpg;base64,"+res.tarimg;
        state.home.menu.laystatu = true;
        state.home.menu.imagestatu = true;
    },

    // 登录页
    GETPHONECODE(state,res){ //第一次滑块验证码
        state.home.hdata.bimgSrc = "data:image/jpg;base64,"+res.bigimg;
        state.home.hdata.timgSrc = "data:image/jpg;base64,"+res.tarimg;
        state.home.menu.laystatu = true;
        state.home.menu.imagestatu = true;
    },

    // 首页
    CHANGEIMG(state,res2){ //第一次滑动失败 再赋值
        setTimeout(()=>{
            state.home.menu.imagestatu = true;
        },100);
        state.home.menu.imagestatu = false;
        state.home.hdata.bimgSrc = "data:image/jpg;base64,"+res2.bigimg;
        state.home.hdata.timgSrc = "data:image/jpg;base64,"+res2.tarimg;
    },

    // 登录页
    CHANGEPHONEIMG(state,res2){ //第一次滑动失败 再赋值
        setTimeout(()=>{
            state.home.menu.imagestatu = true;
        },100);
        state.home.menu.imagestatu = false;
        state.home.hdata.bimgSrc = "data:image/jpg;base64,"+res2.bigimg;
        state.home.hdata.timgSrc = "data:image/jpg;base64,"+res2.tarimg;
    },

    // 首页
    SENDMOVELEN(state,payload){ // 滑块验证成功
        state.home.menu.laystatu = false;
        state.home.menu.imagestatu = false;
        if(payload.flag_one!=true){
            return false;
        }
        state.public.pdata.identflag = false;
        var n = 120;
        var timer = "";
        clearInterval(timer);
        timer = setInterval(()=>{
            n--;
            if(n > 0 && n < 10){
                n = "0" + n;
            }
            state.public.pdata.identTxt = n+"秒";
            if(n==-1){
                clearInterval(timer);
                state.public.pdata.identTxt  = "获取验证码";
                state.public.pdata.identflag = true;
            }
        },1000);
    },

    // 登录页
    SENDPHONEMOVELEN(state,payload){ // 滑块验证成功
        state.home.menu.laystatu = false;
        state.home.menu.imagestatu = false;
        if(payload.flag_two!=true){
            return false;
        }
        state.login.ldata.identflag = false;
        var n = 120;
        var timer = "";
        clearInterval(timer);
        timer = setInterval(()=>{
            n--;
            if(n > 0 && n < 10){
                n = "0" + n;
            }
            state.login.ldata.identTxt = n+"秒";
            if(n==-1){
                clearInterval(timer);
                state.login.ldata.identTxt  = "获取验证码";
                state.login.ldata.identflag = true;
            }
        },1000);
    },

    SENDPINFAN(state,payload){ //120s内无法发送验证码
        state.home.menu.laystatu = false;
        state.home.menu.imagestatu = false;
    },

    FIRSTSEND(state,payload){ //第一次发送短信成功
        if(payload.cardflag!=true){
            return false;
        }
        state.public.pdata.identflag = false;
        var n = 120;
        var timer = "";
        clearInterval(timer);
        timer = setInterval(()=>{
            n--;
            if(n > 0 && n < 10){
                n = "0" + n;
            }
            state.public.pdata.identTxt = n+"秒";
            if(n==-1){
                clearInterval(timer);
                state.public.pdata.identTxt  = "获取验证码";
                state.public.pdata.identflag = true;
            }
        },1000);
    },

    PHONEFIRSTSEND(state,payload){ //第一次发送短信成功
        if(payload.phoneflag!=true){
            return false;
        }
        state.login.ldata.identflag = false;
        var n = 120;
        var timer = "";
        clearInterval(timer);
        timer = setInterval(()=>{
            n--;
            if(n > 0 && n < 10){
                n = "0" + n;
            }
            state.login.ldata.identTxt = n+"秒";
            if(n==-1){
                clearInterval(timer);
                state.login.ldata.identTxt  = "获取验证码";
                state.login.ldata.identflag = true;
            }
        },1000);
    },

    // 首页
    MORETIME(state,payload){  //请求次数过多
        state.home.menu.laystatu = false;
        state.home.menu.imagestatu = false;
        if(payload.flag_one!=true){
            return false;
        }
        state.public.pdata.identflag = false;
        var n = 60;
        var timer = "";
        clearInterval(timer);
        timer = setInterval(()=>{
            n--;
            if(n > 0 && n < 10){
                n = "0" + n;
            }
            state.public.pdata.identTxt = n+"秒";
            if(n==-1){
                clearInterval(timer);
                state.public.pdata.identTxt  = "获取验证码";
                state.public.pdata.identflag = true;
            }
        },1000);
    },

    // 登录页
    PHONEMORETIME(state,payload){  //请求次数过多
        state.home.menu.laystatu = false;
        state.home.menu.imagestatu = false;
        if(payload.flag_two!=true){
            return false;
        }
        state.login.ldata.identflag = false;
        var n = 60;
        var timer = "";
        clearInterval(timer);
        timer = setInterval(()=>{
            n--;
            if(n > 0 && n < 10){
                n = "0" + n;
            }
            state.login.ldata.identTxt = n+"秒";
            if(n==-1){
                clearInterval(timer);
                state.login.ldata.identTxt  = "获取验证码";
                state.login.ldata.identflag = true;
            }
        },1000);
    },

    // 五、最终提交
    SUBMITDATA(state,res){
        var applyyear = parseInt(res.applyDate.slice(0,4));
        var applymonth = parseInt(res.applyDate.slice(4,6));
        var applyday = parseInt(res.applyDate.slice(6,8)); 
        var initdate = parseInt(state.home.hdata.billdate); 
        if(applyday > initdate){
            if(applymonth==12){
                applyyear++;
                applymonth = 1;
            }else{
                applymonth++;
            }
            applyday = initdate;
        }else if(applyday <= initdate){
            applyday = initdate;
        }
        if((""+applymonth).length<2){
            applymonth="0"+applymonth;
        }
        if((""+applyday).length<2){
            applyday="0"+applyday;
        }
        state.home.sub.accountDate = applyyear+"/"+applymonth+"/"+applyday;
        if(res.payType=="01"){
            return state.home.sub.onePay;
        }else if(res.payType=="02"){
            state.home.sub.onePay = state.home.hdata.epayPart; // 首次应还金额
        }
    },

    GETFAILINFO(state,res){
        state.home.hdata.failmsg = res.msg;
        state.home.hdata.failcode = res.code;
        state.home.menu.laystatu = true;
        state.home.menu.failstatu = true;
    },

    BCHANGETIMESTATUS(state,value){                    // 更改倒计时显示状态
        state.home.hdata.timeShow = value;
    }
}

export default {
  state,
  getters,
  actions,
  mutations
}
