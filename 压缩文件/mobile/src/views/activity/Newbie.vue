<template>
	<div class="main">
   <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">新手福利</div>
      <div slot="right">
        <span v-if="!is_weixin" class="head-icon iconfont icon-fenxiang" @click="showSharePupup"></span>
      </div>
    </top-head>
    <!-- 头部 -->

    <div class="content">
      <div class="top-blank"></div>

      <div class="dynamic-content">
        <div class="inner-content">
          <div class="banner-wrap">买金券</div>
          <img src="@/assets/images/newbie/img-1.png" />
          <template v-if="macross">
            <div class="banner-wrap">理财券</div>
            <img src="@/assets/images/newbie/img-2.png" />
            <div class="banner-wrap">关于黄金象</div>
            <img src="@/assets/images/newbie/img-3.png" />
          </template>
        </div>
      </div>

      <!-- <img src="@/assets/images/newbie/bg-2.jpg" alt=""> -->

      <div class="zhanwei"></div>
    </div>

    <span v-if="macross" class="regular-btn" @click="show_regular=!show_regular">使用规则</span>

    <div class="bottom-btn-wrap">
      <a class="bottom-btn" v-if="mall_token" @click="redirect('/my/coupon')">查看我领取的优惠券</a>
      <a class="bottom-btn" v-else @click="redirect('/login')">注册一键领取礼包</a>
    </div>

    <!-- 规则弹层 -->
    <Popup
        v-model="show_regular"
        pop-transition="popup-fade" 
        class="pop-modal regular-model">
      <div class="content">
        <span class="iconfont icon-close2" @click="show_regular=!show_regular"></span>
        <ul class="text-wrap">
          <li class="text-cell">
            <span class="text-icon">1</span>
            <span class="text">优惠券自领取之日起90天内有效。</span>
          </li>
          <li class="text-cell">
            <span class="text-icon">2</span>
            <span class="text">注册成功后自动发放至“我的-优惠券账户”，您可前往查看。</span>
          </li>
          <li class="text-cell">
            <span class="text-icon">3</span>
            <span class="text">满额立减，不可叠加使用，不可变现，不可赠送。</span>
          </li>
          <li class="text-cell">
            <span class="text-icon">4</span>
            <span class="text">买金券仅限购买实物金条使用，理财券仅限黄金理财使用。</span>
          </li>
          <li class="text-cell">
            <span class="text-icon">5</span>
            <span class="text">若发现恶意违规操作，黄金象有权取消订单。</span>
          </li>
        </ul>
      </div>
      <div class="mask"></div>
    </Popup>
    <!-- 规则弹层 -->

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
import appconfig from "@/config/appconfig.js";
import shareToWeixin from "@/views/components/shareToWeixin.vue";
import { Toast, Popup } from "mint-ui";

export default {
  components: {
    topHead,
    Popup,
    shareToWeixin:shareToWeixin,
  },
  data() {
    return {
      enter_time:0,
      mall_token:"",
      show_regular:false,

      share_para:{},
      show_share_pupup:false,
    }
  },
  mounted() {
    // this.init();
  },
  computed: {
    is_weixin(){
      return utils.checkUserAgent().is_weixin||false;
    },
    macross() {
      return this.$store.getters.getMacross;
    },
    // mall_token(){
    //   return utils.storageGet("mall_token")
    // },
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
      this.mall_token = utils.storageGet("mall_token");
      // this.getFavourableList();
    },
    // formatMinPrice:function(goods){
    //   var min_price = "",
    //       promote_price = Number(goods.promote_price),
    //       shop_price = Number(goods.shop_price);

    //   if(promote_price != 0){
    //     min_price = promote_price;
    //   }else{
    //     min_price = shop_price;
    //   } 
    //   return min_price.toFixed(0);
    // },
    // getFavourableList:function(){
    //   var me = this;

    //   utils.API.favourable_list({
    //     data:{
    //       "activity_name": "新人活动"
    //     }
    //   })
    //   .then(function(ret) {
    //     var list = ret.model.data[0]&&ret.model.data[0].items||[];
    //     list.forEach(function(item,index){
    //       item.favourable_brief = me.favourable_brief[index];
    //     });
    //     me.favourable_list = list;
    //   })
    //   .catch(function(ret) {
    //     !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    //   });
    // },
    // 
    // 
    
    /*分享*/
    showSharePupup:function(){
      let me = this;

      this.share_para = {
        message: {
          title: "新人福利，来领1212元现金红包呀",
          description: "买金条每克减6元，黄金理财最高加息11.7%。九江银行全程资金存管，投资更安心。",
          // thumb: this.detail.img.thumb,
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
@import "./Newbie.less";
</style>
