//切换卡片
//cardName默认显示的卡片名，cardList:[{name:'', key:'', isChosen:false}]这种格式的值
<template lang="pug">
.change-card-container
  .main(@click="showList")
    img.logo(src="@/assets/images/common/logo.png")
    .name {{cardName}}
    img.down(src="@/assets/images/common/dropdown.png")
  .card-list(v-show="showCardList")
    .card-list-mark(@click="hideList")
    .card-list-cont
      .card-list-header
        .cancel(@click="hideList") 取消
        .title 切换卡片
      .card-list-main
        .card-list-item(v-for="(item,index) in cardList" @click="change(index)")
          img.card-list-logo(src="@/assets/images/common/logo.png")
          .card-list-name {{item.name}}
          img.card-list-choose(src="@/assets/images/common/pick.png" v-show="item.isChosen")

</template>

<script>

export default {
  name: "YChangeCard",
  props:['cardName','cardList'],
  data(){
    return{
      showCardList: false
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
    .name
      font-size 0.16rem
      font-weight bold
      margin-left 3.5%
      width 74.7%
    .down
      width 3.5%
      height 15.6%
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
          border-bottom 0.5px solid #eaeaea
          display flex
          align-items center
          .card-list-logo
            height 29.5%
            width 7.5%
          .card-list-name
            font-size 0.15rem
            color #333
            margin-left 3.5%
            width 71.7%
          .card-list-choose
            width 4%


</style>
