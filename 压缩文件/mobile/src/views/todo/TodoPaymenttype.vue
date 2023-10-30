<template>
  <div>
    <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">选择付款方式</div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->

    <div class="mall-payment-type">
      <div class="top-blank"></div>

      <div class="tip-wrap">
        <p class="tip-text">请您尽快完成支付</p>
        <p class="total-price">￥{{order.expressFee}}</p>
      </div>
      <!-- 支付方式 -->
      <div class="pay-list-wrap">
        <ul class="pay-list">
          <li class="pay-list-cell" v-for="(payment, index) in payment_list">
            <div class="pay-name">
              <span class="pay-icon iconfont" :style="'color:'+pay_info[payment.pay_name].color" :class="'icon-'+pay_info[payment.pay_name].icon"></span>
              <div class="pay-text-wrap">
                <div class="pay-name-text">{{payment.pay_name}}</div>
                <div class="pay-text">{{pay_info[payment.pay_name].text}}</div>
              </div>
              
            </div>
            <span class="select-core" :class="payment.pay_name == select_pay_name?'checked':''" @click="selectPayType(payment)"></span>
            <!-- <span class="iconfont active" :class="payment.name == '支付宝' ? 'icon-confirmfill':'icon-confirm'"></span> -->
          </li>
        </ul>
      </div>
      <!-- 支付方式 -->
      

      <div class="btn-wrap">
        <a class="bottom-btn" href="javascript:;" @click="confirmPay">确认支付</a>
      </div>
      
  	</div>
    
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
      shipping_fee:0,
      order:{},

      payment_list: [{
        pay_name:"支付宝",
        channel:"alipay",
      }],

      select_pay_name:"支付宝",
      pay_info:{
        "支付宝":{
          icon:"zhifubao",
          text:"支持宝安全支付",
          color:"#1296db",
        },
      },

    };
  },
  computed: {
    order_id() {
      return this.$route.params.order_id!='null'?this.$route.params.order_id:"";
    },
    // address_info(){
    //   var address_info = this.$route.params.address_info!='null'?this.$route.params.address_info:"{}";
    //   return JSON.parse(address_info);
    // },
    // mall_token() {
    //   return utils.storageGet("mall_token")
    // },
    select_payment(){
      var me = this,
          select_payment = {};
      this.payment_list.forEach(function(item){
        if(item.pay_name == me.select_pay_name){
          select_payment = _.assign({},item);
        }
      });
      
      return select_payment;
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
      this.getOrderDetail(this.order_id);
    },
    
    getOrderDetail: function(order_id, cb) {
      var _this = this;
      utils.API.delivery_detail({
        //订单详情
        data: {
          token: _this.mall_token,
          "reqBody":{
            id:order_id,
          },
        }
      })
      .then(function(ret) {
        _this.order = ret.model;
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    

    selectPayType:function(payment){
      // this.select_payment = _.assign({},payment);
      this.select_pay_name = payment.pay_name;
    },

    // getSendOrderData:function(){
    //   var productName = "",
    //       goods = [];

    //   this.order.details.forEach(function(item){
    //     var obj = {
    //         goodsId:item.goodsId,//{string} 商品ID
    //         quantity:item.number,//{number} 数量
    //       };
    //     goods.push(obj);
    //   })

    //   return {
    //     name:this.active_address.consignee,
    //     address:this.active_address.address,//{string} 收货地址，格式
    //     province:this.active_address.province_name,//省份
    //     city:this.active_address.city_name,//市
    //     mobile:this.active_address.mobile,//{string} 手机号
    //     items:goods,
    //   };
    // },

    confirmPay: function() {
      var me = this;
          // data = this.getSendOrderData();

      utils.API.fund_pay({
        data: {
          "token": me.mall_token,
          "reqBody":{
            id:me.order_id,
            channel:me.select_payment.channel,
          },
        }
      })
      .then(function(ret) {
        // var res = /action=\"(.+?)\"/.exec(ret.model.url),
        //     url = res&&res[1]||"";

        // try {
        //   var target = "_blank",
        //       options = "location=no,hidden=no,hardwareback=no";

        //   window.cordova.InAppBrowser.open(url, target, options);
        // } catch (e) {
        //   window.open(url, "_blank");
        // }
        
        // me.$router.replace({ path: `/my/todo/storeagepayresult/${order_id}` });
        
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    goBack: function() {
      var _this = this;
      MessageBox({
        title: "",
        message: "您的订单未及时支付将自动取消",
        showCancelButton: true,
        confirmButtonText:"确认离开",
        cancelButtonText:"继续支付",
      }).then(function(action) {
        if (action === "confirm") {
          // _this.$router.goBack();
          _this.$router.replace({ path: `/my/orders`});
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "./TodoPaymenttype.less";
</style>