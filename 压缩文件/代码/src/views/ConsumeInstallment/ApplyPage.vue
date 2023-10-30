<template>
    <div class="contain">
      <!--<YlChangeCard :mainCard="home.mainCard"></YlChangeCard>-->
      <div class="change-card-container">
        <div class="main">
          <img class="logo" src="@/assets/images/common/logo.png">
          <div class="name">{{home.mainCard.cardNo}}</div>
          <!--<img class="down" src="@/assets/images/common/dropdown.png">-->
        </div>
      </div>
      <div class="gray"></div>
      <div class="all">
        <div class="lfs">申请分期金额</div>
        <div class="rgs"><span v-if="home.image">￥</span><span v-else>$</span>{{money.payTotle}}</div>
      </div>
      <div class="way">
        <WJpayment :mainPay="apply.mainWay" :List="apply.payWay" @change="changeWay"></WJpayment>
      </div>
      <div class="line"></div>
      <!--<BpayType></BpayType>-->
      <div class="way">
        <Wrate :mainpay="apply.mainNper" :frateList="apply.nperList" :n="apply.n" :showPeriod="apply.showPeriod" @ratechange="changeRate"></Wrate>
      </div>
      <div class="line"></div>
      <!--引入红包组件-->
      <div class="way">
        <yl-red-packet :flag="redBag.flag" :show="redBag.show" :text="redBag.text" :value="baseData" @changeTest="changeTest" @choseRedPacket="choseRedPacket"></yl-red-packet>
      </div>
      <div class="line" v-show="redBag.show"></div>
      <!--分期or一次性显示切换-->
      <div v-if="apply.tab == 0">
        <div class="fenqi">
          <div class="fenqi1">每期应还</div>
          <div class="fenqi2">

            <!--<span class="free" v-show="money.showSale">首期手续费最高可减免{{money.saleFee}}元</span>-->
            <span class="freeMoney" v-show="money.showEach">&nbsp;<span v-if="home.image">￥</span><span v-else>$</span><span>{{money.prePayEvery}}</span>&nbsp;</span>
            <span v-if="home.image">￥</span><span v-else>$</span><span>{{money.payEvery}}</span>
          </div>
        </div>
        <div class="fenqibox">
          <div class="fenqibox1">
            <div> 每期本金</div>
            <div><span v-if="home.image">￥</span><span v-else>$</span><span>{{money.everyBase}}</span></div>
          </div>
          <div class="fenqibox2">
            <div>每期手续费</div>
            <div>
              <span class="freeMoney small" v-show="money.showEachTwo">&nbsp;<span v-if="home.image">￥</span><span v-else>$</span><span>{{money.preEveryInterest}}</span>&nbsp;</span>
              <span v-if="home.image">￥</span><span v-else>$</span><span>{{money.everyInterest}}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
         <div class="oneLayout">
           <div class="fenqi1">每期应还金额</div>
           <div class="fenqi2">
             <span v-if="home.image">￥</span><span v-else>$</span><span>{{money.oneBase}}</span>
           </div>
         </div>
         <div class="oneLayout">
          <div class="fenqi1">一次性手续费</div>
           <div class="fenqi2">
             <span class="freeMoney" v-show="money.showOnce">&nbsp;<span v-if="home.image">￥</span><span v-else>$</span><span>{{money.preOneInterest}}</span>&nbsp;</span>
             <span v-if="home.image">￥</span><span v-else>$</span><span>{{money.oneInterest}}</span>
           </div>
         </div>
      </div>
      <!--end-->
      <div class="rules" @click="readRule">点击阅读<span><a class="blue" href="https://mobile.cib.com.cn/creditcard/stage/other/xffq_xz.html">《消费分期业务条款与细则》</a></span></div>
      <ylBtn text="同意条款细则并办理" bgcolor="" btnBgcolor="#5084FF" margin="" @confirmbtn="toApply"></ylBtn>
      <div class="prompt" @click="showPrompt">温馨提示</div>
      <div class="layer" v-show="apply.warm"></div>
      <div class="remind" v-show="apply.warm">
        <p>温馨提示</p >
        <div class="remind-txt">
          消费分期付款业务是本行信用卡中心为符合条件的主卡持卡人提供的,对其当期已记账但未出账单的消费交易提供的分期付款服务。您可选择按照3、6、12、18、24、36期将当期已记账但未出账单的消费交易金额按照持卡人申请的期数分期均额偿还。
          详细的手续费收取标准及业务细则参见
          <a class="blue" href="https://mobile.cib.com.cn/creditcard/stage/other/xffq_xz.html">《消费分期付款业务条款及细则》</a>。
        </div>
        <div class="remind-blank"></div>
        <span class="remind-confirm" @click="closePrompt">知道了</span>
      </div>
      <YVersion top="5%" :version="version"></YVersion>
      <YErrorAlert  :msg="alert.msg" :err="alert.err" :show="alert.show" @confirm="closeAlert"></YErrorAlert>
      <BapplyFail :show="errAlert.show" :msg="errAlert.msg" :err="errAlert.err" title="分期办理失败" btnTxt="确定" @apllayFailBtn="closeAlert"></BapplyFail>
    </div>
