<template>
    <div class="home">
        <div class="h_top">
            <div class="h_con">
                <p class="txt1">我的理财</p>
                <p class="txt2" @click="toMylicai">{{home.proBalance}} <span>></span></p>
                <p class="txt3">昨日收益 +{{home.lastEarning}}</p>
                <span class="mx" @click="tolicaiDetail">明细 ></span>
            </div>
        </div>
        <div class="white"></div>
        <div class="h_sec cflex">
            <div>
                <h3>添利账户(元)</h3>
                <p>{{home.acctBalance}}</p>
                <span>去充值</span>
            </div>
            <i class="ii"></i>
            <div>
                <h3>总资产(元)</h3>
                <p>{{home.totalAmt}}</p>
                <span class="none"></span>
            </div>
        </div>
        <div class="h_sec cflex">
            <div>
                <h3>信用卡还款 <b class="h_icon"></b></h3>
            </div>
            <i class="ii"></i>
            <div>
                <h3>我的银行卡 <b class="h_icon myCard"></b></h3>
            </div>
        </div>
        <YVersion top="60%" :version="yindex.version"></YVersion>
        <YErrorAlert :msg="alert.msg" :err="alert.err" :show="alert.show" @confirm="closeAlert"></YErrorAlert>
    </div>
</template>
<script>  //已注册
import {mapState} from "vuex";
import YVersion from "@/components/YVersion";
import YErrorAlert from "../../components/YErrorAlert";
import {initsa,track} from "@/assets/js/common";
export default {
    name:"home",
    data(){
        return{}
    },
    created(){
        this.hadDeal();
        initsa('添利我的理财页')
    },
    mounted(){},
    components:{
        YVersion,YErrorAlert
    },
    methods:{
        hadDeal(){  //是否有过交易记录
            this.$store.commit("yindex/SET_BASEDATA",{});
            this.$store.dispatch("yindex/bankAccount",this.baseData) 
        },
        closeAlert(){
            let obj = {
                show: false,
                msg:'',
                err:''
            };
            this.$store.commit("yindex/SET_ALERT", obj);
        },
        tolicaiDetail(){  //点击理财明细
            track("TL_tomx","我的理财点击明细");
            this.$router.push({path:"/tianli/licaiDetail"});  //切换到理财产品页
        },
        toMylicai(){  //点击我的理财
            track("TL_toprodes","我的理财")
            this.$router.push({path:"/tianli/prodes",query:{tradeFlag:this.home.tradeFlag,proBalance:this.home.proBalance,lastEarning:this.home.lastEarning}});  //切换到理财产品页
        }
    },
    computed:{
        ...mapState({
            yindex:state=>state.yindex.yindex,
            home:state=>state.yindex.home,
            baseData:state=>state.yindex.baseData,
            alert: state => state.yindex.alert,
        })
    }
}
</script>
<style scoped>
    .home{
        width: 100%;
        height: 100%;
        background: #F3F5F9;
    }
    .h_top{
        width: 100%;
        height: 24.6%;
        background: #fff url("../../assets/images/financial/yindex/bg1.png") no-repeat center;
        background-size: 89.3% 90%;
    }
    .h_con{
        width: 89.3%;
        margin: 0 auto;
        text-align: center;
        position: relative;
    }
    p.txt1{
        font-family: PingFangSC-Regular;
        font-size: 0.15rem;
        color: rgba(255,255,255,0.79);
        letter-spacing: 0;
        padding:0.25rem 0 0.2rem;
    }
    p.txt2{
        font-family: PingFangSC-Medium;
        font-size: 0.35rem;
        color: #FFFFFF;
        letter-spacing: -0.0084rem;
        height: 0.35rem;
        line-height: 0.35rem;
    }
    p.txt2 span{
        font-family: PingFangSC-Regular;
        font-size: 0.15rem;
        color: #FFFFFF;
        letter-spacing: 0;
        line-height: 0.35rem;
        display: inline-block;
        vertical-align: bottom;
    }
    p.txt3{
        font-family: PingFangSC-Regular;
        font-size: 0.15rem;
        color: #FFFFFF;
        letter-spacing: -0.0036rem;
        line-height: 0.55rem;
        height: 0.55rem;
    }
    span.mx{
        position: absolute;
        right:0;
        top:25%;
        width: 0.6rem;
        height: 0.3rem;
        line-height: 0.3rem;
        background-image: linear-gradient(90deg, #FBBD77 0%, #FAE782 100%);
        border-radius: 0.215rem 0 0 0.215rem;
        font-family: PingFang-SC-Bold;
        font-size: 0.12rem;
        color: #F63E4B;
        letter-spacing: 0;
        text-align: center;
        padding-left: 0.06rem;
        box-sizing: border-box;
        z-index: 9999;
    }
    .white{
        width: 100%;
        height: 0.1rem;
        background: #fff;
        margin-bottom: 0.1rem;
    }
    .h_sec{
        background: #fff;
        padding: 0.16rem 0;
        box-sizing: border-box;
        margin-bottom: 0.1rem;
    }
    .h_sec>div{
        width:49.85%;
        padding-left: 8%;
        box-sizing: border-box;
    }
    .h_sec .ii{
        flex: 1;
        height: 0.4rem;
        background: #DEDEDE;
    }
    .h_sec h3{
        font-family: PingFangSC-Medium;
        font-size: 0.18rem;
        color: #333333;
        letter-spacing: -0.0043rem;
    }
    .h_sec p{
        font-family: PingFangSC-Regular;
        font-size: 0.16rem;
        color: #666666;
        letter-spacing: -0.0038rem;
        line-height: 0.4rem;
    }
    .h_sec span{
        background-image: linear-gradient(-90deg, #2868FF 0%, #5084FF 100%);
        border-radius: 0.17rem;
        line-height: 0.3rem;
        height: 0.3rem;
        width:0.7rem;
        text-align: center;
        display: inline-block;
        font-family: PingFangSC-Medium;
        font-size: 0.14rem;
        color: #FFFFFF;
        letter-spacing: -0.0034rem;
    }
    .h_sec span.none{
        background-image:none;
    }
    .h_icon{
        display: inline-block;
        width: 0.36rem;
        height: 0.28rem;
        background: url("../../assets/images/financial/yindex/payBack.png") no-repeat center;
        background-size: 100% 100%;
        vertical-align: middle;
    }
    .myCard{
        background: url("../../assets/images/financial/yindex/myCard.png") no-repeat center;
        background-size: 100% 100%;
    }
</style>
