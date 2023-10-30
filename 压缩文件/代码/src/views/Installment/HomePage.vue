<template>
<!-- <div v-bind:class="ui.show==true?'box':'container'"> -->
 <div :class="fixed ? 'bgFixed contain':'contain'" >
    <ylChangeCard  :cardList="homepage.cardList"  :mainCard="homepage.mainCard" :cardIndex="homepage.index"  @change="changeCard" @setFixed="setFixed"></ylChangeCard>
    <div v-if="homepage.flag==0">
        <div class="gonggao" v-show="gonggao"><img src="../../assets/images/installment/gonggao.png"><span>优惠公告通告</span></div>
        <div class="p"></div>
        <!-- 申请金额 -->
        <div class="card" >
            <div class="card1">
              <div  class="spanfrist" >申请分期金额</div>
              <div class="div"><span :class="btn.curency==true?'ne':'en'" class="card1span" v-show="btn.btnshow"><a @click="btncurency"></a></span></div>
            </div>
            <p class="err1"> <span  class="err"  v-show='err'>{{msg}}</span></p>
            <div class="card2">
                  <i  v-if="this.btn.curency">¥</i><i v-else>$</i>
                  <input  class="input" @click="check()" @blur="no()" v-model="homepage.smppamt" @input="passmax" v-focus="focusState" placeholder="请输入申请金额"
                  type="tel" pattern="[0-9]."  />
                  <span class="check" @click="focusclick"><img  src="../../assets/images/installment/check.png" alt="" v-if="logo1" /><img  @click="del()"  src="../../assets/images/installment/xx.png"  alt="" v-if=' logo2' /></span>
            </div>
            <div class="card3">
                  <span>分期后本月剩余应还&nbsp;<i v-if="this.btn.curency">¥</i> <i v-else>$</i></span>
                  <span>{{homepage.repayment}}</span>
            </div>
      </div>
      <!-- 支付方式，还款基数-->
        <div class="bigbox">
            <div class="way">
                  <Wpayment :mainpay="apply.mainpost" :List="apply.List" v-on:paychange="paychange" :payindex="this.apply.in"></Wpayment>      
            </div>
            <div class="line"></div>
            <div class="way">
                  <Wrate :showPeriod="homepage.showPeriod" :mainpay='homepage.mainpay' :n="apply.int" :indexpay="homepage.indexpay" :frateList="homepage.frateList" v-on:ratechange="ratechange"></Wrate>
            </div> 
             <div class="line"></div>
        </div>
        <!-- 红包 -->
        <div class="way">
          <ylRedPacket :flag="redbag.flag" :show="redbag.show" :text="redbag.text" :value="baseData" @changeTest="changeTest" @choseRedPacket="choseRedPacket"></ylRedPacket>    
        </div> 
        <div class="line" v-show="redbag.show"></div>
        <!--  一次性支付页面-->
        <div  v-if="apply.tab == 1">
                  <div class="fenqi">
                      <div class="fenqi1" >每期应还本金</div>
                      <div class="fenqi2"><i v-if="this.btn.curency">¥</i> <i v-else>$</i><span>{{homepage.poundagebj}}</span></div>
                  </div>
                <div class="fenqi" >
                  <div class="fenqi1" >一次性手续费</div>
                    <div class="fenqi2">
                       <a v-show="redbag.yone" class="underline"><span v-if="this.btn.curency">￥</span><span  v-else>$</span><span >{{homepage.discountOneCharge}}</span></a>
                      <span  class="ii"><i v-if="this.btn.curency">¥</i> <i v-else>$</i></span><span>{{homepage.poundage}}</span>
                    </div>
                </div>
        </div>
          <!-- 分期支付页面 -->
      <div v-if="apply.tab == 0">
        <div class="fenqi">
          <div class="fenqi1">每期应还</div>
          <div class="fenqi2">
              <!-- <a  v-show="redbag.fone" class="underlinered"><span class="free">首期手续费最高可减免{{homepage.saleFee}}元</span></a> -->
              <a v-show="redbag.ftwo"  class="underline"><span v-if="this.btn.curency">￥</span><span  v-else>$</span><span >{{homepage.discountAmt}}</span></a>
              <span v-if="this.btn.curency">￥</span><span v-else>$</span><span>{{homepage.instalAmt}}</span>
         </div>
        </div>

        <div class="fenqibox">
          <div class="fenqibox1">
            <div> 每期本金</div>
            <div><span v-if="this.btn.curency">￥</span><span v-else>$</span><span>{{homepage.eachMoney}}</span></div>
          </div>
         <div class="fenqibox2">
          <div>每期手续费</div>
            <div>
              <!-- 加标签每期手续费 -->
               <a v-show="redbag.fone" class="underline"><span v-if="this.btn.curency">￥</span><span  v-else>$</span><span >{{homepage.discountCharge}}</span></a>
                <!-- 加标签每期手续费 -->
               <a v-show="redbag.fthree" class="underline"><span v-if="this.btn.curency">￥</span><span  v-else>$</span><span >{{homepage.discountCharge}}</span></a>
              <span v-if="this.btn.curency">￥</span><span v-else>$</span><span>{{homepage.eachCharge}}</span>
            </div>
          </div>
       </div>

      </div>   
          <!-- <Wmax :show="alert.show" :msg="alert.msg" :err="alert.err" v-on:tan="tan" ></Wmax> -->
          <!-- <WxlrrorAlert :show="maxalert.show" :msg="maxalert.msg" :err="maxalert.err" v-on:alert="unalert" ></WxlrrorAlert> -->
          <div class="agreen"><span><a href="#" class="a" ></a>点击阅读<a href="https://mobile.cib.com.cn/creditcard/stage/other/zhangdfq_xz.html" @click="bylaw" >《账单分期付款业务条款及细则》</a></span></div>
        
          <YFunctionBtn :text="handlebtn.text" :dis="handlebtn.dis" v-on:checktable="definite"></YFunctionBtn>
        
          <div class="wenxin"  @click="title">温馨提示</div>
        <!-- 温馨 -->
        <div class="layer"  v-show="apply.warm"></div>
      <div class="remind"  v-show="apply.warm">
        <p>温馨提示</p >
        <div class="remind-txt">
          账单分期付款业务是本行信用卡中心为符合条件的主卡持卡人提供的,对其已出账单提供的分期付款服务。您可选择按照3、6、12、18、24、36期将已出账单的消费交易金额未还部分的一定比例分期均额偿还,详细的手续费收取标准及业务细则请参见<span v-html="message"></span>。
        </div>
        <div class="remind-blank"></div>
        <span class="remind-confirm" @click="closePrompt" >知道了</span>
      </div>
     <!-- 温馨 -->
     <!-- 跳消费弹框提示 -->
  <div  class="err-view" v-show="this.alert.show">
    <div class="dialog">
        <div class="dialog-content">
            <div class="dialog-message">{{alert.msg}}
                <!-- <div class="dialog-error" v-show="this.alert.err.length > 0 && this.alert.err">ERR：{{this.alert.err}}</div> -->
            </div>
        </div>
        <div class="dialog-footer">
            <span @click="firm">确定</span>
        </div>
    </div>
   <div class="dialog-overlay"></div>
  </div>
     <!-- 跳消费弹框提示 -->
      <BapplyFail :show="applyfail.show" :msg="applyfail.msg" :title="applyfail.title" :err="applyfail.err"  v-on:apllayFailBtn="apllayFailBtn"></BapplyFail>
    </div>
    
    <div v-else>
      <FailPage></FailPage>
    </div>

   <YVersion top='5%' :version="version"></YVersion>
   <YErrorAlert :msg="erroralert.msg" :err="erroralert.err" :show="erroralert.show"  @confirm="closeAlert"></YErrorAlert>
