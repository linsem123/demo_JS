<template>
	<div class="register">
    <transition :name="transitionName">
      <keep-alive>
  			<component
  				:is="current_view"
  				:step_view="step_view"
  				:info="info"
  				:root_data="root_data"
  				:referrer="referrer"
          :key="current_view"
  				@gotoStep="gotoStep"
  				@send-captcha="sendCaptcha"
  				></component>
      </keep-alive>
    </transition>
	</div>
</template>

<script>
import step1 from "./Step1.vue";
import step2 from "./Step2.vue";
import step3 from "./Step3.vue";

// import eStep1 from "./EStep1.vue";

import store from "@/vuex/index.js";

import { Toast, MessageBox } from "mint-ui";

// utils.extendApi(API);//把API扩充到utils方法里边
export default {
  components: {
    step1: step1,
    step2: step2,
    step3: step3,
    // eStep1: eStep1
  },
  data: function() {
    return {
      transitionName: "move-left",
      current_view: "step1",
      step_view: {
        view: "step1"
      },
      info: {
        phone: "",
        password6_12: "",
        access_token:"",
        captcha:"",
        // captcha_image:"",
      },
      root_data:{
        has_send_captcha:false,
        captcha_text:"获取验证码",
      },
      referrer: "",
    };
  },
  mounted: function() {
    //ready
    this.info = _.assign(this.info,{
      phone: "",
      password6_12: "",
      captcha:"",
      access_token:"",
      // captcha_image:"",
    });

    this.current_view = "step1";
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      // vm.init();
      utils.trackEvent("exposure_signup");
    })
  },
  computed: {
    step: function() {
      return parseInt(this.current_view.substr(4));
    },
    pfc_code() {
      return this.$store.getters.getPfcCode;
    },
    resume_stamp() {
      return this.$store.getters.getResumeStamp;
    },
    // guest_phone(){
    // 	return this.$store.getters.getGuestPhone;
    // }
  },
  watch: {
    "step_view.view": function(nval, oval) {
      this.current_view = nval;
    },
    resume_stamp:function(nval,oval){//app  reume
      utils.trackEvent("exposure_signup");
    },
  },
  methods: {
    gotoStep(number, direction) {
      this.transitionName = "move-" + direction;
      this.step_view.view = "step" + number;
    },
    sendCaptcha:function(cb){
      var me = this;

      if(this.root_data.has_send_captcha){//倒计时中
        return;
      }

      this.root_data.has_send_captcha = false;

      // 发送验证码
      utils.API.user_userbind({
        headers:{
          "api-version" : "1.15.0",
        },
        data:{
          "token":me.info.access_token,
          "type":"mobile",
          "value":_.trim(me.info.phone),
          // "captcha_code":_.trim(me.info.captcha_image),
        }
      })
      .then(function (ret) {
        me.root_data.has_send_captcha = true;
        me.info.captcha = "";
        utils.countDown({//倒计时
          seconds:59,//倒计时总时间
          beforeInterval:function(counter){//beforeInterval
            me.root_data.captcha_text = '已发送 '+counter;
          },
          readingSeconds:function(counter){//读秒中callback
            me.root_data.captcha_text = '已发送 '+counter;
          },
          end:function(){//倒计时完成后callback
            me.root_data.captcha_text = "获取验证码";
            me.root_data.has_send_captcha = false;
          }
        });
        cb&&cb(ret.model);
      })
      .catch(function(ret){
        !ret.__servererror__ && Toast(ret.errorMessage||"未知错误！");
        me.root_data.has_send_captcha = false;
        if(me.pfc_code == "111111" || me.pfc_code == "222222"){//开发和测试环境发送错误可以通过
          cb&&cb(ret);
        }
      })
    },
  }
};
</script>

<style lang="less" scoped>
.register {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
}


.move-left-enter-active {
  transition: all 0.3s ease;
}
.move-left-enter {
  opacity: 0;
  -webkit-transform: translate(100vw, 0);
  transform: translate(100vw, 0);
}
.move-left-leave-active {
  transition: all 0.3s ease;
  opacity: 0;
  -webkit-transform: translate(-100vw, 0);
  transform: translate(-100vw 0);
}


.move-right-enter-active {
  transition: all 0.3s ease;
}
.move-right-enter {
  opacity: 0;
  -webkit-transform: translate(-100vw, 0);
  transform: translate(-100vw, 0);
}
.move-right-leave-active {
  transition: all 0.3s ease;
  opacity: 0;
  -webkit-transform: translate(100vw, 0);
  transform: translate(100vw 0);
}

</style>