<template>
  <div class="mall_accessory">


		<!-- 搜索 start -->
		<div class="search-wrap">
			<input class="search-input" type="text" name="" v-model="search_val" />
			<span class="iconfont icon-search" @click="search()"></span>
		</div>
		<!-- 搜索 start -->

		<!-- 分类 start -->
		<ul class="category-list">
			<li class="category-cell" :class="{ active:( category_id == item.id) }" v-for="item in goods_category" @click="switchCategory(item.id)">
				<p class="category-cell-text">{{item.name}}</p>
			</li>
		</ul>
		<!-- 分类 start -->

		<!-- 分类内容 start -->
		<div class="category-content clearfix">
			<div class="top-blank"></div>

			<!-- 广告位 -->
      <ul class="advertisement-wrap" v-if="advertisements.length">
        <li class="advertisement-cell" v-for="item in advertisements" @click="gotoNode(item)">
          <img class="advertisement-img" :src="item.image">
        </li>
      </ul>
      <!-- 广告位 -->

			<div v-if="is_loading" class="loading-box">
        <span class="loading-img"></span>
      </div>

      <div v-else>
				<div v-if="result_list&&result_list.length" class="result-wrap">
					<mt-loadmore style="min-height:calc(100vh - 1.7rem);" :top-method="loadTop" :auto-fill="true" ref="loadmore">
						<div class="result-list-wrap">
							<ul class="result-list"
								v-infinite-scroll="scrollLoadMore"
								infinite-scroll-disabled="!can_scroll"
								infinite-scroll-distance="10">
								<li class="result-cell" v-for="item in result_list" @click="goToDetail(item.id)">
									<div class="result-cell-img-wrap">
										<img class="result-cell-img" v-lazy="{src: item.img.small, loading:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwcHgiICBoZWlnaHQ9IjIwMHB4IiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIGNsYXNzPSJsZHMtZWNsaXBzZSIgc3R5bGU9ImJhY2tncm91bmQ6IG5vbmU7Ij48cGF0aCBuZy1hdHRyLWQ9Int7Y29uZmlnLnBhdGhDbWR9fSIgbmctYXR0ci1maWxsPSJ7e2NvbmZpZy5jb2xvcn19IiBzdHJva2U9Im5vbmUiIGQ9Ik0zMCA1MEEyMCAyMCAwIDAgMCA3MCA1MEEyMCAyMiAwIDAgMSAzMCA1MCIgZmlsbD0iI2ZmYjYwNiIgdHJhbnNmb3JtPSJyb3RhdGUoMTI0LjU2OSA1MCA1MSkiPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBjYWxjTW9kZT0ibGluZWFyIiB2YWx1ZXM9IjAgNTAgNTE7MzYwIDUwIDUxIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGVUcmFuc2Zvcm0+PC9wYXRoPjwvc3ZnPg=='}">
									</div>
									<p class="result-cell-title">{{item.name}}</p>
									<p class="result-cell-price">{{item.shop_price}}</p>
								</li>
							</ul>

							<div class="click-more" @click="getMore();">
								<div v-if="tip=='加载中...'" class="loading-box">
				          <span class="loading-img"></span>
				        </div>
				        <span> {{tip}}</span>
							</div>
						</div>
						<div class="zhanwei"></div>
					</mt-loadmore>
				</div>
      </div>
			



		</div>
		<!-- 分类内容 end -->
  </div>
</template>

<script>
import store from "@/vuex/index.js";
import topHead from "@/views/components/TopHead.vue";
// import Ornament from "@/views/components/Ornament.vue";

import { Toast, Loadmore } from "mint-ui";
import appconfig from "@/config/appconfig.js";

