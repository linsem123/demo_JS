//  输入金额框
// bgImg 背景图src
// Fcolor 提示信息字体颜色
// maxNum 最高可借金额
// inputTxt 底部话术
// passMax 输入框返回值
//num  页面缓存的借款值
<template lang="pug">
    <div id="banner">
        <img :src="bgImg" alt="" class="bgImg">
        <div class="banner-next">
            <div class="banner-title">申请金额</div>
            <div class="banner-top" :style={color:Fcolor}>{{failremind}}</div>
            <div class="banner-middle">
                <span class="sign-one">￥</span>
                <input type="tel" maxlength="9" id="applyNum" pattern="[0-9]*" placeholder="请输入申请金额" v-model="applyNum"  @focus="setNum" @input="setApplyNum" ref="applyNum" @blur="checkNum">
                <img src="@/assets/images/lendcash/del.png" alt="" @click="Delete" v-if="delShow" >
                <img src="@/assets/images/lendcash/modify.png" alt="" @click="Modify" v-if="modShow">
            </div>
            <div class="banner-line"></div>
            <div class="banner-bottom">
                <span class="banner-txt">{{inputTxt}}{{maxNum}}</span>
            </div>
        </div>
        <div class="layer" v-show="layshow"></div>
        <div class="pass-money" v-show="applyshow">
            <p>您输入的金额大于{{title}}最高可申请金额，已为您更改至最高可申请金额</p>
            <div class="pass-blank"></div>
            <span id="pass-confirm" @click="passConfirm">确定</span>
        </div>
    </div>
</template>

