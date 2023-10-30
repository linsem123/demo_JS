<template>
  <div class="contain">
    <wjChangeBank :cardList="homepage.cardList" :main="homepage.mainCard" :bankIndex="homepage.index" 
    :showMain='true' :showMoney='homepage.showMoney'  v-on:change="changecard" :showDebit='true' :text='homepage.text' :unit="homepage.unit"></wjChangeBank>
    <!--  -->
     <p class="p"></p>
     <!-- 输入金额 -->
      <div class="amt">
          <div class="a">输入金额</div>
          <p class="err1"> <span  class="err"  v-show='homepage.err'>{{homepage.msg}}</span></p>
          <div class="money"><span>¥</span><input class="input" type="texgt" @input="passmax" v-model="homepage.smppamt" placeholder="请输入金额"  maxlength="10" /></div>
      </div>
    <p class="p"></p>
    <!-- 密码 -->
    <div class="pas">
        <div><a href="">交易密码</a>
          <input  class="input" type="password" @blur="no()" v-model="homepage.pass" @input="pass" placeholder="请输入6位数字密码"
          maxlength="6" />
      </div>
    </div>
    <p class="p"></p>
    <!-- 短信 -->
    <ylTextCode v-show="homepage.ageshow" label="短信验证码" :textMsg="mana.smsCode.smsText" :clickBl='mana.smsCode.clickBl' 
       @achieveValue="achieveValue" @getCode="getSms" type="zhuanru" :innerHeight="innerHeight"></ylTextCode>
    <ylImageCode v-if="imgCode.show" :bigImgSrc="imgCode.bigimgStr" :tarImgSrc="imgCode.tarimgStr"
         @freshImgCode="freshImgCode" @checkImgCode="getSms"></ylImageCode>
    <div class="tit">短信验证码将发送至您办理信用卡时在银行预留的手机号</div>
    <YFunctionBtn :text="turnenter.text" :dis="dis" v-on:checktable="submit"></YFunctionBtn>
     <YErrorAlert :msg="erroralert.msg" :err="erroralert.err" :show="erroralert.show" :text="erroralert.title"
                   @confirm="closeAlert"></YErrorAlert>
    <YFailAlert :show="applyfail.show" :msg="applyfail.msg" :title="applyfail.title" :err="applyfail.err"
                 v-on:confirm="apllayFailBtn"></YFailAlert>
    <YVersion top='10%' :version="version"></YVersion>
  </div>
