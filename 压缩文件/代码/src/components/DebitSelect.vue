<template>
  <div class="debit">
    <div class="debitcard-select">
      <div class="select-title clear">
          <a href="javascript:;" id="cancel" @click="Cancel">取消</a>
          <a href="javascript:;" id="edit" @click="Edit" v-show="editShow">编辑</a>
          <a href="javascript:;" id="finish" @click="Finish" v-show="finishShow">完成</a>
          <span>选择借记卡</span>
      </div>
      <ul class="select-list">
          <li v-for="(item,index) in debitList" :key="index" @click="changeChosed(item,index)" class="clear">
              <p class="debitcard-txt">
                <span class="fakeDebitName">{{item[1].length>11?item[1].slice(0,11)+"...":item[1]}}</span>
                <span class="fakeDebitNo">({{item[0].slice(item[0].length-4,item[0].length)}})</span>
              </p>
              <img src="@/assets/images/chose.png" alt="" v-show="choseShow==index" class="chosed">
              <img src="@/assets/images/remove.png" alt="" class="removed" v-show="removeShow" @click="Remove(index,item[0])">
          </li>
      </ul> 
      <div class="addcard" @click="Addcard">
        <img src="@/assets/images/add.png" alt="" class="addfile" />
        <span class="addtxt">添加借记卡</span>
        <img src="@/assets/images/arrow.png" alt="" class="addarrow" />
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions,mapState} from "vuex";
import _ from "lodash";
export default {
  name: "debitSelect", //选择借记卡
  data() {
    return {
      choseShow: 0, // 当choseShow = index v-show为true
      editShow:true,
      finishShow:false
    };
  },
  computed:mapState({
    laystatu:state => state.a.home.menu.laystatu,
    debitstatu:state => state.a.home.menu.debitstatu,
    deletestatu:state => state.a.home.menu.deletestatu,
    removeShow:state => state.a.public.menu.removeShow,
    debitList:state => state.a.public.ui.debitList,
  }),
  methods:{
    changeChosed(item,index){
      _.forEach(this.debitList,(item2,i) => {
        if(index==i){
          this.choseShow = index;
          this.$emit("getdebitcard",item2);
        }
      });
      if(this.removeShow!=true){
        this.$store.dispatch("hidedebit",{
          laystatu:this.laystatu,
          debitstatu:this.debitstatu
        });
      }
    },
    Cancel(){
      this.$store.dispatch("hidedebit",{
        laystatu:this.laystatu,
        debitstatu:this.debitstatu,
        removeShow:this.removeShow
      });
    },
    Edit(){
      this.editShow = false;
      this.finishShow = true;
      this.$store.dispatch("showtrash",{
        removeShow:this.removeShow
      });
    },
    Finish(){
      this.editShow = true;
      this.finishShow = false;
      this.$store.dispatch("hidetrash",{
        removeShow:this.removeShow
      });
      this.$store.dispatch("hidedebit",{
        laystatu:this.laystatu,
        debitstatu:this.debitstatu,
        removeShow:this.removeShow
      });
    },
    Remove(index,item){
      this.$store.dispatch("showdelete",{
        laystatu:this.laystatu,
        debitstatu:this.debitstatu
      });
      this.$emit("changedebit",{"index":index,"kaNum":item});
    },
    Addcard(){
      this.$router.push({path:'/Enjoyloan/AddPage'});
      this.$store.dispatch("hidedebit",{
        laystatu:this.laystatu,
        debitstatu:this.debitstatu
      });
    }
  },
};
</script>

<style scoped>
.debitcard-select {background: #fff;width: 100%;height: 2.66rem;z-index: 600;position: absolute;bottom: 0;color: #333;}
.debitcard-select .select-title {height: 0.5rem;line-height: 0.5rem;text-align: center;border-bottom: 0.01rem solid #dedede;}
#cancel {position: absolute;left: 0.2rem;font-size: 0.15rem;color: #999;letter-spacing: 0.0018rem;}
#edit {position: absolute;right: 0.2rem;font-size: 0.15rem;color: #0060f1;letter-spacing: 0.0018rem;}
#finish {position: absolute;right: 0.2rem;font-size: 0.15rem;color: #0060f1;letter-spacing: 0.0018rem;}
.select-title span {font-size: 0.17rem;color: #333;}
.select-list{height: 1.28rem;overflow: scroll;}
.select-list li {height: 0.63rem;line-height: 0.63rem;border-bottom: 0.01rem solid #eaeaea;position: relative;}
.logo{width: 0.28rem;position: relative;left: 0.3rem;}
.debitcard-txt {display: inline-block;width: 3rem;margin-left: 0.2rem;font-size: 0.15rem;}
.layer {width: 100%;height: 100%;z-index: 100;position: fixed;top: 0;left: 0;display: block;background: #000;opacity: 0.4}
.removed{width: 0.19rem;position: absolute;top:0.23rem;right: 0.25rem;}
.chosed {width: 0.15rem;position: absolute;top:0.25rem;right: 0.27rem;}
.addcard{height: 0.21rem;line-height: 0.21rem;margin: 0.2rem 0;position: relative;}
.addfile{width: 0.24rem;position: relative;left: 0.2rem;top: -0.03rem;}
.addtxt{font-size: 0.15rem;margin-left: 0.3rem;width:2.23rem;display: inline-block;}
.addarrow{width: 0.072rem;position: absolute;top: 0.05rem;right: 0.27rem;}

</style>