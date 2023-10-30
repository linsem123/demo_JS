
<template>
    <div class="contain">
        <div class="box">
          <div class="fbox1">
            <img src="../../../assets/images/financial/turnmoney/zr.png" alt="">
         </div>
         <div class="fbox2">
            <p class="p">转入成功</p>
            <p>微信对话框输入“分期”更多分期业务</p>
            <p>小兴随时为您办理。</p>
         </div>
         <div class="fbox3">
             以下是您的转入信息
         </div>
        </div>
        <div  class="msg">
            <div class="fenqibox2"><div>转入金额</div><div><span>{{homepage.money}}</span></div></div>
            <div class="fenqibox2"><div>添利账户余额</div><div><span>{{homepage.balance}}</span></div></div>
            <div class="fenqibox3"><div>转出账户</div><div><span>{{homepage.cardName}} <br>{{homepage.cardNo}}</span></div></div>
            <div class="fenqibox2"><div>转入时间</div><div><span>{{homepage.operationTime}}</span></div></div>
    </div>
     <YFunctionBtn :text="handlebtn.text" :dis="handlebtn.dis" v-on:checktable="definite"></YFunctionBtn>
    <YVersion top='10%' :version="version"></YVersion>
 </div>  
</template>
<script>
import YFunctionBtn from "@/components/YFunctionBtn.vue";
import YVersion from "@/components/YVersion.vue";
import { mapState } from 'vuex';
export default {
    name:"enterSuccess",
    components:{YFunctionBtn,YVersion},
    data(){
        return{

        }
    },
    methods:{
        definite(){
            
        }
    },
    computed:{
    ...mapState({
        handlebtn:state => state.lc_enter.handlebtn, 
        version:state => state.lc_enter.version,
        homepage:state => state.lc_enter.homepage     
      }),
  },
  created(){
      //this.$router是实例    this.$route实例属性
      let val=JSON.parse(this.$route.query.val)
      console.log(val)
      this.homepage.money=val.money   //转入余额
      this.homepage.balance=val.balance   //添利账户余额
      this.homepage.cardName=val.cardName //银行名称
      this.homepage.cardNo=val.cardNo     //卡号
      this.homepage.operationTime=val.operationTime  //操作时间  
      console.log(this.homepage)
  }
    
}
</script>
 <style scoped>
 .box{
     background: #fff;
     padding-top: 0.3rem;
 }
.fenqibox2 {
    display: flex;
    justify-content: space-between;
    margin: 0.1rem 0.02rem 0 0.02rem;
  } 
.fenqibox3{
    margin: 0.1rem 0.02rem 0 0.02rem;
    display: flex;
}
.fenqibox3 div:nth-of-type(2){
    text-align: right;
    margin-left: 1.7rem;
    width: 1.4rem;
}
.msg .fenqibox2:nth-of-type(1){
    padding-top: 0.2rem;
}
.msg {
    padding-bottom: 0.2rem;
}
 .contain{
     background: #F3F5F9;
     overflow: hidden;
     height: 100%;
 }
 .fbox1{
     width: 1.4rem;
     height: 1.15rem;
     margin: 0 auto;
 }
 .fbox1 img{
     width: 1.4rem;
     height: 1.15rem;
 }
 .fbox2{
     width: 100%;
     margin-top: 0.2rem;
 }
 .fbox2 p{
  text-align: center;
  line-height: 0.22rem;
  font-size: 0.13rem;
  font-family: PingFangSC-Regular;
  color: #999;
 }
 .fbox2 .p{
     margin-bottom: 0.1rem;
 }
 .fbox2 p:nth-of-type(1){
     font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #000000;
    letter-spacing: 0;
    text-align: center;
 }
.fbox3{
   font-family: PingFangSC-Regular;
   font-size: 0.14rem;
   color: #666666;
   background: #F3F5F9;
   height: 0.35rem;
   margin-top: 0.3rem;
   line-height: 0.35rem;
   text-align: left;
   text-indent:0.2rem;
}
.msg{
    padding-left: 5.3%;
    padding-right: 5.3%;
    font-size: 0.14rem;
    color:#666666;
    background: #fff;
}
.msg span{
font-family: PingFangSC-Regular;
font-size: 0.14rem;
color: #000000;
letter-spacing: 0;
}


 </style>
 




