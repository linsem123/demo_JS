<template>
  <div class="main" :class="{'bg-fixed': creditstatu||reminderstatu||debitstatu||failstatu||applystatu||deletestatu||imagestatu}">
    <div class="container">
      <div class="title" @click="selectcreditCard">
        <img src="@/assets/images/logo.png" alt="" class="logo">
        <span class="creditcardNum">{{hdata.creditcardNum.fakeCardNo}}</span>
        <img src="@/assets/images/dropdown.png" alt="" class="down">
      </div>
      <div class="blank"></div>
      <div class="banner">
        <div class="banner-title">申请金额</div>
        <div class="banner-top">{{failremind}}</div>
        <div class="banner-middle">
          <span class="sign-one">￥</span>
          <input type="tel" pattern="[0-9]" maxlength="6" id="applyNum" placeholder="请输入申请金额" v-model="hdata.applyNum" @input="passMax" @blur="checkNum" @focus="setNum" ref="applyNum">
          <img src="@/assets/images/del.png" alt="" @click="Delete" v-show="delShow">
          <img src="@/assets/images/modify.png" alt="" @click="Modify" v-show="modShow">
        </div>
        <div class="banner-line"></div>
        <div class="banner-bottom">
          <span class="banner-txt">最高可借</span><span class="sign-two">￥</span><span class="maxNum">{{hdata.maxNum}}</span><span class="banner-content_one">该额度不占用您的固定额度</span>
        </div>
      </div>
      <div class="content_one">
        <div class="input-cell" @click="chosepay" >
          <div class="cell-left"><label for="paytype">手续费支付方式</label></div>
          <div class="cell-middle">
            <input type="text" id="paytype" v-model="hdata.paytype" readonly="readonly" data-focus="payfocus" @focus="paytypeSelect" ref="paytype"/>
          </div>
          <div class="cell-right">
            <img src="@/assets/images/arrow.png" alt="">
          </div>
        </div>
        <div class="input-cell" @click="chosestage">
          <div class="cell-left"><label for="stage">申请金额分期期数</label></div>
          <div class="cell-middle">
            <input type="text" id="stage" v-model="hdata.stage" readonly="readonly" data-focus="payfocus"  @focus="stageSelect" ref="stage" />
          </div>
          <div class="cell-right">
            <img src="@/assets/images/arrow.png" alt="">
          </div>
        </div>
        <div class="repay-part" v-show="ui.repaypart">
          <div class="left">
            <p class="title_one">每期应还</p>
            <p class="slh">
              <span class="s1">每期本金</span>
            </p>
            <p class="slh">
              <span class="s2">每期手续费</span>
            </p>
            <p class="title_one r1" v-show="ui.other">跨行转账另收</p>
          </div>
          <div class="center">
            <p class="title_two" v-show="ui.discount">￥{{hdata.disepayPart}}</p>
            <p class="zhe" v-show="ui.discount">￥{{hdata.disemoneyPart}}</p>
            <p class="zhe" v-show="ui.discount">￥{{hdata.disechargePart}}</p>
          </div>
          <div class="right">
            <p class="title_three">￥{{hdata.epayPart}}</p>
            <p class="nozhe">￥{{hdata.emoneyPart}}</p>
            <p class="nozhe">￥{{hdata.echargePart}}</p>
            <p class="title_three r2" v-show="ui.other">￥20.00</p>
          </div>
        </div>
        <div class="repay-all" v-show="ui.repayall">
          <div class="epay clear">
            <div>每期应还本金</div>
            <div class="clear">
              <p>
                ￥<span class="epayAll">{{hdata.epayAll}}</span>
              </p>
            </div>
          </div>
          <div class="emoney clear">
            <div>一次性手续费</div>
            <div class="clear">
              <p>￥<span class="emoneyAll">{{hdata.emoneyAll}}</span></p>
              <p v-show="ui.discount">￥<span class="disemoneyAll">{{hdata.disemoneyAll}}</span></p>
            </div>
          </div>
          <div class="extra clear" v-show="ui.other">
            <div>跨行转账另收</div>
            <div>
              ￥<span class="extraAll">20.00</span>
            </div>
          </div>
        </div>
        <div class="input-cell clear" v-show="ui.nocard" @click="toAdd">
          <div class="cell-left"><label for="addAmount">收款账户</label></div>
          <div class="cell-middle">
            <input type="text" id='addAmount' readonly="readonly" placeholder="添加借记卡" />
          </div>
          <div class="cell-right">
            <img src="@/assets/images/arrow.png" alt="">
          </div>
        </div>
        <div class="input-cell clear te2" v-show="ui.hascard">
          <div class="cell-left"><label for="amount">收款账户</label></div>
          <div class="cell-middle">
            <input type="text"  id='bankName' v-model="hdata.bankName" readonly="readonly" @click="selectdebitCard" ref="bankName" />
          </div>
          <div class="cell-right">
            <img src="@/assets/images/arrow.png" alt="">
          </div>
        </div>
        <div class="input-cell clear" v-show="ui.hascard">
          <div class="cell-middle te">
            <input type="text" id='bankNum' v-model="hdata.bankNum" readonly="readonly" @click="selectdebitCard" ref="bankNum"/>
          </div>        
        </div>
        <div class="input-cell clear" @click="chosefunduse">
          <div class="cell-left"><label for="funduse">资金用途</label></div>
          <div class="cell-middle">
            <input type="text" id="funduse" v-model="hdata.funduse" readonly="readonly" @focus="funduseSelect" ref="funduse" />
          </div>
          <div class="cell-right">
            <img src="@/assets/images/arrow.png" alt="">
          </div>
        </div>
      </div>
      <div class="blank"></div>
      <IdentCode @geticode="geticodeVal"></IdentCode>
      <div class="blank2"></div>
      <div class="identTxt">短信验证码将发送至您信用卡在我行预留的手机号</div>
    </div>
    <div class="footer">
      <div class="rule clear">
        <div class="quan" @click="changecheck_not" v-show="hdata.imgshow_one">
          <img src="@/assets/images/unchecked.png" alt="" class="check"  >
        </div>
        <div class="quan" @click="changecheck_is" v-show="hdata.imgshow_two">
          <img src="@/assets/images/checked.png" alt="" class="check" >
        </div>
        <div class="rule-txt">我承诺不会将现金分期获得的资金用于投资和生产经营（包括但不限于购房、股票、期货及其他股本权益性投资），仅用于消费。同意并接受<a href="https://mobile.cib.com.cn/creditcard/stage/other/xjfq_xz.html">《现金分期付款业务条款与细则》</a></div>
      </div>
      <div class="submit" data-click="ui.subClick" @click="submit" :class="ui.subShow?'active2':''">提交</div>
      <div class="kind-remind" @click="Remind">温馨提示</div>
      <p id="copyright">&copy;本服务由兴业银行信用卡中心提供&nbsp;v{{hdata.copyright}}</p>
    </div>
    <CreditSelect @getcreditcard="getcreditcardNum" v-show="creditstatu"></CreditSelect>
    <DebitSelect @getdebitcard="getdebitcardNum" v-show="debitstatu" @changedebit="changedebitList"></DebitSelect>
    <ImageCode v-if="imagestatu"></ImageCode>
    <div class="layer" v-show="laystatu"></div>
    <div class="remind" v-show="reminderstatu">
      <p>温馨提示</p>
      <div class="remind-txt">
        1.本业务限人民币币种，您可申请支取的现金金额在本人信用卡兴享贷可用额度范围内，您每次申请的金额最低为人民币1000元，最高为人民币30万元。<br/><br/>
        2.您成功办理兴享贷现金分期业务而支取的现金款项由本行划入您个人名下的国内银行人民币储蓄结算账户（该账户不得为证券客户结算资金第三方存管关联、融资融券等储蓄账户），该款项不得用于投资仅限用于消费。您必须保留现金款项的相关消费凭证，本行拥有随时调阅消费凭证的权利。<br/><br/>
        3.您申请的兴享贷现金分期业务一经成功办理，不可随意撤销，不可对分期期数进行更改。<br/><br/>
        4.无论手续费一次性支付或分期支付，您办理的现金分期未还本金和手续费均会占用您的可用额度。<br/><br/>
      </div>
      <div class="remind-blank"></div>
      <span class="remind-confirm" @click="rconfirm">我知道了</span>
    </div>
    <div class="fail" v-show="failstatu">
      <div class="fail-top">
        <img src="@/assets/images/fail.png" alt="">
      </div>
      <div class="fail-title">申请失败</div>
      <div class="fail-txt">{{hdata.failmsg}}</div>
      <div>{{hdata.failcode}}</div>
      <div id="confirm" @click="fConfirm">确定</div>
    </div>
    <div class="deb-remind" v-show="deletestatu">
      <p>确认删除该张借记卡吗？</p>
      <div class="btn">
        <span id="btn-cancel" class="btn2" @click="btnCancel">取消</span><span id="btn-confirm" @click="btnConfirm">确定</span>
      </div>
    </div>
    <div class="pass-money" v-show="applystatu">
      <p>您输入的金额大于兴享贷最高可申请金额，已为您更改至最高可申请金额</p>
      <div class="pass-blank"></div>
      <span id="pass-confirm" @click="passConfirm">确定</span>
    </div>
    <BcountDown :timeShow="hdata.timeShow" :countTime="hdata.countTime" @closeTime="closeTime"></BcountDown>
  </div>
