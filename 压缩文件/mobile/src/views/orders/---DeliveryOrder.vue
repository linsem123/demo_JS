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

      <!-- 订单详情 -->
      <div class="order-list-wrap">
      	<ul class="order-list">
      		<li class="order">
      			<div class="order-head">
      				<p><i class="iconfont icon-tishi"></i> {{ order.status | renderStatus(current_order_type_status)  }} </p>
      			</div>
            <div class="consignee-info">
              <p class="consignee"><i class="iconfont icon-dizhi"></i> {{ order.name}} {{ order.mobile}}</p>
              <p class="address">{{ order.address}}</p>
            </div>
            <ul class="goods-list">
              <li class="goods clearfix" v-for="goods in order.details" :key="goods.goodsId">
                <img :src="goods.url" alt="" class="goods-cover">
                <div class="goods-info">
                  <h1 class="goods-name"> {{goods.goodsName}} </h1>
                  <p>
                    <span class="goods-number"> x{{goods.quantity}} </span>
                  </p>
                </div>
              </li> 
            </ul>
            <div class="block"></div>
            <div class="line-info">
              <span>订单编号：{{order.orderNo}}</span>
            </div>
            <div class="line-info">
              <span>创建日期：{{order.createTime}}</span>
            </div>
            <template v-if="order.status==2 || order.status == 3 || order.status == 4">
           <!--  <template v-if="order.payChannel">
              <div class="seperator"></div>
              <div class="line-info top-border">
                <span>支付方式：</span><span>{{order.payChannel}}</span>
              </div>
            </template> -->
            <div class="line-info top-border">
              <span>支付时间：</span><span>{{order.createTime}}</span>
            </div>
            </template>
            <div class="seperator"></div>
            <div class="line-info top-border">
              <span>合计克重：</span><span class="float-right yellow-color">{{order.weigh}}</span>
            </div>
            <div class="line-info top-border">
              <span>运费：</span><span class="float-right yellow-color">{{order.expressFee}}元</span>
            </div>

            <template v-if="order.status == 3">
              <div class="seperator"></div>
              <div class="line-info top-border">
                <span>快递单号：</span>
                <span class="float-right yellow-color" @click="copyCode(order.expressNo)">{{order.expressNo}}</span>
              </div>
            </template>

            <template v-if="order.status==1">
            <div class="seperator"></div>
            <div class="line-info top-border text-right">
              <span>需付款：</span><span class="float-right yellow-color">{{order.expressFee}}元</span>
            </div>
            </template>

            <template v-if="order.status==2 || order.status == 3 || order.status == 4">
            <div class="seperator"></div>
            <div class="line-info top-border text-right">
              <span>实付款：</span><span class="float-right yellow-color">{{order.expressFee}}元</span>
            </div>
            </template>

            <div class="action clearfix">
              <p class="text-right" v-if="order.status == '1'">
                <span class="seperator"></span>
                <a href="javascript:;" class="btn" @click="cancelOrder(order.id);">取消提货</a>
                <a href="javascript:;" class="btn yellow-color" @click="payOrder(order);">提货</a>
              </p>
              <p class="text-right" v-if="order.status == '3'">
                <span class="seperator"></span>
                <!-- <a href="javascript:;" class="btn" @click="checkShip(order.id);">查看物流</a> -->
                <a href="javascript:;" class="btn yellow-color" @click="confirmOrder(order.id);">确认收货</a>
              </p>
              <p class="text-right" v-if="order.status == '4' || order.status == '5'">
                <span class="seperator"></span>
                <!-- <a href="javascript:;" class="btn" @click="deleteOrder(order.id);">删除订单</a> -->
                <!-- <a href="javascript:;" class="btn yellow-color" @click="purchaseAgain(order);">再次购买</a> -->
              </p>
            </div>

      		</li>
      	</ul>
      </div>
      <!-- 订单详情 -->
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
      order: {},
      current_order_type: 4,
      order_type_status: order_type_status
    };
  },
  computed: {
    id() {
      return this.$route.params.id || "";
    },
    // mall_token() {
    //   return utils.storageGet("mall_token");
    // },
    current_order_type_status() {
      var __tmp = this.order_type_status.filter(order_type => {
        return order_type.typeId == this.current_order_type;
      });
      return __tmp.length == 1 ? __tmp[0] : [];
    }
  },
  mounted() {
    // this.init();
  },
  filters: {
    renderStatus(order_status, current_order_type_status) {
      let __list = current_order_type_status.status.filter(status => {
          return status.statusKey == order_status;
        }),
        __statusName = "未知状态";

      if (__list && __list.length == 1) {
        __statusName = __list[0].statusName;
      }
      return __statusName;
    }
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
    payOrder: function(order) {
      var me = this;

      if(order.expressFee <= 0){
        utils.API.fund_pay({
          data: {
            "token": me.mall_token,
            "reqBody":{
              id:order.id,
              channel:"alipay",
            },
          }
        })
        .then(function(ret) {
           me.getOrderDetail(order.id, function(detail) {
            // _this.order = _.assign(_this.order, detail);
            Toast("提货申请成功，请耐心等待发货！");
          });
                  
        })
        .catch(function(ret) {
          !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        });

      }else{
        this.$router.push({ path: `/my/todo/paymenttype/${order.id}`});
      }
    },
    cancelOrder: function(order_id) {
      var _this = this;
      MessageBox({
        title: "",
        message: "确定取消提货吗？",
        showCancelButton: true
      }).then(function(action) {
        if (action === "confirm") {
          utils.API.delivery_cancel({
            //取消订单
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
              Toast("取消提货成功！");
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
    // purchaseAgain:function(order){

    // },
    goBack: function() {
      this.$router.goBack();
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";
.content {
  width: 100vw;
  height: 100vh;
  overflow: auto;
  // position: absolute;
  .order-list-wrap {
    // height: 100vh;
    overflow: auto;
    background: #fff;
    padding-bottom:1rem;
    .order-list {
      .order {
        margin-bottom: 0.2rem;
        .order-head {
          display: flex;
          align-items: center;
          height: 1.8rem;
          padding: 0.1rem 0.2rem;
          background: @font-color-yellow;
          p {
            color: #fff;
            font-size: 0.3rem;
            i {
              margin-right: 0.2rem;
            }
            b {
              font-size: 0.36rem;
            }
          }
        }
        .consignee-info {
          display: flex;
          justify-content: center;
          flex-direction: column;
          height: 1.8rem;
          padding: 0.1rem 0 0.1rem 1rem;
          background: #fff;
          .consignee {
            font-size: 0.3rem;
            color: #333;
          }
          .address {
            padding-left: 0.36rem;
            font-size: 0.26rem;
            color: #363636;
          }
        }
        .goods-list {
          .goods {
            border-top: 0.02rem solid #eee;
            padding: 0.3rem;
            display: flex;
            .goods-cover {
              width: 2rem;
              height: 2rem;
              display: block;
              box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);
            }
            .goods-info {
              width: 4.5rem;
              padding-left: 0.5rem;
              font-size: 0.26rem;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              .goods-name {
                margin-bottom: 0.2rem;
                overflow: hidden;
                display: -webkit-box;
                text-overflow: ellipsis;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                word-break: break-all;
                word-wrap: break-word;
              }
              p {
                // position: absolute;
                // bottom: 0;
                // left: 2.5rem;
                // right: 0;
              }
              .goods-price {
                color: @font-color-yellow;
              }
              .goods-number {
                float: right;
              }
            }
          }
        }
        .block{
          height:0.2rem;
          background:#f6f6f6;
          margin-bottom:0.2rem;
        }
        .line-info {
          padding: 0.1rem 0.3rem;
          background: #fff;
          span {
            &.yellow-color {
              color:@font-color-yellow;
            }
          }
        }
        .seperator {
          display:block;
          margin: 0.2rem 0;
          border: 0.02rem solid #f6f6f6;
        }
        .action {
          background: #fff;
          p {
            padding:0 0.2rem;
            font-size: 0.26rem;
          }
          .btn {
            display: inline-block;
            text-align: center;
            width: 1.8rem;
            height: 0.6rem;
            line-height: 0.6rem;
            margin-left: 0.3rem;
            color: @font-color-yellow;
            border: 1px solid @font-color-yellow;
            border-radius: 0.4rem;
            &.yellow-color {
              background-color: @font-color-yellow;
              color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>