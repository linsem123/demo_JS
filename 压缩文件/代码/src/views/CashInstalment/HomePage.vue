<template lang="pug">
.container(:class="fixed?'bg_fixed container':'container'")
  ylChangeCard(:mainCard="a.mainCard" :cardIndex="a.index" :cardList="a.cardList" @setFixed="setFixed" @change="changeCard")
  .sep
  .apply(v-if="a.xjfq === 'YES'")
    BInputMoney(title="现金分期" :bgImg="path" :bankName="a.debitCard[1]" :maxNum="a.lastCalava" :num="a.applyNum" minNum="1000" inputTxt="最高可借  ￥" @passMax="calculate" Fcolor="#F63E4B")
    YPayMethod(mode="simple" :flag="a.instalmentResult.flag" @confirm="confirmPM" label="手续费支付方式")
    YInstalPeriod(mode="simple" :period="a.period" @confirm="confirmIP" label="分期期数")
    .try-compute(v-if="a.instalmentResult.flag=='02'")
      .each-period
        span.one 每期应还
        p
          span.three(v-if="(a.instalmentResult.discountAmt!=null)&&(a.instalmentResult.discount)") ¥{{a.instalmentResult.discountAmt}} &nbsp;
            i.beforeDis
          span.four ¥{{a.instalmentResult.instalAmt}}
      .each-period.discount
        span.one 每期本金
        .two
        p 
          //- span.three(v-if="(a.instalmentResult.discountMoney!=null)&&(a.instalmentResult.discount)") ¥{{a.instalmentResult.discountMoney}} &nbsp;
          //-   i.beforeDis
          span.four ¥{{a.instalmentResult.eachMoney}}
      .each-period.discount
        span.one 每期手续费
        .two
        p
          span.three(v-if="(a.instalmentResult.discountCharge!=null)&&(a.instalmentResult.discount)") ¥{{a.instalmentResult.discountCharge}} &nbsp;
            i.beforeDis
          span.four ¥{{a.instalmentResult.eachCharge}}
      .each-period(v-show="(a.debitCard[1]!='兴业银行')&&(a.debitCard[1]!='')&&(a.instalmentResult.extra!=null)")
        span.one 跨行转账另收
        span.four ¥{{a.instalmentResult.extra}}
    .try-compute(v-if="a.instalmentResult.flag=='01'")
      .each-period
        span.one 每期应还本金
        span.four ¥{{a.instalmentResult.oneAmt}}
      .each-period 
        span.one 一次性手续费
        p
          span.three(v-if="(a.instalmentResult.discountOneCharge!=null)&&(a.instalmentResult.discount)") ¥{{a.instalmentResult.discountOneCharge}} &nbsp;
            i.beforeDis
          span.four ¥{{a.instalmentResult.oneCharge}}
      .each-period(v-show="(a.debitCard[1]!='兴业银行')&&(a.debitCard[1]!='')&&(a.instalmentResult.extra!=null)")
        span.one 跨行转账另收
        span.four ¥{{a.instalmentResult.extra}}
    BdebitSelect(:nocard="!a.hasCard" :hascard="a.hasCard" :choseShow="a.debitIndex" @goAdd="goAdd" :bankName="a.debitCard[1]" :bankNum="a.debitCard[0]" :debitList="a.debitcardList" @setFixed="setFixed" @getdebitcard="getdebitcard" @deleteCard="deleteCard" @btnConfirm="btnConfirm")
    YFundUsage(mode="simple" :usage="a.usage" :columns="a.usageListStrings"  @confirm="confirmFU" label="资金用途")
    .sep
    ylTextCode(:innerHeight="innerHeight" :textMsg="a.textMsg.msg" label="短信验证码" @getCode="getSmsCode" @achieveValue="achieveValue" :clickBl="a.textMsg.clickBl" type="XJFQ")
    .tip 短信验证码将发送至您信用卡在我行预留的手机号{{textMsg}}
    .agreement
      //- span(:class="a.checkRule?'active check':'check'" @click="a.checkRule=!a.checkRule")
      //- span.text 我承诺不会将现金分期获得的资金用于投资和生产经营（包括但不限于购房、股票、期货及其他股本权益性投资），仅用于消费。同意并接受 
      i(@click="toRule") 《现金分期付款业务条款与细则》
    ylBtn(@confirmbtn="submitFun" margin='' bgcolor='#F3F5F9' :btnBgcolor="a.action=='0'?'#0076ff':'#CCD0DB'" text="同意条款细则并提交")
    .remind(@click="a.showRemind=!a.showRemind") 温馨提示
  .try(v-else-if="a.xjfq === 'NO'")
    img.fail(src="@/assets/images/cashInstalment/fail.png")
    p.tips 您该张卡片现金分期可用额度不足，您可以点击页面上方切换卡片或试试随借金，到期还本随借随还
    ylBtn.btn(@confirmbtn="checktable" margin='' bgcolor='' btnBgcolor="#0076ff" text="试试随借金")
    .adv
      a.adv-item(v-for="img in a.advList" :href="img.href")
        img(:src="img.path")
    YVersion(top="4%" :version="version")
  .load(v-else)
  .remind_filt(v-show="a.showRemind")
    .remind_box
      .remind_tit 温馨提示
      .remind_text
        p 1.本业务限人民币币种，您可申请支取的现金金额在本人信用卡预借现金可用额度范围内，您每次申请的金额最低为人民币1000元，最高为人民币30万元。
        p 2.您成功办理现金分期业务而支取的现金款项由本行划入您个人名下的国内银行人民币储蓄结算账户（该账户不得为证券客户结算资金关联储蓄账户），该款项不得用于投资仅限用于消费。您必须保留现金款项的相关消费凭证，本行拥有随时调阅消费凭证的权利。
        p 3.您申请的现金分期业务一经成功办理，不可随意撤销，不可对分期期数进行更改。
        p 4.无论手续费一次性支付或分期支付，您办理的现金分期未还本金和已下账手续费均会占用您的可用额度。
      .remind_btn(@click="a.showRemind=!a.showRemind") 我知道了
  YVersion(top="4%" :version="version" v-show="(a.xjfq==='YES')")
  YErrorAlert(:show="alert.home.show" :msg="alert.home.msg" :err="alert.home.err" @confirm="errAlertFun")
  BapplyFail(:show="alert.applyFail.show" title="现金分期申请失败" :msg="alert.applyFail.msg" :err="alert.applyFail.err" btnTxt="重新请求" @apllayFailBtn="apllayFailBtn")
  ylImageCode(v-if="imgCode.show" :bigImgSrc="imgCode.bigImgSrc" :tarImgSrc="imgCode.tarImgSrc" @checkImgCode="checkImgCode" @freshImgCode="freshImgCode")
