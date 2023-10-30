<template>
    <div id="container">
      <div class="XJFQTG" v-if="type=='XJTJ'">
        <p class="image">
          <img src="@/assets/images/cashInstalment/logo_share.png" alt=""/>
        </p>
        <div class="text">Hi，你有一笔现金待领取</div>
        <div class="yellow">邀您体验现金分期</div>
        <div class="text3">实时划款 最长可借三年</div>
        <div class="text4">借万元日手续费低至2.67</div>
        <!-- <vue-qr class="qr_otherImg"  :text="share.link" :margin="10" :size="159"></vue-qr> -->
        <img src=""  alt="" class="qr_otherImg" ref="imgSrc">
        <p class="qr_href">{{share.link}}</p>
        <ylBtn @confirmbtn="confirm" margin="0.2rem auto" btnBgcolor="#ff8900" bgcolor="" :text="text"></ylBtn>
        <YVersion top="0" :version="version"></YVersion>
      </div>
      <div class="SXTG" v-else-if="type=='SXTG'">
          <p class="image">
            <img src="@/assets/images/cashInstalment/logo_share.png" alt=""/>
          </p>
          <div class="p1">邀您体验随兴分消费备用金</div>
          <div class="p2">消费随兴分，生活随心享</div>
          <div class="p3">最长3年，最高30万，借万元仅需手续费2.67元！</div>
          <div class="p4">大额消费随心享，不可投资及买房</div>
          <img src=""  alt="" class="qr_otherImg" ref="imgSrc">
          <!-- <p class="qr_href">{{share.link}}</p> -->
          <p class="qr_href">扫一扫或长按识别二维码 <br> 即可办理随兴分消费备用金</p>
          <ylBtn @confirmbtn="confirm" margin="0.5rem auto 0.2rem" btnBgcolor="#ff8900" bgcolor="" :text="text"></ylBtn>
          <YVersion class="version" top="0" :version="version"></YVersion>
      </div>
      <div class="layer" v-show="share.layer" @click="hideLayer"></div>
      <YErrorAlert :msg="alert.msg" :err="alert.err" :show="alert.show" @confirm="closeAlert"></YErrorAlert>
    </div>
</template>
<script>
  import VueQr from 'vue-qr';
  import QRCode from "qrcode";
