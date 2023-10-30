//切换卡片
//mainCard默认显示的卡片名及选中的卡片名，cardList:[{cardNo:'', cardkey:''}]这种格式的值
<template lang="pug">
.change-card-container
  .main(@click="showList")
    <!--img.logo(src="@/assets/images/common/logo.png")-->
    .down 手续费支付方式
    .name {{mainCard.cardNo}}
    img.card-list-logo(src="@/assets/images/common/to.png")
    <!--img.down(src="@/assets/images/common/dropdown.png")-->
  .card-list(v-show="showCardList")
    .card-list-mark(@click="hideList")
    .card-list-cont
      .card-list-header
        .cancel(@click="hideList") 取消
        .title 支付方式
      .card-list-main
        .card-list-item(v-for="(item,index) in cardList" @click="change(index)")
          <!--img.card-list-logo(src="@/assets/images/common/logo.png")-->
          .card-list-name {{item.cardNo}}
          img.card-list-choose(src="@/assets/images/common/pick.png" v-show="index==n")

</template>

<script>

export default {
  name: "ylChangeCard",
  props:['cardList',"mainCard"],
  data(){
    return{
      showCardList: false,
      n:0
    }
  },
  methods:{
    showList(){
      this.showCardList = true
    },
    hideList(){
      this.showCardList = false
    },
    change(index){
      this.n=index;
      this.cardNo = this.cardList[index].cardNo;
      this.showCardList=false;
      this.$emit('change',index);
    }
  }
}
</script>

<style scoped lang="stylus">
.change-card-container
  width 100vw
  height 12vw
  background #fff
  .main
    width 100%
    height 100%
    display flex
    align-items center
    .logo
      margin-left 5.3%
      height 40%
      width 7.5%
    .down
      font-size 0.15rem
      margin-left 5.3%
      width 40.7%
      margin-right 20.5%
      font-font-family PingFangSC-Regular
      color #333333
    .name
      width 32.6%
      font-family  PingFangSC-Regular
      font-size 0.15rem
      color  #000000
      text-align right
    .card-list-logo
      width 0.14rem
      height 0.14rem
      margin-right  7%
    /*.name*/
      /*font-size 0.16rem*/
      /*font-weight bold*/
      /*margin-left 3.5%*/
      /*width 74.7%*/
    /*.down*/
      /*width 3.5%*/
      /*height 15.6%*/
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
      height 44vh
      margin-top -44vh
      background #fff
      .card-list-header
        width 100%
        height 18.5%
        border-bottom 0.5px solid #dedede
        display flex
        align-items center
        .cancel
          font-size 0.15rem
          color #999
          margin-left 5.3%
        .title
          font-size 0.17rem
          color #333
          margin-left 26.7%
      .card-list-main
        width 100%
        height 81.5%
        overflow-y auto
        overflow-x hidden
        .card-list-item
          width 100%
          height 23%
          margin-left 5.3%
          /*border-bottom 0.5px solid #eaeaea*/
          display flex
          align-items center
          /*.card-list-logo*/
            /*height 29.5%*/
            /*width 7.5%*/
          .card-list-name
            font-size 0.15rem
            color #333
            /*margin-left 3.5%*/
            width 86%
          .card-list-choose
            width 4%


</style>
