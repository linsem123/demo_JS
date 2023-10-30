<template>
  <div :class="fixed?'bg-fixed main':'main'">
    <div class="container">
      <BNcreditSelect :cardNo="homedata.creditcardNum.cardNo" :creditList="pubui.creditList" @showCredit="showCredit"
      @getcreditcard="getcreditcard" @creCancel="creCancel" :choseShow="homedata.creditIndex" ctitle="选择信用卡"></BNcreditSelect>   
      <div class="blank"></div>
      <div id="banner">
        <img src="@/assets/images/borrowedMoney/banner.png" alt="" class="bgImg">
        <div class="banner-next">
          <div class="banner-title">申请金额</div>
          <div class="banner-top">{{failremind}}</div>
          <div class="banner-middle">
            <span class="sign-one">￥</span>
            <input type="tel" pattern="[0-9]" maxlength="9" id="applyMoney" placeholder="请输入申请金额" v-model="homedata.applyMoney" @input="passMax" @focus="focusNum" ref="applyMoney" @blur="checkNum"> 
            <img src="@/assets/images/borrowedMoney/del.png" alt="" @click="Delete" v-if="delShow" >
            <img src="@/assets/images/borrowedMoney/modify.png" alt="" @click="Modify" v-if="modShow">
          </div>
          <div class="banner-line"></div>
          <div class="banner-bottom">
            <span class="banner-txt">最高可借 ￥{{homedata.maxMoney}}</span>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="input-cell" @click="showTime">
          <div class="cell-left"><label for="paybackTime">约定还款日</label></div>
          <div class="cell-middle">
            <input type="text" id="paybackTime" v-model="homedata.paybackTime" readonly="readonly" ref="paybackTime"/>
            
          </div>
          <div class="cell-right">
            <img src="@/assets/images/borrowedMoney/arrow.png" alt="">
          </div>
        </div>
        <van-popup v-model="homedata.timeShow" position="bottom" width="100%">
          <van-datetime-picker
            v-model="homedata.payTime"
            type="date"
            title="选择约定还款日"
            :formatter="formatter"
            @cancel="timeCancel"
            @confirm="timeConfirm"
            :min-date="homedata.minDate"
            :max-date="homedata.maxDate"
          />
        </van-popup>
        <div class="input-cell" @click="choselendDay">
          <div class="cell-left"><label for="lendDay">借款天数</label></div>
          <div class="cell-middle" style="font-size:0.15rem;">
            <input type="text" id="lendDay" v-model="homedata.lendDay" readonly="readonly" @focus="lendDaySelect" ref="lendDay"/>天
          </div>
          <div class="cell-right">
            <img src="@/assets/images/borrowedMoney/arrow.png" alt="">
          </div>
        </div>
        <div id="repay">
          <div class="repay">
            <div class="repay-top">
              <span>费息合计</span>
              <span>￥{{homedata.repayTotal}}</span>
            </div>
            <div class="repay-middle">
              <span class="s1">一次性手续费</span>
              <div class="slh"></div>
              <span class="s2">￥{{homedata.repayOne}}</span>
            </div>
            <div class="repay-bottom">
              <span class="s1">利息</span>
              <div class="slh"></div>
              <span class="s2">￥{{homedata.repayRate}}</span>
            </div>
          </div>
        </div>
        <BNdebitSelect :nocard="homeui.nocard" :hascard="homeui.hascard" skip="/BorrowedMoney/AddPage" :debitList="pubui.debitList" :bankName="homedata.bankName" :bankNum="homedata.bankNum" @btnConfirm="btnConfirm"
        @getdebitcard="getdebitcard" @deleteCard="deleteCard" :choseShow="homedata.debitIndex" @selectDebit="selectDebit"
        @debCancel="debCancel" @debFinish="debFinish"></BNdebitSelect>
        <div class="input-cell clear" @click="chosefunduse">
          <div class="cell-left"><label for="funduse">资金用途</label></div>
          <div class="cell-middle">
            <input type="text" id="funduse" v-model="homedata.funduse" readonly="readonly" @focus="funduseSelect" ref="funduse" />
          </div>
          <div class="cell-right">
            <img src="@/assets/images/borrowedMoney/arrow.png" alt="">
          </div>
        </div>
      </div>
      <div class="blank"></div>
      <BTextCode @getValue="getIdent" @achieveValue="checkIdent" @getCode="getCode" :textMsg="textMsg.msg"></BTextCode>
      <YImageCode :bgImg="imageCode.bgImg" :slideImg="imageCode.slideImg" :show="imageCode.show" @getMove="getMove" @refresh="refresh"></YImageCode>
      <div class="identTxt">短信验证码将发送至您信用卡在我行预留的手机号</div>
    </div>
    <div class="footer">
      <a href="https://mobile.cib.com.cn/creditcard/credit/suijiejin/sjjxz.html">《随借金业务条款与细则》</a>
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
        1、随借金申请金额在预借现金可用额度范围内，随借金金额只能转入客户本人同名的银行账户。<br/>
        2、随借金申请天数在1-90天范围内，随借金收取一次性手续费（标准费率为10元/笔），同时按天收取利息（日息万分之五，按月计收复利），随借金优惠利率以我行相关公告或通知为准。<br/>
        3、持卡人申请随借金成功后，每个月仅需偿还截止账单日已产生的利息。本金及剩余利息在约定还款日一次性偿还。若持卡人在约定还款日未偿还随借金金额，则后续每天按照预借现金利息计算标准，按日收取利息。若持卡人超出约定还款日所在账单周期的最后还款日仍未还款，将承担利息、违约金等违约责任。<br/>
        4、若持卡人操作提前还款，需要通过微信、网上银行、手机银行或致电客服进行提前还款申请。提前还款申请成功后，利息计算至客户提前还款申请的当天。剩余未操作提前还款的随借金利息仍计算至客户约定还款日当天。<br/>
        5、若持卡人未按规定申请提前还款且自行在约定还款日前还款，不会提前偿还随借金本金和利息。<br/>
        6、若持卡人信用卡存在已出账单或有未出账单欠款，则还款将优先冲还已出账单未还欠款和未出账单欠款金额。
      </div>
      <div class="remind-blank"></div>
      <span class="remind-confirm" @click="rconfirm">我知道了</span>
    </div>
    <BapplyFail :show="fail.showAlert" :title="fail.title" :msg="fail.msg" :err="fail.err" @apllayFailBtn="fconfirm"></BapplyFail>
    <YVersion :version="version" style="padding-bottom:0.2rem;"></YVersion>
    <YErrorAlert :msg="alert.msg" :err="alert.err" :show="alert.showAlert" @confirm="confirm_home"></YErrorAlert>
  </div>
