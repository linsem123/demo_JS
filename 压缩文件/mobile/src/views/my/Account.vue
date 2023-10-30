<template>
  <div>
    <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">我的账户</div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->

    <div class="mall-my-account">
      <div class="top-blank"></div>
      
      <!-- 我的信息 -->
      <div class="my-info-wrap">
        <div class="my-info-line">
          <span class="my-info-left">我的账户</span>
          <span class="my-info-right" @click="redirect('/my/account/balance')">收支明细</span>
        </div>
        <div class="my-info-line">
          <span class="my-info-left account">{{user_info.user_money}}</span>
        </div>
        <div class="my-info-line btn-line">
          <a class="my-info-btn left-btn" @click="redirect('/my/account/recharge','click_my_myAccount_topup')">充值</a>
          <a class="my-info-btn right-btn" @click="redirect('/my/account/withdraw','click_my_myAccount_withdraw')">提现</a>
        </div>
      </div>
      <!-- 我的信息 -->

      <!-- 赠送克重 -->
      <!-- <div class="interest-wrap">
        <h4 class="interest-title" @click="redirect('/my/account/interest')">赠送克重明细</h4>
        <div class="interest-line" v-for="interest in interest_list">
          <p class="interest-name">赠送{{metal_type[interest.productName]}}(克)：<span class="interest-value">{{interest.value}}</span></p>
          <p class="interest-btn-wrap">
            <a class="interest-btn" @click="transferToAccount(interest)">转入账户</a>
            <span class="iconfont icon-wenhao" @click="showTip"></span>
          </p>
        </div>
      </div> -->
      <!-- 赠送克重 -->


      <div class="zhanwei"></div>
  	</div>
    
  </div>
</template>

<script>
import topHead from "@/views/components/TopHead.vue";
// import constants from "@/assets/js/constants.js";

import {
	Toast,
	MessageBox
} from 'mint-ui';

export default {
	components:{
    topHead:topHead,
	},
	data(){
	  return {
	  	user_info: {},
      interest_list:[],
      // metal_type:constants.METAL_TYPE,
      mall_token:"",
		}	
	},
  computed: {
    // mall_token(){
    //   return utils.storageGet("mall_token");
    // },
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
      
      this.getUserInfo();
      this.getInterestList();
    },
    getUserInfo: function() {
      var _this = this;
      utils.API.user_info({
        data: {
          token: _this.mall_token,
        }
      })
      .then(function(ret) {
        _this.user_info = _.assign({}, _this.user_info, ret.model.data);
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    getInterestList:function(){
      var me = this;

      utils.API.interest_list({
        data: {
          "token": me.mall_token,
          "reqBody":{}
        }
      })
      .then(function(ret) {
        me.interest_list = ret.model.items;
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    // transferToAccount:function(interest){
    //   var me = this,
    //       type = this.metal_type[interest.productName],
    //       value = interest.value;
      
    //   if(value <= 0){
    //     Toast("您还没有赠送的克重！");
    //     return;
    //   }

    //   MessageBox({
    //     title: "",
    //     message: `确定将赠送${type}${value}(克)全部转入账户吗？`,
    //     showCancelButton: true
    //   }).then(function(action) {
    //     if (action === "confirm") {
    //       utils.API.interest_buyback({
    //         data: {
    //           "token": me.mall_token,
    //           "reqBody":{
    //             "productName":interest.productName,
    //           }
    //         }
    //       })
    //       .then(function(ret) {
    //         Toast("转入成功！");
    //         me.getInterestList();
    //         me.getUserInfo();
    //       })
    //       .catch(function(ret) {
    //         !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    //       });
    //     } else {

    //     }
    //   });
    // },



    showTip:function(){
      MessageBox({
        title: '',
        message: '转入账户金额 = 克重*（ 当日金价 - 回购手续费 ）',
        showCancelButton: false,
      });
    },
	  goBack:function(){
			this.$router.goBack();
		},
    redirect: function(url){
      this.$router.push({path: url})
    }.after(function(url,event_name){
      if(event_name){
        utils.trackEvent(event_name);
      }
    }),
	}
};

</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";

.mall-my-account{
	width: 100vw;
  height: 100vh;
  overflow-y: auto;
  // position: absolute;
  padding:0 0.3rem;
  box-sizing: border-box;
  background:#ffffff;

  .my-info-wrap {
    padding:0.45rem;
    background:#ffc20a;
    border-radius: 0.2rem;
    margin-top:0.3rem;
    .my-info-line {
      margin-bottom:0.3rem;
      display: flex;
      justify-content: space-between;
      &:last-child {
        margin-bottom:0;
      }
      &.btn-line {
        margin-top:0.65rem;
      }
      .my-info-left {
        font-size:0.28rem;
        font-weight:bold;
        &.account {
          font-size:0.42rem;
        }
      }
      .my-info-right {
        font-size:0.26rem;
      }
      .my-info-btn {
        padding:0.15rem 0.6rem;
        font-size:0.28rem;
        line-height:0.28rem;
        border-radius: 0.5rem;
        &.left-btn {
          border:1px solid @font-color;
        }
        &.right-btn {
          background:#ffffff;
          border:1px solid #ffffff;
          color:#444444;
        }
      }
    }
  }

  .interest-wrap {
    padding:0.45rem;
    background:#ffffff;
    margin-top:0.3rem;
    border-radius: 0.2rem;
    box-shadow: 0px 0px 5px rgba(0,0,0,0.2);
    .interest-title {
      font-size:0.26rem;
      color:@font-gray-color;
      text-align:right;
      font-weight:normal;
      margin-bottom:0.2rem;
    }
    .interest-line {
      padding:0.2rem 0;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      .interest-name {
        font-size:0.28rem;
        .interest-value {
          font-size:0.36rem;
        }
      }
      .interest-btn-wrap {
        .interest-btn {
          padding:0.15rem 0.3rem;
          font-size:0.28rem;
          line-height:0.28rem;
          border:1px solid @font-color;
          border-radius: 0.1rem;
        }
        .iconfont {
          font-size:0.36rem;
          margin-left:0.1rem;
        }
      }
    }
  }

  .zhanwei {
    height:1.2rem;
  }
}

</style>