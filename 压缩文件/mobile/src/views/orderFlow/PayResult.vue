<template>
	<div class="mall-pay-final">

		

    <div v-show="order_success&&has_check" class="success-tip chenggong">
      <span class="iconfont icon-chenggong"></span>
      <h4 class="tip-text">支付成功!</h4>
    </div>

    <p v-show="order_success&&has_check" class="tip">实付:{{detail.formated_total_fee}}</p>

    <div v-show="!order_success&&has_check" class="success-tip shibai">
      <span class="iconfont icon-shibai"></span>
      <h4 class="tip-text">支付失败!</h4>
    </div>

    <div v-show="!order_success" class="error-tip">
      <h4 class="tip-text">如支付失败请返回订单页面重新支付</h4>
    </div>
    
  
    <div class="btn-wrap">
      <a v-show="!order_success" class="bottom-btn default" href="javascript:;" @click="back('mall_my_order')">支付失败</a>
      <a v-show="!order_success&&!has_check" class="bottom-btn warning" href="javascript:;" @click="checkOrder()">支付成功</a>

      <a v-show="order_success&&has_check" class="bottom-btn default" href="javascript:;" @click="back('home')">返回首页</a>
      <a v-show="order_success&&has_check" class="bottom-btn warning" href="javascript:;" @click="back('mall_my_order')">查看订单</a>
    </div>
    
	</div>
</template>

<script>
import { Toast } from "mint-ui";

export default {
  components: {},
  data() {
    return {
      mall_token:"",
      // referrer:"",
      detail:{},
      order_success: false,
      has_check: false
    };
  },
  computed: {
    order_id() {
      return this.$route.params.order_id;
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
      // 通过 `vm` 访问组件实例
      vm.init();
    })
  },
  methods: {
    init: function() {
      this.mall_token = utils.storageGet("mall_token");
      this.order_success = false;
      this.has_check = false;
      this.getOrderDetail();
    },
    back: function(str) {
      switch (str) {
        case "mall_my_order":
          this.$router.replace({ path: `/my/orders` });
          break;
        case "home":
          this.$router.replace({ path: `/` });
          break;
      }
    },
    checkOrder: function() {
      var _this = this;

      this.getOrderDetail(function(detail) {
        if (detail.pay_status == 2) {
          //>0证明付款成功
          _this.order_success = true;
        } else {
          _this.order_success = false;
        }
        _this.has_check = true;
      });
    },
    getOrderDetail: function(cb) {
      var _this = this;
      utils.API.order_detail({
        //订单详情
        data: {
          token: _this.mall_token,
          order_id: _this.order_id
        }
      })
      .then(function(ret) {
        _this.detail = ret.model.data;
        cb && cb(ret.model.data);
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";

.mall-pay-final {
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: start;
  flex-direction: column;
  margin-top:3rem;
  .tip {
    text-align: center;
    font-size:0.28rem;
  }

  .success-tip {
    font-size: 0.4rem;
    text-align: center;
    display: flex;
    align-items: center;
    margin-bottom:0.2rem;
    &.chenggong {
      .iconfont {
        color:@yellow;
      }
    }
    &.shibai {
      .iconfont {
        color:#f55b64;
      }
    }
    .iconfont {
      font-size: 0.5rem;
      margin-right: 0.2rem;
    }
    .tip-text {
      font-size: 0.4rem;
    }
  }
  .error-tip {
    font-size: 0.3rem;
    text-align: center;
    .tip-text {
    }
  }
  .btn-wrap {
    text-align: center;
    margin-top: 0.5rem;
    .bottom-btn {
      display: inline-block;
      text-align: center;
      line-height: 0.28rem;
      font-size: 0.28rem;
      padding:0.14rem 0.35rem;
      margin: 0 0.2rem;
      border-radius: 0.5rem;
      font-weight: bold;
      &.default {
        color: @yellow;
        border: 1px solid @yellow;
        background: #ffffff;
      }
      &.warning {
        color: #ffffff;
        background: @yellow;
        border: 1px solid @yellow;
      }
    }
  }
}
</style>