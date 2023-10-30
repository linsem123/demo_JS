<template>
  <div :class="fixed ? 'bgFixed container':'container'" >
    <YlChangeCard :mainCard="home.mainCard" :cardIndex="home.cardIndex" :cardList="home.cardList" @change="change" @setFixed="setFixed"></YlChangeCard>
    <!--查到卡的情况-->
    <div v-if="home.flag == '1'">
      <div class="listTitle">
        <span>可办理消费分期交易</span>
        <span @click="changeCurrency" v-show="home.showCurrency">
          <img src="../../assets/images/consumeInstallment/rmb.png" v-if="home.image">
          <img src="../../assets/images/consumeInstallment/dollar.png" v-else>
        </span>
      </div>
      <div class="showList">
        <div class="listCon" v-for="(item,index) in home.consumeList" :key="index">
          <p>{{item.description}}</p>
          <p>
            <span><span v-if="home.image">￥</span><span v-else>$</span>{{item.amount}}</span>
            <span class="toHandle" @click="handle(index)">办理</span>
          </p>
          <p>{{item.consumeDate}}</p>
        </div>
      </div>
      <div class="more" v-if="home.nextFlag == 0">到底了，没有更多记录了</div>
      <div class="more" v-else @click="getMore">点击加载更多...</div>
    </div>
    <!--不可办理的情况-->
    <div v-else-if="home.flag == '0'">
      <div class="gray"></div>
      <div class="sbox1">
        <img src="../../assets/images/consumeInstallment/fenqi.png" alt="">
      </div>
      <div class="sbox2">
        <p class="p">该信用卡目前没有可</p>
        <p>办理的消费分期</p>
        <p>您可以点击页面上方切换卡片或试试账单分期</p>
      </div>
      <div class="sbox3">
        <a :href="link.toBill" @click="fToBill"><div>试试账单分期</div></a>
      </div>
    </div>
    <!--其他情况，如走失败-->
    <div v-else></div>
    <YVersion top="5%" :version="version"></YVersion>
    <YErrorAlert :msg="alert.msg" :err="alert.err" :show="alert.show" @confirm="closeAlert"></YErrorAlert>
    <!--<div>{{open}}</div>-->
  </div>
</template>
<script>
  import YlChangeCard from "../../components/ylChangeCard";
  import {mapGetters, mapState} from 'vuex';
  import YVersion from "../../components/YVersion";
  import api from '@/api/consumeInstallment.js';
  import YErrorAlert from "../../components/YErrorAlert";
  import {initsa,track,getCookie} from "@/assets/js/common.js"
  export default {
    name: "HomePage",
    data(){
      return{
        // open:''
      }
    },
    components:{
      YErrorAlert,
      YVersion,
      YlChangeCard,
    },
    created(){
      let open = getCookie('openId');   // 获取openId
      initsa("消费分期首页");
      track("xffq_getOpenId","消费分期首页获取openId",open);
      let obj = {
        nextFlag:'',
        valDate:'',
        purDate:'',
        putTime:'',
        tranNo:'',
        cardKey:''
      };
      this.$store.commit('co/SETBASEDATA',obj);
      this.$store.dispatch('co/getPayList',this.baseData);
      this.home.cardIndex = 0;
    },

    computed:{
      ...mapState({
        home : state => state.co.home,
        version : state => state.co.version,
        baseData:state => state.co.baseData,
        request : state => state.co.request,
        alert : state => state.co.alert,
        fixed : state => state.co.fixed,
        link : state => state.co.link
       })
    },
    methods:{
      setFixed(bl){
        console.log("----",bl);
        this.$store.commit("co/SET_BGFIXED",{fixed:bl.bl});
      },
      getMore(){
        track("xffq_getMore","消费分期点加载更多");
        let last = this.home.consumeList[this.home.consumeList.length-1];
        console.log("点击加载。。。",last);
        let obj = {
          nextFlag : 1,
          valDate:last.valDate,
          purDate:last.purDate,
          putTime:last.putTime,
          tranNo:last.tranNo,
          cardKey:this.home.mainCard.cardKey,
        };
        this.$store.commit('co/SETREQUEST','1');
        this.$store.commit('co/SETBASEDATA',obj);
        this.$store.dispatch('co/getPayList',this.baseData);
      },
      change(index){
        // console.log("900000");
        // console.log("index",index);
        track("xffq_changeCard","消费分期切卡");
        let cardKey = this.home.cardList[index].cardKey;
        if(this.home.mainCard.currencyFlag == 'L'){
          this.home.showCurrency = false;
        }else{
          this.home.showCurrency = true;
        }
        let obj = {
          nextFlag:'',
          valDate:'',
          purDate:'',
          putTime:'',
          tranNo:'',
          cardKey:cardKey
        };
        this.$store.commit('co/SETBASEDATA',obj);
        this.$store.dispatch('co/changeCard',{data:this.baseData,index:index});

      },
      changeCurrency(){
        track("xffq_changeCurrency","消费分期切币种");
        let currencyType = '';
          if(this.home.currencyType == '156'){
            currencyType = 840;
          }else{
            currencyType = 156;
          }
        console.log("提交给后台的currencyType=",currencyType);
        let obj = {
          cardKey:this.home.mainCard.cardKey,
          currencyType:currencyType,
        };

        this.$store.commit('co/SETBASEDATA',obj);
        this.$store.dispatch('co/changeCurrency',this.baseData);
      },
      handle(index){
        track("xffq_handle","消费分期点办理");
        let redBagNum = '';
        if(this.home.image == true){
          redBagNum = this.home.redPacketNumRMB;
        }else{
          redBagNum = this.home.redPacketNumUSD;
        }
        console.log("传递的红包个数为",redBagNum);
        let obj = {
          consumeList: this.home.consumeList[index],
          currencyType:this.home.currencyType,
          card:this.home.mainCard,
          image:this.home.image,
          redBagNum:redBagNum,
          list:{
            fenqiRmb:this.home.fenqiRmb,
            fenqiDollar:this.home.fenqiDollar,
            oneRmb:this.home.oneRmb,
            oneDollar:this.home.oneDollar
          }
        };
        obj = JSON.stringify(obj);
        this.$router.push({path:'/consume/ApplyPage',query:{value:obj}});
        console.log(this.home.consumeList[index].amount);
      },
      closeAlert(){
        let obj = {
          show: false,
          msg:'',
          err:''
        };
        this.$store.commit("co/SET_ALERT", obj);
      },
      fToBill(){
        track("xffq_bill","无法办理消费分期跳账单分期");
      }
    },

  }
