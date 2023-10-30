//版本号公共组件
//top绑定距离 version版本号
<template lang="pug">
  .version-view(:style="{marginTop: top}") &copy;本服务由兴业银行信用卡中心提供 v{{version}}
</template>

<script>
  export default {
    name: "YVersion",
    props:['top','version'],
    // computed: {
    //   version() {
    //     return this.$store.state.process.version;
    //   }
    // }
  }
</script>

<style scoped lang="stylus">
  .version-view
    width 100%
    text-align center
    font-size 0.12rem
    color #666
</style>
