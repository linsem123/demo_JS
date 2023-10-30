<template>
 <div class="contain">
     <wjChangeBank :cardList="homepage.cardList" :main="homepage.mainCard" :bankIndex="homepage.index" 
    :showMain='true' :showMoney='homepage.showMoney'  v-on:change="changecard" :showDebit='true' :text='ui.text' :unit="ui.unit"></wjChangeBank>
    <p class="p"></p>
     <!-- 输入金额 -->
    <div class="amt">
          <div class="a">输入金额</div>
          <p class="err1"> <span  class="err" v-show='homepage.err'>{{homepage.msg}}</span></p>
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
       @achieveValue="achieveValue" @getCode="getSms" type="zhuanchu" :innerHeight="innerHeight"></ylTextCode>
    <div class="tit">短信验证码将发送至您办理信用卡时在银行预留的手机号</div>
    <YFunctionBtn :text="turnenter.text" :dis="dis" v-on:checktable="submit"></YFunctionBtn>
 </div> 
</template>
<script>
import wjChangeBank from './wjChangeBank';
import ylTextCode from "@/components/ylTextCode";
import YFunctionBtn from "@/components/YFunctionBtn.vue";
import { mapState,mapGetters} from 'vuex';
export default {
 name:"Homepage",
 components:{wjChangeBank,ylTextCode,YFunctionBtn},
 data(){
     return{

     }
 },
 methods:{
    changecard(index){
         this.homepage.mainCard=this.homepage.cardList[index]
         this.homepage.index=index
        //处理标题金额是否显示
         if(this.homepage.mainCard.cardType==2){
           this.homepage.showMoney=true
       }else{
          this.homepage.showMoney=false
       }
       // 置空
          this.homepage.smppamt=""
          this.homepage.err=false
          this.homepage.msg=""
     },
    passmax(e){
        this.homepage.smppamt = this.homepage.smppamt.replace(/[^\d.]/g,""); // 限制只能输入数字和小数点
        this.homepage.smppamt = this.homepage.smppamt.replace(".","$#$").replace(/\./g,"").replace("$#$","."); // 清除多余小数点
        this.homepage.smppamt = this.homepage.smppamt.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//小数位只保留2位
        this.homepage.smppamt.substring(0, 1) === '.' && (this.homepage.smppamt = '0' + this.homepage.smppamt );
        if(this.homepage.mainCard.cardType=='2'){
            let availAmt=Number(this.homepage.mainCard.availAmt)*Number(10000)
            console.log(availAmt)
         if(Number(this.homepage.smppamt)>availAmt){
            console.log(availAmt)
             this.homepage.err=true;
             this.homepage.msg="不高于单笔转出限额"
         }else{
             this.homepage.err=false;
             this.homepage.msg=""
         }
      }

    },
    pass(){
        this.homepage.pass = this.homepage.pass.replace(/[^\d]/g,""); 
        console.log(this.homepage.pass)
    },
    no(){},
    achieveValue(){},
    getSms(){},
    submit(){}
 },
 computed:{
    ...mapState({
        homepage:state=>state.lc_out.homepage,
        baseData:state=>state.lc_out.baseData,
        ui:state=>state.lc_out.ui,
        innerHeight:state=>state.lc_out.innerHeight,
        mana:state=>state.lc_out.manage,
        turnenter: state => state.lc_out.turnenter,
         ...mapGetters('lc_enter', {
        dis: 'dis',   
      }),
    })
 },
 created(){
     let obj={a:'123'}
     this.$store.commit('lc_out/SETBASEDATA',obj)
     this.$store.dispatch('lc_out/outhome',this.baseData)
     console.log(this.ui.text)
     console.log(this.ui.unit)
    //  console.log(this.homepage.mainCard)
    //  this.homepage.mainCard=this.homepage.cardList[0]
    //  console.log(this.homepage)
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
.p{
      height: 0.1rem;
      background: #F3F5F9;
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
    opacity: 0.5;
  }
</style>


