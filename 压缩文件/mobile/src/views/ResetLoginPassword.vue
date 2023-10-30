<template>
  <div>
    <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">重置登录密码</div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->

    <div class="reset-password-wrap">
      <div class="top-blank"></div>

      <div v-if="mobile_number" class="line-title">
        填写<span>{{hide_phone}}</span>短信验证
      </div>

      <ul class="info-wrap">
        <li v-show="!mobile_number" class="info-cell">
          <div class="info-cell-content">
            <div class="info-cell-content-wrap">
              <input v-if="mobile_number" disabled class="info-cell-input" autocomplete="off" type="text" name="phone" @click="clickInput('phone')" @blur="inputBlurValidate('phone')" v-model="info.phone" placeholder="手机号" />
              <input v-else class="info-cell-input" autocomplete="off" type="text" name="phone" @click="clickInput('phone')" @blur="inputBlurValidate('phone')" v-model="info.phone" placeholder="手机号" />
            </div>
          </div>
          <p v-if="!validation.phone" class="info-error">手机号格式不正确</p>
        </li>
        <li class="info-cell">
          <div class="info-cell-content">
            <div class="info-cell-content-wrap">
              <input class="info-cell-input captcha" autocomplete="off" type="text" name="captcha" @click="clickInput('captcha')" @blur="inputBlurValidate('captcha')" v-model="info.captcha" placeholder="验证码" />
              <div class="captcha-btn" @click="sendCaptcha">{{captcha_text}}</div>
            </div>
          </div>
          <p v-if="!validation.captcha" class="info-error">验证码格式不正确</p>
        </li>
        <li class="info-cell">
          <div class="info-cell-content">
            <div class="info-cell-content-wrap">
              <template v-if="!show_password">
                <input class="info-cell-input" autocomplete="off" type="password" name="password6_12" @click="clickInput('password6_12')" @blur="inputBlurValidate('password6_12')" v-model="info.password6_12" placeholder="请设置6-12位新登录密码" />
                <span class="iconfont icon-close-eye"  @click="showPassword"></span>
              </template>
              <template v-else>
                <input class="info-cell-input" autocomplete="off" type="text" name="password6_12" @click="clickInput('password6_12')" @blur="inputBlurValidate('password6_12')" v-model="info.password6_12" placeholder="请设置6-12位新登录密码" />
                <span class="iconfont icon-yanjing" @click="showPassword"></span>
              </template>
            </div>
          </div>
          <p v-if="!validation.password6_12" class="info-error">密码格式不正确</p>
        </li>
      </ul>

      <div class="bottom-btn-wrap">
        <a class="page-btn" :class="(pass_validation&&!page_btn_disable)?'active':''" href="javascript:void(0);" @click="saveNewPassword">保存新密码</a>
      </div>

    </div>

  </div>
</template>

<script>
import topHead from "@/views/components/TopHead.vue";
import constants from '@/assets/js/constants.js';
// import store from '../vuex/store/store.js'

import {
  Toast,
} from 'mint-ui';

