<template>
    <div class="bg-fixed main">
        <div class="content">
            <div class="user-info">
                <div class="info-cell clear te">
                    <div class="info-left">
                        <label for="owncard">持卡人</label>
                    </div>
                    <div class="info-middle">
                        <span>{{addInfo.custName}}</span>
                    </div>
                </div>
                <div class="info-blank"></div>
                <div class="info-cell clear te">
                    <div class="info-left">
                        <label for="ownphone">手机号码</label>
                    </div>
                    <div class="info-middle">
                        <span>{{addInfo.phone}}</span>
                    </div>
                </div>
                <div class="info-blank"></div>
                <div class="info-cell clear te">
                    <div class="info-left">
                        <label for="ownid">证件号码</label>
                    </div>
                    <div class="info-middle">
                        <span>{{addInfo.idNo}}</span>
                    </div>
                </div>
                <div class="info-blank"></div>
                <div class="info-cell clear te2">
                    <div class="info-left">
                        <label for="cardnumber">卡号</label>
                    </div>
                    <div class="info-middle">
                        <input type="tel" placeholder="请输入您的卡号" pattern="[0-9]*" id="cardnumber" ref="cardnumber" @input="inputCard" v-model="adddata.add_cardNo" @blur="checkCard">
                    </div>
                    <div class="info-right" v-show="deleteShow">
                        <img src="@/assets/images/financial/addcard/delete.png" alt="" class="info-delete" @click="deleteCardNo">
                    </div>
                </div>
                <div class="info-blank"></div>
                <div class="info-cell clear te2">
                    <div class="info-left">
                        <label for="owncard">发卡行</label>
                    </div>
                    <div class="info-middle" @click="selectBank">
                        <input type="text" placeholder="请选择发卡银行" readonly="readonly" id="bank" v-model="adddata.add_debitName">
                    </div>
                    <div class="info-right" @click="selectBank">
                        <img src="@/assets/images/financial/addcard/arrow.png" alt="" class="info-arrow">
                    </div>
                </div>
            </div>
            <div class="info-txt">
                <img src="@/assets/images/financial/addcard/remind.png" alt="">
                <span>目前仅支持绑定招商银行、民生银行、浦发银行、光大银行、平安银行、中信银行、华夏银行、广发银行</span>
            </div>
            <YFunctionBtn text="完成" :dis="adddata.disshow" @checktable="checkInfo" style="margin-top:0;"></YFunctionBtn>
        </div>
        <YVersion :version="version" style="padding-top:0.4rem;"></YVersion>
        <YErrorAlert :msg="alert.msg" :err="alert.err" :show="alert.showAlert" @confirm="confirm_add"></YErrorAlert>
    </div>
