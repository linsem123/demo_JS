<template>
  <div :class="fixed?'bg-fixed main':'main'">
    <div class="container">
      <BNcreditSelect :cardNo="homedata.creditcardNum.cardNo" :creditList="pubui.creditList" @showCredit="showCredit"
      @getcreditcard="getcreditcard" @creCancel="creCancel" :choseShow="homedata.creditIndex" ctitle="选择信用卡"></BNcreditSelect>   
      <div class="blank"></div>
      <div id="banner">
        <img src="@/assets/images/Sxf/banner.png" alt="" class="bgImg">
        <div class="banner-text">
          <div class="banner-title">申请金额</div>
          <div class="banner-top">{{failremind}}</div>
          <div class="banner-middle">
            <span class="sign-one">￥</span>
            <input type="tel" pattern="[0-9]" maxlength="9" id="applyMoney" placeholder="请输入申请金额" v-model="homedata.applyMoney" @input="passMax"
            @focus="focusNum" @blur="checkNum" ref="applyMoney"> 
            <img src="@/assets/images/Sxf/del.png" alt="" @click="Delete" v-if="delShow" >
            <img src="@/assets/images/Sxf/modify.png" alt="" @click="Modify" v-if="modShow">
          </div>
          <div class="banner-line"></div>
          <div class="banner-bottom">
            <span class="banner-txt">最高可借 ￥{{homedata.maxMoney}}</span><span class="banner-content">该额度不占用您的固定额度</span>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="input-cell" @click="payClick">
          <div class="cell-left"><label for="paytype">手续费支付方式</label></div>
          <div class="cell-middle">
            <input type="text" id="paytype" v-model="homedata.paytype" readonly="readonly" ref="paytype"/>
          </div>
          <div class="cell-right">
            <img src="@/assets/images/Sxf/arrow.png" alt="">
          </div>
        </div>
        <van-popup v-model="homeui.showPay" position="bottom">
          <van-picker
            show-toolbar
            :columns="homedata.paytypeList"
            @cancel="homeui.showPay = false"
            @confirm="payConfirm"
          />
        </van-popup>
        <div class="input-cell" @click="stageClick">
          <div class="cell-left"><label for="stage">申请金额分期期数</label></div>
          <div class="cell-middle">
            <input type="text" id="stage" v-model="homedata.stage" readonly="readonly"  ref="stage" />
          </div>
          <div class="cell-right">
            <img src="@/assets/images/Sxf/arrow.png" alt="">
          </div>
        </div>
        <van-popup v-model="homeui.showStage" position="bottom">
          <van-picker
            show-toolbar
            :columns="homedata.stageList"
            @cancel="homeui.showStage = false"
            @confirm="stageConfirm"
          />
        </van-popup>
        <div class="repay-part" v-show="homeui.repaypart">
          <div class="repay-left">
            <p class="title_one">每期应还</p>
            <p class="slh">
              <span class="s1">每期本金</span>
            </p>
            <p class="slh" id="spc_one">
              <span class="s2">每期手续费</span>
            </p>
          </div>
          <div class="repay-center">
            <p class="title_two" v-show="homeui.discount">￥{{homedata.dispayEach}}</p>
            <p class="zhe" v-show="homeui.discount">￥{{homedata.dispayMoney}}</p>
            <p class="zhe" id="spc_two" v-show="homeui.discount">￥{{homedata.dispaypartCharge}}</p>
          </div>
          <div class="repay-right">
            <p class="title_three">￥{{homedata.payEach}}</p>
            <p class="nozhe">￥{{homedata.payMoney}}</p>
            <p class="nozhe" id="spc_three">￥{{homedata.paypartCharge}}</p>
          </div>
        </div>
        <div class="repay-all" v-show="homeui.repayall">
          <div class="repay-head">
            <p>每期应还本金</p>
            <p>￥{{homedata.payAll}}</p>
          </div>
          <div class="repay-foot">
            <p>一次性手续费</p>
            <p class="repay-p">
              <span v-show="homeui.discount">￥{{homedata.dispayallCharge}}</span>
              <span>￥{{homedata.payallCharge}}</span>
            </p>
          </div>
        </div>
        <div class="account">
          <span>收款账户</span>
          <span>{{homedata.creditcardNum.cardNo}}</span>
        </div>
      </div>
      <div class="blank"></div>
      <BTextCode @getValue="getIdent" @achieveValue="checkIdent" @getCode="getCode" :textMsg="textMsg.msg" style="padding:0;margin-left:5.3%;"></BTextCode>
      <YImageCode :bgImg="imageCode.bgImg" :slideImg="imageCode.slideImg" :show="imageCode.show" @getMove="getMove" @refresh="refresh"></YImageCode>
      <div class="identTxt">短信验证码将发送至您信用卡在我行预留的手机号</div>
    </div>
    <div class="footer">
      <a href="javascript:;" @click="clickRule">《随兴分消费备用金业务条款与细则》</a>
      <YFunctionBtn text="同意条款细则并提交" :dis="homeui.disshow" @checktable="checkInfo" style="margin-top:0;"></YFunctionBtn>
      <div class="kind-remind" @click="kindRemind">温馨提示</div>
    </div>
    <div class="layer" v-show="pubmenu.laystatu"></div>
    <div class="pass-money" v-show="pubmenu.applyshow">
        <p>{{applyremind}}</p>
        <div class="pass-blank"></div>
        <span id="pass-confirm" @click="applyConfirm">确定</span>
    </div>
    <div class="remind" v-show="pubmenu.reminderstatu">
      <p>温馨提示</p>
      <div class="remind-txt">
        1、	随兴分消费备用金业务是为符合条件的信用卡持卡人提供的分期付款服务。持卡人可在我行授信额度范围内获得一次性消费额度，用于刷卡消费并分期偿还。<br/>
        2、	持卡人成功办理随兴分消费备用金业务后，款项实时转入持卡人信用卡账户，该资金不得用于投资、购房等非消费领域，不得取现或转账，仅限用于刷卡消费。若持卡人未按照约定使用资金或未能有效证明款项已用于约定用途，本行有权要求持卡人一次性偿清分期余额，包括不限于剩余分期本金及信用卡分期业务手续费；同时本行将有权拒绝持卡人再次办理本业务的申请。<br/>
        3、	随兴分消费备用金到账后会优先抵冲持卡人的信用卡当前欠款部分，具体冲账顺序同还款冲账顺序。资金冲抵欠款后的剩余部分视同溢缴款，办理随兴分消费备用金业务后，该账户溢缴款转账及取现功能将被关闭。资金到账后无论是否使用或者使用完毕，都会按照成功交易的金额正常收取手续费。<br/>
        4、	持卡人申请的随兴分消费备用金业务一经成功办理，不可随意撤销，不可对分期期数进行更改。
      </div>
      <div class="remind-blank"></div>
      <span class="remind-confirm" @click="rconfirm">我知道了</span>
    </div>
    <BcountDown :timeShow="homedata.timeShow" :countTime="homedata.countTime" @closeTime="closeTime"></BcountDown>
    <BapplyFail :show="fail.showAlert" :title="fail.title" :msg="fail.msg" :err="fail.err" @apllayFailBtn="fconfirm"></BapplyFail>
    <YVersion :version="version" style="padding-bottom:0.2rem;"></YVersion>
    <YErrorAlert :msg="alert.msg" :err="alert.err" :show="alert.showAlert" @confirm="confirm_home"></YErrorAlert>
  </div>
