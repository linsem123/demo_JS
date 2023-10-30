<template>
	<div class="main">
   <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">一键回购</div>
      <div slot="right"></div>
    </top-head>

    <!-- 头部 -->
    <div class="content">
      <img src="@/assets/images/yjhg.jpg" alt="">
    </div> 
  </div>
</template>

<script>

import topHead from "@/views/components/TopHead.vue";

export default {
  components: {
    topHead
  },
  methods:{
    goBack(){
      this.$router.goBack();
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/variable.less";

.content {
	background:#171858;
  min-height: 100vh;
  margin-top:1rem;
  width: 100vw;
  height:100vh;
  overflow:auto;
	img{
		display:block;
		margin:0 auto;
		width:100%;
	}
}
</style>
