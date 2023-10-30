<template>
  <div id="app">
    <!-- <transition :name="transitionName"> -->
      <!-- <navigation>
        <router-view class="Router">
        </router-view>
      </navigation> -->

      <transition :name="transitionName">
        <router-view class="Router" v-if="!$route.meta.keepAlive"></router-view>
      </transition>

      <transition :name="transitionNameKeepalive">
        <keep-alive>
          <router-view class="Router" v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
      </transition>

      <!-- <router-view class="Router" v-if="!$route.meta.keepAlive"></router-view> -->
    <!-- </transition> -->

    

    <bottom-nav v-show="show_bottom_bar"></bottom-nav>

    <!-- 更新弹层 -->
    <Popup
        v-model="show_update"
        pop-transition="popup-fade" 
        class="pop-modal update-model">
      <div class="content">
        <span v-if="version_info.updateStrategy!=2" class="iconfont icon-close2" @click="show_update=!show_update"></span>
        <div class="tips">友情提示：新版本-功能齐全且非常重要，请立即更新！</div>
        <h4 class="update-title">更新内容：</h4>
        <div class="update-wrap">
          <pre class="update-pre">{{version_info.versionDescribe}}</pre>
        </div>
        <a class="update-btn" @click="downLoad">立即更新</a>
      </div>
      <div class="mask"></div>
    </Popup>
    <!-- 更新弹层 -->

    <!-- offline弹层 -->
    <Popup
        v-model="show_offline"
        pop-transition="popup-fade" 
        class="pop-modal offline-model">
      <div class="title">黄金象</div>
      <div class="page-break"></div>
      <div class="content">
        <img class="offline-img" src="~@/assets/images/offline.png">
        <p class="content-text">网络开小差啦</p>
        <p class="content-text yellow">请检查您的网络设置</p>
        <a class="reonline-btn" @click="refresh">重新加载</a>
      </div>
      <div class="mask"></div>
    </Popup>
    <!-- offline弹层 -->

  </div>
</template>

<script>
import store from '@/vuex/index.js'
import BottomNav from '@/views/components/BottomNav.vue';
import VueRouter from 'vue-router';
import { Popup } from "mint-ui";

