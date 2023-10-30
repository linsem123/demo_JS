<template>
  <div class="coupon-cell" :class="disable?'disable':''">
    <span class="iconfont coupon-type-icon icon-yishiyong" v-if="status_type=='used'"></span>
    <span class="iconfont coupon-type-icon icon-yiguoqi" v-if="status_type=='expired'"></span>
    <div class="coupon-left" :class="!disable&&color[coupon.usebonus_order]?color[coupon.usebonus_order]:''">
      <p class="coupon-domain"><span class="symbol">¥</span>{{coupon.type_money | fixed}}</p>
      <p class="coupon-min-amount">满{{coupon.min_goods_amount | fixed}}元可用</p>
    </div>
    <div class="coupon-content">
      <h4 class="coupon-title">{{coupon.type_name}}</h4>
      <p class="coupon-label">{{coupon.bonus_label}}</p>
      <p class="coupon-time">{{coupon.format_use_start | formatDate}}-{{coupon.format_use_end | formatDate}}</p>
    </div>
    <div class="coupon-use">
      <div class="coupon-operate" v-if="status_type=='available'">
        <a class="use-me" href="javascript:void(0);" @click="redirect(coupon.bonus_url)">立即使用</a>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props:["coupon","disable","status_type"],
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
    // toCouponDetail:function(dealerCouponId){
    //   this.$router.push({path: `/my_coupon_detail/${dealerCouponId}`});
    // },
    toProduct:function(){
      if(this.disable){
        return;
      }
      this.$router.push({path: "/goods"});
    },
    redirect: function(path,event_name) {
      this.$router.push({path: path});
    }.after(function(path,event_name){
      if(event_name){
        utils.trackEvent(event_name);
      }
    }),
  },
};
</script>

<style lang="less" scoped>
@import "./CouponCell.less";
</style>