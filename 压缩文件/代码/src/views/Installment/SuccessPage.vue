<template>
    <div class="failbox">
        <div class="fbox1">
            <img src="../../assets/images/installment/success.png" alt="">
        </div>
        <div class="fbox2">
            <p class="p">分期办理成功</p>
            <p>微信对话框输入“分期”更多分期业务</p>
            <p>小兴随时为您办理。</p>
        </div>
        <div class="fbox3">
             以下是您的账单分期信息
        </div>
     <div  class="msg">
            <div class="fenqibox2"><div>信用卡</div><div><span>{{homepage.mainCard.cardNo}}</span></div></div>
            <div class="fenqibox2"><div>交易币种</div><div><span>{{homepage.currencyType}}</span></div></div>
            <div class="fenqibox2"><div>分期金额</div><div><span v-if="this.btn.curency">￥</span><span v-else>$</span><span>{{homepage.smppamt}}</span></div></div>
            <div class="fenqibox2"><div>手续费支付方式</div><div><span>{{apply.List[apply.in].payname}}</span></div></div>
            <div class="fenqibox2"><div>分期期数</div><div><span>{{homepage.period}}期</span></div></div>   
         
         <!-- 分期 -->
          <div class="fq" v-if="apply.in==0" >
            <div class="fenqibox2"><div>每期应还金额</div><div><span v-if="btn.curency">￥</span><span v-else>$</span><span>{{homepage.instalAmt}}</span></div></div>
            <div  id="fcolor">
                <div class="fenqibox2"><div>每期应还本金</div><div><span v-if="btn.curency">￥</span><span v-else>$</span><span>{{homepage.fEachMoney}}</span></div></div>
                <div class="fenqibox2"><div>每期应还手续费</div><div><span v-if="btn.curency">￥</span><span v-else>$</span><span>{{homepage.eachCharge}}</span></div></div>
            </div>
         </div>
         <!-- 一次性 -->
         <div  v-if="apply.in==1">
           <div  id="ycolor">
                <div class="fenqibox2"><div>每期应还金额</div><div><span v-if="this.btn.curency">￥</span><span v-else>$</span><span>{{homepage.yEachMoney}}</span></div></div>
                <div class="fenqibox2"><div>一次性手续费</div><div><span v-if="this.btn.curency">￥</span><span v-else>$</span><span>{{homepage.oneCharge}}</span></div></div>
           </div>
         </div>
     </div>
        <!--  -->
         <div class="hongbao">
              <span  v-show="homepage.redbag.user">红包优惠已享受</span>
         </div>
         <div  class="fbox4">
        
            <!-- <a href="https://test.xliane.com/evercos/main/myhtml/cardPage/fins_index_%23_consume_HomePage.html" @click="shoptryshop"  ><div>试试消费分期</div></a> -->
            <a href="https://ccshop.cib.com.cn:8010/evercos/main/myhtml/cardPage/fins_index_%23_consume_HomePage.html" @click="shoptryshop"  ><div>试试消费分期</div></a>
           <a @click="assured" href="https://ccshop.cib.com.cn:8010/evercos/main/actIndex/index.html"><div>确定</div></a>
         </div>
       <YVersion top='5%' :version="version"></YVersion>
    </div>
</template>

<script>
import YVersion from "@/components/YVersion.vue";
import {mapActions,mapState,mapGetters} from "vuex";
import {initsa,track,saAlert} from "@/assets/js/common.js"; //听云监听
export default {
    name:"SuccessPage",
    components:{YVersion},
    data(){
        return{
        }
    },
    methods:{
    shoptryshop(){
        track("zdfq_tryshop","点击试试消费按钮跳消费分期")
    },
    assured(){
        track("zdfq_assured","点击确定按钮跳更多服务")
    },
    
    },
    computed:{
        ...mapState({
            homepage:state=>state.zd.homepage,
            cardList:state=>state.zd.homepage.cardList,
            apply:state=>state.zd.apply,
            btn:state=>state.zd.btn,
            version:state=>state.zd.version,
        })
    },
     created(){
       initsa("账单分期成功页面");
       console.log("传过来的值",JSON.parse(this.$route.query.value));
       let val = JSON.parse(this.$route.query.value) ;
        this.homepage.mainCard.cardNo = val.cardNo;
        this.apply.List[this.apply.in].payname= val.payType;
        this.homepage.smppamt = val.smppamt;
        this.homepage.currencyType = val.currencyType;
        this.homepage.instalAmt = val.instalAmt;
        this.homepage.Feachmoney = val.Feachmoney;
        this.homepage.eachCharge = val.eachCharge;
        this.homepage.Yeachmoney =  val.Yeachmoney;
        this.homepage.oneCharge = val.oneCharge;
        this.homepage.period = val.period
      },
}
</script>
 <style scoped>
.fenqibox2 {
    display: flex;
    justify-content: space-between;
    margin: 0.05rem 0.02rem 0 0.02rem;
  } 
#fcolor{
    background-color:rgba(80,133,255,0.1); 
    font-size: 0.11rem;
    margin-top: 0.15rem;
   font-family: PingFangSC-Regular;
   font-size: 0.11rem;
   color: #999999;
   letter-spacing: 0;
   padding: 0.05rem;
}
#ycolor{
   font-family: PingFangSC-Regular;
   font-size: 0.11rem;
   color: #666666;
   letter-spacing: 0;
}
#fcolor span{
  font-size: 0.11rem; 
}



 /*  */
 .failbox{
     overflow: hidden;
     padding-top: 0.3rem;
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
     font-size: 0.18rem;
     font-family: PingFangSC-Regular;
     color: #000;
     font-weight: bold;
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
    margin-left: 5.3%;
    margin-right: 5.3%;
    font-size: 0.14rem;
    color:#666666;
}
.msg span{
font-family: PingFangSC-Regular;
font-size: 0.14rem;
color: #000000;
letter-spacing: 0;
}
.hongbao{
font-family: PingFangSC-Regular;
font-size: 0.1rem;
color: #F93939;
letter-spacing: 0;
line-height: 0.17rem;
margin-left: 5.3%;
margin-top: 0.08rem;
margin-bottom: 0.32rem;
}
.fbox4{
    display: flex;
    justify-content: space-around;
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
   font-family: PingFangSC-Regular;
   font-size: 0.14rem;
}
 </style>
 