</div>
</template>
<script>
import api from "../../api/billInstallment.js";
import FailPage from './FailPage';
import {mapActions,mapState,mapGetters} from "vuex";
import ylChangeCard from "@/components/ylChangeCard.vue";
import Wpayment from "@/components/Wpayment.vue";
import Wrate from "@/components/Wrate.vue";
// import Wmax from "@/components/Wmax.vue";
// import WxlrrorAlert from "@/components/WxlrrorAlert.vue";
// import Walert from "@/components/Walert.vue";
import YFunctionBtn from "@/components/YFunctionBtn.vue";
import YVersion from "@/components/YVersion.vue";
// 所有报错弹框
import YErrorAlert from "@/components/YErrorAlert.vue";
import BapplyFail from "@/components/BapplyFail.vue";
import ylRedPacket from "@/components/ylRedPacket.vue";
import {initsa,track,saAlert,getCookie} from "@/assets/js/common.js"; //听云监听
export default {
  name:"HomePage",
  components:{
   ylChangeCard,Wpayment,Wrate,YFunctionBtn,YVersion,FailPage,YErrorAlert,
   BapplyFail,ylRedPacket},
  data(){
    return{
      bl:true,
      message:'<a href="https://mobile.cib.com.cn/creditcard/stage/other/zhangdfq_xz.html" style="color:#0060F1">《账单分期付款业务条款及细则》</a> ',
      bag:false,    //优惠前初始
      msg:"",       //定义提示信息
      flag:false,
      // home:"",
      gonggao:false,
      focusState: false,
      logo1:true,
      logo2:false,
      test:"",
      err:false,
      id:"",
    
    }
  },
    watch:{
      'homepage.smppamt':{
        handler(newVal,oldVal){
            if(newVal==""){
                this.msg = "申请金额不能为空";
                this.err=true;
            }else if(!/^\d{0,8}\.{0,1}(\d{1,2})?$/.test(newVal)){
                this.msg= "申请金额最多为两位小数，请重新输入";
                this.err=true;
                this.handlebtn.dis=false;
            }else if(Number(newVal) < Number(100)){
               this.msg = "申请金额不得低于100元";
               this.err=true;                  //打开提示信息
               this.handlebtn.dis=false        //关闭办理按钮
            }
            else if(Number(newVal) > Number(this.homepage.maxNum)){
                this.homepage.repayment=this.homepage.returnAmt-this.homepage.maxNum
                this.homepage.repayment=this.$flt(this.homepage.repayment)
                this.homepage.smppamt=this.homepage.maxNum;
                this.maxalert.msg='您输入的金额大于本次账单分期最高可申请金额，以为您更改至最高可申请金额'
                this.$store.commit('zd/SET_ERRORAJERT',{show: true, msg: this.maxalert.msg, err: ''})
                // this.maxalert.show = true;
                // this.alert.msg='金额不能大于'+`${this.homepage.maxNum}`
                this.failremind = "";
            }else if(Number(newVal) >= Number(100) && Number(newVal) <= Number(this.homepage.maxNum)){
                this.msg=""
                this.err=false
                this.handlebtn.dis=true;
            }
        }
      }
    },
  methods:{
    // 直接跳消费时
    firm(){
      track("zdfq_tryshow","账单分期跳消费分期")
      this.alert.show=false;
      // flag=2时
      if(this.alert.show==false){
      // window.location.href = "https://test.xliane.com/evercos/main/myhtml/cardPage/fins_index_%23_consume_HomePage.html"
       window.location.href = "https://ccshop.cib.com.cn:8010/evercos/main/myhtml/cardPage/fins_index_%23_consume_HomePage.html"
      }
    },
    // 滚动穿透
    setFixed(bl){
        console.log("----",bl);
        this.$store.commit("zd/SET_BGFIXED",{fixed:bl.bl});
      },
    changeTest(val){
      this.homepage.redbag.text = val;
    },
    // 红包
    choseRedPacket(obj){ //{bl:true,value:{}}
         this.payType() 
        if(obj.bl==false && obj.value==0){  
          this.homepage.redbag.flag = "";
          let val = {    //定义参数对象
           currencyType:this.homepage.currencyType,                        //156-人民币  840--美元
           busiType:"02",                                                  //01--消费分期  02--账单分期
           smppamt:this.homepage.smppamt,                                   //申请金额
           periods:this.homepage.frateList[this.apply.int].period,          //分期数
           payType:this.homepage.payType,                                  //支付方式 01--一次性支付  02--分期
           rateType:"02"                                                    //费率01--消费分期  02--账单分期
          };
          this.$store.commit('zd/SETBASEDATA',val);                          //发出请求  传obj
        }else if(obj.bl==false){
         saAlert("账单分期红包","红包列表",obj.value.msg,obj.value.type)
         this.$store.commit('SET_ERRORAJERT', {show: true, msg: obj.value.msg, err: obj.value.code});
        }else if(obj.bl){
          console.log('obj.value.id',obj)
          if(obj.value=="不使用"){
            this.homepage.redbag.id='' ;     //点击不使用时，让红包id置空
            this.$store.dispatch('zd/fail', this.apply.int)  
            this.redmark()  //调用是否显示优惠前标志公共函数
            this.redbag.fone=false;
            this.redbag.ftwo=false;
            this.redbag.fthree=false;
            this.redbag.yone=false
            //计算剩余应还
            return
          }
                //返回红包数据  请求试算接口
          let tab = {
            smppamt:this.homepage.smppamt,
            periods:this.homepage.frateList[this.apply.int].period, 
            rate:this.homepage.frateList[this.apply.int].rate,
            payType:this.homepage.payType,
            discountRate:"",
            bonusAmt:"",
          };
          if(obj.value.valueType=="z"){  //折扣
            tab.discountRate=obj.value.discountRate;
          }else if(obj.value.valueType=="q"){
            tab.bonusAmt=obj.value.bonusAmt;
          }
            this.$store.commit('zd/SET_ID',obj.value.id);   // 获取红包id 
            this.$store.commit('zd/SETBASEDATA',tab);  
            this.$store.dispatch('zd/set_jsredbag',{data:this.baseData,val:obj})  
          }  
  },
    apllayFailBtn(){
      this.applyfail.show=false
    },
    closePrompt(){
      this.apply.warm=false;
    },
    // 账单分期细则埋点
    bylaw(){
       track("zdfq_bylaw","点击账单分期付款业务条款及细则")
    },
  unalert(test){
    this.maxalert.show=test
  },
    //处理给后台payType 01  02 公共函数
   payType(){
        if(this.apply.in=='0'){
           this.homepage.payType='02'
         }else{
           this.homepage.payType='01'
         }
    },
    definite(){
          this.payType()
        //  console.log("hongbaoid",this.redbag.id);
        let obj = {    //定义参数对象
          id:this.redbag.id,       //红包id
          payType: this.homepage.payType,
          periods:this.homepage.frateList[this.apply.int].period,
          cardType:this.homepage.mainCard.cardType,
          cardKey:this.homepage.mainCard.cardKey,
          smppamt:this.homepage.smppamt,
          currencyType:this.homepage.currencyType
        };
          this.$store.commit('zd/SETBASEDATA',obj);           //发出请求  传obj
          console.log(this.handlebtn.dis)
         if(this.handlebtn.dis){
           let open = getCookie('openId');   // 获取openId
            track("zdfq_apply","账单分期申请",open)
            this.$store.dispatch('zd/set_definite',{data:this.baseData,router:this.$router})
            console.log(this.baseData)
         }
    },
    title(){
          this.apply.warm=true;
    },
    closeAlert(){
          this.erroralert.show=false
    },
    changeCard(index){
          this.apply.in=0 
          track("zdfq_changecard","账单分期切卡按钮")
          //  this.paychange(0)
          const {homepage} = this;
        //判断卡类型  切卡的时候就判断卡
        if(this.homepage.cardList[index].cardType== "L"){           //L单 I双
            this.btn.btnshow = false;
          }else if(this.homepage.cardList[index].cardType== "I") {
            this.btn.btnshow = true;
          }       
        let obj = {    //定义参数对象
          payType:'02',
          period:'12',
          // cardType:this.homepage.mainCard.cardType,
          // cardKey:this.homepage.mainCard.cardKey,
           cardType:this.homepage.cardList[index].cardType,
          cardKey:this.homepage.cardList[index].cardKey
          };
          console.log('主卡号',obj.cardKey)
          console.log('期数',obj.period)
          console.log('币种',this.homepage.mainCard.cardType)
          this.$store.commit('zd/SETBASEDATA',obj);           //发出请求  传obj
          let baseData=this.baseData
          this.$store.dispatch('zd/set_cardchangedata',{index,baseData})
           // 默认初始红包个数
    },
    ratechange(index){
         let period = this.homepage.frateList[index].period
         track("zdfq_ratechange","账单分期切换期数","",period)
          this.apply.int = index    //把每期索引值，赋值给this.apply.int
          this.$store.dispatch('zd/fail', this.apply.int)  
           // 默认初始红包个数
          this.homepage.redbag.text=`${this.homepage.hongbao}个红包`;
          this.homepage.redbag.flag = "2";
           this.redmark()  //调用是否显示优惠前标志公共函数
    },
    paychange(index){
          const {homepage}  = this
          this.apply.in = index;  //为0是分期  为1是一次性
          this.apply.mainpost = this.apply.List[index]; //默认为分期，点一次性为一次性  分期为分期 
          this.apply.tab=index   
          this.public()   //调用公共函数
          this.$store.dispatch('zd/fail', this.apply.int)
        // 处理 156红包栏位
         console.log(this.homepage.hongbao)
         this.homepage.redbag.text=`${this.homepage.hongbao}个红包`;   ///红包初始化
         this.homepage.redbag.flag = "2";
          this.redmark()  //调用是否显示优惠前标志公共函数
        //  this.homepage.redbag.flag=1;  切换卡片
  },
    // 塞值 分期支付与一次性支付 及币种切换 费率表的公共函数
    public(){
      console.log(this.apply.in)
       console.log(this.btn.curency)
      if(this.btn.curency){
           console.log("进来")
            //true为人民币
          if(this.apply.in == 0){  //0为分期
          this.homepage.frateList = this.homepage.fenrmb;
          }else{
          this.homepage.frateList = this.homepage.yirmb;
            }
          }else{
            //美元
           if(this.apply.in == 0){   //索引1为一次性
          this.homepage.frateList = this.homepage.fendollar;
          }else{
          this.homepage.frateList = this.homepage.yidollar;
            }
          }
    },
    focusclick () {
          this.focusState = true 
          this.logo1=!this.logo1
          this.logo2=!this.logo2
    },
    check(){
          const {homepage} = this
          this.logo1=!this.logo1
          this.logo2=!this.logo2
    },
    passmax(e){
      // 申请低于100时--分期应还的数据
          let money = this.homepage.smppamt
          track("zdfq_passmax","账单分期首页输入申请金额时","",money)
          let smppamt=this.$tab(e.target.value);
       if(this.homepage.smppamt<=this.homepage.maxNum){ 
          this.homepage.repayment= Number(this.homepage.returnAmt)-Number(this.homepage.smppamt)  
          this.homepage.repayment=this.$flt(this.homepage.repayment)
          this.$store.commit('zd/GETCOUNT',smppamt)
       }
      //当可申请金额大于100并小于可申请最大值时，触发这个请求，并计算费率表
      if(this.homepage.smppamt>=100  ){
          let maxNum=this.homepage.maxNum
          this.homepage.maxNum=Number(maxNum)
          if(smppamt<=this.homepage.maxNum){
          this.$store.dispatch('zd/fail', this.apply.int)       
        }
      }
      // 默认初始红包个数
       this.homepage.redbag.flag='2'
       this.homepage.redbag.text=`${this.homepage.hongbao}个红包`;
        this.redbag.fone=false;
       this.redbag.ftwo=false;
       this.redbag.fthree=false;
       this.redbag.yone=false
  //处理可申请金额小于100与大于最大值时的计算
     if(this.apply.List[this.apply.in].payName=='分期支付'){
          if(smppamt<100){
          this.homepage.eachMoney= 100/(this.homepage.frateList[this.apply.int].period)
          this.homepage.eachMoney=this.$flt(this.homepage.eachMoney)
          this.homepage.eachCharge=100*(this.homepage.frateList[this.apply.int].rate)
          this.instalAmt=(this.homepage.eachCharge)+(this.homepage.eachMoney)
          }else if(smppamt>=this.homepage.maxNum){
          this.homepage.eachMoney = (this.homepage.maxNum)/(this.homepage.frateList[this.apply.int].period)
          this.homepage.eachMoney=this.$flt(this.homepage.eachMoney)
          this.homepage.eachCharge=(this.homepage.maxNum)*(this.homepage.frateList[this.apply.int].rate)
          this.homepage.eachCharge=this.$flt(this.homepage.eachCharge)
          this.instalAmt=(this.homepage.eachCharge)+(this.homepage.eachMoney)
        }
     }else if(this.apply.List[this.apply.in].payName=='一次性支付'){
          if(smppamt<100){
          this.homepage.poundagebj=100/(this.homepage.frateList[this.apply.int].period)
          this.homepage.poundagebj=this.$flt(this.homepage.poundagebj)
          this.homepage.poundage=100*(this.homepage.frateList[this.apply.int].rate)
          this.homepage.poundage=this.$flt(this.homepage.poundage)
          }else if(smppamt>=this.homepage.maxNum){
          this.homepage.poundagebj=(this.homepage.maxNum)/(this.homepage.frateList[this.apply.int].period)
          this.homepage.poundagebj=this.$flt(this.homepage.poundagebj)
          this.homepage.poundage=(this.homepage.maxNum)*(this.homepage.frateList[this.apply.int].rate)
          this.homepage.poundage = Number(this.homepage.poundage.toFixed(2))
          }
        }
    },
    no(){
         let money=this.homepage.smppamt
         track("zdfq_fours","账单分期首页输入金额后失焦时","",money)
        const {homepage}  = this
        this.focusState = false
        this.logo1=true; //编辑按钮
        this.logo2=false;//清除按钮
  },
    btncurency(){
        // this.apply.in=0
        track("zdfq_btncurency","账单分期切换币种")
        // this.$store.commit('zd/btncurency')       //控制币种
        let currencyType = currencyType;
        if(this.homepage.currencyType=='156'){
          currencyType='840'
        }else{
          currencyType='156'
        }
        console.log("传给后台",currencyType);
        let obj = {
          cardType:this.homepage.mainCard.cardType,
          cardKey:this.homepage.mainCard.cardKey,
           currencyType:currencyType
          };
          // this.homepage.frateList[this.apply.int].period
          this.$store.commit('zd/SETBASEDATA',obj);           //发出请求  传obj
          this.$store.dispatch('zd/set_btndollar',this.baseData)  //请求切换币种接口
          this.public()   //调用公共函数
          this.redmark()  //调用是否显示优惠前标志公共函数
    },
    del(){
       this.homepage.smppamt="";
       this.handlebtn.dis=false;        //关闭办理按钮
      //  this.alert.show=false;
    },
    // 控制优惠前标示公共函数
    redmark(){
       this.redbag.fone=false;
       this.redbag.ftwo=false;
       this.redbag.fthree=false;
       this.redbag.yone=false
    },
  },
   directives: {
    focus: {
      update: function (el, {value}) {    //第二个参数传进来的是个json  
        if (value) {                      //if(true)就聚集
          el.focus()
        }
      }
    }
  },
  computed:{
    ...mapState({
        ui:state => state.zd.ui,
        homepage:state=>state.zd.homepage,// 申请金额
        btn:state=>state.zd.btn,
        rateList:state=>state.zd.rateList,
        erroralert:state=>state.zd.erroralert,
        walert:state=>state.zd.walert,
        handlebtn:state=>state.zd.handlebtn,
        apply:state=>state.zd.apply,
        baseData:state => state.zd.baseData,
        applyfail:state => state.zd.applyfail,
        version:state => state.zd.version,
        redbag:state=> state.zd.homepage.redbag ,
        handlebtn:state=>state.zd.handlebtn,
        alert:state=>state.zd.alert,
        fixed:state=>state.zd.fixed,
        maxalert:state=>state.zd.maxalert
      }),
  } ,
   created(){
         initsa("新版账单分期首页");
         let open = getCookie('openId');   // 获取openId
         track("zdfq_getOpenId","账单分期首页获取openid",open)
        //全局过滤
         this.homepage.poundagebj=this.$tab(this.homepage.poundagebj)
         this.homepage.poundage=this.$tab(this.homepage.poundage)
         this.homepage.smppamt=this.$tab(this.homepage.smppamt)
         this.homepage.eachMoney=this.$tab(this.homepage.eachMoney)
         this.homepage.eachCharge=this.$tab(this.homepage.eachCharge)
         this.homepage.repayment=this.$tab(this.homepage.repayment)
         this.homepage.instalAmt=this.$tab(this.homepage.instalAmt)
         this.homepage.maxNum=this.$tab(this.homepage.maxNum)
         
         this.homepage.poundagebj=this.$flt(this.homepage.poundagebj)
         this.homepage.poundage=this.$flt(this.homepage.poundage)
         this.homepage.smppamt=this.$flt(this.homepage.smppamt)
         this.homepage.eachMoney=this.$flt(this.homepage.eachMoney)
         this.homepage.eachCharge=this.$flt(this.homepage.eachCharge)
         this.homepage.repayment=this.$flt(this.homepage.repayment)
         this.homepage.instalAmt=this.$flt(this.homepage.instalAmt)
         this.homepage.maxNum=this.$flt(this.homepage.maxNum)
         this.apply.mainpost=this.apply.List[0]               //默认显示标题支付方式  为分期支付
         this.apply.in=0
         this.redmark()  //调用是否显示优惠前标志公共函数
        
      let obj = {
     //放首页接口 后台需要的字段
      };
      this.$store.commit('zd/SETBASEDATA',obj);                   //调用SETBASEDATA请求把参数传过去
      this.$store.dispatch('zd/set_homepagedata',this.baseData)   //请求首页接口 传总参数
      if(this.homepage.mark=='1'){                                //进来走flag=1时控制按钮
        this.homepage.index=0
      }
    },
}
</script>
<style scoped>
.bgFixed{
    position :fixed;
    overflow :hidden;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0
  }