</template>

<script>
  // 引入所需的方法、组件
  import {mapActions,mapState} from "vuex";
  import {initsa,track,getLength,getSearch,encryptByDES} from "@/assets/js/common.js"; //听云监听
  import BNcreditSelect from "../../components/BNcreditSelect";
  import BTextCode from "../../components/BTextCode";
  import YImageCode from "../../components/YImageCode";
  import YFunctionBtn from "../../components/YFunctionBtn";
  import YVersion from "../../components/YVersion";
  import YErrorAlert from "../../components/YErrorAlert";
  import BapplyFail from "../../components/BapplyFail";
  import BcountDown from "../../components/BcountDown";
  import {Popup} from "vant";
  export default {
    name: 'HomePage', //兴享贷首页
    data () {
      return { //绑定数据
        failremind:"",       // 申请金额错误信息
        applyremind:"",      // 申请金额弹框信息
        delShow:"",          // 清空状态
        modShow:true,        // 画笔状态     
        identcode:"",        // 验证码
      }
    },
    computed:mapState({
      homedata: state => state.sxf.home.homedata,
      homeui: state => state.sxf.home.homeui,
      pubui: state => state.sxf.public.pubui,
      pubmenu:state => state.sxf.public.pubmenu,
      textMsg:state => state.sxf.home.textMsg,
      imageCode:state =>state.sxf.home.imageCode,
      alert:state => state.sxf.home.alert,
      fail:state => state.sxf.home.fail,
      fixed:state => state.sxf.fixed,
      version:state => state.sxf.version
    }),
    created(){
      this.initHome(); //初始化首页
    },
    methods:{
      // 关闭倒计时
      closeTime(){
        this.$store.commit('sxf/BCHANGETIMESTATUS',false);
        this.$router.push({path:'/Sxf/FailPage'});
      },
      // 初始化数据
      initHome(){
        this.$store.dispatch("sxf/bsetInitHome",{
          homedata:this.homedata,
          router:this.$router
        });
        this.$store.commit("sxf/BSETPROMOTECODE",getSearch("promoteCode"));
        initsa("随兴分首页"); 
      },
      // 显示信用卡列表
      showCredit(){                          
        this.$store.commit("sxf/BCHANGEFIXED",true);
      },
      // 隐藏信用卡列表
      creCancel(){
        this.$store.commit("sxf/BCHANGEFIXED",false);
      },
      // 切换信用卡
      getcreditcard(data){                                  
        this.$store.dispatch("sxf/bchangecreditcard",{
          creditcardNum:data,
          router:this.$router
        });
        this.failremind = "";
      },
      // 申请金额输入事件
      passMax(){
        this.homedata.applyMoney = this.homedata.applyMoney.replace(/[^\d]/g,""); // 限制只能输入数字
        if(this.homedata.applyMoney==""){
          this.failremind = "申请金额不能为空";
        }else if(Number(this.homedata.applyMoney) < 1000){
          this.failremind = "申请金额不得低于1000元";
        }else if(Number(this.homedata.applyMoney) > Number(this.homedata.maxMoney)){
          this.applyremind = "您输入金额大于随兴分消费备用金最高可申请金额，已为您更改至最高可申请金额";
          this.$store.commit("sxf/BCHANGEAPPLYNUM",this.homedata.maxMoney);
          this.$store.commit("sxf/BCHANGEAPPLYSTATUS",{layshow:true,applyshow:true});
          this.$store.commit("sxf/BCHANGEFIXED",true);
          this.$refs.applyMoney.blur();
          this.$store.dispatch("sxf/bchangeapply",{
            creditcardNum:this.homedata.creditcardNum,
            applyMoney:this.homedata.applyMoney,
            homedata:this.homedata,
          });
          this.failremind = "";
        }else if(Number(this.homedata.applyMoney) >= 1000 && Number(this.homedata.applyMoney) <= Number(this.homedata.maxMoney)){
          this.$store.dispatch("sxf/bchangeapply",{
            creditcardNum:this.homedata.creditcardNum,
            applyMoney:this.homedata.applyMoney,
            homedata:this.homedata,
          });
          this.failremind = "";
        }
      },
      // 申请金额失焦事件
      checkNum(){
        setTimeout(()=>{
          var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
          window.scrollTo(0,Math.max(scrollHeight - 1,0));
        },100); 
        this.modShow = true;
        this.delShow = false;
        if(Number(this.homedata.applyMoney) >= 1000 && Number(this.homedata.applyMoney)<=Number(this.homedata.maxMoney) && this.identcode.length==6){
          this.$store.commit("sxf/BCHANGEHOMEBTN",true);
        }else{
          this.$store.commit("sxf/BCHANGEHOMEBTN",false);
        }
      },
      // 清空申请金额
      Delete(){
        this.$store.commit("sxf/BCHANGEAPPLYNUM","");
        this.$refs.applyMoney.focus();
      },
      // 修改申请金额
      Modify(){
        this.modShow = false;
        this.delShow = true;
        this.$store.commit("sxf/BCHANGEAPPLYNUM","");
        this.$refs.applyMoney.focus();
      },
      // 输入框focus事件
      focusNum(){
        this.delShow = true;
        this.modShow = false;
      },
      // 点击支付方式
      payClick(){
        this.$store.commit("sxf/BCHANGEPAY",true);
      },
      // 支付方式确认按钮
      payConfirm(value,index){
        this.$store.commit("sxf/BASSIGNPAYTYPE",value);
        this.$store.commit("sxf/BCHANGEPAY",false);
        this.$store.dispatch("sxf/bchangemoney",{
          creditcardNum:this.homedata.creditcardNum,
          applyMoney:this.homedata.applyMoney,
          homedata:this.homedata,
          pubui:this.pubui
        });
      },
      // 点击期数
      stageClick(){
        this.$store.commit("sxf/BCHANGESTAGE",true);
      },
      // 期数确认按钮
      stageConfirm(value,index){
        this.$store.commit("sxf/BASSIGNSTAGE",value);
        this.$store.commit("sxf/BCHANGESTAGE",false);
        this.$store.dispatch("sxf/bchangemoney",{
          creditcardNum:this.homedata.creditcardNum,
          applyMoney:this.homedata.applyMoney,
          homedata:this.homedata,
          pubui:this.pubui
        });
      },
      // 关闭申请金额错误弹框
      applyConfirm(){
        this.$store.commit("sxf/BCHANGEFIXED",false);
        this.$store.commit("sxf/BCHANGEAPPLYSTATUS",{layshow:false,applyshow:false});
      },
      // 显示温馨提示弹框
      kindRemind(){
        this.$store.commit("sxf/BCHANGEFIXED",true);
        this.$store.commit("sxf/BCHANGEREMINDSTATUS",{layshow:true,remindshow:true});
      },
      // 隐藏温馨提示弹框
      rconfirm(){
        this.$store.commit("sxf/BCHANGEFIXED",false);
        this.$store.commit("sxf/BCHANGEREMINDSTATUS",{layshow:false,remindshow:false});
      },
      // 关闭首页错误弹框
      confirm_home(){
        this.$store.commit("sxf/BHOMEALERT",{show: false, msg: '', err: '',fixed:false});
      },
      // 关闭失败弹框
      fconfirm(){
        this.$store.commit("sxf/BHOMEFAIL",{show:false,title:"",msg:"",err:"",fixed:false});
      },
      // 验证码失焦事件
      getIdent(codedata){
        setTimeout(()=>{
          var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
          window.scrollTo(0,Math.max(scrollHeight - 1,0));
        },100);
        if(codedata=="" || codedata==undefined){
          this.identcode = "";
        }else{
          this.identcode = codedata;
        }
        var code = $.trim(this.identcode);
        var len = getLength(code);
        if(code==""){
          this.$store.commit("sxf/BHOMEALERT",{show: true, msg: "验证码不能为空", err: '',fixed:true});
          return false;
        }else if(len < 6){
          this.$store.commit("sxf/BHOMEALERT",{show: true, msg: "请输入6位验证码", err: '',fixed:true});
          return false;
        }else{
          this.$store.commit("sxf/BHOMEALERT",{show: false, msg: "", err: '',fixed:false});
        }
      },
      // 获取验证码click事件
      getCode(){
        if(this.textMsg.status==1){
          this.$store.dispatch("sxf/bgetcode",{
            homedata:this.homedata,
          });
        }
      },
      // 滑动滑块事件
      getMove(value){
        this.$store.commit('sxf/BSETMOVELENGTH',value); // 获取滑动距离
        this.$store.dispatch('sxf/bsendmovelen',{
          homedata:this.homedata,
          imageCode:this.imageCode,      
        });
      },
      // 点击刷新按钮
      refresh(){
        this.$store.dispatch('sxf/refreshImage',{
          homedata:this.homedata,   
        });
      },
      // 验证码输入事件
      checkIdent(codedata){
        if(codedata=="" || codedata==undefined){
          this.identcode = "";
        }else{
          this.identcode = codedata;
        }
        if(Number(this.homedata.applyMoney) >= 1000 && Number(this.homedata.applyMoney)<=Number(this.homedata.maxMoney) && this.identcode.length==6){
          this.$store.commit("sxf/BCHANGEHOMEBTN",true);
        }else{
          this.$store.commit("sxf/BCHANGEHOMEBTN",false);
        }
      },
      // 信息提交
      checkInfo(){
        if(Number(this.homedata.applyMoney) >= 1000 && Number(this.homedata.applyMoney)<=Number(this.homedata.maxMoney) && this.identcode.length==6){
          if(this.homeui.disshow==true){
            track("sxf_Homesubmit","随兴分首页申请按钮");
            this.$store.dispatch("sxf/bsubmitinfo",{
              cardKey:this.homedata.creditcardNum.cardKey,
              smsCode:this.identcode,
              applyAmt:this.homedata.applyMoney,
              homedata:this.homedata,
              router:this.$router
            });
          }
        }
      },
      // 点击条款
      clickRule(){
        track("sxf_RuleClick","随兴分首页点击条款");
        var obj = {
          billdate:this.homedata.billdate,
          countdown:this.homedata.countdown,
          installList:this.pubui.installList,
          creditcardNum:this.homedata.creditcardNum,
          creditIndex:this.homedata.creditIndex,
          applyMoney:this.homedata.applyMoney,
          maxMoney:this.homedata.maxMoney,
          paytype:this.homedata.paytype,
          stage:this.homedata.stage,
          planCode:this.homedata.planCode,
          rate:this.homedata.rate,
          discount:this.homedata.discount,
          dispayEach:this.homedata.dispayEach,
          dispayMoney:this.homedata.dispayMoney,
          dispaypartCharge:this.homedata.dispaypartCharge,
          payEach:this.homedata.payEach,
          payMoney:this.homedata.payMoney,
          paypartCharge:this.homedata.paypartCharge,
          payAll:this.homedata.payAll,
          dispayallCharge:this.homedata.dispayallCharge,
          payallCharge:this.homedata.payallCharge,
          promoteCode:this.homedata.promoteCode
        }
        localStorage.setItem("SXF",JSON.stringify(obj));
        window.location.href = "https://creditcard.cib.com.cn/stage/other/sxf_xz.html";
      }
      
    },
    components:{
      BNcreditSelect,
      BTextCode,
      YImageCode,
      YFunctionBtn,
      YVersion,
      YErrorAlert,
      BapplyFail,
      BcountDown
    }
  }
