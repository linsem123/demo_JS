<template>
  <div class="sus">
    <div class="sus-top">
      <div class="sus-img">
        <img src="@/assets/images/borrowedMoney/success.png" alt="">
      </div>
      <p class="sus-apply">随借金申请提交成功</p>
      <p>我行将在两个工作日内放款请留意资金到账情况</p>
    </div>
    <div class="sus-info">随借金信息</div>
    <div class="sus-table">
      <div class="sus-cell clear">
        <label for="sus-num">申请金额</label>
        <p>￥<span class="sus-num">{{susInfo.applyMoney}}</span></p>
      </div>
      <div class="sus-cell clear" style="margin:0;">
        <label for="sus-amount">收款账户</label>
        <p><span class="sus-amount">{{susInfo.debitcardName}}借记卡</span></p>
      </div>
      <div class="sus-cell clear">
        <label for="sus-cardNum"></label>
        <p><span class="sus-cardNum">{{susInfo.debitcardNo}}</span></p>
      </div>
      <div class="blank"></div>
      <div class="sus-cell clear">
        <label for="sus-time">约定还款日</label>
        <p><span class="sus-tine">{{susInfo.repayDate}}</span></p>
      </div>
      <div class="sus-cell clear">
        <label for="sus-day">借款天数</label>
        <p><span class="sus-day">{{susInfo.borrowDay}}天</span></p>
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
      homedata:state => state.brm.home.homedata,
      version: state => state.brm.version,
    }),
    components:{
      YVersion
    },
    created(){
      this.initSuccess();
    },
    methods:{
      initSuccess(){
        initsa("随借金申请成功"); 
        this.susInfo = JSON.parse(this.$route.query.Sdata);
      },
      closed(){
        track("BorrowedMoney_successClose","随借金申请成功页关闭按钮");
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
          WeixinJSBridge.call('closeWindow');
        }else{
          var userAgent = navigator.userAgent; 
          if(userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") !=-1) { 
            window.location.href="about:blank"; 
            window.close();
          }else if(userAgent.indexOf("Android") > -1 || userAgent.indexOf("Linux") > -1){ 
            window.opener=null;window.open("about:blank","_self","").close(); 
            window.close();
          }else { 
            window.opener = null; 
            window.open("about:blank", "_self"); 
            window.close(); 
          }   
        }
      }
    }
  }
</script>
<style scoped>
.sus{background:#F3F5F9;height: 100%;}
.sus-top{text-align: center;padding:0 0.2rem;box-sizing: border-box;background:#FFF;}
.sus-img img{width: 1.4rem;margin: 0.36rem 0 0.09rem;}
.sus-top .sus-apply{font-size: 0.18rem;letter-spacing: 0.0022rem;line-height: 0.24rem;margin-bottom: 0.16rem;height: 0.24rem;}
.sus-top p:last-child{font-size: 0.13rem;color: rgba(0,0,0,0.50);letter-spacing: 0;line-height: 0.18rem;padding-bottom: 0.27rem;height: 0.18rem;}
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