</template>

<script>
  // 引入所需的方法、组件
  import {mapActions,mapState} from "vuex";
  import {Popup} from "vant";
  import {initsa,track,getLength,encryptByDES} from "@/assets/js/common.js"; //听云监听
  import BNcreditSelect from "../../components/BNcreditSelect";
  import BNdebitSelect from "../../components/BNdebitSelect";
  import BTextCode from "../../components/BTextCode";
  import YImageCode from "../../components/YImageCode";
  import YFunctionBtn from "../../components/YFunctionBtn";
  import YVersion from "../../components/YVersion";
  import YErrorAlert from "../../components/YErrorAlert";
  import BapplyFail from "../../components/BapplyFail";
  export default {
    name: 'HomePage', //兴享贷首页
    data () {
      return { //绑定数据
        failremind:"",       // 申请金额错误信息
        applyremind:"",      // 申请金额弹框信息
        delShow:"",          // 清空状态
        modShow:true,        // 画笔状态
        // payTime:"",          
        cardIndex:"",        // 被选中的借记卡索引
        cardNum:"",          // 被选中的借记卡卡号
        identcode:"",        // 验证码
      }
    },
    computed:mapState({
      homedata:state => state.brm.home.homedata,
      addData:state => state.brm.add.addData,
      homeui:state => state.brm.home.homeui,
      pubui:state => state.brm.public.pubui,
      pubmenu:state => state.brm.public.pubmenu,
      textMsg:state => state.brm.home.textMsg,
      imageCode:state =>state.brm.home.imageCode,
      alert:state => state.brm.home.alert,
      fail:state => state.brm.home.fail,
      fixed:state => state.brm.fixed,
      version:state => state.brm.version
    }),
    created(){
      this.initHome(); //初始化首页
    },
    methods:{
      // 显示还款日弹框
      showTime(){
        this.$store.commit("brm/BCHANGETIME",true);
      },
      // 约定还款日取消按钮
      timeCancel(){
        this.$store.commit("brm/BCHANGETIME",false);
      },
      // 约定还款日确认按钮
      timeConfirm(v){
        var endvalue = new Date(v);
        var Y = endvalue.getFullYear() + '/';
        var M = (endvalue.getMonth()+1 < 10 ? '0'+(endvalue.getMonth()+1) : endvalue.getMonth()+1)+'/';
        var D = (endvalue.getDate() < 10 ? '0'+endvalue.getDate() : endvalue.getDate());
        var newTime = Y+M+D;
        this.$store.dispatch("brm/bchangepaytime",{
          newTime:newTime
        });
        this.$store.commit("brm/BCHANGETIME",false);
        this.$store.dispatch("brm/bchangeapply",{
          creditcardNum:this.homedata.creditcardNum,
          applyMoney:this.homedata.applyMoney,
          homedata:this.homedata,
          addData:this.addData
        });
      },
      formatter(type, value) {
        if(type === 'year') {
            return `${value}年`;
        }else if (type === 'month') {
            return `${value}月`
        }else if(type === 'day'){
            return `${value}日`
        }
        return value;
      },
      // 初始化数据
      initHome(){
        this.$store.dispatch("brm/bsetInitHome",{
          homedata:this.homedata,
          router:this.$router
        });
        initsa("随借金首页"); 
      },
      // 显示信用卡列表
      showCredit(){                          
        this.$store.commit("brm/BCHANGEFIXED",true);
      },
      // 隐藏信用卡列表
      creCancel(){
        this.$store.commit("brm/BCHANGEFIXED",false);
      },
      // 切换信用卡
      getcreditcard(data){                                  // 切换信用卡
        this.$store.dispatch("brm/bchangecreditcard",{
          creditcardNum:data
        });
      },
      // 申请金额输入事件
      passMax(){
        this.homedata.applyMoney = this.homedata.applyMoney.replace(/[^\d]/g,""); // 限制只能输入数字和小数点
        if(Number(this.homedata.maxMoney)>50000){
          if(this.homedata.applyMoney==""){
            this.failremind = "申请金额不能为空";
          }else if(Number(this.homedata.applyMoney) < 1){
            this.failremind = "申请金额不得低于1元";
          }else if(Number(this.homedata.applyMoney)>50000){
            this.applyremind = "您输入的金额大于随借金单日5万限额，已为您更改至单日限额";
            this.$store.commit("brm/BCHANGEAPPLYNUM","50000");
            this.$store.commit("brm/BCHANGEAPPLYSTATUS",{layshow:true,applyshow:true});
            this.$store.commit("brm/BCHANGEFIXED",true);
            this.$refs.applyMoney.blur();
            
            this.$store.dispatch("brm/bchangeapply",{
              creditcardNum:this.homedata.creditcardNum,
              applyMoney:this.homedata.applyMoney,
              homedata:this.homedata,
              addData:this.addData
            });

            this.failremind = "";
          }else if(Number(this.homedata.applyMoney)>=1 && Number(this.homedata.applyMoney)<=50000){
            this.$store.dispatch("brm/bchangeapply",{
              creditcardNum:this.homedata.creditcardNum,
              applyMoney:this.homedata.applyMoney,
              homedata:this.homedata,
              addData:this.addData
            });
            this.failremind = "";
          }
        }else if(Number(this.homedata.maxMoney)<=50000){
          if(this.homedata.applyMoney==""){
            this.failremind = "申请金额不能为空";
          }else if(Number(this.homedata.applyMoney) < 1){
            this.failremind = "申请金额不得低于1元";
          }else if(Number(this.homedata.applyMoney)>Number(this.homedata.maxMoney)){
            this.applyremind = "您输入的金额大于随借金最高可申请金额，已为您更改至最高可申请金额";
            this.$store.commit("brm/BCHANGEAPPLYNUM",this.homedata.maxMoney);
            this.$store.commit("brm/BCHANGEAPPLYSTATUS",{layshow:true,applyshow:true});
            this.$store.commit("brm/BCHANGEFIXED",true);
            this.$refs.applyMoney.blur();

            this.$store.dispatch("brm/bchangeapply",{
              creditcardNum:this.homedata.creditcardNum,
              applyMoney:this.homedata.applyMoney,
              homedata:this.homedata,
              addData:this.addData
            });

            this.failremind = "";
          }else if(Number(this.homedata.applyMoney)>=1 && Number(this.homedata.applyMoney)<=Number(this.homedata.maxMoney)){
            this.$store.dispatch("brm/bchangeapply",{
              creditcardNum:this.homedata.creditcardNum,
              applyMoney:this.homedata.applyMoney,
              homedata:this.homedata,
              addData:this.addData
            });
            this.failremind = "";
          }
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
        if(this.homedata.maxMoney==0){
          this.$store.commit("brm/BCHANGEHOMEBTN",false);
        }else{
          if(this.homedata.applyMoney >= 0.01 && Number(this.homedata.applyMoney)<=Number(this.homedata.maxMoney) && this.homeui.hascard==true && this.identcode.length==6 && this.homedata.repayOne!="0"){
            this.$store.commit("brm/BCHANGEHOMEBTN",true);
          }else{
            this.$store.commit("brm/BCHANGEHOMEBTN",false);
          }
        }
      },
      // 清空申请金额
      Delete(){
        this.$store.commit("brm/BCHANGEAPPLYNUM","");
        this.$refs.applyMoney.focus();
      },
      // 修改申请金额
      Modify(){
        this.modShow = false;
        this.delShow = true;
        this.$store.commit("brm/BCHANGEAPPLYNUM","");
        this.$refs.applyMoney.focus();
      },
      // 输入框focus事件
      focusNum(){
        this.delShow = true;
        this.modShow = false;
      },
      // 关闭申请金额错误弹框
      applyConfirm(){
        this.$store.commit("brm/BCHANGEFIXED",false);
        this.$store.commit("brm/BCHANGEAPPLYSTATUS",{layshow:false,applyshow:false});
      },
      // 显示借记卡列表
      selectDebit(){
        this.$store.commit("brm/BCHANGEFIXED",true);
      },
      // 切换借记卡
      getdebitcard(data){      
        var addData = data;
        this.$store.dispatch('brm/binitaddpage',{
          addData:addData
        });
      },
      // 删除借记卡
      deleteCard(data){          
        this.cardIndex = data.cardIndex;  // 返回被选中的借记卡索引
        this.cardNum = data.cardNum;      // 返回被选中的借记卡卡号
      },
      // 确定删除借记卡
      btnConfirm(){               
        this.$store.dispatch("brm/bconfirmdelete",{
          cardIndex:this.cardIndex,
          cardNum:this.cardNum,
        }); 
      }, 
      // 取消选择借记卡
      debCancel(){
        this.$store.commit("brm/BCHANGEFIXED",false); 
      },
      // 选择借记卡完成
      debFinish(){
        this.$store.commit("brm/BCHANGEFIXED",false); 
      },
      // 显示温馨提示弹框
      kindRemind(){
        this.$store.commit("brm/BCHANGEFIXED",true);
        this.$store.commit("brm/BCHANGEREMINDSTATUS",{layshow:true,remindshow:true});
      },
      // 隐藏温馨提示弹框
      rconfirm(){
        this.$store.commit("brm/BCHANGEFIXED",false);
        this.$store.commit("brm/BCHANGEREMINDSTATUS",{layshow:false,remindshow:false});
      },
      // 关闭首页错误弹框
      confirm_home(){
        this.$store.commit("brm/BHOMEALERT",{show: false, msg: '', err: '',fixed:false});
      },
      // 关闭失败弹框
      fconfirm(){
        this.$store.commit("brm/BHOMEFAIL",{show:false,title:"",msg:"",err:"",fixed:false});
      },
      // 点击借款天数
      choselendDay(){
        this.$refs.applyMoney.blur();
        this.lendDaySelect();
      },
      // 选择借款天数
      lendDaySelect(){
        this.$store.commit("brm/BCHANGEFIXED",true);
        this.$refs.lendDay.blur();
        $("#lendDay").picker({
          cols: [
            {
              textAlign: 'center',
              values: this.homedata.dayList
            }
          ],
          value:[this.homedata.lendDay],
          onClose:(dayresult)=>{
            this.$store.dispatch("brm/bchangelendday",{
              dayvalue:dayresult.value
            });
            this.$store.commit("brm/BCHANGEFIXED",false);
            this.$store.dispatch("brm/bchangeapply",{
              creditcardNum:this.homedata.creditcardNum,
              applyMoney:this.homedata.applyMoney,
              homedata:this.homedata,
              addData:this.addData
            });
          }
        });
      },
      // 点击资金用途
      chosefunduse(){
        this.$refs.applyMoney.blur();
        this.funduseSelect();
      },
      // 选择资金用途
      funduseSelect(){
        this.$store.commit("brm/BCHANGEFIXED",true); 
        this.$refs.funduse.blur();
        $("#funduse").picker({
          cols: [
            {
              textAlign: 'center',
              values: this.homedata.funduseList
            }
          ],
          value:[this.homedata.funduse],
          onClose:(funduseresult)=>{
            this.$store.dispatch("brm/bchangefunduse",{
              fundusevalue:funduseresult.value
            });
            this.$store.commit("brm/BCHANGEFIXED",false); 
          }
        });
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
          this.$store.commit("brm/BHOMEALERT",{show: true, msg: "验证码不能为空", err: '',fixed:true});
          return false;
        }else if(len < 6){
          this.$store.commit("brm/BHOMEALERT",{show: true, msg: "请输入6位验证码", err: '',fixed:true});
          return false;
        }else{
          this.$store.commit("brm/BHOMEALERT",{show: false, msg: "", err: '',fixed:false});
        }
      },
      // 获取验证码click事件
      getCode(){
        if(this.textMsg.status==1){
          this.$store.dispatch("brm/bgetcode",{
            homedata:this.homedata,
          });
        }
      },
      // 滑动滑块事件
      getMove(value){
        this.$store.commit('brm/BSETMOVELENGTH',value); // 获取滑动距离
        this.$store.dispatch('brm/bsendmovelen',{
          homedata:this.homedata,
          imageCode:this.imageCode,      
        });
      },
      // 点击刷新按钮
      refresh(){
        this.$store.dispatch('brm/refreshImage',{
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
        if(this.homedata.maxMoney==0){
          this.$store.commit("brm/BCHANGEHOMEBTN",false);
        }else{
          if(this.homedata.applyMoney >= 0.01 && Number(this.homedata.applyMoney)<=Number(this.homedata.maxMoney) && this.homeui.hascard==true && this.identcode.length==6 && this.homedata.repayOne!="0"){
            this.$store.commit("brm/BCHANGEHOMEBTN",true);
          }else{
            this.$store.commit("brm/BCHANGEHOMEBTN",false);
          }
        }
      },
      // 信息提交
      checkInfo(){
        if(this.homedata.applyMoney >= 0.01 && Number(this.homedata.applyMoney)<=Number(this.homedata.maxMoney) && this.homeui.hascard==true && this.identcode.length==6 && this.homedata.repayOne!="0"){     
          var isFlag = "";
          if(this.homedata.bankName=="兴业银行"){
            isFlag = "0";
          }else{
            isFlag = "1";
          }
          var fqyt = "";
          for(var i=0;i<this.homedata.usageList.length;i++){
            if(this.homedata.usageList[i].dsc==this.homedata.funduse){
              fqyt = this.homedata.usageList[i].useageKey;
            }
          }
          this.$store.dispatch("brm/bsubmitinfo",{
            cardKey:this.homedata.creditcardNum.cardKey,
            applyMoney:this.homedata.applyMoney,
            name:this.addData.hascardName,
            borrowDay:this.homedata.lendDay,
            idCardNo:this.homedata.identNum,
            debitcardName:this.homedata.bankName,
            debitcardNo:this.homedata.bankNum,
            debitbankNo:this.homedata.bankNo,
            isFlag:isFlag,
            repayDate:this.homedata.paybackTime,
            fqyt:fqyt,
            channel:"wechat",
            smsCode:this.identcode,
            timestamp:Date.now()+"",
            router:this.$router
          });
          track("BorrowedMoney_homeSubmit","随借金首页提交按钮");
        }
      },
    },
    components:{
      BNcreditSelect,
      BNdebitSelect,
      BTextCode,
      YImageCode,
      YFunctionBtn,
      YVersion,
      YErrorAlert,
      BapplyFail
    }
  }
</script>
<style scoped>
.main{background:#F3F5F9;width: 100%;}
.bg-fixed{position: fixed;overflow: hidden;top:0;left:0;bottom:0;right:0;}
.container{width: 100%;background:#FFF;overflow: hidden;}
.blank{background:#F3F5F9;height: 0.1rem;}
/* 申请金额 */
#banner{height:1.67rem;background-size: 100% 100%;color:#FFF;box-sizing: border-box;}
#banner .bgImg{width:100%;height: 1.67rem;}
.banner-next{position: relative;top:-1.67rem;padding:0 0.4rem;}
.banner-title{font-size: 0.14rem;height: 0.2rem;line-height: 0.2rem;padding-top:0.32rem;}
.banner-top{font-size: 0.13rem;line-height: 0.13rem;height: 0.13rem;color:#FFF222;}
.banner-middle{height: 0.36rem;line-height: 0.36rem;font-size: 0.25rem;position: relative;}
.sign-one{display: inline-block;margin-left: -0.05rem;}
#applyMoney{border: none;height: 0.36rem;font-size: 0.25rem;width: 2rem;background: none;color:#FFF;}
#applyMoney::-webkit-input-placeholder{font-size: 0.2rem;color: #FFF;opacity: 0.5;height: 0.28rem;line-height:0.28rem;position: relative;bottom:0.01rem;}
#applyMoney:-moz-placeholder{font-size: 0.2rem;color: #FFF;opacity: 0.5;height: 0.28rem;line-height:0.28rem;position: relative;bottom:0.01rem;}
#applyMoney:-ms-input-placeholder{font-size: 0.2rem;color: #FFF;opacity: 0.5;height: 0.28rem;line-height:0.28rem;position: relative;bottom:0.01rem;}
.banner-middle img{width:0.17rem;height:0.17rem;position: absolute;right: 0;top:0.1rem;}
.banner-line{background:#fff;opacity: 0.5;height: 0.01rem;}
.banner-bottom{margin-top: 0.095rem;height: 0.16rem;line-height: 0.16rem;font-size: 0.11rem;position: relative;}
.banner-txt{margin-right: 0.1rem;}
.layer{width: 100%;height: 100%;z-index: 100;position: fixed;top: 0;left: 0;display: block;background: #000;opacity: 0.4;}
/* content */
.content {padding:0 !important}
.content .input-cell{height: 0.24rem;line-height: 0.24rem;position: relative;margin-bottom: 0.2rem;padding:0 5.3%;}
.content .cell-left{width:1.2rem;font-size: 0.15rem;float: left;}
.content .cell-middle{display: inline-block;position: absolute;right: 0.4rem;}
.content .cell-middle input{border:none;;font-size: 0.15rem;text-align: right;height: 0.24rem;line-height: 0.24rem;width:1.78rem;}
.content .cell-right{float: right;}
.content .cell-right img{width:0.071rem;position: relative;top: -0.02rem;}
/* 利息 */
#repay{padding:0 5.3%;box-sizing: border-box;}
.repay{background:rgba(255,132,129,0.2);padding:0.12rem 0.24rem;}
.repay-top{display: flex;justify-content: space-between;align-items: center;height: 0.17rem;margin-bottom: 0.06rem;}
.repay-top span{height:0.17rem;line-height: 0.17rem;font-size: 0.12rem;color: #000;}
.repay-top span:first-child{opacity: 0.8;}
.repay-top span:last-child{color:#FF5F7E;}
.repay-middle{display: flex;justify-content: space-between;align-items: center;height: 0.14rem;margin-bottom: 0.06rem;}
.repay-middle span{height:0.14rem;line-height: 0.14rem;font-size: 0.1rem;color: #000;opacity: 0.5;}
.slh{background:url("../../assets/images/borrowedMoney/slh.png") repeat-x center;background-size:auto 0.02rem;flex: 1;
height: 0.14rem;margin:0 0.2rem;}
.repay-bottom{display: flex;justify-content: space-between;align-items: center;height: 0.14rem;}
.repay-bottom span{height:0.14rem;line-height: 0.14rem;font-size: 0.1rem;color: #000;opacity: 0.5;}
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