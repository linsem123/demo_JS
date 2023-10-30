<template>
    <div class="container">
      <div class="fbox1">
        <img src="../../assets/images/consumeInstallment/success.png" alt="">
      </div>
      <div class="fbox2">
        <p class="p">分期办理成功</p>
        <p>微信对话框输入“分期”更多分期业务</p>
        <p>小兴随时为您办理。</p>
      </div>
      <div class="fbox3">以下是您的账单分期信息</div>
      <div  class="msg">
        <div class="fenqibox2">
          <div>信用卡</div><div><span>{{home.mainCard.cardNo}}</span></div>
        </div>
        <div class="fenqibox2">
          <div>交易币种</div>
          <div>
            <span v-if="home.image">人民币</span><span v-else>美元</span>
          </div>
        </div>
        <div class="fenqibox2">
          <div>分期金额</div>
          <div><span v-if="home.image">￥</span><span v-else>$</span><span>{{money.payTotle}}</span></div>
        </div>
        <div class="fenqibox2">
          <div>手续费支付方式</div><div><span>{{apply.mainWay.payName}}</span></div>
        </div>
        <div class="fenqibox2">
          <div>分期期数</div><div><span>{{apply.mainNper.period}}期</span></div>
        </div>
        <!--分期or一次性显示切换-->
        <div class="fq" v-if="apply.tab == 0">
          <div class="fenqibox2">
            <div>每期应还金额</div>
            <div><span v-if="home.image">￥</span><span v-else>$</span><span>{{result.eachReturn}}</span></div>
          </div>
          <div class="small">
            <div class="left leftBottom">
              <div>每期应还本金</div>
              <div class="right">
                <span v-if="home.image">￥</span><span v-else>$</span><span>{{result.eachPrincipal}}</span>
              </div>
            </div>
            <div class="left">
              <div>每期应还手续费</div>
              <div class="right">
                <span v-if="home.image">￥</span><span v-else>$</span><span>{{result.eachRate}}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="fenqibox2">
            <div>每期应还金额</div>
            <div><span v-if="home.image">￥</span><span v-else>$</span><span>{{result.eachPrincipal}}</span></div>
          </div>
          <div class="fenqibox2">
            <div>一次性手续费</div>
            <div><span v-if="home.image">￥</span><span v-else>$</span><span>{{result.oneRate}}</span></div>
          </div>
        </div>
        <!--end-->
      </div>
      <div class="hongbao" v-show="result.showRed">
          <span>红包已优惠</span>
      </div>
      <div class="fbox4">
        <a :href="link.toBill" @click="tryBill"><div>试试账单分期</div></a>
        <a :href="link.toMore" @click="tryMore"><div>确定</div></a>
        <!--<a href="#" @click="tryMore"><div>确定</div></a>-->
      </div>
      <YVersion top="5%" :version="version"></YVersion>
    </div>
</template>

<script>
import {mapActions,mapState,mapGetters} from "vuex";
import YVersion from "../../components/YVersion";
import {initsa,track} from "@/assets/js/common.js"
export default {
    name:"SuccessPage",
    data(){
        return{

        }
    },
    components:{
      YVersion,
    },
    created(){
      initsa("消费分期成功页面");
      console.log("传值",JSON.parse(this.$route.query.val));
      let val = JSON.parse(this.$route.query.val);
      this.result.eachReturn = val.eachReturn;
      this.result.eachPrincipal = val.eachPrincipal;
      this.result.eachRate = val.eachRate;
      this.result.oneRate = val.oneRate;
      this.home.mainCard = val.card;
      this.home.image = val.image;
      this.apply.mainWay = val.payWay;
      this.apply.mainNper = val.mainNper;
      this.money.payTotle = val.money;
      this.apply.tab = val.tab;

      if(val.useRed == '1'){
        this.result.showRed = true;
      }else if(val.useRed == '0'){
        this.result.showRed = false;
      }
    },
    methods:{
      tryBill(){
        track("xffq_tryBill","跳账单分期");
      },
      tryMore(){
        track("xffq_tryMore","跳热门活动");
      //   var ua = navigator.userAgent.toLowerCase();
      //   var isWeixin = ua.indexOf('micromessenger') != -1;
      //   if (isWeixin) {
      //     window.location.href = 'https://www.baidu.com/';
      //   }else{
      //     console.log("不是微信")
      //   }
      }
    },
    computed:{
        ...mapState({
          home : state => state.co.home,
          version : state => state.co.version,
          apply : state => state.co.apply,
          money: state => state.co.apply.money,
          result: state => state.co.result,
          alert : state => state.co.alert,
          link : state => state.co.link
        })
    }
}
</script>
 <style scoped>
   .container{
     /*overflow: hidden;*/
     padding-top: 0.3rem;
   }
  .fenqibox2 {
      display: flex;
      justify-content: space-between;
      margin: 0.05rem 0.02rem 0 0.02rem;
    }
  .fenqibox2>div:nth-child(1){
    color: #666;
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
  color: #999;
 }
 .fbox2 .p{
     margin-bottom: 0.1rem;
 }
 .fbox2 p:nth-of-type(1){
     font-size: 0.18rem;
     color: #000;
     font-weight: bold;
 }
.fbox3{
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
    margin-left: 5.3%;
    margin-right: 5.3%;
    font-size: 0.14rem;
}
.hongbao{
    color: red;
    margin:0.08rem 0 0 5.3%;
    font-size: 0.1rem;
}
.fbox4{
    display: flex;
    justify-content: space-around;
  margin-top: 0.2rem;
}
.fbox4 div{
   height: 0.45rem;
   width: 1.52rem;
   background: #5084FF;
   border-radius: 0.22rem;
   text-align: center;
   line-height: 0.45rem;
}
.fbox4 a{
   color: #fff;
   font-size: 0.14rem;
}
.small{
  margin: 0.15rem 0 0;
  background-color:rgba(80,133,255,0.1);
  padding:0.1rem;
  font-size: 0.11rem;
}
   .left{
     display: flex;
     justify-content: space-between;
     color: #999;
   }
   .leftBottom{
     margin-bottom: 0.08rem;
   }
   .right{
     color:#000
   }
 </style>
 
