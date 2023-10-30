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
        <div class="li-cell" v-show="typeShow">
            <div class="login-cell">
                <div class="cell-left"><label for="indentType">证件类型</label></div>
                <input type="text" value="身份证" id="indentType" readonly="readonly">
            </div>
        </div>
        <div class="li-cell" @click="chosetype" v-show="typeAllShow">
            <div class="login-cell">
                <div class="cell-left"><label for="indentAllType">证件类型</label></div>
                <input type="text" v-model="typeValue" id="indentAllType" @focus="typeSelect" ref="indentAllType" readonly="readonly">
                <img src="@/assets/images/to.png" alt="">
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
        <form id="loginForm" :action="GLOBAL.URL+'/main/manage/newAuthorization/authorize.html'" method="post" v-show="formShow" ref="loginForm">
        <!-- <form id="loginForm" action="https://ccshop.cib.com.cn:8010/evercos/main/manage/newAuthorization/authorize.html" method="post" v-show="formShow" ref="loginForm"> -->
            <input type="text" name="idType" v-model="idType"><br>
            <input type="text" name="idNo" v-model="pwdIdNum"><br> 
            <input type="text" name="mobile" v-model="pwdPhoneNum"><br> 
            <input type="text" name="smsCode" v-model="icode"><br> 
            <input type="text" name="sliderId" v-model="sliderId"><br> 
            <input type="text" name="state" v-model="state"><br> 
            <input type="text" name="idtypePass" v-model="idtypePass"><br>
            <input type="text" name="timestamp" v-model="timestamp">
        </form>
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
    import {initsa,track,checkIssueDate,getLength,getSearch,base64Decode,encryptByDES} from "@/assets/js/common.js"; 
    export default {
        name: 'LoginPage',
        data(){
            return { 
                IdNum:"",               // 证件号码
                PhoneNum:"",            // 手机号
                icode:"",               // 验证码
                disshow:"",             // 验证登录生效
                tip:"",                 // 错误信息
                errCode:"",             // 错误码
                sliderId:"",            // 判断依据
                state:"",               // 判断依据
                idtypePass:"",          // 判断身份证还是其他类型
                typeShow:"",            // 单种证件类型(身份证)
                typeAllShow:"",         // 多种证件类型
                idType:"",              // 选中的证件类型对应字段
                typeValue:"身份证",      // 选中的证件类型内容
                formShow:"",            // 隐藏form表单
                timestamp:Date.now() + '',// 时间戳
                pwdIdNum:"",            // 加密后证件号码
                pwdPhoneNum:""          // 加密后手机号
            }
        },
        computed:mapState({
            loginData: state => state.log.login.loginData,
            imageCode: state => state.log.login.identify.imageCode,
            remindmsg: state => state.log.login.loginData.remindmsg,
            textMsg: state => state.log.login.identify.textMsg,
            alert: state => state.log.login.alert,
            version: state => state.log.version,
        }),
        created(){
            this.initLogin();                   
        },
        methods:{
            initLogin(){                                        // 初始化首页
                initsa("授权登录页面");
                this.tip = base64Decode(getSearch("tip"));      // 错误信息
                this.errCode = getSearch("errCode");            // 错误码
                this.sliderId = getSearch("sliderId");          
                this.state = getSearch("state"); 
                this.idtypePass = getSearch("idtypePass");      // 判断业务类型
                if(this.tip!=""){
                    this.$store.commit('log/BSHOWLOGINALERT', {show: true, msg: this.tip, err: this.errCode});
                }
                if(this.idtypePass=="0"){
                    this.typeShow = false;
                    this.typeAllShow = true;
                    this.idType = "01";
                }else if(this.idtypePass=="1"){
                    this.typeShow = true;
                    this.typeAllShow = false;
                    this.idType = "01";
                }
            },
            checkBtn(){                                         // 改变按钮状态
                var indent = $.trim(this.IdNum).replace(/\s+/g," ").toUpperCase();
                if(this.idtypePass=="1"){
                    if(checkIssueDate(indent) && /^1\d{10}$/.test(this.PhoneNum) && $.trim(this.icode).length==6){
                        this.disshow = true;
                    }else{
                        this.disshow = false;
                    }
                }else if(this.idtypePass=="0"){
                    if(indent!="" && /^1\d{10}$/.test(this.PhoneNum) && $.trim(this.icode).length==6){
                        this.disshow = true;
                    }else{
                        this.disshow = false;
                    }
                }
            },
            chosetype(){                                        // 选择证件类型1
                this.$refs.indentNum.blur();
                this.$refs.phoneNum.blur();
                this.typeSelect();
            },
            typeSelect(){                                       // 选择证件类型2
                this.$refs.indentAllType.blur();
                $("#indentAllType").picker({
                    cols: [
                        {
                            textAlign: 'center',
                            values: ['身份证','军官证','台胞证','护照','港澳通行证','台湾居民居住证','其他']
                        }
                    ],
                    value:['身份证'],
                    onClose:(result)=>{
                        this.typeValue = result.value;
                        if(this.typeValue=="身份证"){
                            this.idType = "01";
                        }else if(this.typeValue=="军官证"){
                            this.idType = "03";
                        }else if(this.typeValue=="台胞证"){
                            this.idType = "04";
                        }else if(this.typeValue=="护照"){
                            this.idType = "10";
                        }else if(this.typeValue=="台湾居民居住证"){
                            this.idType = "91";
                        }else if(this.typeValue=="港澳通行证"){
                            this.idType = "90";
                        }else if(this.typeValue=="其他"){
                            this.idType = "20";
                        }
                    }
                });
            },
            getIdNum(){                                         // 证件号码blur事件
                setTimeout(()=>{
                    var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                    window.scrollTo(0,Math.max(scrollHeight - 1,0));
                },100);
                var indent = $.trim(this.IdNum).replace(/\s+/g," ").toUpperCase();
                this.IdNum = indent;
                this.$store.commit('log/BASSINID',{IdNum:this.IdNum});
                if(this.idtypePass=="1"){
                    if(indent==""){
                        this.$store.commit('log/BSHOWINDENTMSG',{msg:"证件号码不能为空"});
                        return false;
                    }else if(!checkIssueDate(indent)){
                        this.$store.commit('log/BSHOWINDENTMSG',{msg:"请输入正确的18位证件号码"});
                        return false;
                    }else{
                        this.$store.commit('log/BSHOWINDENTMSG',{msg:""});
                        this.pwdIdNum = encryptByDES(this.IdNum,"sybzdwydsmm"+this.timestamp); // 证件号码加密
                    }
                }else if(this.idtypePass=="0"){
                    if(this.typeValue=="身份证"){
                        if(indent==""){
                            this.$store.commit('log/BSHOWINDENTMSG',{msg:"证件号码不能为空"});
                            return false;
                        }else if(!checkIssueDate(indent)){
                            this.$store.commit('log/BSHOWINDENTMSG',{msg:"请输入正确的18位证件号码"});
                            return false;
                        }else{
                            this.$store.commit('log/BSHOWINDENTMSG',{msg:""});
                            this.pwdIdNum = encryptByDES(this.IdNum,"sybzdwydsmm"+this.timestamp); // 证件号码加密
                        }
                    }else{
                         if(indent==""){
                            this.$store.commit('log/BSHOWINDENTMSG',{msg:"证件号码不能为空"});
                            return false;
                        }else{
                            this.$store.commit('log/BSHOWINDENTMSG',{msg:""});
                            this.pwdIdNum = encryptByDES(this.IdNum,"sybzdwydsmm"+this.timestamp); // 证件号码加密
                        }
                    }
                }
            },
            checkIdNum(){                                       // 证件号码input事件
               this.checkBtn();
            },
            inputPhone(){                                       // 手机号码输入监听
                track("login_inputPhone","授权登录页手机号输入操作");
            },
            getPhoneNum(){                                      // 手机号blur事件
                setTimeout(()=>{
                    var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                    window.scrollTo(0,Math.max(scrollHeight - 1,0));
                },100);
                var tel = $.trim(this.PhoneNum);
                this.PhoneNum = tel;
                this.$store.commit('log/BASSINPHONE',{PhoneNum:this.PhoneNum});
                if(tel==""){
                    this.$store.commit('log/BSHOWPHONEMSG',{msg:"手机号码不能为空"});
                    return false;
                }else if(!/^1\d{10}$/.test(tel)){
                    this.$store.commit('log/BSHOWPHONEMSG',{msg:"请输入正确的11位手机号码"});
                    return false;
                }else{
                    this.$store.commit('log/BSHOWPHONEMSG',{msg:""});
                    this.pwdPhoneNum = encryptByDES(this.PhoneNum,"sybzdwydsmm"+this.timestamp); // 电话号码加密
                }
            },
            checkPhoneNum(){                                    // 手机号input事件
                this.checkBtn();
            },
            getIdent(codedata){                                 // 验证码blur事件
                setTimeout(()=>{
                    var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                    window.scrollTo(0,Math.max(scrollHeight - 1,0));
                },100);
                this.icode = codedata;
                var code = $.trim(this.icode);
                var len = getLength(code);
                if(code==""){
                    this.$store.commit('log/BSHOWCODEMSG',{msg:"验证码不能为空"});
                    return false;
                }else if(len < 6){
                    this.$store.commit('log/BSHOWCODEMSG',{msg:"请输入6位验证码"});
                    return false;
                }else{
                    this.$store.commit('log/BSHOWCODEMSG',{msg:""});
                }
            },
            checkIdent(codedata){                               // 验证码input事件
                this.icode = codedata;
                this.checkBtn();
            },
            getCode(){                                          // 获取验证码click事件
                var tel = this.PhoneNum;
                if(tel==""){
                    this.$store.commit('log/BSHOWLOGINALERT', {show: true, msg: '手机号码不能为空', err: ''});
                }else if(!/^1\d{10}$/.test(tel)){
                    this.$store.commit('log/BSHOWLOGINALERT', {show: true, msg: '请输入正确的11位手机号码', err: ''});
                }else{
                    if(this.textMsg.status == 1){
                        track("login_getCode","授权登录页获取验证码");
                        var mobile = encryptByDES(this.PhoneNum,"sybzdwydsmm"+this.timestamp);
                        this.$store.dispatch('log/bgetphonecode',{
                            mobile:mobile,      
                            sliderId:this.sliderId,
                            timestamp:this.timestamp
                        });
                    }
                }
            },
            checkInfo(){                                        // 登录form表单提交
                var indent = $.trim(this.IdNum).replace(/\s+/g," ").toUpperCase();
                if(this.idtypePass=="1"){
                    if(checkIssueDate(indent) && /^1\d{10}$/.test(this.PhoneNum) && $.trim(this.icode).length==6){
                        track("login_submit","授权登录页登录提交");
                        this.$refs.loginForm.submit();
                    }
                }else if(this.idtypePass=="0"){
                    if(indent!="" && /^1\d{10}$/.test(this.PhoneNum) && $.trim(this.icode).length==6){
                        track("login_submit","授权登录页登录提交");
                        this.$refs.loginForm.submit();
                    }
                }
            },
            confirm_login(){                                    // 关闭登录页弹框
                this.$store.commit('log/BSHOWLOGINALERT', {show: false, msg: '', err: ''});
            },
            getMove(value){                                     // 滑动滑块事件
                this.$store.commit('log/BIMAGECODEMOVE',value);
                var mobile = encryptByDES(this.PhoneNum,"sybzdwydsmm"+this.timestamp);
                this.$store.dispatch('log/sendphonelen',{
                    mobile:mobile,        
                    sliderId:this.sliderId,
                    imageCode:this.imageCode,        // 移动距离(sendlen)
                    timestamp:this.timestamp
                });
            },
            refresh(){                                          // 点击刷新按钮
                this.$store.dispatch('log/refreshImage',{
                    sliderId:this.sliderId
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