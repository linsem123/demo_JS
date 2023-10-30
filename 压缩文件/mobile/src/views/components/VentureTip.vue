<template>
<!-- 交易规则 -->
  <div class="venture-wrap">
    <p class="venture-text">市场有风险  投资需谨慎</p>
    <p class="venture-text">若有疑问，点击下方号码联系客服</p>
    <a class="venture-text yellow" :href="'tel:'+guest_phone">{{guest_phone}}</a>
    <p class="venture-text">(工作日09:00-12:00 13:00-17:00)</p>
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
    guest_phone(){
      return this.$store.getters.getGuestPhone;
    },
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
.venture-wrap {
  padding:0.2rem 0;
  text-align:center;
  .venture-text {
    font-size:0.24rem;
    padding:0.1rem 0;
    color:@font-gray-color;
    &.yellow {
      color:@font-color-yellow;
      font-size:0.4rem;
      font-weight:bold;
    }
  }
}
</style>