</template>
<script>
import wjChangeBank from './wjChangeBank';
import { mapState,mapGetters} from 'vuex';
import ylTextCode from "@/components/ylTextCode";
import ylImageCode from "@/components/ylImageCode";
import YVersion from "@/components/YVersion.vue";
import YFunctionBtn from "@/components/YFunctionBtn.vue";
import YErrorAlert from "@/components/YErrorAlert.vue";
import YFailAlert from "./YFailAlert.vue";
import {saAlert,track,channel, hxdappIsSpecial,encryptByDES} from "@/assets/js/common.js"; //听云监听
export default {
components:{ylTextCode,YVersion,YFunctionBtn,wjChangeBank,YErrorAlert, ylImageCode,YFailAlert},
data(){
    return{
        // err:false,msg:"",
        // ageshow:"", 
    }
},
methods:{
    changecard(index){
      console.log(index)
      this.homepage.mainCard=this.homepage.cardList[index]
      this.homepage.index=index
      this.smshow()
      console.log(this.homepage.ageshow)
    //   置空
      this.homepage.smppamt="";
      this.homepage.pass="";
      this.homepage.err=false;
      this.homepage.msg="";
       if(this.homepage.mainCard.cardType==1){
        //   this.homepage.cardList[index].showText = true; 
           this.homepage.showMoney=true
       }else{
          this.homepage.cardList[index].showText = false; 
          this.homepage.showMoney=false
       }
    },
passmax(e){
    this.homepage.smppamt = this.homepage.smppamt.replace(/[^\d.]/g,""); // 限制只能输入数字和小数点
    this.homepage.smppamt = this.homepage.smppamt.replace(".","$#$").replace(/\./g,"").replace("$#$","."); // 清除多余小数点
    this.homepage.smppamt = this.homepage.smppamt.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//小数位只保留2位
    this.homepage.smppamt.substring(0, 1) === '.' && (this.homepage.smppamt = '0' + this.homepage.smppamt );
    if(this.homepage.mainCard.cardType=='1'){
         if(Number(this.homepage.smppamt)<Number(this.homepage.mainCard.availAmt)){
             this.homepage.err=true;
             this.homepage.msg="不能低于可用余额"
         }else{
             this.homepage.err=false;
             this.homepage.msg=""
         }
      }
    },
pass(e){
        this.homepage.pass = this.homepage.pass.replace(/[^\d]/g, "");
        console.log(this.homepage.pass)
    },
    no(){},
    smshow(){
        if(this.homepage.mainCard.cardType=='1'){
            this.homepage.ageshow=true
        }else{
            this.homepage.ageshow=false
        }
    },
    achieveValue(smsCode){ //输入短信验证码
       this.$store.commit('lc_enter/SETTEXTCODE', smsCode);
        },
    getSms(moveX){ //获取短信
          if(this.mana.smsCode.clickBl){
            let imgcode = {
              show:false,
              bigimgStr:"",
              tarimgStr:"",
              moveX:""
            };
            this.$store.commit("lc_enter/SET_IMGCODE",imgcode); //隐藏滑块
            this.$store.commit("lc_enter/SET_SMSCLICLBL",false); //不可点击
            let obj = {
              cardKey:this.homepage.mainCard.cardKey,
              type:"FRIO",
              hkLength:"0", //滑块距离
            };
            if(moveX){
              obj.hkLength=moveX;
            }
            this.$store.commit("lc_enter/SETBASEDATA",obj);
            this.$store.dispatch("lc_enter/sendSmsCode",this.baseData);
          }
        },
    freshImgCode(){ //获取滑块  点击滑块上的刷新按钮时，请求滑块接口
            let obj = {
            cardKey: this.homepage.mainCard.cardKey,
            type: "FRIO"
            }
          this.$store.commit("lc_enter/SETBASEDATA",obj);
          this.$store.dispatch("lc_enter/getSlider",this.baseData);
        },
    closeAlert(){
        this.erroralert.show=false
    },
    submit(){
        if(this.dis){
        let pwsd = 'gxwoqd1904' + this.homepage.cardKey
        let pass = encryptByDES(this.homepage.pass, pwsd)//1 原始密码 2 处理后 return 加密后密码
        console.log(pass)
        let obj={
            cardKey:this.homepage.mainCard.cardKey,
            money:this.homepage.smppamt,
            transCode:pass,
            smsCode:"",
            busiType:"FRIO",
            cardType:this.homepage.mainCard.cardType
          }
          console.log(this.homepage.mainCard.cardKey)
          this.$store.commit('lc_enter/SETBASEDATA',obj)
          this.$store.dispatch('lc_enter/subenter',{data:this.baseData,router:this.$router})
        }
    },
    apllayFailBtn(){  //支付密码错误弹框 确定按钮
     this.applyfail.show=false
      }
},
created(){
 
     let obj = {
     //放首页接口 后台需要的字段
      };
      this.$store.commit('lc_enter/SETBASEDATA',obj);                   //调用SETBASEDATA请求把参数传过去
      this.$store.dispatch('lc_enter/turnhome',this.baseData)   //请求首页接口 传总参数
},
computed:{
    ...mapState({
        homepage:state=>state.lc_enter.homepage,
        mana:state=>state.lc_enter.manage,
        innerHeight:state=>state.innerHeight,
        version: state => state.lc_enter.version,
        turnenter: state => state.lc_enter.turnenter,
        baseData:state=>state.lc_enter.baseData,
        erroralert:state=>state.lc_enter.erroralert,
        imgCode:state => state.lc_enter.imgCode,
        applyfail: state => state.lc_enter.applyfail,
    }),
    ...mapGetters('lc_enter', {
        dis: 'dis',   
      }),
  }   
}
</script>
<style scoped>
  .contain{
       background: #F3F5F9;
       overflow: hidden;
       height: 100%;
       /* border: 1px  solid #F3F5F9; */
  }
  .input::-webkit-input-placeholder{
        font-family: PingFangSC-Regular;
        font-size: 0.15rem;
        color: #B5B5B5;
        letter-spacing: 0.18px;
   }
 .input::-moz-placeholder{   
        font-family: PingFangSC-Regular;
        font-size: 0.15rem;
        color: #B5B5B5;
        letter-spacing: 0.18px;
   }
.input:-moz-placeholder{    
            font-family: PingFangSC-Regular;
            font-size: 0.15rem;
            color: #B5B5B5;
            letter-spacing: 0.18px;
  }
.input:-ms-input-placeholder{  
            font-family: PingFangSC-Regular;
            font-size: 0.15rem;
            color: #B5B5B5;
            letter-spacing: 0.18px;
  }
.p{
      height: 0.1rem;
      background: #F3F5F9;
  }
  .amt{
      padding-left: 5.3%;
      padding-right: 5.3%;
      height: 0.95rem;
      padding-bottom: 0.1rem;
      background: #fff;
      /* border: 1px  solid red; */
  }
  .a{
      font-family: PingFangSC-Regular;
      font-size: 15px;
      color: #333333;
      letter-spacing: 0;
      padding-top: 0.16rem;
  }
  .money{
   height: 0.42rem;
   line-height: 0.42rem;
   display: flex;
   font-size: 0.15rem;
   /* border: 1px  solid blue; */
   margin-bottom: 0.1rem;
  }
  .money span{
    font-family: PingFangSC-Regular;
    font-size: 0.3rem;
    color: #000000;
    letter-spacing: 0;
    text-align: left;
    height: 0.42rem;
  }
  .money input{
    height: 0.41rem;
    background: none;
    border: none;
    display: block;
    margin-left:0.15rem;
  }
  .err{
  font-size:0.08rem;
  color: #000;
  margin-left:5.3%;
}
.err1{
   height: 0.15rem;
   width: 2.7rem;
   margin-left: 1.5%;
   margin-top: 0.05rem;
 }
 .err1 span{
   color: #FF3B30;
   font-size: 0.10rem;
 }
 .pas{padding-left: 5.3%;height: 0.53rem;padding-right: 5.3%;background: #fff;}
 .pas a{
    font-family: PingFangSC-Regular;
    font-size: 0.15rem;
    color: #333333;
    letter-spacing: 0;
    margin-right: 0.42rem;
    /* width:1rem; */
 }
 .pas input{
     border: none;
     background: none;
     height: 0.53rem;
     widows: 3rem;
 }
 .tit{
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #666666;
    letter-spacing: 0.14px;
    line-height: 0.33rem;
    padding-left: 5.3%;
    height: 0.4rem;
    background:#ffffff;
  }
</style>








