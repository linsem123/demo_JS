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

      <template v-if="selected_goods_list.length">

        <!-- 地址信息 -->
        <div class="adress-info-wrap" @click="address_list_modal=true">
          <div class="adress-info-inner">
            <span class="iconfont icon-dizhi"></span>
            <div class="adress-info">
              <div class="adress-info-head">
                <span class="name">{{active_address.consignee}}</span>
                <span v-if="!active_address.mobile" class="phone danger">请先添加地址</span>
                <span class="phone">{{active_address.mobile}}</span>
              </div>
              <div class="adress">{{active_address.address}}</div>
            </div>
            <span class="iconfont icon-more"></span>
          </div>
        </div>
        <!-- 地址信息 -->

        <!-- 购买信息 -->
        <div class="buy-info-wrap">
          <!-- 购物车选中列表 -->
          <ul v-if="selected_goods_list" class="cart-goods-list">
            <li class="cart-goods-cell" v-for="goods in selected_goods_list">
              <div class="goods-info-img-wrap">
                <img class="goods-info-img" :src="goods.url">
              </div>
              <div class="goods-info">
                <h4 class="goods-info-title">{{goods.goodsName}}</h4>
                <div class="goods-info-price-wrap">
                  <!-- <span class="goods-info-price">{{goods.formated_goods_price}}</span> -->
                  <span class="goods-info-number">×{{goods.number}}</span>
                </div>
              </div>
            </li>
          </ul>
          <!-- 购物车选中列表 -->
          
        </div>
        <!-- 购买信息 -->

        <!-- 配送方式 -->
        <div class="config-wrap">
          <div class="config-wrap-inner">
            <div class="config-title">配送方式</div>
            <div class="config-info">
              <p class="config-text">顺丰快递1-2个工作日发货</p>
            </div>
          </div>
          <div class="config-wrap-inner">
            <div class="config-title">退货须知</div>
            <div class="config-info">
              <p class="config-text">此商品性质不支持退货</p>
            </div>
          </div>
          <div class="config-wrap-inner">
            <div class="config-title">共计克重</div>
            <div class="config-info">
              <p class="config-text">{{total_weight}}克</p>
            </div>
          </div>
          <div class="config-wrap-inner">
            <div class="config-title">运费</div>
            <div class="config-info">
              <p class="config-text">￥{{shipping_fee}}</p>
            </div>
          </div>
        </div>
        <!-- 配送方式 -->

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

    <div class="pay-wrap">
      <a class="pay-btn" :class="!can_pay?'disable':''" @click="deliveryCreate">提货</a>
    </div>

  </div>
</template>

<script>
import topHead from "@/views/components/TopHead.vue";
import popupAddress from "@/views/components/PopupAddressList.vue";
// import constants from "@/assets/js/constants.js";

import { Toast } from "mint-ui";

export default {
  components: {
    topHead: topHead,
    popupAddress:popupAddress,
  },
  data() {
    return {
      mall_token:"",
      todo_list:[],
      selected_goods_list:[],
      shipping_fee:0,

      address_list:[],
      selected_address:{},
      address_list_modal:false,
    };
  },
  computed: {
    selected_goods_info(){
      var res = [],
          selected_goods_info = this.$route.params.selected_goods_info!='null'?this.$route.params.selected_goods_info:"";
      
      selected_goods_info = selected_goods_info.split(",");

      selected_goods_info.forEach(function(item){
        var obj = {},
            arr = item.split("-");

        obj.goodsId = arr[0];
        obj.number = Number(arr[1]);
        res.push(obj);
      })
      return res;
    },
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
      var default_address = _.find(this.address_list, function(o) { return o.default_address == 1;});
      
      if(_.isEmpty(default_address)){
        default_address = this.address_list[0]||{};
      }

      return default_address;
    },
    active_address(){
      var active_address;

      if(_.isEmpty(this.selected_address)){
        active_address = this.default_address;
      }else{
        active_address = this.selected_address;
      }

      return active_address;
    },
    total_weight(){
      var total_weight = 0;

      this.selected_goods_list.forEach(function(item){
        total_weight += Number(item.spec) * Number(item.number);
      })
      return total_weight.toFixed(0);
    },
    can_pay(){
      return this.selected_goods_list.length>0?true:false;
    },
  },
  mounted() {
    // this.init();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.init();
    })
  },
  methods: {
    init: function() {
      var me = this;
      this.mall_token = utils.storageGet("mall_token");
      this.getMyAddress(function(){
        me.getTodoList();
      });
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

    getTodoList:function(){
      var me = this;

      utils.API.todo_list({
        data: {
          "token": me.mall_token,
          "reqBody":{}
        }
      })
      .then(function(ret) {

        me.todo_list = ret.model.items;
        me.getSelectedGoods()
        .then(function(){
          me.getShippingFee();
        });
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    getSelectedGoods:function(){
      var me = this;

      // me.selected_goods_list = _.assign({});

      return new Promise(function(resolve, reject) {
        me.todo_list.forEach(function(item){
          var index = _.findIndex(me.selected_goods_info, function(o) {return o.goodsId == item.goodsId;});
          if(index != -1){
            item.number = me.selected_goods_info[index].number;
            me.selected_goods_list.push(item);
          }
        })

        resolve();
      })
    },
    getShippingFee:function(){
      var me = this,
          data = {
            weigh:this.total_weight,//重量
            province:this.active_address.province_name,//省份
            city:this.active_address.city_name,//市
          };

      utils.API.expressfee_calculate({
        data: {
          "token": me.mall_token,
          "reqBody":data,
        }
      })
      .then(function(ret) {
        me.shipping_fee = ret.model.value;
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },


    // 弹层的操作
    popupSelectAddress:function(address){
      this.selected_address = address;
      // this.flowCheckOrder(this.selected_address.id,this.getSelectGoodsRecId());
      // this.address_list_modal = false;
    },
    popupCloseAddressModal:function(){
      this.address_list_modal = false;
    },
    // 弹层的操作
    
    getSendOrderData:function(){
      var productName = "",
          goods = [];

      this.selected_goods_list.forEach(function(item){
        var obj = {
            goodsId:item.goodsId,//{string} 商品ID
            quantity:item.number,//{number} 数量
          };
        goods.push(obj);
      })

      return {
        name:this.active_address.consignee,
        address:this.active_address.address,//{string} 收货地址，格式
        province:this.active_address.province_name,//省份
        city:this.active_address.city_name,//市
        mobile:this.active_address.mobile,//{string} 手机号
        items:goods,
      };
    },

    deliveryCreate: function() {
      var me = this,
          data = this.getSendOrderData();

      utils.API.delivery_create({
        data: {
          "token": me.mall_token,
          "reqBody":data,
        }
      })
      .then(function(ret) {
        if(me.shipping_fee <= 0){
          me.payOrder(ret.model.id);
        }else{
          me.gotoPay(ret.model.id);//order_id
        }
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    payOrder: function(order_id) {
      var me = this;

      utils.API.fund_pay({
        data: {
          "token": me.mall_token,
          "reqBody":{
            id:order_id,
            channel:"alipay",
          },
        }
      })
      .then(function(ret) {
        Toast("提货申请成功，请耐心等待发货！");
        setTimeout(function(){
          me.$router.replace({ path: `/my/todo/payresult`});
        },3000)
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    gotoPay:function(order_id){
      var me = this;

      if(!this.can_pay){
        return;
      }

      me.$router.push({ path: `/my/todo/paymenttype/${order_id}`});
    },
    goBack: function() {
      this.$router.goBack();
    }
  }
};
</script>

<style lang="less" scoped>
@import "./TodoWithdraw.less";
</style>