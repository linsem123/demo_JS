// 信用卡选择框
// ctitle 弹框名称
// cardNo 信用卡号
// creditList 信用卡列表
// choseShow 选中状态--当前选中的信用卡对应的索引，当切换信用卡时，保留被切换到的信用卡的索引，建议把此值放在state中保存
<template lang="pug">
  <div id="credit">
    <div class="title" @click="showCredit">
      <img src="@/assets/images/lendcash/logo.png" alt="" class="logo">
      <span class="creditcardNum">{{cardNo}}</span>
      <img src="@/assets/images/lendcash/dropdown.png" alt="" class="down">
    </div>
    <div class="creditcard-select" v-show="creditShow">
      <div class="select-title clear">
        <a href="javascript:;" id="cancel" @click="Cancel">取消</a>
        <span>{{ctitle}}</span>
      </div>
      <ul class="select-list">
        <li v-for="(item,index) in creditList"  :key="index" @click="changeChosed(item,index)">
          <img src="@/assets/images/logo.png" alt="" class="logo">
          <span class="creditcard-txt">{{item.cardNo}}</span>
          <img src="@/assets/images/chose.png" alt="" v-show="choseShow==index" class="chosed"> 
        </li>
      </ul>
    </div>
    <div class="layer" v-show="layShow"></div>
  </div>
</template>

<script>
export default {
  name: "BcreditSelect",
  props: ['cardNo','creditList','choseShow','ctitle'],
  data(){
    return{
      creditShow:false,
      layShow:false,
      // choseShow: 0, // 当choseShow = index v-show为true
    } 
  },
  methods: {
    changeChosed(item,index){
      _.forEach(this.creditList,(item2,i) => {
        if(index==i){
          // this.choseShow = index;
          this.$emit("getcreditcard",{"cardKey":item2.cardKey,"cardNo":item2.cardNo,"index":index});
        }
      });
      this.layShow = false;
      this.creditShow = false;
    },
    showCredit(){   // 显示列表
      this.layShow = true;
      this.creditShow = true;
    },
    Cancel(){       // 取消
      this.layShow = false;
      this.creditShow = false;
    }
  }
}
</script>

<style scoped>
.title{height: 0.44rem;line-height: 0.44rem;padding:0 5.3%;box-sizing: border-box;}
.title .logo{width:0.28rem;margin-right: 0.13rem;left: 0;}
.title .creditcardNum{font-size: 0.16rem;display: inline-block;}
.title .down{width: 0.13rem;float: right;margin-top: 0.21rem;}
.creditcard-select{background: #fff;width: 100%;height: 2.66rem;z-index: 999;position: absolute;bottom: 0;color: #333;}
.select-title{height:0.5rem;line-height:0.5rem;text-align: center;border-bottom: 0.01rem solid #DEDEDE;}
#cancel{position: absolute;left: 0.2rem;font-size: 0.15rem;color: #999;}
.select-title span{font-size: 0.17rem;color: #333;}
.select-list {height: 2.15rem;overflow: scroll;}
.select-list li {height: 0.63rem;line-height: 0.63rem;border-bottom: 0.01rem solid #EAEAEA;}
/* .select-list li:last-child{border: none;} */
.logo{width: 0.28rem;position: relative;left: 0.3rem;}
.creditcard-txt{display: inline-block;width: 2.23rem;margin-left: 0.4rem;font-size: 0.15rem;}
.chosed{width: 0.15rem;margin-left: 0.4rem;}
.layer{width: 100%;height: 100%;z-index: 100;position: fixed;top: 0;left: 0;display: block;background: #000;opacity: 0.4;}
</style>