export default {
	components:{
		mtLoadmore:Loadmore,
	},
	data(){
	  return {
			page:1,
			page_size:10,
			result_list:null,
			search_val:"",
			tip:"",
      category_id:'',
      category:[],


      is_loading:false,
      getting_list:false,
			can_scroll:true,

      carousel:[],
			advertisements:[],//广告banner
		}	
	},
	mounted(){
		this.init();
	},
	beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      // vm.init();
      utils.trackEvent("exposure_accessory");
    })
  },
	store,
  computed: {
  	macross () {
      return this.$store.getters.getMacross;
    },
  	seller_id(){//店铺id
      return this.$store.getters.getSellerId;
    },
    // category() {//店铺分类
    // 	return this.$store.getters.getShopCategory;
    // },
    goods_category() {//买金分类
    	var me = this,
    			goods_category = [];
    	this.category.forEach(function(item){
    		if(item.name == "饰品"){
    			goods_category = item.children;
    		}
    	});

      return goods_category;
    },
    resume_stamp() {
      return this.$store.getters.getResumeStamp;
    },
  },
  watch:{
    resume_stamp:function(nval,oval){//app  reume
      utils.trackEvent("exposure_accessory");
    },
  },
	methods:{
		init:function(){
			var me = this;

			if(this.result_list == null){
        this.is_loading = true;
      }

      this.getAdvertisements();

			this.getMerchantGoodsCategory(function(){//获取商品分类
        me.category_id = me.goods_category.length > 0 ? me.goods_category[0].id : 0;
				me.getGoodsList(me.category_id,me.search_val,true);
      });
		},
		search:function(){
      this.$store.commit('setShopCategoryId',null);
			this.page = 1;
			this.result_list = [];
			this.getGoodsList(null,this.search_val,true);
			this.is_loading = true;
		},

		/************获取广告位************/
    getAdvertisements: function() {
      var me = this;
      utils.API.accessory_advertisements({
        method:"get",
      })
      .then(function(ret) {
        me.carousel = [];
        // console.log("ret.model:",ret.model);
        ret.model.forEach(function(item){
          // item.image = me.cms_url+item.image;
          if(/饰品顶部位/.test(item.positions)){
            me.carousel.push(item);
          }else if(/饰品小广告位/.test(item.positions)){
            me.advertisements.push(item);
          }
        });
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    /************获取广告位************/

    gotoNode: function(activity_name) {
      utils.gotoNode(activity_name);
    },

		/************获取店铺的所有分类************/
    getMerchantGoodsCategory: function(cb) {//获取店铺分类
      var me = this;

      if (this.category.length > 0) {
        cb&&cb();
        return;
      }

      utils.API.merchant_goods_category({
        data: {
          seller_id: me.seller_id
        }
      })
      .then(function(ret) {
        me.category = ret.model.data;
        cb&&cb();
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        me.is_loading = false;
      });
    },
    /************获取店铺的所有分类************/
		switchCategory(category_id){
			// this.$store.commit('setShopCategoryId',category_id);
			this.search_val = '';
			this.page = 1;
			this.getGoodsList(category_id,null,true);
			this.is_loading = true;
      this.category_id = category_id;
		},
		getGoodsList:function(category_id,filter,reset,cb){//根据分类获取产品
      var me = this;

      this.getting_list = true;

      if(reset){
      	this.page = 1;
    		this.result_list = [];
    		this.tip = "";
    	}


      utils.API.merchant_goods_list({
        data:{
          seller_id:me.seller_id,
          "filter" : {
			      "category_id" : category_id,
			      "keywords" : filter,
			      "sort_by" : "new",
					},
					"pagination":{
			      "count" : me.page_size,		
			      "page"  : me.page,
					},
        }
      })
      .then(function (ret) {
      	
      	

      	// setTimeout(function(){
	      	var data = _.isArray(ret.model.data)?ret.model.data:[]

	      	if(me.page == 1){
	          me.result_list = [].concat(me.result_list,data);
	          me.page += 1;
	          if(ret.model.paginated.more == 0){
	            me.tip = "-没有更多啦-";
	          }else{
	            me.tip = "";
	            // me.tip = "点击加载更多";
	          }
	        }else{
	          if(ret.model.paginated.more == 0){
	            me.tip = "-没有更多啦-";
	            if(me.result_list.length < ret.model.paginated.total){
	            	me.result_list = [].concat(me.result_list,data);
	            }
	          }else{
	            me.page += 1;
	            // me.tip = "点击加载更多";
	            me.tip = "";
	            me.result_list = [].concat(me.result_list,data);
	          } 
	        }
      	// },50);
      	
      	me.is_loading = false;
      	me.getting_list = false;
      	
      	me.$refs.loadmore&&me.$refs.loadmore.onTopLoaded();
      	cb&&cb();
      })
      .catch(function(ret){
        !ret.__servererror__ && Toast(ret.errorMessage||"未知错误！");
        me.$refs.loadmore&&me.$refs.loadmore.onTopLoaded();
        me.is_loading = false;
        me.getting_list = false;
      });
    },

    scrollLoadMore:function(){//滚动加载
    	this.can_scroll = false;

    	if(this.tip == "-没有更多啦-"){
    		return;
    	}

    	if(this.getting_list){
    		return;
    	}

    	this.tip = "加载中...";

    	
    	let para = [];

    	if(this.category_id){//分类
				para = [this.category_id,null,false];
			}else{//搜索
				para = [null,this.search_val,false];
			}

			para.push(()=>{
    		this.$nextTick(function() {
          // DOM 现在更新了
          // `this` 绑定到当前实例
          setTimeout(()=>{
	          if(this.tip == "-没有更多啦-"){
		    			this.can_scroll = false;
		    		}else{
		    			this.can_scroll = true;
		    		}
          },1000)
	    	})
	    })

	  	this["getGoodsList"].apply(this,para);



    	// this.getGoodsList(this.category_id,false,)
    	// });
    },

    loadTop:function(){
    	this.getGoodsList(this.category_id,null,true);
    },


    goToDetail:function(id){
    	this.$router.push({path: `/goods/${id}` });
    },
    
    getMore:function(){
    	if(this.tip == "-没有更多啦-"){
    		return;
    	}
			if(this.category_id){//分类
				this.getGoodsList(this.category_id,null);
			}else{//搜索
				this.getGoodsList(null,this.search_val);
			}
		},
	}

};
</script>
<style lang="less" scoped>
@import "~@/assets/less/variable.less";

.mall_accessory{
	// background:#ffffff;
	.search-wrap {
		// padding:0.4rem 0.1rem 0;
		height: 1rem;
		background:#ffffff;
		text-align:center;
		vertical-align: middle;
		border-bottom:1px solid #e8e8e8;
		position: absolute;
		display:flex;
		top: 0;
		right:0;
		left:0;
		z-index: 10;
		align-items: center;
    justify-content: space-around;
		.icon-back{
	    font-size: 0.52rem;
	    padding: 0 0.2rem;
	    color:@font-color;
			align-items: center;
	  }
	  .icon-blank{
	    font-size: 0.52rem;
	    padding: 0 0.2rem;
	    color:@font-color;
			align-items: center;
	  }
		.search-input {
			margin: 0 0 0 0.2rem;
			flex-grow:1;
			height: 0.56rem;
			border:none;
			background:#EAEBED;
			padding:0 10px;
			box-sizing: border-box;
		}
		.icon-search {
			align-items: center;
			margin:0 10px 0 5px;
			cursor:pointer;
			color:#ccc;
	    font-size: 0.52rem;
		}
	}
	.category-list {
		background:#ffffff;
		width: 2.06rem;
		height: 100vh;
		position: absolute;
		left: 0;
		z-index: 1;
		text-align: center;
    top: 0;
    padding-top: 1.28rem;
    box-sizing: border-box;
		.category-cell {
			margin: 0.4rem 0;
			height:0.52rem;
			line-height: 0.52rem;
			.category-cell-text {
				display: inline-block;
				width: 1.6rem;
				height:0.52rem;
				line-height:0.52rem;
				border-radius: 20px;
			}
			&.active {
				.category-cell-text {
					background:@yellow;
					color:#ffffff;
				}
			} 
		}
	}
	.category-content {
		// height:calc(100% - 2.08rem - 1.28rem);
    height: 100vh;
    width: 5.44rem;
		position: absolute;
    overflow-y: auto;
		right: 0;

		.advertisement-wrap {
			padding:10px;
			width: 100%;
			box-sizing: border-box;
			.advertisement-cell {
				width: 100%;
				img {
					display: block;
					width: 100%;
				}
			}
		}

		.result-wrap {
			.result-list-wrap {
				padding:10px;
				.result-list {
					.result-cell {
						background:#ffffff;
						padding-bottom: 10px;
						margin-bottom:0.4rem;
						.result-cell-img-wrap {
							width: 5rem;
							height:5rem;
							display: flex;
							align-items:center;
							justify-content:center;
							background:#eeeeee;
							box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);
							.result-cell-img {
								width: 100%;
								height:100%;
								display: block;
								// &[lazy=loading] {
								//   width: 1rem;
								// 	height: 1rem;
								// }
							}
						}
						.result-cell-title {
							margin-top:10px;
							padding:0 10px;
							overflow:hidden;
	            text-overflow: ellipsis;
	            display: -webkit-box;
	            -webkit-line-clamp: 2;
	            -webkit-box-orient: vertical;
              word-break: break-all;
    					word-wrap: break-word;
						}
						.result-cell-price {
							margin-top:10px;
							color:@mall-base-red;
							padding:0 10px;

						}
					}
				}
			}
		}
	}

	.zhanwei {
    height: 2rem;
  }
}

</style>
