//切换卡片
//cardName默认显示的卡片名，cardList:[{payname:'', key:'', Chosen:false}]这种格式的值
//change事件绑定切卡
<template lang="pug">
.change-card-container
  .main(@click="showList")
    //- img.logo(src="@/assets/images/common/logo.png")
    .down 手续费支付方式
    //- .name {{paycardName}}
    .name {{mainPay.payName}}
    img.card-list-logo(src="@/assets/images/arrow.png")
  .card-list(v-show="showCardList")
    .card-list-mark(@click="hideList")
    .card-list-cont
      .card-list-header
        .cancel(@click="hideList") 取消
        .title 支付方式
      .card-list-main
        .card-list-item(v-for="(item,index) in List" @click="paychange(index)")
          //- img.card-list-logo(src="@/assets/images/common/logo.png")
          .card-list-name {{item.payName}}
          img.card-list-choose(src="@/assets/images/common/pick.png" v-show="index==n")

</template>

<script>

export default {
  name: "Wpayment",
  props:['mainPay','List'],
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
    paychange(index){
      this.$emit('paychange',index);
      this.hideList();
       this.n=index;
      this.payname = this.List[index].payname;
      this.showCardList=false;
      this.$emit('change',index);
    }
  }
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
      margin-right 5.3%
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
      display: inline-block;
      width:2.5%;
      height:0.14rem;
      margin-left: 2.5%;
      margin-right 5.3%

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
      width 100%
      height 2.5rem
      margin-top -2.5rem
      background #fff
      .card-list-header
        width 100%
        height 0.5rem
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
        /*height 2.1rem*/
        overflow-y auto
        overflow-x hidden
        .card-list-item
          margin-left  5.3%
          height 0.54rem
          line-height 0.54rem
          display flex
          align-items center
          justify-content space-between
          .card-list-name
            font-size 0.15rem
            color #333
          .card-list-choose
            width 4%
            margin-right 5.3%
        .card-list-item:nth-child(1)
          border-bottom 1px solid #dedede

</style>
