//短信验证码公共组件
//页面高度
//textMsg 为右侧标签的内容(因为有倒计时会更改)
//label 为左边标签，不传就是“验证码”
//@getValue 获取输入值，@getCode绑定“获取验证码”按钮事件
//clickBl 是否可点击
<template lang="pug">
  .text-code-view
    span.yzm {{lab}}
    input.ipt(v-model="idNum" placeholder="请输入验证码" type="tel" @focus="setHeight" @input="getValue" @blur="achieveValue" maxlength="6")
    .err {{err}}
    .hq(@click="getCode" :class="clickBl?'active hq':'hq'") {{textMsg}}

</template>

<script>
  export default {
    name: "YTextCode",
    props:['innerHeight','textMsg','label',"clickBl"],
    data() {
      return {
        idNum: '',
        lab:'',
        err:""
      }
    },
    created(){
      this.lab = this.label? this.label: '验证码';
    },
    methods:{
      getValue(){
        this.err="";
        if(this.idNum.length==6){
          if(this.achieveValue()){
            this.$emit('achieveValue',this.idNum);
          }else{
            this.$emit('achieveValue','');
          }
        }else{
          this.$emit('achieveValue','');
        }
      },
      setHeight(el,event){
        let e = event ||window.event;
        if(navigator.userAgent.toLowerCase().indexOf("iphone")!=-1){
          setTimeout(function(){
            let screenHeight=window.innerHeight;
            document.getElementsByTagName('body')[0].style.height = (screenHeight+280) + 'px';
            document.body.scrollTop = 280;
          }, 0)
        }
      },
      achieveValue(el){
        if(el){
          if(navigator.userAgent.toLowerCase().indexOf("iphone")!=-1){
            document.getElementsByTagName('body')[0].style.height = this.innerHeight+"px";
            let screenHeight=window.innerHeight;
            let keyboardHeight = screenHeight-this.innerHeight;
            window.scrollTo(0,el.clientY-keyboardHeight);
          }
        }
        if(this.idNum==""){
          this.err="验证码不能为空";
          this.$emit('achieveValue','');
          return false
        }else if(!/\d{6}/.test(this.idNum)){
          this.err="验证码输入有误";
          this.$emit('achieveValue','');
          return false
        }else{
          this.err="";
          this.$emit('achieveValue',this.idNum);
          return true
        }
      },
      getCode(){
        this.$emit('getCode');
      }
    }
  }
</script>

<style scoped lang="stylus">
  .text-code-view
    position relative
    width 100%
    border-bottom 0.5px solid rgba(210, 210, 210, 0.8)
    background #fff
    padding 0.125rem 0 0.125rem 5.3%
    box-sizing border-box
    span
      display inline-block
      font-size 0.15rem
      line-height 0.36rem
    .van-cell:not(:last-child)::after
      border-bottom none
    .yzm
      float left
      width 26.7%
    .ipt
      display inline-block
      width 38%
      height 0.36rem
      line-height 0.36rem
      padding 0
      font-size 0.15rem
      border none
      border-right 0.5px solid #979797
      border-radius 0
      float left
      &::-webkit-input-placeholder
        color #B5B5B5
    .hq
      font-size 0.15rem
      display inline-block
      width 30%
      color #666
      text-align center
      line-height 0.36rem
    .active 
      color #4197FE
    .err
      position absolute
      color #f00
      font-size 0.1rem
      bottom 0
      left 30%
</style>
