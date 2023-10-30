<template>
    <div class="main bg-fixed">
        <div class="container">
            <BcreditSelect :cardNo="homedata.creditcardNum.cardNo" :creditList="pubui.creditList" 
            @getcreditcard="getcreditcard" :choseShow="homedata.creditIndex" ctitle="选择信用卡"></BcreditSelect>
            <div class="blank"></div>
            <div id="banner">
                <img src="@/assets/images/lendcash/banner.png" alt="" class="bgImg">
                <div class="banner-next">
                    <div class="banner-title">申请金额</div>
                    <div class="banner-top">{{failremind}}</div>
                    <div class="banner-middle">
                        <span class="sign-one">￥</span>
                        <input type="text" pattern="[0-9]." maxlength="9" id="applyNum" placeholder="请输入申请金额" v-model="homedata.applyMoney" @input="passMax" @focus="setNum" ref="applyNum" @blur="checkNum"> 
                        <img src="@/assets/images/lendcash/del.png" alt="" @click="Delete" v-if="delShow" >
                        <img src="@/assets/images/lendcash/modify.png" alt="" @click="Modify" v-if="modShow">
                    </div>
                    <div class="banner-line"></div>
                    <div class="banner-bottom">
                        <span class="banner-txt">最高可借 ￥{{homedata.maxMoney}}</span>
                    </div>
                </div>
            </div>
            <BYdebitSelect :nocard="homeui.nocard" :hascard="homeui.hascard" skip="/LendCash/AddPage" :debitList="pubui.debitList" :bankName="homedata.bankName" :bankNum="homedata.bankNum" @btnConfirm="btnConfirm"
             @getdebitcard="getdebitcard" @deleteCard="deleteCard" :choseShow="homedata.debitIndex"></BYdebitSelect>
        </div>
        <div class="footer">
            <div class="rule clear">
                <div class="quan" @click="changecheck_not" v-show="homeui.imgshow_one">
                    <img src="@/assets/images/lendcash/unchecked.png" alt="" class="check"  >
                </div>
                <div class="quan" @click="changecheck_is" v-show="homeui.imgshow_two">
                    <img src="@/assets/images/lendcash/checked.png" alt="" class="check" >
                </div>
                <div class="rule-txt">我承诺不会将预借现金获得的资金用于投资和生产经营（包括但不限于购房、股票、期货及其他股本权益性投资），仅用于消费。</div>
            </div>
            <YFunctionBtn text="提交" :dis="homeui.disshow" @checktable="checkInfo" style="margin-left:0;"></YFunctionBtn>
            <div class="kind-remind" @click="kindRemind">温馨提示</div>
        </div>
        <div class="layer" v-show="pubmenu.laystatu"></div>
        <div class="pass-money" v-show="pubmenu.applyshow">
            <p>{{applyremind}}</p>
            <div class="pass-blank"></div>
            <span id="pass-confirm" @click="applyConfirm">确定</span>
        </div>
        <div class="remind" v-show="pubmenu.reminderstatu">
            <p>温馨提示</p>
            <div class="remind-txt">
                1.预借现金只能转入您同名的银行卡。<br/><br/>
                2.透支转账手续费为交易金额的2%，最低20元人民币。利息为每天万分之五。<br/><br/>
                3.溢缴款转账手续费为交易金额的千分之五，最低为5元人民币，最高50元人民币。<br/><br/>
                4.手续费优惠卡种的收费规则请查询我行信用卡网站<a href="http://creditcard.cib.com.cn">(http://creditcard.cib.com.cn)</a>相关内容。
            </div>
            <div class="remind-blank"></div>
            <span class="remind-confirm" @click="rconfirm">我知道了</span>
        </div>
        <BapplyFail :show="fail.showAlert" :title="fail.title" :msg="fail.msg" :err="fail.err" @apllayFailBtn="fconfirm"></BapplyFail>
        <YVersion :version="version" top="1%"></YVersion>
        <YErrorAlert :msg="alert.msg" :err="alert.err" :show="alert.showAlert" @confirm="confirm_home"></YErrorAlert>
        <BpassWord @getValue="getpwdValue" @goBack="goBack" :pwdShow="pshow"></BpassWord>
    </div>
</template>
<script>
import BcreditSelect from "../../components/BcreditSelect";
import BYdebitSelect from "../../components/BYdebitSelect";
import BapplyFail from "../../components/BapplyFail";
import YFunctionBtn from "../../components/YFunctionBtn";
import YErrorAlert from "../../components/YErrorAlert";
import YVersion from "../../components/YVersion";
import BpassWord from "../../components/BpassWord";
import {mapActions,mapState} from "vuex";
import {track,encryptByDES} from "@/assets/js/common.js";
export default {
    name: 'HomePage', 
    data(){
        return { 
            failremind:"",
            applyremind:"",
            delShow:"",
            modShow:true,
            cardIndex:"",
            cardNum:"",
            pshow:false,
            pwdvalue:"",
        }
    },
    components:{
        BcreditSelect,
        BYdebitSelect,
        BapplyFail,
        BpassWord,
        YFunctionBtn,
        YVersion,
        YErrorAlert
    },
    computed:mapState({
        homedata:state => state.lc.home.homedata,
        homeui:state => state.lc.home.homeui,
        pubmenu:state => state.lc.public.pubmenu,
        pubui:state => state.lc.public.pubui,
        version: state => state.lc.version,
        alert:state => state.lc.home.alert,
        fail:state => state.lc.home.fail,
        adata:state => state.lc.add.adata,
    }),
    created(){
        this.initHome(); //初始化首页
    },
    methods:{
        // 初始化首页
        initHome(){
            this.$store.dispatch("lc/bsetinithome",{
                homedata:this.homedata,
            });
            this.$store.dispatch('lc/saInit', '预借现金首页');
        },
        // 清空申请金额
        Delete(){
            this.homedata.applyMoney = "";
            this.$refs.applyNum.focus();
        },
        // 修改申请金额
        Modify(){
            this.modShow = false;
            this.delShow = true;
            this.homedata.applyMoney = "";
            this.$refs.applyNum.focus();
        },
        // 输入框focus事件
        setNum(){
            this.delShow = true;
            this.modShow = false;
        },
        // 关闭输入金额提示
        applyConfirm(){
            this.pubmenu.laystatu = false;
            this.pubmenu.applyshow = false;
        },
        // 输入金额blur事件
        checkNum(){
            setTimeout(()=>{
                var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                window.scrollTo(0,Math.max(scrollHeight - 1,0));
            },100); 
            this.modShow = true;
            this.delShow = false;
            if(Number(this.homedata.maxMoney)>50000){
                if(Number(this.homedata.applyMoney) >= 0.01 && Number(this.homedata.applyMoney) <= 50000 && this.homeui.hascard == true && this.homeui.imgshow_two == true){
                    this.$store.commit("lc/BCHANGEHOMEBTN",{status:true});
                }else{
                    this.$store.commit("lc/BCHANGEHOMEBTN",{status:false});
                }
            }else if(Number(this.homedata.maxMoney)<=50000){
                if(Number(this.homedata.applyMoney) >= 0.01 && Number(this.homedata.applyMoney) <= Number(this.homedata.maxMoney) && this.homeui.hascard == true && this.homeui.imgshow_two == true){
                    this.$store.commit("lc/BCHANGEHOMEBTN",{status:true});
                }else{
                    this.$store.commit("lc/BCHANGEHOMEBTN",{status:false});
                }
            }  
        },
        // 输入金额符合
        passMax(){
            this.homedata.applyMoney = this.homedata.applyMoney.replace(/[^\d.]/g,""); // 限制只能输入数字和小数点
            this.homedata.applyMoney = this.homedata.applyMoney.replace(".","$#$").replace(/\./g,"").replace("$#$","."); // 清楚多余小数点
            this.homedata.applyMoney = this.homedata.applyMoney.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
            this.homedata.applyMoney.substring(0, 1) === '.' && (this.homedata.applyMoney  = '0' + this.homedata.applyMoney );
            if(Number(this.homedata.maxMoney)>50000){
                if(this.homedata.applyMoney==""){
                    this.failremind = "申请金额不能为空";
                }else if(Number(this.homedata.applyMoney) < 0.01){
                    this.failremind = "申请金额不得低于0.01元";
                }else if(Number(this.homedata.applyMoney)>50000 && Number(this.homedata.applyMoney)<=Number(this.homedata.maxMoney)){
                    this.applyremind = "您输入的金额超过预借现金每日限额";
                    this.pubmenu.laystatu = true;
                    this.pubmenu.applyshow = true;
                    this.homedata.applyMoney = 50000;
                    this.$refs.applyNum.blur();
                    this.failremind = "";
                }else if(Number(this.homedata.applyMoney)>Number(this.homedata.maxMoney)){
                    this.applyremind = "您输入的金额大于预借现金最高可借金额，已为您更改至最高可借金额";
                    this.pubmenu.laystatu = true;
                    this.pubmenu.applyshow = true;
                    this.homedata.applyMoney = 50000;
                    this.$refs.applyNum.blur();
                    this.failremind = "";
                }else if(Number(this.homedata.applyMoney)>=0.01 && Number(this.homedata.applyMoney)<=50000){
                    this.failremind = "";
                }
            }else if(Number(this.homedata.maxMoney)<=50000){
                if(this.homedata.applyMoney==""){
                    this.failremind = "申请金额不能为空";
                }else if(Number(this.homedata.applyMoney) < 0.01){
                    this.failremind = "申请金额不得低于0.01元";
                }else if(Number(this.homedata.applyMoney)>Number(this.homedata.maxMoney)){
                    this.applyremind = "您输入的金额大于预借现金最高可借金额，已为您更改至最高可借金额";
                    this.pubmenu.laystatu = true;
                    this.pubmenu.applyshow = true;
                    this.homedata.applyMoney = this.homedata.maxMoney;
                    this.$refs.applyNum.blur();
                    this.failremind = "";
                }else if(Number(this.homedata.applyMoney)>=0.01 && Number(this.homedata.applyMoney)<=Number(this.homedata.maxMoney)){
                    this.failremind = "";
                }
            }
        },
        // 确定删除借记卡
        btnConfirm(){               
            this.$store.dispatch("lc/bconfirmdelete",{
                cardIndex:this.cardIndex,
                cardNum:this.cardNum,
            });
        }, 
        // 切换信用卡
        getcreditcard(data){       
            this.$store.dispatch("lc/bchangemaxmoney",{
                creditcardNum:data
            });
        },
        // 切换借记卡
        getdebitcard(data){         
            var addData = data;
            this.$store.dispatch('lc/binitaddpage',{
                addData:addData
            });
        },
        // 删除借记卡
        deleteCard(data){          
            this.cardIndex = data.cardIndex;  // 返回被选中的借记卡索引
            this.cardNum = data.cardNum;      // 返回被选中的借记卡卡号
        },
        // 改变按钮
        changecheck_not(){          
            this.$store.commit('lc/BCHANGECHECKSTATUS',{unchecked:false,checked:true});
            if(Number(this.homedata.maxMoney)>50000){
                if(Number(this.homedata.applyMoney) >= 0.01 && Number(this.homedata.applyMoney) <= 50000 && this.homeui.hascard == true && this.homeui.imgshow_two == true){
                    this.$store.commit("lc/BCHANGEHOMEBTN",{status:true});
                }else{
                    this.$store.commit("lc/BCHANGEHOMEBTN",{status:false});
                }
            }else if(Number(this.homedata.maxMoney)<=50000){
                if(Number(this.homedata.applyMoney) >= 0.01 && Number(this.homedata.applyMoney) <= this.homedata.maxMoney && this.homeui.hascard == true && this.homeui.imgshow_two == true){
                    this.$store.commit("lc/BCHANGEHOMEBTN",{status:true});
                }else{
                    this.$store.commit("lc/BCHANGEHOMEBTN",{status:false});
                }
            } 
        },
        // 改变按钮
        changecheck_is(){           
            this.$store.commit('lc/BCHANGECHECKSTATUS',{unchecked:true,checked:false});
            if(Number(this.homedata.maxMoney)>50000){
                if(Number(this.homedata.applyMoney) >= 0.01 && Number(this.homedata.applyMoney) <= 50000 && this.homeui.hascard == true && this.homeui.imgshow_two == true){
                    this.$store.commit("lc/BCHANGEHOMEBTN",{status:true});
                }else{
                    this.$store.commit("lc/BCHANGEHOMEBTN",{status:false});
                }
            }else if(Number(this.homedata.maxMoney)<=50000){
                if(Number(this.homedata.applyMoney) >= 0.01 && Number(this.homedata.applyMoney) <= this.homedata.maxMoney && this.homeui.hascard == true && this.homeui.imgshow_two == true){
                    this.$store.commit("lc/BCHANGEHOMEBTN",{status:true});
                }else{
                    this.$store.commit("lc/BCHANGEHOMEBTN",{status:false});
                }
            } 
        },
        // 点击温馨提示
        kindRemind(){               
            this.$store.commit("lc/BCHANGEREMIND",{layer:true,remind:true});
        },
        // 关闭温馨提示
        rconfirm(){                 
            this.$store.commit("lc/BCHANGEREMIND",{layer:false,remind:false});
        },
        // 关闭金额上限
        passConfirm(){              
            this.$store.commit("lc/BCHANGEPASS",{layer:false,apply:false});
        },
        // 关闭首页错误弹框
        confirm_home(){             
            this.$store.commit("lc/BHOMEALERT",{show: false, msg: '', err: ''});
        },
        // 点击提交
        checkInfo(){               
            if(Number(this.homedata.maxMoney)>50000){
                if(Number(this.homedata.applyMoney) >= 0.01 && Number(this.homedata.applyMoney) <= 50000 && this.homeui.hascard == true && this.homeui.imgshow_two == true){
                    track("LendCash_homesubmit","预借现金首页提交按钮");
                    this.pshow = true;
                }else{
                    this.pshow = false;
                }
            }else if(Number(this.homedata.maxMoney)<=50000){
                if(Number(this.homedata.applyMoney) >= 0.01 && Number(this.homedata.applyMoney) <= this.homedata.maxMoney && this.homeui.hascard == true && this.homeui.imgshow_two == true){
                    track("LendCash_homesubmit","预借现金首页提交按钮");
                    this.pshow = true;
                }else{
                    this.pshow = false;
                }
            } 
        },
        // 交易密码返回
        goBack(){
            this.pshow = false;
            this.$router.push({path:"/LendCash/HomePage"});
        },
        // 获取交易密码
        getpwdValue(value){         
            value = encryptByDES(value,this.homedata.creditcardNum.cardKey);
            this.pwdvalue = value;
            var isLocal = "";
            if(this.homedata.bankName=="兴业银行"){
                isLocal = "0";
            }else{
                isLocal = "1";
            }
            this.$store.dispatch('lc/bsubmitdata',{
                pwd:this.pwdvalue,
                cardKey:this.homedata.creditcardNum.cardKey,
                cardNo:this.homedata.creditcardNum.cardNo,
                isLocal:isLocal,
                applyAmt:this.homedata.applyMoney,
                applyLimit:this.homedata.maxMoney,
                channel:this.homedata.channel,
                cardNoC:this.homedata.bankNum,
                nameC:this.adata.hascardName,
                bankC:this.homedata.bankNo,
                bankName:this.homedata.bankName,
                router:this.$router
            });
            this.pshow = false;
        },
        // 关闭失败弹框
        fconfirm(){                    
            this.$store.commit("lc/BAPPLYFAIL",{show:false,title:"",msg:"",err:""});
        },
    }
}
</script>
<style scoped>
.main{background:#F3F5F9;width: 100%;}
.bg-fixed{position: fixed;overflow: hidden;top:0;left:0;bottom:0;right:0;}
.container{width: 100%;background:#FFF;}
.blank{background:#F3F5F9;height: 0.1rem;}
/* 申请金额 */
#banner{height:1.67rem;background-size: 100% 100%;color:#FFF;box-sizing: border-box;}
#banner .bgImg{width:100%;height: 1.67rem;}
.banner-next{position: relative;top:-1.67rem;padding:0 0.4rem;}
.banner-title{font-size: 0.14rem;height: 0.2rem;line-height: 0.2rem;padding-top:0.32rem;}
.banner-top{font-size: 0.13rem;line-height: 0.13rem;height: 0.13rem;color:#FFF222;}
.banner-middle{height: 0.36rem;line-height: 0.36rem;font-size: 0.25rem;position: relative;}
.sign-one{display: inline-block;margin-left: -0.05rem;}
#applyNum{border: none;height: 0.36rem;font-size: 0.25rem;width: 2rem;background: none;color:#FFF;}
#applyNum::-webkit-input-placeholder{font-size: 0.2rem;color: #FFF;opacity: 0.5;height: 0.28rem;line-height:0.28rem;position: relative;bottom:0.01rem;}
#applyNum:-moz-placeholder{font-size: 0.2rem;color: #FFF;opacity: 0.5;height: 0.28rem;line-height:0.28rem;position: relative;bottom:0.01rem;}
#applyNum:-ms-input-placeholder{font-size: 0.2rem;color: #FFF;opacity: 0.5;height: 0.28rem;line-height:0.28rem;position: relative;bottom:0.01rem;}
.banner-middle img{width:0.17rem;height:0.17rem;position: absolute;right: 0;top:0.1rem;}
.banner-line{background:#fff;opacity: 0.5;height: 0.01rem;}
.banner-bottom{margin-top: 0.095rem;height: 0.16rem;line-height: 0.16rem;font-size: 0.11rem;position: relative;}
.banner-txt{margin-right: 0.1rem;}
.layer{width: 100%;height: 100%;z-index: 100;position: fixed;top: 0;left: 0;display: block;background: #000;opacity: 0.4;}
/* 输入超过申请金额 */
.pass-money{position: absolute;top: 2.39rem;width:2.64rem;left:14.8%;background: #FFFFFF;border-radius: 0.1rem;
z-index:999;text-align: center;}
.pass-money p{color:#333;font-size: 0.16rem;line-height: 0.22rem;text-align: center;padding:0.2rem 0 0.17rem;width: 2.05rem;margin-left: 0.3rem;}
.pass-blank{height: 0.01rem;background:#EAEAEA;}
#pass-confirm{height: 0.44rem;font-size:0.16rem;color: #0060F1;letter-spacing: -0.0038rem;line-height: 0.44rem;display: block;}
/* 底部 */
.footer{padding: 0 5.3% 0.12rem;box-sizing: border-box;}
.rule{padding:0.31rem 0;}
.rule .quan{width:0.3rem;height: 0.3rem;float: left;}
.check{width: 0.16rem;position: relative;top:0.02rem;}
.rule .rule-txt{float: right;width:90%;font-size: 0.12rem;color:#666;line-height: 0.18rem;}
.rule-txt a {color:#0060F1;}
/* 温馨提示 */
.kind-remind{padding:0.16rem 0;text-align: center;font-size: 0.12rem;color: #0060F1;}
.remind{position:absolute;width:72.3%;background:#FFF;top: 0.79rem;z-index:666;height: 3.8rem;border-radius: 0.1rem;left: 0;
right: 0;margin:0 auto;}
.remind p{margin:0.19rem 0 0.13rem;font-size: 0.16rem;line-height: 0.22rem;text-align: center;}
.remind-txt{font-size: 0.14rem;line-height: 0.2rem;height: 2.63rem;overflow: scroll;padding:0 0.16rem 0 0.2rem;box-sizing: 
border-box;color:#666;margin-bottom: 0.2rem;}
.remind-txt a{font-size: 0.09rem;}
.remind-blank{height: 0.01rem;background: #EAEAEA;margin-bottom: 0.09rem;}
.remind-confirm{font-size: 0.16rem;color: #0060F1;letter-spacing: -0.0038rem;text-align: center;display: block;}
.layer{width: 100%;height: 100%;z-index: 100;position: fixed;top: 0;left: 0;display: block;background: #000;opacity: 0.4;}
</style>