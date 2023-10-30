<template>
<!-- 交易规则 -->
  <div class="panel-wrap">
    <h4 class="panel-title">
      <span class="title-cell">交易规则</span>
    </h4>
    <div class="regular-wrap">
      <div class="progress-wrap">
        <ul class="progress">
          <li class="progress-cell"><span class="progress-dot"></span></li>
          <li class="progress-cell"><span class="progress-dot"></span></li>
          <li class="progress-cell"><span class="progress-dot"></span></li>
        </ul>
        <ul class="progress-text">
          <li class="progress-text-cell">下单</li>
          <li class="progress-text-cell">确认中</li>
          <li class="progress-text-cell">订单确认</li>
          <li class="progress-text-cell">存储中</li>
          <li class="progress-text-cell">到期</li>
        </ul>
      </div>
      <p class="tip-text top red"><span class="iconfont icon-zanbuzhichi"></span><span>下单后、到期前不可取出。</span></p>
      <p class="tip-text"><span class="iconfont icon-zanbuzhichi"></span><span>交易日15:00前下单，系统会在当日操作确认订单，并在第2个交易日开始存储生息；交易日15:00后下单，则系统自动顺延至下一个交易日操作确认订单，并从第2个交易日开始存储生息(周末和国家法定节假日为非交易日)。</span></p>
      <ul class="text-table-wrap">
        <li class="text-cell">
          <span class="text-td">收益构成</span>
          <span class="text-td">固定收益+金价波动收益</span>
        </li>
        <li class="text-cell">
          <span class="text-td">金价波动收益</span>
          <span class="text-td">卖出时根据黄金象当日金价计算</span>
        </li>
        <li class="text-cell">
          <span class="text-td">产品类型</span>
          <span class="text-td">定期产品</span>
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
.regular-wrap {
  .progress-wrap {
    .progress {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .progress-cell {
        position: relative;
        &:first-child {
          margin-left:-5px;
          &:before {
            display: none;
          }
        }
        &:last-child {
          margin-right:-5px;
          &:after {
            display: none;
          }
        }
        &:before {
          content:"";
          display: block;
          width: 1.7rem;
          height:0.06rem;
          background: #fec20c;
          position: absolute;
          margin-top:-0.03rem;
          top:50%;
          left: -1.6rem;
          z-index: 1;
        }
        &:after {
          content:"";
          display: block;
          width: 1.7rem;
          height:0.06rem;
          background: #fec20c;
          position: absolute;
          margin-top:-0.03rem;
          top:50%;
          right: -1.6rem;
          z-index: 1;
        }
        .progress-dot {
          display: block;
          width: 0.24rem;
          height: 0.24rem;
          background: #fec20c;
          border:5px solid #ffffff;
          border-radius: 100%;
          position: relative;
          z-index: 2;
        }
      }
    }
  }
  .progress-text {
    margin-top:0.2rem;
    display: flex;
    justify-content: space-between;
    .progress-text-cell {
      font-size:0.26rem;
      line-height: 0.26rem;
      color:@font-gray-color;
    }
  }
  .tip-text {
    font-size:0.26rem;
    display: flex;
    align-items: baseline;
    line-height: 0.46rem;
    &.top {
      font-size:0.24rem;
      margin-top:0.3rem;
    }
    &.red {
      color:@red;
    }
    .iconfont {
      font-size: 0.3rem;
      margin-right:0.1rem;
    }
  }
  .text-table-wrap {
    margin-top:0.2rem;
    .text-cell {
      display: flex;
      align-items: center;
      line-height: 0.58rem;
      .text-td {
        display: inline-block;
        font-size:0.28rem;
        &:first-child {
          width: 2.6rem;
          color:@font-gray-color;
        }
      }
    }
  }
}
</style>