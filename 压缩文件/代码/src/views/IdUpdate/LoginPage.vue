<template>
    <div class="main bg-fixed">
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
                <input type="text" placeholder="请输入证件号码" id="indentNum" maxlength="18" v-model="IdNum" @input="checkIdNum" @blur="getIdNum" ref="indentNum">
                <span class="msg">{{remindmsg.indentMsg}}</span>
            </div>
        </div>
        <div class="li-cell">
            <div class="login-cell">
                <div class="cell-left"><label for="phoneNum">手机号码</label></div>
                <input type="tel" placeholder="请输入手机号码" id="phoneNum" maxlength="11" v-model="PhoneNum" @focus="inputPhone" @input="checkPhoneNum" @blur="getPhoneNum" ref="phoneNum">
                <span class="msg">{{remindmsg.phoneMsg}}</span>
                <span class="msg-one">{{remindmsg.codeMsg}}</span>
            </div>
        </div>
        <BTextCode @getValue="getIdent" @achieveValue="checkIdent" @getCode="getCode" :textMsg="textMsg.msg"></BTextCode>
        <YImageCode :bgImg="imageCode.bgImg" :slideImg="imageCode.slideImg" :show="imageCode.show" @getMove="getMove" @refresh="refresh"></YImageCode>
        <YFunctionBtn text="登 录" :dis="disshow" @checktable="checkInfo"></YFunctionBtn>
        <YVersion :version="version" top="10%"></YVersion>
        <YErrorAlert :msg="alert.msg" :err="alert.err" :show="alert.showAlert" @confirm="confirm_login"></YErrorAlert>
    </div>
</template>

