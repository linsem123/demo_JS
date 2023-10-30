<template>
	<div>
    <!-- 头部 -->
    <top-head>
      <div slot="left"></div>
      <div slot="main">支付结果</div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->

    <div class="result-wrap">
      <div class="top-blank"></div>

      <img class="success-img" src="@/assets/images/pay-success.png" />

      <h4 class="success-text">支付成功</h4>
      <div class="success-btn-wrap">
        <a class="success-btn yellow-btn" @click="redirect('/my/orders')">查看订单</a>
        <a class="success-btn white-btn"  @click="redirect('/')">返回首页</a>
      </div>
    </div>
  </div>
</template>

<script>
import topHead from "@/views/components/TopHead.vue";
import { Toast } from "mint-ui";

export default {
  components: {
    topHead,
  },
  data() {
    return {
      mall_token:"",
    };
  },
  computed: {
  },
  mounted() {
    // this.init();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.init();
    })
  },
  methods: {
    init: function() {
      this.mall_token = utils.storageGet("mall_token");
    },
    redirect: function(path,event_name) {
      this.$router.push({path: path});
    }.after(function(path,event_name){
      if(event_name){
        utils.trackEvent(event_name);
      }
    }),
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";
.result-wrap {
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  overflow-y: auto;
  text-align:center;

  .success-img {
    display: inline-block;
    margin:1.5rem auto 0 auto;
    width: 2.25rem;
    height:2rem;
  }
  .success-text {
    margin-top:0.4rem;
    font-size:0.44rem;
    line-height: 0.44rem;
  }
  .success-btn-wrap {
    margin-top:1.1rem;
    padding:0 0.4rem;
    box-sizing: border-box;
    .success-btn {
      height:0.98rem;
      line-height: 0.98rem;
      font-size:0.36rem;
      border-radius: 0.5rem;
      margin-bottom:0.3rem;
      font-weight:bold;
    }
  }
}
</style>