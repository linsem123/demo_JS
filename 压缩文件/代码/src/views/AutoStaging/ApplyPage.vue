<template>
    <div class="main bg-fixed">
        <div class="container">
            <div id="credit">
                <div class="title" @click="showCredit">
                    <img src="@/assets/images/autostage/logo.png" alt="" id="logo">
                    <span class="creditcardNum">{{applydata.creditcardNum.cardNo}}</span>
                    <img src="@/assets/images/autostage/dropdown.png" alt="" id="down">
                </div>
                <div class="creditcard-select" v-show="applymenu.creditstatu">
                    <div class="select-title clear">
                        <a href="javascript:;" id="cancel" @click="Cancel">取消</a>
                        <span>切换卡片</span>
                    </div>
                    <ul class="select-list">
                        <li v-for="(item,index) in creditList"  :key="index" @click="changeChosed(item,index)">
                        <img src="@/assets/images/autostage/logo.png" alt="" class="logo">
                        <span class="creditcard-txt">{{item.cardNo}}</span>
                        <img src="@/assets/images/autostage/chose.png" alt="" v-show="applydata.creditIndex==index" class="chosed"> 
                        </li>
                    </ul>
                </div>
            </div>
            <div class="blank"></div>
            <div class="select-one">
                <BinputSelect selectTitle="起分金额" listTitle="起分金额" :selectText="applydata.charge.money" :selectList="applyui.sumList" 
                discount="" discountText="" @getselect="getselect" :choseShow="applydata.sumchosedIndex"></BinputSelect>
            </div>
            <div class="blank2"></div>
            <div class="select-one">
                <BpayType payTitle="手续费支付方式" listTitle="手续费支付方式" :payText="applydata.paytype.pType" :payList="applyui.payList" 
                discount="" discountText="" @getpay="getpay" :choseShow="applydata.paychosedIndex"></BpayType>
            </div>
            <div class="blank2"></div>
            <Brate periodSelect="分期期数" rateSelect="手续费率" periodTitle="期数" rateTitle="手续费率"
            :perTxt="applydata.periodRate.period" :rateTxt="applydata.periodRate.rate" :differ="applydata.differ" :prateList="applyui.prateList"
            derateDiscount="" perDiscount="" discountPeriod="" percentDiscount="" :choseShow="applydata.periodrateIndex" 
            @getprate="getprate" @periodClick="periodClick"></Brate>
            <div class="selected-content clear">
                <div class="down">
                    <span>营销人员代码（选填）</span>
                    <div class="change" @click="downClick">
                        <span class="s2">{{selectedTxt}}</span>
                        <img src="@/assets/images/autostage/down.png" alt="" id="selected" class="test-normal">   
                    </div>
                </div>
                <div class="up" v-show="upshow">
                    <input type="tel" pattern="[0-9]" maxlength="6" placeholder="请输入6位工号" v-model="jobNum" id="jobNum" ref="jobNum" @input="checkjobNum" @blur="leavejobNum">
                    <div class="blank3"></div>
                    <img src="@/assets/images/autostage/delete.png" alt="" @click="Deletejob">
                </div>
            </div>
            <div class="footer">
                <div class="rule clear">  
                    <div class="quan" @click="changecheck_not" v-show="applyui.imgshow_one">
                        <img src="@/assets/images/autostage/unchecked.png" alt="" class="check">
                    </div>
                    <div class="quan" @click="changecheck_is" v-show="applyui.imgshow_two">
                        <img src="@/assets/images/autostage/checked.png" alt="" class="check">
                    </div>
                    <div class="rule-txt">我已阅读并同意<a href="https://mobile.cib.com.cn/creditcard/stage/other/zdfq_xz.html">《自动分期付款业务条款及细则》</a></div>
                </div>
            </div>
            <YFunctionBtn text="立即申请" :dis="applyui.disshow" @checktable="checkInfo" style="margin-top:0.16rem;"></YFunctionBtn>
            <div class="kind-remind">
                <span @click="kindRemind">什么是自动分期</span>
            </div>
            <div class="remind" v-show="applymenu.remindstatu">
                <p>什么是自动分期</p>
                <div class="remind-txt">
                    <div>自动分期功能开通后，自开通之时起至最近一个账单日，<b>您账户已记账且未出账单的“消费累计金额”如达到您选择的起始金额时，系统将自动根据您设定的期数提供分期付款服务。</b></div>
                    <div>后续每个账单周期内的“消费累计金额”如达到起始金额时，系统均将自动根据您设定的期数提供分期付款服务。</div>
                </div>
                <span class="remind-confirm" @click="rconfirm">知道了</span>
            </div>
            <div class="layer" v-show="applymenu.laystatu"></div>
            <div class="remind-alert" v-show="applymenu.changestatu">
                <div class="alert-top">{{applydata.creditcardNum.cardNo}}</div>
                <div class="alert-info">该卡片暂不支持开通自动分期</div>
                <div class="alert-blank"></div>
                <div class="alert-bottom">
                    <div id="close" class="btn" @click="close" :class="applyui.active ? 'active' : ''">关闭</div>
                    <div id="change" class="btn" @click="change" :class="applyui.active2 ? 'active' : ''">更换卡片</div>
                </div>
            </div>
            <BapplyFail :show="fail.showAlert" :title="fail.title" :msg="fail.msg" :err="fail.err" @apllayFailBtn="fconfirm"></BapplyFail>
            <YErrorAlert :msg="alert.msg" :err="alert.err" :show="alert.showAlert" @confirm="confirm_apply"></YErrorAlert>
            <YVersion :version="version" top="16%"></YVersion>
        </div>
    </div>
