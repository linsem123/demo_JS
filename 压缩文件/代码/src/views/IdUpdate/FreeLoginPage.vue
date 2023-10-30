<template>
    <div class="main bg-fixed">
        <div class="head_one">
            <div class="head_top">
                <div class="top_one">
                    <img src="@/assets/images/xybank.png" alt="">
                </div>
                <div class="top_two">
                    <span class="top_blank"></span>
                    <span class="top_txt">用户登录</span>
                    <span class="top_blank"></span>
                </div>
            </div>
        </div> 
        <YImageCode :bgImg="imageCode.bgImg" :slideImg="imageCode.slideImg" :show="imageCode.show" @getMove="getMove" @refresh="refresh"></YImageCode>
        <YVersion :version="version" style="position:fixed;bottom:10%;"></YVersion>
        <YErrorAlert :msg="alert.msg" :err="alert.err" :show="alert.showAlert" @confirm="confirm_home"></YErrorAlert>
    </div>
</template>
<script>
    // 引入所需的方法、组件
    import {mapActions,mapState} from "vuex";
    import YImageCode from "../../components/YImageCode";
    import YVersion from "../../components/YVersion";
    import YErrorAlert from "../../components/YErrorAlert";
    import {initsa,getSearch} from "@/assets/js/common.js"; 
    export default {
        name: 'FreeLoginPage',
        data(){
            return { 
                tokenId:"",         
                khid:""      
            }
        },
        computed:mapState({
            imageCode: state => state.iu.free.imageCode,
            alert: state => state.iu.free.alert,
            version: state => state.iu.version
        }),
        created(){
            this.initwebHome();                   
        },
        methods:{
            initwebHome(){
                this.tokenId = getSearch("tokenId");
                this.khid = initsa("证件有效期更新网页版免登");
                this.$store.dispatch('iu/binitwebhome',{
                    tokenId:this.tokenId
                });
            },
            confirm_home(){
                this.$store.commit("iu/BWEBHOMEALERT",{show:false,msg:"",err:""});
            },
            getMove(value){
                this.$store.commit("iu/BSETSENDLEN",value);
                this.$store.dispatch('iu/bsendlen',{
                    tokenId:this.tokenId,
                    imageCode:this.imageCode,
                    _this:this,
                    khid:this.khid
                });
            },
            refresh(){
                this.$store.dispatch('iu/bchangeimg',{
                    tokenId:this.tokenId,
                });
            }
        },
        components:{
            YImageCode,
            YVersion,
            YErrorAlert
        }
    }
</script>
<style scoped>
.main{background:#F4F6F8;height: 100%;overflow: hidden;}
.bg-fixed{position: fixed;overflow: hidden;top:0;left:0;bottom:0;right:0;}
.top_one{text-align: center;padding: 0.33rem 0 0.25rem;}
.top_one img{width:1.86rem;}
.top_two{text-align: center;margin-bottom: 0.15rem;}
.top_blank{display: inline-block;width: 1.25rem;background: #b4b4b6;height: 0.01rem;margin: 0 0.1rem;position: relative;top: -0.05rem}
.top_txt{font-size: 0.14rem;color: #b4b4b6;}
</style>