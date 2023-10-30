//公共功能按钮组件
//text为按钮字，dis绑定为可用还是不可用状态
//click事件用@click.native触发
<template lang="pug">
.func-btn(:class="dis ? 'cc' : 'nn'" @click="checktable") {{text}}

</template>

<script>
  export default {
    name: "YFunctionBtn",
    props:['text','dis'],
    methods:{
      checktable(){
        this.$emit('checktable');
      }
    }
  }
</script>

<style scoped lang="stylus">
  .func-btn
    width 89.3vw
    height 12vw
    border-radius 6vw
    text-align center
    font-size 0.16rem
    color #fff
    line-height 12vw
    margin-left 5.3%
    margin-top 0.34rem
  .nn
    background #CCD0D8
  .cc
    background #0076FF
</style>
