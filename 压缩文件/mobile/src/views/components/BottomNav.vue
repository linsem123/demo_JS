<template>
  <div>
    <section class="nav_bottom" :class="isGtIphonex?'fix-gt-phonex':''">
      <div class="nav_bottom-inner">
        <a @click="redirect('/',true)" class="nav-item" :class="currentView === ''?'active':''">
          <div class="iconfont" :class="currentView === ''?'icon-shouyefill':'icon-shouye'"></div>
          <div class="nav-title">首页</div>
        </a>
        <a @click="redirect('/goods')" class="nav-item" :class="currentView === 'goods'?'active':''">
          <!-- <img class="nav-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAcCAYAAADcO8kVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyMzUyNzU0NEQxNjExRTlBN0U0QjMwMzU3MTk3OTc0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQyMzUyNzU1NEQxNjExRTlBN0U0QjMwMzU3MTk3OTc0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODEwQjNDQzU0Q0RFMTFFOUE3RTRCMzAzNTcxOTc5NzQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ODEwQjNDQzY0Q0RFMTFFOUE3RTRCMzAzNTcxOTc5NzQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5bTN+gAAAETUlEQVR42uRZT0gUURx+z5Yg0Cg6hNIlKjsG/rkU5SLRodRDJ82gLoqH6CDYn0OIdKkMD0EgSnQo0UMe/HNM0VskK3SVboF2ikqhm9P3vXlvdpyd92Z2WRdcf/DB7s6bmff7ft/vz8zK3ZYWkWASuArcAq4A54GTwFFxcOwvsAXkgCVgFvjjdNpBTA1wH3iqyagm+we8AV4Av23Ox9lZ4AvwrgpJoR0DHgPfgd60xGSBr0CrqH47BXwEXuqSEVgmsvAGsHDA6kc57BGwq8tGgWIuAp9Sk1JXV1iw+vuFqK8v33abm4s+Re2hhPNgT4A7UWKOAB/ornOTHR1CDg4KOTUl5NxcITl9fUI0NCQ6K+fnhejpsZOI68rhYSFHR4VobCzOPexBlkYM7S1wOpxK96w1hZtcXs5/30LXW1wU3sqKENvbbkXFHd/YEN7EhJAkBiSLXE54uB6vGRAHUniu19vr369ydgJ4Bjxgu2bR2XB2H0YNDimZNjUJb2AgfwwqUiRMTwu5tqaOSf4GNexZF2dYIzs7/WvU1qp7KGVOTirynKRblCTHx/3AGaKjlsulaeUNVMy1xJbMDdtymk5RBaHfvLExP9V4zLZBrT5vYUFIppQhWBOmYFMLSFEE2Iwpz+vFmNea2GzZym+TmJvOZdwEJU9j/UBkzaaUIhBhb2Zm7zlMA0Sd53mrq4UpRQLa2vzNUyGMcFeXTwRTiXWCdYi/UzkWguKcpGrjFKfUzhqYzq6z+F52LqFT6+s+aDs7+e/ZrF2eSC2uVbUkmJCyilTWLP5O0rz2duGNjOSdZ80B4Yp0phoICgJTObtExVxwLqHcNfuyuzsonuo7uwZTxVKEVZFlpEz0qCQqKEyELdIkiIST/HKOAOnsTEY/ECabqQG6bQu9aWuB1TVCdZZw4UsufnuN3a/ydjyTaqBjy2bkqQ7WHHxmZL2hIaujKoVIHGuHacOugmlmEFsd0CmWagBkUKLHilRdJtU0SSdJAOXPNoxU4JBXsFGuYVpxE6whTJnw/OJo34ltNiZdrUQ7ulJK204mhjmOKDLyauYwTtLpSBtXjlNd3DBJCjtJx0LqUqrb3Ny7hsRzje6ESpGOIXIfu9KPmsQlHLxwo4KWaSm6qoNoVTkHRm6SHc5S8AOCY57JktQXSyLmpSLO+ZZMDFuqawoNT7FIL84nagNJwxnbua2wsntpJ2LJiagvlRk1prOlZGJcz0OhwqxIMelkm5QNKSQb03HSfQNyOBZU9u3ebKbk0zmsQR1UiDJMv0nPNwEpJs1M59CK8KJB0OSoxws2AKps/+09X3eWTIwiBfVHRT5u7I9TQLS9M/1M92BaxXUkoxzH81oZje9/nyv/8HTtVdW7OKqQ3a601xV3ganUc8yBsmKLct5GDSnRV5uH2V4L/1+D4ibfKrZfwMOwUg67YtiSXwHn4kg5TIrhX7Q/hf8X7WeR4i/a/wIMAMwS16lH6UH8AAAAAElFTkSuQmCC"> -->
          <span class="corner" :class="{ animation:mall_token }">秒杀中</span>
          <div class="iconfont" :class="currentView === 'goods'?'icon-buygoldfill':'icon-buygold'"></div>
          <div class="nav-title">买金条</div>
        </a>
        <a @click="redirect('/accessory')" class="nav-item" :class="currentView === 'accessory'?'active':''">
          <div class="iconfont" :class="currentView === 'accessory'?'icon-accessoryfill':'icon-accessory'" ></div>
          <div class="nav-title">饰品</div>
        </a>
        <a @click="redirect('/order/cart',true)" class="nav-item" :class="currentView === 'order/cart'?'active':''">
          <div class="iconfont" :class="{ 'icon-gouwuchefill':currentView === 'order/cart','icon-gouwuche':currentView !== 'order/cart','cart-rotate':cart_animating }"></div>
          <div class="nav-title">购物车</div>
        </a>
        <a @click="redirect('/my',true)" class="nav-item" :class="currentView === 'my'?'active':''">
          <template v-if="mall_token">
            <div class="iconfont" :class="currentView === 'my'?'icon-people_fill':'icon-people'"></div>
            <div class="nav-title">我的</div>
          </template>
          <img v-else class="unregister-img rotate" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAABWCAYAAACO7cvVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkVDRTEyOTA4MEREOTExRTk4NUU5Q0Y1QzVEODRGMUFBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkVDRTEyOTA5MEREOTExRTk4NUU5Q0Y1QzVEODRGMUFBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RUNFMTI5MDYwREQ5MTFFOTg1RTlDRjVDNUQ4NEYxQUEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RUNFMTI5MDcwREQ5MTFFOTg1RTlDRjVDNUQ4NEYxQUEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5QMEv8AAAngUlEQVR42tx9CZhd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">
        </a>
      </div>
    </section>

    <div class="absolute-amount" :class="move_tocart?'move-tocart':''">
      <img src="">
    </div>
  </div>
	