export default {
  components:{
    topHead:topHead,
  },
  data:function(){
    return {
      mall_token:"",
      show_password:false,
      mobile_number:"",
      info:{
        phone:"",
        captcha:"",
        password6_12:"",
      },
      validation:{
        phone:true,
        captcha:true,
        password6_12:true,
      },
      pass_validation:false,
      referrer:"",
      captcha_text:"获取验证码",
      has_send_captcha:false,
      access_token:"",

      page_btn_disable:false,
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {// 通过 `vm` 访问组件实例
      // console.log("to", to);
      // console.log("from", from);
      vm.referrer = from.fullPath;
      vm.init();
      utils.trackEvent("exposure_quickLogin_forgetPassword");
    })
  },
  mounted:function(){//ready
    // this.init();
  },
  computed:{
    hide_phone:function(){
      return utils.hideString(this.mobile_number,3,4);
    },
    resume_stamp() {
      return this.$store.getters.getResumeStamp;
    },
    // mall_token(){
    //   return utils.storageGet("mall_token");
    // },
    // mall_uid(){
    //   return utils.storageGet("mall_uid");
    // },
  },
  watch:{
    info:{
      handler:function(nval,oval){
        var me = this,
            success = true;
        _.forOwn(nval, function(value, key) {
          if(!me.validate(key)){
            success = false;
          }
        });
        this.pass_validation = success;
      },
      deep:true,
    },
    resume_stamp:function(nval,oval){//app  reume
      utils.trackEvent("exposure_quickLogin_forgetPassword");
    },
  },
  methods:{
    init(){
      this.mall_token = utils.storageGet("mall_token");
      
      this.mobile_number = utils.storageGet("mobile")||"",
      this.info = _.assign(this.info,{
        phone:utils.storageGet("mobile")||"",
        captcha:"",
        password6_12:"",
      });
      this.page_btn_disable = false,

      this.getAccessToken()

    },
    goBack:function(){
      this.$router.goBack();
    },
    showPassword:function(){
      this.show_password = !this.show_password;
    },
    validate:function(key,){
      var success = new RegExp(constants.FORM_REG[key],'g').test(_.trim(this.info[key]));
        // return this.validation[key] = success;
        return success;
    },
    inputBlurValidate:function(key){//表单输入框在blur时验证格式
      return;
      this.validation[key] = this.validate(key);
    },
    clickInput:function(key){
      this.validation[key] = true;
    },
    getAccessToken:function(cb){
      var me = this;

      utils.API.access_token({
        data:{}
      })
      .then(function (ret) {
        me.access_token = ret.model.data.access_token;
        cb&&cb();
      })
      .catch(function(ret){
        !ret.__servererror__ && Toast(ret.errorMessage||"未知错误！");
        // me.root_data.has_send_captcha = false;
      })
    },

    // checkoutPhoneExist:function(){
    //   var me = this;

    //   return new Promise(function(resolve, reject) {
    //     utils.API.user_signin({
    //       data: {
    //         type: "password",
    //         name: me.info.phone,
    //         password:"0",
    //       }
    //     })
    //     .then(function(ret) {
    //       // resolve(ret.model);
    //       reject(ret)
    //     })
    //     .catch(function(e) {
    //       // reject(e)
    //       resolve(e);
    //       // !e.__servererror__ && Toast(e.errorMessage || "未知错误！");
    //     });
    //   })  
    // },

    // 发送验证码  
    sendCaptcha: function(){
      var me = this;

      if(this.has_send_captcha){//倒计时中
          return;
      }

      if(!this.validate('phone')){
        this.validation['phone'] = false;
        return;
      }

      this.has_send_captcha = true;
      this.forgetPassword();
    },
    forgetPassword:function(){
      var me = this;

      ////////////////////////////
      utils.countDown({//倒计时
        seconds:59,//倒计时总时间
        beforeInterval:function(counter){//beforeInterval
            me.captcha_text = '已发送 '+counter;
        },
        readingSeconds:function(counter){//读秒中callback
            me.captcha_text = '已发送 '+counter;
        },
        end:function(){//倒计时完成后callback
            me.captcha_text = "获取验证码";
            me.has_send_captcha = false;
        }
      });
      ////////////////////////////

      utils.API.user_forget_password({
        data:{
          "token":me.mall_token||me.access_token,
          "type": "mobile",
          "value": _.trim(me.info.phone),
        }
      })
      .then(function (ret) {
        utils.trackEvent("click_passwordlogin_forgetPassword_smsButton_success");
      })
      .catch(function(ret){
        !ret.__servererror__ && Toast(ret.errorMessage||"未知错误！");
        me.has_send_captcha = false;
        utils.resetCountDown(function(){
          me.captcha_text = "获取验证码";
        });
      });
    },
    validateMallForgetPassword:function(cb){//当客户忘记帐号密码时，验证手机或邮箱获取到的校验码进行验证
      var me = this;
      utils.API.validate_forget_password({
        data:{
          // "token":{
          //  "sid": "eec1ca04e8efbbe098f19aa16eb2764b3d3236d4",
          //  "uid": 100,
          // },
          "token":me.mall_token||me.access_token,
          "type"  : "mobile",
          "value" : _.trim(me.info.phone),
          "code"  : _.trim(me.info.captcha),
        }
      })
      .then(function (ret) {
        cb&&cb();
      })
      .catch(function(ret){
        me.page_btn_disable = false;
        !ret.__servererror__ && Toast(ret.errorMessage||"未知错误！");
      });
    },
    saveNewPassword:function(){
      var me = this;

      if(this.page_btn_disable){
        return;
      }

      if(!this.pass_validation){
        return;
      }

      this.page_btn_disable = true;

      this.validateMallForgetPassword(function(){
        setTimeout(function(){
          me.promiseSetPasswordAll();
        },1000);
      }); 
    },
    promiseSetPasswordAll:function(){
      var me = this;

      utils.API.user_reset_password({
        data:{
          // "token":{
          //  "sid": "eec1ca04e8efbbe098f19aa16eb2764b3d3236d4",
          //  "uid": 100,
          // },
          "token":me.mall_token||me.access_token,
          "type": "mobile",
          "value": _.trim(me.info.phone),
          "password": _.trim(me.info.password6_12),
        }
      })
      .then(function (ret) {
        Toast("重置成功！请重新登录");
        utils.storageClear();

        setTimeout(function(){
          // me.page_btn_disable = false;
          me.$router.replace({path: '/login' });
        },1000);
      })
      .catch(function(ret){
        me.page_btn_disable = false;
        !ret.__servererror__ && Toast(ret.errorMessage||"未知错误！");
      });
    }
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";


.reset-password-wrap{
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  // position: absolute;
  background:#ffffff;

  .line-title {
    margin:0.3rem 0;
    padding:0 0.3rem;
    font-size: 0.28rem;
    line-height: 0.28rem;
    color:@font-gray-color;
    span {
      color:@font-color;
    }
  }

  .info-wrap {
    margin: 0.6rem 0.3rem;
    .info-cell {
      margin-bottom: 0.3rem;
      height: 0.9rem;
      line-height: 0.9rem;
      padding-bottom: 0.3rem;
      .info-cell-content {
        display: flex;
        .info-cell-content-wrap {
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          .info-cell-input {
            font-size: 0.32rem;
            height: 0.98rem;
            border-radius: 0.1rem;
            border: 1px solid @border-color;
            padding:0 0.2rem;
            width: 100%;
            &.captcha {
              width:3.4rem;
            }
          }
          .captcha-btn {
            width:2.65rem;
            font-size: 0.3rem;
            line-height: 0.98rem;
            height: 0.98rem;
            text-align: center;
            color:@red;
            border: 1px solid @border-color;
            border-radius: 0.1rem;
          }
          .iconfont {
            position: absolute;
            font-size: 0.46rem;
            color:@font-gray-color;
            right: 0.3rem;
            &.icon-yanjing {
              color:@red;
            }
          }
        }
      }
      .info-error {
        margin-top: 0.1rem;
        color:@red;
        font-size: 0.24rem;
        line-height: 0.24rem;
      }
    }
  }

  .bottom-btn-wrap {
    margin:0.9rem 0.3rem 0 0.3rem;
    .page-btn {
      display: block;
      width: 100%;
      height: 1rem;
      line-height: 1rem;
      text-align: center;
      background: @yellow-disable;
      color:#ffffff;
      font-size: 0.36rem;
      font-weight: bold;
      border-radius: 0.1rem;
      &.active {
        background: @yellow;
      }
      &.red {
        background:@mall-base-red-disable;
        &.active {
          background:@mall-base-red;
        }
      }
    }
  }
  
}



</style>