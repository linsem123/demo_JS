<template lang="pug">
.fail-container(v-if="show")
  .alert-box
    img(src="../../../assets/images/financial/turnmoney/fail.png")
    .title {{title}}
    .msg {{msg}}
    .err {{err}}
    .btn(@click="confirm") {{text ? text : '确定'}}

    
</template>

<script>
export default {
    name: "YFailAlert",
  props:['show','title','msg','err','text'],
  methods:{
    confirm(){
      this.$emit('confirm');
    }
  }
}
</script>

<style scoped lang="stylus">
.fail-container
  width 100vw
  height 100vh
  overflow hidden
  position fixed
  top 0
  left 0
  background rgba(0,0,0,0.4)
  z-index 999
  .alert-box
    position absolute
    left 50%
    top 40%
    width 70%
    transform translate(-50%,-50%)
    padding-top 0.24rem
    padding-bottom 0.3rem
    background #fff
    border-radius 10px
    display flex
    align-items center
    justify-content space-around
    flex-wrap wrap
    img
      width 14.5%
    .title
      width 100%
      font-size 0.18rem
      color black
      font-weight 600
      text-align center
      padding-top 0.15rem
    .msg
      width 71.6%
      text-align center
      color #333
      font-size 0.14rem
      line-height 142%
      padding-top 0.15rem
    .err
      width 50%
      text-align center
      font-size 0.12rem
      line-height 200%
      padding-top 0.08rem
      padding-bottom 0.2rem
    .btn
      width 85%
      border 1px solid #5084FF
      border-radius 17px
      color #5084FF
      text-align center
      font-size 0.14rem
      line-height 243%



</style>
