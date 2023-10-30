<template>
  <div class="sus">
    <div class="sus-top">
      <div class="sus-img">
        <img src="@/assets/images/success.png" alt="">
      </div>
      <p class="sus-apply">现金分期申请成功</p>
      <p>我行将在两个工作日内放款请留意资金到账情况</p>
    </div>
    <div class="sus-info">现金分期信息</div>
    <div class="sus-table">
      <div class="sus-cell clear">
        <label for="sus-num">申请金额</label>
        <p>￥<span class="sus-num">{{b.applyNum}}</span></p>
      </div>
      <div class="sus-cell clear" style="margin:0;">
        <label for="sus-amount">收款账户</label>
        <p><span class="sus-amount">{{b.debitBank}}借记卡</span></p>
      </div>
      <div class="sus-cell clear">
        <label for="sus-cardNum"></label>
        <p><span class="sus-cardNum">{{b.debitCard}}</span></p>
      </div>
      <div class="sus-blank"></div>
      <div class="sus-cell clear" v-show="a.flag=='02'">
        <label for="sus-money">每期还款金额</label>
        <p>￥<span class="sus-money">{{b.sqyh}}</span></p>
      </div>
      <div class="sus-cell clear" style="margin:0;" v-show="a.flag=='02'">
        <label for="sus-date">首期下账日期</label>
        <p><span class="sus-date">{{b.sqhkr}}</span></p>
      </div>
      <div class="sus-cell clear" v-show="a.flag=='01'">
        <label for="sus-money">一次性手续费</label>
        <p>￥<span class="sus-money">{{a.oneCharge}}</span></p>
      </div>
      <div class="sus-cell clear" v-show="a.flag=='01'">
        <label for="sus-money">每期还款本金</label>
        <p>￥<span class="sus-money">{{b.sqyh}}</span></p>
      </div>
      <div class="sus-cell clear" style="margin:0;" v-show="a.flag=='01'">
        <label for="sus-date">首期下账日期</label>
        <p><span class="sus-date">{{b.sqhkr}}</span></p>
      </div>
    </div>
    <div class="foot">
      <div id="back" @click="closed">关闭</div>
    </div>
    <div class="adv">
      <a class="adv-item" v-for="(item,index) in advList" :key="index" :href="item.href">
        <img alt="" :src="item.path" />
      </a>
    </div>
    <YVersion top="4%" :version="version"></YVersion>
</div>
</template>

<script>
  // 引入所需的方法、组件
  import {mapActions,mapState} from "vuex";
  import {initsa,track,saAlert} from "@/assets/js/common.js"; //听云监听
  import YVersion from "@/components/YVersion";
  export default {
    name: 'success', // 申请成功页面
    data () {
      return { //绑定数据
        
      }
    },
    computed: {
      ...mapState({
        a:state => state.ci.home.instalmentResult,
        b:state=>state.ci.successPage,
        advList: state => state.ci.home.advList,
        alert: state => state.ci.alert,
        version: state => state.ci.version,
      }),
    },
    components:{
      YVersion
    },
    created(){//初始化监听
      initsa("现金分期申请成功"); 
    },
    methods:{
      closed(){
        track("XJFQ_CloseBtn","现金分期成功页关闭按钮");
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
          WeixinJSBridge.call('closeWindow');
        }else{
          var userAgent = navigator.userAgent; 
          if(userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") !=-1) { 
            window.location.href="about:blank"; 
            window.close();
          }else if(userAgent.indexOf("Android") > -1 || userAgent.indexOf("Linux") > -1){ 
            window.opener=null;window.open("about:blank","_self","").close(); 
            window.close();
          }else { 
            window.opener = null; 
            window.open("about:blank", "_self"); 
            window.close(); 
          }   
        }
      }
    }
  }
</script>

<style scoped>
.sus{background:#F3F5F9;height: 100%;}
.sus-top{text-align: center;padding:0 0.2rem;box-sizing: border-box;background:#FFF;}
.sus-img img{width: 1.4rem;margin: 0.36rem 0 0.09rem;}
.sus-top .sus-apply{font-size: 0.18rem;letter-spacing: 0.0022rem;line-height: 0.24rem;margin-bottom: 0.16rem;height: 0.24rem;}
.sus-top p:last-child{font-size: 0.13rem;color: rgba(0,0,0,0.50);letter-spacing: 0;line-height: 0.18rem;padding-bottom: 0.27rem;height: 0.18rem;}
.sus-info{background: #F3F5F9;font-size: 0.14rem;height: 0.35rem;line-height: 0.35rem;color: #666666;letter-spacing: 0.0017rem;padding-left: 0.2rem;}
.sus-table{background:#FFF;padding-top: 0.11rem;padding-bottom: 0.07rem;}
.sus-cell{padding:0 0.2rem;box-sizing: border-box;font-size: 0.14rem;height: 0.2rem;margin-bottom: 0.07rem;line-height: 0.2rem;}
.sus-cell label{float: left;color:#666;}
.sus-cell p{float: right;width:2.31rem;text-align: right;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
.sus-blank{margin-left: 0.2rem;background: #DDDDDD;border-radius: 0.1rem;height: 0.01rem;box-sizing: border-box;margin-top: 0.11rem;
margin-bottom: 0.11rem;}
.foot{padding:0 0.2rem;box-sizing: border-box;padding-top: 0.3rem;}
#back{background: #5084FF;border-radius: 0.22rem;font-size: 0.16rem;height: 0.45rem;line-height: 0.45rem;text-align: center;color: #FFFFFF;
letter-spacing: 0.0019rem;}
#copyright{font-size:0.12rem;text-align: center;color:#666;margin:0.2rem 0 0.1rem;}

.adv{width:89.3%;margin-left:5.3%;}
.adv-item{width:100%; display: inline-block;}
.adv-item:nth-first-child{margin-top:20.8%;}
.adv-item:not(nth-first-child){margin-top:5%;}
.adv-item img{display:inline-block;width:100%;}

</style>
