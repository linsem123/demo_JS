<template>
	<div>
		<!-- 头部 -->
    <top-head
    	@go-back="goBack()"
      :show_back="true">
      <div slot="left"></div>
      <div slot="main">详情</div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->

		<div class="node-wrap">
			<div class="top-blank"></div>

			<div class="node_content">
				<div class="sub-content">
					<div class="title">{{detail.title}}</div>
					<div class="date" v-html= "detail.date" v-show="detail.date"></div>
					<div class="content" v-html= "detail.content" ></div>
				</div>
			</div>
		</div>
		
	</div>
</template>

<script>
import appconfig from "@/config/appconfig.js";
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
				detail:{
					title:"",
					date:"",
					content:'',
				}
			}	
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
			this.detail = _.assign(this.detail,{
					title:"",
					date:"",
					content:'',
				})
			this.getDetail();
		},
		goBack:function(){
			this.$router.goBack();
		},
		// 首页 四个 小导航
		getDetail:function(){
			var me = this;
			var nid = me.$route.params.nid;

			utils.API.cmsservice_node({
				method:"get",
				data:{
					filter: nid
				}
			})
			.then(function (ret) {
				me.$nextTick(function(){
					// console.log(ret)
					var reg = /\"+?\/(.+)((\.jpg)|(\.png))\"/gi,
							content = ret.model[0].body.replace(reg,"\""+appconfig.cmsbaseurl+"/"+"$1$2"+"\"");

					me.detail = _.assign({},{
						title:ret.model[0].title,
						date:ret.model[0].pubtime,
						content:content,
					});

			 	})
			})
			.catch(function(ret){
				!ret.__servererror__ && Toast(ret.errorMessage||"未知错误！");
			});
		}
	}

};
</script>
<style lang="less" scoped>

.node-wrap{
	// position: absolute;
	width:100vw;
	height: 100vh;
	overflow-y: auto;
	background:#ffffff;
	.sub-content {
		padding:0;
	}
}

</style>