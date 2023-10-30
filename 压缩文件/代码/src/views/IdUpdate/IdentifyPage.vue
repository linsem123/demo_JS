<template lang="pug">
.identify-view
  .sep
  BYTextCode(@getValue="getValue" @getCode="getCode" :textMsg="textMsg.msg")
  YImageCode(:bgImg="imageCode.bgImg" :slideImg="imageCode.slideImg" :show="imageCode.show" @getMove="getMove" @refresh="refresh")
  .tip 短信验证码将发送至您办理信用卡时在银行预留的手机号
  YFunctionBtn.btn(text="确认" :dis="dis" @checktable="check")
  YVersion(top="100%" :version="version")
  YErrorAlert(:msg="alert.msg" :err="alert.err" :show="alert.showAlert" @confirm="confirm")
</template>

<script>
import BYTextCode from "../../components/BYTextCode";
import YFunctionBtn from "../../components/YFunctionBtn";
import YVersion from "../../components/YVersion";
import {mapGetters,mapState} from 'vuex';
import YImageCode from "../../components/YImageCode";
import YErrorAlert from "../../components/YErrorAlert";
import {initsa,track} from "@/assets/js/common.js"; // 听云监听
export default {
  name: "IdentifyPage",
  components: {YErrorAlert, YImageCode, YVersion, YFunctionBtn, BYTextCode},
  computed: {
    ...mapState({
      version: state => state.iu.version,
      textMsg: state => state.iu.identify.textMsg,
      imageCode: state => state.iu.identify.imageCode,
      alert: state => state.iu.alert.identify
    }),
    ...mapGetters('iu',{
      dis: 'identifyBtn'
    })
  },
  created(){
    initsa("证件有效期更新短信验证页"); //初始化监听
    this.$store.dispatch('iu/autoSendSms');
  },
  methods:{
    getValue(value){
      this.$store.commit('iu/SETIDENTIFYCODE',value);
    },
    getCode(){
      if(this.textMsg.status === 1){
        track("idupdate_getmsgCode","证件有效期更新短信验证获取验证码");
        this.$store.dispatch('iu/autoSendSms');
      }
    },
    getMove(value){
      this.$store.commit('iu/SETIMAGECODEMOVE',value);
      this.$store.dispatch('iu/autoSendSms');
    },
    confirm() {
      this.$store.commit('iu/SETIDENTIFYALERT', {show: false, msg: '', err: ''});
    },
    refresh(){
      this.$store.dispatch('iu/getSlider');
    },
    check(){
      track("idupdate_shortmsgTest","证件有效期更新短信验证页确认按钮");
      this.$store.dispatch('iu/checkSmsCode',this);
    }
  },
  destroyed(){
    clearInterval(this.textMsg.t);
    this.$store.commit('iu/SETIDENTIFYTEXTMSG','获取验证码');
    this.$store.commit('iu/SETIDENTIFYSTATUS',1);
    this.$store.commit('iu/SETIDENTIFYCODE','');
    this.$store.commit('iu/SETINTERVAL',null);
  }
}
</script>

<style scoped lang="stylus">
  .identify-view
    width 100vw
    height 100vh
    background #F0F2F5
    overflow hidden
    .sep
      height 10px
      border-bottom 0.5px solid rgba(210, 210, 210, 0.8)
    .tip
      margin-top 8px
      padding-left 5.3%
      font-size 0.12rem
      color #666
    .btn
      margin-top 10.67%


</style>
