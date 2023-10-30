<template>

<!-- 存储列表 -->
<div class="goods-list-unit-wrap">
  <ul class="goods-list-nav">
    <li class="goods-list-nav-cell" :class="{ active:schema.active,hot:schema.hot }" v-for="(schema,index) in interest_schema" @click="switchSchema(schema,index,`click_homePage_hjtz_classification_${index+1}`)">{{schema.days}}天</li>
  </ul>

  <div class="result-wrap">
    <div class="result-list-wrap">
      <ul class="result-list">
        <li class="result-cell" v-for="(item,index) in storage_list">
          <div class="result-cell-img-wrap">
            <!-- <img class="result-cell-img" :src="item.img.goods_thumb"> -->
            <img class="result-cell-img" :key="item.img.goods_thumb" v-lazy="{src: item.img.goods_thumb, loading:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwcHgiICBoZWlnaHQ9IjIwMHB4IiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIGNsYXNzPSJsZHMtZWNsaXBzZSIgc3R5bGU9ImJhY2tncm91bmQ6IG5vbmU7Ij48cGF0aCBuZy1hdHRyLWQ9Int7Y29uZmlnLnBhdGhDbWR9fSIgbmctYXR0ci1maWxsPSJ7e2NvbmZpZy5jb2xvcn19IiBzdHJva2U9Im5vbmUiIGQ9Ik0zMCA1MEEyMCAyMCAwIDAgMCA3MCA1MEEyMCAyMiAwIDAgMSAzMCA1MCIgZmlsbD0iI2ZmYjYwNiIgdHJhbnNmb3JtPSJyb3RhdGUoMTI0LjU2OSA1MCA1MSkiPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBjYWxjTW9kZT0ibGluZWFyIiB2YWx1ZXM9IjAgNTAgNTE7MzYwIDUwIDUxIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGVUcmFuc2Zvcm0+PC9wYXRoPjwvc3ZnPg=='}">
          </div>
          <div class="result-cell-info-wrap">
            <p class="result-cell-info-title">{{item.name}}</p>
            <!-- <p class="result-cell-info-interest">存每块送{{getInterest(item.goods_weight)}}元现金</p> -->
            <p v-if="item.properties_tags" class="result-cell-info-tag">
              <span class="tag-cell" v-for="tag in item.properties_tags">{{tag}}</span>
            </p>
            <div class="result-cell-info-price">
              <span class="price">￥{{formatedMinPrice(item)}}</span>
              <p class="number-wrap">
                <span class="number-text">购买数量</span>
                <span class="subtract-btn iconfont icon-subtract-btn" @click.stop="switchAmount(item,false)"></span>
                <input class="amount-number" type="number" name="" readonly="readonly" v-model="item.select_num"/>
                <span class="add-btn iconfont icon-add-btnfill" @click.stop="switchAmount(item,true)"></span>
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>

  <div class="buy-info-wrap">
    <div class="tip">
      <span v-if="storage_list&&storage_list.length>0">{{current_annual_rate}}%固定收益+金价波动收益</span>
    </div>
    <div class="buy-btn" @click="addToCart">立即买入</div>
  </div>
</div>
<!-- 存储列表 -->

</template>

<script>
import { Toast } from "mint-ui";

