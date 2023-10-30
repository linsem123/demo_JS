<template>
  <div>
    <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">
        <select class="balance-title" v-model="select_balance_type" @change="changeBalanceType">
          <option :value="type.value" v-for="type in balance_type">{{type.title}}</option>
        </select>
      </div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->



    <div class="my-balance-wrap">
      <div class="top-blank"></div>

      <ul class="balance-list-wrap">
        <li class="balance-cell" v-for="balance in balance_list">
          <div class="balance-cell-title">
            <span class="title">{{balance.type_lable}}</span>
            <span class="time">{{balance.add_time}}</span>
          </div>
          <div class="balance-cell-amount">
            <span class="status">{{balance.pay_status}}</span>
            <span class="amount">{{balance.amount}}</span>
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
      select_balance_type:"-1",
      balance_list:[],
      balance_type:[
        {
          value:"-1",
          title:"收支明细",
        },
        {
          value:"raply",
          title:"提现",
        },
        {
          value:"deposit",
          title:"充值",
        }
      ],
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
    init:function(){
      this.mall_token = utils.storageGet("mall_token");
      
      this.getBalanceList(1,"");
    },
    getBalanceList:function(page,type){
      var me = this;
      
      utils.API.user_account_record({
        data: {
          "token" : me.mall_token,
          "pagination" : {
            "count" : me.page_size,
            "page" : page,
          },
          "type":type,
        }
      })
      .then(function(ret) {
        me.balance_list = ret.model.data;

        if(ret.model.paginated.more != 0){//还有翻页
          me.page += 1;
          me.tip = "-点击加载更多-";
        }else{//没有翻页
          me.tip = "-没有更多明细了-";
        }
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    changeBalanceType:function(){
      var select_balance_type = this.select_balance_type=="-1"?"":this.select_balance_type;
      this.getBalanceList(1,select_balance_type);
    },
    clickMore:function(){
      var select_balance_type = this.select_balance_type=="-1"?"":this.select_balance_type;
      this.getBalanceList(this.page,select_balance_type);
    },
	  goBack:function(){
			this.$router.goBack();
		},
	}
};

</script>

<style lang="less" scoped>
  @import "./Balance.less";
</style>