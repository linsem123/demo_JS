<template>
  <div>
    <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
      :show_border="false"
    >
      <div slot="left"></div>
      <div slot="main">订单详情</div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->

    <div class="content">
      <div class="top-blank"></div>


      <ul class="order-head">
        <!-- 1.存储中 2.已到期 3.提前结束 4.待付款 5.已取消（ecjia） 6.确认中 7.初始化(保留) -->
        <li class="order-cell">
          <!-- <p class="title bold">{{ renderOrderTypeLabel(order.status) }}</p> -->

          <!-- orderType,//1:寄存订单；2:续存订单 -->
          <p class="title bold">
            <span v-if="order.orderType==2">续存成功</span>
            <span v-else>买入成功</span>
            <span>{{order.weigh}}克</span>
          </p>

          <p class="line">{{order.createTime}}</p>

          <p class="title bold" style="margin-top:0.1rem;">
            <span>固定收益到账：{{order.interest}}<span v-if="order.interestUnit==1">克</span><span v-else>元</span></span>
            <!-- <a class="link" @click="redirect('/my/account/balance')">查看</a> -->
          </p>
          
        </li>
      </ul>

      <ul class="order-head">
        <li class="order-cell">

          <!-- 确认中 -->
          <template v-if="order.status == 6">
            <!-- orderType,//1:寄存订单；2:续存订单 -->

            <!-- 续存订单 -->
            <template v-if="order.orderType==2">
              <p class="title bold">续存克数确认中</p>
            </template>
            <!-- 续存订单 -->

            <!-- 寄存订单 -->
            <template v-else>
              <p class="title bold">购买克数确认中</p>
            </template>
            <!-- 寄存订单 -->

            <!-- <p class="line">预计确认时间 {{order.calInterestStartTime}}</p> -->
          </template>
          <!-- 确认中 -->


          <!-- 存储中 -->
          <template v-if="order.status == 1">
            <p class="title bold">存储期限: {{order.days}}天</p>

            <p class="line">到期剩余时间: {{order.remainDays}}天</p>
          </template>
          <!-- 存储中 -->

          <!-- 已到期 -->
          <template v-if="order.status == 2">
            <p class="title bold">{{ renderOrderTypeLabel(order.status) }}</p>
            <p class="line">{{order.calInterestStopTime}}</p>
            <p class="title bold" style="margin-top:0.1rem;">
              <span>到期商品已自动转到待办</span>
              <!-- <a class="link" @click="redirect('/my/todo')">查看</a> -->
            </p>
          </template>
          <!-- 已到期 -->
        </li>
      </ul>

      <ul class="goods-list">
        <li class="goods-cell clearfix" v-for="goods in order.details" :key="goods.goodsId">
          <img :src="getGoodsInfo(goods,'url')" alt="" class="goods-cover">
          <div class="goods-info">
            <h1 class="goods-name"> {{getGoodsInfo(goods,'goodsName')}} </h1>
            <p class="goods-info-bottom">
              <span class="goods-price" v-if="goods.subsidyPrice">¥{{goods.subsidyPrice | toFixed}}</span>
              <span class="goods-number" v-if="goods.quantity"> x{{goods.quantity}}</span>
            </p>
          </div>
        </li> 
      </ul>


      <div class="common-info">
        <div class="line-info" v-if="getUnitPrice(order)">
          <span class="line-info-title">成交均价</span>
          <span class="line-info-value">{{getUnitPrice(order)}} 元/克</span>
        </div>
        <!-- <div class="line-info" v-if="getGoodsInfo(order,'bonus')">
          <span class="line-info-title">优惠金额</span>
          <span class="line-info-value">{{getGoodsInfo(order,'bonus')}} 元</span>
        </div> -->
        <div class="line-info" v-if="order.bonus">
          <span class="line-info-title">优惠金额</span>
          <span class="line-info-value">-{{order.bonus | toFixed}} 元</span>
        </div>
        <!-- <div class="line-info" v-if="getGoodsInfo(order,'orderTotalFee')">
          <span class="line-info-title">订单金额</span>
          <span class="line-info-value">{{getGoodsInfo(order,'orderTotalFee')}} 元</span>
        </div> -->
        <div class="line-info" v-if="order.orderAmount">
          <span class="line-info-title">订单金额</span>
          <span class="line-info-value">{{order.orderAmount | toFixed}} 元</span>
        </div>
        <!-- <div class="line-info" v-if="getGoodsInfo(order,'formatedTotalFee')">
          <span class="line-info-title">实际支付</span>
          <span class="line-info-value">{{getGoodsInfo(order,'formatedTotalFee')}} 元</span>
        </div> -->
        <div class="line-info" v-if="order.paidAmount">
          <span class="line-info-title">实际支付</span>
          <span class="line-info-value">{{order.paidAmount | toFixed}} 元</span>
        </div>
        <div class="line-info">
          <span class="line-info-title">订单号</span>
          <span class="line-info-value">{{order.orderNo}}</span>
        </div>
      </div>

      <div class="zhanwei"></div>
  	</div>
    
  </div>
