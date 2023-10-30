<template>
  <div>
    <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">填写提货订单</div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->


    <div class="gen-order-withdraw">
      <div class="top-blank"></div>

      <template v-if="cart&&cart.goods_list">

        <!-- 地址信息 -->
        <div class="adress-info-wrap" @click="address_list_modal=true">
          <div class="adress-info-inner">
            <div class="adress-info-head">
              <span class="name">{{active_address.consignee}}</span>
              <span v-if="!active_address.mobile" class="phone danger">请先添加地址</span>
              <span v-else class="phone">{{active_address.mobile}}</span>
            </div>
            <div class="adress">{{active_address.address}}</div>
            <span class="iconfont icon-more"></span>
          </div>
        </div>
        <!-- 地址信息 -->

        <!-- 购买信息 -->
        <div class="buy-info-wrap">
          <!-- 购物车选中列表 -->
          <ul v-if="selected_goods_list" class="cart-goods-selected-list">
            <li class="cart-goods-selected-cell" v-for="goods in selected_goods_list">
              <div class="goods-info-img-wrap">
                <img class="goods-info-img" :src="goods.img.small">
              </div>
              <div class="goods-info">
                <h4 class="goods-info-title">{{goods.goods_name}}</h4>
                <div class="goods-info-price-wrap">
                  <span class="goods-info-price">{{goods.formated_goods_price}}</span>
                  <span class="goods-info-number">×{{goods.goods_number}}</span>
                </div>
              </div>
            </li>
          </ul>
          <!-- 购物车选中列表 -->

          <!-- 配送方式 -->
          <div class="config-wrap">
            <div class="config-title">配送方式</div>
            <div class="config-info">
              <p class="config-text">顺丰快递</p>
              <p class="config-text">1-2个工作日发货</p>
            </div>
          </div>
          <!-- 配送方式 -->

          <!-- 配送方式 -->
          <div class="config-wrap">
            <div class="config-title">退货须知</div>
            <div class="config-info">
              <p class="config-text">此商品性质不支持退货</p>
            </div>
          </div>
          <!-- 配送方式 -->
        </div>
        <!-- 购买信息 -->
        
        <!-- 汇总信息 -->
        <div class="sum-info-wrap">
          <div class="config-wrap">
            <div class="config-title">商品总额</div>
            <div class="config-info">
              <p class="config-text red">{{cart.total.goods_price}}</p>
            </div>
          </div>
          <div class="config-wrap">
            <div class="config-title">运费</div>
            <div class="config-info">
              <p class="config-text red">{{shipping_info.format_shipping_fee||"￥0.00"}}</p>
            </div>
          </div>
        </div>
        <!-- 汇总信息 -->

        <div class="sum-info-wrap">
          <div class="config-wrap" @click="coupons_modal=!coupons_modal">
            <div class="config-title">优惠券</div>
            <div class="config-info">
              <template v-if="bonus.length<=0">
                <p class="config-text gray">无可用优惠券</p>
                <span class="iconfont icon-more gray"></span>
              </template>
              <template v-else>
                <p v-if="active_coupon" class="config-text red">-{{active_coupon&&active_coupon.bonus_amount||0}}</p>
                <p v-else class="config-text red">不使用优惠券</p>
                <span class="iconfont icon-more red"></span>
              </template> 
            </div>
          </div>
        </div>

        <div class="zhanwei"></div>

      </template>
      
      <template v-else>
        <div class="wrapper">
          没有更多啦~
        </div>
      </template>
  	</div>

    <!-- 我的地址弹层 -->
    <popup-address
      :address_list_modal="address_list_modal"
      :address_list="address_list"
      :active_address="active_address"
      @select-address="popupSelectAddress"
      @close-address-modal="popupCloseAddressModal"
    ></popup-address>
    <!-- 我的地址弹层 -->

    <!-- 优惠券弹层 -->
    <popup-coupon
      :coupons_modal="coupons_modal"
      :available_coupons="bonus"
      @select-coupon="selectCoupon"
      @close-coupons-modal="closeCouponsModal"
    ></popup-coupon>

    <div class="pay-wrap">
      <span class="total-price">￥{{total_price}}</span>
      <a class="pay-btn" :class="!can_pay?'disable':''" @click="gotoPay">去支付</a>
    </div>

  </div>
