<template>
  <div>
    <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">赠送克重明细</div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->



    <div class="my-interest-wrap">
      <div class="top-blank"></div>

      <ul class="interest-list-wrap">
        <!-- //4：入账,8：出账 -->
        <li class="interest-cell" v-for="interest in interest_list">
          <div class="interest-cell-title">
            <span v-if="interest.type== 4" class="title">存储{{metal_type[interest.productName]}}{{interest.days}}天</span>
            <span v-if="interest.type== 8" class="title">转入账户</span>
            <span class="time">{{interest.createTime}}</span>
          </div>
          <div class="interest-cell-amount">
            <span class="remain">余额(克)：{{interest.balance.toFixed(4)}}</span>
            <span class="amount" v-if="interest.type== 4">+{{interest.value.toFixed(4)}}</span>
            <span class="amount" v-if="interest.type== 8">-{{interest.value.toFixed(4)}}</span>
          </div>
        </li>
      </ul>
      
      <div class="tip" @click="clickMore">{{tip}}</div>
      <div class="zhanwei"></div>
  	</div>
    
  </div>
</template>

<script>
import topHead from "@/views/components/TopHead.vue";
import constants from "@/assets/js/constants.js";

import {
	Toast,
} from 'mint-ui';

export default {
	components:{
    topHead:topHead,
	},
	data(){
	  return {
      mall_token:"",
	  	tip:"没有更多啦~",
      interest_list:[],
      metal_type:constants.METAL_TYPE,

      "page_size" : 20,
      "page" : 1,
		}	
	},
  computed: {
    // mall_token(){
    //   return utils.storageGet("mall_token");
    // },
    // mall_uid(){
    //   return utils.storageGet("mall_uid");
    // },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.init();
    })
  },
	mounted(){
    // this.init();
	},
	methods:{
    init:function(){
      this.mall_token = utils.storageGet("mall_token");
      this.getInterestList(1);
    },
    getInterestList:function(page){
      var me = this;

      utils.API.interestFlow_list({
        data: {
          "token": me.mall_token,
          "reqBody":{
            types:[4,8],
            pageId: page, //{number} 当前页，page为空返回全部列表
            pageSize: me.page_size //{number} 每页显示条数
          }
        }
      })
      .then(function(ret) {
        me.interest_list = ret.model.items;

        if(ret.model.pageSum > ret.model.pageId){//还有翻页
          me.page = ret.model.pageId + 1;
          me.tip = "-点击加载更多-";
        }else{//没有翻页
          me.tip = "-没有更多明细了-";
        }
        
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    clickMore:function(){
      // var select_balance_type = this.select_balance_type=="-1"?"":this.select_balance_type;
      this.getInterestList(this.page);
    },
	  goBack:function(){
			this.$router.goBack();
		},
	}
};

</script>

<style lang="less" scoped>
  @import "./Interest.less";
</style>