<template>
  <div class="sus">
    <div class="sus-top">
      <div class="sus-img">
        <img src="@/assets/images/idupdate/success.png" alt="">
      </div>
      <p class="sus-apply">您的身份证有效期已更新<span v-show="Sflag">，如需变更证件姓名请您至我行营业网点办理，详情请咨询我行客服热线<a href="tel:95561">95561</a></span></p>
    </div>
    <div id="susconfirm" @click="susconfirm" v-show="sucShow">确定</div>
    <div class="concern" v-show="concernshow">
      <img src="@/assets/images/idupdate/concern.png" alt="" @click="concern">
    </div>
    <YVersion :version="version" top="10%"></YVersion>
  </div>
</template>

<script>
  // 引入所需的方法、组件
  import YVersion from "../../components/YVersion";
  import {mapActions,mapState} from "vuex";
  import {initsa,track} from "@/assets/js/common.js"; //听云监听
  export default {
    name: 'SuccessPage', // 申请成功页面
    data () {
      return { //绑定数据
        concernshow:false,
        sucShow:true
      }
    },
    components:{
      YVersion
    },
    computed:mapState({
      pubdata:state => state.iu.public.pubdata,
      pubui:state => state.iu.public.pubui,
      laystatu:state => state.iu.public.pubmenu.laystatu,
      reminderstatu:state => state.iu.public.pubmenu.reminderstatu,
      Sflag:state => state.iu.success.Sflag,
      version: state => state.iu.version
    }),
    created(){
      initsa("证件有效期更新更新结果页面"); //初始化监听
      this.decide();
    },
    methods:{
      decide(){
        var ua = navigator.userAgent.toLowerCase();
        var userAgent = navigator.userAgent;
        if(ua.match(/MicroMessenger/i) != "micromessenger" && userAgent.indexOf("cibbank") == -1){
          this.concernshow = true;
        }
        if(userAgent.indexOf("cibbank") != -1){        // 好兴动app
          this.sucShow = false;
        }
        // 判断app
      },
      concern(){
        window.location.href = "https://mp.weixin.qq.com/s/b-gYi1luWefxJe7UCwWi8Q";
      },
      susconfirm(){
        track("idupdate_resultConfirm","证件有效期更新更新结果确认按钮");
        var ua = navigator.userAgent.toLowerCase();
        var userAgent = navigator.userAgent;
        if(ua.match(/MicroMessenger/i) == "micromessenger") {
          window.location.href = "https://ccshop.cib.com.cn:8010/html/moreService/index.html";
        }
        else{
          window.location.href = "https://ccshop.cib.com.cn:8010/html/xkq2018/appDownload18061302.html";
        }
      },
      reconfirm(){ //关闭提示
        this.$store.dispatch("iu/hideremind",{
          laystatu:this.laystatu,
          reminderstatu:this.reminderstatu
        });
      }
    }
  }
</script>

<style scoped>
.sus{background:#fff;}
.sus-top{text-align: center;padding:0 5.3%;box-sizing: border-box;}
.sus-img img{width: 1.4rem;margin: 0.49rem 0 0.16rem;}
.sus-top .sus-apply{font-size: 0.18rem;letter-spacing: 0.0022rem;line-height: 0.24rem;margin-bottom: 0.64rem;height: 0.24rem;}
#susconfirm{background: #5084FF;border-radius: 0.22rem;text-align: center;font-size: 0.16rem;color: #fff;
letter-spacing: 0.0019rem;height: 0.45rem;line-height: 0.45rem;margin:0 5.3%;}
.concern img{width:100%;box-sizing: border-box;padding:0 5.3%;margin-top:0.4rem;}
</style>
