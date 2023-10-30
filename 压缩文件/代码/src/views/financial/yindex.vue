<template>
    <div class="yindex">
        <!-- <home v-if="yindex.isRegister==1" @SET_isRegister="SET_isRegister"></home>
        <prodes v-else-if="yindex.isRegister==0"></prodes> -->
        <div class="load" v-if="yindex.isRegister==3">加载失败</div>
        <YErrorAlert :msg="alert.msg" :err="alert.err" :show="alert.show" @confirm="closeAlert"></YErrorAlert>
    </div>
</template>
<script>
import {mapState} from "vuex";
import home from "./home";
import prodes from "./prodes";
import YErrorAlert from "../../components/YErrorAlert";
export default {
    name:"tianli",
    data(){
        return{}
    },
    created(){
         //是否注册添利账号
        this.$store.commit("yindex/SET_BASEDATA",{});
        this.$store.dispatch("yindex/isopened",{data:this.baseData,$router:this.$router}) 
    },
    mounted(){},
    components:{
        home,prodes,YErrorAlert
    },
    methods:{
        closeAlert(){
            let obj = {
                show: false,
                msg:'',
                err:''
            };
            this.$store.commit("yindex/SET_ALERT", obj);
        }
    },
    computed:{
        ...mapState({
            yindex:state=>state.yindex.yindex,
            baseData:state=>state.yindex.baseData,
            alert: state => state.yindex.alert,
        })
    }
}
</script>
<style scoped>
    .yindex{
        width: 100%;
        height: 100%;
    }
    .load{
        color:#666;
    }
</style>

