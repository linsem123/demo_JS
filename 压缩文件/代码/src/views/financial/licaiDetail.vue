<template>
    <div class="mx">
        <!-- <div class="mx_title cflex">
            <p :class="mx.type==''?'blue':''" @click="changeType('')">全部</p>
            <p :class="mx.type==1?'blue':''"  @click="changeType(1)">购买</p>
            <p :class="mx.type==2?'blue':''"  @click="changeType(2)">赎回</p>
            <p :class="mx.type==3?'blue':''"  @click="changeType(3)">收益</p>
        </div> -->
        <div class="mx_date">
            <p @click="mx.showDate=!mx.showDate">
                {{mx.dateNow}}
                <img src="@/assets/images/financial/yindex/dropdown.png" />
            </p>
            <ylPicker :showPick="mx.showDate" :columns="mx.dateList" :text="mx.dateNow" @cancel="cancel" @confirm="confirmDate"></ylPicker>
        </div>
        <div class="mx_nolist" v-if="mx.detailList.length<=0">
            <div></div>
            <p>本月无明细</p> 
        </div>
        <ul class="mx_list" v-else>
            <li>
                <dl>
                    <!-- <dt @click="mx.showDate=!mx.showDate">{{}}</dt> -->
                    <dd class="cflex" v-for="(item,index) in mx.detailList" :key="index">
                        <p>
                            {{item.name}}
                            <span>{{item.date}}</span>
                        </p>
                        <p>{{item.amount}}份</p>
                    </dd>
                </dl>
            </li>
        </ul>
        <YVersion top="" :version="yindex.version"></YVersion>
        <YErrorAlert :msg="alert.msg" :err="alert.err" :show="alert.show" @confirm="closeAlert"></YErrorAlert>
    </div>
</template>
<script>
import {mapState} from "vuex";
import YVersion from "@/components/YVersion";
import YErrorAlert from "@/components/YErrorAlert";
import ylPicker from "@/components/ylPicker";
import {makeOneYear,initsa,track} from "@/assets/js/common";
export default {
    name:"licaiDetail",
    data(){
        return{}
    },
    created(){
        this.init('');
        //时间控件数据 赋值dateNow
        let dateArr = makeOneYear(1);
        this.$store.commit("yindex/SET_DATELIST",dateArr)
        initsa("理财明细");
    },
    mounted(){

    },
    methods:{
        init(n){
            let d = new Date();
            this.$store.commit("yindex/SET_BASEDATA",{
                year:d.getFullYear(),   
                month:d.getMonth()+1,
            });
            this.$store.dispatch("yindex/bankDetail",this.baseData);
        },
        changeType(n){  //切换类型
            if(n==this.mx.type){return}
            this.init(n);
            this.$store.commit("yindex/SET_MXTYPE",n);
        },
        closeAlert(){
            let obj = {
                show: false,
                msg:'',
                err:''
            };
            this.$store.commit("yindex/SET_ALERT", obj);
        },
        cancel(){ //取消选择
            let obj = {
                showDate:false,     //隐藏picker
                dateNow:this.mx.dateNow,  //当前选择
            }
            this.$store.commit("yindex/SET_DATECONFIRM",obj);
        },
        confirmDate(data){
            let obj = {
                showDate:false,     //隐藏picker
                dateNow:data.text,  //当前选择
            }
            this.$store.commit("yindex/SET_DATECONFIRM",obj);
            let year = Number(data.text.slice(0,4));
            let mon = Number(data.text.slice(5,7));
            this.$store.commit("yindex/SET_BASEDATA",{
                year:year,   
                month:mon,
            });
            this.$store.dispatch("yindex/bankDetail",this.baseData);
            
        },
    },
    computed:{
        ...mapState({
            yindex:state=>state.yindex.yindex,
            baseData:state=>state.yindex.baseData,
            alert: state => state.yindex.alert,
            mx:state=>state.yindex.licaiDetail
        })
    },
    components:{
        YVersion,YErrorAlert,ylPicker
    },
}
</script>
<style scoped>
    .mx{
        width: 100%;
        height: 100%;
        background: #F3F5F9;
        display: flex;
        flex-direction: column;
        padding-top: 0.1rem;
        box-sizing: border-box;
    }
    .mx_title{
        width: 100%;
        height:0.45rem;
        background: #fff;
        box-shadow: 0 0.02rem 0.04rem 0.01rem rgba(172,172,172,0.06);
        border-bottom: 0.005rem solid #EAEAEA;
    }
    .mx_title p{
        font-family: PingFangSC-Medium;
        font-size: 0.15rem;
        color: #666;
        letter-spacing: 0;
        text-align: center;
        width: 25%;
        height: 100%;
        line-height:0.45rem;
    }
    .mx_title p.blue{
        color:#5084FF;
        border-bottom: 0.03rem solid #5084FF;
        box-sizing: border-box;
    }
    .mx_date{
        width: 100%;
        height:0.5rem;
        line-height: 0.5rem;
        background: #fff;
        box-shadow: 0 0.02rem 0.04rem 0.01rem rgba(172,172,172,0.06);
        border-bottom: 0.005rem solid #EAEAEA;
        padding-left: 5.3%;
        box-sizing: border-box;
        font-size: 0.16rem;
        font-weight: 500;
        
    }
    .mx_date img{
        display: inline-block;
        width:0.15rem;
    }
    .mx_list,.mx_nolist{
        flex: 1;
        overflow: scroll;
    }
    .mx_list dt{
        width: 100%;
        height: 0.38rem;
        line-height: 0.38rem;
        font-family: PingFangSC-Regular;
        font-size: 0.16rem;
        color: #666666;
        letter-spacing: -0.0047rem;
        padding: 0 5.3%;
    }
    .mx_list dd{
        padding: 0.16rem 5.3%;
        background: #fff;
        border-bottom: 0.005rem solid #EAEAEA;
    }
    .mx_list dd:not(nth-last-child(1)){
        border:none
    }
    .mx_list dd>p:nth-child(1){
        width: 20%;
    }
    .mx_list dd>p:nth-child(1){
        font-family: PingFangSC-Regular;
        font-size: 0.15rem;
        color: #333333;
        letter-spacing: -0.0044rem;
        text-align: left;
    }
    .mx_list dd>p:nth-child(1) span{
        font-family: PingFangSC-Regular;
        font-size: 0.12rem;
        color: #999999;
        letter-spacing: 0;
    }
    .mx_list dd>p:nth-child(2){
        flex:1;
        font-family: PingFangSC-Medium;
        font-size: 17px;
        color: #000000;
        letter-spacing: 0;
        text-align: right;
    }
    .mx_nolist{
        background: #F3F5F9;
    }
    .mx_nolist>div{
        width: 37.6%;
        height: 20%;
        background: url("../../assets/images/financial/yindex/nolist.png") no-repeat center;
        background-size: 100% 100%;
        margin: 0.8rem auto;
    }
    .mx_nolist>p{
        text-align: center;
        color:#999;
        font-size: 0.14rem;
    }

</style>
