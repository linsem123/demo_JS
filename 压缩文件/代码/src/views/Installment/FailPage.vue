<template>
    <div  class="sbox">
         <p class="line"></p>
          <div class="sbox1">
            <img src="../../assets/images/installment/fail.png" alt="">
        </div>
        <div class="sbox2">
            <p class="p">该信用卡目前没有可</p>
            <p class="p">办理的账单分期</p>
            <p>您可以点击页面上方切换卡片或试试消费分期</p>
        </div>
        <div class="sbox3">
            <!-- <div href="https://test.xliane.com/evercos/main/myhtml/cardPage/fins_index_%23_consume_HomePage.html"><div>试试消费分期</div></a> -->
            <a  @click="failshop" href="https://ccshop.cib.com.cn:8010/evercos/main/myhtml/cardPage/fins_index_%23_consume_HomePage.html"><div>试试消费分期</div></a>
        </div>
    </div>
</template>


<script>
import {mapActions,mapState,mapGetters} from "vuex";
import {initsa,track,saAlert} from "@/assets/js/common.js"; //听云监听
export default {
    components:{
    },
    data(){
        return{
        walert:{
        show:false,
        msg:'账单业务兴业银行信用卡，账单业务兴业银行信用卡，账单业务兴业银行信用卡，账单业务兴业银行信用卡，账单业务兴业银行信用卡，账单业务兴业银行信用卡，账单业务兴业银行信用卡，账单业务兴业银行信用卡，账单业务兴业银行信用卡账单业务兴业银行信用卡账单业务兴业银行信用卡账单业务兴业银行信用卡<i  style="color:#0060F1;">《账单分期付款业务条款及细则》</i>',
        err:'',
        test:'我知道了',
      },
      hehe:"",
      onrate:true,
      ratename:'12',
        }
    },
    methods:{
        failshop(){
        track("zdfq_failshop","静态页面时试试消费分期")
        
    },
    }
}
</script>

<style scoped>
.p{
    margin-top: 0.05rem;
}
.line{
    height: 0.1rem;
    background: #F3F5F9;
}
.sbox{
     overflow: hidden;
 }
 .sbox1{
     padding-top: 0.3rem;
     width: 1.4rem;
     height: 1.15rem;
     margin: 0 auto;
 }
 .sbox1 img{
     width: 1.4rem;
     height: 1.15rem;
 }
 .sbox2{
     width: 100%;
     margin-top: 0.2rem;
 }
 .sbox2 p{
  line-height: 0.22rem;
  text-align: center;
  font-size: 0.13rem;
  font-family: PingFangSC-Regular;
  color: #999;
 }
 .sbox2 p:nth-of-type(1){
     font-size: 0.18rem;
     font-family: PingFangSC-Regular;
     color: #333;
 }
 .sbox2 p:nth-of-type(2){
     font-size: 0.18rem;
     font-family: PingFangSC-Regular;
     color: #333;
 }
.sbox3 div{
   height: 0.45rem;
   width: 3.35rem;
   background: #5084FF;
   border-radius: 0.22rem;
   text-align: center;
   line-height: 0.45rem;
   margin: 0 auto;
   margin-top: 0.4rem;
}
.sbox3 a{
    color: #fff;
   font-family: PingFangSC-Regular;
   font-size: 0.14rem;
}
.banben{
   text-align: center;
   font-size: 0.12rem;
   font-family: PingFangSC-Regular;
   color: #c2c2c2;
   margin-top: 3rem;
 }
</style>