</template>

<script>
  import YlChangeCard from "../../components/ylChangeCard";
  import {mapGetters, mapState} from 'vuex';
  import YVersion from "../../components/YVersion";
  import Wrate from "../../components/Wrate";
  import ylBtn from "../../components/ylBtn";
  import BpayType from "../../components/BpayType";
  import YErrorAlert from "../../components/YErrorAlert";
  import BapplyFail from "../../components/BapplyFail";
  import WJpayment from "../../components/WJpayment";
  import YlRedPacket from "../../components/ylRedPacket";
  import {initsa,track,saAlert,getCookie} from "@/assets/js/common.js"
  export default {
        name: "ApplyPage",
      data(){
        return{

        }
      },
      components:{
        YlRedPacket,
        WJpayment,
        BpayType,
        YVersion,
        // YlChangeCard,
        Wrate,
        ylBtn,
        YErrorAlert,
        BapplyFail
      },
      created(){
        initsa("消费分期申请页");

       console.log("传过来的值",JSON.parse(this.$route.query.value));
       let val = JSON.parse(this.$route.query.value) ;
        this.home.mainCard.cardNo = val.card.cardNo;
        this.home.image = val.image;
        this.money.payTotle = val.consumeList.amount;
        this.apply.fenqiRmb = val.list.fenqiRmb;
        this.apply.fenqiDollar = val.list.fenqiDollar;
        this.apply.oneRmb = val.list.oneRmb;
        this.apply.oneDollar = val.list.oneDollar;
        this.home.currencyType = val.currencyType;   // 后面请求后台传参使用
        this.apply.redBagNum = val.redBagNum;    // 后面点击分期方式和费率恢复初始值用
        // redBagNum
        if(val.redBagNum == '0'){
          this.redBag.show = false;
        }else{
          this.redBag.show = true;
        }
        this.redBag.text = val.redBagNum+"个红包";
        //默认为分期支付
        this.apply.mainWay = this.apply.payWay[0];
        this.apply.tab = 0;
        //默认初始打折项全部隐藏(退后一页再进入)
        this.money.showEach = false;    // 打折每期应还始隐藏
        this.money.showEachTwo = false;    // 每期手续费初始隐藏
        this.money.showOnce = false ;       //优惠前一次性手续费初始隐藏
        // this.apply.mainWay.key = this.apply.payWay[0].key;
        //首次进入根据币种给nperList赋值（默认分期）
        if(this.home.image){
          //true为人民币
          this.apply.nperList = this.apply.fenqiRmb;
        }else{
          this.apply.nperList = this.apply.fenqiDollar;
        }
        //费率默认18期
        this.apply.mainNper = this.apply.nperList[3];
        this.apply.n = 3;
        console.log("设置首次自定义默认期数",this.apply.mainNper);
        //首次进入页面试算(默认分期、18期)
        this.getFenqi();

        console.log("分期支付每月本金",this.money.everyBase);
        console.log("分期支付每月利息",this.money.everyInterest);

      },
      computed:{
        ...mapState({
          home : state => state.co.home,
          version : state => state.co.version,
          apply : state => state.co.apply,
          money: state => state.co.apply.money,
          baseData:state => state.co.baseData,
          alert : state => state.co.alert,
          errAlert : state => state.co.errAlert,
          redBag : state => state.co.apply.redBag
        })
      },
      methods:{
        closeAlert(){
          let obj = {
            show: false,
            msg:'',
            err:''
          };
          this.$store.commit("co/SET_ALERT", obj);
          let objTwo = {
            show: false,
            msg:'',
            err:''
          };
          this.$store.commit("co/SET_ERRALERT", objTwo);
        },
        readRule(){
          track("xffq_rule","消费分期业务条款与细则");
        },
        showPrompt(){
          this.apply.warm = true;
        },
        closePrompt(){
          this.apply.warm = false;
        },
        changeWay(index){
          // console.log("0为分期1为一次性",index);
          this.apply.mainWay = this.apply.payWay[index];
          this.apply.tab = index;    //切换支付方式显示区
          if(this.home.image){
            //true为人民币
            if(index == 0){
              this.apply.showPeriod = true;
              this.apply.nperList = this.apply.fenqiRmb;
              this.apply.mainNper = this.apply.nperList[this.apply.n];
              this.getFenqi();
              console.log("选后的期数和费率",this.apply.mainNper.period,this.apply.mainNper.rate);
            }else{
              this.apply.showPeriod = false;
              this.apply.nperList = this.apply.oneRmb;
              this.apply.mainNper = this.apply.nperList[this.apply.n];
              this.getOne();
              console.log("选后的期数和费率",this.apply.mainNper.period,this.apply.mainNper.rate);
            }
          }else{
            //美元
            if(index == 0){
              this.apply.showPeriod = true;
              this.apply.nperList = this.apply.fenqiDollar;
              this.apply.mainNper = this.apply.nperList[this.apply.n];
              console.log("选后的期数和费率",this.apply.mainNper.period,this.apply.mainNper.rate);
              this.getFenqi();
            }else{
              this.apply.showPeriod = false;
              this.apply.nperList = this.apply.oneDollar;
              this.apply.mainNper = this.apply.nperList[this.apply.n];
              console.log("选后的期数和费率",this.apply.mainNper.period,this.apply.mainNper.rate);
              this.getOne();
            }
          }
          console.log("更换支付方式后的费率",this.apply.mainNper);
          this.firstVal();
          this.redBag.text = this.apply.redBagNum+"个红包";
          this.redBag.flag = 2;
        },
        //使用红包后操作分期方式和费率方式一切恢复初始值
        firstVal(){
          this.money.showEach = false;
          this.money.showEachTwo = false;
          this.money.showOnce = false;
          this.money.showSale = false;
        },
        changeRate(index){
          this.apply.n=index;
          this.apply.mainNper = this.apply.nperList[index];
          let period =this.apply.mainNper.period;
          track('xffq_changeRate','消费分期期数',"",period);
          console.log("选中的分期项",this.apply.mainNper);
          if(this.home.image){          //true为人民币
            if(this.apply.tab == 0){    //tab=0(分期支付)
              this.getFenqi();
            }else{
              this.getOne();
            }
          }else{
            //美元
            if(this.apply.tab == 0){
              this.getFenqi();
            }else{
              this.getOne();
            }
          }
          this.firstVal();
          this.redBag.text = this.apply.redBagNum+"个红包";
          this.redBag.flag = 2;
        },
        toApply(){
          let open = getCookie('openId');   // 获取openId
          track("xffq_toApply","消费分期点击同意并申请按钮",open);
          // console.log('红包id',this.apply.redId);
          // console.log("传过来的值",JSON.parse(this.$route.query.value));
          let val = JSON.parse(this.$route.query.value) ;
          // console.log("-=--=-=-=");
          let obj = {
            cardKey:val.card.cardKey,
            payType:this.apply.mainWay.key,                 // 01-一次性 02-分期支付
            period:this.apply.mainNper.period,                 //期数
            currencyType:val.currencyType,                    //币种
            valDate:val.consumeList.valDate,                  //入账日期
            purDate:val.consumeList.purDate,                 //记录日期
            putTime:val.consumeList.putTime,                 //消费时间
            tranNo:val.consumeList.tranNo,                  //交易流水号
            tradeType:val.consumeList.tradeType,            //交易类型
            amount:val.consumeList.amount,                 //金额
            redId:this.apply.redId                 //红包id
          };
          this.$store.commit('co/SETBASEDATA',obj);
          this.$store.dispatch('co/applyConsume',{data:this.baseData,router:this.$router});

        },
        //分期支付试算规则  每期本金=可申请金额/对应期数；每期手续费=可申请金额*对应期数的费率；每期应还=本金+手续费；
        //一次性试算规则    每期应还本金=可申请金额/对应期数；一次性手续费=可申请金额*对应期数的费率；
        //计算--每期本金
        countBase(sum,period){
          return(Number((Number(sum)/Number(period)).toFixed(2)));
        },
        //计算--每期手续费
        countInterest(sum,rate){
          return(Number((Number(sum)*Number(rate)).toFixed(2)));
        },
        //分期赋值
        getFenqi(){
          this.money.everyBase = this.countBase(this.money.payTotle,this.apply.mainNper.period);
          this.money.everyInterest = this.countInterest(this.money.payTotle,this.apply.mainNper.rate);
          this.money.payEvery = (this.money.everyBase+this.money.everyInterest).toFixed(2);
        },
        //一次性赋值
        getOne(){
          this.money.oneBase = this.countBase(this.money.payTotle,this.apply.mainNper.period);
          this.money.oneInterest = this.countInterest(this.money.payTotle,this.apply.mainNper.rate);
        },
        changeTest(test){
          this.redBag.text = test;
        },
        //红包列表
        choseRedPacket(obj){
          if(obj.bl == false && obj.value == 0){
            this.redBag.flag = '';
            let obj = {
              currencyType: this.home.currencyType,                  //156-人民币，840-美元
              busiType:'01',                              // 01—消费分期，02-账单分期
              smppamt:this.money.payTotle,                       //申请金额
              periods:this.apply.mainNper.period,                        //分期期数
              payType:this.apply.mainWay.key,                     //支付方式(01-一次性支付02-分期支付)
              rateType:'01',                      //01-消费分期，02-账单分期
            };
            this.$store.commit('co/SETBASEDATA',obj);
           // console.log('baseData',this.baseData)
            // commit value  请求红包
          }else if(obj.bl == false){
            //请求失败，展示弹框
            this.$store.commit('co/SET_ALERT', {show: true, msg: obj.value.msg, err: obj.value.code});
            saAlert("消费分期红包","红包列表",obj.value.msg,obj.value.type);
          }else if(obj.bl){
            if(obj.value=="不使用"){
              this.firstVal();
              this.$store.commit('co/SET_ID',"");   // 红包id为""
              if(this.apply.mainWay.key == '02'){  //分期支付
                this.getFenqi();
              }else{
                this.getOne();
              }
              return
            }
            //点击选中红包请求试算数据
            let val = {
              smppamt: this.money.payTotle,             //申请金额
              periods: this.apply.mainNper.period,                //分期期数
              rate: this.apply.mainNper.rate,                //费率
              payType: this.apply.mainWay.key,               //支付方式(01-一次性支付02-分期支付)
              discountRate:'',       //费率折扣
              bonusAmt:''           //折扣金额
            };
            if(obj.value.valueType == 'z'){
              val.discountRate = obj.value.discountRate
            }else{
              val.bonusAmt = obj.value.bonusAmt
            }
            this.$store.commit('co/SET_ID',obj.value.id);   // 获取红包id
            this.$store.commit('co/SETBASEDATA',val);
            this.$store.dispatch('co/countRedPacket',{data:this.baseData,pass:obj})
          }
          console.log("red packet bl",obj.bl);
          console.log("red packet",obj.value);
        }
      },
    }
