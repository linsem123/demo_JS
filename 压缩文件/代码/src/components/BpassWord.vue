// 密码输入框
// skip 页面返回路径
// getValue 返回输入的6位密码
// pwdShow 密码框显示状态 默认隐藏
<template lang="pug">
    <div id="pwd" v-if="pwdShow">
        <div class="pwd">
            <div class="pwd-title">请输入信用卡交易密码</div>
            <img class="pwd-img" src="../assets/images/lendcash/back.png" alt="" @click="goBack">
            <input ref="pwdInput" v-if="pwdShow" autofocus="autofocus" id="pwdInput" type="tel" pattern="[0-9]" maxlength="6" v-model="msg" class="pwd-input" @input="getValue" @blur="outInput" />
            <ul class="pwd-wrap" @click="pwdClick">
                <li><i v-if="msgLength > 0"></i></li>
                <li><i v-if="msgLength > 1"></i></li>
                <li><i v-if="msgLength > 2"></i></li>
                <li><i v-if="msgLength > 3"></i></li>
                <li><i v-if="msgLength > 4"></i></li>
                <li><i v-if="msgLength > 5"></i></li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    name: "BpassWord",
    props: ['pwdShow'],
    data(){
        return{
            msg:'', 
            msgLength:0,
        } 
    },
    watch:{
      msg(curVal){
        if(/[^\d]/g.test(curVal)){
          this.msg = this.msg.replace(/[^\d]/g,'');
        }else{
            this.msgLength = curVal.length;
        }
      },
    },
    methods: {
        goBack(){
            this.$emit("goBack");
        },
        pwdClick(){
            this.$refs.pwdInput.focus();
        },
        getValue(){
            if(this.msg.length==6){
                this.$emit("getValue",this.msg);
                this.msg = "";
                this.$refs.pwdInput.blur();
            }
        },
        outInput(){
            setTimeout(()=>{
                var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                window.scrollTo(0,Math.max(scrollHeight - 1,0));
            },100);
        }
    }
}
</script>
<style scoped>
#pwd{width:100%;height:100%;background:rgba(0,0,0,0.4);position: fixed;left:0;top:0;}
.pwd{background:#F6F6F7;height: 1.76rem;z-index: 999;position: absolute;bottom: 0;width: 100%;}
.pwd-title{font-size: 0.17rem;height: 0.24rem;line-height: 0.24rem;text-align: center;padding:0.13rem 0;margin-bottom: 0.3rem;}
.pwd-img{position: absolute;left: 0.1rem;top: 0.13rem;width: 0.255rem;}
.pwd-input{position: absolute;z-index: -1;left:-100%;opacity: 0;height:0.55rem;}
.pwd-wrap{width: 88%;height: 0.55rem;margin: 0 auto;background: #fff;border:0.01rem solid #ddd;display: flex;
display: -webkit-box;display: -webkit-flex;cursor: pointer;}
.pwd-wrap li{list-style-type:none;text-align: center;line-height: 0.55rem;-webkit-box-flex: 1;flex: 1;-webkit-flex: 1;
border-right:0.01rem solid #ddd ;}
.pwd-wrap li:last-child{border-right: 0;}
.pwd-wrap li i{height: 0.14rem;width: 0.14rem;border-radius:50% ;background: #666;display: inline-block;position: relative;
top:0.03rem;}
</style>
