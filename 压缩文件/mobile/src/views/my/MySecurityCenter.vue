<template>
	<div>
    <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">安全中心</div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->
		
		<div class="setting-wrap">
			<div class="top-blank"></div>

			<ul class="setting-item-wrap">
				<li class="setting-item-cell" @click="redirect('/reset_login_password')">
					<div class="item-left">重置登录密码</div>
					<div class="item-right">
						<span class="iconfont icon-more"></span>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>



<script>

// import appconfig from "@/config/appconfig.js";
import topHead from "@/views/components/TopHead.vue";

import {
	Toast,
	MessageBox
} from 'mint-ui';

// utils.extendApi(API);//把API扩充到utils方法里边

export default {
	components:{
		topHead:topHead,
	},
	data(){
		return {
			// cache:"",
			// version:appconfig.VERSION,
		}
	},
	computed:{
		// guest_phone(){
  //     return this.$store.getters.getGuestPhone;
  //   },
	},
	// beforeRouteEnter (to, from, next) {
	//   next(vm => {
	//     // 通过 `vm` 访问组件实例
	//   })
	// },
	mounted(){
		this.init();
	},
	methods:{
		init:function(){
			this.cache = Math.round(Math.random()*9+1)/10;
			utils.storageSet("key",this.version);
		},
		goBack:function(){
			this.$router.goBack();
		},
    redirect: function(url){
      this.$router.push({path: url})
    }
	}
};
</script>


<style lang="less" scoped>
@import "~@/assets/less/variable.less";

.setting-wrap{
	background-color: @base-bg-color;
	width: 100vw;
	height: 100vh;
	overflow-y: auto;
	// position: absolute;

	.setting-item-wrap{
		background-color: #fff;
		margin: 0.2rem 0;
		padding:0 0 0 0.35rem;
		.setting-item-cell {
			height: 1.1rem;
			line-height: 1.1rem;
			display: flex;
			padding-right: 0.35rem;
			justify-content: space-between;
			border-bottom: 1px solid @border-color;
			&:last-child {
				border-bottom:none;
			}
			.item-left {
				font-size: 0.3rem;
			}
			.item-right {
				font-size: 0.3rem;
				color:@font-gray-color;
				display: flex;
				align-items: center;
				.telephone {
					color:@font-gray-color;
				}
				.iconfont {
					margin-left: 0.05rem;
				}
			}
		}
	}

	.setting-btn-wrap {
		margin-top: 1.1rem;
		padding: 0 0.35rem;
		.setting-btn {
			display:block;
			text-align: center;
			height: 1rem;
			line-height: 1rem;
			background:@red;
			color:#ffffff;
			font-size: 0.36rem;
			font-weight: bold;
			border-radius: 0.5rem;
		}
	}
}
</style>