//短信验证码公共组件
//textMsg 为右侧标签的内容(因为有倒计时会更改)
//@getValue 获取输入值，@getCode绑定“获取验证码”按钮事件
<template lang="pug">
  .text-code-view
    span.yzm 验证码
    van-field.ipt(v-model="idNum" placeholder="请输入验证码" type="tel" @input="achieveValue" @blur="getValue" maxlength="6")
    .hq(@click="getCode") {{textMsg}}

</template>

<script>
  export default {
    name: "BTextCode",
    props:['textMsg'],
    data() {
      return {
        idNum: ''
      }
    },
    methods:{
      getValue(){
        this.$emit('getValue',this.idNum);
      },
      achieveValue(){
        this.$emit('achieveValue',this.idNum);
      },
      getCode(){
        this.$emit('getCode');
      }
    }
  }
</script>

<style scoped lang="stylus">
  .text-code-view
    width 100vw
    height 0.54rem
    border-bottom 0.5px solid rgba(210, 210, 210, 0.8)
    background #fff
    padding-left 5.3%
    span
      display inline-block
      font-size 0.15rem
      line-height 0.54rem
    .van-cell:not(:last-child)::after
      border-bottom none
    .yzm
      float left
      width 26.7%
    .ipt
      display inline-block
      width 38%
      height 0.24rem
      top 0.15rem
      padding 0
      font-size 0.15rem
      line-height 0.24rem
      border-right 0.5px solid #979797
      float left
      &::-webkit-input-placeholder
        color #B5B5B5
    .hq
      font-size 0.15rem
      display inline-block
      width 30%
      color #4197FE
      text-align center
      line-height 0.54rem

</style>
