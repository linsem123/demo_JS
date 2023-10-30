<template>
  <div>
    <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">确认订单</div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->


    <div class="gen-order-withdraw">
      <div class="top-blank"></div>

      <template v-if="cart&&cart.goods_list">

        <!-- 利息信息 -->
        <div class="interest-schema-wrap">
          <div class="top-info">
            <span class="iconfont icon-waitingfill"></span>
            <div class="schema-info">
              <p>存储期限：{{temp_cart_info.interest_schema.days}}天</p>
              <p>赠送到账：{{temp_cart_info.total_interest}}元</p>
            </div>
            <!-- <span class="iconfont icon-more"></span> -->
          </div>
          <p class="tip-text">支付成功后发放至您的账户，可直接提现</p>
        </div>
        <!-- 利息信息 -->

        <!-- 支付方式信息 -->
        <div class="paymenttype-wrap" @click="sheetVisible=!sheetVisible">
          <span class="paymenttype-title">支付方式</span>
          <p>
            <span class="paymenttype-name">{{select_payment.name}}</span>
            <span class="iconfont icon-more"></span>
          </p>
          
        </div>
        <!-- 支付方式信息 -->

        <!-- 购买信息 -->
        <div class="buy-info-wrap">
          <!-- <div class="expire-time">
            <span>预计到期时间：{{expire_time}}</span>
            <span class="iconfont icon-wenhao" @click="showTip"></span>
          </div> -->
          <!-- 购物车选中列表 -->
          <ul v-if="selected_goods_list" class="cart-goods-list">
            <li class="cart-goods-cell" v-for="goods in selected_goods_list">
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

          
          
          <!-- 汇总信息 -->
          <!-- <div class="sum-info-wrap">
            <div class="config-wrap">
              <div class="config-title">商品总额</div>
              <div class="config-info">
                <p class="config-text red">{{cart.total.goods_price}}</p>
              </div>
            </div>
          </div> -->
          <!-- 汇总信息 -->
        </div>
        <!-- 购买信息 -->


        <!-- 优惠券 -->
        <div class="config-info-wrap">
          <div class="config-line" @click="coupons_modal=!coupons_modal">
            <div class="config-title">优惠券</div>
            <div class="config-info">
              <template v-if="bonus.length<=0">
                <p class="config-text gray">无可用优惠券</p>
                <span class="iconfont icon-more gray"></span>
              </template>
              <template v-else>
                <template v-if="active_coupon">
                  <p class="config-text red">-{{active_coupon&&active_coupon.bonus_amount||0}}</p>
                  <span class="iconfont icon-more red"></span>
                </template>
                <template v-else>
                  <p class="config-text gray">不使用优惠券</p>
                  <span class="iconfont icon-more gray"></span>
                </template>
              </template>

             <!--  <template v-if="active_coupon">
                <p class="config-text red">-￥{{active_coupon&&active_coupon.bonus_amount||0}}</p>
                <span class="iconfont icon-more red"></span>
              </template>
              <template v-else>
                <p class="config-text">不使用优惠券</p>
                <span class="iconfont icon-more"></span>
              </template>  -->
            </div>
          </div>
          <div class="config-line">
            <div class="config-title">预计到期时间</div>
            <div class="config-info">{{expire_time}}</div>
          </div>
        </div>
        <!-- 优惠券 -->

        <!-- 特价金说明 -->
        <div v-if="macross">
          <template v-if="activity_id!='0'">
            <div class="panel-wrap" >
              <h4 class="panel-title">
                <span class="title-cell">特价金说明</span>
              </h4>
              <ul class="special-specification-wrap">
                <li class="specification-cell"><span>1、</span><span>每位用户仅可购买1g，此产品每周限量5000g，售完即止</span></li>
                <li class="specification-cell"><span>2、</span><span>本活动与优惠券不可同时使用</span></li>
                <li class="specification-cell"><span>3、</span><span>固定收益：本产品固定存入期限30天，可正常享受 4%年化收益，下单即发放至账户</span></li>
              </ul>
            </div>
            <regular></regular>
            <selections></selections>
            <venture-tip></venture-tip>
          </template>

          <template v-else>
            <regular></regular>
            <introduce></introduce>
            <selections></selections>
            <venture-tip></venture-tip>
          </template>

        </div>
        
        <div class="zhanwei"></div>

      </template>
      
      <template v-else>
        <div class="wrapper">
          没有更多啦~
        </div>
      </template>
  	</div>

    <!-- 优惠券弹层 -->
    <popup-coupon
      :coupons_modal="coupons_modal"
      :available_coupons="bonus"
      @select-coupon="selectCoupon"
      @close-coupons-modal="closeCouponsModal"
    ></popup-coupon>

    <div class="pay-wrap">
      <div class="agreement-wrap" @click="select_agreement=!select_agreement">
        <span class="select-core" :class="select_agreement?'checked':''"></span>
        <span class="agreement-text">我已阅读并同意<i @click.stop="show_contract=!show_contract">《黄金象用户存储协议》</i></span>
      </div>
      <div class="pay-price-wrap">
        <p>
          <span class="total-price">￥{{total_price}}</span>
          <span class="coupon-price">已优惠 ￥{{active_coupon&&active_coupon.bonus_amount||0}}</span>
        </p>
        <a class="pay-btn" @click="gotoPay">确认支付</a>
      </div>
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
      @trigger-callback="triggerPayCallback"
      @trigger-error="triggerError"
      @trigger-fail="triggerFail">
    </trigger-Pay>
    




    <!-- 黄金象用户存储协议 -->
    <Popup
        v-model="show_contract"
        position="right" 
        class="pop-modal">
      <a href="javascript:void(0);" class="iconfont icon-back" @click="show_contract=!show_contract"></a>
      <div class="title">黄金象用户存储协议</div>
      <div class="content">
        <div class="pop-content-wrap" v-html= "contract.body"></div>
      </div>
    </Popup>

  </div>
