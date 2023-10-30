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
      <!-- 1.存储中 2.已到期 3.提前结束 4.待付款 5.已取消（ecjia） 6.确认中 7.初始化(保留) -->
      <div class="order-list-wrap">
      	<ul class="order-list">
      		<li class="order">
      			<div class="order-head" v-if="order.status == 1 && order.remainDays!=undefined">
      				<p class="title"><i class="iconfont icon-tishi"></i> <b>存储期限： {{order.days}}天</b></p>
              <p class="subtitle"><span>剩余存储时间： {{order.remainDays}}天</span></p>
      			</div>
      			<div class="order-head" v-if="order.status == 2">
      				<p class="title"><i class="iconfont icon-wancheng"></i> <b>存储期限： {{order.days}}天</b></p>
              <p class="subtitle">
                <span >赠送到账： {{order.interest}}<span v-if="order.interestUnit==1">克</span><span v-else>元</span></span>
                <span class="look-more" @click="redirect('/my/account/balance')">查看</span>
              </p>
      			</div>
            <div class="order-head" v-if="order.status == 3">
              <p class="title"><i class="iconfont icon-tishi"></i> <b>提前结束</b></p>
              <p class="subtitle">
                <span>赠送克重到账： {{order.interest}}<span v-if="order.interestUnit==1">克</span><span v-else>元</span></span>
              </p>
            </div>
      			<div class="order-head" v-if="order.status == 4">
              <p class="title"><i class="iconfont icon-waiting"></i> <b>等待付款</b></p>
              <p class="subtitle"><span>剩余：{{remain_time}} 自动关闭</span></p>
      			</div>
            <div class="order-head" v-if="order.status == 5">
              <p class="title"><i class="iconfont icon-tishi"></i> <b>已取消</b></p>
              <p class="subtitle"><span>感谢您使用黄金象，欢迎下次光临！</span></p>
            </div>
            <div class="order-head" v-if="order.status == 6">
              <p class="title"><i class="iconfont icon-tishi"></i> <b>确认中</b></p>
            </div>
            <ul class="goods-list">
              <li class="goods clearfix" v-for="goods in order.details" :key="goods.goodsId">
                <img :src="goods.url" alt="" class="goods-cover">
                <div class="goods-info">
                  <h1 class="goods-name"> {{goods.goodsName}} </h1>
                  <p>
                    <!-- <span class="goods-price"> {{goods.weigh}}克 </span> -->
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
              <span>创建日期：{{order.rawInfo.formatedAddTime || order.createTime}}</span>
            </div>
            <template v-if="order.status == '1'">
            <div class="seperator"></div>
            <div class="line-info top-border">
              <span>开始生效时间：</span><span>{{order.calInterestStartTime}}</span>
            </div>
            </template>
            <template v-if="order.status == '2'">
            <div class="seperator"></div>
            <div class="line-info top-border">
              <span>开始生效时间：</span><span>{{order.calInterestStartTime}}</span>
            </div>
            <div class="line-info top-border">
              <span>存储到期时间：</span><span>{{order.calInterestStopTime}}</span>
            </div>
            </template>
            <template v-if="order.status == '4'">
            <div class="seperator"></div>
            <div class="line-info top-border">
              <span>存储期限：</span><span>{{order.days}}天</span>
            </div>
            </template>
            <!-- <template v-if="order.status == 4">
              <div class="seperator"></div>
              <div class="line-info top-border">
                <span>商品总额：</span><span class="float-right yellow-color">{{order.rawInfo.formatedTotalFee}}</span>
              </div>
            </template> -->
            <div class="seperator"></div>
            <div class="line-info top-border">
              <span>合计克重：</span><span class="float-right yellow-color">{{order.weigh}}</span>
            </div>
            <div class="action clearfix">
              <p class="total" v-if="order.status == 1">
                <span class="seperator"></span>
                <select v-model="order.willDo" @change="selectWillDo(order.willDo,order.id)">
                  <!-- 1.代存 2.寄存 3.回购 -->
                  <option value="1">到期后自动转为待办</option>
                  <!-- <option value="2">到期后自动续期</option> -->
                  <!-- <option value="3">到期后自动回购</option> -->
                </select>
                <i class="float-right iconfont icon-more"></i>
              </p>
              <p class="text-right" v-if="order.status == 4">
                <span class="seperator"></span>
                <a href="javascript:;" class="btn" @click="cancelOrder(order);">取消订单</a>
                <a href="javascript:;" class="btn yellow-color" @click="payOrder(order.rawInfo.orderId);">立即付款</a>
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
      order: {
        rawInfo:{},
      },
      current_order_type: 2,
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
    }
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
    payOrder: function(order_id) {
      this.$router.push({ path: `/order/${order_id}/paymenttype` });
    },
    cancelOrder: function(order) {
      var _this = this;
      MessageBox({
        title: "",
        message: "确定取消此订单吗？",
        showCancelButton: true
      }).then(function(action) {
        if (action === "confirm") {
          utils.API.order_cancel({
            //取消订单
            data: {
              token: _this.mall_token,
              order_id: order.rawInfo.orderId
            }
          })
            .then(function(ret) {
              // Toast("取消订单成功！");
              // setTimeout(function(){
              //   window.location.reload();
              // },2000);
              

              _this.getOrderDetail(order.id, function(detail) {
                // _this.order = _.assign(_this.order, detail);
                Toast("取消订单成功！");
              });
            })
            .catch(function(ret) {
              !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
            });
        } else {
        }
      });
    },
    countTime:function(add_time){
      var _this = this,
          add_time = (add_time+28800)*1000,
          expire_time = add_time + 3600000,
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
            _this.getOrderDetail(_this.id);
          }
        });
      }else{
        _this.remain_time = "已过期";
      }
    },

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
    selectWillDo:function(value,order_id,cb){//设置到期后自动转为什么
      var me = this,
          data = {
            id:order_id,
            willDo:value,
          };
      
      utils.API.deposit_update({
        data: {
          token: me.mall_token,
          "reqBody":data,
        }
      })
      .then(function(ret) {
        
        me.getOrderDetail(order_id,function(detail){
          Toast("设置成功！");
          // me.order = _.assign({},detail);
        });
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
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
          flex-direction: column;
          justify-content: center;
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
          .subtitle{
            padding-left:0.6rem;
            .look-more {
              margin-left:1rem;
              height:0.34rem;
              line-height:0.34rem;
              border:1px solid #ffffff;
              padding:0 0.25rem;
              border-radius: 0.5rem;
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
          height: 0.2rem;
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
            padding: 0 0.2rem;
            font-size: 0.26rem;
            select {
              width: 90%;
              background: #ffffff;
              border: none;
              font-weight: bold;
            }
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