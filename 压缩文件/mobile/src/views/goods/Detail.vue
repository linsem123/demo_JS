<template>
	<div>
		<!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">商品详情</div>
      <div slot="right">
        <span v-if="!is_weixin" class="head-icon iconfont icon-fenxiang" @click="showSharePupup"></span>
      </div>
    </top-head>
    <!-- 头部 -->

		<div class="mall_goods_detail">
			<div class="top-blank"></div>
			<div class="main-content">


        <swiper v-if="detail.pictures&&detail.pictures.length" :options="detail.pictures.length>1?swiperOption:noloopSwiperOption" ref="swiper">
          <swiper-slide v-for="(item,index) in detail.pictures" :index="index" :key="index">
            <div class="top-ad-banner-link" :style="'background-image:url('+item.url+');'"></div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>

				<div class="goods-content-wrap">
					<div class="goods-head">
						<div class="goods-price-wrap clearfix">
							<h4 class="goods-price">{{shop_price}}</h4>
							<p class="kucun">库存：有货</p>
						</div>
            <p class="shop-price" v-if="has_promote_price">原价：{{detail.shop_price}}</p>
            <h4 class="goods-title" :class="is_storage_G&&is_storage_G.value=='G'?'is-storage-G':''">
              <span>{{detail.goods_name}}</span>
            </h4>
            <div class="goods-desc">
              <p class="goods-desc-text">免运费</p>
              <p class="goods-desc-text">周销：{{detail.seller_note||0}}</p>
              <p class="goods-desc-text">发货地：上海</p>
            </div>
            <div class="goods-icon-line" v-if="is_storage_G">
              <p>
                <span class="iconfont icon-wancheng"></span>
                <span class="goods-icon-text">顺丰速运</span>
              </p>
              <p>
                <span class="iconfont icon-wancheng"></span>
                <span class="goods-icon-text">国家质检证书</span>
              </p>
              <p>
                <span class="iconfont icon-wancheng"></span>
                <span class="goods-icon-text">重金保险</span>
              </p>
            </div>
          </div>

          <div class="goods-unit-wrap" v-if="!mall_token&&is_storage_G">
            <div class="goods-unit-line" @click="redirect('/login')">
              <p>
                <span class="gray title">优惠</span>
                <span>新人活动每克最高再减<i>￥6</i></span>
              </p>
              <p>
                <span class="gray" style="margin-right:0.1rem;">领券</span>
                <span class="more iconfont icon-more"></span>
              </p>
            </div>
            <!-- <div class="goods-unit-line">
              <p>
                <span class="shield iconfont icon-touzi"></span>
                <span class="gray">保值金条  投资稳靠</span>
              </p>
              <p>
                <span class="shield iconfont icon-zhengpin"></span>
                <span class="gray">正品保证  支持回购</span>
              </p>
            </div> -->
          </div>

          <div class="goods-unit-wrap">
            <div class="goods-unit-line" @click="select_amount_modal=true">
              <p>
                <span class="gray title">已选</span>
                <span>{{amount}}件</span>
              </p>
              <p>
                <span class="more iconfont icon-more"></span>
              </p>
            </div>
          </div>

          <div class="goods-comment-wrap">
            <div class="goods-comment-title">
              <p class="goods-comment-title-text">商品评价({{comments.total||0}})</p>
              <p class="goods-comment-title-right" v-if="comments.total>0" @click="comments_modal=!comments_modal;">
                <span class="title-right-text">查看全部</span>
                <span class="more iconfont icon-more"></span>
              </p>
            </div>
            <ul class="goods-comment-list-wrap">
              <li class="goods-comment-cell" v-if="index<=1" v-for="(comment,index) in comments.list">
                <h4 class="comment-author">{{comment.mobile | hideString}}</h4>
                <p class="comment-content">{{comment.content}}</p>
              </li>
            </ul>
          </div>

					<div class="goods-body">
						<h4 class="goods-body-title">详情</h4>
						<div class="goods-body-content" v-html="html"></div>
					</div>
				</div>

				<div class="zhanwei"></div>
			</div>
		</div>

		<!-- 底部购买 -->
		<div class="bottom-buy" :class="{ 'fix-gt-phonex':isGtIphonex }">
      <div class="bottom-buy-inner">
        <div class="icon-wrap">
          <p class="contact-wrap">
            <span class="iconfont icon-contact-guest"></span>
            <a class="contact-wrap-text" :href="'tel:'+guest_phone">联系客服</a>
          </p>
          <p class="contact-wrap" @click="redirect('/order/cart','click_goodsDetail_cartButton')">
            <span class="iconfont icon-gouwuche" :class="cart_animating?'cart-rotate':''"></span>
            <span class="contact-wrap-text">购物车</span>
            <span class="number" :class="cart_animating?'number-sacle':''">{{cart_number}}</span>
          </p>
          <p class="contact-wrap" @click="switchCollect">
            <span class="iconfont" :class="detail.collected==1?'icon-shoucangfill':'icon-shoucang'"></span>
            <span class="contact-wrap-text">收藏</span>
          </p>
        </div>
  			<p class="but-btn add-cart" @click="addToCart()">加入购物车</p>
      </div>
		</div>
		<!-- 底部购买 -->

    <div class="absolute-amount" :class="move_tocart?'move-tocart':''">{{amount}}</div>

    <!-- 修改数量 -->
    <Popup
        v-model="select_amount_modal"
        position="bottom"
        class="pop-modal">
      <div class="content">
        <a href="javascript:void(0);" class="close iconfont icon-guanbi2" @click="select_amount_modal=false"></a>
        <div class="content-info-wrap">
          <div class="content-info-img-wrap">
            <img :src="detail.img&&detail.img.url">
          </div>
          <div class="content-info-price-wrap">
            <p class="content-info-price">{{shop_price}}</p>
            <p class="content-info-shop-price" v-if="has_promote_price">原价：{{detail.shop_price}}</p>
            <p class="content-info-number">库存：有货</p>
          </div>
        </div>
        <div class="content-amount-wrap">
          <!-- <div class="content-amount-limit" v-if="limit_buy==undefined">不限购</div>
          <div class="content-amount-limit" v-else>数量(限购{{limit_buy}}件)</div> -->
          <div class="content-amount-limit" v-if="limit_buy!=undefined">数量(限购{{limit_buy}}件)</div>
          <div class="content-amount-number-wrap">
            <span class="subtract-btn iconfont icon-jianhao" @click="switchAmount(false)"></span>
            <input class="content-amount-number" type="number" name="" readonly="readonly" v-model="amount"/>
            <span class="add-btn iconfont icon-jiahao" @click="switchAmount(true)"></span>
          </div>
        </div>
      </div>
    </Popup>
    <!-- 修改数量 -->


    <!-- 评论列表 -->
    <Popup
        v-model="comments_modal"
        position="right"
        class="pop-modal comments-modal">
      <a href="javascript:void(0);" class="iconfont icon-back" @click="comments_modal=!comments_modal"></a>
      <div class="title">评价</div>
      <div class="content">
        <ul class="comments-list">
          <li class="comments-cell" v-for="(comment,index) in comments.list">
            <h4 class="comments-author">{{comment.mobile | hideString}}</h4>
            <p class="comments-time">{{comment.add_time | formatTime}}</p>
            <p class="comments-content">{{comment.content}}</p>
          </li>
        </ul>
      </div>
    </Popup>
    <!-- 评论列表 -->


    <share-to-weixin
      :show="show_share_pupup"
      :share_para="share_para"
      :to_bottom="0"
      @close-share-popup="closeSharePopup"
    ></share-to-weixin>

	</div>
