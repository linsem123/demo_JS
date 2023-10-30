<template>
  <div>
    <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">续存</div>
      <div slot="right">
        <span v-if="has_less_than_weight_goods" class="head-right-text" @click="remove_goods">一键移除</span>
      </div>
    </top-head>
    <!-- 头部 -->


    <div class="todo-storage-wrap">
      <div class="top-blank"></div>

      <div class="config-wrap">
        <div class="config-wrap-inner">
          <div class="config-title bold">今日金价<span>(含加工费)</span></div>
          <div class="config-info">
            <p class="config-text red bold">{{product_price}}<span class="unit">元/克</span></p>
          </div>
        </div>
      </div>

      <template v-if="todo_list">

        <!-- 购买信息 -->
        <div class="buy-info-wrap">
          <!-- <h4 class="buy-info-tip">请选择新一期的存储期限</h4> -->
          <!-- 购物车选中列表 -->
          <div class="category-wrap" v-for="category in can_buy_goods_category">
            <!-- <div class="config-wrap">
              <select class="config-select" v-model="category.select_config">
                <option value="-1">请选择存储期限</option>
                <option :value="config.id" v-for="config in category.config">寄存{{config.days}}天(可赠送{{config.interest}}元现金)</option>
              </select>
            </div> -->
            <ul class="cart-goods-list">
              <li class="cart-goods-cell" v-for="goods in category.list">
                <div class="goods-info-img-wrap">
                  <img class="goods-info-img" :src="goods.url">
                </div>
                <div class="goods-info">
                  <h4 class="goods-info-title">{{goods.goodsName}}</h4>
                  <div class="goods-info-price-wrap">
                    <!-- <span class="goods-info-price">{{goods.formated_goods_price}}</span> -->
                    <span class="goods-info-number">×{{goods.number}}</span>
                  </div>
                </div>
              </li>
            </ul>

            <div class="config-wrap">
              <div class="config-wrap-inner">
                <select :class="{ 'no-value':category.select_config == '-1' }" class="config-select" v-model="category.select_config" @change="changeConfigSelect(category.select_config,category)">
                  <option value="-1">请选择存储期限</option>
                  <option v-if="macross" :value="config.id" v-for="config in category.config">存{{config.days}}天(固定收益{{config.interest}}元)</option>
                  <option v-else :value="config.id" v-for="config in category.config">寄存{{config.days}}天(可赠送{{config.interest}}元现金)</option>
                </select>
                <span class="iconfont icon-xiangxia1"></span>
              </div>
              <div class="config-wrap-inner">
                <div class="config-title">预计到期时间</div>
                <div class="config-info">
                  <p class="config-text">{{category.expire_time}}</p>
                </div>
              </div>
            </div>

          </div>


          <div class="config-wrap">
            <div class="config-wrap-inner">
              <div class="config-title">共计克重</div>
              <div class="config-info">
                <p class="config-text">{{total_weight}}克</p>
              </div>
            </div>
          </div>
          <!-- 购物车选中列表 -->
        </div>

        <div v-if="has_less_than_weight_goods" class="less-than-weight-tip">很遗憾，您选购的以下产品没有达到存储克重，请先一键移除，继续下一步操作</div>

        <div v-if="has_less_than_weight_goods" class="less-than-weight-goods-wrap">
          <ul class="cart-goods-list" v-for="category in cannot_buy_goods_category">
            <li class="cart-goods-cell" v-for="goods in category.list">
              <div class="goods-info-img-wrap">
                <img class="goods-info-img" :src="goods.url">
              </div>
              <div class="goods-info">
                <h4 class="goods-info-title">{{goods.goodsName}}</h4>
                <div class="goods-info-price-wrap">
                  <!-- <span class="goods-info-price">{{goods.formated_goods_price}}</span> -->
                  <span class="goods-info-number">×{{goods.number}}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>



        <template v-if="macross">
          <regular></regular>
          <introduce></introduce>
          <selections></selections>
          <venture-tip></venture-tip>
        </template>

        
        <div class="zhanwei"></div>

      </template>
      
      <template v-else>
        <div class="wrapper">
          没有更多啦~
        </div>
      </template>
  	</div>

    <div class="agreement-wrap">
      <span class="select-core" :class="select_agreement?'checked':''" @click="select_agreement=!select_agreement"></span>
      <span class="agreement-text">我已阅读并同意<i @click="show_contract=true">《黄金象用户存储协议》</i></span>
    </div>

    <div class="pay-wrap">
      <a class="pay-btn" :class="!can_pay?'disable':''" @click="gotoPay">下一步</a>
    </div>
    

    <!-- 黄金象用户存储协议 -->
    <Popup
        v-model="show_contract"
        position="right" 
        class="pop-modal">
      <a href="javascript:void(0);" class="iconfont icon-back" @click="show_contract=false"></a>
      <div class="title">黄金象用户存储协议</div>
      <div class="content">
        <div class="pop-content-wrap" v-html= "contract.body"></div>
      </div>
    </Popup>


  </div>
