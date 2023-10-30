//图形验证码
//@refresh重新获取图片 @getMove获取最终移动距离
//bgImg大图 slideImg滑块图
<template lang="pug">
  .image-code-view(v-show="show")
    .main
      .refresh
        img(src="@/assets/images/common/refresh.png" @click="refresh")
      .pic
        img.bg(:src="bgImg" ref="bg")
        img.target(:src="slideImg" ref="slide")
      .validate 向右拖动滑块完成验证
        img(src="@/assets/images/common/slide.png" ref="arrow" @touchmove="touchmove" @touchstart.prevent="touchstart" @touchend="touchend")

</template>

<script>
  export default {
    name: "YImageCode",
    props: ['bgImg', 'slideImg','show'],
    data(){
      return{
        originX: 0,
        moveX: 0,
      }
    },
    methods: {
      touchstart(e){
        this.originX = e.targetTouches[0].pageX;
      },
      touchmove(e){
        var slide = this.$refs.slide;
        var arrow = this.$refs.arrow;
        this.moveX = e.targetTouches[0].pageX - this.originX;
        if (this.moveX < 0 || (this.moveX + this.$refs.slide.width) >= this.$refs.bg.width) {
          arrow.style.left = 0;
          slide.style.left = 0;
          this.moveX = 0;
          return false;
        }
        arrow.style.left = this.moveX + 'px';
        slide.style.left = this.moveX + 'px';
      },
      touchend(e){
        this.$emit('getMove',(Number)(this.moveX * 250.0 / this.$refs.bg.width).toFixed(2));
        this.$refs.slide.style.left = 0;
        this.$refs.arrow.style.left = 0;
      },
      refresh() {
        this.$emit('refresh');
      },
    }
  }
</script>

<style scoped lang="stylus">
  .image-code-view
    width 100vw
    height 100vh
    position fixed
    left 0
    top 0
    overflow hidden
    z-index 300
    background rgba(0, 0, 0, 0.4)
    .main
      width 80%
      position fixed
      padding 20px 10px
      left 50%
      top 40%
      transform translate(-50%, -50%)
      z-index 301
      border-radius 8px
      background #fff
      display flex
      justify-content space-around
      flex-wrap wrap
      .refresh
        position relative
        height 16px
        width 86%
        img
          float right
          height 100%
      .pic
        position relative
        width 86.7%
        height 150px
        margin-top 3%
        .bg
          position relative
          width 100%
          height 100%
          z-index 303
        .target
          position relative
          width 20%
          height 100%
          margin-top -150px
          z-index 304
          float left
      .validate
        width 86%
        height 50px
        position relative
        z-index 302
        background #F0F0F0
        border 1px solid rgba(151, 151, 151, 0.50)
        border-radius 2px
        text-align center
        font-size 0.14rem
        line-height 50px
        color rgba(0, 0, 0, 0.5)
        margin-top 4%
        img
          position relative
          float left
          height 100%
</style>
