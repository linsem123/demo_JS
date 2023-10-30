<template>
  <div class="packet" v-show="show">
    <div class="packet_row cflex" @click="getRedPacket">
      <span>手续费红包</span>
      <span :class="nocheck?'nocheck':(thisPacket=='无可用红包'?'':'red')">{{thisPacket}}</span>
      <img src="@/assets/images/arrow.png" alt="">
    </div>
    <div class="packet_pick" v-show="packetShow" @click="closePacketShow('close')"></div>
    <div class="packet_main" v-show="packetShow">
      <div class="head" @click="closePacketShow('close')">红包选择</div>
      <div class="main">
        <p :class="nocheck?'useless active':'useless'" @click="closePacketShow('nocheck')">不使用红包</p>
        <ul>
          <li v-for="(item,index) in chargeRedPacketList" :key="index">
            <div :class="(index==thisIndex&&item.flag=='1')?'info effective active clear':(item.flag=='1'?'info effective clear':'info clear')" @click="closePacketShow(index,item)">
              <div :class="item.flag=='0'?'disMoney liUseless left':'disMoney left'">
                <p><i v-show="item.valueType=='q'">￥</i>{{item.packetValue}}<i v-show="item.valueType=='z'">折</i></p>
                <p>{{item.periodDescribe}}</p>
              </div>
              <div class="disInfo left">
                <p>{{item.discountDescribe}}</p>
                <p>有效期至{{item.endDate}}</p>
              </div>
            </div>
            <div class="detail">
              <div class="detail_h" @click="moreDetail(index)">
                红包使用规则
                <span :class="(moreRule==index&&showMore)?'active':''" v-html="(moreRule==index&&showMore)?'收起':'详情'"></span>
              </div>
              <div class="detail_m" v-show="(moreRule==index&&showMore)" v-exchangeHtml:foo="redPacketRule">
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    
  </div>
</template>