</script>
<style scoped>
.main{background:#F3F5F9;width: 100%;}
.bg-fixed{position: fixed;overflow: hidden;top:0;left:0;bottom:0;right:0;}
.container{width: 100%;background:#FFF;overflow: hidden;}
.blank{background:#F3F5F9;height: 0.1rem;}
/* 申请金额 */
#banner{height:1.67rem;background-size: 100% 100%;color:#FFF;box-sizing: border-box;margin-bottom: 0.18rem;}
#banner .bgImg{width:100%;height: 1.67rem;}
#banner .banner-text{position: relative;top:-1.67rem;padding:0 0.4rem;}
#banner .banner-title{font-size: 0.14rem;height: 0.2rem;line-height: 0.2rem;padding-top:0.32rem;}
#banner .banner-top{font-size: 0.13rem;line-height: 0.13rem;height: 0.13rem;color:#FFF222;}
#banner .banner-middle{height: 0.36rem;line-height: 0.36rem;font-size: 0.25rem;position: relative;}
#banner .banner-content{position: absolute;right: 0;}
#banner .sign-one{display: inline-block;margin-left: -0.05rem;}
#applyMoney{border: none;height: 0.36rem;font-size: 0.25rem;width: 2rem;background: none;color:#FFF;}
#applyMoney::-webkit-input-placeholder{font-size: 0.2rem;color: #FFF;opacity: 0.5;height: 0.28rem;line-height:0.28rem;position: relative;bottom:0.01rem;}
#applyMoney:-moz-placeholder{font-size: 0.2rem;color: #FFF;opacity: 0.5;height: 0.28rem;line-height:0.28rem;position: relative;bottom:0.01rem;}
#applyMoney:-ms-input-placeholder{font-size: 0.2rem;color: #FFF;opacity: 0.5;height: 0.28rem;line-height:0.28rem;position: relative;bottom:0.01rem;}
#banner .banner-middle img{width:0.17rem;height:0.17rem;position: absolute;right: 0;top:0.1rem;}
#banner .banner-line{background:#fff;opacity: 0.5;height: 0.01rem;}
#banner .banner-bottom{margin-top: 0.095rem;height: 0.16rem;line-height: 0.16rem;font-size: 0.11rem;position: relative;}
#banner .banner-txt{margin-right: 0.1rem;}
.layer{width: 100%;height: 100%;z-index: 100;position: fixed;top: 0;left: 0;display: block;background: #000;opacity: 0.4;}
/* 主要内容 */
.content {padding:0 5.3%;box-sizing: border-box;}
/* .content .input-cell{height: 0.24rem;line-height: 0.24rem;margin-bottom: 0.2rem;display: flex;font-size: 0.15rem;justify-content:space-between;}
.content .input-cell .cell-left{width:1.2rem;}
.content .input-cell .cell-middle input{border:none;text-align: right;}
.content .input-cell .cell-right img{width:0.071rem;} */
.content .input-cell{height: 0.24rem;line-height: 0.24rem;margin-bottom: 0.2rem;font-size: 0.15rem;position: relative;}
.content .input-cell .cell-left{width:1.2rem;float: left;}
.content .input-cell .cell-middle{position: absolute;right: 0.24rem;}
.content .input-cell .cell-middle input{border:none;text-align: right;height: 0.24rem;line-height: 0.24rem;width:1.78rem;}
.content .input-cell .cell-right{float: right;}
.content .input-cell .cell-right img{width:0.071rem;position: relative;top: -0.01rem;}
/* 分期还款 */
.repay-part{background:rgb(243,243,255);padding:0.12rem 0.24rem;margin-bottom: 0.22rem;display: flex;}
#spc_one{margin-bottom: 0;}
#spc_two{margin-bottom: 0;}
#spc_three{margin-bottom: 0;}
.repay-part .repay-left{flex:1;}
.repay-part .repay-left .title_one{opacity: 0.8;font-size: 0.12rem;color: #000;line-height: 0.17rem;height: 0.17rem;
margin-bottom: 0.06rem;}
.repay-part .slh{height: 0.14rem;line-height: 0.14rem;font-size: 0.1rem;margin-bottom: 0.06rem;opacity: 0.5;
background:url("../../assets/images/Sxf/slh.png") repeat-x right center;background-size: auto 0.02rem;}
.repay-part .slh .s1{display: inline-block;padding-right: 0.2rem;background:rgb(243,243,255);}
.repay-part .slh .s2{display: inline-block;padding-right: 0.1rem;background:rgb(243,243,255);}
.repay-part .repay-center{text-align: right;text-decoration:line-through;padding-left: 0.1rem;}
.repay-part .repay-center .title_two{opacity: 0.5;font-size: 0.12rem;color: #000;line-height: 0.17rem;height: 0.17rem;
margin-bottom: 0.06rem;text-decoration: line-through;}
.repay-part .repay-center .zhe{height: 0.14rem;line-height: 0.14rem;font-size: 0.1rem;margin-bottom: 0.06rem;opacity: 0.5;}
.repay-part .repay-right{text-align: right;padding-left: 0.05rem;}
.repay-part .repay-right .title_three{font-size: 0.12rem;color: #5533FF;line-height: 0.17rem;height: 0.17rem;
margin-bottom: 0.06rem;}
.repay-part .repay-right .nozhe{height: 0.14rem;line-height: 0.14rem;font-size: 0.1rem;margin-bottom: 0.05rem;color:#7e7e7e;}
/* 一次性还款 */
.repay-all{background:rgb(243,243,255);padding:0.12rem 0.24rem;margin-bottom: 0.22rem;}
.repay-all .repay-head{display: flex;justify-content: space-between;font-size: 0.12rem;height: 0.17rem;line-height: 0.17rem;
margin-bottom: 0.12rem;}
.repay-all .repay-head p:first-child{color:#000;opacity: 0.8;}
.repay-all .repay-head p:last-child{color:#5533FF;}
.repay-all .repay-foot{display: flex;justify-content: space-between;font-size: 0.12rem;height: 0.17rem;line-height: 0.17rem;}
.repay-all .repay-foot p:first-child{color:#000;opacity: 0.8;}
.repay-all .repay-foot .repay-p span:first-child{color:#000;opacity: 0.5;text-decoration:line-through;margin-right: 0.1rem;}
.repay-all .repay-foot .repay-p span:last-child{color:#5533FF;}
/* 收款账户 */
.account{color:#999;font-size: 0.15rem;height: 0.21rem;line-height: 0.21rem;opacity: 0.99;display: flex;justify-content: space-between;
margin-bottom: 0.25rem;}
.account span:last-child{margin-right: 0.24rem;}
/* 输入超过申请金额 */
.pass-money{position: absolute;top: 2.39rem;width:2.64rem;left:14.8%;background: #FFFFFF;border-radius: 0.1rem;
z-index:999;text-align: center;}
.pass-money p{color:#333;font-size: 0.16rem;line-height: 0.22rem;text-align: center;padding:0.2rem 0 0.17rem;width: 2.05rem;margin-left: 0.3rem;}
.pass-blank{height: 0.01rem;background:#EAEAEA;}
#pass-confirm{height: 0.44rem;font-size:0.16rem;color: #0060F1;letter-spacing: -0.0038rem;line-height: 0.44rem;display: block;}
/* 底部 */
.identTxt{margin-left: 5.3%;font-size: 0.12rem;height: 0.24rem;line-height: 0.24rem;padding:0.07rem 0;color: #B5B5B5;}
.footer a{display: inline-block;margin:0.2rem 0 0.24rem 5.3%;font-size: 0.12rem;height: 0.18rem;line-height: 0.18rem;
color: #5084FF;letter-spacing: 0;}
/* 温馨提示 */
.kind-remind{padding:0.16rem 0;text-align: center;font-size: 0.12rem;color: #0060F1;}
.remind{position:absolute;width:72.3%;background:#FFF;top: 0.79rem;z-index:666;height: 3.8rem;border-radius: 0.1rem;left: 0;
right: 0;margin:0 auto;}
.remind p{margin:0.19rem 0 0.13rem;font-size: 0.16rem;line-height: 0.22rem;text-align: center;}
.remind-txt{font-size: 0.14rem;line-height: 0.2rem;height: 2.63rem;overflow: scroll;padding:0 0.16rem 0 0.2rem;box-sizing: 
border-box;color:#666;margin-bottom: 0.2rem;}
.remind-txt a{font-size: 0.09rem;}
.remind-blank{height: 0.01rem;background: #EAEAEA;margin-bottom: 0.09rem;}
.remind-confirm{font-size: 0.16rem;color: #0060F1;letter-spacing: -0.0038rem;text-align: center;display: block;}
</style>