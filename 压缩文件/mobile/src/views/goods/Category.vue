<template>
	<div @click="clickWholePage">
		<!-- 头部 -->
    <top-head ref="top_head">
      <div slot="left"></div>
      <div slot="main">买金条</div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->

    <!-- 分类 start -->
		<div v-if="show_fixed_category" class="category-list-wrap fixed">
			<ul class="category-list">
				<li class="category-cell" :class="{ 'active':(filter_name == item.name),has_more:item.has_more,'price':item.name=='价格' }" v-for="(item,index) in filters" @click.stop="switchFilters(item)">
					<div class="category-cell-title-wrap">
						<p class="category-cell-text">{{item.text}}</p>
						<div v-if="item.name=='价格'" class="trangle-wrap">
							<span class="up-trangle" :class="{ 'cursor':item.select=='price_asc' }"></span>
							<span class="down-trangle" :class="{ 'cursor':item.select=='price_desc' }"></span>
						</div>
						<div v-else class="trangle-wrap">
							<span class="down-trangle"></span>
						</div>
					</div>
					
					<ul v-if="item.children.length>0" class="children-wrap" :class="{ 'show-children':item.show_children==true }">
						<li class="child-cell" v-for="child in item.children" @click.stop="clickFilterChildren(child,item)">{{child.title}}</li>
					</ul>
				</li>
			</ul>
		</div>
		<!-- 分类 start -->


		<div class="category" ref="category">
			<div class="top-blank"></div>
				
				<!-- banner位 -->
				<div class="banner-wrap">
					<!-- 广告位 -->
		      <ul class="advertisement-wrap">
		        <li class="advertisement-cell" v-for="item in advertisements" @click="gotoNode(item)">
		          <img class="advertisement-img" :src="item.image">
		        </li>
		      </ul>
		      <!-- 广告位 -->

					<ul class="back-book-wrap">
						<li class="back-book-wrap-cell">顺丰包邮</li>
						<li class="back-book-wrap-cell">一单一发票</li>
						<li class="back-book-wrap-cell">一件一证书</li>
					</ul>
				</div>
				<!-- banner位 -->
				

				<!-- 分类 start -->
				<div class="category-list-wrap" ref="category_list_wrap">
					<ul class="category-list">
						<li class="category-cell" :class="{ 'active':(filter_name == item.name),has_more:item.has_more,'price':item.name=='价格' }" v-for="(item,index) in filters" @click.stop="switchFilters(item)">
							<div class="category-cell-title-wrap">
								<p class="category-cell-text">{{item.text}}</p>
								<div v-if="item.name=='价格'" class="trangle-wrap">
									<span class="up-trangle" :class="{ 'cursor':item.select=='price_asc' }"></span>
									<span class="down-trangle" :class="{ 'cursor':item.select=='price_desc' }"></span>
								</div>
								<div v-else class="trangle-wrap">
									<span class="down-trangle"></span>
								</div>
							</div>
							
							<ul v-if="item.children.length>0" class="children-wrap" :class="{ 'show-children':item.show_children==true }">
								<li class="child-cell" v-for="child in item.children" @click.stop="clickFilterChildren(child,item)">{{child.title}}</li>
							</ul>
						</li>
					</ul>
				</div>
				<!-- 分类 start -->



			
				<!-- 分类内容 start -->
				<div class="category-content clearfix">
					<div v-if="is_loading" class="loading-box">
	          <span class="loading-img"></span>
	        </div>
	        <div v-else>
						<mt-loadmore style="min-height:calc(100vh - 1.7rem);" :top-method="loadTop" ref="loadmore">
							<div v-if="result_list&&result_list.length" class="result-wrap">
								<div class="result-list-wrap">
									<ul class="result-list"
										v-infinite-scroll="scrollLoadMore"
  									infinite-scroll-disabled="!can_scroll"
  									infinite-scroll-distance="10">

										<li class="result-cell" v-for="(item,index) in result_list" :key="item.id" @click="goToDetail(item.id,index,'click_buygold_goodslist')">
											<div class="result-cell-img-wrap">
												<img :ref="`result_list_${index}`" class="result-cell-img" v-lazy="{src: item.img.thumb, loading:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwcHgiICBoZWlnaHQ9IjIwMHB4IiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIGNsYXNzPSJsZHMtZWNsaXBzZSIgc3R5bGU9ImJhY2tncm91bmQ6IG5vbmU7Ij48cGF0aCBuZy1hdHRyLWQ9Int7Y29uZmlnLnBhdGhDbWR9fSIgbmctYXR0ci1maWxsPSJ7e2NvbmZpZy5jb2xvcn19IiBzdHJva2U9Im5vbmUiIGQ9Ik0zMCA1MEEyMCAyMCAwIDAgMCA3MCA1MEEyMCAyMiAwIDAgMSAzMCA1MCIgZmlsbD0iI2ZmYjYwNiIgdHJhbnNmb3JtPSJyb3RhdGUoMTI0LjU2OSA1MCA1MSkiPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBjYWxjTW9kZT0ibGluZWFyIiB2YWx1ZXM9IjAgNTAgNTE7MzYwIDUwIDUxIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGVUcmFuc2Zvcm0+PC9wYXRoPjwvc3ZnPg=='}">
											</div>
											<div class="result-cell-info-wrap">
												<p class="result-cell-info-title">{{item.name}}</p>
												<p v-if="item.properties_tags" class="result-cell-info-tag">
													<span class="tag-cell" v-for="tag in item.properties_tags">{{tag}}</span>
												</p>
												<div class="result-cell-info-price">
													<span class="price">{{formatedMinPrice(item)}}</span>
													<span class="collect-num">{{item.collect_num}}人收藏</span>
													<p class="gouwuche" @click.stop="addToCart($event,`result_list_${index}`,item.id,index,item.img.thumb,'click_buygold_cart')"><span class="iconfont icon-gouwuche"></span></p>
													<!-- <p class="number-wrap">
								            <span class="subtract-btn iconfont icon-jianhao" @click="switchAmount(false)"></span>
								            <input class="amount-number" type="number" name="" readonly="readonly" v-model="item.select_num"/>
								            <span class="add-btn iconfont icon-jiahao" @click="switchAmount(true)"></span>
								          </p> -->
												</div>
											</div>
										</li>
									</ul>
								</div>
							</div>

							<div class="click-more" @click="getMore();">
								<div v-if="tip=='加载中...'" class="loading-box">
				          <span class="loading-img"></span>
				        </div>
				        <span> {{tip}}</span>
							</div>
							<div class="zhanwei"></div>
						</mt-loadmore>
	        </div>
				</div>
				<!-- 分类内容 end -->
		</div>

		<div v-if="!mall_token" class="floater" @click="redirect('/login')">
			<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGMAAACBCAYAAADUtwQcAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkI4ODg5MkY5MEQ2RjExRTk4NUU5Q0Y1QzVEODRGMUFBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkI4ODg5MkZBMEQ2RjExRTk4NUU5Q0Y1QzVEODRGMUFBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Qjg4ODkyRjcwRDZGMTFFOTg1RTlDRjVDNUQ4NEYxQUEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Qjg4ODkyRjgwRDZGMTFFOTg1RTlDRjVDNUQ4NEYxQUEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6kBJ6hAAAw1UlEQVR42px9Cbgl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">
		</div>

	</div>