</script>

<style scoped>
  /*显示卡*/
  .change-card-container{
    width: 100vw;
    height: 12vw;
    background: #fff;
  }
  .main{
    width :100%;
    height :100%;
    display :flex;
    align-items :center;
  }
  .logo{
    margin-left :5.3%;
    height :40%;
    width :7.5%;
  }

  .name{
    font-size :0.16rem;
    font-weight :bold;
    margin-left: 3.5%;
    width :74.7%;
  }

  .down{
    width :3.5%;
    height: 15.6%;
  }
  /*end*/
  .gray{
    background-color:#F3F5F9;
    height: 0.1rem;
  }
  .all{
    margin-left:0.2rem;
    padding:.08rem 0.2rem 0.07rem 0;
    border-bottom: 1px solid #E0E4ED;
    line-height: 0.36rem;
    display: flex;
    justify-content: space-between;
  }
  .lfs{
    font-size: 0.15rem;
    color: #333;
  }
  .rgs{
    font-size: 0.25rem;
  }
  .way{
    padding: 0.04rem 0;
  }
  .line{
    height: 1px;
    background-color:#E0E4ED;
    margin-left: 0.2rem;
  }
  /*每期应还*/
  .fenqi{
    display: flex;
    justify-content: space-between;
    padding-top:0.15rem;
    margin-left:0.2rem;
    margin-right: 0.4rem;
    font-size: 0.15rem;
  }
  .fenqi1{
    color:#333;
  }
  .fenqi2{
    color: #000;
    letter-spacing: 0.18px;
  }
  .fenqibox{
    height:0.66rem;
    background: url("../../assets/images/consumeInstallment/bg.png") no-repeat;
    background-size: 100% 100%;
    padding-top: 0.22rem;
    margin:0 0.2rem;
    color: #666666;
    font-size: 0.1rem;
    box-sizing: border-box;
  }
  .fenqibox1 {
    margin: 0 0.2rem;
    display: flex;
    justify-content: space-between;
  }
  .fenqibox2 {
    display: flex;
    justify-content: space-between;
    margin: 0.05rem 0.2rem 0 0.2rem;
  }
  .free{
    font-size: 0.1rem;
    color: #F93939;
    letter-spacing: 0;
    text-align: center;
    line-height: 0.17rem;
    /*opacity: 0.4;*/
    background: #FEC5C5;
    border-radius: 1px;
    padding: 0 0.04rem;
    margin-right: 0.05rem;
  }
  .freeMoney{
    font-size: .12rem;
    color: #7E7E7E;
    letter-spacing: 0.14px;
    text-align: right;
    text-decoration:line-through;
    margin-right: 0.05rem;
  }
  .small{
    font-size: 0.1rem;
  }
  /*end*/
  /*一次性支付*/
  .oneLayout{
    border-bottom: 1px solid #E0E4ED;
    padding: 0.15rem 0.4rem 0.15rem 0;
    margin-left: 0.2rem;
    font-size: 0.15rem;
    display: flex;
    justify-content: space-between;
  }
  /*end*/
  .rules{
    margin: 0.32rem 0 0.16rem 0.2rem;
    color: #666;
    font-size: 0.12rem;
  }
  .blue{
    color:#0060F1;
  }
  .prompt{
    font-size: 0.12rem;
    color: #0060F1;
    margin-top: 0.16rem;
    text-align: center;
  }
  /*温馨提示弹框*/
  .layer{width: 100%;height: 100%;z-index: 100;position: fixed;top: 0;left: 0;display: block;background: #000;opacity: 0.4;}
  .remind{position:absolute;width:2.71rem;background:#FFF;z-index:666;border-radius: 0.1rem;top: 22%;left: 50%;
    margin-left: -1.355rem}
  .remind p{margin:0.19rem 0 0.13rem;font-size: 0.16rem;line-height: 0.22rem;text-align: center;}
  .remind-txt{font-size: 0.14rem;line-height: 0.2rem;height: 2.0rem;overflow: scroll;padding:0 0.24rem;box-sizing:
    border-box;color:#666;margin-bottom: 0.24rem;}
  .remind-blank{height: 0.01rem;background: #EAEAEA;}
  .remind-confirm{font-size: 0.16rem;color: #0060F1;letter-spacing: -0.0038rem;text-align: center;
    padding: 0.12rem 0;display: block;}
  /*end*/
</style>
