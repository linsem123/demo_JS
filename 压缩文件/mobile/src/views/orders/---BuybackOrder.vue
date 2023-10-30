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
              <p>{{order.status | renderStatus(current_order_type_status) }}</p>
      				<p><i class="iconfont icon-suoding"></i>回购时锁定金价：<b>{{order.unitPrice}}</b> 元/克</p>
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
              <span>回购日期：{{order.createTime}}</span>
            </div>
            <div class="seperator"></div>
            <div class="line-info top-border">
              <span>合计克重：</span><span class="float-right yellow-color">{{order.weigh}}</span>
            </div>
            <div v-if="order.buybackFee" class="line-info">
              <span>回购手续费：</span><span class="float-right yellow-color">￥{{order.buybackFee}}</span>
            </div>
            <div class="line-info">
              <span>合计回购金额：</span><span class="float-right yellow-color">{{order.amount}}</span>
            </div>
            <div class="action">
              <p v-if="order.status == '1'" class="text-right">
                <a class="btn cancel" href="javascript:;" @click="cancelOrder(order.id)">取消回购</a>
                <a class="btn confirm yellow-color" href="javascript:;" @click="confirmOrder(order.id)">确认回购</a>
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
      order_type_status: order_type_status,
      current_order_type:3,//回购==3

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
    current_order_type_status() {
      var tmp = this.order_type_status.filter(order_type => {
        return order_type.typeId == this.current_order_type;
      });
      return tmp.length == 1 ? tmp[0] : [];
    },
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
    renderStatus(order_status, current_order_type_status){
      let __list = current_order_type_status.status.filter( status => {
        return status.statusKey == order_status
      }), __statusName = '未知状态';

      if(__list && __list.length == 1){
        __statusName = __list[0].statusName
      }
      return __statusName;
    }
  },
  methods: {
    init(){
      this.mall_token = utils.storageGet("mall_token");
      this.getOrderDetail(this.id);
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
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";
.content {
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
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
          // align-items: center;
          height: 1.8rem;
          padding: 0.1rem 0.2rem;
          background: @font-color-yellow;
          flex-direction: column;
          justify-content: center;
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

        .goods-list {
          background: #fff;
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
          margin: 0.2rem 0;
          border: 0.02rem solid #f6f6f6;
        }
        .action {
          background: #fff;
          p {
            padding: 0.2rem;
            border-top: 0.02rem solid #eee;
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