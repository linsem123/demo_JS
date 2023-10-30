<template>

</template>

<script>
import { Toast } from "mint-ui";

export default {
  props: {
    pay_name:{
      type: String,
      default: "",
    },
    payment:{
      type: Object,
      default: {},
    },
    trigger_pay: {
      //是否显示border
      type: Boolean,
      default: false,
    },
  },
  components: {},
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  watch:{
    trigger_pay:function(nval,oval){
      if(nval == true){
        this.pay();
      }
    },
  },
  methods: {
    pay:function(){
      var me = this;

      if(this.pay_name == "支付宝APP"){
        try {
          var payInfo = me.payment.pay_online;

          window.cordova.plugins.alipay.payment(payInfo, (res) => {
            // 支付成功
          }, (error) => {
            me.$emit('trigger-error');
            // Toast("支付失败！");
            // 支付失败
          });
        }catch (e) {
          me.$emit('trigger-fail');
          // Toast("启动支付失败!");
        }
        this.$emit('trigger-callback');
        // try {
        //   var url = me.payment.pay_online,
        //     target = "_blank",
        //     options = "location=no,hidden=no,hardwareback=no";
        //   window.cordova.InAppBrowser.open(url, target, options);
        // } catch (e) {
        //   window.open(me.payment.pay_online, "_blank");
        // }
        // me.$router.replace({ path: `/order/${me.order_id}/payresult` });
      }else if(this.pay_name == "微信app支付"){
        var wechatpay_prams = {
          partnerid: me.payment.partnerId, // merchant id
          prepayid: me.payment.prepayId,   // prepay id
          noncestr: me.payment.nonceStr,   // nonce
          timestamp: me.payment.timeStamp, // timestamp
          sign: me.payment.sign,           // signed string
        };

        try{
          Wechat.isInstalled(function(installed) {
            if(installed){
              Wechat.sendPaymentRequest(wechatpay_prams, function (res) {
                // 支付成功
              }, function (reason) {
                me.$emit('trigger-error');
                // Toast("支付失败！");
                // 支付失败
                // alert("Failed: " + reason);
              });
            } else {
              // Toast("请先安装微信客户端!");
              me.$emit('trigger-fail');
            }
          }, function(reason) {});
        }catch (e) {
          // Toast("启动支付失败!");
          me.$emit('trigger-fail');
        }
        this.$emit('trigger-callback');
        // me.$router.replace({ path: `/order/${me.order_id}/payresult` });
      }else if(this.pay_name == "余额支付"){
        Toast("订单支付成功！");
        setTimeout(function(){
          me.$router.replace({ path:`/order/success`});
        },3000);
      }
    },
  }
};
</script>

<style lang="less" scoped>
</style>