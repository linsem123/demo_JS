//切换费率
//mainpay当前选中数组（frateList）里的某项，n索引(选中项显示✔图片)，frateList:[{period:'', rate:''}]这种格式的值；period(期数），rate(费率)
//ratechange事件绑定切换费率
<template lang="pug">
.change-card-container
  .main(@click="showList")
    .down 还款期数
    .name {{mainpay.period}}期
    img.card-list-logo(src="@/assets/images/arrow.png")
  .card-list(v-show="showCardList")
    .card-list-mark(@click="hideList")
    .card-list-cont
      .card-list-header
        .cancel(@click="hideList") 取消
        .title 
      .card-list-head
           span.card-list-title 期数
           span.card-list-route 手续费率
      .card-list-main
        .card-list-item(v-for="(item,index) in frateList" v-show="true" @click="ratechange(index)")
          .card-list-period {{item.period}}期
          .card-list-zz {{Number((parseFloat(item.rate)*100).toFixed(6)).toFixed(2)}}%
            span(v-show="showPeriod") /期
          .card-list-text(v-show="false") 红包可以优惠
          img.card-list-choose(src="@/assets/images/common/pick.png" v-show="index==n")
</template>

<script>
//  .card-list-name {{data.period}}期
//  .card-list-name {{data.period}}期

// <div class="card-list-item" v-for="(item,index) in fenrmb" @click="ratechange(index)"></div>
  //  <div class="card-list-name" v-show="false">{{item.period}}</div>
    // .card-list-rate {{item.rate}}/期
import {mapActions,mapState,mapGetters} from "vuex";
export default {
  name: "YChangeCard",
  props:['mainpay','n','frateList','showPeriod'],
  data(){
    return{
      showCardList: false,
      two:false,
    }
  },
  methods:{
    showList(){
      this.showCardList = true
      
    },
    hideList(){
      this.showCardList = false
    },
    ratechange(index){

      // this.period = this.fenrmb[index].period;
      this.showCardList=false;
      this.$emit('ratechange',index);
      this.hideList();
    }
  },

}
</script>

<style scoped lang="stylus">
.change-card-container
  width 100vw
  height 0.44rem
  background #fff
  line-height 12vw
  .main
    width 100%
    height 100%
    display flex
    align-items center

    .logo
      margin-left 5.3%
      height 40%
      width 7.5%
    .name
      font-size 0.15rem
      width 24.7%
      font-font-family PingFangSC-Regular
      color #000000
      text-align right
    .card-list-logo
      display: inline-block;
      width:2.5%;
      height:0.14rem;
      margin-left:2.5%;
      margin-right  5.3%
    .down
      margin-right 42.5%
      font-size 0.16rem
      margin-left 5.3%
      width 40.7%
      font-font-family PingFangSC-Regular
      color #333333 
  .card-list
    position fixed
    width 100vw
    height 100vh
    top 0
    left 0
    bottom 0
    right 0
    overflow hidden
    z-index 999
    .card-list-mark
      width 100%
      height 100%
      background rgba(0,0,0,0.4)
    .card-list-cont
      position relative
      width 100vw
      height 80vh
      margin-top -80vh
      background #fff
      .card-list-header
        width 100%
        height 0.5rem
        display flex
        align-items center
        border-bottom 0.5px solid #dedede
        .cancel
          font-size 0.15rem
          color #999
          margin-left 5.3%
        .title
          font-size 0.17rem
          color #333
          margin-left 26.7%
      .card-list-head
        border-bottom 0.5px solid #dedede
        height 0.5rem
        line-height 0.5rem
        font-family PingFangSC-Regular
        font-size 0.14rem
        color #666666
        padding-left 0.5rem
        .card-list-route
          margin-left 0.94rem
      .card-list-main
        width 100%
        height 81.5%
        overflow-y auto
        overflow-x hidden
        .card-list-item
          width 100%
          height 0.52rem
          margin-left 10.6%
          border-bottom 0.5px solid #eaeaea
          display flex
          align-items center
          font-size 0.17rem
          .card-list-zz
            /*margin-left 28%*/
            width 1rem
            text-align right
          .card-list-period
            width 0.4rem
            text-align right
            margin-right 0.5rem
          .card-list-logo
            height 29.5%
            width 7.5%
          .card-list-name
            font-size 0.15rem
            color #333
            margin-left 3%
            width 25%
            height 100%
            line-height 0.7rem
          .card-list-rate
            width 18.2%
            height 100%
            line-height  0.7rem
          .card-list-text
            margin-left 10%
            color #F63E4B
            font-family PingFangSC-Regular
            font-size  12px 
          .card-list-choose
            width 4%
            position absolute
            right 0.15rem
</style>
