//需要展示code的alert组件,不需要code请直接调用this.$dialog.alert
//show绑定是否展示，title绑定标题（空时不显示），msg绑定弹窗内容，err绑定错误代码
//@confirm为确定按钮事件
<template lang="pug">
.alert-view
  van-dialog(v-model="show" :title="title" @confirm="confirm")
    .content
      .msg {{msg}}
      .err ERROR：{{err}}

</template>

<script>
    export default {
        name: "YAlert",
      props:['show','title','msg','err'],
      methods:{
          confirm(){
            this.$emit('confirm');
          }
      }
    }
</script>

<style scoped lang="stylus">
  .alert-view
    .van-dialog__header
      padding-top 12px
    .content
      display flex
      justify-content space-around
      flex-wrap wrap
      .msg
        width 80%
        margin-top 12px
        margin-bottom 12px
        max-height 100px
        overflow-y auto
        text-align center
        color #2d2d2d
        font-size 0.15rem
      .err
        color #b2b2b2
        font-size 0.12rem
        padding-top 2%
        padding-bottom 4%
        /*text-align left*/
        /*width 80%*/

</style>