</template>

<script>
  // 引入所需的方法、组件
  import CreditSelect from '@/components/CreditSelect.vue';
  import DebitSelect from '@/components/DebitSelect.vue';
  import IdentCode from '@/components/IdentCode.vue';
  import ImageCode from '@/components/ImageCode.vue';
  import BcountDown from '@/components/BcountDown.vue';
  import {mapActions,mapState} from "vuex";
  import {initsa,track,saAlert} from "@/assets/js/common.js"; //听云监听

  export default {
    name: 'HomePage', //兴享贷首页
    data () {
      return { //绑定数据
        failremind:"",
        num:"",
        kaNum:"",
        payfocus:true,
        icode:"",
        delShow:"",
        modShow:true
      }
    },
    computed:mapState({
      laystatu:state => state.a.home.menu.laystatu,
      creditstatu:state => state.a.home.menu.creditstatu,
      debitstatu:state => state.a.home.menu.debitstatu,
      applystatu:state => state.a.home.menu.applystatu,
      reminderstatu:state => state.a.home.menu.reminderstatu,
      deletestatu:state => state.a.home.menu.deletestatu,
      imagestatu:state => state.a.home.menu.imagestatu,
      failstatu:state => state.a.home.menu.failstatu,
      hdata:(state) => state.a.home.hdata,
      ui:(state) => state.a.home.ui,
      pdata:state => state.a.public.pdata,
      pui:state => state.a.public.ui
    }),
    created(){
      this.initHome(); //初始化首页
      initsa("兴享贷首页"); //初始化监听
    },
    methods:{
      // 关闭倒计时
      closeTime(){
        this.$store.commit('BCHANGETIMESTATUS',false);
        this.$router.push({path:'/Enjoyloan/FailPage'});
      },
      initHome(){
        this.$store.dispatch("setInitHome",{
          hdata:this.hdata,
          router:this.$router
        })
      },
      // 输入金额focus
      setNum(){
        this.delShow = true;
        this.modShow = false;
      }, 
      // 输入超过金额
      passMax(){
        if(this.hdata.bankName=="" || this.hdata.bankName=="兴业银行"){
          if(this.hdata.applyNum==""){
            this.failremind = "申请金额不能为空";
          }else if(!/^[0-9]+$/.test(this.hdata.applyNum)){
            this.failremind = "申请金额格式不正确，请重新输入";
          }else if(this.hdata.applyNum < 1000){
            this.failremind = "申请金额不得低于1000";
          }else if(Number(this.hdata.applyNum) > Number(this.hdata.maxNum)){
            this.$store.dispatch("showapply",{
              laystatu:this.laystatu,
              applystatu:this.applystatu
            });
            this.hdata.applyNum = this.hdata.maxNum;
            this.failremind = "";
          }else if(this.hdata.applyNum >= 1000 && Number(this.hdata.applyNum) <= Number(this.hdata.maxNum)){
            this.$store.dispatch("changeapply",{
              creditcardNum:this.hdata.creditcardNum,
              applyNum:this.hdata.applyNum,
              paytype:this.hdata.paytype,
              stage:this.hdata.stage
            });
            this.failremind = "";
          }
        }else if(this.hdata.bankName!="兴业银行"){
          if(this.hdata.applyNum==""){
            this.failremind = "申请金额不能为空";
          }else if(!/^[0-9]+$/.test(this.hdata.applyNum)){
            this.failremind = "申请金额格式不正确，请重新输入";
          }else if(this.hdata.applyNum < 1000){
            this.failremind = "申请金额不得低于1000";
          }else if(Number(this.hdata.applyNum) > 50000){
            this.$store.dispatch("showapply",{
              laystatu:this.laystatu,
              applystatu:this.applystatu
            });
            this.hdata.applyNum = 50000;
            this.failremind = "";
          }else if(this.hdata.applyNum >= 1000 && Number(this.hdata.applyNum) <= 50000){
            this.$store.dispatch("changeapply",{
              creditcardNum:this.hdata.creditcardNum,
              applyNum:this.hdata.applyNum,
              paytype:this.hdata.paytype,
              stage:this.hdata.stage
            });
            this.failremind = "";
          }
        }
      },
      //验证提交按钮样式改变
      checkNum(){
        setTimeout(()=>{
          var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
          window.scrollTo(0,Math.max(scrollHeight - 1,0));
        },100); 
        this.delShow = false;
        this.modShow = true;
        if(this.hdata.applyNum >= 1000 && Number(this.hdata.applyNum) <= Number(this.hdata.maxNum) && this.ui.hascard==true && this.icode.length==6 && this.hdata.imgshow_two == true ){
          this.ui.subShow = true;
        }else{
          this.ui.subShow = false;
        }
      },
      // 打开信用卡列表
      selectcreditCard(){ 
        this.$store.dispatch("showcredit",{
          laystatu:this.laystatu,
          creditstatu:this.creditstatu
        });
      },
      // 打开借记卡列表
      selectdebitCard(){
        this.$refs.bankNum.blur();
        this.$refs.bankName.blur();
        this.$store.dispatch("showdebit",{
          laystatu:this.laystatu,
          debitstatu:this.debitstatu
        });
      },
      //更换信用卡
      getcreditcardNum(creditdata){ 
        this.hdata.creditcardNum.fakeCardNo = creditdata.fakeCardNo;
        this.hdata.creditcardNum.realCardNo = creditdata.realCardNo;
        this.$store.dispatch("changeaccount",{
          realCardNo:creditdata.realCardNo,
          fakeCardNo:creditdata.fakeCardNo
        })
      },
      //更换借记卡
      getdebitcardNum(getdata){ 
        var addData = getdata;
        this.$store.dispatch('initaddpage',{
          addData:addData
        });
        this.hdata.bankNum = getdata[0];
        this.hdata.bankName = getdata[1];
      },
      // 删除借记卡
      changedebitList(deletedata){
        // data.index 要删除的卡号的对应索引
        // data.kaNum 要删除的卡号 号码
        this.num = deletedata.index;
        this.kaNum = deletedata.kaNum;
      },
      //获取短信验证码
      geticodeVal(codedata){
        this.icode = codedata;
      },
      // 关闭金额提示
      passConfirm(){
        this.$store.dispatch("hideapply",{
          laystatu:this.laystatu,
          applystatu:this.applystatu
        });
        this.$store.dispatch("changeapply",{
          creditcardNum:this.hdata.creditcardNum,
          applyNum:this.hdata.applyNum,
          paytype:this.hdata.paytype,
          stage:this.hdata.stage
        });
      },
      // 申请失败 确定按钮
      fConfirm(){ 
        this.$store.dispatch("failconfirm",{
          laystatu:this.laystatu,
          failstatu:this.failstatu
        })
      },
      // 点击温馨提示
      Remind(){
        this.$store.dispatch("showremind",{
          laystatu:this.laystatu,
          reminderstatu:this.reminderstatu
        });
      },
      // 关闭温馨提示
      rconfirm(){
        this.$store.dispatch("hideremind",{
          laystatu:this.laystatu,
          reminderstatu:this.reminderstatu
        });
      },
      // 跳转添加银行页面
      toAdd(){
        this.$router.push({path: '/Enjoyloan/AddPage'});
      },
      // 取消删除借记卡操作提示
      btnCancel(){
        this.$store.dispatch("canceldelete",{
          deletestatu:this.deletestatu,
        });
      },
      // 确定删除借记卡操作提示
      btnConfirm(){
        this.$store.dispatch("confirmdelete",{
          num:this.num,
          kaNum:this.kaNum,
          deletestatu:this.deletestatu,
        });
      },
      // 清空申请金额
      Delete(){
        this.hdata.applyNum = "";
        this.$refs.applyNum.focus();
      },
      // 修改申请金额
      Modify(){
        track("defq_HomeModify","兴享贷首页修改金额画笔按钮");
        this.modShow = false;
        this.delShow = true;
        this.hdata.applyNum = "";
        this.$refs.applyNum.focus();
      },

      chosepay(){
        this.$refs.applyNum.blur();
        $("#identCardCode").blur();
        this.paytypeSelect();
      },

      // 支付方式选择
      paytypeSelect(){
        if(this.hdata.applyNum == ""){
          this.payfocus = false;
          $(".main").addClass("bg-fixed");
          $.alert("申请金额不能为空","提示",()=>{
            $(".main").removeClass("bg-fixed");
            this.failremind = "";
            this.$refs.applyNum.focus();
          });
        }else if(!/^[0-9]+$/.test(this.hdata.applyNum)){
          this.payfocus = false;
          $(".main").addClass("bg-fixed");
          $.alert("申请金额格式不正确，请重新输入","提示",()=>{
            $(".main").removeClass("bg-fixed");
            this.failremind = "";
            this.$refs.applyNum.focus();
          });
          this.hdata.applyNum = "";
        }else if(this.hdata.applyNum < 1000){
          this.payfocus = false;
          $(".main").addClass("bg-fixed");
          $.alert("申请金额不得低于1000","提示",()=>{
            $(".main").removeClass("bg-fixed");
            this.failremind = "";
          });
          this.hdata.applyNum = "1000";
        }else{
          this.payfocus = true;
          $(".main").addClass("bg-fixed");
          this.$refs.paytype.blur();
          $("#paytype").picker({
            cols: [
                {
                  textAlign: 'center',
                  values: this.hdata.paytypeList
                }
            ],
            value:[this.hdata.paytype],
            onClose:(payresult)=>{
              this.$store.dispatch("changepay",{
                payvalue:payresult.value
              });

              this.$store.dispatch("changeapply",{
                creditcardNum:this.hdata.creditcardNum,
                applyNum:this.hdata.applyNum,
                paytype:this.hdata.paytype,
                stage:this.hdata.stage,
              });
              $(".main").removeClass("bg-fixed");
            }
          });
        }        
      },

      chosestage(){
        this.$refs.applyNum.blur();
        $("#identCardCode").blur();
        this.stageSelect();
      },

      // 期数
      stageSelect(){
        if(this.hdata.applyNum == ""){
          this.payfocus = false;
          $(".main").addClass("bg-fixed");
          $.alert("申请金额不能为空","提示",()=>{
            $(".main").removeClass("bg-fixed");
            this.failremind = "";
            this.$refs.applyNum.focus();
          });
        }else if(!/^[0-9]+$/.test(this.hdata.applyNum)){
          this.payfocus = false;
          $(".main").addClass("bg-fixed");
          $.alert("申请金额格式不正确，请重新输入","提示",()=>{
            $(".main").removeClass("bg-fixed");
            this.failremind = "";
            this.$refs.applyNum.focus();
          });
          this.hdata.applyNum = "";
        }else if(this.hdata.applyNum < 1000){
          this.payfocus = false;
          $(".main").addClass("bg-fixed");
          $.alert("申请金额最小不得低于1000","提示",()=>{
            $(".main").removeClass("bg-fixed");
            this.failremind = "";
          });
          this.hdata.applyNum = "1000";
        }else{
          this.payfocus = true;
          $(".main").addClass("bg-fixed");
          this.$refs.stage.blur();
          $("#stage").picker({
            cols: [
                {
                  textAlign: 'center',
                  values: this.hdata.stageList
                }
            ],
            value:[this.hdata.stage],
            onClose:(stageresult)=>{
              this.$store.dispatch("changestage",{
                stagevalue:stageresult.value
              });
              
              this.$store.dispatch("changeapply",{
                creditcardNum:this.hdata.creditcardNum,
                applyNum:this.hdata.applyNum,
                paytype:this.hdata.paytype,
                stage:this.hdata.stage,
              });
              $(".main").removeClass("bg-fixed");
            }
          });
        }        
      },

      chosefunduse(){
        this.$refs.applyNum.blur();
        $("#identCardCode").blur();
        this.funduseSelect();
      },

      // 资金用途
      funduseSelect(){
        $(".main").addClass("bg-fixed");
        this.$refs.funduse.blur();
        $("#funduse").picker({
          cols: [
              {
                textAlign: 'center',
                values: this.hdata.funduseList
              }
          ],
          value:[this.hdata.funduse],
          onClose:(funduseresult)=>{
            this.$store.dispatch("changefunduse",{
              fundusevalue:funduseresult.value
            });
            $(".main").removeClass("bg-fixed");
          }
        });
      },
      // 改变按钮
      changecheck_not(){
        this.$store.dispatch('changenocheck',{
          hdata:this.hdata
        });
        if(this.hdata.applyNum >= 1000 && Number(this.hdata.applyNum) <= Number(this.hdata.maxNum) && this.ui.hascard==true && this.icode.length==6 && this.hdata.imgshow_two == true ){
          this.ui.subShow = true;
        }else{
          this.ui.subShow = false;
        }
      },
      // 改变按钮
      changecheck_is(){
        this.$store.dispatch('changeischeck',{
          hdata:this.hdata
        });
        if(this.hdata.applyNum >= 1000 && Number(this.hdata.applyNum) <= Number(this.hdata.maxNum) && this.ui.hascard==true && this.icode.length==6 && this.hdata.imgshow_two == true ){
          this.ui.subShow = true;
        }else{
          this.ui.subShow = false;
        }
      },
      // 提交所有信息
      submit(){
        if(this.hdata.bankName!="兴业银行"){
          if(this.hdata.applyNum > 50000){
            $(".main").addClass("bg-fixed");
            $.alert("他行最高可借不得高于50000","提示",()=>{
              $(".main").removeClass("bg-fixed");
            });
          }else{
            if(this.hdata.applyNum >= 1000 && Number(this.hdata.applyNum) <= 50000 && this.ui.hascard==true && this.icode.length==6 && this.hdata.imgshow_two == true){
              track("defq_Homesubmit","兴享贷首页提交成功按钮");
              this.ui.subClick = false;
              this.ui.subShow = false;
              this.$store.dispatch('submitdata',{
                hdata:this.hdata,
                pdata:this.pdata,
                creditcardNum:this.hdata.creditcardNum,
                applyNum:this.hdata.applyNum,
                paytype:this.hdata.paytype.toString(),
                stage:this.hdata.stage.toString(),
                funduse:this.hdata.funduse.toString(),
                identcode:this.icode,
                router:this.$router
              });
            }
          }
        }else if(this.hdata.bankName=="" || this.hdata.bankName=="兴业银行"){
          if(this.hdata.applyNum >= 1000 && Number(this.hdata.applyNum) <= Number(this.hdata.maxNum) && this.ui.hascard==true && this.icode.length==6 && this.hdata.imgshow_two == true){
            track("defq_Homesubmit","兴享贷首页提交成功按钮");
            this.ui.subClick = false;
            this.ui.subShow = false;
            this.$store.dispatch('submitdata',{
              hdata:this.hdata,
              pdata:this.pdata,
              creditcardNum:this.hdata.creditcardNum,
              applyNum:this.hdata.applyNum,
              paytype:this.hdata.paytype.toString(),
              stage:this.hdata.stage.toString(),
              funduse:this.hdata.funduse.toString(),
              identcode:this.icode,
              router:this.$router
            });
          }
        }
      }
    },
    components:{
      CreditSelect,
      DebitSelect,
      IdentCode,
      ImageCode,
      BcountDown
    }
  }
