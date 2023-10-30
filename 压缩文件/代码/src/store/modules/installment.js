
import  installment from '@/api/billInstallment.js';
// importinstallment from '@/api/api.js';
import _ from 'lodash';
import {saAlert,track,channel, hxdappIsSpecial } from "@/assets/js/common.js"; //听云监听
const state={
  version:"1.0.7",   // 生产版本
  // version:"3.0.1",  // Uat版本
  fixed:false,
  ui:{
     flag:"" ,  //用来决定是否可以办理
     show:"",
     msg:"您当前无可办理的账单分期，推荐您前往办理消费分期"
  },
    handlebtn:{                                   //
    text:'同意条款细则并办理',
    dis:true,
   },
   alert:{     //跳消费的提示框
    show:false,
    msg:'您当前无可办理的账单分期，推荐您前往办理消费分期',
    err:'',
    tan:'false',
    tt:"",
  },
  btn:{                                     //切换币种按钮
    // btncount:"1",                            //计算币种按钮  位置  为1是默认人民币，当为偶数时是切换至美元
    curency:true,                               //为true是人民币  为false是美元 
    btnshow:true                                 //是否显示按钮
  },
  erroralert:{
    show:false,
    msg:'',
    err:'',
  },
  maxalert:{
    show:false,
    msg:'',
    err:'',
    tan:'false',
  },
  homepage:{
        // 
        hongbao:"",
        
        redbag:{
          user:false,  //定义红包优惠已享受
          id:"",       //红包id
          flag:"",     //重置红包列表
          // fone:false,  //是否显示优惠满减标签
          fone:false,  //满减时是否显示每期手续费（没优惠的）
          ftwo:false,  //是否显示优惠前每期应还
          fthree:false,//是否显示优惠前每期手续费
          yone:false,   //是否显示优惠前一次性手续费
          show:"",       //是否显示红包栏位
          text:"",  //红包状态    
          redUs:'',     // 美元红包个数
          redRmb:''    // 人民币红包个数
        }, 
        // 
          test:"",                      
          showPeriod:true,             //分期时费率列表显示‘期’字，一次性不显示
          cardList:[ ],                //卡列表
          installParam:[                 //期数列表
          {
            periods:"",                 //分期期数
            currencyNum:"",             //156币种
            feeRate:"",                 //费率
            payType:"",                 //支付方式
            planCode:""                 //计划编号
          },
         ],
       billAmt:"",                       //账单金额
       returnAmt:"",                     //剩余应还
       smppamt:"",                       //每期可申请金额
       instalAmt:"",                     //每期应还
       eachMoney:"",                     //每期本金
       eachCharge:"",                    //每期手续费
       currencyType:"",                  //币种
      //  自定义卡列表数据
       flag:'',                             //表示是否可办理
       mark:'',                             //标记flag=1在切能办理卡时按钮选中0项
       mainCard:{},                         //主卡
       index:"",                             //绑定主卡的索引   默认为index项。
       //自定义期数列表数据
       mainpay:{},                         //每一期的主列表（mainpay.period  mainpay.rate）
       indexpay:0,                           //默认第一个对象的期数
       repayment:"0",                        //分期后本应还
       maxNum:"",                            //可申请金额的最大值
       fenrmb:[],                            //分期支付对应的    人民币数据列表
       fendollar:[],                         //分期支付对应的    美元数据列表
       yirmb:[],                             //一次性支付对应的  人民币数据列表
       yidollar:[],                          //遍历主干
       frateList:[],                         //分期支付方式-  根据切换币种开关，确定传人民币与美元数据
       ptype:"",                             //
       poundagebj:"1",                       //每期应还本金
       poundage:""   ,                       //一次性手续费
       paymethod:"02",
       
      },              
  apply:{
        warm:false,                          //控制是否弹框
        in:0,                                //为0是分期  为1是一次性
        int:'3',                             //用来 标示期数索引 在没有切换期数时，默认是12期，当切换期时索引会跟着变
        mainpost:"",                        //主支付方式
        // nperList:[],
        // mainWay:'',
        List:[
          {payName:'分期支付', key:'02'},
          {payName:'一次性支付', key:'01'}
        ],
        tab:0  ,        //0显示分期页面，1显示一次性页面
      },
  baseData:{
        openId: '',
        traceId: '',
        channel: '',   //渠道
        version: '',
        data: {}
      },
  applyfail:{                              //错误弹框
        show:false,                        //是否显示
        title:"分期办理失败",                          //标题   
        msg:"",                             //错误信息
        err:"",
        btnTxt:"",
      }
};
const actions ={
  //  actions初始化-----------  请求首页数据
      set_homepagedata({commit,state},payload){      //payload是接受的总参数baseDate
        if(channel()=="hxdapp" &&  hxdappIsSpecial()){  //判断是否为好兴动
          payload.channel="hxdapp";                     //是 把channel赋值为""hxdapp"
        }
      installment.homeDate(payload).then((res)=>{
        //把payload传给后台
            if(res.success){ //拿到首页数据在判断flag   
            //  track("zdfq_tohandle","账单分期可办理")
              let red = {};
              red.redRmb = res.data.redPacketNumRMB;
              red.redUs = res.data.redPacketNumUSD;
              let tp = Object.assign({},state.homepage.redbag,red);
              commit('SET_RED',tp);                
              if(res.data.flag == 0){    //flag为0时
                  let obj = {}
                  obj.instalAmt=res.data.instalAmt;
                  obj.eachMoney=res.data.eachMoney;
                  obj.eachCharge=res.data.eachCharge;
                  obj.smppamt=res.data.smppamt;
                  obj.cardList=res.data.cardList
                  obj.inputmoney=res.data.smppamt;
                  obj.smppamt=res.data.smppamt;
                  obj.returnAmt=res.data.returnAmt;
                  obj.repayment=res.data.returnAmt-res.data.smppamt     //repayment赋默认值
                  obj.repayment=obj.repayment.toFixed(2)
                  obj.maxNum=res.data.smppamt;
                  obj.installParam=res.data.installParam;
                  obj.currencyType=res.data.currencyType;
                  obj.flag=res.data.flag;
                  obj.cardNoFirst = res.data.cardNoFirst;
                  obj.fenrmb=[];
                  obj.fendollar=[];
                  obj.yirmb=[];
                  obj.yidollar=[];
                  if(Number(obj.smppamt)<=100){
                    state.homepage.repayment= Number((state.homepage.returnAmt))-100
                    state.homepage.repayment=state.homepage.repayment.toFixed(2)
                  }
          //  处理i分期支付分类，排序数据
                    var arr=res.data.installParam
                    var fenrmb = [];                  //分期支付人民币列表
                    var fendollar = [];               //分期支付美元列表
                    for(var i=0;i<arr.length;i++){
                    if(arr[i].currencyType =="156" && arr[i].payType =='02'){
                      fenrmb.push(arr[i]);
                      // 分期人民币排序
                      function sortperiod(a,b){  
                      return a.period-b.period  
                      }
                      fenrmb.sort(sortperiod);
                    }  
                    else if(arr[i].currencyType =="840" &&arr[i].payType=='02'){
                    fendollar.push(arr[i]);
                    //  分期美元排序
                    function sortperiod(a,b){  
                    return a.period-b.period  
                    }
                    fendollar.sort(sortperiod);
                  }
                }
        //  排序，分类一次性支付数据
                    var arrtwo=res.data.installParam;
                    var yirmb=[];                 //一次性支付人民币列表
                    var yidollar=[]; 
                //一次性支付美元列表
                    for(var i=0;i<arrtwo.length;i++){
                      if(arrtwo[i].currencyType=="156" && arr[i].payType=="01"){
                        yirmb.push(arr[i])
                        // 一次人民币排序
                        function sortperiod(a,b){  
                          return a.period-b.period  
                          }
                          yirmb.sort(sortperiod);
                        
                      }else if(arrtwo[i].currencyType=="840" && arr[i].payType=="01"){
                        yidollar.push(arr[i])
                        // 一次性美元排序
                        function sortperiod(a,b){  
                          return a.period-b.period  
                          }
                          yidollar.sort(sortperiod);
                      }
                    }
                    obj.fenrmb=fenrmb
                    obj.fendollar=fendollar
                    obj.yirmb=yirmb
                    obj.yidollar=yidollar
                    obj.mainpay=obj.fenrmb[3];
                    //给首页塞默认费率值(修改--切卡时要不要重新判断塞值)
                    if(obj.currencyType=='156'){ //为人民币时
                          obj.frateList = obj.fenrmb;
                          state.btn.curency = true;
                          obj.hongbao = state.homepage.redbag.redRmb;
                      }
                      else if(obj.currencyType=='840'){
                        obj.frateList = obj.fendollar;
                        state.btn.curency = false;
                        obj.hongbao = state.homepage.redbag.redUs;
                      }

                     if( obj.hongbao == '0'){
                      state.homepage.redbag.show=false
                     }else{
                       state.homepage.redbag.show=true
                       state.homepage.redbag.text=`${obj.hongbao}个红包`
                     }
                    // 处理默认选中按钮与主卡
                    obj.cardList.map((value,index)=>{
                      if(obj.cardNoFirst==value.cardKey){
                          obj.mainCard=obj.cardList[index]  //给主卡赋值
                          obj.index=index  //绑定主卡的索引
                        }
                      })
                    // obj.mainCard=obj.cardList[0]
                      obj.installParam=res.data.installParam
                      obj.currencyType=res.data.currencyType        
                    //判断第一张卡的币种
                      if(obj.mainCard.cardType== "L"){           //L单 I双
                      state.btn.btnshow = false;
                    }else if(obj.mainCard.cardType== "I") {
                      state.btn.btnshow = true;
                      if(obj.currencyType == '156'){
                        // obj.frateList = obj.fenrmb;
                        state.btn.curency = true;    //false人民币  true 美元
                      }else{
                        // obj.frateList = obj.fendollar;
                        state.btn.curency = false;
                      }
                }
                    let temp = Object.assign({},state.homepage,obj);
                    commit('SET_HOMEPAGEDATA',temp)
              }else if(res.data.flag == 1){   //flag为1时
                      saAlert("账单分期首页","不可办理",res.code+res.msg,"报错提示")
                      state.homepage.mark=1   //  区分标志
                    //  flag=1时切卡
                      state.homepage.cardList=res.data.cardList;
                      state.homepage.installParam=res.data.installParam;
                      state.homepage.flag=res.data.flag;
                      state.homepage.mainCard=res.data.cardList[0];
                      var arr=res.data.installParam
                      var fenrmb = [];                  //分期支付人民币列表
                      var fendollar = [];               //分期支付美元列表
                      for(var i=0;i<arr.length;i++){
                      if(arr[i].currencyType =="156" && arr[i].payType =='02'){
                        fenrmb.push(arr[i]);
                        // 分期人民币排序
                        function sortperiod(a,b){  
                        return a.period-b.period  
                        }
                        fenrmb.sort(sortperiod);
                      }  
                      else if(arr[i].currencyType =="840" &&arr[i].payType=='02'){
                      fendollar.push(arr[i]);
                      //  分期美元排序
                      function sortperiod(a,b){  
                      return a.period-b.period  
                      }
                      fendollar.sort(sortperiod);
                    }
                  }
                  state.homepage.fenrmb=fenrmb
                  state.homepage.fendollar=fendollar
                  state.homepage.mainpay= state.homepage.fenrmb// 默认12期
                  if(state.homepage.mainCard.cardType== "L"){           //L单 I双
                    state.btn.btnshow = false;
                  }else if(state.homepage.mainCard.cardType== "I") {
                    state.btn.btnshow = true;
                    if(state.homepage.currencyType == '156'){
                      // obj.frateList = obj.fenrmb;
                      state.btn.curency = true;    //false人民币  true 美元
                    }else{
                      // obj.frateList = obj.fendollar;
                      state.btn.curency = false;
                    }
              }

                    //一次性支付美元列表
                    var arrtwo=res.data.installParam
                    var yirmb = [];                  //分期支付人民币列表
                    var yidollar = [];               //分期支付美元列表
                    for(var i=0;i<arrtwo.length;i++){
                      if(arrtwo[i].currencyType=="156" && arr[i].payType=="01"){
                        yirmb.push(arr[i])
                        // 一次人民币排序
                        function sortperiod(a,b){  
                          return a.period-b.period  
                          }
                          yirmb.sort(sortperiod);
                        
                      }else if(arrtwo[i].currencyType=="840" && arr[i].payType=="01"){
                        yidollar.push(arr[i])
                        // 一次性美元排序
                        function sortperiod(a,b){  
                          return a.period-b.period  
                          }
                          yidollar.sort(sortperiod);
                      }
                    }
                    state.homepage.yirmb=yirmb
                    state.homepage.yidollar=yidollar
                  //  flag=1时切卡
                  
              }else{     //flag=2时
                saAlert("账单分期首页","不可办理跳消费",res.code+res.msg,"报错提示")
                    state.alert.show=true;
              }
        }else{     //success为false时
         commit('SET_ERRORAJERT',{show: true, msg: res.msg, err: res.code})
         saAlert("账单分期首页","首页接口",res.code+res.msg,"报错提示")
        }
       }).catch((err)=>{
          if(err.response.status){
            commit('SET_ERRORAJERT',{show: true, msg:"网络请求超时，请稍后重试~", err: ""+err.response.status})
            saAlert("账单分期首页","首页接口", err.response.status+err.response.statusText,"请求报错")
          }else{
            commit('SET_ERRORAJERT', {show: true, msg: '请求失败,请稍后重试~', err: ''});
            saAlert("账单分期首页","首页接口", "请求失败","请求报错");
          }
       }) 
      },
      // 请求-------------切换卡片数据
   set_cardchangedata({commit,state},payload){       //payload：放index切卡索引 、总参数
      if(channel()=="hxdapp" &&  hxdappIsSpecial()){
        payload.baseData.channel="hxdapp";
      }
    installment.cardDate(payload.baseData).then((res)=>{
      console.log('00000000000000',res);
      state.homepage.redbag.flag = "1";
      console.log(state.homepage.redbag.flag)
      //  切卡
       if(res.success){
        //  切卡成功时埋点
        track("zdfq_changeCardSuccess","账单分期切卡成功")
        let obj = {};
         obj.mainCard=state.homepage.cardList[payload.index];
         obj.index=payload.index;
         obj.flag=0;
         obj.repayment=res.data.returnAmt-res.data.smppamt;    //repayment赋默认值
         obj.repayment=obj.repayment.toFixed(2)
         obj.maxNum = res.data.smppamt;                  //赋值最大值
         obj.returnAmt=res.data.returnAmt;
         obj.instalAmt = res.data.instalAmt;
         obj.eachCharge = res.data.eachCharge;
         obj.eachMoney = res.data.eachMoney;
         obj.currencyType = res.data.currencyType;
         obj.smppamt = res.data.smppamt;                       
         obj.returnAmt = res.data.returnAmt;
         obj.haveEnvelop = res.data.haveEnvelop;
         state.homepage.redbag.flag = "1";
         //flag=1时进行切卡
         state.homepage.mainpay = state.homepage.fenrmb[3]          //切换币种时默认18期

         state.apply.mainpost = state.apply.List[0] 
         state.apply.int=Number(3)                             //标识期数索引为3，切换时按钮选中12期
         state.apply.tab=0            
          //0为分期方式 mainpay是个对象 
         //切卡时判断每张卡的是156还是840
        if(obj.currencyType == '156'){
          state.btn.curency = true;    //false人民币  true 美元
          obj.frateList = state.homepage.fenrmb;
        }else{
          state.btn.curency = false;
          obj.frateList = state.homepage.fendollar;
        }

        if(obj.currencyType=='156'){
          obj.hongbao = state.homepage.redbag.redRmb;
          console.log('切卡红包个数000000',state.homepage.redbag.redRmb);
        }else{
          obj.hongbao = state.homepage.redbag.redUs;
        }

        if( obj.hongbao == '0'){
          state.homepage.redbag.show=false
        }else{
          state.homepage.redbag.show=true
          state.homepage.redbag.text=`${obj.hongbao}个红包`;
          // state.homepage.redbag.text=`${state.homepage.hongbao}个红包`;
        }
        state.homepage.redbag.fone=false;
        state.homepage.redbag.ftwo=false;
        state.homepage.redbag.fthree=false;
        state.homepage.redbag.yone=false
        let temp = Object.assign({},state.homepage,obj);
        // commit('SET_CARDCHANGEDATA',{index,temp})           //仍为索引index
        commit('SET_CARDCHANGEDATA',temp)      
       }else{
        commit('SET_ERRORAJERT',{show: true, msg: res.msg, err: res.code})
        saAlert("账单分期首页","账单分期切卡",res.code+res.msg,"报错提示")
        // commit('SET_HOMEPAGEDATA', {flag: 1});  //直接将这个对象代替state.homepage对象
        let obj = {};
        obj.index=payload.index;
        obj.mainCard=state.homepage.cardList[payload.index]
        obj.flag=1
        state.homepage.mainpay = state.homepage.fenrmb[3]          //切换币种时默认18期
        let test = Object.assign({},state.homepage,obj);
        commit('SET_HOMEPAGEDATA',test)
       }
     }).catch((err)=>{
       console.log('changeCard err',err);
      if(err.response.status){
        commit('SET_ERRORAJERT',{show: true, msg:"网络请求超时，请稍后重试~", err: ""+err.response.status})
        saAlert("账单分期首页","切卡接口", err.response.status+err.response.statusText,"请求报错")
      }else{
        commit('SET_ERRORAJERT', {show: true, msg: '请求失败,请稍后重试~', err: ''});
        saAlert("账单分期首页","切卡接口", "请求失败","请求报错");
      }
     })
   },
   //请求-----------------切换美元数据
   set_btndollar({commit,state},payload){
      if(channel()=="hxdapp" &&  hxdappIsSpecial()){
        payload.channel="hxdapp";
      }
    installment.setBtnDollar(payload).then((res)=>{
      if(res.success){ //成功时做数据处理
       console.log('00000000000000',res);
      let obj = {};
      let apply = {};
      apply.int=Number(3)                             //标识期数索引为3，切换时按钮选中18期
      state.apply.tab=0                               //tab为0是显示分期支付页面 为1显示一次性支付页面
      state.apply.in=0                                //支付方式选中按钮的索引   
      apply.mainpost = state.apply.List[0]            //0为分期方式 mainpay是个对象 
      obj.maxNum = res.data.smppamt                   //赋值最大值
      obj.mainpay = state.homepage.fenrmb[3]          //切换币种时默认18期
      obj.smppamt = res.data.smppamt;                 //重置smppamt
      obj.returnAmt = res.data.returnAmt;             
      obj.instalAmt = res.data.instalAmt;
      obj.eachCharge = res.data.eachCharge
      obj.eachMoney = res.data.eachMoney
      obj.haveEnvelop = res.data.haveEnvelop
      obj.returnAmt=res.data.returnAmt;
      obj.currencyType = res.data.currencyType
      obj.repayment=res.data.returnAmt-res.data.smppamt         //repayment赋默认值
      obj.repayment=obj.repayment.toFixed(2)
      state.homepage.redbag.flag = "1";
      // 切卡成功进行塞值
      obj.fenrmb=state.homepage.fenrmb;
      obj.fendollar=state.homepage.fendollar
      // 处理红包栏位

      if(obj.currencyType=='156'){ //为人民币时
        obj.frateList = obj.fenrmb;
        state.btn.curency = true;
        obj.hongbao = state.homepage.redbag.redRmb;
    }
    else if(obj.currencyType=='840'){
      obj.frateList = obj.fendollar;
      state.btn.curency = false;
      obj.hongbao = state.homepage.redbag.redUs;
    }

    if( obj.hongbao == '0'){
      state.homepage.redbag.show=false
     }else{
       state.homepage.redbag.show=true
       state.homepage.redbag.text=`${obj.hongbao}个红包`
     }
        state.homepage.redbag.fone=false;
        state.homepage.redbag.ftwo=false;
        state.homepage.redbag.fthree=false;
        state.homepage.redbag.yone=false

      let test = Object.assign({},state.apply,apply);
      let temp = Object.assign({},state.homepage,obj);
      commit('SET_BTNDOLLAR',{temp,test})
       }else{
        commit('SET_ERRORAJERT', {show: true, msg: res.msg, err: res.code});
        saAlert("账单分期首页","切换币种接口",res.code+res.msg,"报错提示")
      }      
     }).catch((err)=>{
      if(err.response.status){
        commit('SET_ERRORAJERT',{show: true, msg:"网络请求超时，请稍后重试~", err: ""+err.response.status})
        saAlert("账单分期首页","切换币种接口", err.response.status+err.response.statusText,"请求报错")
      }else{
        commit('SET_ERRORAJERT', {show: true, msg: '请求失败,请稍后重试~', err: ''});
        saAlert("账单分期首页","切换币种接口", "请求失败","请求报错");
      }
     })
   },
  // 试算------------------红包
  set_jsredbag({commit,state},payload){
    if(channel()=="hxdapp" &&  hxdappIsSpecial()){
      payload.data.channel="hxdapp";
    }
   installment.JsRedBag(payload.data).then((res)=>{
      if(res.success){
        console.log(payload.val.value.valueType)
        if(payload.val.value.valueType=="z"){  //选中折扣时
            state.homepage.redbag.ftwo=true;
            state.homepage.redbag.fthree=true;
            state.homepage.redbag.yone=true;
            state.homepage.redbag.fone=false;  //选中折扣，让满减时每期手续费不显示

          }else{
            state.homepage.redbag.ftwo=false;
            state.homepage.redbag.fthree=false;
            state.homepage.redbag.yone=true;
            state.homepage.redbag.fone=true;   //选中折扣，让满减时每期手续费显示
        }
        let obj = {};
         obj.payType = res.data.payType;       //支付方式
         obj.instalAmt = res.data.instalAmt;   //
         obj.eachCharge = res.data.eachCharge;
         obj.discountAmt = res.data.discountAmt;
         obj.discountCharge = res.data.discountCharge;
         obj.saleFee = res.data.saleFee;
         obj.poundagebj = res.data.yeachMoney;
         obj.poundage = res.data.oneCharge;
         obj.discountOneCharge = res.data.discountOneCharge;
         if(res.data.payType=='02'){
           obj.eachMoney = res.data.feachMoney  //eachMoney是分期里的每期应还本金
         }else{
          obj.eachMoney = res.data.yeachMoney
         }
         let test = Object.assign({},state.homepage,obj);
         commit('SET_JSREDBAG',test)
      }else{
        commit('SET_ERRORAJERT',{show: true, msg: res.msg, err: res.code})
        saAlert("账单分期首页","试算红包接口",res.code+res.msg,"报错提示")
      }
    }).catch((err)=>{
      if(err.response.status){
        commit('SET_ERRORAJERT',{show: true, msg:"网络请求超时，请稍后重试~", err: ""+err.response.status})
        saAlert("账单分期首页","试算红包接口", err.response.status+err.response.statusText,"请求报错")
      }else{
        commit('SET_ERRORAJERT', {show: true, msg: '请求失败,请稍后重试~', err: ''});
        saAlert("账单分期首页","试算红包接口", "请求失败","请求报错");
      }
     })
  },
   //申请-------------------------数据
   set_definite({commit,state},msg){
    if(channel()=="hxdapp" &&  hxdappIsSpecial()){
     msg.data.channel="hxdapp";
    }
   installment.setDefinite(msg.data).then((res)=>{
       if(res.success){
          track("zdfq_definite","账单分期申请成功")
          let obj = {}
          // obj.mainCard.cardNo=res.data.cardNo;   //主卡
          obj.smppamt=res.data.smppamt;
          obj.currencyType=res.data.currencyType;
          obj.fEachMoney=res.data.feachMoney;
          obj.yEachMoney=res.data.yeachMoney;
          obj.instalAmt=res.data.instalAmt;
          obj.eachCharge=res.data.eachCharge;
          obj.oneCharge=res.data.oneCharge;
          obj.planCode=res.data.planCode;
          obj.payType=res.data.payType;
          obj.instalAmt=res.data.instalAmt;
          obj.period = res.data.period;
          obj.bag = res.data.bag
          state.homepage.mainCard.cardNo=res.data.cardNo;
          //  处理成功页面是否显示优惠标志
          if(obj.bag=='0'){
            state.homepage.redbag.user=false; //定义红包优惠已享受
          }else{
            state.homepage.redbag.user=true;
          }

          let test = {
            cardNo:res.data.cardNo,
            currencyType:res.data.currencyType,
            smppamt:res.data.smppamt,
            payType:res.data.payType,
            period:res.data.period,
            flag:res.data.period,
            instalAmt:res.data.instalAmt,
            Feachmoney:res.data.feachMoney,
            Yeachmoney:res.data.yeachMoney,
            eachCharge:res.data.eachCharge,
            oneCharge:res.data.oneCharge
          };
               // 支付方式
         if(test.payType=='01'){
          state.apply.in=1
          test.payType='一次性支付'
        }else{
          state.apply.in=0
          test.payType='分期支付'
        }
         //币种
        if(test.currencyType=='156'){
          test.currencyType='人民币'
          state.btn.curency = true
        }else{
          test.currencyType='美元'
          state.btn.curency = false
        }
          // 路由传参
          test = JSON.stringify(test);
          msg.router.push({path:'/Installment/SuccessPage',query:{value:test}});
         let period = obj.period;
         let temp = Object.assign({},state.homepage,obj);
       commit('SET_DEFINITE',{temp,period})
          // commit('SET_DEFINITE',temp)
       }else{
        commit('SET_APPLYFAIL', {show: true, msg: res.msg, title:state.applyfail.title , err:res.code});
        saAlert("账单分期首页","申请按钮",res.code+res.msg,"报错提示")
       }
    }).catch((err)=>{
      if(err.response.status){
        commit('SET_ERRORAJERT',{show: true, msg:"网络请求超时，请稍后重试~", err: ""+err.response.status})
        saAlert("账单分期首页","申请按钮", err.response.status+err.response.statusText,"请求报错")
      }else{
        commit('SET_ERRORAJERT', {show: true, msg: '请求失败,请稍后重试~', err: ''});
        saAlert("账单分期首页","申请按钮", "请求失败","请求报错");
      }
    })
   },
   fail({state,commit},payload){
    let obj = {};
    obj.mainpay = state.homepage.fenrmb[payload]
    if(state.apply.List[state.apply.in].payName=='分期支付'){
          obj.showPeriod=true
          obj.eachMoney = Number(state.homepage.smppamt)/Number(state.homepage.frateList[payload].period)
          console.log(state.homepage.frateList[payload].period)
          obj.eachMoney = obj.eachMoney.toFixed(2)
         //每期手续费
         obj.eachCharge=Number(state.homepage.smppamt)*(state.homepage.frateList[payload].rate)
         obj.eachCharge = obj.eachCharge.toFixed(2)
        // 处理每期应还=每期本金+每期手续费
         obj.instalAmt=Number(obj.eachCharge)+Number(obj.eachMoney)
         obj.instalAmt=obj.instalAmt.toFixed(2)
    }else if(state.apply.List[state.apply.in].payName=='一次性支付'){
         obj.showPeriod=false
         obj.poundagebj=Number(state.homepage.smppamt)/Number(state.homepage.frateList[payload].period)
        //  obj.poundagebj = Number(obj.poundagebj.toFixed(2))
        obj.poundagebj = Number((parseFloat(obj.poundagebj))).toFixed(2)
        
         console.log(obj.poundagebj)
         obj.poundage=Number(state.homepage.smppamt)*(state.homepage.frateList[payload].rate)
         obj.poundage = Number(obj.poundage.toFixed(2))
        } 
    let temp = Object.assign({},state.homepage,obj);
      commit('FAIL',temp)
  }
};
// mutations
const mutations = {
  // 设置红包id
  SET_ID(state,payload){
    state.homepage.redbag.id=payload
  },
  // 控制滚动穿透
  SET_BGFIXED(state,payload){
    state.fixed=payload.fixed;
  },
  SET_RED(state,payload){
    state.homepage.redbag=payload
  },
  SETBASEDATA(state,payload){    //响应总参数
    state.baseData.data=payload; //突变data参数
  },
  FAIL(state,payload){           //计算数据
    state.homepage=payload
   },
   //  mutations-----------首页初始化
   SET_HOMEPAGEDATA(state,payload){
    state.homepage=payload;
    console.log("SET_HOMEPAGEDATA",payload);
   },
   //  请求切换卡片数据
   SET_CARDCHANGEDATA(state,payload){
    state.homepage=payload
   },
  //  红包试算
   SET_JSREDBAG(state,payload){
     state.homepage=payload
   },
    //  分期支付时，切换期数触发的请求    默认12期
   SETCOUNT(state,payload){ 
     state.homepage.mainpay = state.homepage.fenrmb[payload]  //点中哪期显示标题  mainpay是个对象，mainpay.period是对应期
     state.homepage.returnAmt  //剩余应还
     state.homepage.eachMoney  //每期本金  
     state.homepage.instalAmt  //每期应还
     state.homepage.eachCharge  //每期手续费
   },
   GETCOUNT(state,payload){
   },
  // 一次性支付时，切换期数时触发的请求   期数由分期支付的期数带过来
   SETRATEONE(state,index){    
    //  处理每期应还本金
    state.homepage.poundagebj=Number(state.homepage.smppamt)/Number(state.homepage.yirmb[index].period)
   let  poundagebj=state.homepage.poundagebj.toFixed(2)
    state.homepage.poundagebj=poundagebj
    //  处理一次性支付的  一次性手续费
    state.homepage.poundage=Number(state.homepage.smppamt)*Number(state.homepage.yirmb[index].rate)
   let  poundage=state.homepage.poundage.toFixed(2)
    state.homepage.poundage=poundage
  },
  SET_ERRORAJERT(state,payload){
    state.erroralert.show = payload.show;
    state.erroralert.msg = payload.msg;
    state.erroralert.err = payload.err;
},
SET_APPLYFAIL(state,payload){
    state.applyfail.show = payload.show;
    state.applyfail.title = payload.title
    state.applyfail.msg = payload.msg;
    state.applyfail.err = payload.err;
},
 //请求切换美元数据 
 SET_BTNDOLLAR(state,payload){
  state.homepage=payload.temp
  state.apply=payload.test
 },
 //申请接口
 SET_DEFINITE(state,payload){
   state.homepage=payload.temp;
   state.homepage.frateList[state.apply.int].period=payload.period;
   console.log(state.homepage.installParam[state.apply.int].period)
 },
};
export default {
    namespaced: true,
    state,
    actions,
     mutations,
    //  getters
}