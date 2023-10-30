<template>
    <div class="main bg-fixed">
        <div class="container">
             <div id="credit">
                <div class="title">
                    <img src="@/assets/images/autostage/logo.png" alt="" id="logo">
                    <span class="creditcardNum">{{revisedata.creditcardNum.cardNo}}</span>
                </div>
            </div>
            <div class="blank"></div>
            <div class="select-one">
                <BinputSelect selectTitle="起分金额" listTitle="起分金额" :selectText="revisedata.charge.money" :selectList="reviseui.sumList" 
                discount="" discountText="" @getselect="getselect" :choseShow="revisedata.sumchosedIndex"></BinputSelect>
            </div>
            <div class="blank2"></div>
            <div class="select-one">
                <BpayType payTitle="手续费支付方式" listTitle="手续费支付方式" :payText="revisedata.paytype.pType" :payList="reviseui.payList" 
                discount="" discountText="" @getpay="getpay" :choseShow="revisedata.paychosedIndex"></BpayType>
            </div>
            <div class="blank2"></div>
            <Brate periodSelect="分期期数" rateSelect="手续费率" periodTitle="期数" rateTitle="手续费率"
            :perTxt="revisedata.periodRate.period" :rateTxt="revisedata.periodRate.rate" :differ="revisedata.differ" :prateList="reviseui.prateList"
            derateDiscount="" perDiscount="" discountPeriod="" percentDiscount="" :choseShow="revisedata.periodrateIndex" 
            @getprate="getprate" @periodClick="periodClick"></Brate>
            <div class="footer">
                <div class="rule clear">  
                    <div class="quan" @click="changecheck_not" v-show="reviseui.imgshow_one">
                        <img src="@/assets/images/autostage/unchecked.png" alt="" class="check">
                    </div>
                    <div class="quan" @click="changecheck_is" v-show="reviseui.imgshow_two">
                        <img src="@/assets/images/autostage/checked.png" alt="" class="check">
                    </div>
                    <div class="rule-txt">我已阅读并同意<a href="https://mobile.cib.com.cn/creditcard/stage/other/zdfq_xz.html">《自动分期付款业务条款及细则》</a></div>
                </div>
            </div>
            <YFunctionBtn text="确认修改" :dis="reviseui.disshow" @checktable="checkInfo" style="margin-top:0.16rem;"></YFunctionBtn>
            <div class="kind-remind" @click="kindRemind">什么是自动分期</div>
            <div class="remind" v-show="revisemenu.remindstatu">
                <p>什么是自动分期</p>
                <div class="remind-txt">
                    <div>自动分期功能开通后，自开通之时起至最近一个账单日，<b>您账户已记账且未出账单的“消费累计金额”如达到您选择的起始金额时，系统将自动根据您设定的期数提供分期付款服务。</b></div>
                    <div>后续每个账单周期内的“消费累计金额”如达到起始金额时，系统均将自动根据您设定的期数提供分期付款服务。</div>
                </div>
                <span class="remind-confirm" @click="rconfirm">知道了</span>
            </div>
            <div class="layer" v-show="revisemenu.laystatu"></div>
            <BapplyFail :show="fail.showAlert" :title="fail.title" :msg="fail.msg" :err="fail.err" @apllayFailBtn="fconfirm"></BapplyFail>
            <YErrorAlert :msg="alert.msg" :err="alert.err" :show="alert.showAlert" @confirm="confirm_revise"></YErrorAlert>
            <YVersion :version="version" top="21%"></YVersion>
        </div>
    </div>