<script>
import api from "@/api/commonApi.js";
import _ from "lodash";
export default {
  name: "ylRedPacket",
  props:["show","flag","text","value"],
  data(){
    return{
      // text:"无可用红包",
      // show:true,                //展示红包手续费
      thisPacket:"",  //当前描述
      tempText:"",
      packetShow:false,          //展示红包选择
      currencyType:"",          //156-人民币  840--美元
      redPacketRule:"",         //使用规则
      chargeRedPacketList:[
        // {
        //   id:"",
        //   bonusAmt:"100",
        //   discountRate:"8.5",
        //   packetValue:"",   //处理后用于展示
        //   valueType:"",     //折扣类型  z-折扣  q-钱
        //   periodDescribe:"12期手续费",
        //   discountDescribe:"账单分期12期可用账单分期1",
        //   startDate:"20123313",
        //   endDate:"20190513",
        //   flag:"1"  //1--可用  0--不可用
        // }
      ],
      showMore:false,           //展示详情
      moreRule:-1,              //规则详情的标志
      nocheck:false,            //不使用红包
      thisIndex:-1,             //当前选择的红包
    }
  },
  created(){
    this.thisPacket=this.tempText=this.text;
  },
  watch:{
    text(){
      if(this.flag==1){ //1切卡  2切换分期、费率
        this.thisPacket=this.tempText=this.text;
        this.thisIndex=-1;
        this.nocheck=false;
        this.showMore=false;
        this.moreRule=-1;
      }else if(this.flag==2){
        this.thisIndex=-1;
        this.nocheck=false;
        this.showMore=false;
        this.moreRule=-1;
        this.thisPacket = this.tempText = this.text;
      }else{
        this.thisPacket = this.text;
      }
    }
  },
  directives:{
    exchangeHtml(el,foo){
      el.innerHTML = foo.value
    }
  },
  methods:{
    getRedPacket(){
      this.$emit("choseRedPacket",{bl:false,value:0});
      api.applyRedPacketFeesList(this.value).then((res)=>{
        console.log("applyRedPacketFeesList res",res);
        if(res.success){
          let obj = res.data;
          let bl = false;
          _.forEach(obj.chargeRedPacketList,(item,index)=>{
            if((item.bonusAmt==""||item.bonusAmt==null)&&(item.discountRate!=""||item.discountRate!=null)){
              item.packetValue = item.discountRate;
              item.valueType="z";
            }else if((item.bonusAmt!=""||item.bonusAmt!=null)&&(item.discountRate==""||item.discountRate==null)){
              item.packetValue = item.bonusAmt;
              item.valueType="q";
            }
            item.endDate = item.endDate.slice(0,4)+"/"+item.endDate.slice(4,6)+"/"+item.endDate.slice(6,8);
            if(item.flag==1){
              bl=true;
            }
          });
          if(this.thisIndex==-1 && this.nocheck==false){
            if(!bl){
              this.thisPacket = this.tempText = "无可用红包";
              this.$emit("changeTest",this.thisPacket);
            }else{
              this.thisPacket = this.tempText = obj.chargeRedPacketList.length+"个红包";
            }
          }
          this.currencyType = obj.currencyType;
          this.redPacketRule = obj.redPacketRule;
          this.chargeRedPacketList = obj.chargeRedPacketList;
          this.packetShow = true;
        }else{
          let obj = {
            msg:res.msg,
            code:res.code,
            type:"报错提示",
          }
          this.$emit("choseRedPacket",{bl:false,value:obj});          
        }
      }).catch((err)=>{
        if(err.response.status){
          let obj = {
            msg:err.response.status+err.response.statusText,
            code:""+err.response.status+err.response.status,
            type:"请求报错",
          };
          this.$emit("choseRedPacket",{bl:false,value:obj});
        }else{
          let obj = {
            msg:"操作失败，请稍后再试~",
            code:"",
            type:"请求报错",
          };
          this.$emit("choseRedPacket",{bl:false,value:obj});
        }
      });
    },
    closePacketShow(index,item){
      if(index=="close"){   //点击返回
        this.packetShow=false;
      }else if(index=="nocheck"){ //点击不使用
        this.nocheck=!this.nocheck;
        if(this.nocheck){  //选中不使用
          this.thisPacket="不使用";
          this.$emit("changeTest",this.thisPacket);
          this.thisIndex=-1;
          this.$emit("choseRedPacket",{bl:true,value:"不使用"});
          this.packetShow=false;
        }else{      //取消不使用
          this.thisPacket=this.tempText;
          console.log("cancel",this.tempText);
          this.$emit("changeTest",this.thisPacket);
        }
      }else{  //选择红包
        if(item.flag=="1"){   //可用红包
          this.thisIndex = index;
          this.nocheck=false;
          if(item.valueType=="q"){
            this.thisPacket="减免"+item.bonusAmt+"元手续费";
            this.$emit("changeTest",this.thisPacket);
          }else if(item.valueType=="z"){
            this.thisPacket="打"+item.discountRate+"折";
            this.$emit("changeTest",this.thisPacket);
          }
          this.packetShow=false;
          this.$emit("choseRedPacket",{bl:true,value:item});
        }
      }
    },
    moreDetail(index){ //展示详情
      this.moreRule = index;
      this.showMore=!this.showMore;
    }
  }
}
</script>

