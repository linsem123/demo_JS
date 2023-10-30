// 分期费率选择框
periodSelect        分期选择
rateSelect          手续费选择
periodTitle         分期标题
rateTitle           手续费标题
perDiscount         分期优惠内容
discountPeriod      是否显示分期优惠
perTxt              分期内容
percentDiscount     百分比费率内容
derateDiscount      减免费率内容
rateTxt             费率内容
prateList           分期费率列表
choseShow           选中的列表对应索引
differ              判断 分期支付/一次性支付
<template lang="pug">
    <div id="period-rate">
        <div class="select-one">
            <div class="period-select clear" @click="showSelect">
                <div class="select-left">
                    <span>{{periodSelect}}</span>
                </div>
                <div class="select-discount" v-show="discountPeriod">
                    <span>{{perDiscount}}</span>
                </div>
                <div class="select-middle">
                    <span>{{perTxt}}期</span>
                </div>
                <div class="select-right">
                    <img src="@/assets/images/autostage/arrow.png" alt="">
                </div>
            </div>
        </div>    
        <div class="blank"></div>
        <div class="select-one">
            <div class="rate-select clear">
                <div class="select-left">
                    <span>{{rateSelect}}</span>
                </div>
                <div class="select-derate">
                    <span>{{derateDiscount}}</span>
                </div>
                <div class="select-discount">
                    <span>{{percentDiscount}}</span>
                </div>
                <div class="select-middle">
                    <span>{{rateTxt}}%</span><span v-show="differ">/期</span>
                </div>
            </div>
        </div> 
        <div class="select-input" v-show="selectShow">
            <div class="select-title clear">
                <a href="javascript:;" id="cancel" @click="Cancel">取消</a>
                <span></span>
            </div>
            <div class="select-th">
                <span>{{periodTitle}}</span><span>{{rateTitle}}</span>
            </div>
            <ul class="select-list">
                <li v-for="(item,index) in prateList" :key="index" @click="changeChosed(item,index)">
                    <span class="list-left">{{item.period}}期</span>
                    <div class="list-middle">
                        <span>{{item.rate}}%</span><span v-show="differ">/期</span>
                    </div>
                    <div class="list-derate">
                        <span>{{item.reduce}}</span>
                    </div>
                    <div class="list-percent" >
                        <span>{{item.discount}}</span>
                    </div>
                    <img src="@/assets/images/autostage/chose.png" alt="" v-show="choseShow==index">
                    <div class="blank2"></div>
                </li>
            </ul>
        </div>
        <div class="layer" v-show="layShow"></div>
    </div>
</template>

<script>
export default {
  name: "BinputSelect",
  props: ["periodSelect","rateSelect","periodTitle","rateTitle","perDiscount","perTxt","percentDiscount",
  "derateDiscount","rateTxt","prateList","choseShow","differ","discountPeriod"],
  data(){
    return{
        selectShow:"",
        layShow:"",
    } 
  },
  methods: {
        changeChosed(item,index){
            _.forEach(this.prateList,(item2,i) => {
                if(index==i){
                    this.$emit("getprate",{"period":item2.period,"rate":item2.rate,"index":index});
                }
            });
            this.selectShow = false;
            this.layShow = false;
        },
        showSelect(){
            this.selectShow = true;
            this.layShow = true;
            this.$emit("periodClick");
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
.select-one{padding:0.16rem 0;}
/* 期数 */
.period-select{padding:0 5.3%;position: relative;}
.period-select .select-left{float: left;font: 0.15rem/0.24rem "";height: 0.24rem;}
.period-select .select-left span{position: relative;top: 0.015rem;}
.period-select .select-discount{position: absolute;left:43.7%;background: #FFFFFF;border: 0.01rem solid #E8541E;border-radius: 0.13rem;
top: 0.02rem;}
.period-select .select-discount span{font-size: 0.09rem;color: #E8541E;letter-spacing: 0;text-align: center;padding:0 0.07rem;
position: relative;top: -0.01rem;}
.period-select .select-middle{position: absolute;right: 10.9%;font: 0.15rem/0.24rem "";height: 0.24rem;}
.period-select .select-middle span{position: relative;top: 0.015rem;}
.period-select .select-right{float: right;}
.period-select .select-right img{width:0.072rem;position: relative;top:0.03rem;}
/* 费率 */
.rate-select{padding:0 5.3%;position: relative;}
.rate-select .select-left{float: left;font: 0.15rem/0.24rem "";height: 0.24rem;}
/* 减免 */
.rate-select .select-derate{position: absolute;left:43.7%;top: 0.03rem;}
.rate-select .select-derate span{font-size: 0.13rem;color: #E8541E;letter-spacing: 0;text-align: center;}
/* 打折 */
.rate-select .select-discount{position: absolute;left:43.7%;background: #FFFFFF;top: 0.03rem;}
.rate-select .select-discount span{font-size: 0.12rem;color: #A2A2A2;letter-spacing: 0;text-align: center;text-decoration:line-through;}
.rate-select .select-middle{position: absolute;right: 10.9%;font: 0.15rem/0.24rem "";height: 0.24rem;}
.blank{height: 0.01rem;background: #EEE;position: relative;left: 5.3%;}
.layer{width: 100%;height: 100%;z-index: 100;position: fixed;top: 0;left: 0;display: block;background: #000;opacity: 0.4;}
/* 列表 */
.select-input{background: #fff;width: 100%;height: 5rem;z-index: 600;position: absolute;bottom: 0;color: #333;}
.select-input .select-title{height: 0.52rem;text-align: center;border:0.01rem solid #EEE;}
.select-input .select-title span{font-size: 0.17rem;line-height: 0.52rem;}
#cancel{position: absolute;left: 5.3%;top:0.18rem;font-size: 0.15rem;color: #999;letter-spacing: -0.0036rem;}
.select-input .select-th{font-size: 0.14rem;color:#666;height: 0.48rem;line-height: 0.48rem;border: 0.01rem solid #EEE;}
.select-input .select-th span:first-child{padding-left: 13.6%;}
.select-input .select-th span:last-child{padding-left: 25.3%;}
.select-list {height: 3.97rem;overflow: scroll;}
.select-list li{height: 0.56rem;position: relative;}
.select-list li .list-left{line-height: 0.56rem;opacity: 0.8;font-size: 0.17rem;color: #000;letter-spacing: 0.002rem;
position: absolute;right: 78.9%;}
.select-list li .list-middle{position: absolute;right: 38.7%;top: 0.16rem;font-size: 0.17rem;line-height: 0.24rem;}
.select-list li .list-derate{position: absolute;right: 21.1%;font-size: 0.12rem;color: #E8541E;line-height: 0.17rem;top:0.19rem;}
.select-list li .list-percent{position: absolute;right: 25.1%;font-size: 0.12rem;line-height: 0.17rem;color:#A2A2A2;top:0.19rem;
text-decoration:line-through;}
.select-list li img{position: absolute;right: 5.3%;width: 0.14rem;top:0.2rem;}
.select-list li .blank2{height: 0.01rem;background: #EEE;position: absolute;top: 0.56rem;left: 11%;width: 89%;}
</style>