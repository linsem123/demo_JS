<template>
  <!-- 分享  -->
  <div class="share-to-weixin-wrap" v-show="show">
    <div class="mask" @click="closePopup"></div>
    <div class="share-body" :style="'bottom:'+share_bottom+'rem;'">
      <h4 class="share-title">分享到</h4>
      <ul class="share-list">
        <li class="share-cell" v-for="item in share_list" @click="shareEvent(item.id)">
          <span class="iconfont" :class="'icon-'+item.icon"></span>
          <p class="share-name">{{item.name}}</p>
        </li>
      </ul>
    </div>
  </div>
  <!-- 分享  -->
</template>

<script>
import appconfig from "@/config/appconfig.js";
import { Toast, MessageBox } from "mint-ui";

export default {
  props:["show","to_bottom","share_para","track_event_name"],
  props: {
    show: {
      //是否显示border
      type: Boolean,
      default: false,
    },
    to_bottom: {
      //是否展示返回按钮
      type: Number,
      default: 0.98,
    },
    share_para:{
      type: Object,
      default: {},
    },
    track_event_name:{
      type: Object,
      default: null,
    }
  },
	components: {
	},
  data() {
    return {
      share_list:[
        {
          id: 1,
          icon:"weixin",
          name: "微信好友"
        }, {
          id: 2,
          icon:"pengyouquan",
          name: "朋友圈"
        }
      ],
      share_bottom:-3.47,
    }
  },
  computed: {
  },
  watch:{
    show:function(nval,oval){
      if(nval == true){
        this.showPupup();
      }
    },
  },
  mounted() {
  },
  methods:{
    showPupup:function(){
      setTimeout(()=>{
        this.share_bottom = this.to_bottom;
      },100);
    },
    closePopup:function(){
      this.share_bottom = -3.47;
      setTimeout(()=>{
        this.$emit("close-share-popup");
      },300);
    },
    shareEvent:function(id){
      switch(id){
        case 1:
          this.$emit("close-share-popup");
          try {
            this.shareTo(Wechat.Scene.SESSION);
            utils.trackEvent('me_recommend_to_wechat');
          } catch (error) {
            MessageBox.alert('无法完成分享操作!');
          }
          break;
        case 2:
          this.$emit("close-share-popup");
          try {
            this.shareTo(Wechat.Scene.TIMELINE);
            utils.trackEvent('me_recommend_to_moments');
          } catch (error) {
            MessageBox.alert('无法完成分享操作!');
          }
          break;
      }
    },
    shareTo: function(scene) {
      var me = this,
          pageurl = appconfig.appbaseurl + "/#/login";

      // if(invite_code) {
      //   pageurl = pageurl + "?invite_code=" + invite_code;
      // }

      try {
        if (utils.checkUserAgent().is_ios || utils.checkUserAgent().is_android) {
          //移动端
          Wechat.isInstalled(function(installed) {
            if (installed) {
              var para = {
                message: {
                  title: "黄金象",
                  description: "我发现这里买黄金很值，每克能省9块钱，你也看看吧",
                  thumb: "https://mmbiz.qlogo.cn/mmbiz_png/59A7vdb3MHufFW2gVMVOvjzqteRvnicjGlaCjtkIN29stXHzgbjm0KNLiaCoRBEOZgHckVDtMnYeWA6uLCTgD45A/0?wx_fmt=png",
                  media: {
                    type: Wechat.Type.WEBPAGE,
                    webpageUrl: pageurl
                  }
                },
                scene: scene // share to Timeline
              };

              
              para = _.merge(para,me.share_para);

              if(scene == Wechat.Scene.TIMELINE){//Wechat.Scene.SESSION：好友；Wechat.Scene.TIMELINE：朋友圈
                para.message.title = para.message.description;
              }


              Wechat.share(para, function() {
                //分享成功
                // alert("分享成功");
                // Toast("分享成功");
                if(track_event_name){
                  utils.trackEvent(me.track_event_name.share_success);
                }
                
              }, function(reason) {
                //分享失败
                // Toast("分享失败");
                if(track_event_name){
                  utils.trackEvent(me.track_event_name.share_fail);
                }
              });
            } else {
              Toast("请先安装微信客户端!");
            }
          }, function(reason) {});
        } else if (utils.checkUserAgent().is_weixin) {
          //微信端
          Toast("该功能暂不提供!");
        }
      } catch (error) {
        MessageBox.alert('请升级app至最新版本!');
        //由于app外壳版本过低，未安装微信分享cordova插件
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";

.share-to-weixin-wrap {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999999;
  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    background:rgba(0,0,0,0.3);
  }
  .share-body {
    width: 100%;
    height:3.46rem;
    position: absolute;
    transition: all 0.3s ease;
    z-index: 10;
    background:#ffffff;
    padding:0.4rem 0;
    box-sizing: border-box;
    text-align: center;
    .share-title {
      font-size:0.36rem;
      margin:0 auto;
      display: inline-block;
      font-weight:normal;
      position: relative;
      &:before {
        content:"";
        display: block;
        position:absolute;
        width:0.53rem;
        height:1px;
        top:50%;
        left:-0.78rem;
        margin-top:-1px;
        background: -webkit-linear-gradient(-90deg, #e5d197 , #fbfbfb); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(-90deg, #e5d197, #fbfbfb); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(-90deg, #e5d197, #fbfbfb); /* Firefox 3.6 - 15 */
        background: linear-gradient(-90deg, #e5d197 , #fbfbfb); /* 标准的语法 */
      }
      &:after {
        content:"";
        display: block;
        position:absolute;
        width:0.53rem;
        height:1px;
        top:50%;
        right:-0.78rem;
        margin-top:-1px;
        background: -webkit-linear-gradient(90deg, #e5d197 , #fbfbfb); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(90deg, #e5d197, #fbfbfb); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(90deg, #e5d197, #fbfbfb); /* Firefox 3.6 - 15 */
        background: linear-gradient(90deg, #e5d197 , #fbfbfb); /* 标准的语法 */
      }
    }
    .share-list {
      display: flex;
      justify-content: space-around;
      margin-top:0.6rem;
      .share-cell {
        text-align: center;
        .iconfont {
          font-size: 1rem;
          color:#07b906;
          border-radius: 100%;
          &.icon-weixin {
            color:#5ec55e;
            box-shadow: 0px 0px 16px 1px rgba(26,173,25,0.5);
          }
          &.icon-pengyouquan {
            color:#86a8f4;
            box-shadow: 0px 0px 16px 1px rgba(82,131,240,0.5);
          }
        }
        .share-name {
          margin-top: 0.3rem;
          font-size:0.3rem;
          line-height: 0.3rem;
        }
      }
    }
  }
}
</style>