<template>
	<div>
    <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">{{title}}</div>
      <div slot="right">
        <span v-if="!is_commented" class="top-head-right" @click="distribute">发布</span>
      </div>
    </top-head>
    <!-- 头部 -->



		<div class="comment-wrap">
			<div class="top-blank"></div>

	    <div class="order-list-wrap">
        <div class="order-list">
          <ul class="order-list-goods-wrap">
            <li class="order-list-goods-cell" v-for="goods in comment_order_list">
              <div class="goods-wrap">
                <img :src="goods.img.thumb">
                <div class="goods-info">
                  <h4 class="goods-title">{{goods.goods_name}}</h4>
                  <p class="goods-start">
                    <span v-if="goods.is_commented == 0" v-for="(star,index) in goods.star" class="iconfont icon-star" :class="star.is_active?'active':''" @click="setStar(goods,goods.star,index)"></span>
                    <span v-if="goods.is_commented == 1" v-for="star in goods.star" class="iconfont icon-star" :class="star.is_active?'active':''"></span>
                  </p>
                </div>
              </div>
              <textarea class="comment-cell" :readonly="is_commented" v-model="goods.content" placeholder="您的评价会帮助到更多用户哦～"></textarea>
            </li>
          </ul>
        </div>
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
      comment_order_list:[],
    };
  },
  computed: {
    order_id() {
      return this.$route.params.order_id || "";
    },
    title(){
      let title = "";
      if(this.is_commented){
        title = "评价详情";
      }else{
        title = "发表评价";
      }
      return title;
    },
    is_commented(){
      let is_commented = false,
          commented_num = 0;

      this.comment_order_list.forEach(function(item){
        if(item.is_commented > 0){
          commented_num += 1;
        }
      });

      if(commented_num > 0){
        is_commented = true;
      }

      return is_commented;
    },
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
      
      this.getCommentOrderList();
    },

    setStar:function(goods,star,num){
      star.forEach(function(item,index){
        if(index <= num){
          item.is_active = true;
        }else{
          item.is_active = false;
        }
      });
      goods.rank = num+1;
    },
    getCommentOrderList(cb) {//获取即时提货、存储订单列表（ecjia）
      let data = {
        token: this.mall_token,
        order_id:this.order_id,
      };

      utils.API.orders_comment({
        data: data,
      })
      .then((res) => {
        res.model.data.comment_order_list.forEach((item)=>{
          let star = [];

          for(var i=0;i<5;i++){
            star.push({
              is_active:false,
            });
          };

          item.rank = item.comment_rank||0;

          if(item.is_commented == 0){
            item.star = star;
          }else{
            item.star = star;
            this.setStar(item,star,(item.comment_rank-1)||0);
          }

        });
        this.comment_order_list = res.model.data.comment_order_list;
        cb&&cb();
      })
      .catch(ret => {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    getCommentData:function(){
      let all_commented = true,
          num = 0,
          data = [];

      this.comment_order_list.forEach(function(item){
        if(item.rank <= 0){
          all_commented = false;
        }
        if(!item.content){
          all_commented = false;
        }
        let obj = {
          "rec_id" :item.rec_id,
          "content" : item.content||"",
          "rank" :item.rank,
          "picture" : "",
          "is_anonymous" : 0,
        }
        data.push(obj);
      });


      return {
        data:data,
        all_commented:all_commented,
      }
    },

    distribute:function(){
      let result = this.getCommentData(),
          data = {
            comments:result.data,
          };

      if(!result.all_commented){
        Toast("您还有未评价的商品哦~");
        return;
      }

      data.token = this.mall_token;

      utils.API.comment_add({
        data: data
      })
      .then((res) => {
        Toast("评价成功~");
        this.getCommentOrderList();
      })
      .catch(ret => {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });

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
@import "./CommentsDetail.less";
</style>