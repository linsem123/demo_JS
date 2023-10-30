<template>
  <div>
    <!-- 头部 -->
    <top-head
      :show_border="false"
    >
      <div slot="left">
        <span class="head-icon iconfont icon-kehufuwukefu" @click="redirect('/my/guestservice')"></span>
      </div>
      <div slot="main">黄金象</div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->

    <div class="mall-index">
      <div class="top-blank"></div>

      <mt-loadmore style="min-height:calc(100vh - 1.7rem);" :top-method="loadTop" ref="loadmore">


        <section class="top-ad-banner">
          <swiper v-if="carousel&&carousel.length" :options="carousel.length>1?swiperOption:noloopSwiperOption" ref="carouselSwiper">
            <swiper-slide v-for="(item,index) in carousel" :index="index" :key="index">
              <a class="top-ad-banner-link" href="javascript:;">
                <img class="top-ad-banner-img" :src="item.image" @click="gotoNode(item,`click_homePage_banner_${index+1}`)"/>
                <!-- <img class="top-ad-banner-img swiper-lazy" :data-src="item.image" @click="gotoNode(item,`click_homePage_banner_${index+1}`)"/> -->
              </a>
              <!-- <div class="swiper-lazy-preloader"></div> -->
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </section>

        <notice
        :refresh="notice_refresh"
        @click-notice="gotoNode"
        ></notice>

        <section class="back-book-wrap">
          <ul class="back-book">
            <li class="back-book-cell">中国白银集团领投</li>
            <li class="back-book-cell">金大福珠宝集团入股</li>
            <li class="back-book-cell">九江银行资金存管</li>
          </ul>
        </section>

        <!-- 小导航 start -->
        <div class="nav">
          <a class="nav-item" @click="redirect('/activity/cjsj',`click_homePage_icon_1`);">
            <span v-if="macross" class="corner">无手续费</span>
            <div class="iconfont-wrap iconfont-wrap-1">
              <!-- <span class="iconfont icon-hjlc"></span> -->
              <svg class="svg-iconfont" aria-hidden="true">
                <use xlink:href="#icon-huangjinlicai"></use>
              </svg>
              <!-- <img v-if="macross" class="corner" style="width: 0.9rem;right:-0.58rem;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAAcCAYAAADhqahzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjU3MUE4QzlBMTEyMDExRTk4NUU5Q0Y1QzVEODRGMUFBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjU3MUE4QzlCMTEyMDExRTk4NUU5Q0Y1QzVEODRGMUFBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6M0VCOTVBQTExMTBBMTFFOTg1RTlDRjVDNUQ4NEYxQUEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6M0VCOTVBQTIxMTBBMTFFOTg1RTlDRjVDNUQ4NEYxQUEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6C+A4RAAAF4ElEQVR42uyaPYhc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" /> -->
            </div>
            <div v-if="macross" class="nav-title">黄金理财</div>
            <div v-else class="nav-title">存金送金</div>
          </a>
          <a class="nav-item" @click="redirect('/activity/invitation',`click_homePage_icon_2`);">
            <div class="iconfont-wrap iconfont-wrap-2">
              <!-- <span class="iconfont icon-fuli-copy"></span> -->
              <svg class="svg-iconfont" aria-hidden="true">
                <use xlink:href="#icon-yaoqingyouli"></use>
              </svg>
            </div>
            <div class="nav-title">邀请有礼</div>
          </a>
          <a class="nav-item" @click="redirect('/activity/newbie',`click_homePage_icon_3`);">
            <span v-if="mall_token" class="corner">优惠券</span>
            <span v-else class="corner">待领取</span>
            <div class="iconfont-wrap iconfont-wrap-3">
              <!-- <span class="iconfont icon-coupon"></span> -->
              <svg class="svg-iconfont" aria-hidden="true">
                <use xlink:href="#icon-xinshoufuli"></use>
              </svg>
              <!-- <img v-if="!mall_token" class="corner" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAcCAYAAADcO8kVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhGRUY1OTA3MEE1MDExRTk5MTcwQjI2QTBCNDY1Q0JCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhGRUY1OTA4MEE1MDExRTk5MTcwQjI2QTBCNDY1Q0JCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OEZFRjU5MDUwQTUwMTFFOTkxNzBCMjZBMEI0NjVDQkIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OEZFRjU5MDYwQTUwMTFFOTkxNzBCMjZBMEI0NjVDQkIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5Ra3P/AAAEyklEQVR42uxZTUgVURS+Y4MrXQhtdBek7tUXWKSuClSwVSkuCkJxLQq5UXRToLgWpQhCJGjjD0kEohgFia5Ti3a6dKGrIG/nu/ee9+5cZ+bOSyHyeeDw3pu5v9/9znfOzAtOm5qExwLyu+Qd5HfIb5JXkZeL/8N+kR+Rfyf/TL5CvkkuUzedAkwZ+RPyEQPGZTKA9Jz8NflpMcDcIH9LnhOX27bIH5H/jGOFa23kX0sAFGH2iL22+IC5R/6B/LooHcNeP5LfTwKmnvydV1Q7O4WorIwXrP5+Iaqrsy2nsTFxnH9g5Wbv9XwhNJ/XyN+QV/pACQYHhdzYiL/f1yfE9rYQh4fpy+jpUeOIlRUhx8c1qPhdV5fcZ29PyOlp1Ua1TTHVjtoXaRUGg2by3wzMY6+mEBMUKHNzQhwfFxjisgaMAht4kcvLUaAwDgEIQAIARGPI2VkhaSPByUm+jWLmwoIQ5po8OND3MPfOjr6Pa/hu96H1YfwkNnpAy5lM/DI0dcpIKig0STA1pdmAxbI1NJxti1O3w2l9PQJMMDamxwFbAMb8fOG3FWYAWG3CNRoLQAaYm0DB90gf/AazMQ+NGTmUFMAse0b+KjSKnFyngLqYBGhPTBQ2jQUODETZsrWlN4ONJoQQxpNdXRpAEx7B5KS6BgblASdm2Iw8w7w0AyAAyQCeP1wAw8xLNmDRAmDaU5tZG1CLRXwTOC4oXmN9Qj+c7uioBggMbG3V4YeFg+YIF3wyI3EvTrswJrdxmYC11tQUWMj6lQ3cdgBzO7UJCa1k1LFAnARtLpiZiWhJnjW47sZ1LqcZZrOpo0ODMzysnHUrjnFgYqy5GmOL9/5+JNQDBjebNQOY2tQmZsGKiggpnDBNILNPog3trT4ISwUiTprncMMS7EqbJ0Zj8uNTv6C7u9C2trYAot/qQvNAKLzii00ghJJStcsae9E29YneNhuhKyrjMCsvyhjQtjb9nT5VRs1mVaG3oEN6RUZyN59Wd+A6AaDin/UJfXDd7QNxR5u/ASZNYxh40i9ZUaG1pYjaJszCFlAdOhCsrRWoatcdroEVJv6llQXOpF8wcXExGZSYEHNZke8bU/iptL60pPWlOOCP/MDgNC1xtFOixGJi6o0zNUYM0Kod0jNO0l00i7rvhNE3TYP4PkoEu/7y215ZpmZJJ4eJIXqmzsmkVcQQVaEipEwFHBe+mWsWuw8XkFwP4RAwDz6zPsNp+xKeS+AQYijtSWy5tPe2R0HHlIcYWqxQWQghinqGKmZsEtlFpXsbAIQqHECDnXbZAD0xY6IcUI8U0BqMhfF94antfdm51d+EmqpMM1al+eLQPUWkWIBiqK9SLhhgpWEl6sh62KB5blLzG+apsOd+BJgcGtKhDhA9D5/W273NUFyEIY5xauYU1WdazQAwTZGoThKbYvHEZvDbaI804SG51HcZ5OoSAwDtwziGPQAoMl+yvcDrzosBBotHWc+peHfXzyDDNC7KFFOwgd7eqOgyOAAsS2YBiyicFHPwAJswX9IRm/fA6p2vFFcGOzGvHb4lvfMtRcNfLA8ZlCtgCkx5QL6a9jK81GzbhM+qe6NUgflB/pT8lh0+xT0rXQ79ODJg4C9apMtPIuEfSLY/AgwA5gVDX0qsWUEAAAAASUVORK5CYII=" /> -->
              <!-- <img v-else class="corner" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAcCAYAAADcO8kVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjgxMEIzQ0MzNENERTExRTlBN0U0QjMwMzU3MTk3OTc0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjgxMEIzQ0M0NENERTExRTlBN0U0QjMwMzU3MTk3OTc0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODEwQjNDQzE0Q0RFMTFFOUE3RTRCMzAzNTcxOTc5NzQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ODEwQjNDQzI0Q0RFMTFFOUE3RTRCMzAzNTcxOTc5NzQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7s0pkMAAAFWUlEQVR42uxZW2hVRxTdY0MhimKJ+lHrI7bFJxTRKBirgsVH+hf8sRVbUVQkKio2DRpEomjaihCtKFgEYxEh+iMoSP1Q/KiVoEUUrRXUILU+it6i+XO61pzHPY85j5vbHxM3bLiZO2fOzNprr73nRr2eOlUyTME/hX8Or4V/BH8P/q68OVaA/wXvhJ+Hn4S/SD10CjD94F/Dm1wwepN1w9vgu+HPkw5vs2r4r/CfeiEotEp4I/xP+Jd5gZkD/w1eI73fquDH4K2uZPhWEZk4D376DdOP/8O+gb92ZSPGmLHwjkxQpk8XGTo0PLZsGSCdV9bOVFNT6WuMxZYXLQqPrVtnH4vuOW7fwr+IMuYdeDt8YOYBli8XeflS9IYNxbG5c0Vu3BB97pyoY2DmvXuit24NP8iNTZ6cvHB9vahhw0Qnff8CReTy5fDY4MGiGhtFX78ucvu2s5c5UIIrV4rrIGiqrk50W1seqH90q9bfHjBf5dIURgiH01u2JE7R+/aJ2r5d1KlToletEnnyxPlizBhRS5emrz9+vKikyBLsKDD8+9IlUZs2iV650gF/xAjRra1+MBSAyQmKgRreDG9guabo/JGn+qi9e83m9YIF4XGyhIzZtau4oUOHRJ+GXB05Egd31Kj42jt3mkPqs2fjLwYTralHA8uMPX7sfJ45UwRB8a2mxjDIBK2z07qWpZS/T8bMylWSeSC8VB84kI07WBJiS/BASBlZuFDkwYNsxvTv7zAg7TAExLMpU/yU8s0FpcRSXk9g6nKJY3Oz8+HhQydaPGAEOBUdozGlPCZ5BlD0kiXh9XmACxfCcyHGhkm2lI2uybl4v25piYNTun1GYGZkTmPVIWO8TZGqpGUgDXR7u6jqapMm+uDB4rP371vZp2yRpADbwE1Ko6DNni3y7Fnm8znT6RMC83FWeVZr1pj8N/lLY0SCUWFUb90SGTDAEcCsF+NZK2Oi7EpizMSJ8TTv7nbSM/jdyJE+Q3179CgPYz6ocC+E6X0LNwyklQdMhMK+QDLHc/Yf5TAmCKopCABAb94cL+cEFm0DK2Xsu3QbVJHZ0B0/LpoimtR8jRsn0tWV+42GEVF9SGCMObTHwqiQs/KRTXi/FRQ3WHr4cFH795tUl/xlO3YlsFaY1HyfNEnk5s183e2OHSKjRydPgE4opgJToLKy+BxLf7DKsWmj7j19KvLqlai1a0XoSXb1qih2w9OmiT56NI/G/FtRlna73azfUGWx5e5dUeiaY2JIQ2RZ8WJdrtsTyeLFTsSZHgQF/Y5hl8tkNQtdx4QJYeHn+OrVTo+1Z49pBAmQzgamqyxg1IoVphJIR4d9QlB/aGz2wBp98aIZM+lDYBhRXiHwOXTVYPVBpdNB3WF6YL7PHm9tdtVcL3por9um4Hvdcbb93q8stqBR0ydOJAMHMQ5dA/jM/PkOI6INIXWC871SzMgePmzSyqRgWnozTSjAnB+1IUNE37mTWxpcO99jxhjhQ37HWv4UjVLr1ztCbRNKjBlwvLm8HBYKordtM+Ip167ZmenqjeY+LAItVVUihUKpv+6d7BkwvMZTWxoarBHyow4x1WfOFHsNsCWqR4rXg2iZ5w0+mCaoVqq2VnQQGJZ8aIbZB68pXoAC1dMILvubbE0JGhd63iNgWInMZiKRZ0dsul+vyWJjhXLv5zhv5cFNsoPmXEveBwHUtvJOUcVdygQnsA+1caPDEiOhXaXcrMX9/bfF+zFcy1vzjJ3jz2k/hvdF+94D5S0wRftBnP8alND59m77h6UkyJS+zhiW5O/gH9pA6UuMYSPD3xt4//hFcvyL9j8BBgDuTAjxqxSkwgAAAABJRU5ErkJggg==" /> -->
            </div>
            <div class="nav-title">新手福利</div>
          </a>
          <a class="nav-item" @click="redirect('/activity/fwbz?index=1',`click_homePage_icon_4`);">
            <div class="iconfont-wrap iconfont-wrap-4">
              <!-- <span class="iconfont icon-anquanbaozhang"></span> -->
              <svg class="svg-iconfont" aria-hidden="true">
                <use xlink:href="#icon-anquanbaozhang"></use>
              </svg>
            </div>
            <div class="nav-title">安全保障</div>
          </a>
        </div>
        <!-- 小导航 end -->



        <!-- 价格对比 -->
        <div class="panel-wrap">
          <h4 class="panel-title">
            <span class="title-cell">价格对比</span>
            <div class="price-trend" @click="redirect('/pricetrend',`click_homePage_goldPriceTrend`)">
              <span class="iconfont icon-trend"></span>
              <span>金价趋势</span>
            </div> 
          </h4>
          <vs-price
          :refresh="vs_refresh"
          ></vs-price>
        </div>
        <!-- 价格对比 -->

        <!-- 特价金30天 -->
        <div v-if="macross" class="panel-wrap">
          <special-product
          :theme="'yellow'"
          :refresh="special_refresh"
          ></special-product>
        </div>
        <!-- 特价金30天 -->

        <!-- 存金送金 -->
        <div v-if="macross" class="panel-wrap panel-wrap-type1">
          <h4 class="panel-title">
            <span class="title-cell">黄金理财</span>
            <span class="more" @click="redirect('/activity/cjsj')">更多</span>
          </h4>
          <home-cjsj
          :refresh="cjsj_refresh"
          ></home-cjsj>
        </div>
        <!-- 存金送金 -->

        <!-- 广告位 -->
        <template v-if="macross">
          <ul v-if="advertisements&&advertisements.length" class="advertisement-wrap">
            <li class="advertisement-cell" v-for="item in advertisements" @click="gotoNode(item,'click_general_activity_1')">
              <img class="advertisement-img" :src="item.image">
            </li>
          </ul>
        </template>
        <!-- 广告位 -->

        <!-- 新人专享 -->
       <!--  <div class="panel-wrap">
          <h4 class="panel-title">
            <span class="title-cell">新人专享</span>
          </h4>

          <div class="newbie-wrap">
            <img @click="redirect('/activity/newbie','click_homePage_Activity_1');" src="@/assets/images/newbie.png">
          </div>
        </div> -->
        <!-- 新人专享 -->


        <!-- 发现好货 -->
        <div class="panel-wrap panel-wrap-type1">
          <h4 class="panel-title">
            <span class="title-cell">发现好货</span>
            <span class="more" @click="redirect('/accessory');">更多</span>
          </h4>
          <div class="slider-wrap">
            <swiper v-if="hot_recommend_list.length" :options="hot_recommend_list.length>1?hotSwiperOption:noloopHotSwiperOption" ref="hotRecommendSwiper">
              <swiper-slide v-for="(item,index) in hot_recommend_list" :index="index" :key="index">
                <a class="slider-link" href="javascript:;">
                  <img class="slider-img" :key="item.img.thumb" :src="item.img.thumb"/>
                  <div class="info-wrap">
                    <h4 class="info-title">{{item.name}}</h4>
                    <div class="info-price-wrap">
                      <div class="info-price-inner">
                        <p class="info-price">{{formatedMinPrice(item)}}</p>
                        <p v-if="item.unformatted_promote_price>0" class="line-through-price">￥{{item.unformatted_shop_price}}</p>
                      </div>
                    </div>
                  </div>
                </a>
              </swiper-slide>
              <!-- <div class="swiper-pagination" slot="pagination"></div> -->
            </swiper>

          </div>
        </div>
        <!-- 发现好货 -->


        <!-- 爆款特价 -->
        <div class="panel-wrap panel-wrap-type1">
          <h4 class="panel-title">
            <span class="title-cell">爆款特价</span>
            <span class="more" @click="redirect('/goods','click_homePage_perfect_more');">更多</span>
          </h4>
          <div class="best-list-wrap">
            <div class="best-list" v-for="(item,index) in best_list" @click="toGoodsDetail(item,`click_homePage_perfect_${index+1}`,index)">
              <div class="best-img-wrap">
                <!-- <img class="best-img" :src="item.img.url"> -->
                <img class="best-img" :key="item.img.thumb" v-lazy="{src: item.img.thumb, loading:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwcHgiICBoZWlnaHQ9IjIwMHB4IiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIGNsYXNzPSJsZHMtZWNsaXBzZSIgc3R5bGU9ImJhY2tncm91bmQ6IG5vbmU7Ij48cGF0aCBuZy1hdHRyLWQ9Int7Y29uZmlnLnBhdGhDbWR9fSIgbmctYXR0ci1maWxsPSJ7e2NvbmZpZy5jb2xvcn19IiBzdHJva2U9Im5vbmUiIGQ9Ik0zMCA1MEEyMCAyMCAwIDAgMCA3MCA1MEEyMCAyMiAwIDAgMSAzMCA1MCIgZmlsbD0iI2ZmYjYwNiIgdHJhbnNmb3JtPSJyb3RhdGUoMTI0LjU2OSA1MCA1MSkiPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBjYWxjTW9kZT0ibGluZWFyIiB2YWx1ZXM9IjAgNTAgNTE7MzYwIDUwIDUxIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGVUcmFuc2Zvcm0+PC9wYXRoPjwvc3ZnPg=='}">
              </div>
              <div class="info-wrap">
                <h4 class="info-title">{{item.name}}</h4>
                <div class="info-price">{{formatedMinPrice(item)}} <span>{{item.collect_num}}人收藏</span></div>
              </div>
            </div>
          </div>
        </div>
        <!-- 爆款特价 -->

      </mt-loadmore>


      <!-- 合作伙伴 -->
      <div class="partner-wrap">
        <h4 class="partner-title">合作伙伴</h4>
        <img class="partner-img" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmsAAACoCAYAAAC/r6nXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjA1Rjg0ODE4MEE1NTExRTk5MTcwQjI2QTBCNDY1Q0JCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjA1Rjg0ODE5MEE1NTExRTk5MTcwQjI2QTBCNDY1Q0JCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDVGODQ4MTYwQTU1MTFFOTkxNzBCMjZBMEI0NjVDQkIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDVGODQ4MTcwQTU1MTFFOTkxNzBCMjZBMEI0NjVDQkIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6opfWDAACLM0lEQVR42uydBZhc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">
      </div>
      <!-- 合作伙伴 -->
      

      <div class="zhanwei"></div>

    </div>



    <!-- 未登录出的弹层 -->
    <template v-if="macross">
      <Popup
          v-model="welcome"
          pop-transition="popup-fade" 
          class="pop-modal">
        <div class="content">
          <div class="welcome-content">
            <span class="iconfont icon-guanbi2" @click="closeWelcome(false)"></span>
            <div class="welcome-btn-wrap">
              <a class="welcome-btn" href="javascript:void(0);" @click="closeWelcome(true)">立即领取</a>
            </div>
            
          </div>
        </div>
        <div class="mask"></div>
      </Popup>
    </template>




  </div>
