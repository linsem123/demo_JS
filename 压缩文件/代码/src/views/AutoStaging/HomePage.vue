<template>
    <div class="main bg-fixed">
        <div class="container">
            <div id="credit">
                <div class="title" @click="showCredit">
                    <img src="@/assets/images/autostage/logo.png" alt="" id="logo">
                    <span class="creditcardNum">{{homedata.creditcardNum.cardNo}}</span>
                    <img src="@/assets/images/autostage/dropdown.png" alt="" id="down">
                </div>
                <div class="creditcard-select" v-show="homemenu.creditstatu">
                    <div class="select-title clear">
                        <a href="javascript:;" id="cancel" @click="Cancel">取消</a>
                        <span>切换卡片</span>
                    </div>
                    <ul class="select-list">
                        <li v-for="(item,index) in creditList"  :key="index" @click="changeChosed(item,index)">
                        <img src="@/assets/images/autostage/logo.png" alt="" class="logo">
                        <span class="creditcard-txt">{{item.cardNo}}</span>
                        <img src="@/assets/images/autostage/chose.png" alt="" v-show="homedata.creditIndex==index" class="chosed"> 
                        </li>
                    </ul>
                </div>
            </div>
            <div class="revise">
                <span>当前自动分期信息</span>
                <span @click="revise">修改 ></span>
            </div>
            <div class="info">
                <ul class="info-list">
                    <li>
                        <span>起分金额</span>
                        <span>￥{{homedata.money}}起</span>
                    </li>
                    <li>
                        <span>手续费支付方式</span>
                        <span>{{homedata.payType}}</span>
                    </li>
                    <li>
                        <span>分期期数</span>
                        <span>{{homedata.period}}期</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="banner">
            <img src="@/assets/images/autostage/banner.png" alt="" @click="goTo">
        </div>
        <div class="layer" v-show="homemenu.laystatu"></div>
        <div class="remind-alert" v-show="homemenu.changestatu">
            <div class="alert-top">{{homedata.creditcardNum.cardNo}}</div>
            <div class="alert-info">该卡片暂不支持开通自动分期</div>
            <div class="alert-blank"></div>
            <div class="alert-bottom">
                <div id="close" class="btn" @click="close" :class="homeui.active ? 'active' : ''">关闭</div>
                <div id="change" class="btn" @click="change" :class="homeui.active2 ? 'active' : ''">更换卡片</div>
            </div>
        </div>
        <YErrorAlert :msg="alert.msg" :err="alert.err" :show="alert.showAlert" @confirm="confirm_home"></YErrorAlert>
        <YVersion :version="version" top="2%"></YVersion>
    </div>
</template>
<script>
    // 引入所需的方法、组件
    import {mapActions,mapState} from "vuex";
    import {initsa,track} from "@/assets/js/common.js";
    import YErrorAlert from "../../components/YErrorAlert";
    import YVersion from "../../components/YVersion"; 
    export default {
        name: 'HomePage',
        data(){
            return { 
                homeInfo:{},
                updateInfo:{}
            }
        },
        computed:mapState({
            homedata:state => state.autostage.home.homedata,
            homeui:state => state.autostage.home.homeui,
            homemenu:state => state.autostage.home.homemenu,
            creditList:state =>state.autostage.home.homeui.creditList,
            alert:state => state.autostage.home.alert,
            version:state => state.autostage.version
        }),
        created(){
            this.initHome();   // 初始化首页                 
        },
        methods:{
            // 初始化首页
            initHome(){            
                initsa("自动分期首页");    
                if(window.location.href.indexOf("creditcardNum") == -1){
                    this.homeInfo = JSON.parse(this.$route.query.Hdata);
                    this.$store.commit("autostage/BSETINITHOME",this.homeInfo);
                }else{
                    this.updateInfo = JSON.parse(this.$route.query.Hdatatwo);
                    this.$store.commit("autostage/BSETINITHOMETWO",this.updateInfo);
                }
            },
            // 显示列表
            showCredit(){   
                this.$store.commit("autostage/BHOMECREDITSTATU",{layer:true,statu:true});
            },
            // 取消
            Cancel(){       
                this.$store.commit("autostage/BHOMECREDITSTATU",{layer:false,statu:false});
            },
            // 切换信用卡
            changeChosed(item,index){
                _.forEach(this.creditList,(item2,i) => {
                    if(index==i){
                        var data = {
                            cardKey:item2.cardKey,
                            cardNo:item2.cardNo,
                            index:index
                        }
                        this.$store.dispatch("autostage/bchangehomecredit",{
                            creditcardNum:data,
                            router:this.$router,
                        });
                    }
                });
                this.$store.commit("autostage/BHOMECREDITSTATU",{layer:false,statu:false});
            },
            // 修改自动分期信息
            revise(){
                track("Autostage_revise","自动分期首页修改按钮");
                if(window.location.href.indexOf("creditcardNum") == -1){
                    this.homeInfo = JSON.parse(this.$route.query.Hdata);
                    this.$router.push({path:"/AutoStaging/RevisePage?Rdata="+JSON.stringify(this.homeInfo)});
                }else{
                    this.updateInfo = JSON.parse(this.$route.query.Hdatatwo);
                    this.$router.push({path:"/AutoStaging/RevisePage?Rdata="+JSON.stringify(this.updateInfo)});
                }
            },
            // 首页信息弹框
            confirm_home(){
                this.$store.commit("autostage/BHOMEALERT",{show: false, msg: "", err: ""});
            },
            // 关闭
            close(){
                this.$store.commit("autostage/BHOMECLOSEALERT",{show:false});
            },
            // 更换卡片
            change(){
                this.$store.commit("autostage/BHOMECLOSEALERT",{show:false});
                this.$store.commit("autostage/BHOMECREDITSTATU",{layer:true,statu:true});
            },
            // 点击图片跳转预借现金
            goTo(){
                track("Autostage_reviseGoYJ","自动分期首页点击图片");
                window.location.href = this.GLOBAL.URL+"/main/myhtml/cardPage/fins_index_%23_LendCash_HomePage.html";
                // window.location.href = "https://ccshop.cib.com.cn:8010/evercos/main/myhtml/cardPage/fins_index_%23_LendCash_HomePage.html";
            }
        },
        components:{
            YErrorAlert,
            YVersion
        }
    }
