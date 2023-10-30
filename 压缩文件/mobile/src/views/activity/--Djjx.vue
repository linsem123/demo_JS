<template>
	<div class="main">
   <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">低价精选</div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->


    <div class="content">
      <div class="head-img">
        <div class="head-price">{{lowest_price}}</div>
      </div>
      

      <div class="main">
        <img class="bg-img" src="../../assets/images/djjx/banner-1.png">
        <div class="promote-goods-wrap">
          <ul class="promote-goods-list" v-for="(brand,brand_index) in promote_goods">
            <template v-for="(goods,index) in brand.goods_list">
              <li v-if="index == 0" class="goods-card big-goods-card" @click="redirect(`/goods/${goods.goods_id}`,`click_activity_djjx_floor${brand_index}_goodslist${index}`)">
                <img class="goods-card-img" :src="goods.goods_img">
                <div class="goods-card-info">
                  <h4 class="goods-card-title">{{goods.goods_name}}</h4>
                  <p class="goods-card-desc">{{goods.goods_brief}}</p>
                  <div class="goods-card-bottom">
                    <p class="goods-card-origin-price" v-if="Number(goods.promote_price)>0">原价：{{Number(goods.shop_price).toFixed(0)}}</p>
                    <a class="goods-card-link">{{formatMinPrice(goods)}}</a>
                  </div>
                </div>
              </li>
              <li v-if="index > 0" class="goods-card small-goods-card" @click="redirect(`/goods/${goods.goods_id}`,`click_activity_djjx_floor${brand_index}_goodslist${index}`)">
                <p class="goods-card-price">{{formatMinPrice(goods)}}</p>
                <p class="goods-card-weight">{{Number(goods.goods_weight*1000).toFixed(0)}}克</p>
              </li>
            </template>
          </ul>
        </div>

        <img class="bg-img" src="../../assets/images/djjx/banner-2.png">
        <div class="recommend-goods-wrap">
          <ul class="recommend-goods-brand" v-for="brand in recommend_goods">
            <li class="recommend-goods-cell" v-for="(goods,index) in brand.goods_list" @click="redirect(`/goods/${goods.goods_id}`,`click_activity_djjx_other_goodslist${index}`)">
              <div class="goods-card-top">
                <img class="goods-card-img" :src="goods.goods_img">
              </div>
              <div class="goods-card-bottom">
                <h4 class="goods-card-title">{{goods.goods_name}}</h4>
                <a class="goods-card-link">{{formatMinPrice(goods)}}</a>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <img class="bg-img" style="margin-top:-1px;" src="../../assets/images/djjx/footer.jpg">

      <!-- <div class="zhanwei"></div> -->
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
      lowest_price:"",
    }
  },
  computed: {
    promote_goods(){
      var promote_goods = [];

      promote_goods = this.favourable_list.filter(function(item,index){
        return index <= 2;
      });
      return promote_goods;
    },
    recommend_goods(){
      var recommend_goods = [];

      recommend_goods = this.favourable_list.filter(function(item,index){
        return index > 2;
      });
      return recommend_goods;
    },
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
    formatMinPrice:function(goods){
      var min_price = "",
          promote_price = Number(goods.promote_price),
          shop_price = Number(goods.shop_price);

      if(promote_price != 0){
        min_price = promote_price;
      }else{
        min_price = shop_price;
      } 
      return min_price.toFixed(0);
    },
    getFavourableList:function(){
      var me = this;

      utils.API.favourable_list({
        data:{
          "activity_name": "低价精选"
        }
      })
      .then(function(ret) {
        var lowest_price = "";
        ret.model.data[0]&&ret.model.data[0].items.forEach(function(item){
          var obj = _.find(me.favourable_list,function(o){return o.brand_id == item.brand_id;}),
              shop_price = Number(item.shop_price),
              promote_price = Number(item.promote_price);

          if(!lowest_price){
            if(promote_price != 0){
              lowest_price = promote_price;
            }else{
              lowest_price = shop_price;
            } 
          }else{
            if(promote_price != 0){
              lowest_price = promote_price<lowest_price?promote_price:lowest_price;
            }else{
              lowest_price = shop_price<lowest_price?shop_price:lowest_price;
            } 
          }

          if(obj){
            obj.goods_list.push(item);
          }else{
            var temp_obj = {
              brand_id:item.brand_id,
              goods_list:[item],
            }
            me.favourable_list.push(temp_obj);
          }
        });

        me.lowest_price = lowest_price;
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
@import "./Djjx.less";
</style>
