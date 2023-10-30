<template>
  <div id="fail">
    <div class="fail-top">
      <img src="@/assets/images/Sxf/lose.png" alt="" class="fail-img">
    </div>
    <div class="fail-content">
      您暂时无法办理随兴分消费备用金业务，可前往现金分期办理页面
    </div>
    <div class="try" @click="next">
      <span id="attempt">试试现金分期</span>
    </div>
    <YVersion :version="version" top="5%"></YVersion>
  </div>
</template>

<script>
  // 引入所需的方法、组件
  import {mapActions,mapState} from "vuex";
  import {initsa,track} from "@/assets/js/common.js"; //听云监听
  import YVersion from "../../components/YVersion";
  export default {
    name: 'FailPage', // 申请失败页面
    data () {
      return { //绑定数据
      }
    },
    computed:mapState({
      version:state => state.sxf.version
    }),
    components:{
      YVersion
    },
    created(){
      initsa("随兴分申请失败"); //初始化监听
    },
    methods:{
      next(){
        track("sxf_FailNext","随兴分失败页现金分期跳转按钮");
        window.location.href = this.GLOBAL.URL+"/main/myhtml/cardPage/fins_index_%23_CashInstalment_HomePage.html";
        // window.location.href = "https://ccshop.cib.com.cn:8010/evercos/main/myhtml/cardPage/fins_index_%23_CashInstalment_HomePage.html";
      }
    }
  }
</script>
<style scoped>
#fail{background: #FFF;height: 100%;text-align: center;}
.fail-img{width: 1.4rem;margin:0.62rem 0 0.44rem;}
.fail-content{font-size: 0.16rem;width:2.96rem;line-height: 0.24rem;margin:0 auto 0.77rem;}
.try{width: 3.35rem;margin: 0 auto;background: #5084FF;border-radius: 0.22rem;height: 0.45rem;line-height: 0.45rem;}
#attempt{font-size: 0.16rem;color: #FFFFFF;letter-spacing: 0.0019rem;}
#copyright{font-size:0.12rem;text-align: center;color:#666;margin-top:0.4rem;}
</style>