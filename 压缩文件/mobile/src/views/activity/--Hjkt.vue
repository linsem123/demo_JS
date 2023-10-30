<template>
	<div class="main">
   <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">黄金课堂</div>
      <div slot="right"></div>
    </top-head>

    <!-- 头部 -->
    <div class="content">
      <img src="@/assets/images/hjkt/bg-1.jpg" alt="">
      <div class="goods-card-wrap">
        <img class="goods-card-img" :src="favourable_list[0]?favourable_list[0].goods_img:''">
        <ul class="goods-card-info">
          <li class="goods-cell" v-for="goods in favourable_list" @click="redirect(`/goods/${goods.goods_id}`,`click_activity_hjkt_goodslist${index}`)">
            <p class="goods-name">{{goods.goods_name}}</p>
            <p class="goods-weight">￥{{Number(goods.shop_price).toFixed(0)}}</p>
            <a class="goods-btn">购买</a>
          </li>
        </ul>
      </div>
      <img src="@/assets/images/hjkt/bg-2.jpg" alt="">
    </div> 
  </div>
</template>

<script>

import topHead from "@/views/components/TopHead.vue";
import { Toast } from "mint-ui";

export default {
  components: {
    topHead
  },
  data() {
    return {
      enter_time:0,
      favourable_list:[],
    }
  },
  computed: {
  },
  mounted() {
    // this.init();
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
  methods:{
    init(){
      this.enter_time = new Date().getTime();
      this.getFavourableList();
    },
    getFavourableList:function(){
      var me = this;

      utils.API.favourable_list({
        data:{
          "activity_name": "黄金课堂"
        }
      })
      .then(function(ret) {
        me.favourable_list = ret.model.data[0]&&ret.model.data[0].items||[];

        // ret.model.data[0]&&ret.model.data[0].items.forEach(function(item){
        //   var obj = _.find(me.favourable_list,function(o){return o.brand_id == item.brand_id;})
        //   if(obj){
        //     obj.goods_list.push(item);
        //   }else{
        //     var temp_obj = {
        //       brand_id:item.brand_id,
        //       goods_list:[item],
        //     }
        //     me.favourable_list.push(temp_obj);
        //   }
        // })

      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    goBack(){
      this.$router.goBack();
    },
    redirect:function(path,event_name){
      path ? this.$router.push({ path: path }):this.goBack();
    }.after(function(path,event_name) {
      if(event_name){
        utils.trackEvent(event_name);
      }
    }),
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/variable.less";

.content {
	background:#181818;
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
  .goods-card-wrap {
    width: 100%;
    height:3.08rem;
    background:url(~@/assets/images/hjkt/bg-card.jpg);
    background-size: cover;
    display: flex;
    justify-content:space-between;
    align-items: center;
    .goods-card-img {
      margin:0.2rem 0 0 0.82rem;
      width:2rem;
      height:2rem;
      display: block;
    }
    .goods-card-info {
      margin:1rem 0.78rem 0 0;
      .goods-cell {
        display: flex;
        align-items: center;
        margin-bottom:0.3rem;
        .goods-name {
          padding-left:0.1rem;
          // width:1.36rem;
          font-size:0.2rem;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;  //这里是在第二行有省略号
          overflow: hidden;
          color:#e9b75f;
          // background: -webkit-linear-gradient(top, #fbd176 , #d9a04b); /* Safari 5.1 - 6.0 */
          // background: -o-linear-gradient(top, #fbd176, #d9a04b); /* Opera 11.1 - 12.0 */
          // background: -moz-linear-gradient(top, #fbd176, #d9a04b); /* Firefox 3.6 - 15 */
          // background: linear-gradient(to bottom, #fbd176 , #d9a04b); /* 标准的语法 */
          // -webkit-background-clip: text;
          // color: transparent;
        }
        .goods-weight {
          margin-left:0.02rem;
          font-size:0.24rem;
          background: -webkit-linear-gradient(top, #fbd176 , #d9a04b); /* Safari 5.1 - 6.0 */
          background: -o-linear-gradient(top, #fbd176, #d9a04b); /* Opera 11.1 - 12.0 */
          background: -moz-linear-gradient(top, #fbd176, #d9a04b); /* Firefox 3.6 - 15 */
          background: linear-gradient(to bottom, #fbd176 , #d9a04b); /* 标准的语法 */
          -webkit-background-clip: text;
          color: transparent;
        }
        .goods-btn {
          display: inline-block;
          white-space: nowrap;
          border-radius: 0.1rem;
          margin-left:0.05rem;
          color:@font-color;
          text-align:center;
          padding:0.04rem 0.2rem;
          font-size:0.2rem;
          line-height:0.2rem;
          background: -webkit-linear-gradient(top, #fbd176 , #d9a04b); /* Safari 5.1 - 6.0 */
          background: -o-linear-gradient(top, #fbd176, #d9a04b); /* Opera 11.1 - 12.0 */
          background: -moz-linear-gradient(top, #fbd176, #d9a04b); /* Firefox 3.6 - 15 */
          background: linear-gradient(to bottom, #fbd176 , #d9a04b); /* 标准的语法 */
        }
      }
    }
  }
}
</style>