</template>

<script>
import topHead from "@/views/components/TopHead.vue";

import { Toast, MessageBox } from "mint-ui";
import { order_type_status } from "@/assets/js/constants";

export default {
  components: {
    topHead: topHead
  },
  data() {
    return {
      mall_token:"",
      order: {
        rawInfo:{},
      },
      current_typeId: 2,
      order_type_status: order_type_status,
      remain_time:0,
    };
  },
  filters:{
    formatTime(stamp){
      var res = "";
      if(/^\d+$/.test(stamp)){
        res = utils.formatDate(stamp,"yyyy-MM-dd HH:mm:ss");;
      }else{
        res = stamp;
      }
      return res;
    },
    toFixed(str){
      return Number(str).toFixed(2);
    },
  },
  computed: {
    id() {
      return this.$route.params.id || "";
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.init();
    })
  },
  mounted() {
    // this.init();
  },
  methods: {
    init(){
      this.mall_token = utils.storageGet("mall_token");
      this.getOrderDetail(this.id);
    },
    renderOrderTypeLabel(status) {
      let me = this,
          res = "",
          tmp = _.find(me.order_type_status,function(o){ return o.typeId == me.current_typeId });

      if(tmp && tmp.status){
        let find = _.find(tmp.status,function(o){ return o.statusKey == status });
        if(find){
          res = find.statusName;
        }
      }
      return res;
    },

    getGoodsInfo:function(goods,key){
      let res = "";
      if(goods.rawInfo && !_.isEmpty(goods.rawInfo)){
        let rawInfo = (typeof goods.rawInfo == "string"?JSON.parse(goods.rawInfo):goods.rawInfo);
        res = rawInfo[key];
      }else{
        res = goods[key]||"";
      }

      return res;
    },
    getUnitPrice:function(order){
      let me = this,
          res = "",
          paidAmount = order.paidAmount,
          weight = order.weigh;

      if(paidAmount&&weight){
        res = (paidAmount/(weight?weight:1)).toFixed(2);
      }
      return res;
    },

    // payOrder: function(order_id) {
    //   this.$router.push({ path: `/order/${order_id}/paymenttype` });
    // },
    // cancelOrder: function(order) {
    //   var _this = this;
    //   MessageBox({
    //     title: "",
    //     message: "确定取消此订单吗？",
    //     showCancelButton: true
    //   }).then(function(action) {
    //     if (action === "confirm") {
    //       utils.API.order_cancel({
    //         //取消订单
    //         data: {
    //           token: _this.mall_token,
    //           order_id: order.rawInfo.orderId
    //         }
    //       })
    //         .then(function(ret) {
    //           // Toast("取消订单成功！");
    //           // setTimeout(function(){
    //           //   window.location.reload();
    //           // },2000);
              

    //           _this.getOrderDetail(order.id, function(detail) {
    //             // _this.order = _.assign(_this.order, detail);
    //             Toast("取消订单成功！");
    //           });
    //         })
    //         .catch(function(ret) {
    //           !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    //         });
    //     } else {
    //     }
    //   });
    // },
    // countTime:function(add_time){
    //   var _this = this,
    //       add_time = (add_time+28800)*1000,
    //       expire_time = add_time + 3600000,
    //       limit = expire_time - new Date().getTime();
      
    //   if(limit > 0){
    //     utils.countDown({//倒计时
    //       seconds:Math.ceil(limit/1000),//倒计时总时间
    //       beforeInterval:function(counter){//beforeInterval
    //         _this.remain_time = utils.getRemain(limit -= 1000);
    //         // me.root_data.captcha_text = '已发送 '+counter;
    //       },
    //       readingSeconds:function(counter){//读秒中callback
    //         _this.remain_time = utils.getRemain(limit -= 1000);
    //         // me.root_data.captcha_text = '已发送 '+counter;
    //       },
    //       end:function(){//倒计时完成后callback
    //         _this.remain_time = "已过期";
    //         _this.getOrderDetail(_this.id);
    //       }
    //     });
    //   }else{
    //     _this.remain_time = "已过期";
    //   }
    // },

    getOrderDetail: function(order_id, cb) {
      var _this = this;
      utils.API.deposit_detail({
        //订单详情
        data: {
          token: _this.mall_token,
          "reqBody":{
            id: order_id
          },
        }
      })
      .then(function(ret) {
        _this.order = _.assign({},ret.model);
        cb&&cb(ret.model)
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    // selectWillDo:function(value,order_id,cb){//设置到期后自动转为什么
    //   var me = this,
    //       data = {
    //         id:order_id,
    //         willDo:value,
    //       };
      
    //   utils.API.deposit_update({
    //     data: {
    //       token: me.mall_token,
    //       "reqBody":data,
    //     }
    //   })
    //   .then(function(ret) {
        
    //     me.getOrderDetail(order_id,function(detail){
    //       Toast("设置成功！");
    //       // me.order = _.assign({},detail);
    //     });
    //   })
    //   .catch(function(ret) {
    //     !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    //   });
    // },
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