<script>
    // 引入所需的方法、组件
    import {mapActions,mapState} from "vuex";
    import BTextCode from "../../components/BTextCode";
    import YImageCode from "../../components/YImageCode";
    import YFunctionBtn from "../../components/YFunctionBtn";
    import YVersion from "../../components/YVersion";
    import YErrorAlert from "../../components/YErrorAlert";
    import {initsa,track,checkIssueDate,getLength,getSearch} from "@/assets/js/common.js"; //听云监听
    export default {
        name: 'LoginPage', //登录页面
        data(){
            return { //绑定数据
                IdNum:"",        // 证件号码
                PhoneNum:"",     // 手机号
                icode:"",        // 验证码
                disshow:"",      // 验证登录生效
                loginkhid:"",      // 听云唯一标识
                workType:""      // 业务类型
            }
        },
        computed:mapState({
            loginData: state => state.com.login.loginData,
            imageCode: state => state.com.login.identify.imageCode,
            remindmsg: state => state.com.login.loginData.remindmsg,
            textMsg: state => state.com.login.identify.textMsg,
            alert: state => state.com.login.alert,
            version: state => state.iu.version,
        }),
        created(){
            this.initLogin(); //初始化首页
        },
        methods:{
            initLogin(){
                // document.body.ontouchmove = function(event){
                //     window.event.returnValue = false;
                // };
                this.loginkhid = initsa("证件有效期更新登录页面");  //初始化监听
                this.workType = getSearch("type");
                // this.workType = location.href.split("type=")[1].split("#")[0];
            },
            getIdNum(){  // 证件号码blur事件
                setTimeout(()=>{
                    var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                    window.scrollTo(0,Math.max(scrollHeight - 1,0));
                },100);
                var indent = $.trim(this.IdNum).replace(/\s+/g," ").toUpperCase();
                this.IdNum = indent;
                this.$store.commit('com/BASSINID',{IdNum:this.IdNum});
                if(indent==""){
                    this.$store.commit('com/BSHOWINDENTMSG',{msg:"证件号码不能为空"});
                    return false;
                }else if(!checkIssueDate(indent)){
                    this.$store.commit('com/BSHOWINDENTMSG',{msg:"请输入正确的18位证件号码"});
                    return false;
                }else{
                    this.$store.commit('com/BSHOWINDENTMSG',{msg:""});
                }
            },
            checkIdNum(){ // 证件号码input事件
                var indent = $.trim(this.IdNum).replace(/\s+/g," ").toUpperCase();
                if(checkIssueDate(indent) && /^1\d{10}$/.test(this.PhoneNum) && $.trim(this.icode).length==6){
                    this.disshow = true;
                }else{
                    this.disshow = false;
                }
            },
            inputPhone(){
                track("idupdate_inputPhone","证件有效期更新登录页手机号输入操作");
            },
            getPhoneNum(){ // 手机号blur事件
                setTimeout(()=>{
                    var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                    window.scrollTo(0,Math.max(scrollHeight - 1,0));
                },100);
                var tel = $.trim(this.PhoneNum);
                this.PhoneNum = tel;
                this.$store.commit('com/BASSINPHONE',{PhoneNum:this.PhoneNum});
                if(tel==""){
                    this.$store.commit('com/BSHOWPHONEMSG',{msg:"手机号码不能为空"});
                    return false;
                }else if(!/^1\d{10}$/.test(tel)){
                    this.$store.commit('com/BSHOWPHONEMSG',{msg:"请输入正确的11位手机号码"});
                    return false;
                }else{
                    this.$store.commit('com/BSHOWPHONEMSG',{msg:""});
                }
            },
            checkPhoneNum(){ // 手机号input事件
                var indent = $.trim(this.IdNum).replace(/\s+/g," ").toUpperCase(); 
                if(checkIssueDate(indent) && /^1\d{10}$/.test(this.PhoneNum) && $.trim(this.icode).length==6){
                    this.disshow = true;
                }else{
                    this.disshow = false;
                }
            },
            getIdent(codedata){ // 验证码blur事件
                setTimeout(()=>{
                    var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                    window.scrollTo(0,Math.max(scrollHeight - 1,0));
                },100);
                this.icode = codedata;
                var code = $.trim(this.icode);
                var len = getLength(code);
                if(code==""){
                    this.$store.commit('com/BSHOWCODEMSG',{msg:"验证码不能为空"});
                    return false;
                }else if(len < 6){
                    this.$store.commit('com/BSHOWCODEMSG',{msg:"请输入6位验证码"});
                    return false;
                }else{
                    this.$store.commit('com/BSHOWCODEMSG',{msg:""});
                }
            },
            checkIdent(codedata){ // 验证码input事件
                this.icode = codedata;
                var indent = $.trim(this.IdNum).replace(/\s+/g," ").toUpperCase(); 
                if(checkIssueDate(indent) && /^1\d{10}$/.test(this.PhoneNum) && $.trim(this.icode).length==6){
                    this.disshow = true;
                }else{
                    this.disshow = false;
                }
            },
            getCode(){ // 获取验证码click事件
                var tel = this.PhoneNum;
                if(tel==""){
                    this.$store.commit('com/BSHOWLOGINALERT', {show: true, msg: '手机号码不能为空', err: ''});
                }else if(!/^1\d{10}$/.test(tel)){
                    this.$store.commit('com/BSHOWLOGINALERT', {show: true, msg: '请输入正确的11位手机号码', err: ''});
                }else{
                    if(this.textMsg.status == 1){
                        track("idupdate_logingetCode","证件有效期更新登录页获取验证码");
                        this.$store.dispatch('com/getphonecode',{
                            loginData:this.loginData,      // 电话号码(phoneNum)
                            imageCode:this.imageCode,      // 移动距离(sendlen)
                            workType:this.workType         // 业务类型
                        });
                    }
                }
            },
            checkInfo(){
                var indent = $.trim(this.IdNum).replace(/\s+/g," ").toUpperCase();
                if(checkIssueDate(indent) && /^1\d{10}$/.test(this.PhoneNum) && $.trim(this.icode).length==6){
                    track("idupdate_Login","证件有效期更新登录页登录按钮");
                    this.$store.dispatch("com/login",{
                        idNo:this.IdNum,
                        idType:"01",
                        phone:this.PhoneNum,
                        code:this.icode,
                        loginkhid:this.loginkhid,
                        router:this.$router,
                        workType:this.workType
                    });
                }
            },
            confirm_login(){
                this.$store.commit('com/BSHOWLOGINALERT', {show: false, msg: '', err: ''});
            },
            getMove(value){  // 获取滑动距离
                this.$store.commit('com/BIMAGECODEMOVE',value);
                this.$store.dispatch('com/sendphonelen',{
                    loginData:this.loginData,        // 电话号码(phoneNum)
                    imageCode:this.imageCode,        // 移动距离(sendlen)
                    workType:this.workType           // 业务类型
                });
            },
            refresh(){   // 点击刷新
                this.$store.dispatch('com/refreshImage',{
                    loginData:this.loginData,        // 电话号码(phoneNum)
                    workType:this.workType           // 业务类型
                });
            },
        },
        components:{
            BTextCode,
            YImageCode,
            YFunctionBtn,
            YVersion,
            YErrorAlert
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
.msg-one{position: absolute;left: 1.2rem;top:0.93rem;font-size: 0.12rem; color: red;}
.login-cell img{width: 0.15rem;height: 0.15rem;position: absolute;right: 5.3%;top: 0.20rem;}
</style>