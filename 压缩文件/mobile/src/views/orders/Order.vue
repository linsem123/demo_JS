<template>
  <div>
    <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
      :show_border="false"
    >
      <div slot="left"></div>
      <div slot="main">记录详情</div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->

    <div class="content">
      <div class="top-blank"></div>

      <ul class="order-head">
        <li class="order-cell">
          <p class="title bold">{{ order.label_order_status }}</p>

          <!-- 待付款 -->
          <p class="tip" v-if="order.order_status_code == 'await_pay'">
            <span v-if="remain_time=='已过期'">已过期</span>
            <span v-else>{{remain_time}}内未付款 订单将自动关闭</span>
          </p>
          <!-- 待付款 -->

          <!-- 待发货 -->
          <p class="tip" v-else-if="order.order_status_code == 'await_ship'">您的商品将在1-2个工作日内安排发货</p>
          <!-- 待发货 -->

          <!-- 待收货 -->
          <p class="tip" v-else-if="order.order_status_code == 'shipped'">您的包裹已发出，请关注订单物流并及时确认收货</p>
          <!-- 待收货 -->

          <p class="line">{{order.formated_add_time}}</p>
        </li>
        <li class="order-cell" v-if="order_type==2">
          <p class="title">{{ order.consignee }} {{ order.mobile }}</p>
          <p class="line">{{order.address}}</p>
        </li>
      </ul>

      <ul class="goods-list">
        <li class="goods-cell clearfix" v-for="goods in order.goods_list" :key="goods.order_id">
          <img :src="goods.img.thumb" alt="" class="goods-cover">
          <div class="goods-info">
            <h1 class="goods-name"> {{goods.name}} </h1>
            <p class="goods-info-bottom">
              <span class="goods-price">{{goods.formated_shop_price}}</span>
              <span class="goods-number"> x{{goods.goods_number}} </span>
            </p>
          </div>
        </li> 
      </ul>

      <div class="common-info">
        <div class="line-info">
          <span class="line-info-title">优惠金额</span>
          <span class="line-info-value">-{{order.bonus}}元</span>
        </div>
        <div class="line-info">
          <span class="line-info-title" v-if="order.order_status_code == 'await_pay' || order.order_status_code == 'canceled'">实际应付</span>
          <span class="line-info-title" v-else>实际支付</span>
          <span class="line-info-value">{{order.total_fee}}元</span>
        </div>

        <template v-if="order.order_status_code != 'await_pay' && order.order_status_code != 'canceled'">
          <div class="line-info">
            <span class="line-info-title">快递品牌</span>
            <span class="line-info-value">顺丰速运</span>
          </div>
          <template v-if="shipping_number">
            <div class="line-info">
              <span class="line-info-title">快递单号</span>
              <span class="line-info-value">{{shipping_number}}<i class="copy" @click="copyCode(shipping_number)">复制</i></span>
            </div>
          </template>
          <div class="line-info">
            <span class="line-info-title">发票抬头</span>
            <span class="line-info-value">默认个人，如需更改，电话联系客服</span>
          </div>
          <div class="line-info">
            <span class="line-info-title">发票内容</span>
            <span class="line-info-value">商品明细</span>
          </div>
        </template>


        <div class="line-info">
          <span class="line-info-title">订单号</span>
          <span class="line-info-value">{{order.order_sn}}</span>
        </div>
      </div>

      <div class="zhanwei"></div>
  	</div>


    <!-- 底部操作 -->
      <template v-if="remain_time!='已过期'">
        <!-- 待付款 -->
        <template v-if="order.order_status_code == 'await_pay'">
          <div class="bottom-wrap">
            <a class="bottom-btn white" @click="cancelOrder(order.order_id);">取消订单</a>
            <a class="bottom-btn yellow" @click="payOrder(order.order_id);">立即付款</a>
          </div>
        </template>
        <!-- 待付款 -->
      </template>

      <!-- 待发货 -->
      <template v-if="order.order_status_code == 'await_ship'">
        <div class="bottom-common-wrap">
          <a class="bottom-btn" :href="'tel:'+guest_phone">电话客服</a>
        </div>
      </template>
      <!-- 待发货 -->

      <!-- 待收货 -->
      <template v-if="order.order_status_code === 'shipped'">
        <div class="bottom-common-wrap">
          <a class="bottom-btn" @click="confirmOrder(order.order_id);">确认收货</a>
        </div>
      </template>
      <!-- 待收货 -->

      <!-- 已完成 -->
      <template v-if="order.order_status_code === 'finished' && !culIsCommented(order.goods_list)">
        <div class="bottom-common-wrap">
          <a class="bottom-btn" @click="redirect(`/my/commentsdetail/${order.order_id}`)">去评价</a>
        </div>
      </template>
      <!-- 已完成 -->
    <!-- 底部操作 -->
  </div>
