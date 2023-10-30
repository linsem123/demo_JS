<template>
    <div class="main" :class="{'bg-fixed': laystatu || imagestatu}">
        <div class="head_one">
            <div class="head_top">
                <div class="top_one">
                    <img src="@/assets/images/xybank.png" alt="">
                </div>
                <div class="top_two">
                    <span class="top_blank"></span>
                    <span class="top_txt">用户登录</span>
                    <span class="top_blank"></span>
                </div>
            </div>
        </div>
        <div class="li-cell">
            <div class="login-cell">
                <div class="cell-left"><label for="indentType">证件类型</label></div>
                <input type="text" value="身份证" id="indentType" readonly="readonly">
            </div>
        </div>
        <div class="li-cell">
            <div class="login-cell">
                <div class="cell-left"><label for="indentNum">证件号码</label></div>
                <input type="text" placeholder="请输入证件号码" id="indentNum" maxlength="18" v-model="IdNum" @blur="getIdNum" @input="checkIdNum" ref="indentNum">
                <span class="msg">{{ldata.indentMsg}}</span>
            </div>
        </div>
        <div class="li-cell">
            <div class="login-cell">
                <div class="cell-left"><label for="phoneNum">手机号码</label></div>
                <input type="tel" placeholder="请输入手机号码" id="phoneNum" maxlength="11" v-model="PhoneNum" @blur="getPhoneNum" @focus="inphone" @input="checkPhoneNum" ref="phoneNum">
                <span class="msg">{{ldata.phoneMsg}}</span>
            </div>
        </div>
        <IdentPhoneCode @getValue="getIdent" @achieveValue="checkIdent"></IdentPhoneCode>
        <ImagePhoneCode v-if="imagestatu"></ImagePhoneCode>
        <YFunctionBtn text="登 录" :dis="disshow" @checktable="checkInfo"></YFunctionBtn>
        <p id="copyright">&copy;本服务由兴业银行信用卡中心提供&nbsp;v{{hdata.copyright}}</p>
    </div>
</template>

