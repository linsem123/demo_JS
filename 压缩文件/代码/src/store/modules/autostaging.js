import autostage from "@/api/autostage.js";
import {saAlert,channel,hxdappIsSpecial} from "@/assets/js/common.js";
const state = {
    // version:"1.0.6",   // 分支
    version:"2.0.6",   // 主干
    // version:"3.0.1",   // uat 
    // version:"3.6.1",   // 生产
    apply:{
        applydata:{
            creditcardNum:{},                                      // 默认信用卡
            charge:{},                                             // 默认起分金额
            paytype:{},                                            // 默认支付方式
            periodRate:{},                                         // 默认费率
            creditIndex:0,                                         // 默认信用卡索引
            sumchosedIndex:"",                                     // 默认起分金额索引
            paychosedIndex:"",                                     // 默认支付方式索引
            periodrateIndex:0,                                     // 默认费率索引 
            differ:"",                                             // 是否出现/期
        },
        applyui:{
            imgshow_one:true,                                      // 未选中
            imgshow_two:false,                                     // 选中
            disshow:"",                                            // 立即申请样式
            active:"",                                             // 关闭按钮样式
            active2:"",                                            // 更换卡片样式
            creditList:[],                                         // 信用卡列表
            sumList:[],                                            // 起分金额列表
            prateList:[],                                          // 费率列表
            payList:[                                              // 支付方式列表
                {pType:"分期支付",discountTxt:""},
                {pType:"一次性支付",discountTxt:""}
            ],
        },
        applymenu:{
            laystatu:"",                                           // 蒙版
            remindstatu:"",                                        // 温馨提示
            changestatu:"",                                        // 卡片是否符合
            creditstatu:"",                                        // 信用卡
        },
        alert:{                                                    // 信息提示框
            msg:"",
            err:"",
            showAlert:""
        },
        fail:{                                                     // 错误提示框
            msg:"",
            err:"",
            showAlert:"",
            title:"",
        }
    },
    home:{
        homedata:{
            creditcardNum:{},                                      // 默认信用卡
            creditIndex:0,                                         // 默认信用卡索引
            money:"",                                              // 默认起分金额
            payType:"",                                            // 默认支付方式
            period:"",                                             // 默认期数
            rate:""                                                // 费率
        },
        homeui:{
            creditList:[],                                         // 信用卡列表
            active:"",                                             // 关闭按钮样式
            active2:"",                                            // 更换卡片样式
        },
        homemenu:{
            laystatu:"",                                           // 蒙版
            changestatu:"",                                        // 卡片是否符合
            creditstatu:"",                                        // 信用卡
        },
        alert:{                                                    // 信息提示框
            msg:"",
            err:"",
            showAlert:""
        }

    },
    revise:{
        revisedata:{
            creditcardNum:{},                                      // 默认信用卡
            charge:{},                                             // 默认起分金额
            paytype:{},                                            // 默认支付方式
            periodRate:{},                                         // 默认费率
            sumchosedIndex:"",                                     // 默认起分金额索引
            paychosedIndex:"",                                     // 默认支付方式索引
            periodrateIndex:0,                                     // 默认费率索引 
            differ:"",                                             // 是否出现/期
        },
        reviseui:{
            imgshow_one:true,                                      // 未选中
            imgshow_two:false,                                     // 选中
            creditList:[],                                         // 信用卡列表
            disshow:"",                                            // 立即申请样式
            sumList:[],                                            // 起分金额列表
            prateList:[],                                          // 费率列表
            payList:[                                              // 支付方式列表
                {pType:"分期支付",discountTxt:""},
                {pType:"一次性支付",discountTxt:""}
            ],
        },
        revisemenu:{
            laystatu:"",                                           // 蒙版
            remindstatu:"",                                        // 温馨提示
            changestatu:"",                                        // 卡片是否符合
        },
        alert:{                                                    // 信息提示框
            msg:"",
            err:"",
            showAlert:""
        },
        fail:{                                                     // 错误提示框
            msg:"",
            err:"",
            showAlert:"",
            title:"",
        }
    }
};

