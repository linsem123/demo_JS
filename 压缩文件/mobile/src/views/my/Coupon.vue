<template>
  <div>
    <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">我的优惠券</div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->

	  <div class="my-coupons">
	    <div class="top-blank"></div>


	    <ul class="coupon-nav">
    		<li class="coupon-nav-item" :class="{active:active=='available'}" @click="changeNav('available')">未使用</li>
    		<li class="coupon-nav-item" :class="{active:active=='used'}" @click="changeNav('used')">已使用</li>
    		<li class="coupon-nav-item" :class="{active:active=='expired'}" @click="changeNav('expired')">已过期</li>
    	</ul>

    	<div class="coupon-list-wrap">
    		
    		<mt-loadmore style="min-height:calc(100vh - 1.7rem);" :top-method="loadTop" :auto-fill="true" ref="loadmore">

	    		<ul class="coupon-list" v-if="active=='available'">
	    			<li class="coupon-list-cell" v-for="coupon in my_coupon.available">
	    				<coupon-cell
	    					:coupon="coupon"
	    					:disable="false"
	    					:status_type="'available'"
	    				></coupon-cell>
	    			</li>
	    			<div class="coupon-list-tip" @click="addMore('available')">{{coupon_option.available.tip}}</div>
	    		</ul>

	    		<ul class="coupon-list" v-if="active=='used'">
	    			<li class="coupon-list-cell" v-for="coupon in my_coupon.used">
	    				<coupon-cell
	    					:coupon="coupon"
	    					:disable="true"
	    					:status_type="'used'"
	    				></coupon-cell>
	    			</li>
	    			<div class="coupon-list-tip" @click="addMore('used')">{{coupon_option.used.tip}}</div>
	    		</ul>

	    		<ul class="coupon-list" v-if="active=='expired'">
	    			<li class="coupon-list-cell" v-for="coupon in my_coupon.expired">
	    				<coupon-cell
	    					:coupon="coupon"
	    					:disable="true"
	    					:status_type="'expired'"
	    				></coupon-cell>
	    			</li>
	    			<div class="coupon-list-tip" @click="addMore('expired')">{{coupon_option.expired.tip}}</div>
	    		</ul>	

	    		<div class="zhanwei"></div>
    		</mt-loadmore>
    	</div>
	  </div>
  </div>
</template>

<script>
import topHead from "@/views/components/TopHead.vue";
import couponCell from "@/views/components/CouponCell.vue";

import {
	Toast,
	Loadmore,
} from 'mint-ui';

export default {
	components: {
		topHead:topHead,
		couponCell:couponCell,
		mtLoadmore:Loadmore,
	},
	data() {
		return {
			mall_token:"",
			my_coupon:{
				available:[],
				used:[],
				expired:[],
			},

			active:"available",

			coupon_option:{
				available:{
					status_type: "notused",//notused：未使用；used：已使用；notexpired：未过期；expired：已过期；notbegin：未开始
					page: 0,
					total:0,
					pageSize: 20,
					tip:"",
				},
				used:{
					status_type: "used",
					page: 0,
					total:0,
					pageSize: 20,
					tip:"",
				},
				expired:{
					status_type: "expired",
					page: 0,
					total:0,
					pageSize: 20,
					tip:"",
				},
			},
		}
	},
	computed:{
		// mall_token(){
  //     return utils.storageGet("mall_token")
  //   },
	},
	mounted() {
		// this.init();
	},
	beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.init();
      // access to component instance via `vm`
    })
  },
	methods: {
		init:function(){
			this.mall_token = utils.storageGet("mall_token");
			this.getCouponTypeList("available");
		},
		goBack: function() {
			this.$router.goBack();
		},
		changeNav:function(key){
			if(this.active == key){
				return;
			}
			this.active = key;
			this.getCouponTypeList(key);
		},
		addMore:function(key){
			this.getCouponTypeList(key);
		},
		getCouponTypeList:function(key) {
			// if(this.coupon_option[key].page > 0 && this.coupon_option[key].page >= this.coupon_option[key].total){
			// 	return;
			// }
			var me = this,
					option = {
						status_type: me.coupon_option[key].status_type,
						page: me.coupon_option[key].page,
						pageSize: me.coupon_option[key].pageSize,
					};
			this.getCouponList(option,function(model){

				me.my_coupon[key] = model.data;

				if(model.paginated.count == 0){
					me.coupon_option[key].tip = "-没有更多啦-";
				}else if(model.paginated.more == 0){
					me.coupon_option[key].page = me.coupon_option[key].page+1;
					me.coupon_option[key].total = model.paginated.total;
					me.coupon_option[key].tip = "-没有更多啦-";
				}else{
					me.coupon_option[key].page = me.coupon_option[key].page+1;
					me.coupon_option[key].total = model.paginated.total;
					me.coupon_option[key].tip = "-点击加载更多-";
				}
				
			});
		},
		getCouponList:function(option,cb){
			var me = this;

			utils.API.bonus_list({
				data: {
					token: me.mall_token,
					bonus_type: option.status_type,//notused：未使用；used：已使用；notexpired：未过期；expired：已过期；notbegin：未开始
					pagination:{
					  "count":option.pageSize,
					  "page":option.page,
					},
				}
			})
			.then(function(ret) {
				cb&&cb(ret.model);
				me.$refs.loadmore&&me.$refs.loadmore.onTopLoaded();
			})
			.catch(function(ret) {
				!ret.__servererror__ && Toast(ret.errorMessage || "未知错误！！！！");
				me.$refs.loadmore&&me.$refs.loadmore.onTopLoaded();
			});
		},
		loadTop:function(){
    	this.getCouponTypeList(this.active);
    },
	}
};

</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";

.my-coupons{
	background-color: @base-bg-color;
	// position: fixed;

	.coupon-nav {
		background:#ffffff;
		display: flex;
    justify-content: space-between;
    padding: 0 0.65rem;
		.coupon-nav-item {
			height: 1rem;
			line-height: 1rem;
			font-size: 0.32rem;
			position: relative;
			&.active {
				color:@yellow;
				&:after {
					content: "";
					position:absolute;
					width: 0.6rem;
					height: 0.06rem;
					background:@yellow;
			    bottom: 0;
    			left: 50%;
    			margin-left: -0.3rem;
				}
			}
		}
	}
	.coupon-list-wrap {
		margin: 0.15rem 0;
		padding:0 0.3rem;
		width: 100vw;
		height: 100vh;
		overflow-y: auto;
		box-sizing: border-box;
		.coupon-list {
			.coupon-list-cell {
				margin-top: 0.28rem;
				&:first-child {
					margin-top: 0.2rem;
				}
			}
			.coupon-list-tip {
				margin-top: 0.2rem;
				padding:0.25rem 0;
				text-align: center;
			}
		}
	}

	.zhanwei {
		height:3rem;
	}
}

</style>