</template>

<script>
import topHead from "@/views/components/TopHead.vue";
import popupAddress from "@/views/components/PopupAddressList.vue";
import popupCoupon from "@/views/components/PopupCoupon.vue";
// import constants from "@/assets/js/constants.js";

import { Toast } from "mint-ui";

// utils.extendApi(API);//把API扩充到utils方法里边

export default {
  components: {
    topHead: topHead,
    popupAddress:popupAddress,
    popupCoupon:popupCoupon,
  },
  data() {
    return {
      mall_token:"",
      cart:{},
      goods_list:[],
      address_list:[],
      selected_address:{},
      check_order:{},
      shipping_info:{},
      address_list_modal:false,

      bonus:[],
      coupons_modal:false,
      select_coupon:{},

      is_loading_btn:false,
    };
  },
  computed: {
    seller_id() {
      return this.$store.getters.getSellerId;
    },
    location() {
      return this.$store.getters.getLocation;
    },
    // mall_token(){
    //   return utils.storageGet("mall_token")
    // },
    default_address(){
      var default_address = _.find(this.address_list, function(o) { return o.default_address == 1;})||{};
      
      if(_.isEmpty(default_address)){
        default_address = this.address_list[0]||{};
      }

      return default_address;
    },
    active_address(){
      var active_address = {};

      if(_.isEmpty(this.selected_address)){
        active_address = this.default_address;
      }else{
        active_address = this.selected_address;
      }

      return active_address;
    },
    selected_goods_list(){
      var selected_goods_list = [];
      this.goods_list.forEach(function(item){
        if(item.is_checked == 1){
          selected_goods_list.push(item);
        }
      })

      return selected_goods_list;
    },
    total_price(){
      var goods_amount = this.cart&&this.cart.total&&this.cart.total.goods_amount||0,
          shipping_fee = this.shipping_info&&Number(this.shipping_info.shipping_fee)||0,
          res = (goods_amount + shipping_fee - (this.active_coupon&&this.active_coupon.bonus_amount||0)).toFixed(2);


      return res<=0?"0.00":res;
    },
    max_coupon(){
      var find_index,
          res = {
            bonus_amount:0,
          };

      if(this.bonus.length <= 0){
        return null;
      }

      this.bonus.forEach(function(item,index){
        item.is_checked = false;
        if(Number(item.bonus_amount) > res.bonus_amount){
          res = _.assign(res,item);
          find_index = index;
        }
      });

      this.bonus[find_index].is_checked = true;
      res.is_checked = true;

      return res;
    },
    active_coupon(){
      var res = {};
      if(_.isPlainObject(this.select_coupon) && _.isEmpty(this.select_coupon)){
        res = _.assign({},this.max_coupon);
      }else if(this.select_coupon){
        res = _.assign({},this.select_coupon);
      }else{
        res = this.select_coupon;
      }

      return res;
    },
    can_pay(){
      var can_pay = true;
      can_pay = _.isEmpty(this.active_address)?false:true;
      return can_pay;
    },
  },
  mounted() {
    // this.init();
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.init();
      // access to component instance via `vm`
    })
  },
  methods: {
    init: function() {
      var me = this;
      this.mall_token = utils.storageGet("mall_token");

      this.getMyAddress(function(){
        me.getCart(function(){
          if(!_.isEmpty(me.active_address) && me.selected_goods_list.length){//
            var address_id = me.active_address.id,
                rec_id = me.getSelectGoodsRecId();

            me.flowCheckOrder(address_id,rec_id);
          }
          // console.log("me.active_address:",me.active_address);
          // console.log("me.selected_goods_list:",me.selected_goods_list);
        });
      });
      
      // this.selected_address = this.default_address;
    },
    
    getMyAddress:function(cb){
      var me = this;
      utils.API.address_list({
        data:{
          token: me.mall_token,
        }
      })
      .then(function (ret) {
        me.address_list = ret.model.data;
        cb&&cb();
      })
      .catch(function(ret){
        !ret.__servererror__ && Toast(ret.errorMessage||"未知错误！");
      });
    },
    getCart: function(cb) {
      var _this = this;

      utils.API.cart_list({
        data: {
          token: _this.mall_token,
          seller_id: _this.seller_id,
          location: _this.location
        }
      })
      .then(function(ret) {
        _this.restCart(ret);
        cb&&cb();
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    restCart:function(ret){//重置购物车
      var me = this;
      this.cart = ret.model.data.cart_list&&ret.model.data.cart_list[0]||{};
      this.goods_list = this.cart&&this.cart.goods_list||[];
    },

    flowCheckOrder:function(address_id,rec_id){
      var _this = this;

      utils.API.flow_checkOrder({
        data: {
          token: _this.mall_token,
          location: _this.location,
          "address_id" : address_id,
          "rec_id" : rec_id,
          "order_type":2,//1：存储；2：提货
        }
      })
      .then(function(ret) {
        _this.check_order = _.assign(_this.check_order,ret.model.data);

        if(_this.check_order.shipping_list && _this.check_order.shipping_list.length){
          _this.shipping_info = _.assign({},_this.check_order.shipping_list[0]);
        }

        if(_this.check_order.bonus && _this.check_order.bonus.length){
          _this.bonus = _this.check_order.bonus;
        }

      })
      .catch(function(ret) {
        if(ret.errorCode == 80009){
          Toast("商品价格有所变动，已为您重新计算！");
          _this.getCart(function(){
            _this.flowCheckOrder(_this.active_address.id,_this.getSelectGoodsRecId());
          });
        }else{
          !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        }
      });
    },
    
    getSelectGoodsRecId:function(){
      var rec_id = [];

      this.selected_goods_list.forEach(function(item){
        rec_id.push(item.rec_id);
      });

      return rec_id.join(',');
    },


    // 弹层的操作
    popupSelectAddress:function(address){
      this.selected_address = address;
      this.flowCheckOrder(this.selected_address.id,this.getSelectGoodsRecId());
      // this.address_list_modal = false;
    },
    popupCloseAddressModal:function(){
      this.address_list_modal = false;
    },

    selectCoupon:function(coupon,number){
      this.bonus.forEach(function(item,index){
        if(coupon){
          if(index == number){
            item.is_checked = true;
          }else{
            item.is_checked = false;
          }
        }else{
          item.is_checked = false;
        }
      })

      this.select_coupon = coupon?_.assign({},coupon):coupon;

      this.coupons_modal = !this.coupons_modal;
    },
    closeCouponsModal:function(){
      this.coupons_modal = !this.coupons_modal;
    },
    // 弹层的操作

    gotoPay:function(){
      if(!this.can_pay){
        return;
      }

      if(this.is_loading_btn){
        return;
      }

      var data = {
        shipping_id:this.shipping_info.shipping_id,
        rec_id:this.getSelectGoodsRecId(),
        address_id:this.active_address.id,
        order_type:"",
      }

      this.is_loading_btn = true;
      this.genOrder(data);
    },
    genOrder:function(data){
      var _this = this,
          data = _.assign(data,{
            token: _this.mall_token,
            pay_id: -1,
            need_inv: 0,
            location: _this.location,
            integral: 0,
          });

      if(_this.bonus.length > 0 && _this.active_coupon){
        data.bonus = _this.active_coupon.bonus_id;
      }
      
      utils.API.flow_done({
        //然后生成订单
        data:data,
        show_loading:true,
      })
      .then(function(ret) {
        _this.order_id = ret.model.data.order_id;
        _this.$router.push({ path: `/order/${_this.order_id}/paymenttype`});
        setTimeout(function(){
          _this.is_loading_btn = false;
        },200);
      })
      .catch(function(ret) {
        if(ret.errorCode == 80009){
          Toast("商品价格有所变动，已为您重新计算！");
          _this.getCart(function(){
            _this.flowCheckOrder(_this.active_address.id,_this.getSelectGoodsRecId());
          });
        }else{
          !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        }
        _this.is_loading_btn = false;
      });
    },
    goBack: function() {
      this.$router.goBack();
    }
  }
};
</script>

<style lang="less" scoped>
@import "./GenOrderWithdraw.less";
</style>