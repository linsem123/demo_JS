<template>
  <div :class="homepage.fixed ? 'bgFixed container':'container'">
   <!-- 身份信息 -->
     <div class="msg">
       <p class="pone"><a>姓名</a><a>{{homepage.userName}}</a></p>
       <p class="ptwo"><a>证件号码</a><a>{{homepage.idNo}}</a></p>
       <p class="pthree"><a>手机号码</a><a>{{homepage.phone}}</a></p>
       <p class="pfour"><a>证件类型</a><a>中国税收居民</a></p>
     </div>
     <!-- 切卡 -->
     <Wchangecard :cardList="homepage.cardList" :mainCard="homepage.mainCard" :cardIndex="homepage.index"
      @change="changeCard" @setFixed="setFixed"></Wchangecard>
     <!-- 落地行 -->
     <!-- <region></region> -->
     <p class="p"></p>
     <!-- 交易密码 -->
     <div class="pas">
        <div><a href="">设置密码</a>
          <input id="b" class="input" type="password" @blur="no()" v-model="homepage.pass" @input="passmax" placeholder="请输入6位数字密码"
           maxlength="6" />
        </div>
        <div class="line"></div>
        <div><a href="">确认密码</a>
         <input class="input" type="password" @blur="no()" maxlength="6" v-model="homepage.password" @input="passmax" placeholder="请再输入一次"/>
        </div>
     </div>
     <!--  -->
     <div class="tip">
         <p><img src="../../../assets/images/financial/opendoor/fen.png" alt=""></p>
         <p>添利密码用于添利密码用于添利密码用于添利密码用于添利密码用于</p>
     </div>
      <ylTextCode label="短信验证码" :textMsg="mana.smsCode.smsText" :clickBl='mana.smsCode.clickBl' bgcolor=""
       @achieveValue="achieveValue" @getCode="getSms" type="kaihu" :innerHeight="innerHeight"></ylTextCode>
       <div class="ti">短信验证码将发送至您办理信用卡时在银行预留的手机号</div>
       <div class="agree">
         <p class="logo" @click="logo">
         <img src="../../../assets/images/financial/opendoor/wen.png" alt="" v-show="homepage.logo1">
         <img src="../../../assets/images/financial/opendoor/ha.png" alt="" v-show="homepage.logo2">
         </p>
         <p @click="code()">我已阅读并同意<span class="blue">《兴业银行借记卡领用合约》《兴业银行个人账户开户须知》《个人税收居民身份声明文件》《兴业银行用户隐私保护条款》</span> </p>
       </div>
        <ylImageCode v-if="imgCode.show" :bigImgSrc="imgCode.bigimgStr" :tarImgSrc="imgCode.tarimgStr"
         @freshImgCode="freshImgCode" @checkImgCode="getSms"></ylImageCode>
     <ylAlert  :errTitle="alert.errTitle" :errMsg="alert.errMsg" :errCode="alert.errCode" v-show="alert.show" @closeAlert="close"></ylAlert>
     <YFunctionBtn :text="opendoor.text" :dis="dis" v-on:checktable="submit"></YFunctionBtn>
     <YVersion top='10%' :version="version"></YVersion>
  </div>
