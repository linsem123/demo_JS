//切换支付账号
//mainCard为主卡，传cardlist卡列表，cardtype卡类型，列表索引
<template>
<div class="change-card-container">
  <!-- 顶部 -->
  <p class="p1"></p>
   <div @click="showList" class="main">
      <div class="use">
        <div class="useone">
          <div class="pay">选择支付</div>
          <div class="usetwo"><p class="name">{{mainCard.CardName}}&nbsp;&nbsp;({{mainCard.CardNo}})</p><p v-show="mainCard.CardType=='信用卡'">可用余额<a class="a">{{mainCard.Atm}}</a>元</p></div>
        </div>
      </div>
      <div class="logo"><img  src="@/assets/images/common/to.png"/></div>
  </div>
  <p class="p2"></p>
  <!-- 列表 -->
  <div class="card-list" v-show="showCardList">
    <div class="card-list-mark" @click="hideList"></div>
    <div class="card-list-cont">
      <div class="card-list-header">
          <div class="cancel" @click="hideList">取消</div>
          <div class="title">选择支付账号</div>
          <div class="addcard" @click="addcard">添加借记卡</div>
      </div>
         <div class="card-list-item"  @click="change(index)"  v-for="(item,index) in cardList">
             <div>
                 <div >{{item.CardName}}&nbsp;&nbsp;({{item.CardNo}})</div>
                <div v-show="item.CardType=='信用卡'">可用余额<a class="a">{{item.Atm}}</a>元</div>
             </div>
             <div><img  class="card-list-choose" src="@/assets/images/common/pick.png" v-show="cindex==index"/></div>
         </div>
      </div>
    <div class="sep"></div>  
    </div>
</div>  
</template>

<script>

export default {
  name: "Wchangeuse",
  props:['cardList',"mainCard","cardIndex"],
  data(){
    return{
      showCardList: false,
      // cardList:[
      //   {CardNo:'1234',Atm:'124',CardName:'兴业银行信用卡',CardType:'信用卡'},
      //   {CardNo:'2234',Atm:'224',CardName:'兴业银行信用卡',CardType:'信用卡'},
      //   {CardNo:'3234',Atm:'324',CardName:'兴业银行信用卡',CardType:'借记卡'},
      // ],
      cindex:"0"
    }
  },
  created(){
    this.$emit("setFixed",{bl:false});
  },
  methods:{
    showList(){
      this.$emit("setFixed",{bl:true});
      this.showCardList = true
    },
    hideList(){
      this.$emit("setFixed",{bl:false});
      this.showCardList = false
    },
    change(index){
      this.cindex=index
      this.$emit("setFixed",{bl:false});
      this.CardNo = this.cardList[index].CardNo;
      this.Atm = this.cardList[index].Atm;
      this.CardName = this.cardList[index].CardName;
      this.CardType = this.cardList[index].CardType
      this.showCardList=false;
      this.$emit('change',index);
    },
    addcard(){
      this.$router.push({path: '/opendoor/AddPage'})//跳到添加借记卡页面
    }
  }
}
</script>

<style scoped >
.p1{
  height: 0.01rem;
  background:#ccc;
}
.p2{
  height: 0.1rem;
  background:#ccc;
}
.change-card-container{
  width:100vw;
  height:20vw;
  background:#fff;
}
  .main{
    width:100%;
    height:100%;
    display:flex;
    align-items:center;
  }
  .use{
      margin-left: 5.3%;
      width: 82.7%;
      line-height: 0.25rem;
      /* border: 1px  solid red; */
    }
  .useone span:nth-of-type(1){
      margin-right: 0.2rem;
      font-size: 0.20rem;
     
  }
   .useone span:nth-of-type(2){
      font-size: 0.2rem;
  }
  .useone{
     display:flex;
  }
  .useone .pay{
    font-size: 0.2rem;
  }
  .usetwo{
    /* border: 1px  solid blue; */
    margin-left: 5%;
    font-size: 0.14rem;
    width: 70%;
  }
  .a{
    color: red;
  }  
  .card-list{
     position:fixed;
    width:100vw;
    height:100vh;
    top:0;
    left:0;
    bottom:0;
    right:0;
    overflow:hidden;
    z-index:999;
  }
    .card-list-mark{
      width:100%;
      height:100%;
      background:rgba(0,0,0,0.4);
    }
      
    .card-list-cont{
      position:fixed;
      bottom:0;
      width:100vw;
      background:#fff;
    }
      .card-list-header{
        width:100%;
        height:0.5rem;
        border-bottom:0.5px solid #dedede;
        display:flex;
        align-items:center;
        justify-content: space-around
      }
        
        .cancel{
          font-size:0.16rem;
          color:#999;
        }
        .title{
          font-size:0.17rem;
          color:#333;
        }
        .addcard{
         font-size:0.16rem;
          color:blue;
        }
        .card-list-item{  /*  */
          /* border: 1px  solid red; */
          width:94%;
          height:0.6rem;
          margin-left:5.3%;
          border-bottom:0.5px solid #eaeaea;
          display:flex;
          align-items:center;
          line-height: 0.22rem;
          justify-content:space-between;
        }
          .logo img{
            width: 0.25rem;
            height: 0.25rem;
          }
          .card-list-choose{
            width:50%; 
          }
            
      .sep{
         width:100%;
        height:0.4rem;
        background:#fff;
      }
</style>
