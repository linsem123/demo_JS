<template>
    <div class="contain">
        <div class="top">
            <p class="p1"><img src="../../../assets/images/financial/opendoor/kh.png" alt=""></p>
            <p class="p2">开户成功</p>
            <p class="p3">您的添利账户卡号为&nbsp;&nbsp;{{homepage.cardNo}}</p>
        </div>
        <YFunctionBtn :text="handlebtn.text" :dis="handlebtn.dis" v-on:checktable="definite"></YFunctionBtn>
    </div>
</template>
<script>
import YFunctionBtn from "@/components/YFunctionBtn.vue";
import {mapActions,mapState,mapGetters} from "vuex";
export default {
    name:"Success",
    components:{YFunctionBtn},
    data(){
        return{

        }
    },
    methods:{
        definite(){}

    },
    computed:{
    ...mapState({
        handlebtn:state => state.open.handlebtn,
        homepage:state=>state.open.homepage,
        
       
      }),
  },
  created(){
      console.log(this.handlebtn)
      console.log("传过来的值",JSON.parse(this.$route.query.value));
       let val = JSON.parse(this.$route.query.value) ;
       this.homepage.cardNo = val.cardNo;
  }

    
}
</script>
<style scoped>
.contain{
    background: #F3F5F9;
    overflow: hidden;
    height: 100%;
}
.top{
    padding-top: 0.6rem;
    background: #fff;
}
.top p{
    text-align: center;
}
.p1{
    margin: 0 auto;
    width: 2.8rem;
    height: 2.3rem;
}
.p1 img{
    width: 2.4rem;
    height: 2rem; 
}
.p2{
    margin-top: 0.3rem;
    font-family: PingFangSC-Regular;
    font-size: 0.18rem;
    color: #000000;
    letter-spacing: 0;
    text-align: center;
}
.p3{
    margin-top: 0.16rem;
    padding-bottom: 0.2rem;
    font-family: PingFangSC-Medium;
    font-size: 0.13rem;
    color: #999999;
    letter-spacing: 0.16px;
}
</style>


