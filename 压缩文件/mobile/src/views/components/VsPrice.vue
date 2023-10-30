<template>
<!-- 价格对比 -->
<div class="vs-pannel-wrap">
  <div class="vs-wrap" v-if="product_price">
    <div class="left-price-wrap">
      <p class="price-line-1">
        <span class="price">{{product_price}}</span>
        <span class="unit">元/克</span>
      </p>
      <p class="price-line-2">今日金价<span>(含加工费)</span></p>
    </div>
    <div class="right-price-wrap">
      <p class="price-line" v-for="brand in threeparty_brand">
        <span class="price">{{brand.price_range}} <i>元/克</i></span>
        <span class="title">{{brand.brandName}}</span>
      </p>
    </div>
  </div>
</div>
<!-- 价格对比 -->

</template>

<script>
import { Toast } from "mint-ui";

export default {
  props:["refresh",],
  components: {},
  data() {
    return {
      product_price:"",
      threeparty_brand:[],
    };
  },
  computed: {
    
  },
  mounted() {
    // this.init();
  },
  watch:{
    refresh:function(nval,oval){
      this.init();
    },
  },
  methods: {
    init(){
      this.getProductPrice();
      this.getBrandPrice();
    },
    /************今日金价获取**************/
    getProductPrice:function(){
      var me = this;
      utils.API.product_getUnitPrice({
        data: {
          "reqBody":{
            "productName":"G",
          }
        }
      })
      .then(function(ret) {
        me.product_price = ret.model.price;
       
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    /************今日金价获取**************/

    /************品牌价格获取***************/
    culBrandPriceRange:function(list){
      let range = [0,0],
          res = "";

      list.forEach(function(item,index){
        if(index == 0){
          range[0] = range[1] = Number(item.price);
        }else{
          if(Number(item.price) < range[0]){
            range[0] = Number(item.price);
          }
          if(Number(item.price) > range[1]){
            range[1] = Number(item.price);
          }
        }
      });

      if(range[0]==range[1]){
        res = range[0];
      }else{
        res = range.join("-");
      }
      return res;
    },
    getBrandPrice:function(){
      var me = this;
      utils.API.brand_getPrice({
        data: {
          "reqBody":{
            "productName":"G",
          }
        }
      })
      .then(function(ret) {
        ret.model.items.forEach(function(item){
          item.price_range = me.culBrandPriceRange(item.list).toFixed(2);
        })
        me.threeparty_brand = ret.model.items;
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    /************品牌价格获取***************/
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";
.vs-pannel-wrap {
  // margin-top:0.16rem;
  padding:0;
  display: flex;
  align-items: center;
  background:#ffffff;
  .vs-wrap {
    width: 100%;
    // height:1.4rem;
    position: relative;
    display:flex;
    justify-content: space-between;
    align-items: center;
    .left-price-wrap {
      width: 3.2rem;
      // height:1.4rem;
      background:#fdfaf1;
      border-radius: 0.1rem;
      box-sizing: border-box;
      padding:0.2rem 0 0.2rem 0.4rem;
      .price-line-1 {
        .price {
          font-size:0.48rem;
          line-height: 0.48rem;
          color:#fe6600;
          font-weight: bold;
        }
        .unit {
          font-size:0.24rem;
          line-height: 0.24rem;
          color:#fc8025;
          font-weight: bold;
        }
      }
      .price-line-2 {
        margin-top:0.15rem;
        font-size:0.3rem;
        line-height: 0.3rem;
        font-weight: bold;
        span {
          font-size:0.24rem;
          line-height: 0.24rem;
        }
      }
    }
    .right-price-wrap {
      width: 3.44rem;
      // height:1.4rem;
      background:#fdfaf1;
      border-radius: 0.1rem;
      box-sizing: border-box;
      padding:0.2rem 0 0.2rem 0.28rem;
      // display: flex;
      // flex-direction: column;
      // justify-content: space-between;
      .price-line {
        margin-bottom:0.14rem;
        &:last-child {
          margin-bottom:0;
        }
        .title {
          font-weight: bold;
          font-size:0.24rem;
          margin-left:0.1rem;
        }
        .price {
          color:#fea22c;
          font-weight: bold;
          font-size:0.36rem;
          line-height: 0.36rem;
          i {
            font-style: normal;
            color:#fea22c;
            font-size:0.26rem;
            line-height: 0.26rem;
          }
        }
      }
    }
  }
}
</style>