.err-view{
   background:#fff;
  user-select:none;  
 }
 .dialog{
  position:fixed;
    top:40%;
    left:50%;
    width:70%;
    transition:0.2s;
    overflow:hidden;
    font-size:0.16rem;
    border-radius:8px;
    background:#fff;
    transform:translate3d(-50%,-50%,0);
    z-index:9999 ;
 }
 .dialog-content{
     padding:0px;
     margin:0px;
     border-bottom:1px solid #eaeaea;
 }
 .dialog-message{
      padding:20px;
      line-height:150%;
      text-align:center;
      max-height:40vh;

 }
 .dialog-error{
   line-height:150%;
    text-align:center;
    color:rgba(0,0,0,0.4);
    font-size:0.12rem;
 }
 .dialog-footer{
       color:#0060F1;
 }
 .dialog-footer span{
        display:inline-block;
        text-align:center;
        width:100%;
        font-size:0.17rem;
        line-height:280%;
 }
 .dialog-overlay{
    position:fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background:rgba(0,0,0,0.4);
    z-index:9998;
 }

 .input::-webkit-input-placeholder{
            color:#ffffff;
            font-size: 0.2rem;
            opacity: 0.5;
            font-family: PingFangSC-Regular;
   }
 .input::-moz-placeholder{   /* Mozilla Firefox 19+ */
           color:#ffffff;
            font-size: 0.2rem;
            opacity: 0.5;
            font-family: PingFangSC-Regular;
   }
