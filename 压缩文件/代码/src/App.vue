<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
  // 公共引用
  import Vue from 'vue';
  import global from "./assets/css/public.css";
  import {rem} from "@/assets/js/common.js";
  import {mapActions,mapGetters} from "vuex";
  export default {
    name: 'app',
    methods:{
      //控制不能分享
      onBridgeReady(){
        WeixinJSBridge.call('hideOptionMenu'); // 隐藏右上角分享按钮
      },
      closeShare(path){                        // 控制某些特定页面是否分享
          if(/CashInstalment\/share/.test(path)){
              WeixinJSBridge.call("showOptionMenu");
              return
          }
        // if(/LendCash\/HomePage|LendCash\/SuccessPage|CashInstalment\/HomePage|CashInstalment\/applySuccess|CashInstalment\/promotion|Installment\/HomePage|consume\/HomePage|AutoStaging\/ApplyPage|AutoStaging\/HomePage|AutoStaging\/RevisePage|AutoStaging\/SuccessPage|BorrowedMoney\/HomePage|BorrowedMoney\/SuccessPage/.test(path)){
          if (typeof WeixinJSBridge == "undefined"){
            if( window.addEventListener ){
              window.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, true);
            }else if (window.attachEvent){
              window.attachEvent('WeixinJSBridgeReady', this.onBridgeReady); 
              window.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
            }
          }else{
            this.onBridgeReady();
          }
        // }
      },
      pushHistory(path){
        if(/CashInstalment\/applySuccess/.test(path)){  // 页面跳转到成功页面就自动关闭浏览器
          window.addEventListener("popstate", function(e) { 
              window.opener=null;
              WeixinJSBridge.call('closeWindow');
              // WeixinJSBridge.invoke('closeWindow',{},function(res){});  
              // window.close();
              // location.reload();
              // window.location = "";
          }, false); 
          var state = { 
              title: "title", 
              url: ""
          }; 
          window.history.pushState(state, "title", ""); 
        }
      },
    },
    watch:{
      $route(route){  //监听路由，
        this.closeShare(this.$route.path);
        this.pushHistory(this.$route.path);
      }
    },
    created(){
      this.closeShare(this.$route.path);
      this.pushHistory(this.$route.path);
    },
    mounted(){
      this.pushHistory(this.$route.path);
      rem();
      let height=window.innerHeight||document.body.clientHeight;
      this.$store.commit("SET_HEIGHT",{innerHeight:height});
    }
  }
</script>