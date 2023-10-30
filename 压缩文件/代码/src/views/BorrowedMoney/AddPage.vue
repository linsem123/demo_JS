<template>
    <div class="header bg-fixed">
        <div class="remind-info">请持卡人绑定本人银行卡</div>
        <div class="user-info">
            <div class="info-cell clear">
                <div class="info-left">
                    <label for="owncard">持卡人</label>
                </div>
                <div class="info-middle">
                    <span>{{addData.hascardName}}</span>
                </div>
            </div>
            <div class="info-blank"></div>
            <div class="info-cell clear">
                <div class="info-left">
                    <label for="cardnumber">卡号</label>
                </div>
                <div class="info-middle">
                    <input type="tel" placeholder="请输入您的卡号" pattern="[0-9]*" id="cardnumber" @input="renew" v-model="addData.add_cardNo" @blur="checkCard">
                </div>
                <div class="info-right" v-show="deleteShow">
                    <img src="@/assets/images/borrowedMoney/delete.png" alt="" class="info-delete" @click="deleteCardNo">
                </div>
            </div>
            <div class="info-blank"></div>
            <div class="info-cell clear">
                <div class="info-left">
                    <label for="owncard">发卡行</label>
                </div>
                <div class="info-middle" @click="selectBank">
                    <input type="text" placeholder="请选择发卡银行" readonly="readonly" id="bank" v-model="addData.add_debitName">
                </div>
                <div class="info-right" @click="selectBank">
                    <img src="@/assets/images/borrowedMoney/arrow.png" alt="" class="info-arrow">
                </div>
            </div>
        </div>
        <YFunctionBtn text="完 成" :dis="addui.disshow" @checktable="checkInfo"></YFunctionBtn>
        <YVersion :version="version" top="10%"></YVersion>
        <YErrorAlert :msg="alert.msg" :err="alert.err" :show="alert.showAlert" @confirm="confirm_add"></YErrorAlert>
    </div>
</template>
<script>
import YFunctionBtn from "../../components/YFunctionBtn";
import YErrorAlert from "../../components/YErrorAlert";
import YVersion from "../../components/YVersion";
import {mapActions,mapState} from "vuex";
import {initsa,track} from "@/assets/js/common.js"; 
export default {
    name: 'AddPage', 
    data(){
        return {
            deleteShow:"",
        }
    },
    components:{
        YFunctionBtn,
        YErrorAlert,
        YVersion
    },
    computed:mapState({
        addData:state => state.brm.add.addData,
        addui:state => state.brm.add.addui,
        alert:state => state.brm.add.alert,
        version: state => state.brm.version
    }),
    created(){
      initsa("随借金添加借记卡");
    },
    methods:{
        // 输入卡号
        renew(){          
            this.addData.add_cardNo = this.addData.add_cardNo.replace(/[^\d]/g,""); // 限制只能输入数字
            this.addData.add_cardNo = this.addData.add_cardNo.replace(/\s/g,"").replace(/(\d{4})(?=\d)/g,"$1 ");
            if(this.addData.add_cardNo!=""){
                this.addData.add_cardNo=this.addData.add_cardNo.length>24?this.addData.add_cardNo.slice(0,24):this.addData.add_cardNo;
                this.deleteShow = true;
            }
            var cardNum = this.addData.add_cardNo.replace(/\s/g,"");
            if(cardNum.length == 10){
                this.$store.dispatch("brm/bupdatedebitname",{
                    cardNum:cardNum
                });
            } 
            if(this.addData.add_debitName!="" && cardNum.length>0){
                this.$store.commit("brm/BCHANGEADDBTN",true);
            }else{
                this.$store.commit("brm/BCHANGEADDBTN",false);
            }
        },
        // 卡号校验
        checkCard(){      
            var cardNum = this.addData.add_cardNo.replace(/\s/g,"");
            if(this.addData.add_cardNo==""){
                this.$store.commit("brm/BADDALERT",{show: true, msg: '卡号不能为空', err: ''});
            }else if(!/\d{16,20}/.test(cardNum)){
                this.$store.commit("brm/BADDALERT",{show: true, msg: '输入卡号格式不正确(16-20位数字)', err: ''});
            }
        },
        // 清空卡号
        deleteCardNo(){   
            this.$store.commit("brm/BEMPTYCARDNO","");
            this.deleteShow = false;
            this.$store.commit("brm/BCHANGEADDBTN",false);
        },
        // 选择银行
        selectBank(){     
            this.$router.push({path:'/BorrowedMoney/SelectPage'});
        },
        // 新增借记卡
        checkInfo(){      
            var cardNum = this.addData.add_cardNo.replace(/\s/g,"");
            if(this.addData.add_cardNo==""){
                this.$store.commit("brm/BADDALERT",{show: true, msg: '卡号不能为空', err: ''});
            }else if(!/\d{16,20}/.test(cardNum)){
                this.$store.commit("brm/BADDALERT",{show: true, msg: '输入卡号格式不正确(16-20位数字)', err: ''});
            }else if(this.addData.add_debitName==""){
                this.$store.commit("brm/BADDALERT",{show: true, msg: '请选择发卡银行', err: ''});
            }else if(this.addData.add_debitName=="兴业银行" && cardNum.length>18){
                this.$store.commit("brm/BADDALERT",{show: true, msg: '本行卡号仅限16-18位数字', err: ''});
            }else{
                this.$store.dispatch('brm/baddbcard',{
                    hascardName:this.addData.hascardName,
                    add_cardNo:this.addData.add_cardNo.replace(/\s/g,""),
                    router:this.$router
                });
                track("BorrowedMoney_addSubmit","随借金借记卡添加按钮");
            }
        },
        // 关闭添加界面错误弹框
        confirm_add(){    
            this.$store.commit("brm/BADDALERT",{show: false, msg: '', err: ''});
        }
    },
}
</script>
<style scoped>
.header{background:#F3F5F9;height: 100%;}
.bg-fixed{position: fixed;overflow: hidden;top:0;left:0;bottom:0;right:0;}
.remind-info{height: 0.35rem;color:#666;font-size: 0.14rem;line-height: 0.35rem;margin-left: 0.2rem;}
.user-info{background: #FFF;padding:0 5.3%;box-sizing: border-box;overflow: hidden;}
.info-blank{height: 0.01rem;background: #EAEAEA;width: 150%;}
.info-cell{height: 0.55rem;font-size: 0.15rem;line-height: 0.55rem;}
.info-left{width: 0.45rem;margin-right: 0.45rem;float: left;}
.info-middle{display: inline-block;}
.info-middle input{border: none;width: 2.1rem;font-size: 0.15rem;height: 0.24rem;line-height: 0.24rem;}
.info-right{float:right;}
.info-delete{width: 0.16rem;}
.info-arrow{ width: 0.071rem;}
</style>