export default {
  name: 'app',
  components:{
    BottomNav:BottomNav,
    Popup:Popup,
  },
  data() {
    return {
      isBack:false,
      show_update:false,
      // show_offline:true,
      // transitionNameKeepalive:"move-left",//move-right
      // transitionName: "slide-left",//slide-right // 默认动态路由变化为slide-right
    }
  },
  created(){
    var me = this;


    VueRouter.prototype.goBack = function (path) { 
      this.isBack = true;
      // debugger
      if(path){
        me.$router.replace({path:path})
      }else{
        if(window.history.length > 1){
          // me.$route
          // debugger
          me.$router.go(-1);
        }else{
          me.$router.replace('/')
        }
      }
    // 　　window.history.go(-1)
    }

    var offset_margin=20,x1, y1, x2, y2,_flag=false;
    document.addEventListener(
      "touchstart",
      function(e) {
        x1 = e.targetTouches[0].pageX;
        y1 = e.targetTouches[0].pageY;
      },
      false
    );
    document.addEventListener(
      "touchmove",
      function(e) {
        if(me.$route.meta.no_swip_back){//不能左滑回退
          return;
        }
        if(x1 > offset_margin){//大于距离屏幕边缘20以外的滑动，无效
          return;
        }
        
        if(_flag == true) return;
        x2 = e.targetTouches[0].pageX;
        y2 = e.targetTouches[0].pageY;
        var X = x2 - x1, 
            Y = y2 - y1;

        if (X > 100) {
          me.$router.goBack();
          _flag = true;
        }
      },
      false
    );
    document.addEventListener(
      "touchend",
      function(e) {
        _flag = false;
      },
      false
    );
  },
  watch: {
    $route(to, from) {
      let isBack = this.isBack = this.$router.isBack; // 监听路由变化时的状态为前进还是后退
      // console.log("to:",to);
      // console.log("from:",from);
      // console.log("isBack:",isBack)
      // debugger
      if (isBack == true) {
        // this.transitionName = "slide-right";

        this.$store.commit("setTransitionNameKeepalive","move-right");
        this.$store.commit("setTransitionName","slide-right");

        if(to.meta.keepAlive){
          setTimeout(()=>{
            this.$store.commit("setTransitionNameKeepalive","move-left");
            this.$store.commit("setTransitionName","slide-left");
          },0);
        }
      } else {
        // this.transitionName = "slide-left";
        
        this.$store.commit("setTransitionNameKeepalive","move-left");
        this.$store.commit("setTransitionName","slide-left");

        if(from.meta.keepAlive){
          setTimeout(()=>{
            this.$store.commit("setTransitionName","slide-right");
          },0);
        }
      }

      this.$router.isBack = false;
    },
    receive_push(nval,oval){
      this.$router.push({ path: nval.path })
    },
  },
  computed: {
    show_bottom_bar () {
      return this.$store.getters.getShowBottomBar;
    },
    seller_id(){
      return this.$store.getters.seller_id;
    },
    location(){
      return this.$store.getters.getLocation;
    },
    transitionName(){
      return this.$store.getters.getTransitionName;
    },
    transitionNameKeepalive(){
      return this.$store.getters.getTransitionNameKeepalive;
    },
    version_info(){
      return this.$store.getters.getVersionInfo;
    },
    on_line(){
      return this.$store.getters.getOnLine;
    },
    show_offline(){
      return !this.on_line;
    },
    receive_push(){
      return this.$store.getters.getReceivePush;
    },
    current_router(){
      return this.$store.getters.getRouter;
    },
  },
  mounted() {
    this.init();
  },
  store,
  methods:{
    init(){
      if(utils.checkUserAgent().is_ios || utils.checkUserAgent().is_android){
        if(this.version_info.findNewVersion && this.version_info.updateStrategy != 3){
          this.show_update = !this.show_update;
        }
      }
    },
    refresh:function(){
      if(window.navigator.onLine == true){
        if(this.$route.meta.can_refresh == false){
          return;
        }
        window.location.reload();
      }else{
        
      }
    },
    downLoad:function(){
      let download_url = this.version_info.updateUrl;

      try{
        if (utils.checkUserAgent().is_ios) {
          window.location.href = this.version_info.updateUrl;
        } else if (utils.checkUserAgent().is_android) {
          window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(fileEntry) {
            fileEntry.getDirectory("hjx", { create: true, exclusive: false }, function (fileEntry) {
                

              cordova.plugin.progressDialog.init({progressStyle : 'HORIZONTAL',cancelable : false, title: '更新',message : '正在下载中...'});

              //下载代码
              var fileTransfer = new FileTransfer();
              fileTransfer.download(download_url, fileEntry.toInternalURL()+"hjx_android.apk", function(entry) {
                  // 打开下载下来的APP
                  cordova.plugins.fileOpener2.open(
                      entry.toInternalURL(),//下载文件保存地址
                      'application/vnd.android.package-archive', {//以APK文件方式打开
                          error: function(err) {

                          },
                          success: function() {

                          }
                      });
              }, function(err) {
              },true);

              fileTransfer.onprogress = function(progressEvent) {

                      var downloadProgress = (progressEvent.loaded / progressEvent.total) * 100;

                      // alert(store.state.sdownload_progress+" jia "+ downloadProgress);
                     if (downloadProgress > 99) {
                      
                          //隐藏progressbar
                          cordova.plugin.progressDialog.dismiss();
                      }
                      else
                      {
                          //刷新进度条
                           cordova.plugin.progressDialog.setProgress(Math.ceil(downloadProgress));

                      }
              };

            },function(err){alert("创建失败")});
        });
        }
      }catch (e) {

      }
    },
    // transitionBeforeEnter:function(el){
    //   console.log("name:","transitionBeforeEnter")
    //   el.className = `Router slide-left-enter-active`;
    //   // console.log("el:",el.className);
    // },
    // transitionEnter:function(el,done){
    //   console.log("name:","transitionEnter")
    //   if(this.isBack){
    //     el.className = `Router slide-left-enter-active slide-right-enter-active slide-right-enter-to`;
    //   }else{
    //     el.className = `Router slide-left-enter-active slide-left-enter-active slide-left-enter-to`;
    //   }
    //   done();
    // },
    // transitionAfterEnter:function(el,done){
    //   console.log("name:","transitionAfterEnter")
    //   el.className = `Router`;
    // },



    // transitionBeforeLeave:function(el){
    //   console.log("name:","transitionBeforeLeave")
    //   // console.log("el:",el.className);
    //   // console.log("this.isBack:",this.isBack);
    //   el.className = `Router slide-left-enter-active`;
    //   console.log("el:",el.className);
    // },
    // transitionLeave:function(el,done){
    //   console.log("name:","transitionLeave")
    //   if(this.isBack){
    //     el.className = `Router slide-right-leave-active slide-right-enter-to`;
    //   }else{
    //     el.className = `Router slide-left-leave-active slide-leave-enter-to`;
    //   }
    //   done();
    // },
    // transitionAfterLeave:function(el){
    //   console.log("name:","transitionAfterLeave")
    //   el.className = `Router`;
    // },





    // transitionKeepaliveBeforeEnter:function(el){
    //   console.log("name:","transitionKeepaliveBeforeEnter")
    //   el.className = `Router move-right-enter-active`;
    //   console.log("el:",el.className);
    // },
    // transitionKeepaliveEnter:function(el,done){
    //   console.log("name:","transitionKeepaliveEnter")
    //   if(this.isBack){
    //     el.className = `Router move-right-enter-active slide-right-leave-active slide-right-enter-to`;
    //   }else{
    //     el.className = `Router move-right-enter-active slide-left-leave-active slide-leave-enter-to`;
    //   }
    //   done();
    // },
    // transitionKeepaliveAfterEnter:function(el){
    //   console.log("name:","transitionKeepaliveAfterEnter")
    //   el.className = `Router`;
    // },









    // transitionKeepaliveBeforeLeave:function(el,done){
    //   console.log("name:","transitionKeepaliveBeforeLeave")
    //   el.className = `Router move-right-enter-active`;
    //   console.log("el:",el.className);
    // },
    // transitionKeepaliveLeave:function(el,done){
    //   console.log("name:","transitionKeepaliveLeave")
    //   if(this.isBack){
    //     el.className = `Router move-right-enter-active slide-right-leave-active slide-right-enter-to`;
    //   }else{
    //     el.className = `Router move-right-enter-active slide-left-leave-active slide-leave-enter-to`;
    //   }
    //   done();
    // },
    // transitionKeepaliveAfterLeave:function(el){
    //   console.log("name:","transitionKeepaliveAfterLeave")
    //   el.className = `Router`;
    // },
  },
}
</script>


<style lang="less">
@import './App.less';
</style>
