<template>
  <!-- 特价金 -->
  <div>
    <div class="product-list" v-for="(item,index) in product_list">
      <template v-if="product_list.length>1">
        <div v-if="index!=0" class="page-break" style="width: 100vw;margin-left:-0.24rem;"></div>
      </template>
      <div v-for="schema in item.interest_schema">
        <h4 class="panel-title">
          <span class="title-cell">{{item.goods_name}}{{schema.days||"--"}}天</span>
        </h4>
        <div class="special-product-pannel-wrap" >
          <div class="price-wrap">
            <p class="price-cell">
              <span class="price">{{formatMinPrice(item)||'--.--'}}</span>
              <span class="unit">元/克</span>
            </p>
            <p class="tip-text">限量发售</p>
          </div>
          <a class="buy-btn" :class="theme" href="javascript:void(0);" @click="addToCart(schema,item)">立即买入</a>
        </div>
      </div>
    </div>
    
  <!-- 特价金 -->
  </div>
</template>

<script>
import { Toast } from "mint-ui";

export default {
  props:["refresh","theme",],
  components: {},
  data() {
    return {
      mall_token:"",
      favourable:{},
      product_list:[],
      interest_schema:[],
      selected_interest:{},

      unit_price:0,//每克金价
    };
  },
  computed: {
    seller_id() {
      return this.$store.getters.getSellerId;
    },
    location() {
      return this.$store.getters.getLocation;
    },
    // total(){
    //   let me = this,
    //       total = {
    //         total_price:0,
    //         total_weight:0,
    //         total_interest:0,
    //       };

    //   this.product_list.forEach(function(item){
    //     let price = me.formatedMinPrice(item);
    //     total.total_price += price*item.select_num;
    //     total.total_weight += parseFloat(item.goods_weight)*item.select_num;
    //     // total.total_interest += me.culInterest(item.goods_weight)*item.select_num;
    //   });

    //   total.total_price = total.total_price.toFixed(2);
    //   total.total_interest = me.culInterest(total.total_weight).toFixed(2);

    //   return total;
    // },
    activity_id(){
      return this.favourable.act_id||0;
    },
  },
  mounted() {
    // this.init();
  },
  watch:{
    refresh:function(nval,oval){
      this.init();
    },
    // product_list: {
    //   handler: function (val, oldVal) {
    //     console.log(val)

    //   },
    //   immediate: true,
    // },
  },
  methods: {
    init(){
      this.mall_token = utils.storageGet("mall_token");
      // this.getRecommendList();
      this.getFavourableList((product_list)=>{

        product_list.forEach((goods)=>{
          let index = _.findIndex(this.product_list,function(o){ return o.goods_id == goods.goods_id});

          if(index == -1){
            this.product_list.push(goods);
          }

          this.getProductInterestSchema(this.getSchemaCode(goods),(model)=>{
            // debugger
            // this.$set(product_list[index],"unit_price",model.unitPrice);
            // this.$set(product_list[index],"interest_schema",model.items);

            goods.unit_price = model.unitPrice;
            goods.interest_schema = model.items;

            let index = _.findIndex(this.product_list,function(o){ return o.goods_id == goods.goods_id});
            
            if(index != -1){
              this.product_list.splice(index,1,goods);
            }
          });
        });
      });
    },
    formatMinPrice:function(goods){
      // console.log(goods)
      // debugger
      var min_price = "",
          promote_price = Number(goods.promote_price),
          shop_price = Number(goods.shop_price);

      if(promote_price != 0){
        min_price = promote_price;
      }else{
        min_price = shop_price;
      } 
      return min_price.toFixed(2);// - this.favourable.act_type_ext;
    },

    culTotalTnterest:function(schema,product_list){
      let me = this,
          total = {
            total_price:0,
            total_weight:0,
            total_interest:0,
          };

      product_list.forEach(function(item){
        let price = me.formatedMinPrice(item);
        total.total_price += price*item.select_num;
        total.total_weight += parseFloat(item.goods_weight)*item.select_num;
        total.total_interest += me.culInterest(item,schema,total.total_weight);
        // total.total_interest += me.culInterest(item.goods_weight)*item.select_num;
      });

      total.total_price = total.total_price.toFixed(2);
      total.total_interest = total.total_interest.toFixed(2);

      return total;
    },
    culInterest:function(goods,schema,weight){
      weight = parseFloat(weight);
      let interest = weight*schema.rate*schema.days*goods.unit_price/360;
      
      // interest = interest;
      return interest;
    },

    formatedMinPrice(goods){
      var price = "",
          promote_price = Number(goods.promote_price)||"",
          shop_price = Number(goods.shop_price)||"";

      if(promote_price != 0){
        price = promote_price;
      }else{
        price = shop_price;
      }

      return price.toFixed(2);
    },
    getSchemaCode:function(goods){
      var schema_code = "";

      goods.properties&&goods.properties.forEach(function(cell){
        if(cell.name == "存储类别"){
          schema_code = cell.value;
        }
      })

      return schema_code;
    },
    getProductInterestSchema:function(schema_code,cb){
      var me = this;

      if(!schema_code){
        return;
      }
      
      utils.API.product_getInterestSchema({
        data: {
          "token": me.mall_token,
          "reqBody":{
            name:schema_code,
            schemaCode:schema_code,//方案编码
            type:1,//1:寄存；2：续存
          }
        }
      })
      .then(function(ret) {
        
        // goods = _.assign({},goods,{
        //   unit_price:ret.model.unitPrice,
        //   interest_schema:ret.model.items,
        // })
        // goods.unit_price = ret.model.unitPrice;
        // goods.interest_schema = ret.model.items;

        // me.unit_price = ret.model.unitPrice;
        ret.model.items.forEach(function(item,index){
          item.name = ret.model.name;
        });

        cb&&cb(ret.model);
        // me.interest_schema = ret.model.items;
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    getFavourableList:function(cb){
      var me = this;

      utils.API.favourable_list({
        data:{
          "activity_name": "特价金活动"
        }
      })
      .then(function(ret) {
        // console.log(ret.model);
        me.favourable = ret.model.data&&ret.model.data.length&&ret.model.data[0]||{};
        
        ret.model.data&&ret.model.data.length&&ret.model.data[0].items.forEach(function(item){
          item.select_num = 1;
          // item.default_price = "--.--";
        })

        var product_list = ret.model.data&&ret.model.data.length&&ret.model.data[0].items||[];

        cb&&cb(product_list.slice(0));
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    // checkCartValidate:function(goods_id){
    //   var me = this;
    //   return new Promise(function(resolve, reject) {
    //     utils.API.goldbag_cart_validate({
    //       data: {
    //         "token":me.mall_token,
    //         "goods_id":goods_id,
    //       }
    //     })
    //     .then(function(ret) {
    //       resolve();
    //     })
    //     .catch(function(ret) {
    //       reject(ret);
    //     });

    //   })
      
    // },

    // getGoodsToAddCart:function(){
    //   return this.product_list[0]||{};
    // },

    addToCart:function(schema,goods){//加入购物车
      let me = this;
          // goods = this.getGoodsToAddCart();

      if(!this.mall_token){
        this.$router.push({ path: `/login` });
        return;
      }

      var goods_info = [{
        "goods_id":goods.goods_id,
        "goods_number":1,
      }];

      utils.API.cart_createtemporary({
        data: {
          "token":me.mall_token,
          "seller_id":me.seller_id,
          "rec_type":101,
          "location":me.location,
          "goods_info":goods_info,
        }
      })
      .then(function(ret) {

        let total_interest = me.culTotalTnterest(schema,[goods]);

        me.$store.commit("setTempCartInfo",{
          interest_schema:schema,
          goods:[goods],
          total_interest:total_interest.total_interest,
          cart_list:ret.model.data.cart_list,
          total:ret.model.data.total,
        });
        
        me.redirect(`/order/generate/fastbuy/${me.activity_id}`);
        // me.$router.replace({ path: '/order/generate/fastbuy/special' });
        // me.$router.go(-1);
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });





      // this.checkCartValidate(goods.goods_id)
      // .then(function() {
      //   var goods_info = [{
      //     "goods_id":goods.goods_id,
      //     "goods_number":1,
      //   }];

      //   utils.API.cart_createtemporary({
      //     data: {
      //       "token":me.mall_token,
      //       "seller_id":me.seller_id,
      //       "rec_type":101,
      //       "location":me.location,
      //       "goods_info":goods_info,
      //     }
      //   })
      //   .then(function(ret) {
      //     me.$store.commit("setTempCartInfo",{
      //       interest_schema:schema,
      //       goods:[goods],
      //       total_interest:me.total.total_interest,
      //       cart_list:ret.model.data.cart_list,
      //       total:ret.model.data.total,
      //     });
          
      //     me.redirect(`/order/generate/fastbuy/${me.activity_id}`);
      //     // me.$router.replace({ path: '/order/generate/fastbuy/special' });
      //     // me.$router.go(-1);
      //   })
      //   .catch(function(ret) {
      //     !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      //   });
      // })
      // .catch(function(ret) {
      //   !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      // });
    }.after(function() {
      utils.trackEvent("click_SpecialOfferGold_buyButton");
    }),

    redirect:function(path,event_name){
      path ? this.$router.push({ path: path }):this.goBack();
    }.after(function(path,event_name) {
      if(event_name){
        utils.trackEvent(event_name);
      }
    }),
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";
.special-product-pannel-wrap {
  // margin-top:0.16rem;
  padding:0.3rem 0 0.3rem 0.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  background:#ffffff;

  .price-wrap {
    display: flex;
    align-items: baseline;
    .price-cell {
      .price {
        font-size:0.48rem;
        line-height: 0.48rem;
        color:@red;
        font-weight:bold;
      }
      .unit {
        font-size:0.28rem;
        line-height: 0.28rem;
      }
    }
    .tip-text {
      margin-left:0.74rem;
      font-size:0.28rem;
      line-height: 0.28rem;
    }
  }
  .buy-btn {
    width:1.9rem;
    height:0.58rem;
    line-height: 0.58rem;
    border-radius: 2rem;
    background: @font-color-yellow;
    font-size:0.3rem;
    font-weight:bold;
    text-align: center;
    color:#ffffff;
    &.yellow {
      background: @font-color-yellow;
    }
    &.brown {
      background: #c0a069;
    }
  }
}
</style>