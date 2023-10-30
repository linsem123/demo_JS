// 输入选择框
selectTitle     选择框标题
discountText    选择框优惠内容
selectText      选择框内容
listTitle       列表标题
selectList      可选列表
discount        是否优惠
choseShow       默认选择的索引
<template lang="pug">
    <div id="input-select">
        <div class="input-select clear" @click="showSelect">
            <div class="select-left">
                <span>{{selectTitle}}</span>
            </div>
            <div class="select-discount" v-show="discount">
                //- 预留字段,默认优惠内容为空
                <span>{{discountText}}</span>
            </div>
             <div class="select-middle">
                <span>￥{{selectText}}起</span>
            </div>
            <div class="select-right">
                <img src="@/assets/images/autostage/arrow.png" alt="">
            </div>
        </div>
        <div class="select-input" v-show="selectShow">
            <div class="select-title clear">
                <a href="javascript:;" id="cancel" @click="Cancel">取消</a>
                <span>{{listTitle}}</span>
            </div>
            <ul class="select-list">
                <li v-for="(item,index) in selectList" :key="index" @click="changeChosed(item,index)">
                    <span class="list-left">￥{{item.money}}起</span>
                    <div class="list-discount" v-show="discount">
                        //- 预留字段,默认优惠内容为空
                        <span></span>  
                    </div>
                    <img src="@/assets/images/autostage/chose.png" alt="" v-show="choseShow==index">
                </li>
            </ul>
        </div>
        <div class="layer" v-show="layShow"></div>
    </div>
</template>

<script>
export default {
  name: "BinputSelect",
  props: ["selectTitle","discountText","selectText","listTitle","selectList","discount","choseShow"],
  data(){
    return{
        selectShow:"",
        layShow:"",
    } 
  },
  methods: {
        changeChosed(item,index){
            _.forEach(this.selectList,(item2,i) => {
                if(index==i){
                    this.$emit("getselect",{"money":item2.money,"index":index});
                }
            });
            this.selectShow = false;
            this.layShow = false;
        },
        showSelect(){
            this.selectShow = true;
            this.layShow = true;
        },
        Cancel(){
            this.selectShow = false;
            this.layShow = false;
        }
  }
}
</script>

<style scoped>
/* 选择框 */
.input-select{padding:0 5.3%;position: relative;}
.input-select .select-left{float: left;font: 0.15rem/0.24rem "";height: 0.24rem;}
.input-select .select-left span{position: relative;top: 0.015rem;}
.input-select .select-discount{position: absolute;left:43.7%;background: #FFFFFF;border: 0.01rem solid #E8541E;border-radius: 0.13rem;
top: 0.02rem;}
.input-select .select-discount span{font-size: 0.09rem;color: #E8541E;letter-spacing: 0;text-align: center;padding:0 0.07rem;
position: relative;top: -0.01rem;}
.input-select .select-middle{position: absolute;right: 10.9%;font: 0.15rem/0.24rem "";height: 0.24rem;}
.input-select .select-middle span{position: relative;top: 0.015rem;}
.input-select .select-right{float: right;}
.input-select .select-right img{width:0.072rem;position: relative;top:0.03rem;}
.layer{width: 100%;height: 100%;z-index: 100;position: fixed;top: 0;left: 0;display: block;background: #000;opacity: 0.4;}
/* 列表 */
.select-input{background: #fff;width: 100%;height: 3.02rem;z-index: 600;position: absolute;bottom: 0;color: #333;}
.select-input .select-title{height: 0.52rem;text-align: center;border:0.01rem solid #EEE;}
.select-input .select-title span{font-size: 0.17rem;line-height: 0.52rem;}
#cancel{position: absolute;left: 5.3%;top:0.18rem;font-size: 0.15rem;color: #999;letter-spacing: -0.0036rem;}
.select-list {padding-left: 5.3%;height: 2.28rem;overflow: scroll;}
.select-list li{height: 0.56rem;border-bottom:0.01rem solid #EEE;position: relative;}
.select-list li .list-left {font-size: 0.15rem;color: #333;letter-spacing: 0.0018rem;line-height: 0.56rem;}
.select-list li .list-discount{position: absolute;left: 23.7%;background: #FFFFFF;border: 0.01rem solid #E8541E;
border-radius: 0.13rem;top:0.19rem;}
.select-list li .list-discount span{font-size: 0.09rem;color: #E8541E;padding:0 0.07rem;}
.select-list li img{position: absolute;right: 5.3%;width: 0.14rem;top:0.2rem;}
</style>
