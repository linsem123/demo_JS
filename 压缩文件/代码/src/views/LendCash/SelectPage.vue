<template>
    <div id="search">
        <div class="s-top">
        <div class="s-title">
            <img src="@/assets/images/lendcash/search.png" alt="">
            <input type="text" placeholder="更多银行，在此搜索" v-model="select.searchResult" @input="searchInfo">
        </div>
        </div>
        <div class="bank-list">
        <li v-for="(item,index) in bankList" :key="index" @click="chooseBank(item,index)">
            <div>{{item[0]}}</div>
        </li>
        </div>
        <div class="bank-txt">更多银行可通过上方搜索栏查找</div>
        <YVersion :version="version" top="5%"></YVersion>
        <YErrorAlert :msg="alert.msg" :err="alert.err" :show="alert.showAlert" @confirm="confirm_select"></YErrorAlert>
    </div>
</template>
<script>
import YErrorAlert from "../../components/YErrorAlert";
import YVersion from "../../components/YVersion";
import {mapActions,mapState} from "vuex";
import {initsa} from "@/assets/js/common.js"; 
export default {
    name: 'SelectPage',
    data(){
        return {}
    },
    components:{
        YErrorAlert,
        YVersion
    },
    computed:mapState({
        select:state => state.lc.select,    // 搜索内容
        bankList:state => state.lc.public.pubui.bankList,      // 搜索列表
        alert:state => state.lc.select.alert,                  // 弹出框
        version:state => state.lc.version
    }),
    created(){
        this.initSelect();
        initsa("预借现金搜索借记卡");       //初始化监听
    },
    methods:{
        initSelect(){
            this.$store.dispatch('lc/bsearchbank',{
                searchResult:this.select.searchResult
            });
        },
        searchInfo(){
            setTimeout(()=>{
                this.$store.dispatch('lc/bsearchbank',{
                    searchResult:this.select.searchResult
                });
            },500)
        },
        chooseBank(item,index){
            var debitName = item[0];  // 选中的借记卡银行名
            var debitNum = item[1];   // 选中的借记卡卡Bin
            this.$store.dispatch('lc/bshowbankname',{
                debitNum:debitNum,
                debitName:debitName,
                searchResult:this.select.searchResult
            })
            this.$router.push({path:'/LendCash/AddPage'});
        },
        confirm_select(){
            this.$store.commit("lc/BSELECTALERT",{show: false, msg: '', err: ''});
        }
    }
}
</script>
<style scoped>
#search{background:#F3F5F9;height: 100%;}
.s-top{padding:0.06rem;box-sizing: border-box;}
.s-title{background: #E4E4E4;border-radius: 0.03rem;height: 0.32rem;line-height: 0.32rem;}
.s-title img{width:0.13rem;margin:0 0.1rem;}
.s-title input{border: none;background: none;font-size: 0.14rem;color: #333;letter-spacing: -0.0034rem;width:3rem;}
.bank-list{background:#FFF;padding-left: 0.29rem;}
.bank-list li{height: 0.49rem;line-height: 0.49rem;font-size: 0.14rem;color: #333;letter-spacing: -0.0034rem;border-bottom: 0.01rem solid rgba(151,151,151,0.3);}
.bank-list li:last-child{border: none;}
.bank-txt{margin-top: 0.1rem;color: #666;font-size: 0.16rem;text-align: center;}
</style>
