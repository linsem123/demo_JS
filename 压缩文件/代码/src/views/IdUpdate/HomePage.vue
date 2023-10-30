<template lang="pug">
  .update-home
    .update-home-view(v-show="homeShow")
      img(@click="inputFocus" :src="photo")
      input(type="file"  accept="image/*" capture="camera" ref="ipt" @change="upload")
      .tip 拍摄您本人人脸，请确保正对手机，光线充足
      YFunctionBtn.btn(text="开始验证" :dis="dis" @checktable="up")
      YVersion(:version="version" top="5%")
    YErrorAlert(:msg="login.msg" :err="login.err" :show="login.showAlert" @confirm="confirm_login")
    YErrorAlert(:msg="alert.msg" :err="alert.err" :show="alert.showAlert" @confirm="confirm")
</template>

<script>
  import YAlert from "../../components/YAlert";
  import YErrorAlert from "../../components/YErrorAlert";
  import YFunctionBtn from "../../components/YFunctionBtn";
  import YVersion from "../../components/YVersion";
  import {mapGetters, mapState} from 'vuex';
  import {track} from "@/assets/js/common.js"; // 听云监听

  export default {
    name: "HomePage",
    components: {YVersion, YFunctionBtn, YErrorAlert, YAlert},
    data() {
      return {
        file: null,
      }
    },
    computed: {
      ...mapState({
        version: state => state.iu.version,
        alert: state => state.iu.alert.home,
        login: state => state.iu.alert.login,
        photo: state => state.iu.home.photo,
        dis: state => state.iu.home.btn,
        homeShow: state => state.iu.home.homeShow
      }),
    },
    created(){
      this.$store.dispatch('iu/saInit', '身份验证');
      this.$store.dispatch('iu/judgeLogin', this);
      this.$store.commit('iu/SETHOMEPHOTO',{str: require('@/assets/images/idupdate/photo.png'),btn:false})
    },
    methods: {
      confirm(){
        this.$store.commit('iu/SETHOMEALERT', {show: false, msg: '', err: ''});
      },
      confirm_login() {
        this.$store.commit('iu/SETLOGINALERT', {show: false, msg: '', err: ''});
      },
      inputFocus(){ // 调照相机
        this.$refs.ipt.click();
      },
      upload(e){
        this.file = e.target.files[0];
        if(/(jpeg|jpg|png|bmp)$/.test(this.file.type)){
          var data = {
            file: this.file,
            _this: this
          };
          this.$store.dispatch('iu/handleImg', data);
        }else{
          this.$store.commit('iu/SETLOGINALERT', {show: true, msg: '暂不支持图片上传，请您拍照上传', err: ''});
        }
      },
      up(){
        // 埋点
        if (this.dis){
          track("idupdate_faceTest","证件有效期更新人脸拍摄页验证按钮");
          this.$store.dispatch('iu/recoFace',this);
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  .update-home-view
    width 100vw
    height 100vh
    overflow hidden
    img
      width 60%
      height 41.9%
      margin-top 22.8%
      margin-left 20%
    input
      opacity 0
      width 1px
      height 1px
    .tip
      width 100%
      color #666
      font-size 0.13rem
      text-align center
      margin-top 10.67%
    .btn
      margin-top 30%
</style>