</template>

<script>
import store from "@/vuex/index.js";

export default {
  data() {
    return {
      whereis: "",
      currentView:"",

      cart_animating:false,
      move_tocart:false,

      mall_token:"",
      // rotate:false,
      // interval:null,
    };
  },
  mounted() {
    this.initBar();
  },
  store,
  computed:{
    cart_animate_trigger() {
      return this.$store.getters.getCartAnimateTrigger;
    },
    isGtIphonex(){
      return utils.isGtIphonex()
    },
  },
  watch: {
    "$route.fullPath": function(nval, oval) {
      this.initBar(nval);
    },
    "cart_animate_trigger":function(nval, oval){
      if(!this.mall_token){
        return;
      }

      let $el = nval.img,
          rect = $el.getBoundingClientRect(),
          $absolute_amount = document.querySelector(".absolute-amount");

          $absolute_amount.children[0].src = $el.src;

      this.setElPosition($absolute_amount,rect,()=>{
        this.startAnimate();
      });
    }
  },
  methods: {
    initBar: function(hash) {
      var hash = window.location.hash;

      this.mall_token = utils.storageGet("mall_token");
      this.currentView = hash.replace("#/","");

      // if(!this.interval){
      //   this.addRotateClass();
      // }
    },
    // addRotateClass:function(){
    //   if(this.mall_token ){
    //     return;
    //   }

    //   this.interval = setInterval(()=>{
    //     this.rotate = !this.rotate;
    //     setTimeout(()=>{
    //       this.rotate = !this.rotate;
    //     },300);
    //   },5000);
    // },
    redirect: function(path,replace) {
      if(replace){
        this.$router.replace({path: path});
      }else{
        this.$router.push({path: path});
      }
    }.after(function(str) {
      switch (str) {
        case "/":
          utils.trackEvent("click_homepage");
          break;
        case "/goods":
          utils.trackEvent("click_buygold");
          break;
        case "/accessory":
          utils.trackEvent("click_accessory");
          break;
        case "/order/cart":
          utils.trackEvent("click_cart");
          break;
        case "/my":
          utils.trackEvent("click_my");
          break;
      }
    }),


    setElPosition:function($el,rect,cb) {
      $el.style.top = (rect.y+rect.height/2 - 10)+"px";
      $el.style.left = (rect.x+rect.width/2 - 10)+"px";

      setTimeout(function(){
        cb&&cb();
      },10);
    },

    startAnimate:function(){
      this.move_tocart = true;
      setTimeout(()=>{
        this.move_tocart = false;
        this.cart_animating = true;
        setTimeout(()=>{
          this.cart_animating = false;
        },1000)
      },500);
    },
  }
};
</script>