.input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
          color:#ffffff;
            font-size: 0.2rem;
            opacity: 0.5;
            font-family: PingFangSC-Regular;
  }
.input:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
           color:#ffffff;
            font-size: 0.2rem;
            opacity: 0.5;
            font-family: PingFangSC-Regular;
  }
.free{
    font-size: 0.1rem;
    color: #F93939;
    letter-spacing: 0;
    text-align: center;
    line-height: 0.17rem;
    background: #FEC5C5;
    border-radius: 1px;
    padding: 0 0.04rem;
    margin-right: 0.05rem;
  }
.check{
  display: block;
  float: right;
}
.way{
  padding: 0.03rem 0;
}
.line{
  height: 1px;
  background-color: #E0E4ED;
  margin-left: 5.3%;
}
.err{
  font-size:0.08rem;
  color: #000;
  margin-left:5.3%;
}
.van{
  width: 100%;
  height: 2rem;
  background: #fff;
}
.van span{
margin-left: 1.5rem;
}
.van1{
  display: flex;
  justify-content: space-between;
  width:100%;
 
}
.van1  span:nth-child(1){
  
  display: block;
  margin-left: 0.1rem;
  width: 2rem;
}
.van1  span:nth-child(2){
  display: block;
  margin-right: 0.1rem;
  width: 2rem;
}

