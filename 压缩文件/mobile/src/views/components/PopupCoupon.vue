<template>
  <Popup
      v-model="coupons_modal"
      position="right" 
      class="pop-modal">
    <a href="javascript:void(0);" class="iconfont icon-back" @click="close"></a>
    <div class="title">优惠券</div>
    <div class="content transparent">
      <div class="pop-coupon-wrap">
        <ul class="pop-coupon-list-wrap">
            <li class="coupon-list-cell" v-for="(coupon,index) in available_coupons" @click="selectCoupon(coupon,index)">
              <popup-coupon-cell
                :coupon="coupon"
                :disable="false"
                :is_checked="coupon.is_checked"
              ></popup-coupon-cell>
            </li>
          </ul>
      </div>
    </div>
  </Popup>
</template>

<script>
import { Popup } from "mint-ui";
import popupCouponCell from "./PopupCouponCell.vue";

export default {
  props:["coupons_modal","available_coupons"],
  components: {
    Popup:Popup,
    popupCouponCell:popupCouponCell,
  },
	data() {
    return {
    };
  },
  computed: {
  },
  watch: {
    coupons_modal:function(nval,oval){
      if(nval == true){
        this.init();
      }
    },
  },
  mounted() {
    this.init();
  },
  methods:{
    init:function(){

    },
    selectCoupon:function(coupon,index){
      var res_data;
      coupon.is_checked = !coupon.is_checked;

      if(coupon.is_checked){
        res_data = coupon;
      }else{
        res_data = null;
      }
      this.$emit('select-coupon',res_data,index);
    },
    close:function(){
      this.$emit('close-coupons-modal');
    }
  },
};
</script>

<style lang="less" scoped>
.pop-modal {
  .content {
    background:#f9f9f9;
  }
  .pop-coupon-wrap {
    .pop-coupon-list-wrap {//优惠券弹层
      box-sizing: border-box;
      margin:0 0.3rem;
      .coupon-list-cell {
        margin-bottom: 0.1rem;
      }
    }
  }
}
</style>