<style lang="less" scoped>

@import "~@/assets/less/variable.less";
// @blue: #225bf4;

.nav_bottom {
  position: absolute;
  bottom:0;
  width: 100%;
  background-color: #fff;
  border-top: 0.02rem solid #e4e6e7;
  font-size: 0.2rem;
  z-index: 400;
  box-sizing: border-box;
  &.fix-gt-phonex {
    padding-bottom:0.4rem;
  }
  .nav_bottom-inner {
    height: 1rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .nav-item {
    text-align: center;
    color: #757c8f;
    position: relative;
    .corner {
      left: 0.5rem;
      top: -0.06rem;
      &.animation {
        -webkit-animation:10s infinite buyRotate; /*调用动画*/
        animation:10s infinite buyRotate;
      }
    }
    .unregister-img {
      width: 0.8rem;
      height:0.86rem;
      display: block;
      &.rotate {
        -webkit-animation:5s infinite registerRotate; /*调用动画*/
        animation:5s infinite registerRotate;
      }
    }
    &.active {
      .iconfont {
        color:#434343;
      }
      color:#434343;
    }
    .iconfont {
      font-size: 0.5rem;
      line-height: 0.45rem;
      text-align: center;

      &.cart-rotate {
        -webkit-animation:0.2s cartRotate; /*调用动画*/
        animation:0.2s cartRotate;
      }
    }
    .nav-title {
      font-size: 0.2rem;
      line-height: 0.2rem;
      margin-top: 0.08rem;
    }
  }
}



.absolute-amount {
  width:20px;
  height:20px;
  text-align:center;
  position: absolute;
  display: none;
  z-index:999999;
  top:50%;
  left:14%;
  &.move-tocart {
    display: inline-block;
    -webkit-animation:0.5s moveTocart ease-out; /*调用动画*/
    animation:0.5s moveTocart ease-out;
  }
  img {
    width: 100%;
    height:100%;
    border-radius: 50%;
    box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.2);
  }
}


@-webkit-keyframes moveTocart { /*声明动画*/
  0% {
    display: inline-block;
  }
  100%{
    top: 94%;
    left:69%;
  }
}
@keyframes moveTocart {
  0% {
    display: inline-block;
  }
  100%{
    top: 94%;
    left:69%;
  }
}
</style>