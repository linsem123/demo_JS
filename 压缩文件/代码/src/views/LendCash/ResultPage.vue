<template>
  <div class="result">
    <div class="result-top">
      <div class="result-img">
        <img src="@/assets/images/lendcash/lose.png" alt="">
      </div>
      <p class="result-apply">预借现金申请失败</p>
      <p class="result-info">您本次预借现金申请提交成功，请查询收款账户确认转账结果</p>
    </div>
    <div class="foot">
      <div id="reapply" @click="reapply">重新申请</div>
      <div id="finish" @click="finish">完成</div>  
    </div>
    <YVersion :version="version" top="10%"></YVersion>
  </div>
</template>
<script>
  import YVersion from "../../components/YVersion";
  import {mapActions,mapState} from "vuex";
  import {initsa,track} from "@/assets/js/common.js"; 
  export default {
    name: 'ResultPage', 
    data () {
      return {
      }
    },
    computed:mapState({
      version: state => state.lc.version,
    }),
    created(){
      initsa("预借现金申请结果"); //初始化监听
    },
    components:{
      YVersion
    },
    methods:{
      reapply(){           // 重新申请
        this.$router.push({path: '/LendCash/HomePage'});
        track("LendCash_reapply","预借现金申请结果页重新申请按钮");
      },
      finish(){            // 完成
        track("LendCash_finish","预借现金申请结果页完成按钮");
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
.result{background:#F3F5F9;height: 100%;}
.result-top{text-align: center;padding:0 0.2rem;box-sizing: border-box;background:#FFF;}
.result-img img{width: 1.4rem;margin: 0.36rem 0 0.09rem;}
.result-top .result-apply{font-size: 0.18rem;letter-spacing: 0.0022rem;line-height: 0.24rem;height: 0.24rem;
margin-bottom: 0.16rem;}
.result-info{font-size: 0.13rem;color: rgba(0,0,0,0.50);letter-spacing: 0;line-height: 0.18rem;
padding-bottom: 0.27rem;height: 0.18rem;}
.foot{padding:0 0.2rem;box-sizing: border-box;padding-top: 0.3rem;}
#reapply{background: #5084FF;border-radius: 0.22rem;font-size: 0.16rem;height: 0.45rem;line-height: 0.45rem;
text-align: center;color: #FFFFFF;
letter-spacing: 0.0019rem;}
#finish{font-size: 0.16rem;text-align: center;color:#5084FF;margin: 0.2rem 0;}
</style>
