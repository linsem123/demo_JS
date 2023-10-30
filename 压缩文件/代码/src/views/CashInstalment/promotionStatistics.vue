<template>
<div id="container">
    <img :src="banner" :style=style />
    <ul>
        <li>
            <el-row>
                <el-col :span="6"><span>姓名<i>*</i></span></el-col>
                <el-col :span="18"><input type="text" placeholder="请输入推荐人姓名" maxlength="8" v-model="promotion.name" @blur="checkNameF" @input="hideErr('name')" @focus='toSetHeight'></el-col>
                <el-col :span="18" class="err"><p>{{promotion.nameErr}}</p></el-col>
            </el-row>
        </li>
        <li>
            <el-row>
                <el-col :span="6"><span>分行<i>*</i></span></el-col>
                <el-col :span="18">
                    <input type="text" readonly @click="promotion.showPick=true" v-model="promotion.pickBank" class="bank">
                    <ylPicker :showPick="promotion.showPick" :columns="promotion.bankColumns" :text="promotion.pickBank" @cancel="cancel" @confirm="confirmBank"></ylPicker>
                </el-col>
            </el-row>
        </li>
        <li>
            <el-row>
                <el-col :span="6"><span>机构号<i>*</i></span></el-col>
                <el-col :span="18"><input type="tel" placeholder="请输入机构号" maxlength="4" pattern="[0-9]*" v-model="promotion.saleCode" @blur="checkSaleCode" @input="hideErr('saleCode')" @focus='toSetHeight'></el-col>
                <el-col :span="18" class="err"><p>{{promotion.saleCodeErr}}</p></el-col>
            </el-row>
        </li>
        <li>
            <el-row>
                <el-col :span="6"><span>手机号<i>*</i></span></el-col>
                <el-col :span="18"><input type="tel" placeholder="请输入手机号" maxlength="11" pattern="[0-9]*" v-model="promotion.tel" @blur="checkTel" @input="hideErr('tel')" @focus='toSetHeight'></el-col>
                <el-col :span="18" class="err"><p>{{promotion.telErr}}</p></el-col>
            </el-row>
        </li>
        <li>
            <el-row>
                <el-col :span="6"><span>短信验证码</span></el-col>
                <el-col :span="12">
                    <input type="tel" class="smscode" maxlength="6" placeholder="请输入您收到的验证码" pattern="[0-9]*" v-model="promotion.smsCode" @blur="checkSmscode" @input="hideErr('smsCode')" @focus='toSetHeight'/>
                </el-col>
                <el-col :span="6"><div id="smscode" :class="promotion.smsCodeBl?'active':''" @click="getSmsCode">{{promotion.smsBtn}}</div></el-col>
                <el-col :span="18" class="err"><p>{{promotion.smsCodeErr}}</p></el-col>
            </el-row>
        </li>
    </ul>
  <!--测试时短信验证码-->
    <p>&nbsp;&nbsp;{{promotion.msg}}</p>
    <ylBtn @confirmbtn="confirm" margin="0.4rem auto" :btnBgcolor="promotion.confirmBl?'#0076ff':'#CCD0DB'" bgcolor="" text="生成我的推荐链接"></ylBtn>
    <YVersion top="0" :version="version"></YVersion>
  <YErrorAlert :msg="alert.msg" :err="alert.err" :show="alert.show" @confirm="closeAlert"></YErrorAlert>
  <ylImageCode v-if="imgCode.show" :bigImgSrc="imgCode.bigImgSrc" :tarImgSrc="imgCode.tarImgSrc" @checkImgCode="checkImgCode" @freshImgCode="getImgCode"></ylImageCode>
</div>