<style scoped>
.packet_row{
  width:100%;
  padding:0.1rem 5.3%;
  box-sizing: border-box;
}
.packet_row span{
  display: inline-block;
  font-family: PingFangSC-Regular;
  font-size: 0.15rem;
  color: #333333;
  letter-spacing: -0.0044rem;
  height:0.24rem;
  line-height: 0.24rem;
}
.packet_row span:nth-child(1){
  width:35%;
}
.packet_row span:nth-child(2){
  width:60%;
  color: #999;
  letter-spacing: 0.0018px;
  text-align: right;
  vertical-align: middle;
}
.packet_row span.red{
  color:#F63E4B;
}
.packet_row span.nocheck{
  color:#000;
}
.packet_row img{
  display: inline-block;
  width:2.5%;
  height:0.14rem;
  margin-left:2.5%;
}
.left{
  float:left;
}
.right{
  float:right;
}
.packet_pick{
  position: fixed;
  left:0;top:0;
  width:100%;
  height:100%;
  background:rgba(0,0,0,0.4);
  z-index: 888;
}
.packet_main{
  position: fixed;
  left:0;
  bottom: 0;
  width:100%;
  z-index: 999;
}
.head{
  height:0.5rem;
  line-height: 0.5rem;
  text-align: center;
  font-family: PingFangSC-Regular;
  font-size: 0.17rem;
  color: #333333;
  letter-spacing: 0;
  text-align: center;
  background:#fff url("../assets/images/arrow_left.png") 5.3% center no-repeat;
  background-size:0.18rem 0.18rem;
}
.main{
  background: #F6F6F7;
  max-height: 4rem;
  overflow: scroll;
  padding:0.15rem 5.3%;
}
.main p.useless{
  font-family: PingFangSC-Medium;
  font-size: 0.15rem;
  color: #333333;
  letter-spacing: 0;
  line-height: 0.21rem;
  background: url("../assets/images/useless.png") 96% center no-repeat;
  background-size:0.16rem 0.16rem; 
}
.main p.useless.active{
  background: url("../assets/images/checked.png") 96% center no-repeat;
  background-size:0.16rem 0.16rem; 
}
.main ul li{
  margin-top:0.1rem;
  position: relative;
}
/* .main ul li>.liUseless{
  position: absolute;
  left:0;top:0;
  width:100%;
  height: 100%;
  background: #FFFFFF;
  opacity: 0.3;
  z-index: 999;
} */
.main ul li .info{
  padding:0.15rem 0.1rem;
  border-bottom:0.005rem solid #eee;
}
.main ul li .info{background:#fff;}
.main ul li .info.effective{
  background: #fff url("../assets/images/useless.png") 96% center no-repeat;
  background-size:0.16rem 0.16rem; 
}
.main ul li .info.effective.active{
  background: #fff url("../assets/images/checked.png") 96% center no-repeat;
  background-size:0.16rem 0.16rem; 
}
.disMoney{
  width:28%;
  overflow: hidden;
  text-align: center;
}
.disMoney p:nth-child(1){
  font-family: PingFangSC-Semibold;
  font-size: 0.24rem;
  line-height: 0.37rem;
  color: #FF3B30;
  letter-spacing: 0;
  font-weight: 700;
}
.disMoney p:nth-child(1) i{
  font-size: 0.12rem;
}
.disMoney p:nth-child(2){
  font-family: PingFangSC-Regular;
  font-size: 0.11rem;
  color: #FF3B30;
  letter-spacing: 0;
  line-height: 0.16rem;
}
.disMoney.liUseless p{
  color:#999;
}
.disInfo{
  width:68%;
}
.disInfo p:nth-child(1){
  font-family: PingFangSC-Medium;
  font-size: 0.16rem;
  color: #333333;
  letter-spacing: 0;
  line-height: 0.24rem;
}
.disInfo p:nth-child(2){
  font-family: PingFangSC-Regular;
  font-size: 0.12rem;
  color: #999999;
  letter-spacing: 0;
  line-height: 0.16rem;
  margin-top:0.1rem;
}
.detail{
  background: #fff;
  /* background: rgba(225,233,255,0.23); */
}
.detail .detail_h{
  font-family: PingFangSC-Regular;
  font-size: 0.12rem;
  color: #666666;
  letter-spacing: 0;
  line-height: 0.3rem;
  padding:0 0.12rem;
}
.detail .detail_h span{
  float:right;
  width:15%;
  font-family: PingFangSC-Regular;
  font-size: 0.12rem;
  color: #0060F1;
  letter-spacing: 0;
  line-height: 0.3rem;
  background: url("../assets/images/dropdown.png") right center no-repeat;
  background-size:0.15rem 0.08rem; 
}
.detail .detail_h span.active{
  background: url("../assets/images/dropup.png") right center no-repeat;
  background-size:0.15rem 0.08rem; 
}
.detail .detail_m{
  font-family: PingFangSC-Regular;
  font-size: 0.1rem;
  color: #666666;
  letter-spacing: 0;
  line-height: 0.14rem;
  padding:0 0.12rem 0.1rem;
}
</style>
