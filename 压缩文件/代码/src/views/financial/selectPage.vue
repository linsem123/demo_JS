<template>
    <div class="bg-fixed main">
        <div class="content">
            <div class="header">
                <img src="@/assets/images/financial/addcard/search.png" alt="">
                <input type="text" placeholder="搜索" v-model="selectdata.searchResult" @input="searchInfo">
            </div>
        </div>
        <div class="bank-list">
        <li v-for="(item,index) in lcptBankInfoList" :key="index" @click="chooseBank(item,index)">
            <div>{{item.bankName}}</div>
        </li>
        </div>
        <div class="bank-txt">
            <img src="@/assets/images/financial/addcard/remind.png" alt="">
            <span>目前仅支持绑定上述8家银行</span>
        </div>
        <YVersion :version="version" top="5%"></YVersion>
    </div>
</template>
<script>
import YVersion from "../../components/YVersion";
import {mapActions,mapState} from "vuex";
import {initsa} from "@/assets/js/common.js"; 
export default {
    name: 'selectPage',
    data(){
        return {
            selectInfo:{}
        }
    },
    components:{
        YVersion
    },
    computed:mapState({
        selectdata:state => state.baddcard.selectdata,   
        lcptBankInfoList:state => state.baddcard.selectdata.lcptBankInfoList,
        bankList:state => state.baddcard.selectdata.bankList,        
        alert:state => state.baddcard.selectdata.alert,           
        version:state => state.baddcard.version
    }),
    created(){
        this.initSelect();
    },
    methods:{
        // 初始化数据
        initSelect(){
            // initsa("预借现金搜索借记卡");       
            this.selectInfo = JSON.parse(this.$route.query.Sdata);
            this.$store.commit("baddcard/BSETBANKLIST",this.selectInfo.lcptBankInfoList);
        },
        // 搜索银行
        searchInfo(){
            setTimeout(()=>{
                this.$store.dispatch('baddcard/bsearchbank',{
                    searchResult:this.selectdata.searchResult,
                    bankList:this.bankList
                });
            },500)
        },
        // 选择银行
        chooseBank(item,index){
            var bankName = item.bankName;         // 选中的借记卡银行名
            var bankCode = item.bankCode;         // 选中的借记卡卡Bin
            this.$store.commit('baddcard/BSHOWBANKNAME',{bankName:bankName,bankCode:bankCode});
            this.$router.push({path:"/TimLee/addPage?Adata="+JSON.stringify(this.selectInfo)});
        },
    }
}
</script>
<style scoped>
.main{background:#F3F5F9;width: 100%;height: 100%;box-sizing: border-box;}
.bg-fixed{position: fixed;overflow: hidden;top:0;left:0;bottom:0;right:0;}
.content{padding:0.06rem;box-sizing: border-box;}
.header{background: #E4E4E4;border-radius: 0.03rem;height: 0.32rem;line-height: 0.32rem;}
.header img{width:0.13rem;margin:0 0.1rem;}
.header input{border: none;background: none;font-size: 0.14rem;color: #333;letter-spacing: -0.0034rem;width:3rem;}
.bank-list{background:#FFF;padding-left: 0.29rem;}
.bank-list li{height: 0.49rem;line-height: 0.49rem;font-size: 0.14rem;color: #333;letter-spacing: -0.0034rem;border-bottom: 0.01rem solid rgba(151,151,151,0.3);}
.bank-list li:last-child{border: none;}
.bank-txt{margin-top: 0.2rem;display: flex;height: 0.18rem;padding-left: 0.29rem;}
.bank-txt img{width:0.17rem;height: 0.17rem;margin-right: 0.08rem;}
.bank-txt span{color: #666;font-size: 0.13rem;line-height: 0.18rem;}
</style>