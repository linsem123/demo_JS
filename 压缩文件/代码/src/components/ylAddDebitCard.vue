<template>
    <ylAddDebit v-if="iSearch" :name="addDebit.name" :title="addDebit.title" :formData="addDebit.formData" :version="addDebit.version" @search="search"></ylAddDebit>
    <ylSearchBankPage :title="addDebit.title"  :version="addDebit.version" :bankList="searchBank.bankList" :searchResult="searchBank.searchResult" @search="search" v-else></ylSearchBankPage>
</template>
<script>
import ylAddDebit from "./ylAddDebit";
import ylSearchBankPage from "./ylSearchBankPage";
import {mapState} from "vuex";
export default {
    name:"addDebitCard",
    data(){
        return {
            iSearch:true
        }
    },
    components:{
        ylAddDebit,
        ylSearchBankPage
    },
    computed:{
        ...mapState({
            addDebit:state => state.addDebitCard,
            searchBank:state => state.searchBank
        })
    },
    created(){},
    methods:{
        search(){
            this.iSearch=!this.iSearch;
        }
    },


}
</script>
<style scoped>
.main{background:#F3F5F9;
height:100%;
width:100%;}
</style>