<script>
    // 引入所需的方法、组件
    import {mapActions,mapState} from "vuex";
    import YFunctionBtn from "@/components/YFunctionBtn.vue";
    import IdentPhoneCode from "@/components/IdentPhoneCode.vue";
    import ImagePhoneCode from "@/components/ImagePhoneCode.vue";
    import {initsa,track,checkIssueDate,getLength} from "@/assets/js/common.js"; //听云监听
    export default {
        name: 'login', //登录页面
        data(){
            return { //绑定数据
                IdNum:"",        //证件号
                PhoneNum:"",     //手机号
                icode:"",
                disshow:"",
                khid:"",
            }
        },
        computed:mapState({
            laystatu:state => state.a.home.menu.laystatu,
            imagestatu:state => state.a.home.menu.imagestatu,
            logui:state => state.a.login.logui,
            hdata:state => state.a.home.hdata,
            ldata:state => state.a.login.ldata
        }),
        created(){
            this.initLogin(); //初始化首页
        },
        methods:{
            initLogin(){
                this.khid = initsa("兴享贷登录");
            },
            inphone(){
                track("defq_LoginPhone","兴享贷登录页手机号输入操作");
            },
            getIdNum(){
                setTimeout(()=>{
                    var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                    window.scrollTo(0,Math.max(scrollHeight - 1,0));
                },100);
                var indent = $.trim(this.IdNum).replace(/\s+/g," ").toUpperCase();
                this.IdNum = indent;
                this.$store.dispatch("assginid",{
                    IdNum:this.IdNum,
                });
                if(indent==""){
                    this.ldata.indentMsg = "证件号码不能为空";
                    return false;
                }else if(!checkIssueDate(indent)){
                    this.ldata.indentMsg = "请输入正确的18位证件号码";
                    return false;
                }else{
                    this.ldata.indentMsg = ""; 
                }
            },
            checkIdNum(){
                var indent = $.trim(this.IdNum).replace(/\s+/g," ").toUpperCase();
                if(checkIssueDate(indent) && /^1\d{10}$/.test(this.PhoneNum) && $.trim(this.icode).length==6){
                    this.disshow = true;
                }else{
                    this.disshow = false;
                }
            },
            getPhoneNum(){
                setTimeout(()=>{
                    var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                    window.scrollTo(0,Math.max(scrollHeight - 1,0));
                },100);
                var tel = $.trim(this.PhoneNum);
                this.PhoneNum = tel;
                this.$store.dispatch("assgintel",{
                    PhoneNum:this.PhoneNum
                });
                if(tel==""){
                    this.ldata.phoneMsg = "手机号码不能为空";
                    return false;
                }else if(!/^1\d{10}$/.test(tel)){
                    this.ldata.phoneMsg = "请输入正确的11位手机号码";
                    return false;
                }else{
                    this.ldata.phoneMsg = "";
                    return true;
                }
            },
            checkPhoneNum(){
                var indent = $.trim(this.IdNum).replace(/\s+/g," ").toUpperCase(); 
                if(checkIssueDate(indent) && /^1\d{10}$/.test(this.PhoneNum) && $.trim(this.icode).length==6){
                    this.disshow = true;
                }else{
                    this.disshow = false;
                }
            },
            getIdent(pcodedata){
                this.icode = pcodedata; 
                setTimeout(()=>{
                    var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                    window.scrollTo(0,Math.max(scrollHeight - 1,0));
                },100);
                var code = $.trim(this.icode);
                this.icode = code;
                var len = getLength(code);
                if(code==""){
                    this.ldata.codeMsg = "验证码不能为空";
                    return false;
                }else if(len<6){
                    this.ldata.codeMsg = "请输入6位验证码";
                    return false;
                }else{
                    this.ldata.codeMsg = "";
                    return true;
                }
            },
            checkIdent(pcodedata){
                this.icode = pcodedata;
                var indent = $.trim(this.IdNum).replace(/\s+/g," ").toUpperCase(); 
                if(checkIssueDate(indent) && /^1\d{10}$/.test(this.PhoneNum) && $.trim(this.icode).length==6){
                    this.disshow = true;
                }else{
                    this.disshow = false;
                }
            },
            checkInfo(){
                var indent = $.trim(this.IdNum).replace(/\s+/g," ").toUpperCase();
                if(checkIssueDate(indent) && /^1\d{10}$/.test(this.PhoneNum) && $.trim(this.icode).length==6){
                    track("defq_Login","兴享贷登录页登录按钮");
                    this.$store.dispatch("login",{
                        idNo:this.IdNum,
                        idType:"01",
                        phone:this.PhoneNum,
                        code:this.icode,
                        khid:this.khid,
                        router:this.$router
                    });
                }
            }
        },
        components:{
            IdentPhoneCode,
            ImagePhoneCode,
            YFunctionBtn
        }
    }
</script>

<style scoped>
.main{background:#F4F6F8;height: 100%;overflow: hidden;}
.bg-fixed{position: fixed;overflow: hidden;top:0;left:0;bottom:0;right:0;}
.top_one{text-align: center;padding: 0.33rem 0 0.25rem;}
.top_one img{width:1.86rem;}
.top_two{text-align: center;margin-bottom: 0.15rem;}
.top_blank{display: inline-block;width: 1.25rem;background: #b4b4b6;height: 0.01rem;margin: 0 0.1rem;position: relative;top: -0.05rem}
.top_txt{font-size: 0.14rem;color: #b4b4b6;}
.li-cell{border-bottom: 0.01rem solid #d2d2d2;}
.login-cell{display: flex;padding: 0.15rem 5.3%;box-sizing: border-box;background:#fff;position: relative;}
.cell-left{width: 0.8rem;margin-right: 0.2rem;height: 0.24rem;line-height: 0.24rem;font-size: 0.15rem;}
.login-cell input{border: none;font-size: 0.15rem;height: 0.24rem;line-height: 0.24rem;width:2.4rem;}
.msg{position: absolute;left: 1.2rem;bottom: 0;font-size: 0.12rem; color: red;}
.login-cell img{width: 0.15rem;height: 0.15rem;position: absolute;right: 5.3%;top: 0.20rem;}
#copyright{font-size:0.12rem;text-align: center;color:#666;margin-top:0.4rem;}
</style>