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
        <p class="total-price">{{order_detail.formated_total_fee}}</p>
      </div>

      <div class="page-break"></div>

      <!-- 支付方式 -->
      <div class="pay-list-wrap">
        <ul class="pay-list">
          <li class="pay-list-cell" v-if="pay_info[payment.pay_name]" v-for="(payment, index) in payment_list" @click="selectPayType(payment)">
            <div class="pay-name">
              <span class="pay-icon iconfont" :style="'color:'+pay_info[payment.pay_name].color" :class="'icon-'+pay_info[payment.pay_name].icon"></span>
              <div class="pay-text-wrap">
                <!-- <div class="pay-name-text">{{formatPayNameText(payment).name}}</div> -->
                <div class="pay-text">{{formatPayText(payment)}}</div>
              </div>
              
            </div>
            <span class="select-core" :class="payment.pay_name == select_pay_name?'active':''"></span>
            <!-- <span class="iconfont active" :class="payment.name == '支付宝' ? 'icon-confirmfill':'icon-confirm'"></span> -->
          </li>
        </ul>

         <div class="btn-wrap">
          <a class="bottom-btn" href="javascript:;" @click="gotoPay">下一步</a>
        </div>
      </div>
      <!-- 支付方式 -->
      

     
      
  	</div>
    


    <trigger-Pay
      :trigger_pay="trigger_pay"
      :pay_name="select_payment.pay_name"
      :payment="flow_done_payment"
      @trigger-callback="triggerPayCallback"
      @trigger-error="triggerError"
      @trigger-fail="triggerFail">
    </trigger-Pay>

  </div>
</template>

<script>
import topHead from "@/views/components/TopHead.vue";
import triggerPay from "@/views/components/TriggerPay.vue";

import { Toast, MessageBox, Indicator, } from "mint-ui";

