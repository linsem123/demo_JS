<template>
    <div class="head_phone">
        <div class="ident_phone">
            <div class="ident-left"><label for="identPhoneCode">短信验证码</label></div>
            <input type="tel" pattern="[0-9]" maxlength="6" id="identPhoneCode" placeholder="请输入验证码" @blur="getValue" @input="achieveValue" v-model="phoneicode"/>
            <span class="msg">{{ldata.codeMsg}}</span>
            <button id="yz_phone" data-flag="phoneflag" class="weui-vcode-btn" @click="getPhoneCode">{{ldata.identTxt}}</button>
        </div>
    </div>
</template>
<script>
import {mapActions,mapState} from "vuex";
import api from "../api/api.js";  //调用接口
import {track} from "@/assets/js/common.js"; //听云监听
import { clearInterval, setInterval } from 'timers';
export default {
    name:"IdentPhoneCode",  //短信验证码
    data(){
        return{
            phoneflag:"",
            phoneicode:""
        }
    },
    computed:mapState({
        laystatu:state => state.a.home.menu.laystatu,
        imagestatu:state => state.a.home.menu.imagestatu,
        hdata:state => state.a.home.hdata,
        ldata:state => state.a.login.ldata,
        ui:state => state.a.home.ui,
        logui:state => state.a.login.logui
    }),
    methods:{
        getPhoneCode(){ //获取短信验证码 详情见getidentcode actions
            track("defq_LoginGetCode","兴享贷登录页获取短信验证码");
            var tel =  $.trim(this.logui.TelNum);
            if(tel==""){
                this.ldata.phoneMsg = "手机号码不能为空";
                return false;
            }else if(!/^1\d{10}$/.test(tel)){
                this.ldata.phoneMsg = "请输入正确的11位手机号码";
                return false;
            }else{
                this.ldata.phoneMsg = "";
                this.phoneflag = this.ldata.identflag;
                if(this.phoneflag==true){
                    this.$store.dispatch('getphonecode',{
                        logui:this.logui,
                        phoneflag:this.phoneflag
                    })
                }
            }   
        },
        getValue(){
            this.$emit("getValue",this.phoneicode);
        },
        achieveValue(){
            this.$emit("achieveValue",this.phoneicode);
        }
    }
}
</script>
<style scoped>
.head_phone{background:#fff;}
.ident_phone{display: flex;padding:0.15rem 5.3%;box-sizing: border-box;position: relative;}
.ident_phone .ident-left{width:0.8rem;margin-right: 0.2rem;height: 0.24rem;line-height: 0.24rem;font-size: 0.15rem;}
#identPhoneCode{width: 0.92rem;border: none;height: 0.24rem;line-height: 0.24rem;margin-right: 0.2rem;font-size: 0.15rem;}
#identPhoneCode:-moz-placeholder{letter-spacing: 0.0018rem;}
#identPhoneCode::-webkit-input-placeholder{letter-spacing: 0.0018rem;}
#identPhoneCode:-ms-input-placeholder{letter-spacing: 0.0018rem;}
#yz_phone{color:#0060F1;height: 0.24rem;line-height: 0.24rem;background:none;font-size: 0.15rem;outline: none;width: 1.1rem;
text-align: center;position: relative;left: 0.2rem;}
.msg{position: absolute;left: 1.2rem;bottom: 0;font-size: 0.12rem; color: red;}
</style>