export default {
  props:["refresh",],
  components: {},
  data() {
    return {
      mall_token:"",
      interest_schema:[],

      storage_list:[],

      selected_interest:{},

      deposit:10,//最小寄存标准

      unit_price:0,//每克金价

      schema_code:"G",

      // detached_product:null,
    };
  },
  computed: {
    seller_id() {
      return this.$store.getters.getSellerId;
    },
    location() {
      return this.$store.getters.getLocation;
    },
    total(){
      let me = this,
          total = {
            total_price:0,
            total_weight:0,
            total_interest:0,
          };

      this.storage_list.forEach(function(item){
        let price = me.formatedMinPrice(item);
        total.total_price += price*item.select_num;
        total.total_weight += parseFloat(item.goods_weight)*item.select_num;
        // total.total_interest += me.culInterest(item.goods_weight)*item.select_num;
      });



      total.total_price = total.total_price.toFixed(2);
      total.total_interest = me.culInterest(total.total_weight).toFixed(2);

      return total;
    },
    current_annual_rate(){
      return (this.selected_interest.rate*100).toFixed("2");
    },
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
      this.mall_token = utils.storageGet("mall_token");
      
      this.getProductInterestSchema();
      this.getGoodsStorageList();
    },
    getInterest:function(weight){
      let res = this.culInterest(weight);
      res = Number(/(\d+.)\d{0,2}/.exec(res)[0]).toFixed(2);
      return res
    },
    culInterest:function(weight){
      weight = parseInt(weight);
      let interest = weight*this.selected_interest.rate*this.selected_interest.days*this.unit_price/360;
      
      // interest = interest;
      return interest;
    },
    formatedMinPrice(goods){
      var price = "",
          promote_price = Number(goods.unformatted_promote_price)||"",
          shop_price = Number(goods.unformatted_shop_price)||"";

      if(promote_price != 0){
        price = promote_price;
      }else{
        price = shop_price;
      }

      return price.toFixed(2);
    },
    getGoodsStorageList:function(){
      var me = this;

      utils.API.goods_storageList({
        data: {
          schema_code:this.schema_code,
        }
      })
      .then(function(ret) {
        // console.log(ret.model.data);
        me.storage_list = ret.model.data.filter(function(item,cell_index){
          let index = _.findIndex(item.properties,function(o){return o.name == "标签";});
          if(index != -1){
            item.properties[index].value = item.properties[index].value.split(/[,，]/);
            item.properties_tags = item.properties[index].value;
          }
          item.select_num = 0;

          return cell_index <= 1;
        })
        // me.storage_list = ret.model.data;
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    getProductInterestSchema:function(){
      var me = this;

      utils.API.product_getInterestSchema({
        data: {
          "token": me.mall_token,
          "reqBody":{
            name:this.schema_code,
            schemaCode:this.schema_code,//方案编码
            type:1,//1:寄存；2：续存
          }
        }
      })
      .then(function(ret) {
        var schema = [];
        me.deposit = ret.model.deposit;
        me.unit_price = ret.model.unitPrice;

        ret.model.items.forEach(function(item,index){
          item.name = ret.model.name;
          
          if(index == 0){
            item.active = true;
            me.selected_interest = _.assign({},item);
          }else{
            item.active = false;
          }

          if(item.days == 180){
            item.hot = true;
          }else{
            item.hot = false;
          }

          if(item.status == 1){
            schema.push(item);
          }
        })
        me.interest_schema = schema;
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    switchSchema:function(schema,index,event_name){
      var me = this;
      this.interest_schema.forEach(function(item,cell_index){
        if(cell_index == index){
          item.active = true;
          me.selected_interest = _.assign({},item);
        }else{
          item.active = false;
        }
      });

      // if(schema.days != 30 && schema.days != 90){
      //   this.detachProduct(this.storage_list,0);
      // }else{
      //   this.attachProduct(this.storage_list,this.detached_product,0);
      // }
    }.after(function(schema,num,event_name) {
      if(event_name){
        utils.trackEvent(event_name);
      }
    }),
    // detachProduct:function(list,index){
    //   if(!list[index]){
    //     return;
    //   }
    //   if(parseFloat(list[index].goods_weight) != 1){
    //     return;
    //   }
    //   this.detached_product = list[index];
    //   list.splice(index,1);
    // },

    // attachProduct:function(list,product,index){
    //   if(!this.detached_product){
    //     return;
    //   }
    //   if(parseFloat(this.detached_product.goods_weight) != 1){
    //     return;
    //   }
    //   if(!product){
    //     return;
    //   }
    //   list.splice(index, 0, product);
    //   this.detached_product = null;
    // },

    switchAmount:function(goods,status){
      switch(status){
        case true ://+
          goods.select_num += 1;
          break;
        case false ://-
          if(goods.select_num > 0){
            goods.select_num -= 1;
          }
          break;
      }
    },
    
    goToDetail:function(id,index,event_name){
      this.$router.push({path: `/goods/${id}` });
    }.after(function(id,index,event_name){
      if(event_name){
        utils.trackEvent(event_name,{
          goods_id:id,
          index:index,
          category:this.selected_interest.days+"天",
        });
      }
    }),

    redirect:function(path,event_name){
      path ? this.$router.push({ path: path }):this.goBack();
    }.after(function(path,event_name) {
      if(event_name){
        utils.trackEvent(event_name);
      }
    }),
/********************************加入购物车********************************/
  
    getGoodsToAddCart:function(){
      let me = this,
          goods = [];;


      this.storage_list.forEach(function(item){
        if(item.select_num > 0){
          goods.push(item);
        }
      });

      return goods;
    },
    addToCart:function(){//加入购物车

      let me = this,
          goods = this.getGoodsToAddCart();

      if(goods.length <= 0){
        Toast("请选择存储商品哦！");
        return;
      }

      if(!this.mall_token){
        this.$router.push({ path: `/login` });
        return;
      }

      
      let goods_info = [];

      goods.forEach(function(item){
        goods_info.push({
          "goods_id":item.goods_id,
          "goods_number":item.select_num,
        })
      });

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
        me.$store.commit("setTempCartInfo",{
          interest_schema:me.selected_interest,
          goods:goods,
          total_interest:me.total.total_interest,
          cart_list:ret.model.data.cart_list,
          total:ret.model.data.total,
        });

        setTimeout(function(){
          me.redirect('/order/generate/fastbuy/0');
        },200)
        
        // me.$router.replace({ path: '/order/generate/fastbuy/common' });
        // me.$router.go(-1);
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });

    }.after(function() {
      utils.trackEvent("click_homePage_hjtz_storageButton");
    }),
/********************************加入购物车********************************/
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";

.goods-list-unit-wrap {
  background:#ffffff;
  margin-top:0.1rem;
  padding-bottom:0.2rem;
  .goods-list-nav {
    display: flex;
    justify-content: space-between;
    padding:0 0.24rem;
    position: -webkit-sticky;
    position: sticky;
    z-index:1;
    background:#ffffff;
    top: 1rem;
    width: 100%;
    box-sizing: border-box;
    &.fixed {
      margin-top:0;
      position: absolute;
      width: 100%;
      top:1rem;
      z-index:9;
    }
    .goods-list-nav-cell {
      min-width: 0.76rem;
      // height:0.9rem;
      line-height:0.3rem;
      text-align:center;
      font-size:0.3rem;
      padding-bottom:0.24rem;
      position: relative;
      &.hot {
        &:before {
          content:"";
          width: 0.34rem;
          height:0.4rem;
          background-image:url(data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMsaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjUtYzAxNCA3OS4xNTE0ODEsIDIwMTMvMDMvMTMtMTI6MDk6MTUgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozQzcyRkZFRjNFMzExMUU5QUE3RkI3QjlCNEJCMEQzNyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozQzcyRkZGMDNFMzExMUU5QUE3RkI3QjlCNEJCMEQzNyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjNDNzJGRkVEM0UzMTExRTlBQTdGQjdCOUI0QkIwRDM3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjNDNzJGRkVFM0UzMTExRTlBQTdGQjdCOUI0QkIwRDM3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQABgQEBAUEBgUFBgkGBQYJCwgGBggLDAoKCwoKDBAMDAwMDAwQDA4PEA8ODBMTFBQTExwbGxscHx8fHx8fHx8fHwEHBwcNDA0YEBAYGhURFRofHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8f/8AAEQgAKAAiAwERAAIRAQMRAf/EAJYAAAEDBQAAAAAAAAAAAAAAAAcFBggAAQIDBAEAAQUBAQAAAAAAAAAAAAAABgACAwQFBwEQAAIBAwICBAwHAAAAAAAAAAECAwARBAUGMRIhQVEiYXGBoTJCUnIUFTUHkbFigiNjFhEAAQMCAwQHCQEAAAAAAAAAAQACAwQFESExQVGBEmFxoTIToxXwkcHR4SJCFAaC/9oADAMBAAIRAxEAPwCVNJJM77l/cXB2ZpAl5VyNVyrrgYhPQSOMj26Qi9fbwqrVVIib0nRb1gsb6+XDuxt7zvgOkpD+xe7tX3JpOrzavlHJzY83nubALHJGvKqKOhVBU2AqG3zOkaeY54rR/r7ZFSyxiJvKws7QdvSibWghBVSSWpsvGVpVaRQ0CiSYE+ihuQx8HdNN5hjhuTxG44Za5BRA3/uyfdO6czVXY/DljFgxn1MdCQg8vpHwmhmpmMjy5d1s1tbR0zYh3tXdLjr8k6fsLuzH0Tdr4GZII8TWEWAOxsqzobxX967L4yKsW6YMfgdHLF/sba6opQ9gxdEcf8nX4FSCyty4uLuXH0aaynJh545P7CxAQ+8B0VfkuDWVIhP5N7dy5hHQOfTmYfiezelmtFUFH3em8NYj3TuePElCx5sUmmMpvYIi8gYW9YHm/E0I1Ne9lQ/DQ/aun2q2RGmgLxmwiTic/l7kH58abHbklQoRwPUfEaY14dojpkgdmCrQxSzSpFCpeVyFRV4knhSc4AYnReucGgk6BFnGn1NYMZszLkys7HjRfiZGLPeP0e9x7vVQ7U1TpJOfHPZw0QTIyPmdyNDWOJy60Zv9Q/g+k/MP30d+onyefigH08ebyIRb/wBqy427NQYScq5MhyYww6Csve6CP1XFDF2JiqHAjXMcUcWW4h9MzLujl9ybvyCR+7JIhTrFi3mNZ37QGgWr+6BoCuzA0TTsFzLDConIsZbC9j2dlRS1L3jAnJQTVckgwJy3JRihlnlSCJS0srBI1HEsxsBUTGFxDRqVVc4NBJ0CM3+WT2h9M+XeX2q6N6cPK5EA+onzedZbt2pja/iKvMIc2G5x57X48VbtU0rpbG1TNzxofbYm225Opnb2HUe21CjU9s67pkhTKw5Ao4SopeM+Jlv56BKm2zwnBzT1jMI1p6+GUYtcOrQrmxNJ1TMkEeLhzTOepUbzkiwqKKklkODWuPBTSVMbBi5wHFEjZOwm0yVdS1PlbNA/ggHeWK/rE9bflRhZ7J4J8STv7Bu+qE7tefGHhx9zad/0T2okQ8v/2Q==);
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          position: absolute;
          top:50%;
          right: -0.44rem;
          margin-top:-0.34rem;
        }
      }
      &.active {
        color:@font-color-yellow;
        &:after {
          content:"";
          width: 100%;
          height:0.04rem;
          background:@font-color-yellow;
          position: absolute;
          bottom:0;
          left: 0;

        }
      }
    }
    border-bottom:1px solid @border-color;
  }

  .result-wrap {
    background:#ffffff;
    .result-list-wrap {
      padding:0;
      .result-list {
        padding-top:0.24rem;
        padding-bottom:0.1rem;
        .result-cell {
          // background:#ffffff;
          padding:0 0.24rem;
          padding-bottom:0.24rem;
          margin-bottom:0.24rem;
          border-bottom:1px solid @border-color;
          display: flex;
          justify-content: space-between;
          &:last-child {
            border-bottom:none;
            margin-bottom:0;
          }
          .result-cell-img-wrap {
            width: 2.1rem;
            height: 2.1rem;
            background:#eeeeee;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);
            .result-cell-img {
              display: block;
              width: 100%;
              height:100%;
              &[lazy=loading] {
               //  width: 1rem;
                // height: 1rem;
                // color:@yellow;
              }
            }
          }
          .result-cell-info-wrap {
            width: 4.7rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .result-cell-info-title {
              font-size:0.28rem;
              line-height: 0.36rem;
              overflow:hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              word-break: break-all;
              word-wrap: break-word;
            }
            .result-cell-info-tag {
              display: flex;
              flex-wrap: wrap;
              .tag-cell {
                display: block;
                font-size:0.24rem;
                color:@font-color-yellow;
                height:0.34rem;
                padding:0 0.14rem;
                border:1px solid @font-color-yellow;
                border-radius: 0.2rem;
                margin:0.1rem 0.15rem 0 0;
              }
            }
            .result-cell-info-interest {
              margin-top:0.14rem;
              font-size:0.26rem;
              line-height: 0.26rem;
              color:@red;
            }
            .result-cell-info-price {
              display: flex;
              margin-top:0.14rem;
              align-items: baseline;
              justify-content: space-between;
              .price {
                font-size:0.34rem;
                color:@font-color-yellow;
              }
              .collect-num {
                font-size:0.24rem;
                color:@font-gray-color;
                margin-left:0.4rem;
                flex: 1;
              }
              .gouwuche {
                background:@font-color-yellow;
                border-radius:50%;
                width: 0.5rem;
                height:0.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                .iconfont {
                  font-size:0.3rem;
                  color:#ffffff;
                }
              }
              .number-wrap {
                .number-text {
                  color:@font-gray-color;
                  margin-right:0.24rem;
                }
                .iconfont {
                  font-size:0.36rem;
                  &.subtract-btn {
                    color:@font-color-yellow;
                  }
                  &.add-btn {
                    color:@font-color-yellow;
                  }
                }
                .amount-number {
                  font-size:0.28rem;
                  width:0.56rem;
                  height:0.36rem;
                  line-height: 0.36rem;
                  border:none;
                  text-align:center;
                }
              }
            }
          }
        }
      }
    }
  }

  .buy-info-wrap {
    margin-top:0.4rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    padding:0 0.24rem;
    box-sizing: border-box;
    .tip {
      font-size: 0.28rem;
      color:@red;
    }
    .buy-btn {
      font-size:0.3rem;
      line-height: 0.58rem;
      text-align:center;
      font-weight:bold;
      color:#ffffff;
      width:1.9rem;
      height:0.58rem;
      background:@font-color-yellow;
      border-radius: 0.5rem;
    }
  }
}
</style>