</template>

<script>
import store from '@/vuex/index.js'
import topHead from "@/views/components/TopHead.vue";

import {
	Toast,
	// MessageBox,
	Loadmore,
} from 'mint-ui';

export default {
	components:{
		topHead:topHead,
		mtLoadmore:Loadmore,
	},
	data(){
	  return {
	  	cart:{},
	  	mall_token:"",

			page:1,
			page_size:10,

			result_list:null,
			category:[],
			// search_val:"",
			tip:"",
			// tip:"-点击加载更多-",
			show_fixed_category:false,
			carousel:[],
			isSupportSticky:true,
			advertisements:[],//广告banner

			filter_name:"热度",
			list_current_filter:{
				sort_by:"hot",
			},
			filters:[
				{
					name:"热度",
					children:[],
					text:"热度",
					select:"",
					is_sort:true,
					has_more:false,
					show_children:false,
				},
				{
					name:"款式",
					children:[
					{
						title:"重置",
						send_text:"",
					}],
					text:"款式",
					select:"重置",
					is_sort:false,
					has_more:true,
					show_children:false,
				},
				{
					name:"克重",
					children:[
					{
						title:"重置",
						send_text:"",
					},
					{
						title:"5克",
						send_text:"0.005",
					},
					{
						title:"10克",
						send_text:"0.01",
					},
					{
						title:"20克",
						send_text:"0.02",
					},
					{
						title:"50克",
						send_text:"0.05",
					},
					{
						title:"100克",
						send_text:"0.1",
					}],
					text:"克重",
					select:"重置",
					is_sort:false,
					has_more:true,
					show_children:false,
				},
				{
					name:"价格",
					children:[],
					text:"价格",
					select:"",
					select:"",
					// status:["price_desc","price_asc"],
					is_sort:true,
					has_more:false,
					show_children:false,
				},
			],


			is_loading:false,
			getting_list:false,
			can_scroll:true,
		}	
	},
	mounted(){
		this.isSupportSticky = utils.isSupportSticky();
		this.init();

		this.$refs.category.addEventListener('scroll',(event)=>{

			if(this.isSupportSticky){
				return;
			}

			let offset = event.target.scrollTop-this.$refs.category_list_wrap.offsetTop+this.$refs.top_head.$el.offsetHeight;

			if(offset >= 0){
				this.show_fixed_category = true;
			}else{
				this.show_fixed_category = false;
			}
		});

	},
	beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      // vm.init();
      utils.trackEvent("exposure_buygold");
      vm.show_fixed_category = false;
      vm.filters.forEach(function(item){
				item.show_children = false;
			});
      vm.mall_token = utils.storageGet("mall_token");
    })
  },
	store,
  computed: {
  	seller_id(){//店铺id
      return this.$store.getters.getSellerId;
    },
    location() {
      return this.$store.getters.getLocation;
    },
    goods_category_id() {//买金分类
    	var me = this,
    			goods_category_id = "";
    	this.category.forEach(function(item){
    		if(item.name == "产品"){
    			goods_category_id = item.id;
    		}
    	});

      return goods_category_id;
    },
    active_filter(){//当前选择的筛选条件
    	return _.find(this.filters,(o)=>{ return o.name == this.filter_name});
    },
    resume_stamp() {
      return this.$store.getters.getResumeStamp;
    },
  },
  watch:{
    resume_stamp:function(nval,oval){//app  reume
      utils.trackEvent("exposure_buygold");
    },
  },
	methods:{
		init:function(){
			var me = this;

			if(this.result_list == null){
        this.is_loading = true;
      }

			this.getMerchantGoodsCategory(function(){
				me.getGoodsList(me.list_current_filter,true);
			});

			this.getBrand();
			this.getAdvertisements();
		},

		formatedMinPrice(goods){
      var price = "",
          promote_price = Number(goods.unformatted_promote_price)||"",
          shop_price = Number(goods.unformatted_shop_price)||"";

      if(promote_price != 0){
        price = goods.promote_price;
      }else{
        price = goods.shop_price;
      }

      return price;
    },

    /********* 获取后台品牌信息列表 **********/
    getBrand: function() {
      var me = this;
      utils.API.goldbag_goods_brand({
        data:{}
      })
      .then(function(ret) {
        ret.model.data.forEach(function(item){
        	me.filters[1].children.push({
        		title:item.brand_name,
						send_text:item.brand_id,
        	})
        });
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    /********* 获取后台品牌信息列表 **********/
    
    /************获取广告位************/
    getAdvertisements: function() {
      var me = this;
      utils.API.mall_advertisements({
        method:"get",
      })
      .then(function(ret) {
        me.carousel = [];
        // console.log("ret.model:",ret.model);
        ret.model.forEach(function(item){
          // item.image = me.cms_url+item.image;
          if(/商城顶部位/.test(item.positions)){
            me.carousel.push(item);
          }else if(/商城小广告位/.test(item.positions)){
            me.advertisements.push(item);
          }
        });
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    /************获取广告位************/

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

    getFilters:function(filter_name){
    	let filter = {},
    			brand = _.find(this.filters[1].children,(o)=>{return o.title == this.filters[1].select;}),
					weight = _.find(this.filters[2].children,(o)=>{return o.title == this.filters[2].select;});

    	switch(filter_name){
    		case "热度":
    			filter = {
    				sort_by:"hot",//"sort_by" : "price_asc",//"new" (new最新上架商品，price_desc价格从高到底，price_asc价格从低到高，hot关注度高的商品)
						brand_id:"",
						weight:"",
    			}
    			break;
  			case "款式":
  				filter = {
    				sort_by:this.filters[3].select,
						brand_id:brand.send_text,
						weight:weight.send_text,
    			}
    			break;
  			case "克重":
  				filter = {
    				sort_by:this.filters[3].select,
						brand_id:brand.send_text,
						weight:weight.send_text,
    			}
    			break;
  			case "价格":
  				filter = {
    				sort_by:this.filters[3].select,//price_desc价格从高到底，price_asc价格从低到高
						brand_id:brand.send_text,
						weight:weight.send_text,
    			}
    			break;
    	}


    	return filter;
    },

		switchFilters:function(category,event_name){
			this.page = 1;

			if(this.filter_name == category.name){
				this.active_filter.show_children = !this.active_filter.show_children;
			}else{
				this.active_filter.show_children = false;
				this.filter_name = category.name;
				setTimeout(()=>{
					this.active_filter.show_children = true;
				})
			}

			

			switch(category.name){
				case "热度":
					this.filters[1].select = this.filters[2].select = "重置";
					this.filters[1].text = "款式";
					this.filters[2].text = "克重";
					this.filters[3].select = "";
					category.select = "热度";
					this.list_current_filter = _.assign({},this.getFilters("热度"));
					this.getGoodsList(this.list_current_filter,true);
					this.is_loading = true;
					utils.trackEvent("click_buygold_heat");
					break;
				case "价格":
					this.filters[0].select = "";
					if(category.select == ""){
						category.select = "price_asc";
					}else{
						if(category.select == "price_asc"){
							category.select = "price_desc";
						}else{
							category.select = "price_asc";
						}
					}

					this.list_current_filter = _.assign({},this.getFilters("价格"));
					this.getGoodsList(this.list_current_filter,true);
					this.is_loading = true;
					let trackData = category.select=="price_asc"?"价格升序":"价格降序";
					utils.trackEvent("click_buygold_price",{
						value:trackData,
					});
					break;
			}
		},
		

		clickFilterChildren:function(child,filter){
			this.active_filter.show_children = false;
			if(child.title == "重置"){
				filter.text = filter.name;
				filter.select = "重置";
			}else{
				filter.text = child.title;
				filter.select = child.title;
			}

			this.list_current_filter = _.assign({},this.getFilters(filter.name));
			this.getGoodsList(this.list_current_filter,true);
			this.is_loading = true;

			switch(filter.name){
				case "款式":
					utils.trackEvent("click_buygold_style",{
						value:child.title,
					});
					break;
				case "克重":
					utils.trackEvent("click_buygold_weight",{
						value:child.title,
					});
					break;
			}
		},

		clickWholePage:function($event){
			this.active_filter.show_children = false;
		},

		getGoodsList:function(filter,reset,cb){//根据分类获取产品
      var me = this;

      if(reset){
    		this.page = 1;
    		this.result_list = [];
    		this.tip = "";
    	}

    	this.getting_list = true;

      utils.API.merchant_goods_list({
        data:{
          seller_id:me.seller_id,
          filter:_.assign({
          	category_id:me.goods_category_id,
          },filter),
     //      "filter" : {
			  //     // "category_id" : goods_category_id,
			  //     // "keywords" : filter,
			  //     "sort_by" : "price_asc",//"new" (new最新上架商品，price_desc价格从高到底，price_asc价格从低到高，hot关注度高的商品)
					// },
					"pagination":{
			      "count" : me.page_size,		
			      "page"  : me.page,
					},
        }
      })
      .then(function (ret) {
      	// setTimeout(function(){
	      	var data = _.isArray(ret.model.data)?ret.model.data:[];

	      	data.forEach(function(item){
	      		let index = _.findIndex(item.properties,function(o){return o.name == "标签";});
	      		if(index != -1){
	      			item.properties[index].value = item.properties[index].value.split(/[,，]/);
	      			item.properties_tags = item.properties[index].value;
	      		}
	      		item.select_num = 0;
	      	})

	      	if(me.page == 1){
	          me.result_list = data;
	          me.page += 1;
	          if(ret.model.paginated.more == 0){
	            me.tip = "-没有更多啦-";
	          }else{
	            me.tip = "";
	            // me.tip = "-点击加载更多-";
	          }
	        }else{
	          if(ret.model.paginated.more == 0){
	            me.tip = "-没有更多啦-";
	            if(me.result_list.length < ret.model.paginated.total){
	            	me.result_list = [].concat(me.result_list,data);
	            }
	          }else{
	            me.page += 1;
	            me.tip = "";
	            // me.tip = "-点击加载更多-";
	            // me.result_list = [].concat(me.result_list,data);
	            me.result_list = [].concat(me.result_list,data);
	          } 
	        }


	        // me.can_scroll = true;
	        me.getting_list = false;
	        me.is_loading = false;

	        me.$refs.loadmore&&me.$refs.loadmore.onTopLoaded();
	        cb&&cb();

      	// },50);

      	
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

    	this.getGoodsList(this.list_current_filter,false,()=>{
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
    	});
    },
    

    loadTop:function(){
    	this.list_current_filter = _.assign({},this.getFilters(this.active_filter.name));
    	this.getGoodsList(this.list_current_filter,true);
    },

    goToDetail:function(id,index,event_name){
    	var me = this;
    			// classification_index = _.findIndex(this.goods_category,function(o){ return o.id == me.goods_category_id});

    	// if(classification_index != -1){
    	// 	utils.trackEvent(`click_buygold_classification_${classification_index}_goods`,{
    	// 		"goods_id":id,
    	// 		"index":index,
    	// 	});
    	// }

    	this.$router.push({path: `/goods/${id}` });
    }.after(function(id,index,event_name){
      if(event_name){
        utils.trackEvent(event_name,{
        	goods_id:id,
        });
      }
    }),
    
    getMore:function(){
    	if(this.tip == "-没有更多啦-"){
    		return;
    	}
    	this.list_current_filter = _.assign({},this.getFilters(this.active_filter.name));
			this.getGoodsList(this.list_current_filter,null);
		},

		/************加购物车操作************/
		addToCart:_.debounce(function($event,ref,goods_id,index,img,event_name){
    	var me = this,
        	number = 1;

      if(!me.mall_token){
        Toast("请登录~");
        this.$router.push({path: `/login`})
        return;
      }

      me.$store.commit("setCartAnimateTrigger",{
      	img:this.$refs[ref][0],
      	stamp:new Date().getTime(),
      });

      utils.API.goldbag_cart_add({
        data: {
          token: me.mall_token,
          goods_id: goods_id,
          number:number,
        }
      })
      .then(function(ret) {
        utils.trackEvent("click_buygold_cart_Success");
        // cb&&cb();
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });




      // this.cart = {};
      // this.getCart(function(){
      //   if(!_.isEmpty(me.cart)){
      //     if (me.cart.goods_list) {
      //       goodsInCart = me.cart.goods_list.filter(function(goods) {
      //         return goods.goods_id == goods_id;
      //       })[0];

      //       if (!_.isEmpty(goodsInCart)) {
      //         number = goodsInCart.goods_number + number;

      //         utils.API.cart_update({
      //           //添加商品到购物车
      //           data: {
      //             token: me.mall_token,
      //             rec_id: goodsInCart.rec_id,
      //             new_number: number,
      //             location: me.location
      //           }
      //         })
      //         .then(function(ret) {
      //           // Toast("添加成功，请前往购物车查看！");
      //           utils.trackEvent("click_buygold_cart_Success");
      //         })
      //         .catch(function(ret) {
      //           !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      //         });
      //       }else{
      //         me.createCart({
      //           goods_id: goods_id,
      //           number: number
      //         },function(){

      //         });
      //       }
      //     }
      //   }else{
      //     me.createCart({
      //       goods_id: goods_id,
      //       number: number
      //     },function(){

      //     });
      //   }
      // })
    },500)
    .after(function($event,ref,goods_id,index,img,event_name){
      if(event_name){
        utils.trackEvent(event_name,{
        	goods_id:goods_id,
        });
      }
    }),
    /************加购物车操作************/
		gotoNode: function(activity_name) {
      utils.gotoNode(activity_name);
    },

    redirect: function(path,event_name) {
      this.$router.push({path: path});
    },
	}

};
</script>
<style lang="less" scoped>
	@import './Category.less';
</style>