</template>

<script>
import store from "@/vuex/index.js";
import topHead from "@/views/components/TopHead.vue";
import notice from "@/views/components/Notice.vue";
import homeCjsj from "@/views/components/HomeCjsj.vue";
import vsPrice from "@/views/components/VsPrice.vue";
import specialProduct from "@/views/components/SpecialProduct.vue";

import { Toast, Popup, Loadmore } from "mint-ui";

// import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper';

import appconfig from "@/config/appconfig.js";

import "@/assets/iconfont/iconfont.js";

let vm = null;

export default {
  components: {
    topHead: topHead,
    Popup:Popup,
    notice:notice,
    homeCjsj:homeCjsj,
    vsPrice:vsPrice,
    specialProduct:specialProduct,

    swiper:swiper,
    swiperSlide:swiperSlide,
    mtLoadmore:Loadmore,
  },
  // name: 'HelloWorld',
  data() {
    return {
      carousel:null,//轮播图
      advertisements:[],//广告banner
      cms_url: appconfig.cmsbaseurl,

      tip: "-点击加载更多-",
      info_news:{
        list:[],
        page:0,
      },

      notice_list:[],

      category:[],

      
      hot_recommend_list:[],//爆款推荐
      best_list:[],//发现好货

      mall_token:undefined,

      // hjgl_content:{},//icon黄金攻略
      // bysc_content:{},//icon保养收藏
      // flzx_content:{},//icon福利中心
      // aqbz_content:{},//icon安全保障

      welcome:false,

      special_refresh:"",
      cjsj_refresh:"",
      vs_refresh:"",
      notice_refresh:"",

      // has_show_home_welcome:false,
      // goods_page: 1,
      // goods_size: 20

      swiperOption: {
        // lazy: {
        //   loadPrevNext: true
        // },
        autoplay: { 
          delay: 5000,
          disableOnInteraction: false,
        },
        loop: true,
        notNextTick: true,
        pagination: {
          el: '.swiper-pagination'
        },
        observer:true,
        observeParents: true,
        observeSlideChildren:true,
        on: {
          click: function () {
            // 这里有坑
            // 需要注意的是：this 指向的是 swpier 实例，而不是当前的 vue， 因此借助 vm，来调用 methods 里的方法 
            // console.log(this); // -> Swiper
            // 当前活动块的索引，与activeIndex不同的是，在loop模式下不会将 复制的块 的数量计算在内。           
            const realIndex = this.realIndex;
            // vm.handleClickSlide(realIndex); 

            vm.gotoNode(vm.carousel[realIndex],`click_homePage_banner_${realIndex+1}`);
          }
        },
        // autoHeight: true, //高度随内容变化
      },
      noloopSwiperOption:{
        // lazy: {
        //   loadPrevNext: true
        // },
        autoplay: { 
          delay: 5000,
          disableOnInteraction: false,
        },
        loop: false,
        notNextTick: true,
        pagination: {
          el: '.swiper-pagination'
        },
        observer:true,
        observeParents: true,
        observeSlideChildren:true,
        on: {
          click: function () {
            // 这里有坑
            // 需要注意的是：this 指向的是 swpier 实例，而不是当前的 vue， 因此借助 vm，来调用 methods 里的方法 
            // console.log(this); // -> Swiper
            // 当前活动块的索引，与activeIndex不同的是，在loop模式下不会将 复制的块 的数量计算在内。           
            const realIndex = this.realIndex;
            vm.gotoNode(vm.carousel[realIndex],`click_homePage_banner_${realIndex+1}`);
          }
        },
        // autoHeight: true, //高度随内容变化
      },

      hotSwiperOption: {
        autoplay: { 
          delay: 5000,
          disableOnInteraction: false,
        },
        loop: true,
        notNextTick: true,
        observer:true,
        observeParents: true,
        observeSlideChildren:true,
        on: {
          click: function () {
            // 这里有坑
            // 需要注意的是：this 指向的是 swpier 实例，而不是当前的 vue， 因此借助 vm，来调用 methods 里的方法 
            // console.log(this); // -> Swiper
            // 当前活动块的索引，与activeIndex不同的是，在loop模式下不会将 复制的块 的数量计算在内。           
            const realIndex = this.realIndex;
            vm.toGoodsDetail(vm.hot_recommend_list[realIndex],`click_homePage_hot_${realIndex+1}`);
          }
        },
        // autoHeight: true, //高度随内容变化
      },
      noloopHotSwiperOption: {
        autoplay: { 
          delay: 5000,
          disableOnInteraction: false,
        },
        loop: false,
        notNextTick: true,
        observer:true,
        observeParents: true,
        observeSlideChildren:true,
        on: {
          click: function () {
            // 这里有坑
            // 需要注意的是：this 指向的是 swpier 实例，而不是当前的 vue， 因此借助 vm，来调用 methods 里的方法 
            // console.log(this); // -> Swiper
            // 当前活动块的索引，与activeIndex不同的是，在loop模式下不会将 复制的块 的数量计算在内。           
            const realIndex = this.realIndex;
            vm.toGoodsDetail(vm.hot_recommend_list[realIndex],`click_homePage_hot_${realIndex+1}`);
          }
        },
        // autoHeight: true, //高度随内容变化
      },
    };
  },
  store,
  computed: {
    macross() {
      return this.$store.getters.getMacross;
    },
    seller_id() {
      return this.$store.getters.getSellerId;
    },
    location() {
      return this.$store.getters.getLocation;
    },
    has_show_home_welcome(){
      return this.$store.getters.getHasShowHomeWelcome;
    },
    resume_stamp() {
      return this.$store.getters.getResumeStamp;
    },
    show_welcome:function(){
      return !utils.storageGet("mall_token") && !this.has_show_home_welcome;
    },
  },
  created() {
    vm = this;
  },
  mounted() {
    // this.init();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.init();
      vm.mall_token = utils.storageGet("mall_token");
      utils.trackEvent("exposure_homePage");
    })
  },
  watch:{
    resume_stamp:function(nval,oval){//app  reume
      utils.trackEvent("exposure_homePage");
    },
    show_welcome:{
      handler:function(nval,oval){
        this.welcome = nval;
      },
      immediate:true,
    }
  },
  methods: {
    init: function(is_pull) {
      var me = this;

      this.special_refresh = this.cjsj_refresh = this.vs_refresh = this.notice_refresh = new Date().getTime();
      // this.cjsj_refresh = new Date().getTime();
      // this.vs_refresh = new Date().getTime();
      // this.notice_refresh = new Date().getTime();

      // this.has_show_home_welcome = utils.storageGet("has_show_home_welcome");
      // this.activity_list = [];
      // this.hot_recommend_list = [];
      // this.best_list = [];
      // this.goods_list = [];
      this.getAdvertisements(is_pull); //获取首页广告位

      this.getMerchantGoodsCategory(function(){//获取商品分类
        me.getHotRecommandList();
      });

      this.getBestList(); //获取发现好货
    },

    loadTop:function(){
      this.init(true);
      setTimeout(()=>{
        this.$refs.loadmore&&this.$refs.loadmore.onTopLoaded();
      },1000)
    },
    closeWelcome:function(redirect){
      this.$store.commit('setHasShowHomeWelcome',true);
      if(redirect){
        this.redirect('/login');
        utils.trackEvent("click_homePage_popup");
      }
    },
    formatedMinPrice(goods){
      var price = "",
          promote_price = Number(goods.unformatted_promote_price)||"",
          shop_price = Number(goods.unformatted_shop_price)||"";

      if(promote_price != 0){
        price = goods.promote_price;
      }else{
        price = goods.shop_price;
      }

      return price;
    },

    /************获取广告位************/
    getAdvertisements: function(is_pull) {
      var me = this;
      
      utils.API.home_advertisements({
        method:"get",
      })
      .then(function(ret) {
        // console.log("ret.model:",ret.model);
        // me.$refs.carouselSwiper&&me.$refs.carouselSwiper.swiper.removeAllSlides();
        if(is_pull){
          me.carousel = null;
        }else{
          me.carousel = [];
        }
        me.advertisements = [];

        var carousel = [];
        ret.model.forEach(function(item){
          // item.image = me.cms_url+item.image;
          if(/首页顶部位/.test(item.positions)){
            carousel.push(item);
          }else if(/首页小广告位/.test(item.positions)){
            me.advertisements.push(item);
          }
        });

        if(is_pull){
          setTimeout(function(){
            me.carousel = [].concat(carousel);
          },20);
        }else{
          me.carousel = carousel;
        }
        // me.$refs.carouselSwiper&&me.$refs.carouselSwiper.swiper.update();
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    /************获取广告位************/

    /************获取icon内容************/
    // getIconContent:function(key){
    //   var me = this;

    //   utils.API["articals_category_"+key]({
    //     method:"get",
    //   })
    //   .then(function(ret) {
    //     me[key+"_content"] = ret.model&&ret.model[0]||{};
    //     me[key+"_content"].link = "##";
    //   })
    //   .catch(function(ret) {
    //     !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    //   });
    // },
    /************获取icon内容************/

    /************获取金银资讯************/
    // getInfoNews:function(){
    //   var me = this;
    //   utils.API.articals_category_jyzx({
    //     method:"get",
    //     querystring:true,
    //     data:{
    //       page:me.info_news.page,
    //     }
    //   })
    //   .then(function(ret) {
    //     var res = ret.model.map(function(item){
    //       item.link = "##";
    //       return item;
    //     })

    //     me.info_news.list = me.info_news.list.concat(res);
    //     me.info_news.page = me.info_news.page + 1;

    //     if(ret.model.length <= 0){
    //       me.tip = "-没有更多啦-";
    //     }else{
    //       me.tip = "-点击加载更多-";
    //     }
    //   })
    //   .catch(function(ret) {
    //     !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    //   });
    // },
    /************获取金银资讯************/
    





    /************获取店铺的所有分类************/
    getMerchantGoodsCategory: function(cb) {//获取店铺分类
      var me = this;

      if (this.category.length > 0) {
        cb&&cb();
        return;
      }

      utils.API.merchant_goods_category({
        data: {
          seller_id: me.seller_id
        }
      })
      .then(function(ret) {
        me.category = ret.model.data;
        cb&&cb();
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    /************获取店铺的所有分类************/

    /************通过name找到店铺的分类的id************/
    findCategoryId:function(arr,name){
      var res = null; 
      (function fun(arr,name){
        for(var i=0,len=arr.length;i<len;i++){
          if(arr[i].children&&arr[i].children.length>0){
            fun(arr[i].children,name);
          }else{
            if(arr[i].name == name){
              res = arr[i].id;
              break;
            }
          }
        }
      })(arr,name);
      return res;
    },
    /************通过name找到店铺的分类的id************/

    /************获取爆款推荐/************/
    getHotRecommandList: function() {
      var me = this,
          hot_recommand_id = this.findCategoryId(this.category,"爆款推荐");
      // if(hot_recommand_id == null){
      //   return;
      // }

      utils.API.merchant_goods_suggestlist({
        data: {
          token:me.mall_token,
          seller_id:me.seller_id,
          sort_by: "sort_order", //排序方式（默认sort_order，其他：价格从高到低price_desc，价格从低到高price_asc，最新更新last_update）
          action_type: "hot", //推荐类型（新品：new, 精品：best, 热销：hot, 促销：promotion）
          count: 10,
          page: 1,
          // "filter" : {
          //   // "category_id":hot_recommand_id,
          //   // "keywords" : "服装",
          //   sort_by: "sort_order", //排序方式（默认sort_order，其他：价格从高到低price_desc，价格从低到高price_asc，最新更新last_update）
          //   action_type: "hot",
          // },
          // "pagination":{
          //   "count":10,   
          //   "page":1,  
          // },
          // sort_by: "sort_order", //排序方式（默认sort_order，其他：价格从高到低price_desc，价格从低到高price_asc，最新更新last_update）
          // action_type: "hot", //推荐类型（新品：new, 精品：best, 热销：hot, 促销：promotion）
          // count: 10,
          // page: 1
        }
      })
      .then(function(ret) {
        var data = [];
        if (_.isArray(ret.model.data)) {
          data = ret.model.data || [];
        }
        me.hot_recommend_list = [];
        setTimeout(function(){
          me.hot_recommend_list = data;
        },500);
        
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    /************获取爆款推荐/************/

    /************获取发现好货************/
    getBestList: function() {//获取发现好货
      var me = this;
      utils.API.merchant_goods_suggestlist({
        data: {
          seller_id: me.seller_id,
          sort_by: "sort_order", //排序方式（默认sort_order，其他：价格从高到低price_desc，价格从低到高price_asc，最新更新last_update）
          action_type: "best", //推荐类型（新品：new, 精品：best, 热销：hot, 促销：promotion）
          count: 10,
          page: 1
        }
      })
        .then(function(ret) {
          me.best_list = ret.model.data;
          // var data = [];
          // if (_.isArray(ret.model.data)) {
          //   data = ret.model.data || [];
          // }

          // for (var i = 0, len = data.length; i < len; i++) {
          //   if (i < 6) {
          //     me.best_list.push(data[i]);
          //   }
          // }
        })
        .catch(function(ret) {
          !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        });
    },
    /************获取发现好货************/

    /************跳转到商品详情************/
    toGoodsDetail:function(item,event_name,index){
      this.$router.push({path: `/goods/${item.id}` });
    }.after(function(item,event_name,index){
      if(event_name){
        index?utils.trackEvent(event_name,{
          goods_id:item.id,
          index:index+1,
        }):utils.trackEvent(event_name);
      }
    }),
    /************跳转到商品详情************/

    /************运营跳转活动详情************/
    gotoNode: function(activity_name,event_name) {
      utils.gotoNode(activity_name);
    }
    .after(function(activity_name,event_name){
      if(event_name){
        utils.trackEvent(event_name);
      }
    }),
    redirect: function(path,event_name) {
      this.$router.push({path: path});
    }.after(function(path,event_name){
      if(event_name){
        utils.trackEvent(event_name);
      }
    }),
  }
};
</script>

<style lang="less" scoped>
@import './Home.less';
</style>