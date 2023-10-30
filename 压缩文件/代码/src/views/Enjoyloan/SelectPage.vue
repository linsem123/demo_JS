<template>
  <div id="search">
    <div class="s-top">
      <div class="s-title">
        <img src="@/assets/images/search.png" alt="">
        <input type="text" placeholder="搜索" v-model="ui.searchResult" @input="searchInfo">
      </div>
    </div>
    <div class="bank-list">
      <li v-for="(item,index) in bankList" :key="index" @click="chooseBank(item,index)">
        <div>{{item[0]}}</div>
      </li>
    </div>
    <p id="copyright">&copy;本服务由兴业银行信用卡中心提供&nbsp;v{{hdata.copyright}}</p>
  </div>
</template>

<script>
  // 引入所需的方法、组件
  import {mapActions,mapState} from "vuex";
  import {initsa,track,saAlert} from "@/assets/js/common.js"; //听云监听
  // import { clearTimeout, setTimeout } from 'timers'; 

  export default {
    name: 'selectcard', // 选择银行卡
    data () {
      return { //绑定数据
      }
    },
    computed:mapState({
      bankList:state => state.a.public.ui.bankList,
      ui:state => state.a.search.ui,
      hdata:state => state.a.home.hdata,
    }),
    created(){
      this.initSelect();
      initsa("兴享贷搜索借记卡"); //初始化监听
    },
    methods:{
      initSelect(){
        this.$store.dispatch('searchbank',{
          searchResult:this.ui.searchResult
        });
      },
      searchInfo(){
        setTimeout(()=>{
          this.$store.dispatch('searchbank',{
            searchResult:this.ui.searchResult
          });
        },500)
      },
      chooseBank(item,index){
        var debitName = item[0];
        var debitNum = item[1];
        this.$store.dispatch('showbankname',{
          debitNum:debitNum,
          debitName:debitName,
          searchResult:this.ui.searchResult
        })
        this.$router.push({path:'/Enjoyloan/AddPage'});
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
#copyright{font-size:0.12rem;text-align: center;color:#666;margin-top:0.2rem;}
</style>
