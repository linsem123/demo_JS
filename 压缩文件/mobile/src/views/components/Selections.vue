<template>
<!-- 交易规则 -->
  <div class="panel-wrap">
    <h4 class="panel-title">
      <span class="title-cell">到期后三种选择</span>
    </h4>
    <ul class="selections-wrap">
      <li class="selections-cell">
        <p class="left-icon-wrap">
          <span class="left-icon iconfont icon-xiaoshu"></span>
        </p>
        <div class="cell-text-wrap">
          <p class="cell-text-title">随时卖出</p>
          <p class="cell-text-subtitle">无手续费，快速到账</p>
        </div>
      </li>
      <li class="selections-cell">
        <p class="left-icon-wrap">
          <span class="left-icon iconfont icon-kabao"></span>
        </p>
        <div class="cell-text-wrap">
          <p class="cell-text-title">直接提取实物金条</p>
          <p class="cell-text-subtitle">10g起提，顺丰包邮，证书发票齐全</p>
        </div>
      </li>
      <li class="selections-cell">
        <p class="left-icon-wrap">
          <span class="left-icon iconfont icon-cunhuo"></span>
        </p>
        <div class="cell-text-wrap">
          <p class="cell-text-title">续存</p>
          <p class="cell-text-subtitle">继续存入生息</p>
        </div>
      </li>
    </ul>
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
.selections-wrap {
  .selections-cell {
    padding:0.2rem 0;
    display: flex;
    align-items: center;
    .left-icon-wrap {
      width: 0.8rem;
      height:0.8rem;
      border-radius: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background:#fef7d9;
      fill: currentColor;
      overflow: hidden;
      .left-icon {
        font-size:0.44rem;
        background: -webkit-linear-gradient(90deg, #f5d000 , #fea700); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(90deg, #f5d000, #fea700); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(90deg, #f5d000, #fea700); /* Firefox 3.6 - 15 */
        background: linear-gradient(90deg, #f5d000 , #fea700); /* 标准的语法 */
        -webkit-background-clip: text;
        color: transparent;
      }
    }
    .cell-text-wrap {
      margin-left:0.26rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .cell-text-title {
        font-size:0.28rem;
      }
      .cell-text-subtitle {
        font-size:0.26rem;
        color:@base-gray-color;
      }
    }
  }
}
</style>