const getters = {

};
const actions = {
    // 一、申请页
    bsetinitapply({dispatch,commit,state},payload){                      // 1.申请页初始化数据渲染
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            baseData.channel = "hxdapp";
        }else{
            baseData.channel = "normal";
        }
        autostage.getapplyData(baseData).then((res)=>{
            if(res.success==true){
                if(res.data.applyFlag=="0"){              // 默认卡及前5张信用卡均未办过自动分期,
                    if(res.data.canFlag=="0"){               // 所有信用卡都不能办自动分期
                        commit("BINITCREDITCARD",res);
                        commit("BCHANGECLOSEALERT",{layer:true,show:true,active:true,active2:false}); // 弹框
                    }else if(res.data.canFlag=="1"){         // 主卡不能办但其他卡能办
                        commit("BINITCREDITCARD",res);
                        commit("BCHANGECLOSEALERT",{layer:true,show:true,active:false,active2:true}); // 弹框
                    }else if(res.data.canFlag=="2"){         // 默认卡或前5张信用卡有可办自动分期的卡
                        commit("BSETINITAPPLY",res);
                    }
                }else if(res.data.applyFlag=="1"){        // 默认卡或前五张信用卡已办过自动分期
                    // 修改页初始化赋值
                    res.data.flag = "0";
                    payload.router.push({path:"/AutoStaging/HomePage?Hdata="+JSON.stringify(res.data)});
                }
            }else if(res.success==false){
                commit("BAPPLYALERT",{show: true, msg: res.msg, err: res.code});
                commit("BINITAPPLYCREDITLIST",res);
                saAlert("自动分期申请页面","初始化数据",res.msg,"报错提示");
            }
        }).catch((err)=>{
            console.log(err);
            if(err.response.status){
                commit('BAPPLYALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
                saAlert("自动分期申请页面","初始化数据",err.response.status+err.response.statusText,"请求报错");
            }else{
                commit('BAPPLYALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
                saAlert("自动分期申请页面","初始化数据","请求失败","请求报错");
            } 
        });
        
    },
    bchangeapplycredit({dispatch,commit,state},payload){                 // 2.申请页切换信用卡后数据渲染
        baseData.data.cardKey = payload.creditcardNum.cardKey;
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            baseData.channel = "hxdapp";
        }else{
            baseData.channel = "normal";
        }
        autostage.changeCredit(baseData).then((res)=>{
            if(res.success==true){
                commit("BCHANGEAPPLYCREDIT",payload);
                if(res.data.applyFlag=="0"){              // 默认卡未办过自动分期
                    if(res.data.canFlag=="1"){  // 主卡不能办但其他卡能办
                        commit("BCHANGECLOSEALERT",{layer:true,show:true,active:false,active2:true}); // 弹框
                    }else if(res.data.canFlag=="2"){         // 默认卡可办
                        commit("BSETINITAPPLYTWO",res);
                    }
                }else if(res.data.applyFlag=="1"){        // 默认卡已办过自动分期
                    // 修改页初始化赋值
                    res.data.flag = "0";
                    payload.router.push({path:"/AutoStaging/HomePage?Hdata="+JSON.stringify(res.data)});
                }
            }else if(res.success==false){
                commit("BAPPLYALERT",{show: true, msg: res.msg, err: res.code});
                saAlert("自动分期申请页面","切换信用卡",res.msg,"报错提示");
            }
        }).catch((err)=>{
            console.log(err);
            if(err.response.status){
                commit('BAPPLYALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
                saAlert("自动分期申请页面","切换信用卡",err.response.status+err.response.statusText,"请求报错");
            }else{
                commit('BAPPLYALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
                saAlert("自动分期申请页面","切换信用卡","请求失败","请求报错");
            } 
        });
    },
    bchangeapplycharge({dispatch,commit,state},payload){                 // 3.申请页切换起分金额
        baseData.data.cardKey = payload.applydata.creditcardNum.cardKey;      // 卡号
        baseData.data.money = payload.charge.money;                           // 起分金额
        if(payload.applydata.paytype.pType=="一次性支付"){                     // 支付方式
            baseData.data.payType = "01";
        }else if(payload.applydata.paytype.pType=="分期支付"){
            baseData.data.payType = "02";
        }            
        baseData.data.period = payload.applydata.periodRate.period;           // 期数
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            baseData.channel = "hxdapp";
        }else{
            baseData.channel = "normal";
        }
        autostage.getperiodRate(baseData).then((res)=>{
            if(res.success==true){
                commit("BCHANGEAPPLYCHARGE",payload);
                var obj = {
                    money:baseData.data.money,
                    payType:baseData.data.payType,
                    period:baseData.data.period
                }
                var newobj = Object.assign(res.data,obj);
                commit("BINITAPPLYRATE",newobj);
            }else if(res.success==false){
                commit("BAPPLYALERT",{show: true, msg: res.msg, err: res.code});
                saAlert("自动分期申请页面","切换起分金额",res.msg,"报错提示");
            }
        }).catch((err)=>{
            console.log(err);
            if(err.response.status){
                commit('BAPPLYALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
                saAlert("自动分期申请页面","切换起分金额",err.response.status+err.response.statusText,"请求报错");
            }else{
                commit('BAPPLYALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
                saAlert("自动分期申请页面","切换起分金额","请求失败","请求报错");
            } 
        });
    },
    bchangeapplypaytype({dispatch,commit,state},payload){                // 4.申请页切换支付方式
        baseData.data.cardKey = payload.applydata.creditcardNum.cardKey;      // 卡号
        baseData.data.money = payload.applydata.charge.money;                 // 起分金额
        if(payload.paytype.pType=="一次性支付"){                               // 支付方式
            baseData.data.payType = "01";
        }else if(payload.paytype.pType=="分期支付"){
            baseData.data.payType = "02";
        }            
        baseData.data.period = payload.applydata.periodRate.period;           // 期数
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            baseData.channel = "hxdapp";
        }else{
            baseData.channel = "normal";
        }
        autostage.getperiodRate(baseData).then((res)=>{
            if(res.success==true){
                commit("BCHANGEAPPLYPAYTYPE",payload);
                var obj = {
                    money:baseData.data.money,
                    payType:baseData.data.payType,
                    period:baseData.data.period
                }
                var newobj = Object.assign(res.data,obj);
                commit("BINITAPPLYRATE",newobj);
            }else if(res.success==false){
                commit("BAPPLYALERT",{show: true, msg: res.msg, err: res.code});
                saAlert("自动分期申请页面","切换支付方式",res.msg,"报错提示");
            }
        }).catch((err)=>{
            console.log(err);
            if(err.response.status){
                commit('BAPPLYALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
                saAlert("自动分期申请页面","切换支付方式",err.response.status+err.response.statusText,"请求报错");
            }else{
                commit('BAPPLYALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
                saAlert("自动分期申请页面","切换支付方式","请求失败","请求报错");
            } 
        });
    },
    bchangeapplyperiodrate({dispatch,commit,state},payload){             // 5.申请页切换期数费率
        commit("BCHANGEAPPLYPERIODRATE",payload);
    },
    binitapplyrate({dispatch,commit,state},payload){                     // 6.费率列表赋值
        baseData.data.cardKey = payload.applydata.creditcardNum.cardKey;      // 卡号
        baseData.data.money = payload.applydata.charge.money;                 // 起分金额
        if(payload.applydata.paytype.pType=="一次性支付"){                     // 支付方式
            baseData.data.payType = "01";
        }else if(payload.applydata.paytype.pType=="分期支付"){
            baseData.data.payType = "02";
        }            
        baseData.data.period = payload.applydata.periodRate.period;           // 期数
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            baseData.channel = "hxdapp";
        }else{
            baseData.channel = "normal";
        }
        autostage.getperiodRate(baseData).then((res)=>{
            if(res.success==true){
                var obj = {
                    money:baseData.data.money,
                    payType:baseData.data.payType,
                    period:baseData.data.period
                }
                var newobj = Object.assign(res.data,obj);
                commit("BINITAPPLYRATE",newobj);
            }else if(res.success==false){
                commit("BAPPLYALERT",{show: true, msg: res.msg, err: res.code});
                saAlert("自动分期申请页面","获取费率列表",res.msg,"报错提示");
            }
        }).catch((err)=>{
            console.log(err);
            if(err.response.status){
                commit('BAPPLYALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
                saAlert("自动分期申请页面","获取费率列表",err.response.status+err.response.statusText,"请求报错");
            }else{
                commit('BAPPLYALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
                saAlert("自动分期申请页面","获取费率列表","请求失败","请求报错");
            } 
        });
    },
    bapplyinfo({dispatch,commit,state},payload){                         // 7.申请页申请
        baseData.data.cardKey = payload.applydata.creditcardNum.cardKey;      // 卡号
        baseData.data.money = payload.applydata.charge.money;                 // 起分金额
        if(payload.applydata.paytype.pType=="一次性支付"){                     // 支付方式
            baseData.data.payType = "01";
        }else if(payload.applydata.paytype.pType=="分期支付"){
            baseData.data.payType = "02";
        }            
        baseData.data.period = payload.applydata.periodRate.period;           // 期数
        baseData.data.salesman = payload.jobNum;                              // 工号
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            baseData.channel = "hxdapp";
        }else{
            baseData.channel = "normal";
        }
        autostage.submitInfo(baseData).then((res)=>{
            if(res.success==true){
                commit("BREINITAPPLYSTATUS",{unchecked:true,checked:false,disshow:false});
                var obj = {
                    cardNo:payload.applydata.creditcardNum.cardNo,
                    money:payload.applydata.charge.money,
                    payType:payload.applydata.paytype.pType,
                    period:payload.applydata.periodRate.period,
                    rate:payload.applydata.periodRate.rate
                }
                payload.router.push({path:"/AutoStaging/SuccessPage?Sdata="+JSON.stringify(obj)});
            }else if(res.success==false){
                commit('BAPPLYFAILALERT', {title:"自动分期开通失败",show: true, msg: res.msg, err: res.code});
                saAlert("自动分期申请页面","点击申请",res.msg,"报错提示");
            }
        }).catch((err)=>{
            console.log(err);
            if(err.response.status){
                commit('BAPPLYALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
                saAlert("自动分期申请页面","点击申请",err.response.status+err.response.statusText,"请求报错");
            }else{
                commit('BAPPLYALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
                saAlert("自动分期申请页面","点击申请","请求失败","请求报错");
            } 
        });
    },

    // 二、首页
    bchangehomecredit({dispatch,commit,state},payload){                  // 1.首页切换信用卡
        baseData.data.cardKey = payload.creditcardNum.cardKey;
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            baseData.channel = "hxdapp";
        }else{
            baseData.channel = "normal";
        }
        autostage.changeCredit(baseData).then((res)=>{
            if(res.success==true){
                commit("BCHANGEHOMECREDIT",payload);
                if(res.data.applyFlag=="0"){
                    if(res.data.canFlag=="1"){       // 未办且不可办自动分期
                        commit("BCHANGEHOMECLOSEALERT",{layer:true,show:true,active:false,active2:true}); // 弹框
                    }else if(res.data.canFlag=="2"){ // 未办且可办自动分期 => 申请页
                        payload.router.push({path:"/AutoStaging/ApplyPage?Adata="+JSON.stringify(res.data)});
                    }
                }else if(res.data.applyFlag=="1"){
                    commit("BSETHOMEDATA",res.data);  // 已办自动分期
                    res.data.flag = "0";
                    payload.router.push({path:"/AutoStaging/HomePage?Hdata="+JSON.stringify(res.data)});  
                }
            }else if(res.success==false){
                commit("BHOMEALERT",{show: true, msg: res.msg, err: res.code});
                saAlert("自动分期首页","切换信用卡",res.msg,"报错提示");
            }
        }).catch((err)=>{
            console.log(err);
            if(err.response.status){
                commit('BHOMEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
                saAlert("自动分期首页","切换信用卡",err.response.status+err.response.statusText,"请求报错");
            }else{
                commit('BHOMEALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
                saAlert("自动分期首页","切换信用卡","请求失败","请求报错");
            } 
        });
    },

    // 三、修改页
    bsetinitrevise({dispatch,commit,state},payload){                     // 1.修改页数据渲染    
        for(var i=0;i<payload.reviseInfo.autocardInfoList.length;i++){
            if(payload.reviseInfo.autocardInfoList[i].cardNo==payload.reviseInfo.cardNo){
                baseData.data.cardKey = payload.reviseInfo.autocardInfoList[i].cardKey;
            }
        }
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            baseData.channel = "hxdapp";
        }else{
            baseData.channel = "normal";
        }
        autostage.changeCredit(baseData).then((res)=>{
            if(res.success==true){
                commit('BSETINITREVISE',res.data);
            }else if(res.success==false){
                commit("BREVISEALERT",{show: true, msg: res.msg, err: res.code});
                saAlert("自动分期修改页","数据渲染",res.msg,"报错提示");
            }
        }).catch((err)=>{
            console.log(err);
            if(err.response.status){
                commit('BREVISEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
                saAlert("自动分期修改页","数据渲染",err.response.status+err.response.statusText,"请求报错");
            }else{
                commit('BREVISEALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
                saAlert("自动分期修改页","数据渲染","请求失败","请求报错");
            } 
        });
        baseData.data.money = "500";           // 起分金额
        baseData.data.payType = "02";          // 支付方式
        baseData.data.period = "12";           // 期数
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            baseData.channel = "hxdapp";
        }else{
            baseData.channel = "normal";
        }
        autostage.getperiodRate(baseData).then((res)=>{
            if(res.success==true){
                var obj = {
                    money:baseData.data.money,
                    payType:baseData.data.payType,
                    period:baseData.data.period
                }
                var newobj = Object.assign(res.data,obj);
                commit("BSETINITREVISETWO",newobj);
            }else if(res.success==false){
                commit("BREVISEALERT",{show: true, msg: res.msg, err: res.code});
                saAlert("自动分期修改页","数据渲染",res.msg,"报错提示");
            }
        }).catch((err)=>{
            console.log(err);
            if(err.response.status){
                commit('BREVISEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
                saAlert("自动分期修改页","数据渲染",err.response.status+err.response.statusText,"请求报错");
            }else{
                commit('BREVISEALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
                saAlert("自动分期修改页","数据渲染","请求失败","请求报错");
            } 
        });
    },
    bchangerevisecharge({dispatch,commit,state},payload){                // 2.修改页切换起分金额
        baseData.data.cardKey = payload.revisedata.creditcardNum.cardKey;     // 卡号
        baseData.data.money = payload.charge.money;                           // 起分金额
        if(payload.revisedata.paytype.pType=="一次性支付"){                    // 支付方式
            baseData.data.payType = "01";
        }else if(payload.revisedata.paytype.pType=="分期支付"){
            baseData.data.payType = "02";
        }            
        baseData.data.period = payload.revisedata.periodRate.period;          // 期数
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            baseData.channel = "hxdapp";
        }else{
            baseData.channel = "normal";
        }
        autostage.getperiodRate(baseData).then((res)=>{
            if(res.success==true){
                commit("BCHANGEREVISECHARGE",payload);
                var obj = {
                    money:baseData.data.money,
                    payType:baseData.data.payType,
                    period:baseData.data.period
                }
                var newobj = Object.assign(res.data,obj);
                commit("BINITREVISERATE",newobj);
            }else if(res.success==false){
                commit("BREVISEALERT",{show: true, msg: res.msg, err: res.code});
                saAlert("自动分期修改页","切换起分金额",res.msg,"报错提示");
            }
        }).catch((err)=>{
            console.log(err);
            if(err.response.status){
                commit('BREVISEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
                saAlert("自动分期修改页","切换起分金额",err.response.status+err.response.statusText,"请求报错");
            }else{
                commit('BREVISEALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
                saAlert("自动分期修改页","切换起分金额","请求失败","请求报错");
            } 
        });
    },
    bchangerevisepaytype({dispatch,commit,state},payload){               // 3.修改页切换支付方式
        baseData.data.cardKey = payload.revisedata.creditcardNum.cardKey;      // 卡号
        baseData.data.money = payload.revisedata.charge.money;                 // 起分金额
        if(payload.paytype.pType=="一次性支付"){                                // 支付方式
            baseData.data.payType = "01";
        }else if(payload.paytype.pType=="分期支付"){
            baseData.data.payType = "02";
        }            
        baseData.data.period = payload.revisedata.periodRate.period;            // 期数
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            baseData.channel = "hxdapp";
        }else{
            baseData.channel = "normal";
        }
        autostage.getperiodRate(baseData).then((res)=>{
            if(res.success==true){
                commit("BCHANGEREVISEPAYTYPE",payload);
                var obj = {
                    money:baseData.data.money,
                    payType:baseData.data.payType,
                    period:baseData.data.period
                }
                var newobj = Object.assign(res.data,obj);
                commit("BINITREVISERATE",newobj);
            }else if(res.success==false){
                commit("BREVISEALERT",{show: true, msg: res.msg, err: res.code});
                saAlert("自动分期修改页","切换支付方式",res.msg,"报错提示");
            }
        }).catch((err)=>{
            console.log(err);
            if(err.response.status){
                commit('BREVISEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
                saAlert("自动分期修改页","切换支付方式",err.response.status+err.response.statusText,"请求报错");
            }else{
                commit('BREVISEALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
                saAlert("自动分期修改页","切换支付方式","请求失败","请求报错");
            } 
        });
    },
    bchangereviseperiodrate({dispatch,commit,state},payload){            // 4.修改页切换期数费率
        commit("BCHANGEREVISEPERIODRATE",payload);
    },
    binitreviserate({dispatch,commit,state},payload){                    // 5.费率列表赋值
        baseData.data.cardKey = payload.revisedata.creditcardNum.cardKey;      // 卡号
        baseData.data.money = payload.revisedata.charge.money;                 // 起分金额
        if(payload.revisedata.paytype.pType=="一次性支付"){                     // 支付方式
            baseData.data.payType = "01";
        }else if(payload.revisedata.paytype.pType=="分期支付"){
            baseData.data.payType = "02";
        }            
        baseData.data.period = payload.revisedata.periodRate.period;           // 期数
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            baseData.channel = "hxdapp";
        }else{
            baseData.channel = "normal";
        }
        autostage.getperiodRate(baseData).then((res)=>{
            if(res.success==true){
                var obj = {
                    money:baseData.data.money,
                    payType:baseData.data.payType,
                    period:baseData.data.period
                }
                var newobj = Object.assign(res.data,obj);
                commit("BINITREVISERATE",newobj);
            }else if(res.success==false){
                commit("BREVISEALERT",{show: true, msg: res.msg, err: res.code});
                saAlert("自动分期修改页","获取费率列表",res.msg,"报错提示");
            }
        }).catch((err)=>{
            console.log(err);
            if(err.response.status){
                commit('BREVISEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
                saAlert("自动分期修改页","获取费率列表",err.response.status+err.response.statusText,"请求报错");
            }else{
                commit('BREVISEALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
                saAlert("自动分期修改页","获取费率列表","请求失败","请求报错");
            } 
        });
    },
    breviseinfo({dispatch,commit,state},payload){                        // 6.修改页点击修改
        baseData.data.cardKey = payload.revisedata.creditcardNum.cardKey;      // 卡号
        baseData.data.money = payload.revisedata.charge.money;                 // 起分金额
        if(payload.revisedata.paytype.pType=="一次性支付"){                     // 支付方式
            baseData.data.payType = "01";
        }else if(payload.revisedata.paytype.pType=="分期支付"){
            baseData.data.payType = "02";
        }            
        baseData.data.period = payload.revisedata.periodRate.period;           // 期数
        baseData.data.salesman = "";                                           // 工号
        if(channel()=="hxdapp"&&hxdappIsSpecial()){
            baseData.channel = "hxdapp";
        }else{
            baseData.channel = "normal";
        }
        autostage.submitInfo(baseData).then((res)=>{
            if(res.success==true){
                var hdata = {
                    creditcardNum:payload.revisedata.creditcardNum,
                    autocardInfoList:payload.reviseui.creditList,
                    cardNo:payload.revisedata.creditcardNum.cardNo,
                    money:payload.revisedata.charge.money,
                    moneyList:payload.reviseui.sumList,
                    payType:baseData.data.payType,
                    period:payload.revisedata.periodRate.period,
                    rate:payload.revisedata.periodRate.rate,
                }
                $.alert("修改成功","提示",()=>{
                    payload.router.push({path:"/AutoStaging/HomePage?Hdatatwo="+JSON.stringify(hdata)});
                });
                commit("BREINITREVISESTATUS",state);
            }else if(res.success==false){
                commit('BREVISEFAILALERT', {title:"自动分期开通失败",show: true, msg: res.msg, err: res.code});
                saAlert("自动分期修改页","点击修改",res.msg,"报错提示");
            }
        }).catch((err)=>{
            console.log(err);
            if(err.response.status){
                commit('BREVISEALERT', {show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
                saAlert("自动分期修改页","点击修改",err.response.status+err.response.statusText,"请求报错");
            }else{
                commit('BREVISEALERT', {show: true, msg: '请求失败，请稍后重试~', err: ''});
                saAlert("自动分期修改页","点击修改","请求失败","请求报错");
            } 
        });
    },
};

const mutations={
    // 一、申请页
    BSETINITAPPLY(state,res){                                            // 1.申请页初始化数据渲染  
        state.apply.applyui.creditList = res.data.autocardInfoList;                    // 默认的信用卡列表            
        for(var i=0;i<res.data.autocardInfoList.length;i++){                                   
            if(res.data.autocardInfoList[i].cardNo==res.data.cardNo){
                state.apply.applydata.creditcardNum = res.data.autocardInfoList[i];    // 选中的信用卡
                state.apply.applydata.creditIndex = i;                                 // 选中的信用卡的索引
            }
        }
        state.apply.applydata.charge.money = res.data.money;                           // 起分金额           
        state.apply.applyui.sumList = res.data.moneyList;                                      
        for(var i=0;i<res.data.moneyList.length;i++){                                          
            if(res.data.moneyList[i].money==res.data.money){
                state.apply.applydata.sumchosedIndex = i;                              // 起分金额对应索引
            }
        }
        if(res.data.payType=="01"){                                                    // 支付方式                    
            state.apply.applydata.paytype.pType = "一次性支付";
        }else if(res.data.payType=="02"){
            state.apply.applydata.paytype.pType = "分期支付";
        }                              
        for(var j=0;j<state.apply.applyui.payList.length;j++){                                 
            if(state.apply.applyui.payList[j].pType==state.apply.applydata.paytype.pType){
                state.apply.applydata.paychosedIndex = j;                              // 支付方式对应索引
            }
        }
        if(res.data.payType=="02"){                                                           
            state.apply.applydata.differ = true;                                       // 区分一次性支付/分期支付
        }else if(res.data.payType=="01"){
            state.apply.applydata.differ = false;
        }
        state.apply.applydata.periodRate.period = res.data.period;                     // 期数          
        state.apply.applydata.periodRate.rate = (Number(res.data.rate)*100).toFixed(2);// 费率    
    },
    BCHANGEAPPLYCREDIT(state,payload){                                  // 2.1切换申请页信用卡
        state.apply.applydata.creditcardNum = payload.creditcardNum;
        state.apply.applydata.creditIndex = payload.creditcardNum.index;
        state.apply.applyui.imgshow_one = true;
        state.apply.applyui.imgshow_two = false;
        state.apply.applyui.disshow = false;
    },
    BSETINITAPPLYTWO(state,res){                                        // 2.2申请页切换信用卡后数据渲染
        state.apply.applydata.charge.money = res.data.money;                                   // 切卡后起分金额
        state.apply.applyui.sumList = res.data.moneyList;                                      // 切卡后起分金额列表
        for(var i=0;i<res.data.moneyList.length;i++){                                          // 起分金额默认索引
            if(res.data.moneyList[i].money==res.data.money){
                state.apply.applydata.sumchosedIndex = i;
            }
        }
        if(res.data.payType=="01"){                                                            // 切卡后支付方式
            state.apply.applydata.paytype.pType = "一次性支付";
        }else if(res.data.payType=="02"){
            state.apply.applydata.paytype.pType = "分期支付";
        }                              
        for(var j=0;j<state.apply.applyui.payList.length;j++){                                 // 切卡后支付方式默认索引
            if(state.apply.applyui.payList[j].pType==state.apply.applydata.paytype.pType){
                state.apply.applydata.paychosedIndex = j;
            }
        }
        if(res.data.payType=="02"){                                                            // 切卡后是否出现/期
            state.apply.applydata.differ = true;
        }else if(res.data.payType=="01"){
            state.apply.applydata.differ = false;
        }
        state.apply.applydata.periodRate.period = res.data.period;                             // 切卡后默认期数
        state.apply.applydata.periodRate.rate = (Number(res.data.rate)*100).toFixed(2);        // 切卡后默认费率
    },
    BCHANGEAPPLYCHARGE(state,payload){                                  // 3.申请页切换起分金额
        state.apply.applydata.charge = payload.charge;
        state.apply.applydata.sumchosedIndex = payload.charge.index;
    }, 
    BCHANGEAPPLYPAYTYPE(state,payload){                                 // 4.申请页切换支付方式
        state.apply.applydata.paytype = payload.paytype;
        state.apply.applydata.paychosedIndex = payload.paytype.index;
        if(payload.paytype.pType=="分期支付"){
            state.apply.applydata.differ = true;
        }else if(payload.paytype.pType=="一次性支付"){
            state.apply.applydata.differ = false;
        }
    },
    BCHANGEAPPLYPERIODRATE(state,payload){                              // 5.申请页切换期数费率
        state.apply.applydata.periodRate = payload.periodrate;
        state.apply.applydata.periodrateIndex = payload.periodrate.index;
    },
    BINITAPPLYRATE(state,res){                                          // 6.申请页获取费率列表
        state.apply.applyui.prateList = res.autoInstallTableInfoList;                       // 费率列表赋值
        for(var i=0;i<res.autoInstallTableInfoList.length;i++){
            res.autoInstallTableInfoList[i].rate = (Number(res.autoInstallTableInfoList[i].rate)*100).toFixed(2);
            if(res.autoInstallTableInfoList[i].bz2==res.money && res.autoInstallTableInfoList[i].period==res.period && res.autoInstallTableInfoList[i].payType == res.payType){
                state.apply.applydata.periodRate = res.autoInstallTableInfoList[i];         // 选中的费率
                state.apply.applydata.periodrateIndex = i;                                  // 选中的费率索引
            }
        }
    },
    BSETAPPLY(state,res){                                               // 7.首页=>申请页后数据渲染
        state.apply.applyui.creditList = res.autocardInfoList;
        for(var i=0;i<res.autocardInfoList.length;i++){
            if(res.autocardInfoList[i].cardNo==res.cardNo){
                state.apply.applydata.creditcardNum = res.autocardInfoList[i];
                state.apply.applydata.creditIndex = i;
            }
        }
        state.apply.applydata.charge.money = res.money;                                       // 默认起分金额
        state.apply.applyui.sumList = res.moneyList;                                          // 起分金额列表
        for(var i=0;i<res.moneyList.length;i++){                                              // 起分金额默认索引
            if(res.moneyList[i].money==res.money){
                state.apply.applydata.sumchosedIndex = i;
            }
        }
        if(res.payType=="01"){                                                                 // 默认支付方式
            state.apply.applydata.paytype.pType = "一次性支付";
        }else if(res.payType=="02"){
            state.apply.applydata.paytype.pType = "分期支付";
        }                              
        for(var j=0;j<state.apply.applyui.payList.length;j++){                                 // 支付方式默认索引
            if(state.apply.applyui.payList[j].pType==state.apply.applydata.paytype.pType){
                state.apply.applydata.paychosedIndex = j;
            }
        }
        if(res.payType=="02"){                                                                  // 是否出现/期
            state.apply.applydata.differ = true;
        }else if(res.payType=="01"){
            state.apply.applydata.differ = false;
        }
        state.apply.applydata.periodRate.period = res.period;                                   // 默认期数
        state.apply.applydata.periodRate.rate = (Number(res.rate)*100).toFixed(2);              // 默认费率
    },
    BAPPLYCREDITSTATU(state,data){                                      // 显示/隐藏信用卡
        state.apply.applymenu.laystatu = data.layer;
        state.apply.applymenu.creditstatu = data.statu;
    },
    BINITCREDITCARD(state,res){                                         // 默认卡不能办理业务，弹框显示，信用卡列表赋值
        state.apply.applydata.creditcardNum = _.cloneDeep(res.data.autocardInfoList[0]);       // 设置默认卡号
        state.apply.applyui.creditList = res.data.autocardInfoList;                            // 信用卡列表
    },
    BCHANGECLOSEALERT(state,data){                                      // 判断关闭/更换卡片样式
        state.apply.applymenu.laystatu = data.layer;
        state.apply.applymenu.changestatu = data.show;
        state.apply.applyui.active = data.active;
        state.apply.applyui.active2 = data.active2;
    },
    BAPPLYCLOSEALERT(state,data){                                       // 关闭弹出框
        state.apply.applymenu.laystatu = data.show;                             
        state.apply.applymenu.changestatu = data.show;
    },
    BAPPLYALERT(state,data){                                            // 申请页信息弹框
        state.apply.alert.showAlert = data.show;
        state.apply.alert.msg = data.msg;       
        state.apply.alert.err = data.err;        
    },
    BCHANGEAPPLYSTATUS(state,data){                                     // 切换申请页选中状态
        state.apply.applyui.imgshow_one = data.unchecked;
        state.apply.applyui.imgshow_two = data.checked;
    },
    BCHANGEAPPLYBTN(state,data){                                        // 申请页面按钮选中状态
        state.apply.applyui.disshow = data.status;                        
    },
    BCHANGEAPPLYREMIND(state,data){                                     // 申请页温馨提示显示/隐藏
        state.apply.applymenu.laystatu = data.layer;                    
        state.apply.applymenu.remindstatu = data.remind;                 
    },
    BAPPLYFAILALERT(state,data){                                        // 申请页失败弹框
        state.apply.fail.title = data.title;
        state.apply.fail.showAlert = data.show;
        state.apply.fail.msg = data.msg;
        state.apply.fail.err = data.err;
    },
    BREINITAPPLYSTATUS(state,data){                                     // 重置按钮选中状态
        state.apply.applyui.imgshow_one = data.unchecked;
        state.apply.applyui.imgshow_two = data.checked;
        state.apply.applyui.disshow = data.disshow;
    },
    BINITAPPLYCREDITLIST(state,res){
        state.apply.applydata.creditcardNum = _.cloneDeep(res.data[0]); 
        state.apply.applyui.creditList = res.data;  
    },

    // 二、首页
    BSETINITHOME(state,res){                                            // 首页默认展示 初始化数据
        state.home.homeui.creditList = res.autocardInfoList;                 // 信用卡列表
        for(var i=0;i<res.autocardInfoList.length;i++){               
            if(res.autocardInfoList[i].cardNo==res.cardNo){
                state.home.homedata.creditcardNum = res.autocardInfoList[i]; // 选中的信用卡
                state.home.homedata.creditIndex = i;                         // 选中信用卡对应索引
            }
        }
        state.home.homedata.money = res.money;                               // 起分金额
        if(res.payType=="01"){ 
            state.home.homedata.payType = "一次性支付";                       // 支付方式
        }else if(res.payType=="02"){
            state.home.homedata.payType = "分期支付";
        }
        state.home.homedata.period = res.period;                             // 期数
        state.home.homedata.rate = (Number(res.rate)*100).toFixed(2);        // 费率

    },
    BSETINITHOMETWO(state,res){                                         // 修改成功后初始化数据
        state.home.homedata.creditcardNum = res.creditcardNum;              // 选中的信用卡
        state.home.homeui.creditList = res.autocardInfoList;
        for(var i=0;i<state.home.homeui.creditList.length;i++){
            if(res.autocardInfoList[i].cardNo==res.creditcardNum.cardNo){
                state.home.homedata.creditIndex = i;                        // 选中的信用卡对应索引
            }
        }
        state.home.homedata.money = res.money;                              // 起分金额
        if(res.payType=="01"){
            state.home.homedata.payType = "一次性支付";                      // 支付方式
        }else if(res.payType=="02"){
            state.home.homedata.payType = "分期支付";
        }
        state.home.homedata.period = res.period;                            // 期数
        state.home.homedata.rate = res.rate;                                // 费率
    },
    BCHANGEHOMECREDIT(state,payload){                                   // 1.1切换首页信用卡
        state.home.homedata.creditcardNum = payload.creditcardNum;
        state.home.homedata.creditIndex = payload.creditcardNum.index;
    },
    BSETHOMEDATA(state,data){                                           // 1.2切换信用卡后，数据渲染(已办自动分期)
        state.home.homedata.money = data.money;         // 起分金额
        if(data.payType=="01"){                        
            state.home.homedata.payType = "一次性支付";  // 支付方式
        }else if(data.payType=="02"){
            state.home.homedata.payType = "分期支付";
        }
        state.home.homedata.period = data.period;       // 期数
        state.home.homedata.rate = (Number(data.rate)*100).toFixed(2);
    },
    BCHANGEHOMECLOSEALERT(state,data){                                  // 1.3判断关闭/更换卡片样式(不可办自动分期)
        state.home.homemenu.laystatu = data.layer;
        state.home.homemenu.changestatu = data.show;
        state.home.homeui.active = data.active;
        state.home.homeui.active2 = data.active2;
    },
    BHOMECREDITSTATU(state,data){                                       // 显示/隐藏信用卡
        state.home.homemenu.laystatu = data.layer;
        state.home.homemenu.creditstatu = data.statu;
    },
    BHOMEALERT(state,data){                                             // 首页信息弹框
        state.home.alert.showAlert = data.show;
        state.home.alert.msg = data.msg;       
        state.home.alert.err = data.err;        
    },
    BHOMECLOSEALERT(state,data){                                        // 关闭弹出框
        state.home.homemenu.laystatu = data.show;                             
        state.home.homemenu.changestatu = data.show;
    },
    
    // 三、修改页
    BSETINITREVISE(state,res){                                            // 1.修改页初始化数据渲染
        state.revise.reviseui.creditList = res.autocardInfoList;                             // 信用卡列表
        for(var i=0;i<res.autocardInfoList.length;i++){
            if(res.autocardInfoList[i].cardNo==res.cardNo){
                state.revise.revisedata.creditcardNum = res.autocardInfoList[i];
                state.revise.revisedata.creditIndex = i;
            }
        }
        state.revise.reviseui.sumList = res.moneyList;                                       // 起分金额列表
    },
    BSETINITREVISETWO(state,res){
        state.revise.revisedata.charge.money = res.money;  
        state.revise.revisedata.paytype.pType = "分期支付";
        state.revise.revisedata.sumchosedIndex = 0;
        state.revise.revisedata.paychosedIndex = 0;
        state.revise.revisedata.differ = true;
        state.revise.revisedata.periodRate.period = res.period; 
        state.revise.reviseui.prateList = res.autoInstallTableInfoList;                       // 费率列表赋值
        for(var i=0;i<res.autoInstallTableInfoList.length;i++){
            res.autoInstallTableInfoList[i].rate = (Number(res.autoInstallTableInfoList[i].rate)*100).toFixed(2);
            if(res.autoInstallTableInfoList[i].bz2==res.money && res.autoInstallTableInfoList[i].period==res.period && res.autoInstallTableInfoList[i].payType == res.payType){
                state.revise.revisedata.periodRate = res.autoInstallTableInfoList[i];         // 选中的费率
                state.revise.revisedata.periodrateIndex = i;                                  // 选中的费率索引
            }
        }
    },
    BCHANGEREVISECHARGE(state,payload){                                   // 2.修改页切换起分金额
        state.revise.revisedata.charge = payload.charge;
        state.revise.revisedata.sumchosedIndex = payload.charge.index;
    },
    BCHANGEREVISEPAYTYPE(state,payload){                                  // 3.修改页切换支付方式
        state.revise.revisedata.paytype = payload.paytype;
        state.revise.revisedata.paychosedIndex = payload.paytype.index;
        if(payload.paytype.pType=="分期支付"){
            state.revise.revisedata.differ = true;
        }else if(payload.paytype.pType=="一次性支付"){
            state.revise.revisedata.differ = false;
        }
    },
    BCHANGEREVISEPERIODRATE(state,payload){                               // 4.修改页切换期数费率
        state.revise.revisedata.periodRate = payload.periodrate;
        state.revise.revisedata.periodrateIndex = payload.periodrate.index;
    },
    BINITREVISERATE(state,res){                                           // 5.获取费率列表
        state.revise.reviseui.prateList = res.autoInstallTableInfoList;                       // 费率列表赋值
        for(var i=0;i<res.autoInstallTableInfoList.length;i++){
            res.autoInstallTableInfoList[i].rate = (Number(res.autoInstallTableInfoList[i].rate)*100).toFixed(2);
            if(res.autoInstallTableInfoList[i].bz2==res.money && res.autoInstallTableInfoList[i].period==res.period && res.autoInstallTableInfoList[i].payType == res.payType){
                state.revise.revisedata.periodRate = res.autoInstallTableInfoList[i];         // 选中的费率
                state.revise.revisedata.periodrateIndex = i;                                  // 选中的费率索引
            }
        }
    },
    BCHANGEREVISESTATUS(state,data){                                      // 切换申请页选中状态
        state.revise.reviseui.imgshow_one = data.unchecked;
        state.revise.reviseui.imgshow_two = data.checked;
    },
    BCHANGEREVISEBTN(state,data){                                         // 修改页按钮选中状态
        state.revise.reviseui.disshow = data.status;                        
    },
    BCHANGEREVISEREMIND(state,data){                                      // 修改页温馨提示显示/隐藏
        state.revise.revisemenu.laystatu = data.layer;                    
        state.revise.revisemenu.remindstatu = data.remind;                 
    },
    BREVISEALERT(state,data){                                             // 修改页信息弹框
        state.revise.alert.showAlert = data.show;
        state.revise.alert.msg = data.msg;       
        state.revise.alert.err = data.err;        
    },
    BREVISEFAILALERT(state,data){                                         // 申请页失败弹框
        state.revise.fail.title = data.title;
        state.revise.fail.showAlert = data.show;
        state.revise.fail.msg = data.msg;
        state.revise.fail.err = data.err;
    },
    BREINITREVISESTATUS(state,data){                                      // 重置状态
        state.revise.reviseui.imgshow_one = true;
        state.revise.reviseui.imgshow_two = false;
        state.revise.reviseui.disshow = false;
    }
}
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