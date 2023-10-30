//confirm回调(必须)
//show 是否展示 msg消息 err 错误代码
//text为按钮文字，默认为“确定”
<template lang="pug">
.err-view(v-show="show")
  .dialog
    .dialog-content
      .dialog-message {{msg}}
        .dialog-error(v-show="err.length > 0 && err") ERR：{{err}}
    .dialog-footer
      span(@click="confirm") 确定
  .dialog-overlay
    
</template>

<script>
export default {
  name: "YErrorAlert",
  props:['msg','err','show','text'],
  data(){
    return{
      btnText: '确定'
    }
  },
  created(){
    this.btnText = this.text ? this.text : '确定';
  },
  methods:{
    confirm(){
      // this.isShow = false;
      this.$emit('confirm');
    }
  }
}
</script>

<style scoped lang="stylus">
.err-view
  background #fff
  user-select none
  .dialog
    position fixed
    top 40%
    left 50%
    width 70%
    transition 0.2s
    overflow hidden
    font-size 0.16rem
    border-radius 8px
    background #fff
    transform translate3d(-50%,-50%,0)
    z-index 9999
    &-content
      padding 0
      margin 0
      border-bottom 1px solid #eaeaea
    &-message
      padding 20px
      line-height 150%
      text-align center
      max-height 40vh
    &-error
      line-height 150%
      text-align center
      color rgba(0,0,0,0.4)
      font-size 0.12rem
    &-footer
      color #0060F1
      span
        display inline-block
        text-align center
        width 100%
        font-size 0.17rem
        line-height 280%
  .dialog-overlay
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    background rgba(0,0,0,0.4)
    z-index 9998
</style>