</template>
<script>
    // 引入所需的方法、组件
    import {mapActions,mapState} from "vuex";
    import {initsa,track} from "@/assets/js/common.js";
    import BinputSelect from "../../components/BinputSelect";
    import BpayType from "../../components/BpayType";
    import Brate from "../../components/Brate";
    import YFunctionBtn from "../../components/YFunctionBtn";
    import BapplyFail from "../../components/BapplyFail";
    import YErrorAlert from "../../components/YErrorAlert";
    import YVersion from "../../components/YVersion"; 
    export default {
        name: 'RevisePage',
        data(){
            return {
                reviseInfo:"",
            }
        },
        computed:mapState({
            revisedata:state => state.autostage.revise.revisedata,
            reviseui:state => state.autostage.revise.reviseui,
            revisemenu:state => state.autostage.revise.revisemenu,
            alert:state => state.autostage.revise.alert,
            fail:state => state.autostage.revise.fail,
            version:state => state.autostage.version
        }),
        created(){
            this.initRevise();   // 初始化首页                 
        },
        methods:{
            // 初始化首页
            initRevise(){
                initsa("自动分期修改页");
                this.reviseInfo = JSON.parse(this.$route.query.Rdata);
                this.$store.dispatch("autostage/bsetinitrevise",{
                    reviseInfo:this.reviseInfo
                })
            },
            // 切换起分金额
            getselect(data){
                this.$store.dispatch("autostage/bchangerevisecharge",{ 
                    charge:data,     
                    revisedata:this.revisedata
                }); 
            },
            // 切换支付方式
            getpay(data){
                this.$store.dispatch("autostage/bchangerevisepaytype",{
                    paytype:data,
                    revisedata:this.revisedata
                }); 
            },
            // 选择分期费率
            getprate(data){
                this.$store.dispatch("autostage/bchangereviseperiodrate",{
                    periodrate:data
                });
            },
            // 点击费率获取列表
            periodClick(){
                this.$store.dispatch("autostage/binitreviserate",{       // 费率列表赋值
                    revisedata:this.revisedata
                }); 
            },
            // 切换选中状态
            changecheck_not(){
                this.$store.commit('autostage/BCHANGEREVISESTATUS',{unchecked:false,checked:true});
                if(this.reviseui.imgshow_two==true){
                    this.$store.commit("autostage/BCHANGEREVISEBTN",{status:true});
                }else{
                    this.$store.commit("autostage/BCHANGEREVISEBTN",{status:false});
                }
            },
            // 切换选中状态
            changecheck_is(){
                this.$store.commit('autostage/BCHANGEREVISESTATUS',{unchecked:true,checked:false});
                if(this.reviseui.imgshow_two==true){
                    this.$store.commit("autostage/BCHANGEREVISEBTN",{status:true});
                }else{
                    this.$store.commit("autostage/BCHANGEREVISEBTN",{status:false});
                }
            },
            // 点击温馨提示
            kindRemind(){               
                this.$store.commit("autostage/BCHANGEREVISEREMIND",{layer:true,remind:true});
            },
            // 关闭温馨提示
            rconfirm(){                 
                this.$store.commit("autostage/BCHANGEREVISEREMIND",{layer:false,remind:false});
            },
            // 首页错误弹框
            confirm_revise(){
                this.$store.commit("autostage/BREVISEALERT",{show: false, msg: '', err: ''});
            },
            // 申请失败弹框
            fconfirm(){
                this.$store.commit('autostage/BREVISEFAILALERT', {show: false, title:"",msg: '', err: ''});
            },
            // 确认修改
            checkInfo(){
                if(this.reviseui.imgshow_two==true){
                    track("Autostage_modify","自动分期修改页修改按钮");
                    this.$store.dispatch("autostage/breviseinfo",{       
                        revisedata:this.revisedata,
                        reviseui:this.reviseui,
                        router:this.$router
                    });
                }
            },
        },
        components:{
            BinputSelect,
            BpayType,
            Brate,
            YFunctionBtn,
            BapplyFail,
            YErrorAlert,
            YVersion
        }
    }
</script>
<style scoped>
.main{background:#F3F5F9;width: 100%;}
.bg-fixed{position: fixed;overflow: hidden;top:0;left:0;bottom:0;right:0;}
.container{background:#FFF;width: 100%;height: 100%;}
/* 信用卡 */
#credit .title{height: 0.44rem;line-height: 0.44rem;padding:0 5.3%;box-sizing: border-box;}
#credit .title #logo{width:0.28rem;margin-right: 0.13rem;left: 0;}
#credit .title .creditcardNum{font-size: 0.16rem;display: inline-block;}
.blank{background:#F3F5F9;height: 0.1rem;}
.blank2{height: 0.01rem;background: #EEE;position: relative;left: 5.3%;}
.select-one{padding:0.16rem 0;}
.layer{width: 100%;height: 100%;z-index: 100;position: fixed;top: 0;left: 0;display: block;background: #000;opacity: 0.4;}
/* 底部 */
.footer{padding: 0 5.3%;box-sizing: border-box;margin-top:0.32rem;}
.rule .quan{float: left;margin-right: 0.08rem;}
.rule .quan .check{width: 0.16rem;}
.rule .rule-txt{float: left;font-size: 0.12rem;color:#666;line-height: 0.18rem;height: 0.18rem;}
.rule-txt a {color:#0060F1;}
/* 温馨提示 */
.kind-remind{margin-top: 0.2rem;text-align: center;font-size: 0.13rem;color: #5084FF;line-height: 0.18rem;height: 0.18rem;}
.remind{position:absolute;width:72.3%;background:#FFF;top: 0.79rem;z-index:666;border-radius: 0.1rem;left: 0;
right: 0;margin:0 auto;}
.remind p{margin:0.19rem 0 0.13rem;font-size: 0.18rem;line-height: 0.22rem;text-align: center;}
.remind-txt{font-size: 0.14rem;line-height: 0.2rem;height: 1.58rem;padding:0 0.16rem 0 0.2rem;box-sizing: 
border-box;margin-bottom: 0.2rem;color:#666;overflow: scroll;}
.remind-txt div{text-indent: 2em;}
.remind-txt a{font-size: 0.09rem;}
.remind-txt b {font-weight: 700;}
.remind-confirm{font-size: 0.16rem;color: #0060F1;letter-spacing: -0.0038rem;text-align: center;display: block;
line-height: 3;border-top: 0.5px solid #EAEAEA;}
</style>