</template>

<script>
import appconfig from "@/config/appconfig.js";
import topHead from "@/views/components/TopHead.vue";
// import constants from "@/assets/js/constants.js";

import { Toast, MessageBox, Popup } from "mint-ui";

import regular from "@/views/components/Regular.vue";
import introduce from "@/views/components/Introduce.vue";
import selections from "@/views/components/Selections.vue";
import ventureTip from "@/views/components/VentureTip.vue";

// utils.extendApi(API);//把API扩充到utils方法里边

export default {
  components: {
    topHead: topHead,
    Popup:Popup,
    regular:regular,
    introduce:introduce,
    selections:selections,
    ventureTip:ventureTip,
  },
  data() {
    return {
      mall_token:"",
      todo_list:[],

      goods_category:{},

      can_buy_goods_category:{},
      cannot_buy_goods_category:{},

      has_less_than_weight_goods:false,

      select_agreement:true,
      
      show_contract:false,
      contract:{
        title:"",
        body:"",
      },


      product_price:"--.--",
    };
  },
  computed: {
    selected_goods_info(){
      var res = [],
          selected_goods_info = this.$route.params.selected_goods_info!='null'?this.$route.params.selected_goods_info:"";
      
      selected_goods_info = selected_goods_info.split(",");

      selected_goods_info.forEach(function(item){
        var obj = {},
            arr = item.split("-");

        obj.goodsId = arr[0];
        obj.number = Number(arr[1]);
        res.push(obj);
      })
      return res;
    },
    seller_id() {
      return this.$store.getters.getSellerId;
    },
    location() {
      return this.$store.getters.getLocation;
    },
    macross() {
      return this.$store.getters.getMacross;
    },
    total_weight(){
      var total_weight = 0;

      _.forEach(this.can_buy_goods_category,function(value,key){
        total_weight += Number(value.weight);
      })

      return total_weight.toFixed(0);
    },
    has_select_config(){
      var has_select_config = true;

      _.forEach(this.can_buy_goods_category,function(value,key){
        if(value.select_config == -1){
          has_select_config = false;
          value.expire_time = "";
        }
      })
      return has_select_config;
    },
    can_pay(){
      var can_pay = true;
      can_pay = (_.isEmpty(this.can_buy_goods_category)||this.has_less_than_weight_goods||!this.has_select_config)?false:true;
      return can_pay;
    },
  },
  watch:{
    "cannot_buy_goods_category":function(nval,oval){
      this.has_less_than_weight_goods = !_.isEmpty(nval);
    },
  },
  mounted() {
    // this.init();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.init();
    })
  },
  methods: {
    init: function() {
      var me = this;
      this.mall_token = utils.storageGet("mall_token");
      // this.getCart();
      this.getTodoList();
      this.getContract();
      this.getProductPrice();
    },

    changeConfigSelect:function(id,configs){
      // console.log(id)
      // console.log(configs.config);
      var res = _.find(configs.config,function(o){ return o.id == id});

      if(res){
        this.getOrderExpectFinishDate(res.days,function(expire_time){
          configs.expire_time = expire_time;
          // console.log("expire_time:",expire_time)
        });
      }
    },

    getOrderExpectFinishDate:function(days,cb){
      var me = this;

      utils.API.order_expectFinishDate({
        data: {
          "reqBody":{
            "days":days//寄存天数
          }
        }
      })
      .then(function(ret) {
        // me.expire_time = ret.model.expectFinishDate;
        cb&&cb(ret.model.expectFinishDate);
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    // /************今日金价获取**************/
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
    // /************今日金价获取**************/
    
    getContract:function(){
      var me = this;

      utils.API.cmsservice_contract_storage({
        method:"get",
      })
      .then(function(ret) {
        let contract = "";

        if(ret.model&&ret.model.length){
          var the_same = _.find(ret.model,function(o){return o.field_audit_status == "无";});

          if(the_same){
            contract = the_same;
          }else{
            if(!me.macross){
              contract = _.find(ret.model,function(o){
                return o.field_audit_status == "审核前";
              });
            }else{
              contract = _.find(ret.model,function(o){
                return o.field_audit_status == "审核后";
              });
            }
          }

          var reg = /\"+?\/(.+)((\.jpg)|(\.png))\"/gi;
          contract.body = contract.body.replace(reg,"\""+appconfig.cmsbaseurl+"/"+"$1$2"+"\"");
          me.contract = _.assign({},contract);
        }
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    getTodoList:function(){
      var me = this;

      utils.API.todo_list({
        data: {
          "token": me.mall_token,
          "reqBody":{}
        }
      })
      .then(function(ret) {
        ret.model.items.forEach(function(item){
          item.is_checked = false;
          item.number = item.value;
        });

        me.todo_list = ret.model.items;
        me.setGoodsCategory();
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    getGoodsCategory:function(){
      var me = this;

      me.goods_category = _.assign({});

      return new Promise(function(resolve, reject) {
        me.todo_list.forEach(function(item){

          var index = _.findIndex(me.selected_goods_info, function(o) {return o.goodsId == item.goodsId;});


          if(index != -1){
            var metal_type = item.productName;

            item.number = me.selected_goods_info[index].number;

            if(!me.goods_category[metal_type]){
              me.goods_category[metal_type] = {};
              me.goods_category[metal_type].min_weight = 0;
              me.goods_category[metal_type].weight = 0;
              me.goods_category[metal_type].config = [];
              me.goods_category[metal_type].name = metal_type;
              me.goods_category[metal_type].list = [];
              me.goods_category[metal_type].select_config = -1;
            }

            me.goods_category[metal_type].weight += parseFloat((parseFloat(item.spec)*item.number).toFixed(4));
            me.goods_category[metal_type].list.push(item);
          }
        })

        resolve();
      })
    },
    setGoodsCategory:function(){
      var me = this;

      this.getGoodsCategory()
      .then(function(){

        var product_info = [];

        _.forEach(me.goods_category, function(value, key) {
          var obj = {
            "productName": key,
            "schemaCode": key,
            "weight":value.weight,//总重量
          };

          product_info.push(obj);
        });



        utils.API.product_calInterest({
          data: {
            "token": me.mall_token,
            "reqBody":{
              "type":2,//1:寄存；2：续存
              "productInfo":product_info,
            }
          }
        })
        .then(function(ret) {
          (ret.model.list||[]).forEach(function(item){
            if(me.goods_category[item.productName]){
              me.goods_category[item.productName].config = item.items;
              me.goods_category[item.productName].min_weight = item.minWeight;
              me.goods_category[item.productName].expire_time = "";
            }
          });

          me.goods_category = _.assign({},me.goods_category);

          me.can_buy_goods_category = _.assign({});
          me.cannot_buy_goods_category = _.assign({});

          _.forEach(me.goods_category, function(value, key) {
            if(value.weight >= value.min_weight){
              // var obj = {};
              // obj[key] = value;
              // me.can_buy_goods_category = _.assign({},obj);
              me.$set(me.can_buy_goods_category,key,value);
            }else{
              // var obj = {};
              // obj[key] = value;
              // me.cannot_buy_goods_category = _.assign({},obj);
              me.$set(me.cannot_buy_goods_category,key,value);
            }
          });
          
        })
        .catch(function(ret) {
          !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        });
      });
    },
    remove_goods:function(){
      var me = this;

      MessageBox({
        title: "",
        message: "确定移除未达到存储克重的产品吗？",
        showCancelButton: true
      }).then(function(action) {
        if (action === "confirm") {
          me.$set(me,"cannot_buy_goods_category",{});
        }
      });
    },

    getSendOrderData:function(){
      var productName = "",
          schemaId = "",
          goods = [];

      _.forEach(this.can_buy_goods_category,function(value,key){
        productName = key;
        schemaId = value.select_config;
        

        value.list.forEach(function(item){
          var obj = {
            goodsId:item.goodsId,//{string} 商品ID
            quantity:item.number,//{number} 数量
          };
          goods.push(obj);
        });
      })

      return {
        // productName:productName,
        schemaId:schemaId,
        items:goods,
        type:2,//1:寄存；2：续存
      };
    },

    gotoPay:function(){
      var me = this;

      if(!this.can_pay){
        // Toast("有未达到存储克重的产品！");
        return;
      }

      if(!this.select_agreement){
        Toast("请同意《黄金象用户存储协议》！");
        return;
      }

      var data = this.getSendOrderData();

      utils.API.deposit_create({
        data: {
          token: me.mall_token,
          "reqBody":data,
        }
      })
      .then(function(ret) {
        me.$router.push({ path:`/my/todo/payresult`});
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    goBack: function() {
      // this.$router.push({ path:`/my/todo`});
      this.$router.goBack();
    }
  }
};
</script>

<style lang="less" scoped>
@import "./TodoStorage.less";
</style>