</template>
<script>
    // 引入所需的方法、组件
    import {mapActions,mapState} from "vuex";
    import _ from 'lodash';
    import {initsa,track} from "@/assets/js/common.js";
    import BinputSelect from "../../components/BinputSelect";
    import BpayType from "../../components/BpayType";
    import Brate from "../../components/Brate";
    import YFunctionBtn from "../../components/YFunctionBtn";
    import BapplyFail from "../../components/BapplyFail"; 
    import YErrorAlert from "../../components/YErrorAlert";
    import YVersion from "../../components/YVersion"; 
    export default {
        name: 'ApplyPage',
        data(){
            return { 
                selectedTxt:"展开",  // 展开/收起
                jobNum:"",           // 工号
                upshow:"",           // 是否展开
                applyInfo:{}         // 修改=>申请页 切卡后的数据
            }
        },
        computed:mapState({
            applydata:state => state.autostage.apply.applydata,
            applyui:state => state.autostage.apply.applyui,
            applymenu:state => state.autostage.apply.applymenu,
            fail:state => state.autostage.apply.fail,
            alert:state => state.autostage.apply.alert,
            version:state => state.autostage.version,
            creditList:state =>state.autostage.apply.applyui.creditList
        }),
        created(){
            this.initApply();   // 初始化自动分期申请页                 
        },
        methods:{
            // 初始化自动分期申请页 
            initApply(){
                initsa("自动分期申请页");
                if(window.location.href.indexOf("cardKey") == -1){                // 查询接口
                    this.$store.dispatch("autostage/bsetinitapply",{
                        applydata:this.applydata,
                        router:this.$router
                    });
                }else{
                    this.applyInfo = JSON.parse(this.$route.query.Adata);
                    this.$store.commit("autostage/BSETAPPLY",this.applyInfo);
                }
            },
            // 显示列表
            showCredit(){   
                this.$store.commit("autostage/BAPPLYCREDITSTATU",{layer:true,statu:true});
            },
            // 取消
            Cancel(){       
                this.$store.commit("autostage/BAPPLYCREDITSTATU",{layer:false,statu:false});
            },
            // 切换信用卡
            changeChosed(item,index){
                _.forEach(this.creditList,(item2,i) => {
                    if(index==i){
                        var data = {
                            cardKey:item2.cardKey,
                            cardNo:item2.cardNo,
                            index:index
                        }
                        this.$store.dispatch("autostage/bchangeapplycredit",{
                            creditcardNum:data,
                            router:this.$router,
                        });
                    }
                });
                this.$store.commit("autostage/BAPPLYCREDITSTATU",{layer:false,statu:false});
            },
            // 切换起分金额
            getselect(data){
                this.$store.dispatch("autostage/bchangeapplycharge",{ 
                    charge:data,     
                    applydata:this.applydata
                }); 
            },
            // 切换支付方式
            getpay(data){
                this.$store.dispatch("autostage/bchangeapplypaytype",{
                    paytype:data,
                    applydata:this.applydata
                }); 
            },
            // 选择分期费率
            getprate(data){
                this.$store.dispatch("autostage/bchangeapplyperiodrate",{
                    periodrate:data
                });
            },
            // 点击费率获取列表
            periodClick(){
                this.$store.dispatch("autostage/binitapplyrate",{       // 费率列表赋值
                    applydata:this.applydata
                }); 
            },
            // 展开选填
            downClick(){
                if($("#selected").hasClass("test-inverse")){
                    this.selectedTxt = "展开";
                    $("#selected").removeClass("test-inverse");
                    this.upshow = false;
				}else{
                    this.selectedTxt = "收起";
                    $("#selected").addClass("test-inverse");
                    this.upshow = true;
				}
            },
            // 清空工号
            Deletejob(){
                this.jobNum = "";
                this.$refs.jobNum.focus();
            },
            // 校验工号
            checkjobNum(){
                this.jobNum = this.jobNum.replace(/[^\d]/g,"");           // 限制只能输入数字
                if(this.applyui.imgshow_two==true){
                    this.$store.commit("autostage/BCHANGEAPPLYBTN",{status:true});
                }else{
                    this.$store.commit("autostage/BCHANGEAPPLYBTN",{status:false});
                }
            },
            // 工号blur
            leavejobNum(){
                setTimeout(()=>{
                    var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                    window.scrollTo(0,Math.max(scrollHeight - 1,0));
                },100);
            },
            // 切换选中状态
            changecheck_not(){
                this.$store.commit('autostage/BCHANGEAPPLYSTATUS',{unchecked:false,checked:true});
                if(this.applyui.imgshow_two==true){
                    this.$store.commit("autostage/BCHANGEAPPLYBTN",{status:true});
                }else{
                    this.$store.commit("autostage/BCHANGEAPPLYBTN",{status:false});
                }
            },
            // 切换选中状态
            changecheck_is(){
                this.$store.commit('autostage/BCHANGEAPPLYSTATUS',{unchecked:true,checked:false});
                if(this.applyui.imgshow_two==true){
                    this.$store.commit("autostage/BCHANGEAPPLYBTN",{status:true});
                }else{
                    this.$store.commit("autostage/BCHANGEAPPLYBTN",{status:false});
                }
            },
            // 点击温馨提示
            kindRemind(){               
                this.$store.commit("autostage/BCHANGEAPPLYREMIND",{layer:true,remind:true});
            },
            // 关闭温馨提示
            rconfirm(){                 
                this.$store.commit("autostage/BCHANGEAPPLYREMIND",{layer:false,remind:false});
            },
            // 申请失败弹框
            fconfirm(){
                this.$store.commit('autostage/BAPPLYFAILALERT', {show: false, title:"",msg: '', err: ''});
            },
            // 申请页错误弹框
            confirm_apply(){
                this.$store.commit("autostage/BAPPLYALERT",{show: false, msg: '', err: ''});
            },
            // 关闭
            close(){
                this.$store.commit("autostage/BAPPLYCLOSEALERT",{show:false});
            },
            // 更换卡片
            change(){
                this.$store.commit("autostage/BAPPLYCLOSEALERT",{show:false});
                this.$store.commit("autostage/BAPPLYCREDITSTATU",{layer:true,statu:true});
            },
            // 立即申请
            checkInfo(){
                if(this.applyui.imgshow_two==true){
                    track("Autostage_apply","自动分期申请页申请按钮");
                    this.$store.dispatch("autostage/bapplyinfo",{       
                        applydata:this.applydata,
                        jobNum:this.jobNum,
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
#credit .title #down{width: 0.13rem;float: right;margin-top: 0.21rem;}
#credit .creditcard-select{background: #fff;width: 100%;height: 2.66rem;z-index: 999;position: absolute;bottom: 0;color: #333;}
#credit .select-title{height:0.5rem;line-height:0.5rem;text-align: center;border-bottom: 0.01rem solid #DEDEDE;}
#credit #cancel{position: absolute;left: 0.2rem;font-size: 0.15rem;color: #999;}
#credit .select-title span{font-size: 0.17rem;color: #333;}
#credit .select-list {height: 2.15rem;overflow: scroll;}
#credit .select-list li {height: 0.63rem;line-height: 0.63rem;border-bottom: 0.01rem solid #EAEAEA;}
#credit .logo{width: 0.28rem;position: relative;left: 0.3rem;}
#credit .creditcard-txt{display: inline-block;width: 2.23rem;margin-left: 0.4rem;font-size: 0.15rem;}
#credit .chosed{width: 0.15rem;margin-left: 0.4rem;}

.blank{background:#F3F5F9;height: 0.1rem;}
.blank2{height: 0.01rem;background: #EEE;position: relative;left: 5.3%;}
.select-one{padding:0.16rem 0;}
.layer{width: 100%;height: 100%;z-index: 100;position: fixed;top: 0;left: 0;display: block;background: #000;opacity: 0.4;}
.selected-content{background:#F3F5F9;margin: 0 5.3% 0.32rem;padding: 0.08rem 4.3%;}
.selected-content .down span{font-size: 0.12rem;line-height: 0.18rem;color:#666;display: inline-block;height: 0.18rem;}
.selected-content .down .change{float: right;}
.selected-content .down .change span{font-size: 0.12rem;line-height: 0.18rem;color:#666;display: inline-block;height: 0.18rem;} 
.selected-content .down img{width:0.05rem;height: 0.04rem;}
.selected-content .up{margin-top: 0.16rem;position: relative;}
.selected-content .up input{border: none;background: none;width: 100%;font-size: 0.12rem;line-height: 0.18rem;
height: 0.18rem;color:#333;}
.selected-content .up input::-webkit-input-placeholder{color:#999;}
.selected-content .up input:-moz-placeholder{color:#999;}
.selected-content .up input:-ms-input-placeholder{color:#999;}
.blank3{height: 0.01rem;width: 100%;background:#DDD;margin-top: 0.03rem;}
.selected-content .up img{width:0.15rem;position: absolute;right: 0.02rem;top: 0.01rem;}
.test-normal{transform: rotate(0deg);-webkit-transform: rotate(0deg);transition: transform .5s;}
.test-inverse{transform: rotate(180deg);-webkit-transform: rotate(180deg);transition: transform .5s;}
.selected-remind{padding-left: 9.6%;font-size: 0.11rem;color: #F63E4B;letter-spacing: 0;line-height: 0.16rem;height: 0.16rem;
margin: 0.02rem 0 0.14rem;}
/* 底部 */
.footer{padding: 0 5.3%;box-sizing: border-box;}
.rule .quan{float: left;margin-right: 0.08rem;}
.rule .quan .check{width: 0.16rem;}
.rule .rule-txt{float: left;font-size: 0.12rem;color:#666;line-height: 0.18rem;height: 0.18rem;}
.rule-txt a {color:#0060F1;}
/* 温馨提示 */
.kind-remind{margin-top: 0.2rem;text-align: center;font-size: 0.13rem;color: #5084FF;line-height: 0.18rem;height: 0.18rem;}
.remind{position:absolute;width:72.3%;background:#FFF;top: 0.79rem;z-index:666;border-radius: 0.1rem;left: 0;
right: 0;margin:0 auto;}
.remind p{margin:0.19rem 0 0.13rem;font-size: 0.18rem;line-height: 0.22rem;text-align: center;}
.remind-txt{font-size: 0.14rem;line-height: 0.2rem;padding:0 0.16rem 0 0.2rem;box-sizing: 
border-box;margin-bottom: 0.2rem;height: 1.58rem;color:#666;overflow: scroll;}
.remind-txt div{text-indent: 2em;}
.remind-txt a{font-size: 0.09rem;}
.remind-txt b {font-weight: 700;}
.remind-confirm{font-size: 0.16rem;color: #0060F1;letter-spacing: -0.0038rem;text-align: center;display: block;
line-height: 3;border-top: 0.5px solid #EAEAEA;}
/* 更换卡片-提示信息 */
.remind-alert{width:72.3%;position: absolute;left: 0;right: 0;margin: auto;z-index: 200;background:#fff;top:1.91rem;border-radius: 0.12rem;}
.alert-top{font-size: 0.16rem;line-height: 0.24rem;height: 0.24rem;text-align: center;padding-top: 0.24rem;}
.alert-info{font-size: 0.16rem;line-height: 0.24rem;height: 0.24rem;text-align: center;margin-bottom: 0.24rem;}
.alert-blank{background:#EAEAEA;height: 0.01rem;}
.alert-bottom{display: flex;text-align: center;}
.btn{color: #B2B2B2;letter-spacing: -0.0041rem;line-height: 0.24rem;height: 0.24rem;font-size: 0.17rem;width: 50%;
padding:0.11rem 0;}
.alert-bottom #close{border-right: 0.01rem solid #EAEAEA;}
.active{color:#0060F1};
</style>