</template>
<script>
// 引入所需的方法、组件
import {mapActions,mapState} from "vuex";
import {initsa,track} from "@/assets/js/common.js"; //听云监听
import YFunctionBtn from "../../components/YFunctionBtn";
import YErrorAlert from "../../components/YErrorAlert";
import YVersion from "../../components/YVersion";
export default {
    name: 'addPage',
    data(){
        return{
            deleteShow:"",
            addInfo:{}
        }
    },
    computed:mapState({
        adddata:state => state.baddcard.adddata,
        selectdata:state => state.baddcard.selectdata,
        alert:state => state.baddcard.adddata.alert,
        version:state => state.baddcard.version
    }),
    created(){
        this.initAdd(); //初始化首页
    },
    methods:{
        initAdd(){
            // initsa("添利三号添加借记卡页"); //初始化监听
            this.addInfo = JSON.parse(this.$route.query.Adata);
            this.$store.commit("baddcard/BSETBANKLIST",this.addInfo.lcptBankInfoList);
        },
        // 输入卡号
        inputCard(){
            this.adddata.add_cardNo = this.adddata.add_cardNo.replace(/[^\d]/g,""); // 限制只能输入数字
            this.adddata.add_cardNo = this.adddata.add_cardNo.replace(/\s/g,"").replace(/(\d{4})(?=\d)/g,"$1 ");
            if(this.adddata.add_cardNo!=""){
                this.adddata.add_cardNo=this.adddata.add_cardNo.length>24?this.adddata.add_cardNo.slice(0,24):this.adddata.add_cardNo;
                this.deleteShow = true;
            }else{
               this.$store.commit("baddcard/BCHANGEHOMEBTN",false); 
            }
            if(this.adddata.add_debitName!=""){
                this.$store.commit("baddcard/BCHANGEHOMEBTN",true);
            }
            var cardNum = this.adddata.add_cardNo.replace(/\s/g,"");
            if(cardNum.length == 10){
                this.$refs.cardnumber.blur();
                this.$store.dispatch("baddcard/bupdatedebitname",{
                    cardNum:cardNum
                });
            } 
        },
        // 卡号校验
        checkCard(){ 
            var cardNum = this.adddata.add_cardNo.replace(/\s/g,"");
            if(this.adddata.add_cardNo==""){
                this.$store.commit("baddcard/BADDALERT",{show: true, msg: '卡号不能为空', err: ''});
            }
            // else if(!/\d{16,20}/.test(cardNum)){
            //     this.$store.commit("baddcard/BADDALERT",{show: true, msg: '输入卡号格式不正确(16-20位数字)', err: ''});
            // }
        },
        // 清空卡号
        deleteCardNo(){   
            this.$store.commit("baddcard/BCHANGECARDNO","");
            this.$store.commit("baddcard/BCHANGEHOMEBTN",false);
            this.deleteShow = false;
        },
        // 选择银行
        selectBank(){     
            var obj = this.addInfo;
            this.$router.push({path:'/TimLee/selectPage?Sdata='+JSON.stringify(obj)});
        },
        // 新增借记卡
        checkInfo(){
            var cardNum = this.adddata.add_cardNo.replace(/\s/g,"");
            if(this.adddata.add_cardNo==""){
                this.$store.commit("baddcard/BADDALERT",{show: true, msg: '卡号不能为空', err: ''});
            }else if(!/\d{16,20}/.test(cardNum)){
                this.$store.commit("baddcard/BADDALERT",{show: true, msg: '输入卡号格式不正确(16-20位数字)', err: ''});
            }else if(this.adddata.add_debitName==""){
                this.$store.commit("baddcard/BADDALERT",{show: true, msg: '请选择发卡银行', err: ''});
            }else{
                this.$store.dispatch('baddcard/baddbcard',{
                    adddata:this.adddata,
                    add_cardNo:this.adddata.add_cardNo.replace(/\s/g,""),
                    add_debitName:this.adddata.add_debitName,
                    router:this.$router
                });
                // track("TimLee_Addfinish","添利三号借记卡完成按钮");
            }
        },
        // 关闭错误弹框
        confirm_add(){
            this.$store.commit("baddcard/BADDALERT",{show: false, msg: '', err: ''});
        }
    },
    components:{
        YFunctionBtn,
        YErrorAlert,
        YVersion
    }
}
</script>
<style scoped>
.main{background:#F3F5F9;width: 100%;height: 100%;box-sizing: border-box;}
.bg-fixed{position: fixed;overflow: hidden;top:0;left:0;bottom:0;right:0;}
.user-info{background: #FFF;padding:0 5.3%;box-sizing: border-box;overflow: hidden;}
.user-info .info-blank{height: 0.01rem;background: #EAEAEA;width: 150%;}
.user-info .info-cell{height: 0.55rem;font-size: 0.15rem;line-height: 0.55rem;}
.user-info .te{color:#666;}
.user-info .te2 .info-left{color:#333;}
.user-info .info-cell .info-left{width: 0.65rem;margin-right: 0.25rem;float: left;}
.user-info .info-cell .info-middle{display: inline-block;}
.user-info .info-cell .info-middle input{border: none;width: 2.1rem;font-size: 0.15rem;height: 0.24rem;line-height: 0.24rem;}
.user-info .info-cell .info-right{float:right;}
.user-info .info-cell .info-right .info-delete{width: 0.16rem;}
.user-info .info-cell .info-right .info-arrow{ width: 0.071rem;}
.info-txt{margin:0.085rem 0 0.24rem;padding:0 5.3%;display: flex;}
.info-txt img{width:0.17rem;height: 0.17rem;position: relative;top:0.02rem;margin-right: 0.08rem;}
.info-txt span{font-size: 0.13rem;color: #666;line-height: 0.18rem;}
.btn{padding:0 5.3%;}
.complete{display: block;background: #CCD0DB;border-radius: 0.22rem;height: 0.45rem;line-height: 0.45rem;font-size: 0.16rem;
color: #E8EBF1;text-align: center;}
</style> 