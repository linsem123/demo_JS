<template>
	<!-- 头部 -->
  <div class="top-head" :class="[{'show-border':show_border}]">
    <div v-if="!show_back" class="head-left">
      <slot name="left"></slot>
    </div>
    <div v-else class="head-left">
      <a v-if="show_back" href="javascript:;" class="go-back iconfont icon-back" @click="goBack();"></a>
    </div>
    <div class="head-title">
      <slot name="main"></slot>
    </div>
    <div class="head-right">
      <slot name="right"></slot>
    </div>
    <!-- <a class="right-cell" href="javascript:;" @click="rightClick">{{right_text}}</a> -->
  </div>
  <!-- 头部 -->
</template>

<script>
import { Toast } from "mint-ui";

export default {
  props: {
    show_border: {
      //是否显示border
      type: Boolean,
      default: true
    },
    show_back: {
      //是否展示返回按钮
      type: Boolean,
      default: false
    },
  },
  components: {},
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {
    goBack: function() {
      this.$emit("go-back");
    },
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";

.top-head {
  height: 1rem !important;
  text-align: center;
  color: @font-color;
  font-size: 0.36rem;
  background-color: #fff;
  position: absolute;
  display: flex;
  align-items: center;
  top: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
  z-index: 4;
  border-bottom: 1px solid transparent;
  justify-content: space-between;
  box-sizing: border-box;
  align-items:center;
  &.show-border {
    border-bottom: 1px solid @border-color;
  }
  .go-back {
    height: 1rem;
    font-size: 0.52rem;
    margin-left:-0.52rem;
    color: @font-color;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .head-left {
    width:20%;
    height: 1rem;
    // line-height: 1rem;
    > div {
      width:100%;
      height: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .head-title {
    width:60%;
    height: 1rem;
    line-height: 1rem;
  }
  .head-right {
    width:20%;
    height: 1rem;
    // line-height: 1rem;
    > div {
      width:100%;
      height: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>