</script>
<style scoped>
.main{background:#F3F5F9;width: 100%;}
.container{width: 100%;background:#FFF;}
.title{height: 0.44rem;line-height: 0.44rem;padding:0 5.3%;box-sizing: border-box;}
.title .logo{width:0.28rem;margin-right: 0.13rem;}
.title .creditcardNum{font-size: 0.16rem;display: inline-block;width: 2.23rem;}
.title .down{width: 0.13rem;float: right;margin-top: 0.21rem;}
.blank{background:#F3F5F9;height: 0.1rem;}
.banner{height:1.67rem;background:url("../../assets/images/banner.png") no-repeat;background-size: 100% 100%;color:#FFF;
padding:0 0.4rem;box-sizing: border-box;}
.banner-title{font-size: 0.14rem;height: 0.2rem;line-height: 0.2rem;padding-top:0.32rem;}
.banner-top{color:#FF423E;font-size: 0.13rem;line-height: 0.13rem;height: 0.13rem;}
.banner-middle{height: 0.36rem;line-height: 0.36rem;font-size: 0.25rem;position: relative;}
.sign-one{display: inline-block;margin-left: -0.05rem;}
#applyNum{border: none;height: 0.36rem;font-size: 0.25rem;width: 2rem;background: none;color:#FFF;}
#applyNum::-webkit-input-placeholder{font-size: 0.2rem;color: #FFF;opacity: 0.5;height: 0.28rem;line-height:0.28rem;position: relative;bottom:0.02rem;}
#applyNum:-moz-placeholder{font-size: 0.2rem;color: #FFF;opacity: 0.5;height: 0.28rem;line-height:0.28rem;position: relative;bottom:0.02rem;}
#applyNum:-ms-input-placeholder{font-size: 0.2rem;color: #FFF;opacity: 0.5;height: 0.28rem;line-height:0.28rem;position: relative;bottom:0.02rem;}
.banner-middle img{width:0.17rem;height:0.17rem;position: absolute;right: 0;top:0.1rem;}
.banner-line{background:#fff;opacity: 0.5;height: 0.01rem;}
.banner-bottom{margin-top: 0.095rem;height: 0.16rem;line-height: 0.16rem;font-size: 0.11rem;position: relative;}
.banner-txt{margin-right: 0.1rem;}
.banner-content_one{position: absolute;right: 0;}
.content_one{padding:0 5.3%;box-sizing: border-box;}
.content_one .input-cell{height: 0.24rem;line-height: 0.24rem;position: relative;margin-bottom: 0.22rem;}
.content_one .input-cell.te2{margin:0;}
.content_one .cell-left{width:1.2rem;font-size: 0.15rem;float: left;}
.content_one .cell-middle{display: inline-block;position: absolute;right: 0.2rem;}
.te{float: right;}
.content_one .cell-middle.te input{width:2rem;}
.content_one .cell-middle input{border:none;;font-size: 0.15rem;text-align: right;height: 0.24rem;line-height: 0.24rem;width:1.78rem;}
.content_one .cell-right{float: right;}
.content_one .cell-right img{width:0.071rem;position: relative;top: -0.02rem;}
.content_one .arrow{background: url("../../assets/images/arrow.png") no-repeat;background-size: 100% 100%;display: block;width: 0.078rem;
height: 0.156rem;position: absolute;right: 0;top:0.049rem;}
/* 分期还款 */
.repay-part{background:#EDF3FD;padding:0.12rem 0.24rem;margin-bottom: 0.22rem;display: flex;}
.repay-part .left{flex:1;}
.repay-part .left .title_one{height: 0.17rem;line-height: 0.17rem;font-size: 0.12rem;margin-bottom: 0.05rem;opacity: 0.8;}
.repay-part .left .r1{margin-bottom: 0.01rem;}
.repay-part .left .slh{height: 0.14rem;line-height: 0.14rem;font-size: 0.1rem;margin-bottom: 0.05rem;opacity: 0.5;}
.repay-part .center{text-align: right;text-decoration:line-through;padding-left: 0.1rem;}
.repay-part .center .title_two{height: 0.17rem;line-height: 0.17rem;font-size: 0.12rem;margin-bottom: 0.05rem;opacity: 0.3;}
.repay-part .center .zhe{height: 0.14rem;line-height: 0.14rem;font-size: 0.1rem;margin-bottom: 0.05rem;opacity: 0.3;}
.repay-part .right{text-align: right;padding-left: 0.05rem;}
.repay-part .right .title_three{height: 0.17rem;line-height: 0.17rem;font-size: 0.12rem;margin-bottom: 0.05rem;color:#5084ff;}
.repay-part .right .nozhe{height: 0.14rem;line-height: 0.14rem;font-size: 0.1rem;margin-bottom: 0.05rem;color:#7e7e7e;}
.repay-part .right .r2{margin-bottom: 0.01rem;}
.slh{background:url("../../assets/images/slh.png") repeat-x right center;background-size: auto 0.02rem;}
.slh .s1{display: inline-block;padding-right: 0.2rem;background:#EDF3FD;}
.slh .s2{display: inline-block;padding-right: 0.1rem;background:#EDF3FD;}

/* 一次性还款 */
.repay-all{background:#EDF3FD;padding:0.12rem 0.24rem;margin-bottom: 0.22rem;}
.repay-all .epay{margin-bottom: 0.12rem;}
.repay-all .epay div:first-child{float: left;font-size: 0.12rem;height: 0.17rem;opacity: 0.8;}
.repay-all .epay div:last-child{float: right;font-size: 0.12rem;height: 0.17rem;color:#5084FF}
.repay-all .emoney{margin-bottom: 0.14rem;}
.repay-all .emoney div:first-child{float: left;font-size: 0.12rem;height: 0.17rem;opacity: 0.8;}
.repay-all .emoney div:last-child{float: right;font-size: 0.12rem;height: 0.17rem;color:#5084FF}
.repay-all .emoney div:last-child p:first-child{float: right;}
.repay-all .emoney div:last-child p:last-child{text-decoration:line-through;float: right;opacity: 0.3;margin-right: 0.05rem;color:#7E7E7E;}
.repay-all .extra{margin-bottom: 0.01rem;}
.repay-all .extra div:first-child{float: left;font-size: 0.12rem;height: 0.17rem;opacity: 0.8;}
.repay-all .extra div:last-child{float: right;font-size: 0.12rem;height: 0.17rem;color:#5084FF}
.blank2{margin-left: 5.3%;background:#979797;height: 0.01rem;opacity: 0.5;}
.identTxt{margin-left: 5.3%;font-size: 0.12rem;height: 0.24rem;line-height: 0.24rem;padding:0.05rem 0;opacity: 0.5;color: #666;}
.footer{padding: 0 5.3% 0.12rem;box-sizing: border-box;}
.rule{padding:0.2rem 0;}
.rule .quan{width:0.3rem;height: 0.3rem;float: left;}
.check{width: 0.16rem;position: relative;top:0.02rem;}
.rule .rule-txt{float: right;width:90%;font-size: 0.12rem;color:#666;line-height: 0.18rem;}
.rule-txt a {color:#0060F1;}
.submit{width:100%;background: #CCD0DB;border-radius: 0.22rem;height: 0.45rem;line-height: 0.45rem;text-align: center;
font-size: 0.16rem;color: #E8EBF1;}
.active2{background:#0060F1}
.kind-remind{padding:0.16rem 0;text-align: center;font-size: 0.12rem;color: #0060F1;}
.remind{position:absolute;width:2.71rem;background:#FFF;top: 0.79rem;z-index:666;left:13.9%;height: 3.8rem;border-radius: 0.1rem;}
.remind p{margin:0.19rem 0 0.13rem;font-size: 0.16rem;line-height: 0.22rem;text-align: center;}
.remind-txt{font-size: 0.14rem;line-height: 0.2rem;height: 2.63rem;overflow: scroll;padding:0 0.2rem;box-sizing: 
border-box;color:#666;margin-bottom: 0.2rem;}
.remind-blank{height: 0.01rem;background: #EAEAEA;margin-bottom: 0.09rem;}
.remind-confirm{font-size: 0.16rem;color: #0060F1;letter-spacing: -0.0038rem;text-align: center;display: block;}
.layer{width: 100%;height: 100%;z-index: 100;position: fixed;top: 0;left: 0;display: block;background: #000;opacity: 0.4;}
.bg-fixed{position: fixed;overflow: hidden;top:0;left:0;bottom:0;right:0;}
/* 申请失败 */
.fail{position: absolute;width: 2.63rem;left: 14.9%;background: #FFF;height: 2.44rem;text-align: center;top: 1.26rem;z-index: 400;
border-radius: 0.1rem;}
.fail-top{margin:0.26rem 0 0.15rem;}
.fail-top img{width:0.38rem;}
.fail-title{font-size: 0.16rem;height: 0.22rem;line-height: 0.22rem;font-weight: 600;margin-bottom: 0.21rem;}
.fail-txt{font-size: 0.14rem;line-height: 0.2rem;width:2.16rem;color:#333;margin: 0 auto;}
#confirm{position: absolute;bottom: 0.27rem;height: 0.34rem;line-height: 0.34rem;border: 0.01rem solid #5084FF;border-radius: 0.17rem;
font-size: 0.14rem;color: #5084FF;letter-spacing: -0.0034rem;text-align: center;width: 2.16rem;left: 0.24rem;}
/* 选择借记卡提示信息 */
.deb-remind{position: absolute;top: 2.29rem;width:2.71rem;left: 13.9%;height: 1.07rem;background: #FFFFFF;border-radius: 0.1rem;
z-index:999;}
.deb-remind p{padding:0.2rem 0;font-size: 0.16rem;height: 0.22rem;line-height: 0.22rem;text-align: center;border-bottom: 0.01rem solid #EAEAEA;}
.btn{height: 0.44rem;line-height: 0.44rem;font-size: 0.16rem;color: #0060F1;}
#btn-cancel{width:1.35rem;display: inline-block;text-align: center;border-right: 0.01rem solid #EAEAEA;}
#btn-confirm{width:1.35rem;display: inline-block;text-align: center;}
/* 输入超过申请金额 */
.pass-money{position: absolute;top: 2.39rem;width:2.64rem;left:14.8%;height: 1.48rem;background: #FFFFFF;border-radius: 0.1rem;
z-index:999;text-align: center;}
.pass-money p{font-size: 0.16rem;line-height: 0.22rem;text-align: center;padding:0.2rem 0 0.17rem;width: 2.05rem;margin-left: 0.3rem;}
.pass-blank{height: 0.01rem;background:#EAEAEA;}
#pass-confirm{height: 0.44rem;font-size:0.16rem;color: #0060F1;letter-spacing: -0.0038rem;line-height: 0.44rem;display: block;}
#copyright{font-size:0.12rem;text-align: center;color:#666;}
</style>