</template>
<script>
import {mapGetters, mapState} from 'vuex';
import {initsa,track,checkName,saAlert,setHeight,getSearch,channel,hxdappIsSpecial} from "@/assets/js/common.js";
import YVersion from "@/components/YVersion";
import YPayMethod from "@/components/YPayMethod";
import ylPicker from "@/components/ylPicker";
import ylBtn from "@/components/ylBtn";
import YErrorAlert from "../../components/YErrorAlert";
import ylImageCode from "../../components/ylImageCode";
import api from '@/api/cashInstalment.js';
import wx from "weixin-js-sdk";
export default {
    name:"promotionStatistics",
    data(){
        return{
            style:{},
            type:"",
            banner:""
        }
    },
    components:{
        ylImageCode,
        YErrorAlert,
        YVersion,
        YPayMethod,
        ylPicker,
        ylBtn
    },
    computed: {
      ...mapState({
        innerHeight:state=>state.innerHeight,
        promotion: state => state.ci.promotion,
        alert: state => state.ci.alert.home,
        version: state => state.ci.version,
        params:state => state.ci.baseData,
        imgCode:state =>state.ci.imgCode,
      }),
    },
    created(){
        let height=document.documentElement.clientWidth/751*336*0.01+"rem";
        this.style={
            "height":height
        };
        this.type=getSearch("type")==""?"XJTJ":getSearch("type");
        if(this.type=="XJTJ"){
            initsa("现金分期推广首页");
            document.title="现金分期分享";
            this.banner=require("@/assets/images/cashInstalment/bannerXJTJ.png");
        }else if(this.type=="SXTG"){
            initsa("随兴分推广首页");
            document.title="随兴分推广";
            this.banner=require("@/assets/images/cashInstalment/bannerSXTG.png");
        }else{
            initsa("");
        }
        
    },
    mounted(){
        this.promotion.pickBank=this.promotion.bankColumns[0].text;
    },
    methods:{
        toSetHeight(el,event){
            let e = event ||window.event;
            setHeight(this.innerHeight,"focus",el.clientY);
        },
        checkNameF(el){
            if(el){
                setHeight(this.innerHeight,"blur",el.clientY);
            }
            this.promotion.name=this.promotion.name.replace(/\s/g,"");
            this.promotion.nameErr=checkName(this.promotion.name);
            if(this.promotion.nameErr==""){
                this.isComfirm();
                return true
            }else{
                return false
            }
        },
        checkSaleCode(el){
            if(el){
                setHeight(this.innerHeight,"blur",el.clientY);
            }
            this.promotion.saleCode=this.promotion.saleCode.replace(/\s/g,"");
            if(this.promotion.saleCode==""){
                this.promotion.saleCodeErr="机构号不能为空";
                return false;
            }else if(!/\d{4}/.test(this.promotion.saleCode)){
                this.promotion.saleCodeErr="机构号填写有误";
                return false
            }else{
                this.isComfirm();
                return true
            }
        },
        checkTel(el){
            if(el){
                setHeight(this.innerHeight,"blur",el.clientY);
            }
            this.promotion.tel = this.promotion.tel.replace(/\s/g,"");
            if(this.promotion.tel==""){
                this.promotion.telErr="手机号不能为空";
                return false
            }else if(!/^1\d{10}$/.test(this.promotion.tel)){
                this.promotion.telErr="手机号输入有误";
                return false
            }else{
                this.isComfirm();
                return true
            }
        },
        checkSmscode(el){
            if(el){
                setHeight(this.innerHeight,"blur",el.clientY);
            }
            this.promotion.smsCode = this.promotion.smsCode.replace(/\s/g,"");
            if(this.promotion.smsCode==""){
                this.promotion.smsCodeErr="验证码不能为空";
                return false
            }else if(!/\d{6}/.test(this.promotion.smsCode)){
                this.promotion.smsCodeErr="验证码输入有误";
                return false
            }else{
                this.isComfirm();
                return true
            }
        },
        countdown(n){
            this.promotion.smsCodeBl=false;
            this.promotion.smsBtn = n + "秒";
            clearInterval(this.promotion.timer);
            this.promotion.timer=setInterval(()=>{
                n--;
                if(n>0&&n<10){
                    n="0"+n;
                }
                this.promotion.smsBtn=n+"秒";
                if(n==-1){
                    clearInterval(this.promotion.timer);
                    this.promotion.smsBtn="重新获取"; 
                    this.promotion.smsCodeBl=true;
                }
            },1000);
        },
        getSmsCode(){
            if(this.promotion.smsCodeBl){
                if(!this.checkTel()){return}
                this.checkImgCode();
            }
        },
        //验证短信
        checkImgCode(value){
            track(this.type+"_getsms","获取验证码");
            this.promotion.smsCodeBl=false;
            let obj = {
                mobile: this.promotion.tel,
                sliderId:this.params.traceId,
                type:this.type
            };
            if (value) {
                obj.sliderCode = value;
            }
            this.$store.commit("ci/SETBASEDATA", obj);
            if(channel()=="hxdapp" && hxdappIsSpecial()){
                this.params.channel="hxdapp"
            }
            api.getMsgCode(this.params).then((res) => {
                // console.log("getMsgCode res", res);
                let imgobj = {
                    show: false,
                    moveX: "",
                    bigImgSrc: "",
                    tarImgSrc: ""
                };
                this.$store.dispatch("ci/setImgcode", imgobj);;
                if (res.success) {
                    if(res.data.needSlider){
                        // console.log("显示滑块验证码 needSlider = true");
                        this.getImgCode();
                    }else{
                        let n=120;
                        this.countdown(n);
                        // console.log("第一次获取短信没有滑块验证码");
                        if(res.data.smsCodeAlert!=undefined&&res.data.smsCodeAlert!=null&&res.data.smsCodeAlert!=''){
                            this.promotion.msg = res.data.smsCodeAlert;            // 显示短信验证码
                            // console.log("测试环境验证码",this.promotion.msg);
                        }else{
                            this.promotion.msg = '';
                        }
                    }
                }else{
                    if(res.code == "sliderTooFrequently"){
                        let obj = {
                            show: true,
                            msg:res.msg,
                            err:res.code
                        };
                        this.$store.commit("ci/SETHOMEALERT", obj);
                        let n=60;
                        this.countdown(n);
                    }else{
                        this.promotion.smsCodeBl=true;
                        let obj = {
                            show: true,
                            msg:res.msg,
                            err:res.code
                        };
                        this.$store.commit("ci/SETHOMEALERT", obj);
                    }
                    saAlert(this.type+"推广首页","获取短信",res.msg,"报错提示")
                }
            }).catch((err) => {
                this.promotion.smsCodeBl=true;
                console.log("getMsgCode err", err);
                saAlert(this.type+"推广首页","获取短信",err,"请求报错")
            })

        },
        getImgCode(){
            track(this.type+"_getSlider","获取滑块");
            let obj = {
                sliderId:this.params.traceId,
            };
            this.$store.commit("ci/SETBASEDATA",obj);
            if(channel()=="hxdapp" && hxdappIsSpecial()){
                this.params.channel="hxdapp"
            }
            api.promoteImgcode(this.params).then((res)=>{
                // console.log("promoteImgcode res:",res);
                if(res.success){
                    let obj = {
                        show:true,
                        moveX:"",
                        bigImgSrc:res.data.bigimgStr,
                        tarImgSrc:res.data.tarimgStr
                    };
                    this.$store.dispatch("ci/setImgcode",obj);
                }else {
                    let imgobj = {
                        show: false,
                        moveX: "",
                        bigImgSrc: "",
                        tarImgSrc: ""
                    };
                    this.$store.dispatch("ci/setImgcode", imgobj);
                    let obj = {
                        show: true,
                        msg:res.msg,
                        err:res.code
                    };
                    this.$store.commit("ci/SETHOMEALERT", obj);
                    saAlert(this.type+"推广首页","获取图形验证码",res.msg,"报错提示")
                }
            }).catch((err)=>{
                console.log("promoteImgcode err",err);
                saAlert(this.type+"推广首页","获取图形验证码",err,"请求报错")
            })
        },
        closeAlert(){
            let obj = {
                show: false,
                msg:'',
                err:''
            };
            this.$store.commit("ci/SETHOMEALERT", obj);
        },
        hideErr(str){
            this.promotion.confirmBl=false;
            switch(str){
                case "name":this.promotion.nameErr="";
                    break;
                case "saleCode":this.promotion.saleCodeErr="";
                    break;
                case "tel":this.promotion.telErr="";
                    break;
                case "smsCode":this.promotion.smsCodeErr="";
                    this.isComfirm();
                    break;
                default:break
            }
        },
        isComfirm(){  //判断是否都填
            if(this.promotion.name!=""&&this.promotion.saleCode!=""&&this.promotion.tel!=""&&this.promotion.smsCode.length==6&&(this.promotion.nameErr==""&&this.promotion.saleCodeErr==""&&this.promotion.telErr==""&&this.promotion.smsCodeErr=="")){
                this.promotion.confirmBl=true;
                return true
            }else{
                this.promotion.confirmBl=false;
                return false
            }
        },
        confirm(){
            if(this.promotion.confirmBl){
                track(this.type+"_confirm","提交");
                this.promotion.confirmBl=false
                let url = location.href.split("#")[0];
                let obj = {
                    type:this.type,               //SXTG--随兴分   XJFQTG-现金分期
                    name:this.promotion.name,  //姓名
                    branch:this.promotion.pickBank,  //分行
                    organization:this.promotion.saleCode, //机构号
                    url:url,                          //地址
                    phone:this.promotion.tel,         //手机号
                    code:this.promotion.smsCode,      //短信
                    sliderId:this.params.traceId      //滑块标识
                }
                this.$store.commit("ci/SETBASEDATA",obj);
                this.$store.dispatch("ci/shareConfig",{data:this.params,router:this.$router,type:this.type});
            }
        },
        cancel(){
            this.promotion.showPick=false;
        },
        confirmBank(obj){  //选择分行名称
            this.promotion.showPick=false;
            this.$store.commit("ci/SETPRCKDATA",obj.text);
        }
    }
}
</script>
<style scoped>
    img{
        display:inline-block;
        width:100%;
    }
    ul li{
        font-size: 0.15rem;
        box-sizing: border-box;
        padding:0.16rem 0.1rem 0.16rem 0.2rem;
        border-bottom:0.005rem solid #DDD;
    }
    span,#smscode{
        color:#000;
        height:0.24rem;
        line-height:0.24rem;
        letter-spacing: -0.36px;
    }
    span i{
        color:#f00;
    }
    input{
        font-size: 0.15rem;
        color:#000;
        height:0.24rem;
        line-height:0.24rem;
        width:100%;
        border:none;
        letter-spacing: -0.36px;
    }
    .err{
        position:absolute;
        right:0;
        bottom:-0.12rem;
        color:#f00;
        font-size: 0.1rem;
    }
    .btn{
        text-align: center;
    }
    .btn a{
        display: inline-block;
        width:30%;
        color:#f97746;
        font-size: 0.14rem;
        border:0.01rem solid #f97746;
        border-radius:0.16rem;
        padding:0.05rem;
        box-sizing: border-box;
    }
    p.des{
        font-size: 0.13rem;
        margin:0.15rem 0 0.15rem 0.1rem;
    }
    .smscode{
        border-right:0.01rem solid #C1C7D3;
        border-radius:0;
    }
    #smscode{
        text-align: center;
        color:#CCD0DB;
    }
    #smscode.active{
        color:#0085d2;
    }
    .bank{
        background:url("../../assets/images/arrow.png") no-repeat right center;
        background-size:0.12rem 0.18rem;
    }
</style>
