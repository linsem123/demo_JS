<template>
  <div class="header">
    <div class="remind-info">请持卡人绑定本人银行卡</div>
    <div class="user-info">
      <div class="info-cell clear">
        <div class="info-left">
          <label for="owncard">持卡人</label>
        </div>
        <div class="info-middle">
          <span>{{name}}</span>
        </div>
      </div>
      <div class="info-blank"></div>
      <div class="info-cell clear">
        <div class="info-left">
          <label for="cardnumber">卡号</label>
        </div>
        <div class="info-middle">
          <input type="tel" ref="ipt" placeholder="请输入您的卡号" pattern="[0-9]*" id="cardnumber" v-model="formData.add_cardNo" @input="renew" @blur="checkCard">
        </div>
        <div class="info-right" v-show="deleteShow">
          <img src="@/assets/images/delete.png" alt="" class="info-delete" @click="deleteCardNo">
        </div>
      </div>
      <div class="info-blank"></div>
      <div class="info-cell clear">
        <div class="info-left">
          <label for="owncard">发卡行</label>
        </div>
        <div class="info-middle" @click="selectBank">
          <input type="text" placeholder="请选择发卡银行" readonly="readonly" id="bank" v-model="formData.add_debitName">
        </div>
        <div class="info-right" @click="selectBank">
          <img src="@/assets/images/arrow.png" alt="" class="info-arrow">
        </div>
      </div>
    </div>
    <div class="info-last">
      <span class="complete" :class="{active:formData.isActive}" @click="complete">完成</span>
    </div>
    <YVersion top="0.4rem" :version="version"></YVersion>
  </div>
</template>

<script>
  // 引入所需的方法、组件
  import {mapActions,mapState} from "vuex";
  import {initsa,track,saAlert} from "@/assets/js/common.js"; //听云监听
  import api from "@/api/api.js";  //调用接口
  import YVersion from "./YVersion"
  export default {
    name: 'addcard', //添加银行卡
    props:["name","version","formData","title"],
    data () {
      return { //绑定数据
        deleteShow:"",
        cardInfo:{}
      }
    },
    components:{YVersion},
    computed:mapState({}),
    created(){
      initsa(this.title+"借记卡"); //初始化监听
    },
    methods:{
      // 输入卡号
      renew(){
        this.formData.add_cardNo = this.formData.add_cardNo.replace(/\s/g,"").replace(/(\d{4})(?=\d)/g,"$1 ");
        if(this.formData.add_cardNo!=""){
          this.formData.add_cardNo=this.formData.add_cardNo.length>24?this.formData.add_cardNo.slice(0,24):this.formData.add_cardNo;
          this.deleteShow = true;
        }
        if(this.formData.add_debitName!=""){
          // this.formData.isActive = true;
        }else{
          // this.formData.isActive = false;
        }
        var cardNum = this.formData.add_cardNo.replace(/\s/g,"");
        if(cardNum.length == 10){
          this.$store.dispatch("updateDebitName",{
            cardNum:cardNum
          });
        } 
      },
      checkCard(){ //卡号校验
        var cardNum = this.formData.add_cardNo.replace(/\s/g,"");
        if(this.formData.add_cardNo==""){
          $.alert("卡号不能为空","提示");
          this.formData.isActive=false;
        }else if(!/\d{16,20}/.test(cardNum)){
          $.alert("输入卡号格式不正确(16-20位数字)","提示");
          this.formData.isActive=false;
        }else if(this.formData.add_debitName=="兴业银行" && cardNum.length>18){
          $.alert("本行卡号仅限16-18位数字","提示");
          this.formData.isActive=false;
        }else if(this.formData.add_debitName!=""){
          this.formData.isActive=true;
        }
      },
      deleteCardNo(){   //清空卡号
        this.formData.add_cardNo = "";
        this.deleteShow = false;
      },
      selectBank(){     //选择银行
        this.$emit("search")
      },
      complete(){      //新增
        if(this.formData.isActive){
          var cardNum = this.formData.add_cardNo.replace(/\s/g,"");
          this.$store.dispatch('addDebitCardCon',{data:{
            bankNO:cardNum,
            userName:this.name,
            bankBin:this.formData.add_bankBin,
            cardNo:this.formData.identNum   //身份证
          },router:this.$router,title:this.title});
          track("addDebitCardCon",this.title+"借记卡新增按钮");
        }
      }
    },
  }
</script>

<style scoped>
.header{background:#F3F5F9;height:100%;}
.remind-info{height: 0.35rem;color:#666;font-size: 0.14rem;line-height: 0.35rem;margin-left: 0.2rem;}
.user-info{background: #FFF;padding:0 5.3%;box-sizing: border-box;overflow: hidden;}
.info-blank{height: 0.01rem;background: #EAEAEA;width: 150%;}
.info-cell{height: 0.55rem;font-size: 0.15rem;line-height: 0.55rem;}
.info-left{width: 0.45rem;margin-right: 0.45rem;float: left;}
.info-middle{display: inline-block;}
.info-middle input{border: none;width: 2.1rem;font-size: 0.15rem;height: 0.24rem;line-height: 0.24rem;}
.info-right{float:right;}
.info-delete{width: 0.16rem;}
.info-arrow{ width: 0.071rem;}
.info-last{padding:0 0.2rem;box-sizing: border-box;}
.complete{display: block;background: #CCD0DB;border-radius: 0.22rem;height: 0.45rem;line-height: 0.45rem;font-size: 0.16rem;
color: #E8EBF1;text-align: center;margin-top: 0.4rem;}
.active{background: #5084FF;color:#FFF;}
#copyright{font-size:0.12rem;text-align: center;color:#666;margin-top: 0.4rem;}
</style>
