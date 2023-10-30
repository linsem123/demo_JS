<template>
  <div class="sus">
    <div class="sus-top">
      <div class="sus-img">
        <img src="@/assets/images/autostage/success.png" alt="">
      </div>
      <p class="sus-apply">自动分期开通成功</p>
      <p>如需撤销可通过我行网银办理</p>
    </div>
    <div class="sus-info">以下是您的自动分期信息</div>
    <div class="sus-table">
        <div class="sus-card clear">
            <img src="@/assets/images/autostage/logo.png" alt="">
            <div class="cardName card">兴业银行信用卡</div>
            <div class="cardNo card">{{susInfo.cardNo}}</div>
        </div>
        <div class="sus-list">
            <ul>
                <li>
                    <span>起分金额</span>
                    <span>¥{{susInfo.money}}</span>
                </li>
                <li>
                    <span>手续费支付方式</span>
                    <span>{{susInfo.payType}}</span>
                </li>
                <li>
                    <span>分期期数</span>
                    <span>{{susInfo.period}}期</span>
                </li>
                <li>
                    <span>手续费率</span>
                    <span>{{susInfo.rate}}%{{periodShow}}</span>
                </li>
            </ul>
        </div>
    </div>
    <div class="foot">
      <div id="back" @click="closed">确定</div>
      <img src="@/assets/images/autostage/banner.png" alt="" class="footer" @click="goTo">  
    </div>
    <YVersion :version="version" top="4%"></YVersion>
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
        susInfo:{},
        periodShow:"/期"
      }
    },
    computed:mapState({
      version: state => state.autostage.version,
    }),
    components:{
      YVersion
    },
    created(){
      this.initSuccess();
    },
    methods:{
      initSuccess(){
        initsa("自动分期申请成功页"); //初始化监听
        this.susInfo = JSON.parse(this.$route.query.Sdata);
        if(this.susInfo.payType=="分期支付"){
          this.periodShow = "/期";
        }else if(this.susInfo.payType=="一次性支付"){
          this.periodShow = "";
        }
        history.pushState(null,null,document.URL);
        window.addEventListener("popstate",function(){
          history.pushState(null,null,document.URL);
        });
      },
      closed(){
        track("AutoStage_success","自动分期申请成功页确定按钮");
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
      },
      // 点击图片跳转预借现金
      goTo(){
        track("Autostage_successGoYJ","自动分期申请成功页点击图片");
        window.location.href = this.GLOBAL.URL+"/main/myhtml/cardPage/fins_index_%23_LendCash_HomePage.html";
        // window.location.href = "https://ccshop.cib.com.cn:8010/evercos/main/myhtml/cardPage/fins_index_%23_LendCash_HomePage.html";
      }
    }
  }
</script>
<style scoped>
.sus{background:#F3F5F9;height: 100%;}
.sus-top{text-align: center;background:#FFF;}
.sus-img img{width: 1.18rem;margin: 0.32rem 0 0.16rem;}
.sus-top .sus-apply{font-size: 0.18rem;letter-spacing: 0.0022rem;line-height: 0.24rem;height: 0.24rem;}
.sus-top p:last-child{font-size: 0.11rem;color: #A9A9A9;letter-spacing: 0.0013rem;text-align: center;
line-height: 0.2rem;height: 0.2rem;padding-bottom: 0.13rem;}
.sus-info{background: #F3F5F9;font-size: 0.14rem;height: 0.35rem;line-height: 0.35rem;color: #666666;letter-spacing: 0.0017rem;
padding-left: 5.3%;}
.sus-table{background:#FFF;padding-top: 0.2rem;padding-bottom: 0.16rem;}
.sus-card{margin-bottom: 0.32rem;}
.sus-card img{width: 0.28rem;float: left; position: relative;left: 5.3%;top: 0.12rem;}
.sus-card .card{font-size: 0.15rem;color: #000;height: 0.21rem;line-height: 0.21rem;padding-left: 16.3%;}
.sus-list{padding:0 5.3%;}
.sus-list li{display: flex;justify-content: space-between;margin-bottom: 0.2rem;}
.sus-list li:last-child{margin:0;}
.sus-list li span{font-size: 0.14rem;height: 0.2rem;line-height: 0.2rem;}
.sus-list li span:first-child{color:#666;}
.sus-list li span:last-child{color:#000;}
.sus-list li span b{font-weight: normal;}
/* 底部 */
.foot{padding:0 5.3%;box-sizing: border-box;padding-top: 0.3rem;}
#back{background: #5084FF;border-radius: 0.22rem;font-size: 0.16rem;height: 0.45rem;line-height: 0.45rem;text-align: center;color: #FFFFFF;
letter-spacing: 0.0019rem;}
.footer{width:100%;margin-top:0.18rem;border-radius: 0.3rem;}
</style>
