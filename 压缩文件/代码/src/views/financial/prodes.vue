<template>
    <div class="des">
        <div class="d_top">
            <p class="txt1" v-show="prodes.tradeFlag===0 || prodes.tradeFlag===2">七日年化</p>
            <p class="txt2" v-show="prodes.tradeFlag===0 || prodes.tradeFlag===2">{{prodes.qiriAnnualized}} <i>%</i></p>
            <div class="cflex d_top_num">
                <div>
                    <p>万份收益</p>
                    <span>{{prodes.wanfenIncome}}%</span>
                </div>
                <i class="ii"></i>
                <div>
                    <p>七日年化</p>
                    <span>{{prodes.qiriAnnualized}}%</span>
                </div>
                <i class="ii"></i>
                <div>
                    <p>净值</p>
                    <span>1.00%</span>
                </div>
            </div>
            <div class="cflex d_myfene" v-show="prodes.tradeFlag===1">
                <div>
                    <p>持有总份额</p>
                    <span>{{prodes.proBalance}}份</span>
                </div>
                <div>
                    <p>昨日收益</p>
                    <span class="red">+{{prodes.lastEarning}}份</span>
                </div>
            </div>
            <div class="white"></div>
        </div>
        <div class="d_echart" v-show="prodes.tradeFlag===0 || prodes.tradeFlag===2">
            <div class="cflex e_title">
                <p :class="prodes.trend==1?'blue':''" @click="changeTrend(1)">七日年化走势图</p>
                <p :class="prodes.trend==2?'blue':''" @click="changeTrend(2)">万份收益走势图</p>
            </div>
            <div class="e_echart" ref="echart">

            </div>
        </div>
        <div class="p_period">
            <div class="p_book regu clear">
                <p class="left">理财周期</p>
                <!-- <p class="right" @click="prodes.showProBook=!prodes.showProBook">产品说明 <span></span></p> -->
            </div>
            <div class="p_time" v-show="prodes.tradeFlag===1 || prodes.tradeFlag===2">
                <p>赎回资金实时到账。今日15:45之后的申购下一工作日起息。</p>
                <div class="p_time_t">
                    <p class="clear"> <span class="left">T</span> <span class="right">T+1</span></p>
                    <span></span>
                    <p class="clear"> <span class="left">15:45</span> <span class="right">15:45</span></p>                    
                </div>
            </div>
        </div>
        <div class="p_detail" v-show="prodes.tradeFlag===2">
            <p class="regu" @click="prodes.showProdetail=!prodes.showProdetail">产品详情</p>
            <div class="p_detail_con" v-show="prodes.showProdetail">
                <div class="clear">
                    <p class="left">产品全称</p><p class="right">{{prodes.proInfo.name}}</p>   
                </div>
                 <div class="clear">
                     <p class="left">发行机构</p><p class="right">{{prodes.proInfo.org}}</p>
                 </div>
                 <div class="clear">
                     <p class="left">风险等级</p><p class="right">{{prodes.proInfo.risk}}</p>
                 </div>
                 <div class="clear">
                     <p class="left">是否保本</p><p class="right">{{prodes.proInfo.capitalFlag}}</p>
                 </div>
                 <div class="clear">
                     <p class="left">理财产品登记编码</p><p class="right"></p>
                 </div>
                 <div class="clear">
                     <p class="left">公告详情</p> <p class="right">请访问 <br/>{{prodes.proInfo.adv}}</p>
                 </div>
            </div>
        </div>
        <div class="p_edu" v-show="prodes.tradeFlag===2">
            <p class="regu" @click="prodes.showProedu=!prodes.showProedu">产品额度</p>
            <div class="p_edu_con clear" v-show="prodes.showProedu">
                <div class="left">
                    <p>最低购买金额</p>
                    <p>购买递增金额</p>
                </div>
                 <div class="left">
                    <p>{{prodes.proInfo.lowAmt}}元</p>
                    <p>{{prodes.proInfo.stepAmt}}元</p>
                </div>
            </div>
            <span>如您有持有该产品份额,可以以1.00整倍认购产品</span>
        </div>
        <div class="p_desc"  v-show="prodes.tradeFlag===2">
            <p class="regu"><a :href="pdf" target="_blank">产品说明书</a></p>
        </div>
        <ylBtn v-if="prodes.tradeFlag===0||prodes.tradeFlag===2" :text="prodes.tradeFlag===0?'立即购买':'立即开户购买'" bgcolor="" btnBgcolor="#5084FF" margin="0.6rem auto 0" confirmbtn="confirmbtn"></ylBtn>
        <div class="isRegister cflex" v-else>
            <p @click="tradeFlag1(0)">马上赎回</p>
            <p @click="tradeFlag1(1)">立即购买</p>
        </div>
        <YVersion top="0.4rem" :version="yindex.version"></YVersion>
        <YErrorAlert :msg="alert.msg" :err="alert.err" :show="alert.show" @confirm="closeAlert"></YErrorAlert>
        <!-- <div class="showProBook" v-show="prodes.showProBook">
            <div class="probook ccenter">
                <h3>产品说明书</h3>
                <div class="probook_con">
                    <p class="txt1">"现金宝一添利1号"为"固定收益一非保本浮动收益开放式-净值型"的产品</p>
                    <p class="txt_spe">
                        <span>特点1</span>
                        由兴业银行发行管理的女教授副教授看到房价开始大幅回升花费多少积分函数空间ds
                    </p>
                    <p class="txt_spe">
                        <span>特点1</span>
                        由兴业银行发行管理的女教授副教授看到房价开始大幅回升花费多少积分函数空间ds
                    </p>
                    <p class="txt_spe">
                        <span>特点1</span>
                        由兴业银行发行管理的女教授副教授看到房价开始大幅回升花费多少积分函数空间ds
                    </p>
                    <p class="txt_spe">
                        <span>特点1</span>
                        由兴业银行发行管理的女教授副教授看到房价开始大幅回升花费多少积分函数空间ds
                    </p>
                </div>
                <p class="probook_btn" @click="prodes.showProBook=!prodes.showProBook">我知道了</p>
            </div>
        </div> -->
    </div>
