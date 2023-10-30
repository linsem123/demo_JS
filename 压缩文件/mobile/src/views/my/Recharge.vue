<template>
  <div>
    <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">充值</div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->

    <div class="mall-my-recharge">
      <div class="top-blank"></div>
      
      <div class="recharge-wrap">
        <h4 class="recharge-title">充值金额</h4>

        <div class="recharge-ribbon">
          <input class="ribbon-input" type="number" name="recharge-number" v-model="recharge_number" placeholder="请输入充值金额" />
        </div>

        <!-- <div class="tip-wrap">
          <p>特别说明：充值到账后会以短信通知。</p>
        </div> -->
      </div>

      <div class="zhanwei"></div>
  	</div>
    
    <div class="bottom-wrap">
      <a class="bottom-btn" :class="!can_pay?'disable':''" @click="gotoPay">支付宝支付</a>
    </div>




    <mt-actionsheet
      :actions="paymenttype_actions"
      :closeOnClickModal="false"
      v-model="sheetVisible">
    </mt-actionsheet>


    <trigger-Pay
      :trigger_pay="trigger_pay"
      :pay_name="select_payment.pay_name"
      :payment="flow_done_payment"
      @trigger-callback="triggerPayCallback">
    </trigger-Pay>

  </div>
</template>

<script>
import topHead from "@/views/components/TopHead.vue";
import constants from "@/assets/js/constants.js";
import triggerPay from "@/views/components/TriggerPay.vue";

import {
	Toast,
	MessageBox,
  Actionsheet,
} from 'mint-ui';

export default {
	components:{
    topHead:topHead,
    mtActionsheet:Actionsheet,
    triggerPay:triggerPay,
	},
	data(){
	  return {
      mall_token:"",
	  	recharge_number:"",


      payment_list:[],
      select_payment:{},
      pay_info:{
        "支付宝APP":{
          name:"支付宝",
        },
        "微信app支付":{
          name:"微信支付",
        } 
      },

      sheetVisible:false,
      paymenttype_actions:[],


      trigger_pay:false,
      flow_done_payment:{},

      is_paying:false,
		}	
	},
  computed: {
    // mall_token(){
    //   return utils.storageGet("mall_token");
    // },
    // mall_uid(){
    //   return utils.storageGet("mall_uid");
    // },
    mobile(){
      return utils.storageGet("mobile");
    },
    can_pay(){
      var res = false;

      if(new RegExp(constants.FORM_REG["money"],'g').test(this.recharge_number)){
        res = true;
      }else{
        res = false;
      }
      return res;
    },
  },
	mounted(){
    // this.init();
	},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.init();
    })
  },
	methods:{
    init: function() {
      this.mall_token = utils.storageGet("mall_token");
      this.getShopPayment();
    },
    getShopPayment: function() {
      var me = this;
      utils.API.shop_payment({
        data: {
          token: me.mall_token
        }
      })
      .then(function(ret) {
        // me.payment_list = ret.model.data.payment;

        // me.payment_list.forEach(function(item){
        //   if(item.pay_name == "支付宝"){
        //     me.select_payment = _.assign({},item);
        //   }
        // });
        let payment_list = [];
        ret.model.data.payment.forEach(function(item){

          if(me.pay_info[item.pay_name]){

            item.name = me.pay_info[item.pay_name].name;
            payment_list.push(item);

            if(item.pay_name == "支付宝APP"){
              me.select_payment = _.assign({},item);
            }

            me.paymenttype_actions.push({
              name:name,
              method: function(){
                me.select_payment = item;
                me.sheetVisible = !me.sheetVisible;
              },
            });
          }
        });

        me.payment_list = payment_list;

      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    userAccountDeposit:function(cb){//会员充值申请
      var me = this;

      if(_.isEmpty(this.select_payment)){
        Toast("无法获取支付方式！");
        return;
      }


      utils.API.user_account_deposit({
        data: {
          "token" : me.mall_token,
          "amount" : me.recharge_number,
          "note"   : `会员${me.mobile}充值${me.recharge_number}元`,
          "payment_id" : me.select_payment.pay_id,
        }
      })
      .then(function(ret) {
        cb&&cb(ret.model.data);
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    triggerPayCallback:function(){
      var me = this;

      this.trigger_pay = false;
      this.flow_done_payment = {};
      
      setTimeout(function(){
        me.is_paying = false;
        me.goBack();
      },500);



      // this.$router.replace({ path: `/order/${this.order_id}/payresult` });
    },
    userAccountPay:function(data){
      var me = this;

      return new Promise(function(resolve, reject) {
        utils.API.user_account_pay({
          data: {
            "token":me.mall_token,
            "account_id":data.payment.account_id,
            "payment_id":data.payment.payment_id,
          }
        })
        .then(function(ret) {
          resolve(ret);
          // me.interest_list = ret.model.items;
        })
        .catch(function(ret) {
          reject(ret)
          // !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        });
      })

    },
    gotoPay:function(){
      var me = this;
      if(!this.can_pay){
        return;
      }

      if(this.is_paying){
        return;
      }

      this.is_paying = true;

      this.userAccountDeposit(function(data){
        me.userAccountPay(data)
        .then(function(ret){
          me.flow_done_payment = _.assign({},ret.model.data.payment);
          me.trigger_pay = true;

          // MessageBox({
          //   title: "",
          //   message: "充值成功后会以!",
          //   showCancelButton: false,
          //   confirmButtonText:"完成",
          // }).then(function(action) {
          //   if(action === "confirm") {
          //     me.goBack();
          //   }else{

          //   }
          // });

        })
        .catch(function(ret) {
          !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
          me.is_paying = false;
        });
      })
    },
	  goBack:function(){
			this.$router.goBack();
		},
    redirect: function(url){
      this.$router.push({path: url})
    }
	}
};

</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";

.mall-my-recharge{
	width: 100vw;
  height: 100vh;
  overflow-y: auto;
  // position: absolute;
  background:#ffffff;

  .recharge-wrap {
    padding:0 0.35rem;
    box-sizing: border-box;
    .recharge-title {
      padding:0.3rem 0;
      font-size:0.3rem;
      font-weight:normal;
    }
    .recharge-ribbon {
      .ribbon-input {
        width:100%;
        box-sizing:border-box;
        padding:0.2rem;
        height:1rem;
        line-height:1rem;
        font-size:0.3rem;
        border:1px solid @border-color;
      }
    }
    .tip-wrap {
      margin-top:0.45rem;
      font-size:0.28rem;
      color:@font-gray-color;
    }
  }

  .zhanwei {
    height:1.2rem;
  }
}

.bottom-wrap {
  position: absolute;
  z-index:20;
  bottom:0;
  display: flex;
  width: 100%;
  justify-content: space-between;
  background: #ffffff;
  align-items: center;

  .bottom-btn {
    font-size:0.4rem;
    font-weight:bold;
    color:#ffffff;
    background:@yellow;
    text-align:center;
    width:100%;
    height:1.1rem;
    line-height:1.1rem;
    &.disable {
      background:@yellow-disable;
    }
  }
}

</style>