</template>

<script>
import topHead from "@/views/components/TopHead.vue";
import { Toast, MessageBox } from "mint-ui";

export default {
  components: {
    topHead: topHead
  },
  data() {
    return {
      mall_token:"",
      order: {},
      remain_time: 0,
      shipping_number:"",
    };
  },
  computed: {
    order_id() {
      return this.$route.params.id || "";
    },
    order_type(){
      let res = 1;//1:存储订单，2:提货订单
      if(!/[a-zA-Z]+/.test(this.order.order_sn||"")){
        res = 2;
      }
      return res;
    },
    guest_phone(){
      return this.$store.getters.getGuestPhone;
    },
    location() {
      return this.$store.getters.getLocation;
    },
  },
  filters: {
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
    init(){
      var me = this;
      this.mall_token = utils.storageGet("mall_token");
      
      this.getOrderDetail(this.order_id,function(){
        me.getShippingInfo(me.order_id);
      });
    },
    confirmOrder: function(order_id) {
      var _this = this;
      utils.API.order_affirmReceived({
        //确认订单
        data: {
          token: _this.mall_token,
          order_id: order_id
        }
      })
        .then(function(ret) {
          _this.getOrderDetail(order_id, function(detail) {
            // _this.order = _.assign(_this.order, detail);
            Toast("确认收货！");
          });
        })
        .catch(function(ret) {
          !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        });
    },
    payOrder: function(order_id) {
      this.$router.push({ path: `/order/${order_id}/paymenttype` });
    },
    cancelOrder: function(order_id) {
      var _this = this;
      MessageBox({
        title: "",
        message: "确定取消此订单吗？",
        showCancelButton: true
      }).then(function(action) {
        if (action === "confirm") {
          utils.API.order_cancel({
            //取消订单
            data: {
              token: _this.mall_token,
              order_id: order_id
            }
          })
            .then(function(ret) {
              _this.getOrderDetail(order_id, function(detail) {
                // _this.order = _.assign(_this.order, detail);
                Toast("取消订单成功！");
              });
            })
            .catch(function(ret) {
              !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
            });
        } else {
        }
      });
    },
    getOrderDetail: function(order_id, cb) {
      var _this = this;
      utils.API.order_detail({
        //订单详情
        data: {
          token: _this.mall_token,
          order_id: order_id
        }
      })
        .then(function(ret) {
          _this.order = ret.model.data;
          _this.countTime(ret.model.data.add_time);
          cb && cb(ret.model);
        })
        .catch(function(ret) {
          !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        });
    },

    countTime:function(add_time){
      var _this = this,
          add_time = (add_time+28800)*1000,
          expire_time = add_time + 3600000,
          limit = expire_time - new Date().getTime();
      
      if(limit > 0){
        utils.countDown({//倒计时
          seconds:Math.ceil(limit/1000),//倒计时总时间
          beforeInterval:function(counter){//beforeInterval
            _this.remain_time = utils.getRemain(limit -= 1000);
            // me.root_data.captcha_text = '已发送 '+counter;
          },
          readingSeconds:function(counter){//读秒中callback
            _this.remain_time = utils.getRemain(limit -= 1000);
            // me.root_data.captcha_text = '已发送 '+counter;
          },
          end:function(){//倒计时完成后callback
            _this.remain_time = "已过期";
            
            _this.getOrderDetail(_this.order_id,function(){
              _this.getShippingInfo(_this.order_id);
            });
          }
        });
      }else{
        _this.remain_time = "已过期";
      }
    },

    getShippingInfo:function(order_id){
      var _this = this;
      utils.API.order_express({
        //订单详情
        data: {
          token: _this.mall_token,
          order_id: order_id
        }
      })
      .then(function(ret) {
        _this.shipping_number = ret.model.data[0].shipping_number;
      })
      .catch(function(ret) {
        // !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    copyCode(code){
      var _this = this;
      try{
        cordova && cordova.plugins.clipboard.copy(code, function(){
          Toast("复制成功！");
        }, function(){
          Toast("复制失败");
        });
      }catch(e){
        Toast("复制发生异常");
      }      
    },
    /********************************再次购买********************************/
    // getCart(cb) {
    //   var _this = this;
      
    //   utils.API.cart_list({
    //     data: {
    //       token: _this.mall_token,
    //       seller_id: _this.seller_id,
    //       location: _this.location
    //     }
    //   })
    //   .then(function(ret) {
    //     // _this.cart = ret.model.data.cart_list[0]||{};
    //     cb&&cb(ret.model.data.cart_list[0]||{});
    //   })
    //   .catch(function(ret) {
    //     !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    //   });
    // },

    // goodsInCart:function(goods_id,cart){
    //   if(!cart || !_.isArray(cart.goods_list)){
    //     return {};
    //   }
    //   var goods_in_cart = cart.goods_list.filter(function(goods) {
    //         return goods.goods_id == goods_id;
    //       })[0]||{};

    //   return goods_in_cart;
    // },

    // cartUpdate:function(rec_id,number){//更新商品到购物车
    //   var me = this;

    //   return new Promise(function(resolve, reject) {
    //     utils.API.cart_update({
    //       data: {
    //         token: me.mall_token,
    //         rec_id: rec_id,
    //         new_number: number,
    //         location: me.location
    //       }
    //     })
    //     .then(function(ret) {
    //       resolve(ret);
    //     })
    //     .catch(function(ret) {
    //       reject(ret);
    //       // !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    //     });
    //   })
    // },
    // cartCreate: function(goods){//添加商品到购物车
    //   var _this = this;

    //   return new Promise(function(resolve, reject) {
    //     utils.API.cart_create({
    //       data: {
    //         token: _this.mall_token,
    //         goods_id: goods.goods_id,
    //         number: goods.goods_number,
    //         location: _this.location
    //       }
    //     })
    //     .then(function(ret) {
    //       resolve(ret);
    //     })
    //     .catch(function(ret) {
    //       reject(ret);
    //       // !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    //     });
    //   })
    // },

    // purchaseAgain:function(order){//再次购买
    //   var me = this;

    //   this.getCart(function(cart){
    //     var funs = [];
    //     // console.log(order.goods_list);
    //     order.goods_list.forEach(function(goods){
          
    //       var goodsInCart = me.goodsInCart(goods.goods_id,cart);
    //       if(!_.isEmpty(goodsInCart)){
    //         funs.push(me.cartUpdate(goodsInCart.rec_id,goodsInCart.goods_number+goods.goods_number));
    //       }else{
    //         funs.push(me.cartCreate(goods));
    //       }
    //     })

    //     Promise.all(funs)
    //     .then(function (res) {
    //       Toast("添加成功，请前往购物车查看！");
    //       me.$router.push({ path: `/order/cart` });
    //     })
    //     .catch(function(ret) {
    //       !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    //     });
    //   })
    // },
  /********************************再次购买********************************/
    culIsCommented:function(order_list){
      let is_commented = false,
          num = 0;

      order_list.forEach(function(item){
        if(item.is_commented == 1){
          num += 1;
        }
      })

      if(num == order_list.length){
        is_commented = true;
      }
      return is_commented;
    },
    goBack: function() {
      this.$router.goBack();
    },
    redirect: function(path) {
      path ? this.$router.push({ path: path }) : this.$router.goBack();
    },
  }
};
</script>

<style lang="less" scoped>
@import "./OrdersDetail.less";
.content {
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
}
</style>