import {mapGetters, mapState} from 'vuex';
import {initsa,track,checkName,getSearch,channel,hxdappIsSpecial} from "@/assets/js/common.js";
import YVersion from "@/components/YVersion";
import ylBtn from "@/components/ylBtn";
import YErrorAlert from "../../components/YErrorAlert";
import wx from "weixin-js-sdk";
export default {
    name:"share",
    data(){
        return{
          text:"一键分享推荐页面",
          imgUrl:"",
          type:"",
        }
    },
    components:{
        YVersion,
        ylBtn,
        YErrorAlert,
        VueQr
    },
    computed:{
        ...mapState({
            share: state => state.ci.share,
            version:state => state.ci.version,
            alert: state => state.ci.alert.home,
            promotion: state => state.ci.promotion,
            params:state => state.ci.baseData,
        })
    },
    created(){
      this.type=getSearch("type")==""?"XJTJ":getSearch("type");
      if(this.type=="XJTJ"){
          document.title="现金分期分享";
          initsa("现金分期推广分享");
        }else if(this.type=="SXTG"){
            document.title="随兴分推广";
            initsa("随兴分推广分享");
        }else{
          initsa("");
        }
    },
    mounted(){
        QRCode.toDataURL(this.share.link, {errorCorrectionLevel: 'H'},  (err, url)=>{
          this.$refs.imgSrc.src = url;
        })
        let url=this.share.link;
        if(url.indexOf("8010")!=-1){
            url = url.replace(/[:8010]/g,"").replace(/https/g,"http:");
        }
        if(channel()=="hxdapp" && hxdappIsSpecial()){
          return 
        }else{
          this.init(url);
        }
    },
    methods:{
        init(url){
          wx.config({
              debug:false,
              appId:this.share.data.appId,		        //必填，公众号唯一标识
              timestamp:""+this.share.data.timestamp,	//必填，生成签名的时间戳
              nonceStr:this.share.data.nonceStr,	    //必填，生成签名的随机串
              signature:this.share.data.signature,	  //必填，生成的签名
              jsApiList:['onMenuShareTimeline','onMenuShareAppMessage']	   //必填，需要使用的JS接口列表 
          });
          wx.error((res)=>{
              for(let msg in res){
                let obj = {
                    show:true,
                    msg:JSON.stringify(res[msg]),
                    err:""
                }
                this.$store.commit("ci/SETHOMEALERT",obj);
              }
          });
          wx.ready(()=>{
              wx.onMenuShareTimeline({
                  title:this.share.data.title,     
                  link:url,
                  desc:this.share.data.desc,
                  imgUrl:this.share.data.imgUrl,
                  success: function (res){
                      console.log("onMenuShareTimeline res",res);
                  },
                  cancel:function(){}    //取消分享后执行的回调函数
              })
              wx.onMenuShareAppMessage({
                  title:this.share.data.title ,
                  link:url,
                  desc:this.share.data.desc,
                  imgUrl:this.share.data.imgUrl,
                  success: function (res){ //确认分享后执行的回调函数
                      console.log("onMenuShareAppMessage res",res);
                  },
                  cancel:function(){}     //取消分享后执行的回调函数
              });
          });
        },
        confirm(){
          if(channel()=="hxdapp" && hxdappIsSpecial()){
            this.hxdShare();
            return 
          }
          this.share.layer = true;
        },
        hideLayer(){
          this.share.layer = false;
        },
        closeAlert(){
          let obj = {
              show: false,
              msg:'',
              err:''
          };
          this.$store.commit("ci/SETHOMEALERT", obj);
        },
        hxdShare(){  //好兴动分享
          window.plugins.SharePlugin.share.action({
              shareInfo:[
                  {
                      "channel": "weixin",
                      "mime": "link",
                      "title": this.share.data.title, //必选,分享内容的标题
                      "url": this.share.link, //必选,分享内容的 url 地址
                      "data": this.share.data.desc, //可选,分享内容的描述
                      "pic": this.share.data.imgUrl //可选，分享内容的缩略图地址
                  },
                  {
                      "channel": "weixinGroup",
                      "mime": "link",
                      "title": this.share.data.title, //必选,分享内容的标题
                      "url": this.share.link,       //必选,分享内容的 url 地址
                      "data": this.share.data.desc,   //可选,分享内容的描述
                      "pic": this.share.data.imgUrl     //可选，分享内容的缩略图地址
                  },
                  {
                      "channel": "weibo",
                      "mime": "link",
                      "title": this.share.data.title, //必选,分享内容的标题
                      "url": this.share.link, //必选,分享内容的 url 地址
                      "data": this.share.data.desc, //可选,分享内容的描述
                      "pic": this.share.data.imgUrl//可选，分享内容的缩略图地址
                  }
              ],
              error:function(){ //分享失败或者错误的回调
                  // alert("APP share error");
              },
              success:function(){ //分享成功的回调
                  // alert("APP share success");
              }
          })
        }
    }

}
</script>
<style scoped>
  #container{
    width: 100%;
    height: 100%;
      overflow: scroll;
  }
  .XJFQTG{
    width: 100%;
    height: 100%;
      background: url("../../assets/images/cashInstalment/bg_1.png") no-repeat center 20%;
      background-size: 110% 120%;
  }
  .image{
    text-align: center;
  }
  img{
    width: 2.619rem;
    height: 0.284rem;
    margin-top:0.172rem;
  }
  .text{
    /* opacity: 0.54; */
    background: rgba(255,255,255,0.33);
    border-radius: 0.12rem;
    color: #fff;
    width: 1.43rem;
    height: 0.18rem;
    padding: 0.03rem 0.17rem;
    font-size: 0.13rem;
    margin: 0.284rem auto 0.31rem;
  }
  .yellow{
    width:100%;
    height: 0.48rem;
    font-family: PingFangSC-Semibold;
    font-size: 0.34rem;
    color: #F4F81C;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0,65,65,0.50);
  }
  .text3{
    font-family: PingFangSC-Regular;
    font-size: 0.2rem;
    color: #FFFFFF;
    text-align: center;
    margin: 0.11rem 0 0.07rem;
  }
  .text4{
    width: 2.04rem;
    height: 0.24rem;
    opacity: 0.7;
    border: 1px solid #FFFFFF;
    color: #fff;
    font-size: 0.16rem;
    margin:0 auto 0.21rem;
    text-align: center;
  }
  .qr_otherImg{
    display: block;
    width: 1.59rem;
    height: 1.59rem;
    margin: 0 auto 0.1rem;
  }
  p.qr_href{
    padding:0 5.3%;
    line-height: 0.18rem;
    font-size: 0.12rem;
    text-align: center;
    color:#666;
  }
  .layer{
    width: 100%;
    height: 100%;
    position:absolute;
    left: 0;
    top: 0;
    /*background-color: #0d0d0d;*/
    background:#000 url("../../assets/images/cashInstalment/share.png") no-repeat;
    background-size: 100%;
    opacity: 0.9;
  }
  .SXTG{
    width: 100%;
    height: 100%;
    background: url("../../assets/images/cashInstalment/bg_2.png") no-repeat center;
    background-size: 100% 100%;
  }
  .SXTG .qr_otherImg{
    margin:0.15rem auto 0.1rem;
  }
  .p1{
    font-family: PingFangSC-Semibold;
    font-size: 0.27rem;
    color: #F4F81C;
    letter-spacing: 0;
    text-align: center;
    text-shadow: 0 0.02rem 0.04rem rgba(0,65,65,0.50);
    margin:0.5rem 0;
  }
  .p2{
    font-family: PingFang-SC-Medium;
    font-size: 0.2rem;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    line-height: 0.28rem;
    margin-bottom: 0.12rem;
  }
  .p3{
    opacity: 0.7;
    font-family: PingFangSC-Regular;
    font-size: 0.15rem;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    line-height: 0.22rem;
  }
  .p4{
    opacity: 0.7;
    font-family: PingFangSC-Regular;
    font-size: 0.12rem;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    line-height: 0.18rem;
  }
  .SXTG .qr_href{
    opacity: 0.71;
    font-family: PingFangSC-Regular;
    font-size: 0.11rem;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
  }
  .SXTG .version{
    color:#fff;
  }
</style>
