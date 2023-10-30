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

	    	<h4 class="step-title">设置登录密码</h4>

	    	<div class="tip-wrap">
					<p>请为你的账号 <span class="tip-bold">{{info.phone}}</span> 设置登录密码</p>
					<p>方便以后快速登录</p>
				</div>

				<ul class="form-ribbon-wrap">
					<li class="form-ribbon-cell">
						<div class="input-cell">
							<template v-if="!show_password">
		    				<input required ref="password6_12" class="form-ribbon-input" @click="clickInput('password6_12')" @blur="inputBlurValidate('password6_12')" name="password6_12" type="password" autocomplete="off" v-model="info.password6_12" placeholder="6-12位" />
		    				<span class="clear-input-btn iconfont icon-close2" style="right:1rem;" @click="clearInputValue('password6_12')"></span>
		    				<span class="iconfont icon-close-eye"  @click="showPassword"></span>
		    			</template>
		    			<template v-else>
		    				<input required ref="password6_12" class="form-ribbon-input" @click="clickInput('password6_12')" @blur="inputBlurValidate('password6_12')" name="password6_12" type="text" autocomplete="off" v-model="info.password6_12" placeholder="6-12位" />
		    				<span class="clear-input-btn iconfont icon-close2" style="right:1rem;" @click="clearInputValue('password6_12')"></span>
		    				<span class="iconfont icon-yanjing" @click="showPassword"></span>
		    			</template>
						</div>
						<div class="error-hint" v-if="!validation.password6_12">密码格式不正确</div>
					</li>
				</ul>

				<div class="btn-wrap">
					<a href="javascript:;" class="next-btn" :class="{'active':pass_validate}" @click='compeletRegister'>完成</a>
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
				// phone:true,
				password6_12:true,
				// captcha:true,
			},
			pass_validate:false,
			show_password:false,
		}
	},
	computed:{
		pfc_code() {
      return this.$store.getters.getPfcCode||"app未知渠道";
    },
	},
	// filters:utils.filters,
 	activated:function(){
 		
	},
	watch:{
		"info.password6_12":function(){
			if(this.validate('password6_12')){
				this.pass_validate = true;
			}else{
				this.pass_validate = false;
			}
		},
	},
	mounted(){
	},
	methods:{
		goBack:function(){
			this.$emit("gotoStep",'2',"right");
		},
		showPassword:function(){
			this.show_password = !this.show_password;
		},
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
		synchValidateAllInput:function(){
			var me = this,
					success = {
						error_key:"",
						success:true,
					};

			["phone","password6_12"].forEach(function(item){
				if(!me.validate(item)){
					success.error_key = key;
					success.success = false;
				}
			})

			// _.forOwn(me.info, function(value, key) {
			// 	if(!me.validate(key)){
			// 		success.error_key = key;
			// 		success.success = false;
			// 	}
 		// 	});
			return success;
		},
		compeletRegister:function(){
			var me = this;

			if(!this.pass_validate){
				return;
			}

			if(!me.synchValidateAllInput().success){//表单输入格式验证
				var name = {
							"phone":"手机号",
							"password6_12":"密码",
						},
						error_key = me.synchValidateAllInput().error_key;

				Toast(name[error_key]+"填写有误，请检查后再次提交！");
				return;
			}

			this.userSignup(function(){//注册
				me.$router.replace({path: `/my` });
			})
		}.after(function(){
      utils.trackEvent('click_signup_signupButton');
    }),
    
		//商城开户
		userSignup:function(cb){
			var me = this;
			utils.API.user_signup({
				data:{
					"token":me.info.access_token,
					"name":_.trim(me.info.phone),
		      "password":_.trim(me.info.password6_12),
		      "field" : [                 //其他信息
            {
            "value" : me.pfc_code||"",//传递的值
            "id" : "6"                //其他信息的ID,6代表source_code
            },
          ],
				}
			})
			.then(function (ret) {
				utils.storageSet("mall_token", ret.model.data.session.sid);
        utils.storageSet("mall_uid", ret.model.data.session.uid);
        utils.storageSet("mobile", me.info.phone);

        utils.syncSetNativeStorage({
          "mall_token":ret.model.data.session.sid,
          "mall_uid":ret.model.data.session.uid,
          "mobile":me.info.phone,
        });

	  		me.$store.commit('setMallToken',ret.model.data.session.sid);
	  		cb&cb();
			})
			.catch(function(ret){
				!ret.__servererror__ && Toast(ret.errorMessage||"未知错误！");
			});
		},
	}

};
</script>


<style lang="less" scoped>
@import "./register.less";
</style>