</script>
<style scoped>
.main{background:#F3F5F9;width: 100%;}
.bg-fixed{position: fixed;overflow: hidden;top:0;left:0;bottom:0;right:0;}
.container{background:#FFF;width: 100%;}
/* 信用卡 */
#credit .title{height: 0.44rem;line-height: 0.44rem;padding:0 5.3%;box-sizing: border-box;}
#credit .title #logo{width:0.28rem;margin-right: 0.13rem;left: 0;}
#credit .title .creditcardNum{font-size: 0.16rem;display: inline-block;}
#credit .title #down{width: 0.13rem;float: right;margin-top: 0.21rem;}
#credit .creditcard-select{background: #fff;width: 100%;height: 2.66rem;z-index: 999;position: absolute;bottom: 0;color: #333;}
#credit .select-title{height:0.5rem;line-height:0.5rem;text-align: center;border-bottom: 0.01rem solid #DEDEDE;}
#credit #cancel{position: absolute;left: 0.2rem;font-size: 0.15rem;color: #999;}
#credit .select-title span{font-size: 0.17rem;color: #333;}
#credit .select-list {height: 2.15rem;overflow: scroll;}
#credit .select-list li {height: 0.63rem;line-height: 0.63rem;border-bottom: 0.01rem solid #EAEAEA;}
#credit .logo{width: 0.28rem;position: relative;left: 0.3rem;}
#credit .creditcard-txt{display: inline-block;width: 2.23rem;margin-left: 0.4rem;font-size: 0.15rem;}
#credit .chosed{width: 0.15rem;margin-left: 0.4rem;}
.revise{background:#F3F5F9;padding:0.08rem 5.3%;display: flex;justify-content:space-between;}
.revise span:first-child{color:#666;font-size: 0.14rem;line-height: 0.2rem;}
.revise span:last-child{font-size: 0.14rem;line-height: 0.2rem;color: #0060F1;}
.info-list{padding:0.16rem 5.3%;}
.info-list li{display: flex;justify-content:space-between;font-size: 0.15rem;height: 0.24rem;line-height: 0.24rem;margin-bottom: 0.2rem;}
.info-list li:last-child{margin:0;}
.info-list li span:first-child{color:#666;}
.info-list li span:last-child{color:#000;}
.banner{padding:0 5.3%;margin-top: 40%;}
.banner img{width:100%;border-radius: 0.3rem;}
.layer{width: 100%;height: 100%;z-index: 100;position: fixed;top: 0;left: 0;display: block;background: #000;opacity: 0.4;}
/* 更换卡片-提示信息 */
.remind-alert{width:72.3%;position: absolute;left: 0;right: 0;margin: auto;z-index: 200;background:#fff;top:1.91rem;border-radius: 0.12rem;}
.alert-top{font-size: 0.16rem;line-height: 0.24rem;height: 0.24rem;text-align: center;padding-top: 0.24rem;}
.alert-info{font-size: 0.16rem;line-height: 0.24rem;height: 0.24rem;text-align: center;margin-bottom: 0.24rem;}
.alert-blank{background:#EAEAEA;height: 0.01rem;}
.alert-bottom{display: flex;text-align: center;}
.btn{color: #B2B2B2;letter-spacing: -0.0041rem;line-height: 0.24rem;height: 0.24rem;font-size: 0.17rem;width: 50%;
padding:0.11rem 0;}
.alert-bottom #close{border-right: 0.01rem solid #EAEAEA;}
.active{color:#0060F1};
</style>