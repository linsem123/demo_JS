<template>
    <YErrorAlert :msg="alert.msg" :err="alert.err" :show="alert.showAlert" @confirm="confirm_home"></YErrorAlert>
</template>
<script>
    // 引入所需的方法、组件
    import {mapActions,mapState} from "vuex";
    import YErrorAlert from "../../components/YErrorAlert";
    import {initsa} from "@/assets/js/common.js"; 
    export default {
        name: 'FreeLoginPage',
        data(){
            return {        
                khid:""      
            }
        },
        computed:mapState({
            alert: state => state.iu.bintang.alert,
        }),
        created(){
            this.initwxHome();                   
        },
        methods:{
            initwxHome(){
                this.khid = initsa("证件有效期更新微信版免登");
                this.$store.dispatch('iu/binitwxhome',{
                    _this:this,
                    khid:this.khid
                });
            },
            confirm_home(){
                this.$store.commit("iu/BWXHOMEALERT",{show:false,msg:"",err:""});
            },
        },
    }
</script>