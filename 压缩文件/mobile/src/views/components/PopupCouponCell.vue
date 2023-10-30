<template>
  <div class="coupon-cell" :class="disable?'disable':''">
    <div class="coupon-info-select">
      <span class="select-core" :class="is_checked?'checked':''"></span>
    </div>
    <div class="coupon-left" :class="!disable&&color[coupon.usebonus_order]?color[coupon.usebonus_order]:''">
      <p class="coupon-domain"><span class="symbol">¥</span>{{coupon.bonus_amount | fixed}}</p>
      <p class="coupon-min-amount">满{{coupon.request_amount | fixed}}元可用</p>
    </div>
     <div class="coupon-content">
      <h4 class="coupon-title">{{coupon.bonus_name}}</h4>
      <p class="coupon-label">{{coupon.bonus_name}}</p>
      <p class="coupon-time">{{coupon.formatted_start_date | formatDate}}-{{coupon.formatted_end_date | formatDate}}</p>
    </div>
  </div>
</template>

<script>

export default {
  props:["coupon","disable","is_checked"],
  components: {
  },
	data() {
    return {
      color:{
        0:"color-0",//0-通用券
        1:"color-1",//1-存储券
        2:"color-2",//2-提货券
      }
    };
  },
  computed: {
  },
  filters:{
    fixed:function(money){
      return Number(money).toFixed(0);
    },
    formatDate:function(data){
      return data.replace(/\-/g,'.');
    },
  },
  watch: {
  },
  mounted() {
  },
  methods:{
  },
};
</script>

<style lang="less" scoped>
@import "./PopupCouponCell.less";
</style>