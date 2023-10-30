<template>
    <div :class="fixed?'bg-fixed main':'main'">
        <div class="content">
            <ul class="cardList" id="cardList" ref="cardList">
                <li class="cardInfo" v-for="(item,index) in carddata.lcptCardList" :key="index">
                    <div class="cardImg">
                        <img :src="'FinsImages/'+item.bankLogo" alt="">
                    </div>
                    <div class="cardContent">
                        <div class="card-title">{{item.bankName}}</div>
                        <div class="cardNo">{{item.cardNo}}</div>
                        <div class="remainder" v-show="item.cardType=='2'">
                            余额 <span>{{item.limitMoney}}</span>元
                        </div>
                    </div>
                </li>
            </ul>
            <div id="add" @click="Add">
                <span>+ 添加借记卡</span>
            </div>
        </div>
        <YVersion :version="version" style="padding-top:0.2rem;"></YVersion>
        <YErrorAlert :msg="alert.msg" :err="alert.err" :show="alert.showAlert" @confirm="confirm_card"></YErrorAlert>
    </div>
</template>
<script>
// 引入所需的方法、组件
import {mapActions,mapState} from "vuex";
import {initsa,track} from "@/assets/js/common.js"; //听云监听
import YErrorAlert from "../../components/YErrorAlert";
import YVersion from "../../components/YVersion";
export default {
    name: 'cardPage',
    data(){
        return{}
    },
    computed:mapState({
        carddata:state => state.baddcard.carddata,
        adddata:state => state.baddcard.adddata,
        selectdata:state => state.baddcard.selectdata,
        fixed:state => state.baddcard.fixed,
        alert:state => state.baddcard.carddata.alert,
        version:state => state.baddcard.version
    }),
    created(){
        this.initHome(); //初始化首页
    },
    methods:{
        initHome(){
            // initsa("添利三号借记卡列表页");
            this.$store.dispatch("baddcard/bgetInfo",{
                carddata:this.carddata
            });
        },
        Add(){
            // track("TimLee_Addsubmit","添利三号借记卡添加按钮");
            this.$store.dispatch("baddcard/btoAdd",{
                adddata:this.adddata,
                selectdata:this.selectdata,
                router:this.$router
            })
        },
        // 关闭错误弹框
        confirm_card(){
            this.$store.commit("baddcard/BHOMEALERT",{show: false, msg: '', err: '',fixed:false});
        }
    },
    components:{
        YErrorAlert,
        YVersion
    }
}
</script>
<style scoped>
.main{background:#F3F5F9;width: 100%;padding-top:0.1rem;height: 100%;box-sizing: border-box;}
.bg-fixed{position: fixed;overflow: hidden;top:0;left:0;bottom:0;right:0;}
.content{padding:0 5.3%;box-sizing: border-box;}
.content .cardList{height: 4.8rem;overflow: scroll;}
.content .cardInfo{margin-bottom:0.1rem;display: flex;padding:0.16rem 0;background:#fff;border-radius: 0.08rem;}
.content .cardInfo .cardImg{width:0.66rem;}
.content .cardInfo .cardImg img{width:0.36rem;padding-left: 0.2rem;padding-top:0.08rem;}
.content .cardInfo .cardContent .card-title{height: 0.21rem;line-height: 0.21rem;font-size: 0.18rem;color:#000;}
.content .cardInfo .cardContent .cardNo{height: 0.21rem;line-height: 0.21rem;font-size: 0.15rem;color:#333;margin:0.08rem 0;}
.content .cardInfo .cardContent .remainder{height: 0.2rem;line-height: 0.2rem;font-size: 0.14rem;color:#333;}
#add{border: 0.01rem solid #5084FF;border-radius: 0.22rem;height: 0.45rem;line-height: 0.45rem;text-align: center;margin-top: 0.4rem;}
#add span{font-size: 0.16rem;color: #5084FF;}
</style> 