</template>

<script>
import ylChangeCard from "@/components/ylChangeCard";
import {mapGetters, mapState} from 'vuex';
import YAlert from "@/components/YAlert";
import YErrorAlert from "@/components/YErrorAlert";
import YFunctionBtn from "@/components/YFunctionBtn";
import ylBtn from "@/components/ylBtn";
import ylImageCode from "@/components/ylImageCode";
import YVersion from "@/components/YVersion";
import YPayMethod from "@/components/YPayMethod";
import YInstalPeriod from "@/components/YInstalPeriod";
import YFundUsage from "@/components/YFundUsage";
import ylTextCode from "@/components/ylTextCode";
import BInputMoney from "@/components/BInputMoney";
import BdebitSelect from "@/components/BdebitSelect";
import BapplyFail from "@/components/BapplyFail";
import {initsa,track,saAlert,getSearch,setHeight,environment,channel,hxdappIsSpecial} from "@/assets/js/common.js";
import api from '@/api/cashInstalment.js';
export default {
    name: "HomePage",
    components: {
    BInputMoney,BdebitSelect,
    BapplyFail,
    ylTextCode,
    YFundUsage, YInstalPeriod, YPayMethod, YVersion, YFunctionBtn,ylBtn,ylImageCode,YErrorAlert, YAlert, ylChangeCard},
    computed: {
      ...mapState({
        a: state => state.ci.home,
        alert: state => state.ci.alert,
        version: state => state.ci.version,
        imgCode:state => state.ci.imgCode,
        baseData:state => state.ci.baseData,
        fixed:state=>state.fixed,
        innerHeight:state=>state.innerHeight
      }),
    },
  data(){
    return{
      bl:true, //input组件传来的标志
      path:require('@/assets/images/cashInstalment/bg.png'),
      textMsg:""  //测试短信验证码,
    }
  },
  created(){
    initsa("现金分期首页");
    let obj = {
      "certType":"",
    	"certNo":""
    }
    this.$store.commit("ci/SETBASEDATA",obj);
    this.$store.dispatch('ci/getCashIntalStart',{data:this.baseData,store:this.$store});
  },
  mounted(){
    this.a.promoteCode=getSearch("promoteCode"); //推广人id
  },
  methods:{
    setFixed(bl){
      this.$store.commit("SET_BGFIXED",{fixed:bl.bl});
    },
    changeCard(index){ //切换卡号
      track("XJFQ_changeCard","切换卡号");
      // this.a.index=index;
      // this.a.mainCard = this.a.cardList[index];
      let obj = {  //接口请求
        cardKey:this.a.cardList[index].cardKey,
        mpType:"B",   //A灵活分期  B现金分期 M邮购分期 P pos分期 F账单分期 D自动分期
        cpNo:"",      //分期计划
        period:this.a.period,    //分期期数
        payType:this.a.instalmentResult.flag,   //支付方式
        opt:"0",       //试算选项 0-按分期计划试算  1-按分期产品试算
        rate:"",       //费率
        currNom:"156"  //币种
      }
      _.forEach(this.a.rateInfos,(item,index)=>{
        if(item.pay_type==this.a.instalmentResult.flag&&item.period==this.a.period){
          obj.cpNo = item.plan_code;      //分期计划
          obj.rate = item.rate;           //费率
        }
      })
      this.$store.commit("ci/SETBASEDATA",obj);
      this.$store.dispatch("ci/changeCard",{data:this.baseData,store:this.$store,index:[this.a.index,index]});
    },
    setBaseData(){ //试算
      if(this.bl==false){
        this.a.action = "1";
        return
      }else{
        if(this.a.debitcardList.length==0){
          this.a.action="2";
        }else if(this.a.textMsg.code==""){
          this.a.action="3";
        }else{
          this.a.action="0";
        }
        track("XJFQ_trialByCashInstall","试算");
        let obj = {
          cardKey:this.a.mainCard.cardKey,   //获取卡号的key
          mpType:"B",//分期类型
          planCode:"",//分期计划(4位)
          applyAmt:Number(this.a.applyNum),  //申请金额
          currNom:"156",//人民币种
          period:this.a.period,//分期期数
          opt:0,//试算选项
          payType:this.a.instalmentResult.flag, //支付方式
          rate:""//费率
        }
        _.forEach(this.a.rateInfos,(item,index)=>{
          if(item.pay_type==this.a.instalmentResult.flag&&item.period==this.a.period){
            obj.planCode = item.plan_code;  //分期计划
            obj.rate = item.rate;           //费率
          }
        })
        this.$store.commit("ci/SETBASEDATA",obj);
        this.$store.dispatch("ci/trialByCashInstall",this.baseData);
      }
    },
    calculate(obj){               //申请金额正确
      if(obj.bl==false){          //查询到数据 添加进组件 第一次不用请求试算
        this.bl=false;
      }else if(obj.bl==true){
        this.bl=true;
      }
      this.$store.commit('ci/SETAPPLYNUM',obj.applyNum);
      this.setBaseData();
    },
    confirmPM(key){ //选择支付方式 确认
      this.$store.commit('ci/SETPAYMETHOD',key);
      this.setBaseData();
    },
    confirmIP(key){ //选择分期数
      this.$store.commit('ci/SETINSTALPERIOD',key);
      this.setBaseData();
    },
    goAdd(){
      let obj = {
        name:this.a.name,  
        identNum:this.a.identNum, //身份证
        mainCard:this.a.mainCard, //选卡
        cardIndex:this.a.index, //卡标记
        applyNum:this.a.applyNum, //金额
        lastCalava:this.a.lastCalava, //最高可借
        period:this.a.period, //分期期数
        debitIndex:this.a.debitIndex,          //借记卡选择
        usage:this.a.usage,   //资金用途
        instalmentResult:this.a.instalmentResult  //试算数据
      }
      localStorage.setItem("XJFQ",JSON.stringify(obj));
      this.$router.push({path:"/addDebitCard"});
      if(!this.a.textMsg.clickBl){
        clearInterval(this.a.textMsg.t);
        this.a.textMsg.msg="重新获取"; 
        this.a.textMsg.code="";
        this.a.textMsg.clickBl=true;
      }
    },
    getdebitcard(value){ //选择借记卡
      // console.log("getdebitcard",value);
      this.a.debitCard = value.data;
      this.a.debitIndex = value.index;
      this.$store.commit("SET_BGFIXED",{fixed:false});
    },
    deleteCard(obj){     //删除借记卡
      console.log("deleteCard",obj);
    },
    btnConfirm(removeCard){//确认删除借记卡操作
      // console.log("btnConfirm",removeCard);
      //删除借记卡接口
      let obj = {
        cardNo:this.a.identNum,     //身份证号
        bankNO:removeCard.cardNum,  //卡号
        index:removeCard.cardIndex  
      }
      this.$store.dispatch("delBankInfo",obj);
    },
    countdown(n){
      this.a.textMsg.clickBl=false;
      this.a.textMsg.msg = n + "秒";
      // let timer = null;
      clearInterval(this.a.textMsg.t);
      this.a.textMsg.t=setInterval(()=>{
          n--;
          if(n>0&&n<10){
              n="0"+n;
          }
          this.a.textMsg.msg=n+"秒";
          if(n==-1){
              clearInterval(this.a.textMsg.t);
              this.a.textMsg.msg="重新获取"; 
              this.a.textMsg.clickBl=true;
          }
      },1000);
    },
    confirmFU(key){ //选择资金用途
      this.$store.commit('ci/SETFUNDUSAGE',key);
    },
    getSmsCode(){
        if(this.a.textMsg.clickBl){
            this.checkImgCode();
        }
    },
    checkImgCode(moveX){  //图形验证码 验证
      track("XJFQ_getsms","获取验证码");
      this.a.textMsg.clickBl=false;
      let obj = {
          cardKey:this.a.mainCard.cardKey,
          type:"CASH",
          hkLength:0
      }
      if(moveX){
          obj.hkLength=parseInt(moveX);
      }
      this.$store.commit("ci/SETBASEDATA",obj);
      if(channel()=="hxdapp"&&hxdappIsSpecial()){
        this.baseData.channel="hxdapp";
      }
      api.sendSmsCode(this.baseData).then((res)=>{  
          let imgobj = { 
              show:false,
              moveX:"",
              bigImgSrc:"",
              tarImgSrc:""
          }
          this.$store.dispatch("ci/setImgcode",imgobj);
          this.$store.commit("SET_BGFIXED",{fixed:false});
          if(res.success){
            if(res.data.noFirstSend=="1"){
                // console.log("第一次无滑动验证码");
                this.countdown(120);
                if(res.data.smsCode!=undefined&&res.data.smsCode!=null&&res.data.smsCode!=''){
                    this.textMsg = res.data.smsCode;            // 显示短信验证码
                    // console.log("测试环境验证码",this.textMsg);
                }else{
                    this.textMsg = '';
                }
            }else if(res.data.noFirstSend=="0"){
                // console.log("获取滑动验证码图片");
                this.a.textMsg.code="";
                this.freshImgCode();
            }
          }else{
            this.a.textMsg.clickBl=true;
            this.a.textMsg.code="";
            let obj = {
                show:true,
                msg:res.msg,
                err:res.code
            }
            this.$store.commit("ci/SETHOMEALERT",obj);
            if(res.code=="ERR_02"){
              this.countdown(60)
            }
            saAlert("现金分期","短信验证码",res.msg,"报错提示");
          }
        }).catch((err)=>{
          this.a.textMsg.clickBl=true;
          if(err.response.status){
          this.$store.commit("ci/SETHOMEALERT",{show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
            saAlert("现金分期","短信验证码",err.response.status+err.response.statusText,"请求报错");
          }else{
            this.$store.commit("ci/SETHOMEALERT",{show: true, msg: '请求失败，请稍后重试~', err: ''});
            saAlert("现金分期","短信验证码","请求失败","请求报错");
          }  
        });
    },
    freshImgCode(){ //刷新图片
      track("XJFQ_getSlider","获取滑块");
      let obj = {
          cardKey:this.a.mainCard.cardKey,
          type:"CASH"
      }
      this.$store.commit("ci/SETBASEDATA",obj);
      if(channel()=="hxdapp"&&hxdappIsSpecial()){
        this.baseData.channel="hxdapp";
      }
      api.getSlider(this.baseData).then((res)=>{  //get请求
          // console.log("getSlider res:",res);
          let imgobj = {  //
              show:false,
              moveX:"",
              bigImgSrc:"",
              tarImgSrc:""
          }
          this.$store.dispatch("ci/setImgcode",imgobj);
          if(res.success){
              let obj = {
                  show:true,
                  moveX:"",
                  bigImgSrc:res.data.bigimgStr,
                  tarImgSrc:res.data.tarimgStr
              }
              this.$store.dispatch("ci/setImgcode",obj);
              this.$store.commit("SET_BGFIXED",{fixed:true});
          }else{
              let imgobj = {
                  show:false,
                  moveX:"",
                  bigImgSrc:"",
                  tarImgSrc:""
              }
              this.$store.dispatch("ci/setImgcode",imgobj);
              let obj = {
                  show:true,
                  msg:res.msg,
                  err:res.code
              }
              this.$store.commit("ci/SETHOMEALERT",obj);
              this.$store.commit("SET_BGFIXED",{fixed:true});
              saAlert("现金分期","获取滑块",res.msg,"报错提示");
          }
      }).catch((err)=>{
          if(err.response.status){
            this.$store.commit("ci/SETHOMEALERT",{show: true, msg: "网络请求超时，请稍后重试~", err:""+err.response.status});
            saAlert("现金分期","获取滑块",err.response.status+err.response.statusText,"请求报错");
          }else{
            this.$store.commit("ci/SETHOMEALERT",{show: true, msg: '请求失败，请稍后重试~', err: ''});
            saAlert("现金分期","获取滑块","请求失败","请求报错");
          }  
          console.log("getSlider err:",err);
      });
    },
    achieveValue(smsCode){  //密码从组件带过来
      this.a.textMsg.code=smsCode;   
      if(smsCode==""){
        this.a.action="3";
      }else{
        if(this.bl==false){
          this.a.action="1";
        }else if(this.a.debitcardList.length==0){
          this.a.action="2";
        }else{
          this.a.action="0";
        }
      }
    },
    submitFun(){  //提交按钮
      if(this.a.action=="0"){
        track("XJFQ_APPLY","现金分期申请按钮");
        this.a.action="3";
        let obj = {
          cardKey:this.a.mainCard.cardKey, //
          debitCard:this.a.debitCard[0],   //借记卡卡号
          debitBank:this.a.debitCard[1],   //借记卡银行
          debitBankNo:this.a.debitCard[3], //借记卡 卡bin
          accountName:this.a.debitCard[2],  //持卡人姓名
          idCard:this.a.identNum,       //持卡人身份证
          extra:this.a.instalmentResult.extra,        //跨行手续费(本行不填)
          payType:this.a.instalmentResult.flag,      //支付方式 01-一次性 02分期
          planCode:"",     //分期计划
          instalCount:this.a.period,  //分期期数
          tradeLimit:this.a.applyNum,   //交易金额
          useTo:this.a.usage,        //分期用途
          isLocal:"01",      //是否本行 00-本行 01-他行
          source:"WX",       //渠道
          promoteCode:this.a.promoteCode,  //推广标识
          smsCode:this.a.textMsg.code,
          type:"CASH"
        }
        _.forEach(this.a.rateInfos,(item,index)=>{
          if(item.pay_type==this.a.instalmentResult.flag&&item.period==this.a.period){
            obj.planCode = item.plan_code;  //分期计划  
          }
        })
        if(this.a.debitCard[1]=="兴业银行"){
          obj.isLocal="00";
        }
        this.$store.commit("ci/SETBASEDATA",obj);
        this.$store.dispatch("ci/applyCashInstal",{data:this.baseData,router:this.$router});
      }
    },
    checktable(){ //推广随借金
      let str=environment();
      // window.location.href="https://test.xliane.com/evercos/main/borrowing/index.html";                //测试UAT
      // window.location.href="https://test.xliane.com/evercos2/main/borrowing/index.html";            //测试主干
      // window.location.href=str+"borrowing/index.html";            //测试分支
      window.location.href=str+"myhtml/cardPage/fins_index_%23_BorrowedMoney_HomePage.html";            //测试分支
      // window.location.href="https://ccshop.cib.com.cn:8010/evercos/main/myhtml/cardPage/fins_index_%23_BorrowedMoney_HomePage.html";   //生产
      track("XJFQ_SJJ","去随借金页面");
    },
    apllayFailBtn(){//申请失败弹框按钮
      let obj = {
        show: false,
        msg: '',
        err: ''
      }
      this.$store.commit("ci/SETAPPLYFAIL",obj);
    },
    errAlertFun(){ //请求false 弹框按钮
      this.$store.commit("SET_BGFIXED",{fixed:false});
      let obj = {
          show:false,
          msg:"",
          err:""
      }
      this.$store.commit("ci/SETHOMEALERT",obj);
    },
    toRule(){   //条款与细则
      track("XJFQ_XZ","条款与细则");
      let obj = {
        name:this.a.name,  
        identNum:this.a.identNum, //身份证
        mainCard:this.a.mainCard, //选卡
        cardIndex:this.a.index,        //卡标记
        applyNum:this.a.applyNum,      //金额
        lastCalava:this.a.lastCalava, //最高可借
        period:this.a.period,         //分期期数
        debitIndex:this.a.debitIndex,          //借记卡选择
        usage:this.a.usage,   //资金用途
        instalmentResult:this.a.instalmentResult  //试算数据
      }
      localStorage.setItem("XJFQ",JSON.stringify(obj));
      if(!this.a.textMsg.clickBl){
        clearInterval(this.a.textMsg.t);  //短信验证码需重新获取
        this.a.textMsg.msg="重新获取"; 
        this.a.textMsg.code="";
        this.a.textMsg.clickBl=true;
      }
      window.location.href="http://mobile.cib.com.cn/creditcard/stage/other/xjfq_xz.html"
    }
  }
}
</script>

<style scoped lang="stylus">
.container
  width 100%
  height 100%
  overflow-x hidden
  background #F3F5F9
  .sep
    width 100%
    height 0.1rem
    background #F3F5F9
  .apply
    background #fff
    width 100%
    .tip
      width 100%
      font-size 0.12rem
      line-height 0.28rem
      color #666
      padding-left 5.3%
      opacity 0.5
    .try-compute
      width 77.1%
      padding 3.2% 6.4%
      margin-left 5.1%
      background rgba(0,186,177,0.15)
      .each-period
        display flex
        align-items center
        justify-content space-between
        margin-bottom 0.05rem
        font-size 0.12rem
        line-height 0.12rem
        .one
          height 0.12rem
        .two
          margin 0 0.05rem
          flex 1
          height 0.12rem
          background url("../../assets/images/cashInstalment/slh.png") repeat-x center
          background-size 0.5rem 0.02rem
        .three
          color rgba(0,0,0,0.30);
          position relative
          .beforeDis
            position absolute 
            width 92%
            height 0.01rem;
            background rgba(0,0,0,0.30)
            top 48%
            left 0
        .four 
          color #00B2B7
      .each-period:nth-last-child(1) 
        margin 0
      .discount
       font-size 0.1rem
    .agreement
      padding 0.2rem 5.3%
      background #F3F5F9
      display flex
      justify-content space-between
      .check 
        display inline-block 
        width 0.5rem
        height 0.18rem
        border-radius 50%
        margin-right 0.1rem
        position relative
        top 0.02rem
        background url("../../assets/images/cashInstalment/uncheck.png") no-repeat center
        background-size 100% 100%
      .active 
        border none 
        background url("../../assets/images/cashInstalment/checked.png") no-repeat center
        background-size 100% 100%
      .text
        font-family PingFangSC-Regular;
        font-size 0.12rem 
        color #666
        line-height 0.18rem
      i 
        font-italic nomal 
        font-size 0.12rem 
        color #0060F1
    .remind 
      width 100%
      text-align center 
      font-size 0.12rem
      color #0060F1
      font-family PingFangHK-Regular
      letter-spacing 0
      background #F3F5F9
      padding-top 0.16rem
  .remind_filt
    width 100%
    height 100%
    position fixed
    left 0 
    top 0
    background rgba(0,0,0,0.4)
    .remind_box 
      width 72.3%
      // height 43%
      background #fff
      position absolute
      left 50%
      top 50%
      transform translate(-50%,-50%)
      border-radius 0.1rem
      padding 0.2rem 0.2rem 0
      border-box box-sizing 
      .remind_tit 
        font-family Helvetica
        font-size 0.16rem
        height 0.32rem
        line-height 0.32rem
        color #000000
        letter-spacing 0
        text-align center
      .remind_text
        height 2.63rem
        margin-top 0.1rem
        overflow auto
        p
          font-family PingFangSC-Regular
          font-size 0.14rem
          color #666666
          letter-spacing 0
          line-height 0.2rem
      .remind_btn
        font-family PingFang-SC-Regular
        font-size 0.16rem
        height 0.44rem
        line-height 0.44rem
        color #0060F1
        letter-spacing -0.0038rem
        text-align center
        border-top 0.01rem solid #eaeaea
        margin-top 0.2rem
  .try
    background #fff
    width 100%
    height 91.5%
    .fail
      width 37.3%
      margin-left 31.7%
      margin-top 15.7%
    .tips
      width 78.9%
      margin-left 10.5%
      margin-top 10%
      font-size 0.16rem
      line-height 0.24rem
      text-align center
    .btn
      margin-top 10.4%
    .adv
      width 89.3%
      margin-left 5.3%
      .adv-item
        display inline-block
        width 100%
        &:first-child
          margin-top 20.8%
        &:not(:first-child)
          margin-top 5%
        img 
          display inline-block
          width 100%
.bg_fixed
  position fixed
  overflow hidden
  top 0
  left 0
  bottom 0
  right 0

</style>
