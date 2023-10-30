<template>
  <div class="creditcard-select">
    <div class="select-title clear">
      <a href="javascript:;" id="cancel" @click="Cancel">取消</a>
      <span>选择信用卡</span>
    </div>
    <ul class="select-list">
      <li v-for="(item,index) in creditList"  :key="index" @click="changeChosed(item,index)">
        <img src="@/assets/images/logo.png" alt="" class="logo">
        <span class="creditcard-txt">{{item.fakeCardNo}}</span>
        <img src="@/assets/images/chose.png" alt="" v-show="choseShow==index" class="chosed"> 
      </li>
    </ul>
  </div>
</template>
<script>
  import {mapActions,mapState} from "vuex";
  import _ from "lodash";
  export default {
    name: "creditSelect",
    data() {
      return {
        //绑定数据
        choseShow: 0, // 当choseShow = index v-show为true
      };
    },
    computed:mapState({
      laystatu:state => state.a.home.menu.laystatu,
      creditstatu:state => state.a.home.menu.creditstatu,
      creditList:state => state.a.public.ui.creditList
    }),
    methods:{
      changeChosed(item,index){
        _.forEach(this.creditList,(item2,i) => {
          if(index==i){
            this.choseShow = index;
            this.$emit("getcreditcard",{"realCardNo":item2.realCardNo,"fakeCardNo":item2.fakeCardNo});
          }
        });
        this.$store.dispatch("hidecredit",{
          laystatu:this.laystatu,
          creditstatu:this.creditstatu
        });
      },
      Cancel(){
        this.$store.dispatch("hidecredit",{
          laystatu:this.laystatu,
          creditstatu:this.creditstatu
        });
      }
    },
  };
</script>

<style scoped>
.creditcard-select{background: #fff;width: 100%;height: 2.66rem;z-index: 999;position: absolute;bottom: 0;color: #333;}
.select-title{height:0.5rem;line-height:0.5rem;text-align: center;border-bottom: 0.01rem solid #DEDEDE;}
#cancel{position: absolute;left: 0.2rem;font-size: 0.15rem;color: #999;}
.select-title span{font-size: 0.17rem;color: #333;}
.select-list {height: 2.15rem;overflow: scroll;}
.select-list li {height: 0.63rem;line-height: 0.63rem;border-bottom: 0.01rem solid #EAEAEA;}
.select-list li:last-child{border: none;}
.logo{width: 0.28rem;position: relative;left: 0.3rem;}
.creditcard-txt{display: inline-block;width: 2.23rem;margin-left: 0.4rem;font-size: 0.15rem;}
.chosed{width: 0.15rem;margin-left: 0.4rem;}
</style>