export default {
  components: {
    topHead: topHead,
    triggerPay:triggerPay,
  },
  data() {
    return {
      mall_token:"",
      payment_list: [],
      select_payment: {},
      user_info:{
        user_money:0,
      },
      order_detail:{},

      select_pay_name:"支付宝APP",
      pay_info:{
        "支付宝APP":{
          name:"支付宝",
          icon:"zhifubao",
          text:"支付宝支付",
          color:"#1296db",
        },
        "余额支付":{
          name:"余额支付",
          icon:"account-pay",
          text:"账户余额",
          color:"#ffb606",
        },
        "微信app支付":{
          name:"微信支付",
          icon:"weixin-pay",
          text:"微信支付",
          color:"#09bb07",
        } 
      },


      trigger_pay:false,
      flow_done_payment:{},

      is_loading_btn:false,

      order_success:false,
      check_times:0,
      max_check_times:2,

      order_checking:false,
    };
  },
  computed: {
    seller_id() {
      return this.$store.getters.getSellerId;
    },
    order_id(){
      return this.$route.params.order_id || "";
    },
    order_type(){
      return this.$route.params.order_type || "";
    },
    location() {
      return this.$store.getters.getLocation;
    },
    // mall_token() {
    //   return utils.storageGet("mall_token")
    // },
    notEnough(){
      var not_enough = false;
      if(this.select_payment.pay_name == "余额支付"){
        if(Number(this.user_info.user_money) < Number(this.order_detail.total_fee)){
          not_enough = true;
        }
      }

      return not_enough;
    },
    resume_stamp() {
      return this.$store.getters.getResumeStamp;
    },
    pause_resume_stamp() {
      return this.$store.getters.getPauseResumeStamp;
    },
  },
  watch:{
    resume_stamp:function(nval,oval){//app  reume
      if(nval - this.pause_resume_stamp <= 500){
        return;
      }

      if(this.order_checking){
        return;
      }
      
      let indicator = document.querySelector('.mint-indicator');
      if(!indicator || indicator.style.display == "none"){
        return;
      }
      if(this.check_times >= this.max_check_times){
        return;
      }
      this.checkOrder();
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
    init:function(){
      this.mall_token = utils.storageGet("mall_token");
      this.getOrderDetail(this.order_id);
      this.getShopPayment();
      // this.getUserInfo();
    },
    formatPayNameText:function(payment){
      var text = "";

      switch(payment.pay_name){
        case "余额支付":
          text = '余额支付(可用余额'+(this.user_info.user_money||0)+'元)';
          break;
        default:
          text = payment.pay_name;
          break;
      }

      return text;
    },
    formatPayText:function(payment){
      var text = "";

      switch(payment.pay_name){
        case "余额支付":
          text = (Number(this.user_info.user_money) >= Number(this.order_detail.total_fee)?'账户余额':'余额不足')
          break;
        default:
          text = this.pay_info[payment.pay_name].text;
          break;
      }

      return text;
    },
    getOrderDetail(order_id,cb){
      var me = this;
      this.order_checking = true;

      utils.API.order_detail({
        data: {
          "token": me.mall_token,
          "order_id" :order_id,
        }
      })
      .then(function(ret) {
        me.order_detail = ret.model.data;
        me.order_checking = false;
        cb&&cb(ret.model.data);
      })
      .catch(function(ret) {
        me.order_checking = false;
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });

    },
    getShopPayment: function() {
      var me = this;
      utils.API.shop_payment({
        data: {
          token: me.mall_token
        }
      })
        .then(function(ret) {
          me.user_info.user_money = parseFloat(ret.model.data.user_money);
          
          me.payment_list = ret.model.data.payment;

          me.payment_list.forEach(function(item){
            if(item.pay_name == "支付宝APP"){
              me.select_payment = _.assign({},item);
            }
          });

        })
        .catch(function(ret) {
          !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        });
    },
    // getUserInfo:function(){
    //   var _this = this;

    //   utils.API.user_info({
    //     data: {
    //       token: _this.mall_token
    //     }
    //   })
    //   .then(function(ret) {
    //     _this.user_info = ret.model.data;
    //   })
    //   .catch(function(ret) {
    //     !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    //   });
    // },
    selectPayType:function(payment){
      this.select_payment = _.assign({},payment);
      this.select_pay_name = payment.pay_name;
    },

    orderUpdate: function(cb){
      var _this = this;

      utils.API.order_update({
        //然后生成订单
        data: {
          token: _this.mall_token,
          pay_id: _this.select_payment.pay_id,
          order_id:_this.order_id,    //订单id
        },
        show_loading:true,
      })
      .then(function(ret) {
        _this.is_loading_btn = false;
        _this.orderPay();
        cb && cb();
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        _this.is_loading_btn = false;
      });
    },
    gotoPay: function() {
      var me = this;

      if(this.is_loading_btn){
        return;
      }

      if(!this.select_payment){
        Toast("选择付款方式~");
        return;
      }

      if(this.notEnough){
        Toast("余额不足！");
        return;
      }

      this.is_loading_btn = true;
      this.orderUpdate();
    },
    orderPay:function(){
      var me = this;

      if(this.is_loading_btn){
        return;
      }

      this.is_loading_btn = true;
      this.check_times = 0;
      utils.API.order_pay({
        //支付订单
        data: {
          token: me.mall_token,
          order_id: me.order_id
        },
        show_loading:true,
      })
      .then(function(ret) {
        me.flow_done_payment = _.assign({},ret.model.data.payment);
        me.trigger_pay = true;
        // if(me.select_payment.pay_name == "支付宝APP"){
        //   try {
        //     var payInfo = ret.model.data.payment.pay_online;
        //     window.cordova.plugins.alipay.payment(payInfo, (res) => {
        //       // 支付成功
        //     }, (error) => {
        //       // 支付失败
        //     });
        //   }catch (e) {

        //   }
        //   // try {
        //   //   var url = ret.model.data.payment.pay_online,
        //   //     target = "_blank",
        //   //     options = "location=no,hidden=no,hardwareback=no";
        //   //   window.cordova.InAppBrowser.open(url, target, options);
        //   // } catch (e) {
        //   //   window.open(ret.model.data.payment.pay_online, "_blank");
        //   // }
        //   me.$router.replace({ path: `/order/${me.order_id}/payresult` });
        // }else if(me.select_payment.pay_name == "微信app支付"){
        //   var wechatpay_prams = {
        //     partnerid: ret.model.data.payment.partnerId, // merchant id
        //     prepayid: ret.model.data.payment.prepayId,   // prepay id
        //     noncestr: ret.model.data.payment.nonceStr,   // nonce
        //     timestamp: ret.model.data.payment.timeStamp, // timestamp
        //     sign: ret.model.data.payment.sign,           // signed string
        //   };

        //   try{
        //     Wechat.isInstalled(function(installed) {
        //       if(installed){
        //         Wechat.sendPaymentRequest(wechatpay_prams, function () {
        //           // alert("Success");
        //         }, function (reason) {
        //           // alert("Failed: " + reason);
        //         });
        //       } else {
        //         Toast("请先安装微信客户端!");
        //       }
        //     }, function(reason) {});
        //   }catch (e) {

        //   }
        //   me.$router.replace({ path: `/order/${me.order_id}/payresult` });
        // }else if(me.select_payment.pay_name == "余额支付"){
        //   Toast("订单支付成功！");
        //   setTimeout(function(){
        //     me.$router.replace({ path:`/my/orders`});
        //   },3000);
        // }
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        me.is_loading_btn = false;
      });
    },
    triggerPayCallback:function(){
      this.trigger_pay = false;
      this.flow_done_payment = {};

      setTimeout(()=>{
        this.is_loading_btn = false;
      },200);

      if(utils.checkUserAgent().is_ios || utils.checkUserAgent().is_android){
        Indicator.open({
          spinnerType: "fading-circle"
        });
      }else{
        this.$router.replace({ path: `/order/${this.order_id}/payresult` });
      }
    },
    triggerError:function(){
      Indicator.close();
    },
    triggerFail:function(){
      Indicator.close();
    },
    triggerError:function(){
      Indicator.close();
    },
    triggerFail:function(){
      Indicator.close();
    },

    checkOrder: function() {
      var me = this;
      Indicator.open({
        spinnerType: "fading-circle"
      });

      this.getOrderDetail(this.order_id,function(detail) {
        if (detail.pay_status == 2) {
          //>0证明付款成功
          me.order_success = true;
          me.afterCheckOrder();
        } else {
          me.order_success = false;
          if(me.check_times < me.max_check_times){
            me.check_times+=1;
            setTimeout(()=>{
              me.checkOrder();
            },1000);
          }else{
            Indicator.close();
            Toast("订单支付失败，请重新尝试支付！");
          }
        }
      });
    },
    afterCheckOrder:function(){
      Indicator.close();
      Toast("订单支付成功！");
      setTimeout(()=>{
        this.$router.replace({ path: `/order/success`});
      },2000);
    },
    goBack: function() {
      var _this = this;
      // this.$router.goBack();
      MessageBox({
        title: "",
        message: "您的订单未及时支付将自动取消",
        showCancelButton: true,
        confirmButtonText:"确认离开",
        cancelButtonText:"继续支付",
      }).then(function(action) {
        if (action === "confirm") {
          _this.$router.replace({ path: `/my/orders`});
          // _this.$router.goBack();
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "./Paymenttype.less";
</style>