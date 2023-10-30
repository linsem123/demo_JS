<template>
  <div class="sus">
    <div class="sus-top">
      <div class="sus-img">
        <img src="@/assets/images/Sxf/success.png" alt="">
      </div>
      <p class="sus-apply">随兴分消费备用金申请成功</p>
      <!-- <p>我行将在两个工作日内放款请留意资金到账情况</p> -->
    </div>
    <div class="sus-info">随兴分消费备用金信息</div>
    <div class="sus-table">
      <div class="sus-cell clear">
        <label for="sus-num">申请金额</label>
        <p>￥<span class="sus-num">{{susInfo.applyAmt}}</span></p>
      </div>
      <div class="sus-cell clear" style="margin:0;">
        <label for="sus-amount">收款账户</label>
        <p><span class="sus-amount">兴业银行</span></p>
      </div>
      <div class="sus-cell clear">
        <label for="sus-cardNum"></label>
        <p><span class="sus-cardNum">{{susInfo.cardNo}}</span></p>
      </div>
      <div class="blank"></div>
      <div class="sus-cell clear">
        <label for="sus-firstNum">首期还款金额</label>
        <p>￥<span class="sus-firstNum">{{susInfo.returnAmt}}</span></p>
      </div>
      <div class="sus-cell clear">
        <label for="sus-firstDate">首期还款日期</label>
        <p><span class="sus-firstDate">{{susInfo.accountDate}}</span></p>
      </div>
    </div>
    <div class="foot">
      <div id="back" @click="closed">返回</div>
    </div>
    <YVersion :version="version" top="5%"></YVersion>
  </div>
</template>
<script>
  import YVersion from "../../components/YVersion";
  import {mapActions,mapState} from "vuex";
  import {initsa,track} from "@/assets/js/common.js"; 
  export default {
    name: 'SuccessPage', 
    data () {
      return {
        susInfo:{}
      }
    },
    computed:mapState({
      version: state => state.sxf.version,
    }),
    components:{
      YVersion
    },
    created(){
      this.initSuccess();
    },
    methods:{
      initSuccess(){
        initsa("随兴分申请成功"); 
        this.susInfo = JSON.parse(this.$route.query.Sdata);
      },
      closed(){
        track("BorrowedMoney_successClose","随兴分申请成功页关闭按钮");
        window.location.href = this.GLOBAL.URL+"/main/myhtml/cardPage/fins_index_%23_Sxf_HomePage.html";
        // window.location.href = "https://ccshop.cib.com.cn:8010/evercos/main/myhtml/cardPage/fins_index_%23_Sxf_HomePage.html";
      }
    }
  }
</script>
<style scoped>
.sus{background:#F3F5F9;height: 100%;}
.sus-top{text-align: center;padding:0 0.2rem;box-sizing: border-box;background:#FFF;}
.sus-img img{width: 1.4rem;margin: 0.36rem 0 0.09rem;}
.sus-top .sus-apply{font-size: 0.18rem;letter-spacing: 0.0022rem;line-height: 0.24rem;padding-bottom: 0.16rem;height: 0.24rem;}
.sus-info{background: #F3F5F9;font-size: 0.14rem;height: 0.35rem;line-height: 0.35rem;color: #666666;letter-spacing: 0.0017rem;padding-left: 0.2rem;}
.sus-table{background:#FFF;padding-top: 0.11rem;padding-bottom: 0.07rem;}
.sus-cell{padding:0 0.2rem;box-sizing: border-box;font-size: 0.14rem;height: 0.2rem;margin-bottom: 0.07rem;line-height: 0.2rem;}
.sus-cell label{float: left;color:#666;}
.sus-cell p{float: right;width:2.31rem;text-align: right;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
.sus-blank{margin-left: 0.2rem;background: #DDDDDD;border-radius: 0.1rem;height: 0.01rem;box-sizing: border-box;margin-top: 0.11rem;
margin-bottom: 0.11rem;}
.foot{padding:0 0.2rem;box-sizing: border-box;padding-top: 0.3rem;}
#back{background: #5084FF;border-radius: 0.22rem;font-size: 0.16rem;height: 0.45rem;line-height: 0.45rem;text-align: center;color: #FFFFFF;
letter-spacing: 0.0019rem;}
.footer{width:100%;margin-top:0.36rem;}
.blank{height: 1px;background: #EAEAEA;margin: 0.07rem 0 0.12rem 5.3%;}
</style>