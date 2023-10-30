<template>
<!-- 交易规则 -->
  <div class="panel-wrap">
    <h4 class="panel-title">
      <span class="title-cell">产品优势</span>
    </h4>
    <div class="introduce-wrap">
      <ul class="introduce">
        <li class="introduce-cell">
          <div>1、</div>
          <div>投资风险较低，利于增值保值</div>
        </li>
        <li class="introduce-cell">
          <div>2、</div>
          <div>买入、卖出均无手续费</div>
        </li>
        <li class="introduce-cell">
          <div>3、</div>
          <div>活动期间，固定收益部分下单后即发放至黄金象账户中</div>
        </li>
      </ul>
    </div>
  </div>
</div>
<!-- 交易规则 -->

</template>

<script>

export default {
  props:["refresh",],
  components: {},
  data() {
    return {
    };
  },
  computed: {
    
  },
  mounted() {
    // this.init();
  },
  watch:{
  },
  methods: {
    init(){
    },
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";
.introduce-wrap {
  .introduce {
    .introduce-cell {
      display: flex;
      align-items: baseline;
      padding:0.34rem 0;
      font-size:0.26rem;
      line-height: 0.26rem;
      border-bottom:1px solid @border-color;
      &:last-child {
        border-bottom:none;
        padding-bottom:0.2rem;
      }
      .introduce-text {
        margin-bottom:0.2rem;
        &:last-child {
          margin-bottom:0;
        }
      }
    }
  }
}
</style>