<template>
	<div>
    <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">评价中心</div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->



		<div class="comment-wrap">
			<div class="top-blank"></div>

	    <div class="order-list-wrap">
        <mt-loadmore style="min-height:calc(100vh - 1.7rem);" :top-method="loadTop" ref="loadmore">
          <div class="order-list">
            <div class="order-list-cell" v-for="order in order_list">
              <ul class="order-list-goods-wrap">
                <li class="order-list-goods-cell" v-for="goods in order.goods_list">
                  <img :src="goods.img.thumb">
                  <div class="goods-info">
                    <h4 class="goods-title">{{goods.name}}</h4>
                    <p class="goods-number">x{{goods.goods_number}}</p>
                  </div>
                </li>
              </ul>
              <div class="summary-wrap">
                <div class="info-line">
                  <span>共{{order.goods_number}}件商品</span>
                  <span>实付款<i>{{order.formated_total_fee}}</i></span>
                </div>
                <div class="btn-line">
                  <a href="javascript:;" class="btn" @click="redirect(`/my/order/${order.order_id}`)">查看订单</a>
                  <a v-if="!culIsCommented(order.goods_list)" href="javascript:;" class="btn yellow-color" @click="redirect(`/my/commentsdetail/${order.order_id}`)">去评价</a>
                  <a v-else href="javascript:;" class="btn yellow-color" @click="redirect(`/my/commentsdetail/${order.order_id}`)">已评价</a>
                </div>
              </div>
            </div>
          </div>
        </mt-loadmore>
      </div>

			<div class="zhanwei"></div>
		</div>

	</div>
</template>

<script>
import topHead from "@/views/components/TopHead.vue";

import { Toast, MessageBox, Loadmore, CellSwipe } from "mint-ui";

export default {
  components: {
    topHead: topHead,
    mtLoadmore:Loadmore,
    mtCellSwipe:CellSwipe,
  },
  data() {
    return {
      mall_token:"",
      order_list:[],
    };
  },
  computed: {
    
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.init();
      // utils.trackEvent("exposure_my");
    })
  },

  mounted() {
    // this.init();
  },
  methods: {
    init: function() {
      this.mall_token = utils.storageGet("mall_token");
      
      this.getOrderList();
    },

    getOrderList(cb) {//获取即时提货、存储订单列表（ecjia）
      let data = {
        token: this.mall_token,
        type:"finished",
        order_type:2,//0表示所有类型，1表示存储类型，2表示提货类型
        pagination: {
          count: 9999,
          page: 1
        }
      };

      utils.API.order_list({
        data: data
      })
      .then(res => {
        // this.order_list = [];
        this.order_list = res.model.data;
        this.$refs.loadmore&&this.$refs.loadmore.onTopLoaded();
        cb&&cb();
      })
      .catch(ret => {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        this.$refs.loadmore&&this.$refs.loadmore.onTopLoaded();
      });
    },

    culIsCommented:function(order_list){
      let is_commented = false,
          num = 0;

      order_list.forEach(function(item){
        if(item.is_commented == 1){
          num += 1;
        }
      })

      if(num == order_list.length){
        is_commented = true;
      }
      return is_commented;
    },



    loadTop:function(){
      this.getOrderList();
    },


    goBack:function(){
      this.$router.goBack();
    },

    redirect: function(url,event_name){
      this.$router.push({path: url})
    }.after(function(url,event_name){
      if(event_name){
        utils.trackEvent(event_name);
      }
    }),
  }
};
</script>


<style lang="less" scoped>
@import "./CommentsCenter.less";
</style>