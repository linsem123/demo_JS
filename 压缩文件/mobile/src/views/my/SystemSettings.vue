<template>
	<div>
    <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">设置</div>
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
				<li class="setting-item-cell" @click="clearCache();">
					<div class="item-left">清除缓存</div>
					<div class="item-right">
						{{ cache }} M
						<span class="iconfont icon-more"></span>
					</div>
				</li>
				<li class="setting-item-cell">
					<div class="item-left">当前版本</div>
					<div class="item-right">
						{{ version }}
						<!-- <span class="iconfont icon-more"></span> -->
					</div>
				</li>
				<li class="setting-item-cell">
					<div class="item-left">客服专线</div>
					<div class="item-right">
						<a class="telephone" :href="'tel:'+guest_phone">{{guest_phone}}</a>
						<span class="iconfont icon-more"></span>
					</div>
				</li>
				<li class="setting-item-cell" @click="redirect('/my/systemsettings/about')">
					<div class="item-left">关于黄金象</div>
					<div class="item-right">
						<span class="iconfont icon-more"></span>
					</div>
				</li>
			</ul>

			<div class="setting-btn-wrap">
				<a class="setting-btn" href="javascript:void(0);" @click="quit">安全退出</a>
			</div>
		</div>
	</div>
</template>



<script>

import appconfig from "@/config/appconfig.js";
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
			mall_token:"",
			cache:"",
			version:appconfig.VERSION,
		}
	},
	computed:{
		guest_phone(){
      return this.$store.getters.getGuestPhone;
    },
    // mall_token(){
    //   return utils.storageGet("mall_token");
    // },
	},
	// beforeRouteEnter (to, from, next) {
	//   next(vm => {
	//     // 通过 `vm` 访问组件实例
	//   })
	// },
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
			
			this.cache = Math.round(Math.random()*9+1)/10;
			utils.storageSet("key",this.version);
		},
		goBack:function(){
			this.$router.goBack();
		},
		about:function(){
			this.$router.push({path: "/my/systemsettings/about" })
		},
    clearCache:function(){
    	var me=this;
     	var success = function(status) {
						me.cache="0";
							Toast("清除缓存成功");
						};
						var error = function(status) {
							Toast("清除缓存失败");
						};
     	window.CacheClear(success, error);
		}.after(function(){
			utils.trackEvent('my_settings_clearcache',{
			   user_id:utils.storageGet("dealer_id"),
			});
    }),
    quit:function(){
			var me = this,
					tip = "您即将退出此应用";
			MessageBox({
				  title: '',
				  message:tip,
				  showCancelButton: true
			})
			.then(function(action){
				if(action === "confirm"){

					utils.API.user_signout({
		        data: {
		        	token:me.mall_token,
		        }
		      });

		      setTimeout(function(){
        		utils.storageClear();
						me.$router.replace({path: `/` });
        	},500);
	        
				}else{
				}
			});
		}.after(function(){
			utils.trackEvent('click_my_settings_exitButton',{
			   user_id:utils.storageGet("dealer_id"),
			});
    }),
    redirect: function(url,event_name){
      this.$router.push({path: url})
    },
	}
};
</script>


<style lang="less" scoped>
@import "~@/assets/less/variable.less";

.setting-wrap{
	background:#ffffff;
	width: 100vw;
	height: 100vh;
	overflow-y: auto;
	// position: fixed;

	.setting-item-wrap{
		background-color: #fff;
		padding:0 0.34rem;
		.setting-item-cell {
			height: 1.2rem;
			line-height: 1.2rem;
			display: flex;
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
			background:@yellow;
			color:#ffffff;
			font-size: 0.36rem;
			font-weight: bold;
			border-radius: 0.5rem;
		}
	}
}
</style>