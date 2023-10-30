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
        <!-- 1.待确认 2.已确认 3.已取消 -->
        <li class="order-cell">
          <p class="title bold">
            <span>{{ renderOrderTypeLabel(order.status) }}</span>
            <span>{{order.weigh}}克</span>
          </p>

          <p class="line">{{order.createTime}}</p>

          <!-- 待确认 -->
          <template v-if="order.status==1">
            <p class="tip">
              <span v-if="remain_time=='已过期'">已过期</span>
              <span v-else>{{remain_time}}内未确认，订单将自动关闭</span>
            </p> 
          </template>
          <!-- 待确认 -->

          <!-- 已确认 -->
          <template v-if="order.status==2">
            <p class="title bold" style="margin-top:0.1rem;">
              <span>卖出金额到账：{{order.amount}}元</span>
              <!-- <a class="link" @click="redirect('/my/account/balance')">查看</a> -->
            </p>
          </template>
          <!-- 已确认 -->
          
        </li>
      </ul>

      <ul class="goods-list">
        <li class="goods-cell clearfix" v-for="goods in order.details" :key="goods.goodsId">
          <img :src="getGoodsInfo(goods,'url')" alt="" class="goods-cover">
          <div class="goods-info">
            <h1 class="goods-name"> {{getGoodsInfo(goods,'goodsName')}} </h1>
            <p class="goods-info-bottom">
              <span class="goods-number" v-if="goods.quantity"> x{{goods.quantity}}</span>
            </p>
          </div>
        </li> 
      </ul>



      <div class="common-info">
        <div class="line-info" v-if="order.unitPrice">
          <span class="line-info-title">成交金价</span>
          <span class="line-info-value">{{order.unitPrice | toFixed}} 元/克</span>
        </div>
        <div class="line-info">
          <span class="line-info-title">卖出金额</span>
          <span class="line-info-value">{{order.amount | toFixed}} 元</span>
        </div>
        <div class="line-info">
          <span class="line-info-title">到账方式</span>
          <span class="line-info-value">账户余额</span>
        </div>
        <div class="line-info">
          <span class="line-info-title">订单号</span>
          <span class="line-info-value">{{order.orderNo}}</span>
        </div>
      </div>

      <div class="zhanwei"></div>

  	</div>


    <!-- 底部操作 -->
      <!-- 待付款 -->
      <template v-if="order.status==1">
        <div class="bottom-wrap">
          <a class="bottom-btn white" @click="cancelOrder(order.id)">取消订单</a>
          <a class="bottom-btn yellow" @click="confirmOrder(order.id)">确认卖出</a>
        </div>
      </template>
      <!-- 待付款 -->
    <!-- 底部操作 -->
    
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
      order: {},
      order_type_status: order_type_status,
      current_typeId: 3,//回购==3

      remain_time: 0,
      route_from:{},
    };
  },
  computed: {
    id() {
      return this.$route.params.id || "";
    },
    // mall_token() {
    //   return utils.storageGet("mall_token");
    // },
  },
  mounted() {
    // this.init();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.route_from = from;
      // 通过 `vm` 访问组件实例
      vm.init();
    })
  },
  filters:{
    toFixed(str){
      return Number(str).toFixed(2);
    },
  },
  methods: {
    init(){
      this.mall_token = utils.storageGet("mall_token");
      this.getOrderDetail(this.id);
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

    countTime:function(add_time){
      if(!add_time){
        return ;
      }
      var _this = this,
          add_time = new Date(add_time).getTime(),
          expire_time = add_time + 300000,
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
            
            _this.getOrderDetail(_this.id, function(detail) {
              _this.order = _.assign(_this.order, detail);
            });
          }
        });
      }else{
        _this.remain_time = "已过期";
      }
    },


    confirmOrder: function(order_id) {
      var _this = this;

      utils.API.buyback_confirm({
        data: {
          token: _this.mall_token,
          "reqBody":{
            id:order_id,
          },
        }
      })
        .then(function(ret) {
          // _this.$router.replace({ path:`/my/todo/payresult`});
          _this.getOrderDetail(order_id, function(detail) {
            _this.order = _.assign(_this.order, detail);
            Toast("回购成功！");
          });
        })
        .catch(function(ret) {
          !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");

           _this.getOrderDetail(order_id, function(detail) {
            _this.order = _.assign(_this.order, detail);
          });
        });
    },
    // payOrder: function() {
    //   this.$router.push({ path: `/order/${this.order.order_id}/paymenttype` });
    // },
    cancelOrder: function(order_id) {
      var _this = this;

      MessageBox({
        title: "",
        message: "确定取消回购吗？",
        showCancelButton: true
      }).then(function(action) {
        if (action === "confirm") {
          utils.API.buyback_cancel({
            //取消订单
            data: {
              token: _this.mall_token,
              "reqBody":{
                id:order_id,
              },
            }
          })
          .then(function(ret) {
            _this.getOrderDetail(order_id, function(detail) {
              // _this.order = _.assign(_this.order, detail);
              Toast("取消回购成功！");
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
      utils.API.buyback_detail({
        //订单详情
        data: {
          token: _this.mall_token,
          "reqBody":{
            id: order_id
          },
        }
      })
      .then(function(ret) {
        _this.order = _.assign({}, ret.model);
        _this.countTime(ret.model.createTime);
        cb && cb(ret.model);
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    goBack: function() {
      if(this.route_from.fullPath != "/my/orders"){
        this.$router.goBack("/my/orders");
      }else{
        this.$router.goBack();
      }
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