</script>

<style scoped>
  .listTitle{
    padding: 0.12rem 0.2rem;
    background-color:#F3F5F9;
    font-size: 0.14rem;
    line-height: 0.2rem;
    color: #666666;
  }
  .listTitle img{
    width: 0.93rem;
    height: 0.22rem;
    float: right;
  }
  .showList{

  }
  .listCon{
    /*width: 100%;*/
    padding:0.16rem 0.1rem 0.15rem 0;
    border-bottom: 1px solid #EAEAEA;
    margin-left: 0.2rem;
  }
  .listCon p:nth-child(1){
    font-size: 0.16rem;
  }
  .listCon p:nth-child(2){
    font-size: 0.18rem;
    color: #333333;
    display: flex;
    justify-content: space-between;
    line-height: 0.3rem;
  }
  .listCon p:nth-child(3){
    font-size: 0.11rem;
    color: #999999;
  }
  .toHandle{
    width: 0.64rem;
    height: 0.3rem;
    text-align: center;
    border: 1px solid #5084FF;
    border-radius: 0.175rem;
    color:#5084FF;
    float: right;
  }
  .more{
    text-align: center;
    margin:0.2rem 0;
    color: #999;
    font-size: 0.14rem;
  }
  /*失败情况的样式*/
  .gray{
    background-color:#F3F5F9;
    height: 0.1rem;
  }
  .sbox1{
    width: 1.4rem;
    height: 1.15rem;
    margin: 0 auto;
    padding-top: 0.3rem;
  }
  .sbox1 img{
    width: 1.4rem;
    height: 1.15rem;
  }
  .sbox2{
    width: 100%;
    margin-top: 0.2rem;
  }
  .sbox2 p{
    text-align: center;
    line-height: .22rem;
    font-size: .13rem;
    color: #999;
  }
  .sbox2 .p{
    margin-bottom: 0.02rem;
  }
  .sbox2 p:nth-of-type(1){
    font-size: .18rem;
    color: #333;
  }
  .sbox2 p:nth-of-type(2){
    font-size: .18rem;
    color: #333;
  }
  .sbox2 p{
    line-height: .24rem;
  }
  .sbox3 div{
    height: .45rem;
    width: 3.35rem;
    background: #5084FF;
    border-radius: .22rem;
    text-align: center;
    line-height: .45rem;
    margin: 0 auto;
    margin-top: .40rem;

  }
  .sbox3 a{
    color: #fff;
    font-size: .14rem;
  }
  /*禁止滑动*/
  .bgFixed{
    position :fixed;
    overflow :hidden;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0
  }


</style>