<script>
  export default {
    name: "BInputMoney",
    props: ['title','bgImg','Fcolor','inputTxt','minNum','maxNum',"num","bankName"],
    data(){
        return{
            delShow:false,   
            modShow:true,
            applyNum:"",
            failremind:"",
            layshow:"",
            applyshow:""
        }
    },
    watch:{
        num(){  //切换卡片时 最高可借会变化
            if(this.num!=0){
                this.applyNum=this.num;
                this.failremind ="";
                this.$emit('passMax',{applyNum:this.applyNum,bl:true});
            }
        },  
        bankName(newVal,oldVal){  //切换借记卡时  判断当前输入金额是否正确
            console.log("newVal",newVal);
            if(this.applyNum==""){
                this.failremind = "申请金额不能为空";
                this.$emit('passMax',{applyNum:'',bl:false});
                return 
            }else if(Number(this.applyNum)<Number(this.minNum)){
                this.failremind="申请金额不得低于" +this.minNum+"元";
                this.$emit('passMax',{applyNum:'',bl:false});
                return 
            }
            if(newVal=="兴业银行"){  //本行卡  1000 < max  最高300000
                if(Number(this.maxNum)>=300000 && Number(this.applyNum)>300000){
                    this.failremind = "本行借记卡最高可借300000";
                    // this.applyNum="";
                    // this.$refs.applyNum.focus();
                    this.$emit('passMax',{applyNum:'',bl:false});
                    return 
                }else if(Number(this.maxNum)<=300000&&Number(applyNum)>Number(this.maxNum)){
                    console.log("newVal22222222");
                    this.layshow = true;
                    this.applyshow = true;
                    this.applyNum = this.maxNum;
                    this.failremind = "";
                    this.$refs.applyNum.blur();
                    return
                }else if(Number(this.applyNum) >= Number(this.minNum) && Number(this.applyNum) <= Number(this.maxNum)){
                    this.failremind = "";
                    this.$emit('passMax',{applyNum:this.applyNum,bl:true});
                    return
                }
            }else if(newVal!="兴业银行"){  //他行卡  
                if(Number(this.maxNum)>=50000&&Number(this.applyNum)>50000){
                    // this.failremind = "他行借记卡最高可借50000";
                    this.failremind = "";
                    // this.applyNum = "" ;
                    // this.$refs.applyNum.focus();
                    this.$emit('passMax',{applyNum:50000,bl:true});
                    return 
                }else if(Number(this.maxNum)<=50000&&Number(this.applyNum)>Number(this.maxNum)){
                    this.layshow = true;
                    this.applyshow = true;
                    this.applyNum = this.maxNum;
                    this.failremind = "";
                    this.$refs.applyNum.blur();
                    return 
                }else if(Number(this.applyNum) >= Number(this.minNum) && Number(this.applyNum) <= Number(this.maxNum)){
                    this.failremind = "";
                    this.$refs.applyNum.blur();
                    this.$emit('passMax',{applyNum:this.applyNum,bl:true});
                    return 
                }
            }
        },
        maxNum(){  //切换卡片时 最高可借会变化
            if(this.num!=0){
                this.applyNum=this.num;
                this.failremind ="";
                this.$emit('passMax',{applyNum:this.applyNum,bl:true});
            }
        },  
    },
    created(){
        if(this.num!=0){
            this.applyNum = this.num;
            this.$emit('passMax',{applyNum:this.applyNum,bl:true});
            return 
        }
        this.applyNum = this.maxNum;
    },
    methods: {
        setApplyNum(){  //输入时设置
            // this.applyNum = this.applyNum.replace(/[^\d.]/g,"");           // 限制只能输入数字和小数点
            // this.applyNum = this.applyNum.replace(".","$#$").replace(/\./g,"").replace("$#$",".");    //清楚多余小数点
            // this.applyNum = this.applyNum.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
            // this.applyNum.substring(0, 1) === '.' && (this.applyNum = '0' + this.applyNum);
            this.applyNum = this.applyNum.replace(/[^\d]/g,"");
            if(this.applyNum==""){
                this.failremind = "申请金额不能为空";
                this.$emit('passMax',{applyNum:'',bl:false});
                return 
            }else if(Number(this.applyNum) < Number(this.minNum)){
                this.failremind = "申请金额不得低于"+this.minNum+"元";
                this.$emit('passMax',{applyNum:'',bl:false});
                return 
            }else if(this.bankName=="兴业银行"){  //本行卡  1000 < max
                if(Number(this.maxNum)>300000&&Number(this.applyNum)>300000){
                    this.failremind = "本行借记卡最高可借300000";
                    this.$emit('passMax',{applyNum:'',bl:false});
                    return 
                }else if(Number(this.maxNum)<300000&&Number(this.applyNum) > Number(this.maxNum)){
                    this.layshow = true;
                    this.applyshow = true;
                    this.applyNum = this.maxNum;
                    this.failremind = "";
                    this.$refs.applyNum.blur();
                    return
                }else if(Number(this.applyNum) >= Number(this.minNum) && Number(this.applyNum) <= Number(this.maxNum)){
                    this.$emit('passMax',{applyNum:this.applyNum,bl:true});
                    this.failremind = "";
                    return
                }
            }else if(this.bankName!="兴业银行"){  //他行卡  
                if(this.bankName==''){  //为空的情况
                    if(Number(this.maxNum)>300000&&Number(this.applyNum)>300000){
                        this.failremind = "最高可借300000";
                        this.$emit('passMax',{applyNum:'',bl:false});
                        return 
                    }else if(Number(this.maxNum)<300000&&Number(this.applyNum) > Number(this.maxNum)){
                        this.layshow = true;
                        this.applyshow = true;
                        this.applyNum = this.maxNum;
                        this.failremind = "";
                        this.$refs.applyNum.blur();
                        return
                    }else if(Number(this.applyNum) >= Number(this.minNum) && Number(this.applyNum) <= Number(this.maxNum)){
                        this.$emit('passMax',{applyNum:this.applyNum,bl:true});
                        this.failremind = "";
                        return
                    }
                }else{
                    if(Number(this.maxNum)>50000&&Number(this.applyNum)>50000){
                        this.failremind = "他行借记卡最高可借50000";
                        this.$emit('passMax',{applyNum:'',bl:false});
                        return
                    }else if(Number(this.maxNum)<50000&&Number(this.applyNum)>Number(this.maxNum)){
                        this.layshow = true;
                        this.applyshow = true;
                        this.applyNum = this.maxNum;
                        this.failremind = "";
                        this.$refs.applyNum.blur();
                        return
                    }else if(Number(this.applyNum) >= Number(this.minNum) && Number(this.applyNum) <= Number(this.maxNum)){
                        this.$emit('passMax',{applyNum:this.applyNum,bl:true});
                        this.failremind = "";
                        return
                    }
                }
                
            }
        },
        checkNum(){
            this.modShow = true;
            this.delShow = false;
            if(this.applyNum==""){
                this.failremind="申请金额不能为空";
                this.$emit('passMax',{applyNum:'',bl:false});
            }
        },
        // 清空申请金额
        Delete(){
            this.applyNum = "";
            this.failremind = "";
            this.$emit('passMax',{applyNum:"",bl:false});
            this.$refs.applyNum.focus();
        },
        // 修改申请金额
        Modify(){
            this.modShow = false;
            this.delShow = true;
            this.applyNum = "";
            this.$emit('passMax',{applyNum:"",bl:false});
            this.$refs.applyNum.focus();
        },
        setNum(){
            this.delShow = true;
            this.modShow = false;
        },
        passConfirm(){  
            this.layshow = false;
            this.applyshow = false;
            this.$emit('passMax',{applyNum:this.applyNum,bl:true});
        }
    }
  }
</script>

<style scoped>
#banner{height:1.67rem;background-size: 100% 100%;color:#FFF;box-sizing: border-box;}
#banner .bgImg{width:100%;height: 1.67rem;}
.banner-next{position: relative;top:-1.67rem;padding:0 0.4rem;}
.banner-title{font-size: 0.14rem;height: 0.2rem;line-height: 0.2rem;padding-top:0.32rem;}
.banner-top{font-size: 0.13rem;line-height: 0.13rem;height: 0.13rem;}
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
.layer{width: 100%;height: 100%;z-index: 100;position: fixed;top: 0;left: 0;display: block;background: #000;opacity: 0.4;}
/* 输入超过申请金额 */
.pass-money{position: absolute;top:50%;width:2.64rem;left:50%;height: 1.48rem;transform: translate(-50%,-50%);background: #FFFFFF;border-radius: 0.1rem;
z-index:999;text-align: center;}
.pass-money p{color:#333;font-size: 0.16rem;line-height: 0.22rem;text-align: center;padding:0.2rem 0 0.17rem;width: 2.05rem;margin-left: 0.3rem;}
.pass-blank{height: 0.01rem;background:#EAEAEA;}
#pass-confirm{height: 0.44rem;font-size:0.16rem;color: #0060F1;letter-spacing: -0.0038rem;line-height: 0.44rem;display: block;}
</style>