</template>
<script>  //未注册
import {mapState} from "vuex";
import ylBtn from "@/components/ylBtn";
import YVersion from "@/components/YVersion";
import YErrorAlert from "../../components/YErrorAlert";
import {drawLine,initsa,track} from "@/assets/js/common.js"
export default {
    name:"prodeuctDescription",
    data(){
        return{
            pdf:"https://test.xliane.com/html3/webapp/resource/licai.pdf"
        }
    },
    created(){
        this.init();
        initsa("理财产品页面");
    },
    mounted(){
        
    },
    components:{
        ylBtn,YVersion,YErrorAlert
    },
    methods:{
        init(){  //是否注册添利账号
            let query = this.$route.query;
            if(query.tradeFlag){   // 渠道 0-无交易记录 1-有交易记录 2-无理财账户
                this.$store.commit("yindex/SET_TRADEFLAG",{tradeFlag:Number(query.tradeFlag),proBalance:query.proBalance,lastEarning:query.lastEarning});
            }else{
                this.$store.commit("yindex/SET_TRADEFLAG",{tradeFlag:2,proBalance:"",lastEarning:""});
            }
            setTimeout(()=>{
                this.$store.commit("yindex/SET_BASEDATA",{});
                this.$store.dispatch("yindex/wealthProduct",{data:this.baseData,$echarts:this.$echarts,$dom:this.$refs.echart});
            },0)
        },
        changeTrend(n){  //切换走势图
            if(n==this.prodes.trend){return}
            if(this.prodes.trend==1){  //本来是7日 切换成万份收益
                this.$store.commit("yindex/SET_TRENDFLAG",{name:"万份收益",trend:n})
                drawLine(this.$echarts,this.$refs.echart,this.prodes.wanfenMax,this.prodes.wanfenMin,this.prodes.wanfenDate,this.prodes.wanfenData,this.prodes.name);
            }else if(this.prodes.trend==2){
                this.$store.commit("yindex/SET_TRENDFLAG",{name:"七日年化",trend:n})
                drawLine(this.$echarts,this.$refs.echart,this.prodes.qiriMax,this.prodes.qiriMin,this.prodes.qiriDate,this.prodes.qiriData,this.prodes.name);
            }
        },
        confirmbtn(){  //按钮
            if(this.prodes.tradeFlag==0){ //去购买
                track("TL_tobuy1","理财产品页跳转至购买");                
            }else if(this.prodes.tradeFlag==2){ //去开户
                track("TL_tokh","理财产品页跳转至开户");
            }
        },
        tradeFlag1(n){
            if(n==0){  //去赎回
                track("TL_tosh","理财产品页跳转至赎回");
            }else if(n==1){ //去购买
                track("TL_tobuy2","理财产品页跳转至购买");
            }
        },
        closeAlert(){
            let obj = {
                show: false,
                msg:'',
                err:''
            };
            this.$store.commit("yindex/SET_ALERT", obj);
        },
    },
    computed:{
        ...mapState({
            yindex:state=>state.yindex.yindex,
            prodes:state=>state.yindex.prodes,
            baseData:state=>state.yindex.baseData,
            alert: state => state.yindex.alert,
        })
    }
}
</script>
<style scoped>
    .des{
        width: 100%;
        /* height: 100%; */
        padding-top: 0.1rem;
        background: #F3F5F9;
        position: relative;
    }
     .left{
        float: left;
    }
    .right{
        float: right;
    }
    .d_top{
        width: 100%;
        background: #fff;
        margin-bottom: 0.1rem;
    }
    .d_top .txt1{
        font-family: PingFangSC-Regular;
        font-size: 0.14rem;
        color: #000000;
        letter-spacing: 0.0017rem;
        text-align: center;
        line-height:0.46rem;
    }
    .d_top .txt2{
        font-family: PingFangSC-Medium;
        font-size: 0.32rem;
        color: #F63E4B;
        letter-spacing: 0.0038rem;
        text-align: center;
    }
    .d_top_num{
        width: 100%;
        padding: 0.15rem 0;
    }
    .d_top_num>div{
        width:33.13%;
        text-align: center;
    }
    .d_top_num p{
        font-family: PingFangSC-Regular;
        font-size: 0.14rem;
        color: #666666;
        letter-spacing: 0;
    }
    .d_top_num span{
        font-family: PingFangSC-Regular;
        font-size: 0.16rem;
        color: #000000;
        letter-spacing: 0.0019rem;
        line-height: 0.32rem;
    }
    .ii{
        width:0.3%;
        height: 0.32rem;
        background: #DEDEDE;
    }
    .d_myfene{
        width: 89.3%;
        margin:0 auto;
        box-shadow: 0 0.04rem 0.1rem 0.01rem rgba(101,117,156,0.22);
        border-radius: 0.1rem;
        padding:0.2rem 0;
    }
    .d_myfene>div{
        width: 50%;
        text-align: center;
    }
    .d_myfene p{
        font-family: PingFangSC-Regular;
        font-size: 0.14rem;
        color: #333333;
        letter-spacing: 0;
        text-align: center;
        line-height: 0.28rem;
    }
    .d_myfene span{
        font-family: PingFangSC-Medium;
        font-size: 0.2rem;
        color: #000000;
        letter-spacing: 0.0024rem;
        text-align: center;
        line-height: 0.4rem;
    }
    .d_myfene span.red{
        color:#FF423E;
    }
    .white{
        width: 100%;
        height: 0.1rem;
        background: #fff;
        margin-top: 0.1rem;
    }
    .d_echart{
        width: 100%;
        text-align: center;
        background: #fff;
        margin-bottom: 0.1rem;
    }
    .e_title{
        border-bottom: 0.005rem solid #DEDEDE;
    }
    .e_title p{
        width: 50%;
        font-family: PingFangSC-Regular;
        font-size: 0.16rem;
        color: #000;
        letter-spacing: 0.0019rem;
        line-height: 0.48rem;
    }
    .e_title p.blue{
        border-bottom:0.02rem solid #5084FF;
        color: #5084FF;
    }
    .e_echart{
        height: 2.06rem;
    }
    .p_period{
        background: #fff;
        width: 100%;
        margin-bottom: 0.1rem;
    }
    .regu{
        padding: 0 5.3%;
        width: 100%;
        box-sizing: border-box;
        line-height: 0.5rem;
    }
    .p_book p{
        font-family: PingFangSC-Regular;
        font-size: 0.16rem;
        color: #000000;
        letter-spacing: 0.0019rem;
    }
    .p_book p:nth-child(2) span{
        display: inline-block;
        width: 0.16rem;
        height: 0.5rem;
        background: url("../../assets/images/financial/yindex/que.png") no-repeat center;
        background-size: 100% 0.16rem;
        margin-left: 0.05rem;
        vertical-align: bottom;
    }
    .p_time{
        border-top:0.005rem solid #DEDEDE;
        padding:0.1rem 0;
    }
    .p_time>p{
        font-family: PingFangSC-Regular;
        font-size: 0.13rem;
        color: #999999;
        letter-spacing: 0;
        text-align: left;
        padding:0 5.3%;
        line-height: 0.26rem;
    }
    .p_time_t>p{
        padding:0 12.8%;
        font-family: PingFangSC-Regular;
        font-size: 0.12rem;
        color: #000000;
        letter-spacing: 0.0014rem;
        line-height: 0.36rem;
    }
   .p_time_t>span{
       display: block;
       width:66%;
       height:0.06rem;
       background: #5084FF;
       margin:0 auto;
       border-radius:0.05rem;
    }
    .p_detail,.p_edu,.p_desc{
        background: #fff;
        margin-bottom: 0.1rem;
    }
    p.regu{
        font-family: PingFangSC-Regular;
        font-size: 0.16rem;
        color: #000000;
        letter-spacing: 0.0019rem;
        background:url("../../assets/images/financial/yindex/dropdown.png") no-repeat 94.7% center;
        background-size: 0.15rem 0.09rem;
    }
    p.regu a{
        color: #000000;
        display:block;
        width:100%;
        height: 100%;
    }
    p.regu.dropup{
        background:url("../../assets/images/financial/yindex/dropup.png") no-repeat 94.7% center;
        background-size: 0.15rem 0.09rem;
    }
    .p_detail_con,.p_edu_con{
       border-top:0.005rem solid #DEDEDE;
       padding: 0.1rem 5.3%;
    }
    .p_detail_con p.left{
        width:40%;
    }
    .p_detail_con p.right{
        width:60%;
    }
    .p_detail_con p,.p_edu_con p{
        font-family: PingFangSC-Regular;
        font-size: 0.14rem;
        color: #666666;
        letter-spacing: 0;
        line-height: 0.28rem;
    }
    .p_edu_con>div:nth-child(1){
        width:40%;
    }
    .p_edu span{
        display: block;
        width:100%;
        font-size: 0.14rem;
        line-height: 0.28rem;
        padding: 0 5.3%;
        box-sizing: border-box;
        color:#666;
        background: #F3F5F9;
    }
    .p_desc .regu{
        line-height: 0.55rem;
        background:url("../../assets/images/financial/yindex/arrowRight.png") no-repeat 94.7% center;
        background-size: 0.18rem 0.18rem;
    }
    .isRegister{
        padding:0 5.3%;
    }
    .isRegister p{
        width:41.3%;
        height: 0.45rem;
        line-height: 0.45rem;
        font-family: PingFangSC-Regular;
        font-size: 0.16rem;
        letter-spacing: 0.0019rem;
        text-align: center;
        box-sizing: border-box;
        margin-top: 0.4rem;
        border-radius: 0.22rem;
    }
    .isRegister p:nth-child(1){
        color: #5084FF;
        border: 0.01rem solid #5084FF;
    }
    .isRegister p:nth-child(2){
        color: #fff;
        background: #5084FF;
    }

    .showProBook{
        position: absolute;
        left:0;top:0;
        height: 100%;
        width: 100%;
        background: rgba(0, 0, 0, 0.4)
    }
    .probook{
        width: 72.3%;
        max-height: 3.78rem;
        background: #fff;
        border-radius:0.1rem;
        overflow: scroll;
    }
    .probook h3{
        line-height: 0.48rem;
        height: 0.48rem;
        font-family: PingFangSC-Regular;
        font-size: 0.16rem;
        color: #000000;
        letter-spacing: 0;
        text-align: center;
    }
    .probook_con{
        padding:0 0.2rem;
        height:2.895rem;
        overflow: scroll;
    }
    .probook_con p.txt1{
        font-family: PingFangSC-Regular;
        font-size: 0.13rem;
        color: #000000;
        letter-spacing: 0;
        line-height: 0.23rem;
        font-weight: 700;
    }
    .probook_con p.txt_spe{
        font-family: PingFangSC-Regular;
        font-size: 0.13rem;
        color: #666;
        letter-spacing: 0;
        line-height: 0.23rem;
    }
    .probook_con p.txt_spe span{
        color: #5084FF;
        margin-right: 0.1rem;
    }
    .probook_btn{
        font-family: PingFangSC-Regular;
        font-size: 0.12rem;
        color: #5084FF;
        letter-spacing: 0;
        line-height: 0.4rem;
        border-top:0.005rem solid #DEDEDE;
        text-align: center;
        box-sizing: border-box;
    }
</style>
<style>
/* #app{ */
    /* background: #F3F5F9 !important; */
/* } */
</style>
