<template>
    <div class="head_card">
        <div class="ident_card">
            <div class="ident-left"><label for="identCardCode">短信验证码</label></div>
            <input type="tel" pattern="[0-9]" maxlength="6" id="identCardCode" placeholder="请输入验证码" @blur="achievecode" v-model="cardicode" @input="checksub"/>           
            <button id="yz_card" data-flag="cardflag" class="weui-vcode-btn" @click="getCardCode">{{pdata.identTxt}}</button>
        </div>
    </div>
</template>
<script>
import {mapActions,mapState} from "vuex";
import api from "../api/api.js";  //调用接口
import { clearInterval, setInterval } from 'timers';
export default {
    name:"IdentCardCode",  //短信验证码
    data(){
        return{
            cardflag:"",
            cardicode:""
        }
    },
    computed:mapState({
        laystatu:state => state.a.home.menu.laystatu,
        imagestatu:state => state.a.home.menu.imagestatu,
        hdata:state => state.a.home.hdata,
        pdata:state => state.a.public.pdata,
        ui:state => state.a.home.ui
    }),
    methods:{
        getCardCode(){ //获取短信验证码
            this.cardflag = this.pdata.identflag;
            if(this.cardflag==true){
                this.$store.dispatch('getcardcode',{
                    hdata:this.hdata,
                    cardflag:this.cardflag
                })
            }
        },
        achievecode(){
            setTimeout(()=>{
                var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                window.scrollTo(0,Math.max(scrollHeight - 1,0));
            },100);
            if(this.cardicode=="" || this.cardicode.length==0){
                $(".main").addClass("bg-fixed");
                $.alert("验证码不能为空","提示",()=>{
                    $(".main").removeClass("bg-fixed");
                });
            }else if(!/^[0-9]+$/.test(this.cardicode)){
                $(".main").addClass("bg-fixed");
                $.alert("验证码格式不正确,请重新输入","提示",()=>{
                    $(".main").removeClass("bg-fixed");
                });
            }else if(this.cardicode.length<6){
                $(".main").addClass("bg-fixed");
                $.alert("验证码为6位数字","提示",()=>{
                    $(".main").removeClass("bg-fixed");
                });
            }else if(this.cardicode.length==6){
                this.$emit("geticode",this.cardicode);
            }
        },
        checksub(){
            if(this.hdata.applyNum >= 1000 && Number(this.hdata.applyNum) <= Number(this.hdata.maxNum) && this.ui.hascard==true && this.cardicode.length==6 && this.hdata.imgshow_two == true ){
                this.ui.subShow = true;
            }else{
                this.ui.subShow = false;
            }
        }
    }
}
</script>
<style scoped>
.head_card{background:#fff;}
.ident_card{display: flex;padding:0.15rem 5.3%;box-sizing: border-box;}
.ident_card .ident-left{width:0.8rem;margin-right: 0.2rem;height: 0.24rem;line-height: 0.24rem;font-size: 0.15rem;}
#identCardCode{width: 0.92rem;border: none;height: 0.24rem;line-height: 0.24rem;margin-right: 0.2rem;font-size: 0.15rem;}
#identCardCode:-moz-placeholder{letter-spacing: 0.0018rem;color:#B5B5B5;}
#identCardCode::-webkit-input-placeholder{letter-spacing: 0.0018rem;color:#B5B5B5}
#identCardCode:-ms-input-placeholder{letter-spacing: 0.0018rem;color:#B5B5B5}
#yz_card{color:#0060F1;height: 0.24rem;line-height: 0.24rem;background:none;font-size: 0.15rem;outline: none;width: 1.1rem;
text-align: center;position: relative;left: 0.2rem;}
</style>
