<template>
    <div class="header bg-fixed">
        <div class="remind-info">请持卡人绑定本人银行卡</div>
        <div class="user-info">
            <div class="info-cell clear">
                <div class="info-left">
                    <label for="owncard">持卡人</label>
                </div>
                <div class="info-middle">
                    <span>{{adata.hascardName}}</span>
                </div>
            </div>
            <div class="info-blank"></div>
            <div class="info-cell clear">
                <div class="info-left">
                    <label for="cardnumber">卡号</label>
                </div>
                <div class="info-middle">
                    <input type="tel" placeholder="请输入您的卡号" pattern="[0-9]*" id="cardnumber" @input="renew" v-model="adata.add_cardNo" @blur="checkCard">
                </div>
                <div class="info-right" v-show="deleteShow">
                    <img src="@/assets/images/lendcash/delete.png" alt="" class="info-delete" @click="deleteCardNo">
                </div>
            </div>
            <div class="info-blank"></div>
            <div class="info-cell clear">
                <div class="info-left">
                    <label for="owncard">发卡行</label>
                </div>
                <div class="info-middle" @click="selectBank">
                    <input type="text" placeholder="请选择发卡银行" readonly="readonly" id="bank" v-model="adata.add_debitName">
                </div>
                <div class="info-right" @click="selectBank">
                    <img src="@/assets/images/lendcash/arrow.png" alt="" class="info-arrow">
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
        adata:state => state.lc.add.adata,
        addui:state => state.lc.add.addui,
        alert:state => state.lc.add.alert,
        version: state => state.lc.version
    }),
    created(){
      initsa("预借现金添加借记卡"); //初始化监听
    },
    methods:{
        renew(){          // 输入卡号
            this.adata.add_cardNo = this.adata.add_cardNo.replace(/[^\d]/g,""); // 限制只能输入数字
            this.adata.add_cardNo = this.adata.add_cardNo.replace(/\s/g,"").replace(/(\d{4})(?=\d)/g,"$1 ");
            if(this.adata.add_cardNo!=""){
                this.adata.add_cardNo=this.adata.add_cardNo.length>24?this.adata.add_cardNo.slice(0,24):this.adata.add_cardNo;
                this.deleteShow = true;
            }
            var cardNum = this.adata.add_cardNo.replace(/\s/g,"");
            if(cardNum.length == 10){
                this.$store.dispatch("lc/bupdatedebitname",{
                    cardNum:cardNum
                });
            } 
            if(this.adata.add_debitName!="" && cardNum.length>0){
                this.$store.commit("lc/BCHANGEADDBTN",{status:true});
            }else{
                this.$store.commit("lc/BCHANGEADDBTN",{status:false});
            }
        },
        checkCard(){      //卡号校验
            var cardNum = this.adata.add_cardNo.replace(/\s/g,"");
            if(this.adata.add_cardNo==""){
                this.$store.commit("lc/BADDALERT",{show: true, msg: '卡号不能为空', err: ''});
            }else if(!/\d{16,20}/.test(cardNum)){
                this.$store.commit("lc/BADDALERT",{show: true, msg: '输入卡号格式不正确(16-20位数字)', err: ''});
            }
        },
        deleteCardNo(){   // 清空卡号
            this.$store.commit("lc/BEMPTYCARDNO",{cardNo:""});
            this.deleteShow = false;
            this.$store.commit("lc/BCHANGEADDBTN",{status:false});
        },
        selectBank(){     // 选择银行
            this.$router.push({path:'/LendCash/SelectPage'});
        },
        checkInfo(){      // 新增借记卡
            var cardNum = this.adata.add_cardNo.replace(/\s/g,"");
            if(this.adata.add_cardNo==""){
                this.$store.commit("lc/BADDALERT",{show: true, msg: '卡号不能为空', err: ''});
            }else if(!/\d{16,20}/.test(cardNum)){
                this.$store.commit("lc/BADDALERT",{show: true, msg: '输入卡号格式不正确(16-20位数字)', err: ''});
            }else if(this.adata.add_debitName==""){
                this.$store.commit("lc/BADDALERT",{show: true, msg: '请选择发卡银行', err: ''});
            }else if(this.adata.add_debitName=="兴业银行" && cardNum.length>18){
                this.$store.commit("lc/BADDALERT",{show: true, msg: '本行卡号仅限16-18位数字', err: ''});
            }else{
                this.$store.dispatch('lc/baddbcard',{
                    hascardName:this.adata.hascardName,
                    add_cardNo:this.adata.add_cardNo.replace(/\s/g,""),
                    router:this.$router
                });
                track("LendCash_Addsubmit","预借现金借记卡添加按钮");
            }
        },
        confirm_add(){    // 关闭添加界面错误弹框
            this.$store.commit("lc/BADDALERT",{show: false, msg: '', err: ''});
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
