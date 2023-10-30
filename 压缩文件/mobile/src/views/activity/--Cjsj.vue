<template>
  <div >
  	<!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">存金送金</div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->

    <div class="main">
  		<div class="top">
  			<img src="../../assets/images/cjsj/top.jpg" alt="">
  			<img src="../../assets/images/cjsj/sub.png" alt="">
  		</div>
  		<ul class="goods-list">
  			<li class="goods-item" @click="addToCart(goods[20],'click_activity_cjsj_goodslist1')">
  				<img src="../../assets/images/cjsj/item20.png" alt="">
  			</li>
  			<li class="goods-item" @click="addToCart(goods[50],'click_activity_cjsj_goodslist2')">
  				<img src="../../assets/images/cjsj/item50.png" alt="">
  			</li>
  			<li class="title">
  				<img src="../../assets/images/cjsj/title-text.png" alt="">
  			</li>
  			<li class="goods-item" @click="redirect(`/goods`,'click_activity_cjsj_goodslist3')">
  				<img src="../../assets/images/cjsj/item0.png" alt="">
  			</li>
  		</ul>
  		<div class="bottom">
  			<img src="../../assets/images/cjsj/bottom.png" alt="">
  		</div>
  	</div>
  </div>
</template>

<script>
import topHead from "@/views/components/TopHead.vue";
import store from "@/vuex/index.js";

import { Toast } from "mint-ui";
import appconfig from "@/config/appconfig.js";

export default {
  components: {
    topHead,
    Toast
  },
  data() {
    return {
      enter_time:0,
      activity: {},
			program_list:[],
      mall_token:"",
    };
  },
  computed: {
    seller_id() {
      return this.$store.getters.getSellerId;
    },
    // mall_token() {
    //   return utils.storageGet("mall_token");
    // },
    location() {
      return this.$store.getters.getLocation;
    },
    goods() {
      let __goods_index = {};
      if (this.activity.items && this.activity.items.length) {
        for (var i = 0, len = this.activity.items.length; i < len; i++) {
          let item = this.activity.items[i]

          if (item.goods_weight*1000 == 20) {
            __goods_index[20] = item;
          } else if (item.goods_weight*1000 == 50) {
            __goods_index[50] = item;
          }
        }
      }
      return __goods_index;
    }
  },
  mounted() {
    
  },
  store,
  compute: {
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.init();
    })
  },
  beforeRouteLeave (to, from, next) {
    utils.trackEvent("pageLeave-"+from.meta.track_name,{"path":from.fullPath},new Date().getTime()-this.enter_time);
    next();
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  },
  methods: {
    init(){
      this.enter_time = new Date().getTime();
      this.mall_token = utils.storageGet("mall_token");
      
      this.getFavourableList({
        data: {
          activity_name: "买金送金"
        }
      }).then(res => {
        if (res.model.data && res.model.data.length) {
          this.activity = res.model.data[0];
        }

        if (!this.activity.items) {
          Toast("获取数据错误");
        }
      })
    },
    getFavourableList(options) {
      return utils.API.favourable_list(options);
    },
    goBack: function() {
      this.$router.goBack();
    },
		redirect:function(path,event_name){
			path ? this.$router.push({ path: path }):this.goBack();
		}.after(function(path,event_name) {
      if(event_name){
        utils.trackEvent(event_name);
      }
    }),




/********************************加入购物车********************************/
  getCart(cb) {
    var _this = this;
    
    utils.API.cart_list({
      data: {
        token: _this.mall_token,
        seller_id: _this.seller_id,
        location: _this.location
      }
    })
    .then(function(ret) {
      // _this.cart = ret.model.data.cart_list[0]||{};
      cb&&cb(ret.model.data.cart_list[0]||{});
    })
    .catch(function(ret) {
      !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    });
  },

  goodsInCart:function(goods_id,cart){
    if(!cart || !_.isArray(cart.goods_list)){
      return {};
    }
    var goods_in_cart = cart.goods_list.filter(function(goods) {
          return goods.goods_id == goods_id;
        })[0]||{};

    return goods_in_cart;
  },

  cartUpdate:function(rec_id,number){//更新商品到购物车
    var me = this;

    return new Promise(function(resolve, reject) {
      utils.API.cart_update({
        data: {
          token: me.mall_token,
          rec_id: rec_id,
          new_number: number,
          location: me.location
        }
      })
      .then(function(ret) {
        resolve(ret);
      })
      .catch(function(ret) {
        reject(ret);
        // !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    })
  },
  cartCreate: function(goods,number){//添加商品到购物车
    var _this = this;

    return new Promise(function(resolve, reject) {
      utils.API.cart_create({
        data: {
          token: _this.mall_token,
          goods_id: goods.goods_id,
          number: number||1,
          location: _this.location
        }
      })
      .then(function(ret) {
        resolve(ret);
      })
      .catch(function(ret) {
        reject(ret);
        // !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    })
  },

  addToCart:function(goods,event_name){//加入购物车
    var me = this;

    if(!this.mall_token){
      me.$router.push({ path: `/login` });
    }

    this.getCart(function(cart){
      var funs = [];
      // console.log(order.goods_list);
      var goodsInCart = me.goodsInCart(goods.goods_id,cart);
      if(!_.isEmpty(goodsInCart)){
        funs.push(me.cartUpdate(goodsInCart.rec_id,goodsInCart.goods_number+1));
      }else{
        funs.push(me.cartCreate(goods,1));
      }

      Promise.all(funs)
      .then(function (res) {
        Toast("添加成功，请前往购物车查看！");
        me.$router.push({ path: `/order/cart` });
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    })
  }.after(function(goods,event_name) {
    if(event_name){
      utils.trackEvent(event_name);
    }
  }),
/********************************加入购物车********************************/








  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/variable.less";

.main {
  background:#730101;
  min-height: 100vh;
  margin-top:1rem;
  width: 100vw;
  height:100vh;
  overflow:auto;
	
	img{
		display:block;
		margin:0 auto;
		width:100%;
	}
  .goods-list {
		.title{
			margin:0 1.4rem;
		}
    .goods-item {
    }
  }
}
</style>
