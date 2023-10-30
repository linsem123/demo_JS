//切换各行卡信息
//main 当前选中的银行卡以及信息，cardList[{cardInfo:'',availAmt:'',cardType:'',backLogo:''}]
//showMain 是否有默认选中的银行卡 ；showMoney  是否显示可用金额 ；
// showDebit    添加借记卡项是否显示
<template>
    <div>
      <div class="way"  @click="showList">
        <div class="wayName">付款方式</div>
        <div class="wayRg">
          <div v-show="showMain">
            <div class="wayAccount">{{main.cardInfo}}</div>
            <div class="wayUse" v-show="showMoney">{{text}}<span>{{main.availAmt}}</span>{{unit}}</div>
          </div>
          <img src="@/assets/images/financial/buy/arrow_right.png">
        </div>
      </div>
      <div class="cardList" v-show="showBank">
        <div class="cardListMask" @click="hideList"></div>
        <div class="cardListCont">
          <div class="cardListHead">
            <div class="cancel" @click="hideList">取消</div>
            <div class="title">选择支付账户</div>
            <div></div>
          </div>
          <div class="cardListMain">
            <div class="listCon" v-for="(item,index) in cardList" @click="choseBank(index)">
              <img class="bankIcon" src="@/assets/images/common/logo.png">
              <div>
                <div class="bankName">{{item.cardInfo}}</div>
                <div class="bankMoney" v-show="item.showText ">{{text}}<span class="money">{{item.availAmt}}</span>{{unit}}</div>
              </div>
              <img class="pick" src="@/assets/images/common/pick.png" v-show="index == bankIndex">
            </div>
            <div class="debit" v-show="showDebit">
              <img class="bankIcon" src="@/assets/images/financial/buy/debitCard.png">
              <div>
                <div class="bankName">添加借记卡</div>
                <div class="bankMoney">目前仅支持绑定8家银行</div>
              </div>
              <img class="pick" src="@/assets/images/financial/buy/arrow_right.png">
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
      name: "wjChangeBank",
      props:['cardList','main','bankIndex','showMoney','showMain','showDebit','text','unit'],
      data(){
        return{
          // main:{
          //   bankName:"",
          //   bankMoney:"",
          //
          // },
          // text:'可用余额',
          // unit:'元',
          showBank:false,
          // showMoney:true,
          // bankIndex:"",
          // cardList:[
          //   {name:"添利账户",money:'0'},
          //   {name:"兴业银行信用卡(1234)",money:"3000"},
          //   {name:"平安银行借记卡(2222)",money:''},
          //   {name:"招商借记卡(3333)",money:""}
          // ]
        }
      },
      created() {

      },
      methods:{
        showList(){
         this.showBank = true;
        },
        hideList(){
          this.showBank = false;
        },
        choseBank(index){
          console.log("index",index);
          this.showBank = false;
          this.$emit('change',index)
        }
      }
    }
</script>

<style scoped>
  .way{
    padding: 0.16rem 5.3%;
    background-color: #fff;
    height: auto;
    display: flex;
  }
  .wayName{
    color: #333;
    font-size: 0.15rem;
    margin-right: 0.3rem;
    float: left;
  }
  .wayAccount{
    font-size: 0.16rem;
    color: #000000;
  }
  .wayUse{
    font-size: 0.13rem;
    color: #666666;
    letter-spacing: 0.16px;
    margin-top: 0.02rem;
  }
  .wayUse>span{
    font-size: 0.12rem;
    color: #F63E4B;
  }
  .wayRg{
    display: flex;
    flex: 1;
    align-items: center;
  }
  .wayRg>img{
    width: 0.14rem;
    height: 0.14rem;
    margin-left: auto;
  }
  .cardList{
    position :fixed;
    width :100%;
    height :100%;
    top: 0;
    left :0;
    bottom :0;
    right :0;
    overflow: hidden;
    z-index :999;
  }
  .cardListMask{
    width: 100%;
    height: 100%;
    background :rgba(0,0,0,0.4);
  }
  .cardListCont{
    position :fixed;
    bottom :0;
    width :100%;
    background: #fff;
  }
  .cardListHead{
    height :0.5rem;
    border-bottom: 0.5px solid #dedede;
    display :flex;
    align-items :center;
    justify-content: space-between;
    padding: 0 5.3%;
  }
  .cancel{
       font-size: 0.15rem;
       color: #999999;
       letter-spacing: -0.36px;
       text-align: right;
     }
  .title{
    font-size: 0.17rem;
    color: #333333;
    text-align: left;
  }
  .cardListMain {
    width: 100%;
    max-height: 3rem;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 2.4rem;
  }
  .listCon{
    border-bottom: 0.5px solid #EAEAEA;
    padding: 0.15rem 5.3% 0.15rem 0;
    margin-left: 5.3%;
    display: flex;
    align-items: center;
  }
  .bankIcon{
    width: 0.28rem;
    margin-right: 0.1rem;
  }
  .pick{
    margin-left: auto;
    width: 0.15rem;
  }
  .bankName{
    font-size: 0.15rem;
    color: #333333;
  }
  .bankMoney{
    font-size: 0.12rem;
    color: #999999;
  }
  .money{
    color: #F63E4B;
  }
  .debit{
    padding: 0.15rem 5.3% 0.15rem 0;
    margin-left: 5.3%;
    display: flex;
    align-items: center;
  }
</style>
