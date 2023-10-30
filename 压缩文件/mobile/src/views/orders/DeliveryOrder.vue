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
        <!-- 1.待付款(目前没有手续费，所以这个状态没有使用，生成订单后直接变成待发货) 
             2.待发货 
             3.待收货 
             4.已完成 
             5.已取消（暂时产品要求只有查看全部时才能查到） -->
        <li class="order-cell">
          <p class="title bold">
            <span>{{ renderOrderTypeLabel(order.status) }}</span>
          </p>

          <!-- 待发货 -->
          <p class="tip" v-if="order.status==2">您的商品将在1-2个工作日内安排发货</p>
          <!-- 待发货 -->

          <!-- 待收货 -->
          <p class="tip" v-if="order.status==3">您的包裹已发出，请关注订单物流并及时确认收货</p>
          <!-- 待收货 -->

          <p class="line">{{order.createTime}}</p>

        </li>
        <li class="order-cell">
          <p class="title">{{ order.name}} {{ order.mobile}}</p>
          <p class="line">{{ order.address }}</p>
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
        <div class="line-info">
          <span class="line-info-title">提取克重</span>
          <span class="line-info-value">{{order.weigh}} 克</span>
        </div>
        <div class="line-info">
          <span class="line-info-title">快递品牌</span>
          <span class="line-info-value">顺丰速运</span>
        </div>
        <div class="line-info" v-if="order.status==3 || order.status==4">
          <span class="line-info-title">快递单号</span>
          <span class="line-info-value">{{order.expressNo}}<i class="copy" @click="copyCode(order.expressNo)">复制</i></span>
        </div>
        <div class="line-info">
          <span class="line-info-title">发票抬头</span>
          <span class="line-info-value">默认个人，如需更改，电话联系客服</span>
        </div>
        <div class="line-info">
          <span class="line-info-title">发票内容</span>
          <span class="line-info-value">商品明细</span>
        </div>
        <div class="line-info">
          <span class="line-info-title">订单号</span>
          <span class="line-info-value">{{order.orderNo}}</span>
        </div>
      </div>

      <div class="zhanwei"></div>

  	</div>



    <!-- 底部操作 -->
      <!-- 待发货 -->
      <template v-if="order.status==2">
        <div class="bottom-common-wrap">
          <a class="bottom-btn" :href="'tel:'+guest_phone">电话客服</a>
        </div>
      </template>
      <!-- 待发货 -->

      <!-- 待收货 -->
      <template v-if="order.status==3">
        <div class="bottom-common-wrap">
          <a class="bottom-btn" @click="confirmOrder(order.id);">确认收货</a>
        </div>
      </template>
      <!-- 待收货 -->
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
      current_typeId: 4,//提货==4
      order_type_status: order_type_status
    };
  },
  computed: {
    id() {
      return this.$route.params.id || "";
    },
    guest_phone(){
      return this.$store.getters.getGuestPhone;
    },
  },
  mounted() {
    // this.init();
  },
  filters: {
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.init();
    })
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
    confirmOrder: function(order_id) {
      var _this = this;

      utils.API.delivery_confirm({
        data: {
          token: _this.mall_token,
          "reqBody":{
            id: order_id
          },
        }
      })
      .then(function(ret) {
        _this.getOrderDetail(order_id,function(detail) {
          // _this.order = _.assign(_this.order, detail);
          Toast("确认收货成功！");
        });
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    // payOrder: function(order) {
    //   var me = this;

    //   if(order.expressFee <= 0){
    //     utils.API.fund_pay({
    //       data: {
    //         "token": me.mall_token,
    //         "reqBody":{
    //           id:order.id,
    //           channel:"alipay",
    //         },
    //       }
    //     })
    //     .then(function(ret) {
    //        me.getOrderDetail(order.id, function(detail) {
    //         // _this.order = _.assign(_this.order, detail);
    //         Toast("提货申请成功，请耐心等待发货！");
    //       });
                  
    //     })
    //     .catch(function(ret) {
    //       !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    //     });

    //   }else{
    //     this.$router.push({ path: `/my/todo/paymenttype/${order.id}`});
    //   }
    // },
    // cancelOrder: function(order_id) {
    //   var _this = this;
    //   MessageBox({
    //     title: "",
    //     message: "确定取消提货吗？",
    //     showCancelButton: true
    //   }).then(function(action) {
    //     if (action === "confirm") {
    //       utils.API.delivery_cancel({
    //         //取消订单
    //         data: {
    //           token: _this.mall_token,
    //           "reqBody":{
    //             id: order_id
    //           },
    //         }
    //       })
    //       .then(function(ret) {
    //         _this.getOrderDetail(order_id,function(detail) {
    //           // _this.order = _.assign(_this.order, detail);
    //           Toast("取消提货成功！");
    //         });
    //       })
    //       .catch(function(ret) {
    //         !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    //       });
    //     } else {
    //     }
    //   });
    // },
    getOrderDetail: function(order_id, cb) {
      var _this = this;
      utils.API.delivery_detail({
        //订单详情
        data: {
          token: _this.mall_token,
          "reqBody":{
            id: order_id
          },
        }
      })
      .then(function(ret) {
        _this.order = ret.model;
        cb && cb(ret.model);
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
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
    goBack: function() {
      this.$router.goBack();
    }
  }
};
</script>

<style lang="less" scoped>
@import "./OrdersDetail.less";
.content {
  width: 100vw;
  height: 100vh;
  overflow: auto;
}
</style>