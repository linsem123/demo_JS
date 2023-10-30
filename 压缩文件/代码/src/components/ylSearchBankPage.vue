<template>
  <div id="search">
    <div class="s-top">
      <div class="s-title">
        <img src="@/assets/images/search.png" alt="">
        <input type="text" placeholder="搜索" v-model="searchStr" @input="searchInfo">
      </div>
    </div>
    <div class="bank-list">
      <li v-for="(item,index) in bankList" :key="index" @click="chooseBank(item,index)" v-show="index<(searchStr==''?12:bankList.length)">
        <div>{{item[0]}}</div>
      </li>
    </div>
    <p class="more" v-show="bankList.length>0">更多银行可通过上方搜索栏查找</p>
    <YVersion top="0.4rem" :version="version"></YVersion>
  </div>
</template>

<script>
  // 引入所需的方法、组件
  import {mapActions,mapState} from "vuex";
  import {initsa,track,saAlert} from "@/assets/js/common.js";     //听云监听
  import YVersion from "./YVersion";
  export default {
    name: 'searchBank', // 选择银行卡
    props:["version","title","bankList","searchResult"],
    data () {
      return { //绑定数据
        searchStr:""
      }
    },
    components:{YVersion},
    computed:mapState({}),
    created(){
      initsa(this.title+"搜索页"); 
      this.searchStr = this.searchResult;
      this.initSelect();
    },
    methods:{
      initSelect(){  //默认搜索
        this.$store.dispatch('getBankList',{
          bankName:this.searchStr 
        });
      },
      searchInfo(){ //输入时搜搜
        setTimeout(()=>{
          this.$store.dispatch('getBankList',{
            bankName:this.searchStr
          });
        },500)
      },
      chooseBank(item,index){  //
        var debitName = item[0];
        var debitNum = item[1];
        this.$store.commit('TICKBANKNAME',{
          debitNum:debitNum,
          debitName:debitName,
          searchResult:this.searchStr
        })
        this.$emit("search");
      }
    }
  }
</script>

<style scoped>
#search{background:#F3F5F9;height:100%;overflow: auto;}
.s-top{padding:0.06rem;box-sizing: border-box;}
.s-title{background: #E4E4E4;border-radius: 0.03rem;height: 0.32rem;line-height: 0.32rem;}
.s-title img{width:0.13rem;margin:0 0.1rem;}
.s-title input{border: none;background: none;font-size: 0.14rem;color: #333;letter-spacing: -0.0034rem;width:3rem;}
.bank-list{background:#FFF;padding-left: 0.29rem;}
.bank-list li{height: 0.49rem;line-height: 0.49rem;font-size: 0.14rem;color: #333;letter-spacing: -0.0034rem;border-bottom: 0.01rem solid rgba(151,151,151,0.3);}
.bank-list li:last-child{border: none;}
.more{text-align: center;color: #666;margin-top: 0.2rem;font-size: 0.14rem;}
</style>