</template>
<script>
import Wchangecard from  './Wchangecard';
import { mapState,mapGetters } from 'vuex';
import YVersion from "@/components/YVersion.vue";
import ylAlert from "./ylAlert";
import ylTextCode from "@/components/ylTextCode";
import ylImageCode from "@/components/ylImageCode";
import YFunctionBtn from "@/components/YFunctionBtn.vue";
import {initsa, track, saAlert, getSearch, encryptByDES} from "@/assets/js/common.js"; //听云监听
export default {
 name:"Homepage",
 components:{Wchangecard,YVersion,ylAlert,ylTextCode,YFunctionBtn,ylImageCode},
 data(){
     return{ color:false
     }
 },
 methods:{
     changeCard(index) {  //切卡按钮
        // this.homepage.mainCard = this.homepage.cardList[index]
        // this.homepage.index = index
        // this.homepage.are=this.homepage.cardList[index].are
        // this.homepage.city=this.homepage.cardList[index].bank
        let obj={
           cardKey:this.homepage.cardList[index].cardKey
        }
        console.log(this.homepage.cardList[index].cardKey)
        this.$store.commit('open/SET_BASEDATA',obj)
        let baseData=this.baseData
        this.$store.dispatch('open/set_changeCard',{baseData,index})
      },
      passmax(e){
        
        //  let num=this.homepage.pass
        //  let a=num.substring(num.length-1,num.length)
        //  let b= a.replace(/[^0-9]+/g, ''); //非数字与*替换为空
        //  this.homepage.num=this.homepage.num+b
        // setTimeout(()=>{
        //  this.homepage.pass= this.homepage.pass.replace(/[^0-9\*]+/g, ''); //非数字（不包括*）替换为空
        //  this.homepage.pass=this.homepage.pass.replace(/\d/g, '*')//把this.homepage.pass替换为*
        //  this.homepage.password = this.homepage.password.replace(/[^\d]/g, "");
        //   },1000)
        this.homepage.pass = this.homepage.pass.replace(/[^\d]/g, "");
        this.homepage.password = this.homepage.password.replace(/[^\d]/g, "");
        console.log(this.homepage.pass)
        console.log(this.homepage.password)
        },
      achieveValue(smsCode){ //输入短信验证码
       this.$store.commit('open/SETTEXTCODE', smsCode);
        console.log('短信长度1',this.mana.smsCode.smsCode.length)
        },
      getSms(moveX){ //获取短信
          if(this.mana.smsCode.clickBl){
            let imgcode = {
              show:false,
              bigimgStr:"",
              tarimgStr:"",
              moveX:""
            };
            this.$store.commit("open/SET_IMGCODE",imgcode); //隐藏滑块
            this.$store.commit("open/SET_SMSCLICLBL",false); //不可点击
            let obj = {
              cardKey:this.homepage.mainCard.cardKey,
              type:"LCKH",
              hkLength:"0", //滑块距离
            };
            if(moveX){
              obj.hkLength=moveX;
            }
            this.$store.commit("open/SET_BASEDATA",obj);
            this.$store.dispatch("open/sendSmsCode",this.baseData);
          }
        },
     freshImgCode(){ //获取滑块  点击滑块上的刷新按钮时，请求滑块接口
            let obj = {
            cardKey: this.homepage.mainCard.cardKey,
            type: "GETS"
            }
          this.$store.commit("open/SET_BASEDATA",obj);
          this.$store.dispatch("open/getSlider",this.baseData);
        },
    close(){
           this.alert.show=false
        },
    no(){
        if(this.homepage.pass!=this.homepage.password  && this.homepage.password!=""){
        this.alert.show = true
        this.alert.errMsg="两次密码输入不一致"
        this.alert.errTitle=""
      }
   },
   submit(){
       console.log('aaaaaaaaaaaaaa')
      if(this.dis){
        let pwsd = 'gxwoqd1904' + this.homepage.cardKey
        let pass = encryptByDES(this.homepage.pass, pwsd)//1 原始密码 2 处理后 return 加密后密码
        let password = encryptByDES(this.homepage.password, pwsd)//1 原始密码 2 处理后 return 加密后密码
        console.log(pass)
        console.log(password)
        console.log(this.mana.smsCode.smsCode)
         let obj={
             cardKey:this.homepage.mainCard.cardKey,
             type:"LCKH",
             passWd:pass,
             rePassWd:password,
             smsCode:this.mana.smsCode.smsCode,
             branchNo:this.homepage.branchNo
         }
         this.$store.commit('open/SET_BASEDATA',obj)
         this.$store.dispatch('open/set_applydoor',{data:this.baseData,router:this.$router})
      }
   },
    // 滚动穿透
      setFixed(bl) {
        this.$store.commit("open/SET_BGFIXED", {fixed: bl.bl});
      },   
      logo(){
          this.homepage.logo1=!this.homepage.logo1
          this.homepage.logo2=!this.homepage.logo2
      }
 },
 computed:{
    ...mapState({
        homepage:state=>state.open.homepage,
        version: state => state.open.version,
        alert: state => state.open.alert,
        baseData: state => state.open.baseData,
        mana: state => state.open.manage,
        imgCode:state => state.open.imgCode,
        opendoor:state => state.open.opendoor,
        innerHeight:state=>state.innerHeight
    }),
    ...mapGetters('open', {
        dis: 'dis',   
      }),
 },
 created(){
     console.log(this.homepage.mainCard)
     let obj={}
      this.$store.commit('open/SET_BASEDATA', obj);           //发出请求  传obj
      this.$store.dispatch('open/set_doorhome', this.baseData)
 }   
}
</script>
<style scoped>
.bgFixed {
    position: fixed;
    overflow: hidden;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0
  }
  .ti{
    opacity: 0.5;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #666666;
    letter-spacing: 0.14px;
    line-height: 0.33rem;
    padding-left: 5.3%;
    height: 0.4rem;
    background: #fff;
  }
  .logo{
      height: 0.2rem;
      width: 0.32rem;
  }
  .logo img{
      height: 0.32rem;
      width: 0.32rem;
  }
  .blue{color: #0060F1;}
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
 }
 .container{
    background: #F3F5F9;
    overflow: hidden;
 }
 .msg{
    border: 1px  solid #F3F5F9;
 }
 .msg p{
     margin-left:5.3%;
     display:flex;
     margin-bottom:0.3rem;
     font-family: PingFangSC-Regular;
    color: #666666;
    letter-spacing: 0.18px;
    line-height: 0.16rem;
 }
 .pone{
     padding-top:0.16rem; 
 }
 .msg a{display:block;font-size:0.15rem;}
 .msg a:nth-of-type(1){
     width:1rem;
     /* border: 1px  solid red; */
 }
 .pas{
     padding-top:0.1rem; 
     background: #fff;
     height:1.07rem;
     /* background: 1px  solid red; */
     padding-left: 5.3%;
     line-height: 0.4rem;  
 }
 .line{
     height:1px;
     background: #ccc;
 }
 .pas div{
    /* line-height: 0.4rem;   */
     /* border: 1px  solid red; */
 }
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
     height: 0.42rem;
     widows: 3rem;
     /* border: 1px solid red; */
     /* font-size: 0.18rem; */
 }
 .tip{
     display:flex;
     height: 0.6rem;
     margin-left: 5.3%;
     padding-top:0.1rem;
     margin-right: 5.3%;
 }
 .tip p:nth-of-type(1){
     margin-right: 0.1rem;
 }
 .tip p:nth-of-type(1) img{
    width: 0.18rem;
    height: 0.18rem;
 }
 .tip p:nth-of-type(2){
    font-family: PingFangSC-Regular;
    font-size: 0.13rem;
    color: #666666;
    letter-spacing: 0;
    text-align: left;
 }
 .agree{
     display:flex;
     height: 0.6rem;
     margin-left: 5.3%;
     padding-top:0.16rem;
     margin-right: 5.3%;
    font-family: PingFangSC-Regular;
    font-size: 0.12rem;
    color: #666666;
    letter-spacing: 0;
    line-height:0.18rem;
 }
 .agree p:nth-of-type(1) img{
     margin-right: 0.1rem;
     width: 0.16rem;
     height: 0.16rem;
 }

</style>