</template>

<script>
import topHead from "@/views/components/TopHead.vue";
import constants from "@/assets/js/constants.js";
import appconfig from "@/config/appconfig.js";
import shareToWeixin from "@/views/components/shareToWeixin.vue";
import store from "@/vuex/index.js";

import { Toast, Swipe, SwipeItem, Popup } from "mint-ui";
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
  components: {
    Popup:Popup,
    mtSwipe: Swipe,
    mtSwipeItem: SwipeItem,
    topHead: topHead,

    swiper:swiper,
    swiperSlide:swiperSlide,

    shareToWeixin:shareToWeixin,
  },
  data() {
    return {
      amount:1,
      detail: {
      },
      html: "",
      address_list: [],
      cart:{},
      select_amount_modal:false,
      // old_cart_number:0,
      cart_number:0,

      swiperOption: {
        // autoplay: { 
        //   delay: 5000,
        //   disableOnInteraction: false,
        // },
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          type:"fraction",
        },
        observer:true,
        observeParents: true,
        // autoHeight: true, //高度随内容变化
      },
      noloopSwiperOption: {
        // autoplay: { 
        //   delay: 5000,
        //   disableOnInteraction: false,
        // },
        loop: false,
        pagination: {
          el: '.swiper-pagination',
          type:"fraction",
        },
        observer:true,
        observeParents: true,
        // autoHeight: true, //高度随内容变化
      },
      cart_animating:false,
      move_tocart:false,
      mall_token:"",

      share_para:{},
      show_share_pupup:false,

      comments:{
        comment_percent:"",
        comment_number:{},
        list:[],
      },
      comments_pagination:{
        "count" : 9999,
        "page" : 1,
      },
      comments_modal:false,
    };
  },
  mounted() {
    // this.init();
  },
  store,
  computed: {
    id() {
      return this.$route.params.id;
    },
    location() {
      return this.$store.getters.getLocation;
    },
    isGtIphonex(){
      return utils.isGtIphonex()
    },
    guest_phone(){
      return this.$store.getters.getGuestPhone;
    },
    // mall_token(){
    //   return utils.storageGet("mall_token")
    // },
    // cart_number(){
    //   // console.log("this.cart_number:",this.cart_number)
    //   var res = this.cart.goods_list&&this.cart.goods_list.length||0;

    //   if(res < this.old_cart_number){
    //     res = this.old_cart_number;
    //   }
    //   return this.old_cart_number = res;
    // },
    limit_buy(){
      var limit_buy = undefined;

      if(this.detail && this.detail.is_xiangou != 0){
        limit_buy = this.detail.xiangou_num;
      }
      return limit_buy;
    },
    has_promote_price(){
      var has_promote_price = false,
          promote_price = Number(this.detail.promote_price)||"";

      if(promote_price != 0){
        has_promote_price = true;
      }
      return has_promote_price;
    },
    shop_price(){
      var price = "",
          promote_price = Number(this.detail.promote_price)||"",
          shop_price = Number(this.detail.unformatted_shop_price)||"";

      if(promote_price != 0){
        price = this.detail.formated_promote_price;
      }else{
        price = this.detail.shop_price;
      }

      return price;
    },
    is_weixin(){
      return utils.checkUserAgent().is_weixin||false;
    },
    is_storage_G(){
      let is_storage_G = false;
      return _.find(this.detail.properties||[],function(o){ return o.name == "存储类别"; });
    },
  },
  watch:{
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.init();
      utils.trackEvent("exposure_goods",{"goods_id":vm.$route.params.id});
    })
  },
  filters:{
    hideString(phone){
      phone = utils.hideString(phone,3,4);
      return phone;
    },
    formatTime(time){
      time = time||"";
      return time.split(" ")[0];
    },
  },
  methods: {
    init: function() {

      if(!this.id){
        Toast("非法请求！")
        this.$router.push({ path: `/`});
      }
      
      this.mall_token = utils.storageGet("mall_token");

      this.getDetail();
      this.getDesc();
      this.getComments();
      this.top();
      
      if(this.mall_token){
        this.getCart();
      }
    },

    getComments:function(){
      var me = this;
      utils.API.goods_comments({
        data:{
          goods_id:me.id,
          comment_type:'all',
          pagination:this.comments_pagination,
        }
      })
      .then(function (ret) {
        me.comments = ret.model.data;
        me.comments.total = ret.model.paginated.total;
      })
      .catch(function(ret){
        !ret.__servererror__ && Toast(ret.errorMessage||"未知错误！");
      });
    },
    getCart(cb) {
      var me = this;
      
      utils.API.cart_list({
        data: {
          token: me.mall_token,
          // seller_id: me.seller_id,
          location: me.location
        }
      })
      .then(function(ret) {
        me.cart = ret.model.data.cart_list[0]||{};
        me.cart_number = me.cart.goods_list&&me.cart.goods_list.length||0;
        cb&&cb();
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    top: function() {
      window.scrollTo(0, 0);
    },
    getDesc:function(){
      var me = this;
      utils.API.mall_goods_desc({
        data:{
          goods_id:me.id,
        }
      })
      .then(function (ret) {
        var content = /<body>(.+)<\/body>/gi.exec(ret.model.data);
        me.html = content?content[1]:"";
      })
      .catch(function(ret){
        !ret.__servererror__ && Toast(ret.errorMessage||"未知错误！");
      });
    },
    getDetail: function() {
      var _this = this,
          data = {
            goods_id: this.id,
          };

      if(this.mall_token){
        data.token = this.mall_token;
      }

      utils.API.goods_detail({
        data:data, 
      })
      .then(function(ret) {
        _this.detail = _.assign({}, ret.model.data);
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    getDesc: function() {
      var _this = this;
      utils.API.goods_desc({
        data: {
          goods_id: _this.id
        }
      })
        .then(function(ret) {
          var content = /<body>(.+)<\/body>/gi.exec(ret.model.data);
          _this.html = content ? content[1] : "";
        })
        .catch(function(ret) {
          !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        });
    },
    goBack: function() {
      this.$router.goBack();
    },

    switchAmount:function(add){//加减数量
      if(add){
        if(this.amount >= this.limit_buy){
          return;
        }
        this.amount += 1;
      }else{
        if(this.amount <= 1){
          return;
        }
        this.amount -= 1;
      }
    },

    addToCart: function() {
      var me = this,
        number = this.amount;
      
      if(!me.mall_token){
        Toast("请登录~");
        this.$router.push({path: `/login`})
        return;
      }

      if(this.select_amount_modal == false){
        this.select_amount_modal = true;
        return;
      }

      utils.API.goldbag_cart_add({
        data: {
          token: me.mall_token,
          goods_id: me.id,
          number:number,
        }
      })
      .then(function(ret) {
        Toast("添加成功，请前往购物车查看！");
        me.cart_number = ret.model.data.rec_num;
        me.move_tocart = true;
        setTimeout(function(){
          me.move_tocart = false;
          me.cart_animating = true;
          setTimeout(function(){
            me.cart_animating = false;
          },1000)
        },500);
        me.select_amount_modal = false;

        utils.trackEvent('click_goodsDetail_addcartButton_Success');
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });



      // this.cart = {};
      // this.getCart(function(){
      //   if(!_.isEmpty(me.cart)){
      //     if (me.cart.goods_list) {
      //       goodsInCart = me.cart.goods_list.filter(function(goods) {
      //         return goods.goods_id == me.id;
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
      //           Toast("添加成功，请前往购物车查看！");
      //           me.move_tocart = true;
      //           setTimeout(function(){
      //             me.move_tocart = false;
      //             me.cart_animating = true;
      //             setTimeout(function(){
      //               me.cart_animating = false;
      //             },1000)
      //           },500);
      //           me.select_amount_modal = false;

      //           utils.trackEvent('click_goodsDetail_addcartButton_Success');
      //         })
      //         .catch(function(ret) {
      //           !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      //         });
      //       }else{
      //         me.createCart({
      //           goods_id: me.id,
      //           number: number
      //         },function(){
      //           me.select_amount_modal = false;
      //         });
      //       }
      //     }
      //   }else{
      //     me.createCart({
      //       goods_id: me.id,
      //       number: number
      //     },function(){
      //       me.select_amount_modal = false;
      //     });
      //   }
      // })
    }.after(function(){
      utils.trackEvent('click_goodsDetail_addcartButton');
    }),


    // createCart: function(goods,cb) {
    //   var _this = this;
    //   utils.API.cart_create({
    //     //添加商品到购物车
    //     data: {
    //       token: _this.mall_token,
    //       goods_id: goods.goods_id,
    //       number: goods.number,
    //       location: _this.location
    //     }
    //   })
    //     .then(function(ret) {
    //       Toast("添加成功，请前往购物车查看！");

    //       utils.trackEvent('click_goodsDetail_addcartButton_Success');

    //       _this.move_tocart = true;
    //       setTimeout(function(){
    //         _this.move_tocart = false;
    //         _this.cart_animating = true;
    //         setTimeout(function(){
    //           _this.cart_animating = false;
    //           _this.getCart();
    //           // cb&&cb();
    //         },1000)
    //       },500);
    //       cb&&cb();
    //     })
    //     .catch(function(ret) {
    //       !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    //     });
    // },

    switchCollect:function(){

      if(!this.mall_token){
        Toast("请登录~");
        this.$router.push({path: `/login`})
        return;
      }

      if(this.detail.collected == 0){
        this.createCollect();
      }else{
        this.deleteCollect();
      } 
    },
    deleteCollect:function(){
      var me = this;
      utils.API.user_collect_delete({
        data: {
          token: me.mall_token,
          goods_id: me.id
        }
      })
      .then(function(ret) {
        me.detail.collected = 0;
        Toast("取消收藏成功~");
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    createCollect:function(){
      var me = this;
      utils.API.user_collect_create({
        data: {
          token: me.mall_token,
          goods_id: me.id
        }
      })
      .then(function(ret) {
        me.detail.collected = 1;
        Toast("收藏成功~");
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    redirect: function(url,event_name) {
      this.$router.push({ path: url });
    }.after(function(url,event_name){
      if(event_name){
        utils.trackEvent(event_name);
      }
    }),



    /*分享*/
    showSharePupup:function(){
      let me = this;

      this.share_para = {
        message: {
          title: "我发现这里买黄金很值，赶快来看看吧",
          description: this.detail.goods_name,
          thumb: this.detail.img.thumb,
          media: {
            webpageUrl:appconfig.appbaseurl+"/"+window.location.hash,
          }
        },
      };

      this.show_share_pupup = true;
    },
    closeSharePopup: function() {
      //关闭分享弹层
      this.show_share_pupup = false;
    },
    /*分享*/

  }
};
</script>
<style lang="less" scoped>
@import './Detail.less';
</style>