</template>

<script>
import appconfig from "@/config/appconfig.js";
import topHead from "@/views/components/TopHead.vue";
import popupAddress from "@/views/components/PopupAddressList.vue";
import popupCoupon from "@/views/components/PopupCoupon.vue";
import triggerPay from "@/views/components/TriggerPay.vue";

import regular from "@/views/components/Regular.vue";
import introduce from "@/views/components/Introduce.vue";
import selections from "@/views/components/Selections.vue";
import ventureTip from "@/views/components/VentureTip.vue";

import { Toast, MessageBox, Indicator, Actionsheet, Popup, } from "mint-ui";

// utils.extendApi(API);//把API扩充到utils方法里边

export default {
  components: {
    topHead: topHead,
    popupAddress:popupAddress,
    popupCoupon:popupCoupon,
    mtActionsheet:Actionsheet,
    triggerPay:triggerPay,
    Popup:Popup,

    regular:regular,
    introduce:introduce,
    selections:selections,
    ventureTip:ventureTip,
  },
  data() {
    return {
      mall_token:"",
      cart:{},
      goods_list:[],


      check_order:{},
      shipping_info:{},


      bonus:[],
      coupons_modal:false,
      select_coupon:{},

      user_info:{
        user_money:0,
      },
      order_id:null,

      sheetVisible:false,
      paymenttype_actions:[],


      payment_list: [],
      select_payment: {},
      pay_info:{
        "支付宝APP":{
          name:"支付宝",
        },
        "余额支付":{
          name:"余额支付",
        },
        "微信app支付":{
          name:"微信支付",
        } 
      },

      select_agreement:true,
      show_contract:false,
      contract:{
        title:"",
        body:"",
      },

      expire_time:"",

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
    activity_id(){
      return this.$route.params.activity_id || "";
    },
    seller_id() {
      return this.$store.getters.getSellerId;
    },
    macross() {
      return this.$store.getters.getMacross;
    },
    location() {
      return this.$store.getters.getLocation;
    },
    temp_cart_info(){
      return this.$store.getters.getTempCartInfo;
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
    notEnough(){
      var not_enough = false;
      if(Number(this.user_info.user_money) < Number(this.cart.total.unformatted_goods_price)){
        not_enough = true;
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
      if(!this.order_id){
        return;
      }
      if(this.check_times >= this.max_check_times){
        return;
      }
      this.checkOrder();
    },
    // temp_cart_info:{
    //   handler:function(nval,oval){
    //   var me = this,
    //       cart_list = nval.cart_list&&nval.cart_list.length&&nval.cart_list[0]||{};
    //   if(_.isEmpty(cart_list)){
    //     return;
    //   }
    //   this.restCart(cart_list,function(){
    //     if(me.selected_goods_list.length){//
    //       var rec_id = me.getSelectGoodsRecId();
    //       me.flowCheckOrder("-1",rec_id);
    //     }
    //   })
    // },
    //   deep: true,
    //   immediate: true,
    // }
  },
  mounted() {
    // this.init();
    // 
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

      // this.getUserInfo();
      this.getOrderExpectFinishDate();
      this.getContract();

      let cart_list = this.temp_cart_info.cart_list&&this.temp_cart_info.cart_list.length&&this.temp_cart_info.cart_list[0]||{};
      this.restCart(cart_list,function(){
        if(me.selected_goods_list.length){//
          var rec_id = me.getSelectGoodsRecId();
          me.flowCheckOrder("-1",rec_id);
        }
      })

      // me.getCart(function(){
      //   if(me.selected_goods_list.length){//
      //     var rec_id = me.getSelectGoodsRecId();

      //     me.flowCheckOrder("-1",rec_id);
      //   }
      //   // console.log("me.active_address:",me.active_address);
      //   // console.log("me.selected_goods_list:",me.selected_goods_list);
      // });
    },
    getContract:function(){
      var me = this;

      utils.API.cmsservice_contract_storage({
        method:"get",
      })
      .then(function(ret) {
        let contract = "";

        if(ret.model&&ret.model.length){
          var the_same = _.find(ret.model,function(o){return o.field_audit_status == "无";});

          if(the_same){
            contract = the_same;
          }else{
            if(!me.macross){
              contract = _.find(ret.model,function(o){
                return o.field_audit_status == "审核前";
              });
            }else{
              contract = _.find(ret.model,function(o){
                return o.field_audit_status == "审核后";
              });
            }
          }

          var reg = /\"+?\/(.+)((\.jpg)|(\.png))\"/gi;
          contract.body = contract.body.replace(reg,"\""+appconfig.cmsbaseurl+"/"+"$1$2"+"\"");
          me.contract = _.assign({},contract);
        }
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    getOrderExpectFinishDate:function(){
      var me = this;

      utils.API.order_expectFinishDate({
        data: {
          "reqBody":{
            "days":me.temp_cart_info.interest_schema.days//寄存天数
          }
        }
      })
      .then(function(ret) {
        me.expire_time = ret.model.expectFinishDate;
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    // getUserInfo:function(){
    //   var me = this;

    //   utils.API.user_info({
    //     data: {
    //       token: me.mall_token
    //     }
    //   })
    //   .then(function(ret) {
    //     me.user_info = ret.model.data;
    //   })
    //   .catch(function(ret) {
    //     !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    //   });
    // },
    
    getCart: function(cb) {
      var me = this;

      utils.API.cart_list({
        data: {
          token: me.mall_token,
          seller_id: me.seller_id,
          "rec_type":101,//购物车类型,不传代表默认，101：临时
          location: me.location
        }
      })
      .then(function(ret) {
        me.restCart(ret.model.data.cart_list&&ret.model.data.cart_list[0]||{},cb);
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    restCart:function(cart_list,cb){//重置购物车
      // var me = this;
      this.cart = cart_list;
      this.goods_list = cart_list&&cart_list.goods_list||[];
      cb&&cb();
    },

    flowCheckOrder:function(address_id,rec_id){
      var me = this;

      utils.API.flow_checkOrder({
        data: {
          token: me.mall_token,
          location: me.location,
          "address_id" : address_id,
          "rec_type":101,//购物车类型,不传代表默认，101：临时
          "rec_id" : rec_id,
          "order_type":1,//1：存储；2：提货
        }
      })
      .then(function(ret) {
        me.user_info.user_money = parseFloat(ret.model.data.user_money);

        let payment_list = [];
        me.paymenttype_actions = [];
        
        ret.model.data.payment_list.forEach(function(item){

          if(me.pay_info[item.pay_name]){

            item.name = me.pay_info[item.pay_name].name;
            payment_list.push(item);

            if(item.pay_name == "支付宝APP"){
              me.select_payment = _.assign({},item);
            }

            let name = me.pay_info[item.pay_name].name;

            if(item.pay_name == "余额支付"){
              if(me.notEnough){
                name = '余额支付(余额不足)';
              }
            }

            me.paymenttype_actions.push({
              name:name,
              method: function(){
                if(item.pay_name == "余额支付"){
                  if(me.notEnough){
                    return;
                  }
                }
                me.select_payment = item;
                me.sheetVisible = !me.sheetVisible;
              },
            });
          }
        });

        me.payment_list = payment_list;


        me.check_order = _.assign(me.check_order,ret.model.data);

        if(me.check_order.shipping_list && me.check_order.shipping_list.length){
          me.shipping_info = _.assign({},me.check_order.shipping_list[0]);
        }

        if(me.check_order.bonus && me.check_order.bonus.length){
          me.bonus = me.check_order.bonus;
        }

      })
      .catch(function(ret) {
        if(ret.errorCode == 80009){
          Toast("商品价格有所变动，已为您重新计算！");
          me.getCart(function(){
            me.flowCheckOrder("-1",me.getSelectGoodsRecId());
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
    getOrderType:function(){
      return this.temp_cart_info.interest_schema.name+this.temp_cart_info.interest_schema.id;
    },


    // 弹层的操作
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
      if(!this.select_agreement){
        Toast("您还没同意《黄金象用户存储协议》！");
        return;
      }

      if(this.is_loading_btn){
        return;
      }

      var data = {
        shipping_id:"ship_o2o_express",
        rec_id:this.getSelectGoodsRecId(),
        address_id:-1,
        order_type:this.getOrderType(),
      }

      this.is_loading_btn = true;
      this.genOrder(data);
    }.after(function(){
      utils.trackEvent('click_quickBuy_payButton');
    }),
    
    genOrder:function(data){
      var me = this,
          data = _.assign(data,{
            token: me.mall_token,
            pay_id: me.select_payment.pay_id,
            need_inv: 0,
            location: me.location,
            integral: 0,
            "rec_type":101,//购物车类型,不传代表默认，101：临时
          });

      if(me.bonus.length > 0 && me.active_coupon){
        data.bonus = me.active_coupon.bonus_id;
      }

      utils.API.flow_done({
        //然后生成订单
        data:data,
        show_loading:true,
      })
      .then(function(ret) {
        me.order_id = ret.model.data.order_id;
        me.is_loading_btn = false;
        me.orderPay();
      })
      .catch(function(ret) {
        if(ret.errorCode == 80009){
          Toast("商品价格有所变动，已为您重新计算！");
          me.getCart(function(){
            me.flowCheckOrder("-1",me.getSelectGoodsRecId());
          });
        }else{
          !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        }
        me.is_loading_btn = false;
      });
    },
    orderPay:function(){
      var me = this;

      if(this.is_loading_btn){
        return;
      }

      this.is_loading_btn = true;

      utils.API.order_pay({
        //支付订单
        data: {
          token: me.mall_token,
          order_id: me.order_id,
        },
        show_loading:true,
      })
      .then(function(ret) {
        me.flow_done_payment = _.assign({},ret.model.data.payment);
        me.trigger_pay = true;
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
        this.$router.push({ path: `/order/${this.order_id}/payresult` });
      }
    },
    triggerError:function(){
      if(!utils.checkUserAgent().is_ios && !utils.checkUserAgent().is_android){
        return;
      }
      this.order_checking = true;
      Indicator.close();
      Toast("订单支付失败，请重新支付订单！");
      setTimeout(()=>{
        this.$router.push({ path: `/order/${this.order_id}/paymenttype`});
      },2000);
    },
    triggerFail:function(){
      if(!utils.checkUserAgent().is_ios && !utils.checkUserAgent().is_android){
        return;
      }
      this.order_checking = true;
      Indicator.close();
      Toast("订单支付失败，请重新支付订单！");
      setTimeout(()=>{
        this.$router.push({ path: `/order/${this.order_id}/paymenttype`});
      },2000);
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
        me.order_checking = false;
        cb&&cb(ret.model.data);
      })
      .catch(function(ret) {
        me.order_checking = false;
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });

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
            Toast("订单支付失败，请重新支付订单！");
            setTimeout(()=>{
              me.$router.push({ path: `/order/${me.order_id}/paymenttype`});
            },2000);
          }
        }
      });
    },
    afterCheckOrder:function(){
      Indicator.close();
      Toast("订单支付成功！");
      setTimeout(()=>{
        this.$router.push({ path: `/order/success`});
      },2000);
    },


    showTip:function(){
      MessageBox({
        title: '',
        message: '特别说明：如遇周末及节假日，到期时间根据天数自动顺延',
        showCancelButton: false,
      });
    },
    goBack: function() {
      this.$router.goBack();
    }
  }
};
</script>

<style lang="less" scoped>
@import "./GenFast.less";
</style>