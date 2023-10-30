<template>
	<div>
	
		<!-- 头部 -->
	  <top-head
	    @go-back="goBack()"
	    :show_back="true"
	    :show_border="false"
	  >
	    <div slot="left"></div>
	    <div slot="main"></div>
	    <div slot="right"></div>
	  </top-head>
	  <!-- 头部 -->

		<div class="register-wrap">
			

			<div class="user-register-wrap">
				<div class="top-blank"></div>

				<h4 class="step-title">输入验证码</h4>

				<div class="tip-wrap">
					<!-- <p>我们已向 <span class="tip-bold">{{info.phone | filterPhone}}</span> 发送验证码短信</p> -->
					<!-- <p>请查看短信并输入验证码</p> -->
					<p>请点击获取验证码</p>
				</div>

				<ul class="form-ribbon-wrap">
					<li class="form-ribbon-cell">
						<div class="input-cell input-captcha">
						<!-- <div class="user-phone">{{ info.phone |filterFun }}</div> -->
							<input required ref="captcha" autocomplete="off" class="form-ribbon-input captcha" @click="clickInput('captcha')" @blur="inputBlurValidate('captcha')" name="captcha" type="text" v-model="info.captcha" placeholder="短信验证码" />
		    			<span class="clear-input-btn iconfont icon-close2" style="left: 3.5rem;" @click="clearInputValue('captcha')"></span>
		    			<div class="captcha-btn" @click="sendCaptcha">{{root_data.captcha_text}}</div>
						</div>
						<div class="error-hint" v-if="!validation.captcha">验证码格式不正确</div>
					</li>
				</ul>

				<div class="btn-wrap">
					<a href="javascript:;" class="next-btn" :class="{'active':pass_validate}" @click='nextStep'>下一步</a>
				</div>
			</div>
	    
		</div>
	</div>
</template>



<script>
import topHead from "@/views/components/TopHead.vue";
import constants    from '@/assets/js/constants.js';
import store from '@/vuex/index.js'

import {
	Toast,
	MessageBox
} from 'mint-ui';

export default {
	props:["step_view","info","referrer","root_data"],
	components:{
		topHead:topHead,
	},
	data(){
		return {
			validation:{
				captcha:true,
			},
			pass_validate:false,
			registered:true,
			has_send_captcha:false,
			// info.captcha_text:"获取验证码",
			// count_downing:false,
		}
	},
	computed:{
		pfc_code() {
      return this.$store.getters.getPfcCode;
    },
	},
	watch:{
		"info.captcha":function(){
			if(this.validate('captcha')){
				this.pass_validate = true;
			}else{
				this.pass_validate = false;
			}
		},
	},
	mounted(){
	},
	activated:function(){
		// if(this.info.has_send_captcha){
		// 	if(!this.count_downing){
		// 		this.countDown();
		// 	}
		// }else{
		// 	// this.info.captcha = "";
		// }
	},
	filters:utils.filters,
	methods:{
		goBack:function(){
			this.$emit("gotoStep",'1',"right");
		},
		sendCaptcha:function(){
			var me = this;
			this.$emit("send-captcha",function(ret){
				if(ret.data){
					if(ret.data.registered == 1){
						Toast("此手机号码已经被注册！");
						me.registered = true;
					}else{
						me.registered = false;
						Toast("验证码已发送！")
					}
				}else{
					if(me.pfc_code == "111111" || me.pfc_code == "222222"){//开发和测试环境发送错误可以通过
						me.registered = false;
					}
				}

				me.has_send_captcha = true;

			});
		}.after(function(){
      utils.trackEvent('click_signup_smsButton');
    }),

		validate:function(key){
			var success = new RegExp(constants.FORM_REG[key],'g').test(_.trim(this.info[key]));
      return success;
		},
		clickInput:function(key){
			this.validation[key] = true;
		},
		inputBlurValidate:function(key){//表单输入框在blur时验证格式
			return;
			this.validation[key] = this.validate(key);
		},
		clearInputValue:function(key){
			this.info[key] = "";
      this.$refs[key].focus();
      this.validation[key] = true;
		},
		checkoutCaptcha:function(cb){
			var me = this;

			utils.API.validate_bind({
        data:{
        	"token":me.info.access_token,
        	"type":"mobile",
    			"value":_.trim(me.info.phone),
    			"code":_.trim(me.info.captcha),
        }
      })
      .then(function (ret) {
      	cb&&cb();
      })
      .catch(function(ret){
        !ret.__servererror__ && Toast(ret.errorMessage||"未知错误！");
      })
		},
		nextStep:function(){
			var me = this;

			if(!this.pass_validate){
				return;
			}

			if(!this.has_send_captcha){
				Toast("请发送验证码！");
				return;
			}

			if(this.registered){
				Toast("此手机号码已经被注册！");
				return;
			}
			this.checkoutCaptcha(function(){
				me.$emit("gotoStep",'3',"left");
			})
		}.after(function(){
      utils.trackEvent('click_signup_nextButton_2');
    }),
	}

};
</script>


<style lang="less" scoped> 
@import "./register.less";
</style>