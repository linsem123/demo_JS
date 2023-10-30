//切换卡片
//mainCard默认显示的卡片名及选中的卡片名，cardList:[{cardNo:'', cardKey:''}]这种格式的值
<template lang="pug">
.change-card-container
  .main(@click="showList")
    img.logo(src="@/assets/images/common/logo.png")
    .name {{mainCard.cardNo}}
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
          .card-list-name {{item.cardNo}}
          img.card-list-choose(src="@/assets/images/common/pick.png" v-show="index==cardIndex")
      .sep
  
</template>

<script>

export default {
  name: "ylChangeCard",
  props:['cardList',"mainCard","cardIndex"],
  data(){
    return{
      showCardList: false,
    }
  },
  created(){
    this.$emit("setFixed",{bl:false});
  },
  methods:{
    showList(){
      this.$emit("setFixed",{bl:true});
      this.showCardList = true
    },
    hideList(){
      this.$emit("setFixed",{bl:false});
      this.showCardList = false
    },
    change(index){
      this.$emit("setFixed",{bl:false});
      // this.cardNo = this.cardList[index].cardNo;
      this.showCardList=false;
      this.$emit('change',index);
    }
  }
}
</script>

<style scoped lang="stylus">
.change-card-container
  width 100%
  height 0.45rem
  background #fff
  .main
    width 100%
    height 100%
    display flex
    align-items center
    // justify-content space-between
    padding 0 5.3%
    box-sizing border-box
    .logo
      height 40%
      width 7.5%
    .name
      font-size 0.16rem
      font-weight bold
      margin-left 3.5%
      flex 1
    .down
      width 4%
      height 15.6%
  .card-list
    position fixed
    width 100%
    height 100%
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
      position fixed
      bottom 0
      width 100%
      background #fff
      .card-list-header
        width 100%
        height 0.5rem
        border-bottom 0.5px solid #dedede
        display flex
        align-items center
        .cancel
          font-size 0.16rem
          color #999
          margin-left 5.3%
        .title
          font-size 0.17rem
          color #333
          margin-left 26.7%
      .card-list-main
        width 100%
        max-height 2.4rem
        overflow-y auto
        overflow-x hidden
        .card-list-item
          width 100%
          height 0.6rem
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
      .sep  
        width 100%
        height 0.4rem
        background #fff

</style>