.contain{
  overflow-x: hidden;
}
.box{
  overflow: hidden;
  position:fixed;
  height: 100%;
  width: 100%;
}
.en{
background: url('../../assets/images/installment/copya.png');
 background-size: 100%;
}
.ne{
  background: url('../../assets/images/installment/copyb.png') no-repeat;
 background-size: 100%;
}
 .gonggao img{
   width: 0.18rem;
   height: 0.28rem;
   margin-left: 5.3%;
   margin-right: 0.2rem;
 }
 .changecard{
    padding-top:0.15rem;
    margin-left:5.3%;
 }
 .changecard img{
   width: 0.28rem;
   height: 0.18rem;
 }
 .changecard span{
   font-family:PingFangSC-Medium;
   color: #000;
   margin-left: 0.13rem;
   font-size: 0.16rem;
   margin-right: 1.6rem;
 }
 .changecard .down {
   width: 0.13rem;
   height: 0.13rem;
 }
.p{
  height: 0.1rem;
  background: #F3F5F9;
}
.card{
  margin: 0.16rem 5.3% 0.02rem;
  background: linear-gradient(-180deg, #5E80FF 0%, #426AFF 100%);
  border-radius: .1rem;
  height: 1.26rem;
}
.card1{
  overflow: hidden;
  padding-top: 0.03rem;
  display: flex;
  justify-content: space-between;
  margin:0 0.2rem;
  padding: 0.1rem 0 0;
}
.spanfrist{
  font-family: PingFangSC-Regular;
  font-size: 0.14rem;
  color:#fff;
}
.card1span {
  float:right;
  display: block;
  width: 0.94rem;
  height: 0.22rem;
  line-height: 0.22rem;
  overflow: hidden;
}
.div{
  width: 1.2rem;
}
.card1span a {
  float: left;
 display: block;
 height: 0.22rem;
 width: 0.96rem;
}
.card2{
  padding-bottom: 0.04rem;
  margin-right: 5.3%;
  border-bottom:1px  solid #ccc; 
}
.card2 span img:nth-child(1){
  width: 0.14rem;
  height: 0.14rem;
}
.card2{
  margin-left: 5.3%;
  margin-top: 2.2%;
  font-size: 0.20rem;
  color: #fff;
  font-family: PingFangSC-Medium;
  margin-bottom: 0.1rem;
}
.card2 i{
  font-weight: bold;
}
.card2 input{
margin-left: 0.005rem;
outline: none;
background: none;
border: none;
width: 2.5rem;
}
.card2{
  margin-top: 0.1rem;
}
.card3{
 margin-left: 5.3%
}
.card3 span{
font-size: 0.12rem;
font-family: PingFangSC-Regular;
color: #fff;
margin-left: 0.01rem;
margin-bottom: 0.08rem;
}
.card3input{
  outline: none;
  border: none;
  background: none;
  font-family: PingFangSC-Medium;
  color: #fff;
  font-size: 0.12rem;
}

.fenqi{
  display: flex;
  justify-content: space-between;
  height: 0.36rem;
  line-height: 0.45rem;
}
.fenqi1{
  margin-left: 5.3%;
  color:#333;
  font-family: PingFangSC-Regular;
  font-size: 0.15rem;
  }
.fenqi2{
  padding-right: 0.1rem;
  margin-right: 7%;
  font-family: PingFangSC-Regular;
  color: #000000;
  font-size: 0.15rem;
  text-align: right;
 
  }
.ii{
  font-family: PingFangSC-Regular;
  font-size: 0.12rem;
}
.fenqi2 .ii1{
  font-family: PingFangSC-Regular;
  color:#999;
  font-size: 0.12rem;
  text-decoration: line-through;
}
.fenqi2 img{
  width: 0.14rem;
  height: 0.14rem;
}
.fenqitan{
  width: 100%;
  height: 1rem;
  background: pink;
}
.agreen {
  margin-left: 5.3%;
  margin-top:0.2rem;
}
.agreen a{
  color: #0060F1;
  font-family: PingFangSCRegular;
  font-size: 0.12rem;
}
.agreen span a:nth-child(1){
  margin: 20% ;
}
.agreen .img2{
  width: 0.16rem;
  height: 0.16rem;
}
.list{
  padding-top: 0.2rem;
  height: 5.17rem;
  width: 100%;
  position: absolute;
  top: 1.5rem;
  bottom: 0;
  background: #fff;
  opacity: 1;
}
.list p{
  margin-left: 5.3%;
  margin-right: 5.3%;
  margin-top: 0.2rem;
  font-size: 0.13rem;
  color: #666;
  font-family: PingFangSC-Regular;
}
 .p1 span{
   margin-right: 0.8rem;
   color: #5084FF ;
   font-size: 0.16rem;
   font-family: PingFangSC-Medium;
 }
 .wenxin{
   text-align: center;
   font-size: 0.12rem;
   color: #0060F1;
   font-family: PingFangSCRegular;
   margin-top: 0.15rem;
 }
 .banben{
   text-align: center;
   font-size: 0.12rem;
   font-family: PingFangSC-Regular;
   color: #c2c2c2;
   margin-top: 0.1rem;
 }
 .err1{
   height: 0.15rem;
   width: 2.7rem;
   margin-left: 1.5%;
 }
 .err1 span{
   color: #FF3B30;
   font-size: 0.10rem;
  
 }
 
  .fenqibox{
    height:0.66rem;
     background: url("../../assets/images/installment/shisuan.png")no-repeat;
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
 .underline{
   color: #ccc;
   font-size: 10px;
   text-decoration: line-through;
 }
 .underlinered{
   color: red;
 }
 .bigbox{
   width: 100%;
   height: 100px;
   border: 0.01rem  solid #fff;
 }
 /* 温馨 */
 .layer{width: 100%;height: 100%;z-index: 100;position: fixed;top: 0;left: 0;display: block;background: #000;opacity: 0.4;}
  .remind{position:absolute;width:2.71rem;background:#FFF;z-index:666;border-radius: 0.1rem;top: 22%;left: 50%;
    margin-left: -1.355rem}
  .remind p{margin:0.19rem 0 0.13rem;font-size: 0.16rem;line-height: 0.22rem;text-align: center;}
  .remind-txt{font-size: 0.14rem;line-height: 0.2rem;height: 1.8rem;overflow: scroll;padding:0 0.24rem;box-sizing:
    border-box;color:#666;margin-bottom: 0.24rem;}
  .remind-blank{height: 0.01rem;background: #EAEAEA;}
  .remind-confirm{font-size: 0.16rem;color: #0060F1;letter-spacing: -0.0038rem;text-align: center;
    padding: 0.12rem 0;display: block;}
</style>