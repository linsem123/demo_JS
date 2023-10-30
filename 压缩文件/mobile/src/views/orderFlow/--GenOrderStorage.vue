<template>
  <div>
    <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">确认订单</div>
      <div slot="right">
        <span v-if="has_less_than_weight_goods" class="right-span" @click="remove_goods">一键移除</span>
      </div>
    </top-head>
    <!-- 头部 -->


    <div class="mall-my-confirm-cart">
      <div class="top-blank"></div>

      <template v-if="cart&&cart.goods_list">


        <!-- 购买信息 -->
        <div class="buy-info-wrap">
          <!-- 购物车选中列表 -->
          <div class="category-wrap" v-for="category in can_buy_goods_category">
            <ul class="cart-goods-list">
              <li class="cart-goods-cell" v-for="goods in category.list">
                <div class="goods-info-img-wrap">
                  <img class="goods-info-img" :src="goods.img.small">
                </div>
                <div class="goods-info">
                  <h4 class="goods-info-title">{{goods.goods_name}}</h4>
                  <div class="goods-info-price-wrap">
                    <span class="goods-info-price">{{goods.formated_goods_price}}</span>
                    <span class="goods-info-number">×{{goods.goods_number}}</span>
                  </div>
                </div>
              </li>
            </ul>
            <div class="config-wrap">
              <div class="config-wrap-inner">
                <select class="config-select" v-model="category.select_config" @change="changeConfigSelect(category.select_config,category)">
                  <option value="-1">请选择存储期限</option>
                  <option :value="config.id" v-for="config in category.config">寄存{{config.days}}天(可赠送{{config.interest}}元现金)</option>
                </select>
                <span class="iconfont icon-xiangxia1"></span>
              </div>
            </div>
            
          </div>
          <!-- 购物车选中列表 -->
        </div>

        <div class="bottom-config-wrap">
          <div class="config-wrap" @click="coupons_modal=!coupons_modal">
            <div class="config-wrap-inner">
              <div class="config-title">优惠券</div>
              <div class="config-info">
                <template v-if="bonus.length<=0">
                  <p class="config-text gray">无可用优惠券</p>
                  <span class="iconfont icon-more gray"></span>
                </template>
                <template v-else>
                  <template v-if="active_coupon">
                    <p class="config-text red">-{{active_coupon&&active_coupon.bonus_amount||0}}</p>
                    <span class="iconfont icon-more red"></span>
                  </template>
                  <template v-else>
                    <p class="config-text gray">不使用优惠券</p>
                    <span class="iconfont icon-more gray"></span>
                  </template>
                </template>
              </div>
            </div>
          </div>
          <div class="config-wrap">
            <div class="config-wrap-inner">
              <div class="config-title">预计到期时间</div>
              <div class="config-info">
                <p class="config-text">{{expire_time}}</p>
                <span class="iconfont icon-wenhao" @click="showTip"></span>
              </div>
            </div>
          </div>
        </div>



        <!-- 这个是不同种类的金属不满足条件的代码，目前都是一种金属，先注释掉 -->
        <!-- <div v-if="has_less_than_weight_goods" class="less-than-weight-tip">很遗憾，您选购的以下产品没有达到存储克重，请先一键移除，继续下一步操作</div>

        <div v-if="has_less_than_weight_goods" class="less-than-weight-goods-wrap">
          <ul class="cart-goods-list" v-for="category in cannot_buy_goods_category">
            <li class="cart-goods-cell" v-for="goods in category.list">
              <div class="goods-info-img-wrap">
                <img class="goods-info-img" :src="goods.img.small">
              </div>
              <div class="goods-info">
                <h4 class="goods-info-title">{{goods.goods_name}}</h4>
                <div class="goods-info-price-wrap">
                  <span class="goods-info-price">{{goods.formated_goods_price}}</span>
                  <span class="goods-info-number">×{{goods.goods_number}}</span>
                </div>
              </div>
            </li>
          </ul>
        </div> -->
        <!-- 这个是不同种类的金属不满足条件的代码，目前都是一种金属，先注释掉 -->



        <template v-if="macross">
          <regular></regular>
          <introduce></introduce>
          <selections></selections>
          <venture-tip></venture-tip>
        </template>



        <div class="agreement-wrap">
          <span class="select-core" :class="select_agreement?'checked':''" @click="select_agreement=!select_agreement"></span>
          <span class="agreement-text">我已阅读并同意<i @click="show_contract=true">《黄金象用户存储协议》</i></span>
        </div>


        <div class="zhanwei"></div>

      </template>
      
      <template v-else>
        <div class="wrapper">
          空空如也~
        </div>
      </template>
  	</div>

    <div class="pay-wrap">
      <span class="total-price">￥{{total_price}}</span>
      <a class="pay-btn" :class="!can_pay?'disable':''" @click="gotoPay">去支付</a>
    </div>


    <!-- 优惠券弹层 -->
    <popup-coupon
      :coupons_modal="coupons_modal"
      :available_coupons="bonus"
      @select-coupon="selectCoupon"
      @close-coupons-modal="closeCouponsModal"
    ></popup-coupon>
    

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
import popupCoupon from "@/views/components/PopupCoupon.vue";
import regular from "@/views/components/Regular.vue";
import introduce from "@/views/components/Introduce.vue";
import selections from "@/views/components/Selections.vue";
import ventureTip from "@/views/components/VentureTip.vue";

import { Toast, MessageBox, Popup } from "mint-ui";

// utils.extendApi(API);//把API扩充到utils方法里边

export default {
  components: {
    topHead: topHead,
    Popup:Popup,
    popupCoupon:popupCoupon,
    regular:regular,
    introduce:introduce,
    selections:selections,
    ventureTip:ventureTip,
  },
  data() {
    return {
      mall_token:"",
      // count: 1,
      cart:{},
      goods_list:[],
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

      bonus:[],
      coupons_modal:false,
      select_coupon:{},
      is_loading_btn:false,

      expire_time:"",
    };
  },
  computed: {
    seller_id() {
      return this.$store.getters.getSellerId;
    },
    location() {
      return this.$store.getters.getLocation;
    },
    macross() {
      return this.$store.getters.getMacross;
    },
    total_price(){
      var goods_amount = this.cart&&this.cart.total&&this.cart.total.goods_amount||0,
          res = (goods_amount - (this.active_coupon&&this.active_coupon.bonus_amount||0)).toFixed(2);

      return res<=0?"0.00":res;
    },
    has_select_config(){
      var me = this,
          has_select_config = true;

      _.forEach(this.can_buy_goods_category,function(value,key){
        if(value.select_config == -1){
          has_select_config = false;
          me.expire_time = "";
        }
      })
      return has_select_config;
    },
    can_pay(){
      var can_pay = true;
      can_pay = (_.isEmpty(this.can_buy_goods_category)||this.has_less_than_weight_goods||!this.has_select_config)?false:true;
      return can_pay;
    },
    max_coupon(){
      var find_index,
          res = {
            bonus_amount:0,
          };

      if(this.bonus.length <= 0){
        return null;
      }

      this.bonus.forEach(function(item,index){
        item.is_checked = false;
        if(Number(item.bonus_amount) > res.bonus_amount){
          res = _.assign(res,item);
          find_index = index;
        }
      });

      this.bonus[find_index].is_checked = true;
      res.is_checked = true;

      return res;
    },
    active_coupon(){
      var res = {};
      if(_.isPlainObject(this.select_coupon) && _.isEmpty(this.select_coupon)){
        res = _.assign({},this.max_coupon);
      }else if(this.select_coupon){
        res = _.assign({},this.select_coupon);
      }else{
        res = this.select_coupon;
      }

      return res;
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

      this.getContract();
      this.flowCheckOrder("-1",function(ret){
        me.restCart(ret);
      });
      // this.getCart();
    },

    changeConfigSelect:function(id,configs){
      // console.log(id)
      // console.log(configs.config);
      var res = _.find(configs.config,function(o){ return o.id == id});

      if(res){
        this.getOrderExpectFinishDate(res.days);
      }
    },

    getOrderExpectFinishDate:function(days){
      var me = this;

      utils.API.order_expectFinishDate({
        data: {
          "reqBody":{
            "days":days//寄存天数
          }
        }
      })
      .then(function(ret) {
        me.expire_time = ret.model.expectFinishDate;
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

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
    getMetalType:function(properties){
      var metal_type = 0;

      properties.forEach(function(item){
        if(item.name == "存储类别"){
          metal_type = item.value;
        }
      });

      return metal_type;
    },

    getSelectedGoodsCategory:function(cb){
      var me = this;
      me.goods_category = _.assign({});

      return new Promise(function(resolve, reject) {
        me.goods_list.forEach(function(item){
          if(item.is_checked == 1){
            var metal_type = me.getMetalType(item.properties);
            if(!me.goods_category[metal_type]){
              me.goods_category[metal_type] = {};
              me.goods_category[metal_type].min_weight = 0;
              me.goods_category[metal_type].weight = 0;
              me.goods_category[metal_type].config = [];
              me.goods_category[metal_type].name = metal_type;
              me.goods_category[metal_type].list = [];
              me.goods_category[metal_type].select_config = -1;
            }

            me.goods_category[metal_type].weight += parseFloat((parseFloat(item.goods_weight)*item.goods_number).toFixed(4));
            me.goods_category[metal_type].list.push(item);
          }
        })

        resolve();
      })
    },
    
    getCart: function(cb) {
      var _this = this;

      utils.API.cart_list({
        data: {
          token: _this.mall_token,
          seller_id: _this.seller_id,
          location: _this.location
        }
      })
      .then(function(ret) {
        _this.restCart(ret);
        cb&&cb();
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    restCart:function(ret){//重置购物车
      var me = this;
      this.cart = _.assign({},ret.model.data.cart_list&&ret.model.data.cart_list[0]||{});
      this.goods_list = this.cart&&this.cart.goods_list||[];

      if(_.isEmpty(this.cart)){
        this.cart = {
          disabled_label: "",
          goods_list:ret.model.data.goods_list,
          // total:ret.model.data.total,
        }
        this.goods_list = ret.model.data.goods_list;
      }
      
      this.getSelectedGoodsCategory()
      .then(function(){

        var product_info = [];

        _.forEach(me.goods_category, function(value, key) {
          var obj = {
            "productName": key,
            "schemaCode":key,
            "weight":value.weight,//总重量
          };

          product_info.push(obj);
        });

        me.can_buy_goods_category = _.assign({});
        me.cannot_buy_goods_category = _.assign({});

        if(product_info.length <= 0){
          return;
        }

        utils.API.product_calInterest({
          data: {
            "token": me.mall_token,
            "reqBody":{
              "type":1,//1:寄存；2：续存
              "productInfo":product_info,
            }
          }
        })
        .then(function(ret) {
          (ret.model.list||[]).forEach(function(item){
            if(me.goods_category[item.schemaCode]){
              me.goods_category[item.schemaCode].config = item.items;
              me.goods_category[item.schemaCode].min_weight = item.minWeight;
            }
          });

          me.goods_category = _.assign({},me.goods_category);

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

          // var rec_id = me.getRecId(me.can_buy_goods_category);
          // if(rec_id){
          //   me.flowCheckOrder("-1",rec_id);
          // }
        })
        .catch(function(ret) {
          !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        });
      });
    },

    getRecId:function(category){
      var rec_id = [];
      _.forEach(category,function(value,key){
        value.list.forEach(function(item){
          rec_id.push(item.rec_id);
        })
      });

      return rec_id.join(",");
    },
    remove_goods:function(){
      var me = this,
          rec_id = this.getRecId(this.cannot_buy_goods_category);

      if(!rec_id){
        return;
      }

      MessageBox({
        title: "",
        message: "确定移除未达到存储克重的产品吗？",
        showCancelButton: true
      }).then(function(action) {
        if (action === "confirm") {
          utils.API.cart_checked({
            data: {
              token: me.mall_token,
              "rec_id" :rec_id,  // 1250,1251（批量）
              "is_checked" : 0,
              "location": me.location,
            }
          })
          .then(function(ret) {
            me.getCart();
          })
          .catch(function(ret) {
            !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
          });
        }
      });
    },

    getOrderType:function(){
      var order_type = [];

      _.forEach(this.can_buy_goods_category,function(value,key){
        var str = value.name+value.select_config;
        order_type.push(str);
      })
      return order_type.join("");
    },

    gotoPay:function(){
      var me = this,
          rec_id = this.getRecId(this.can_buy_goods_category);

      if(this.is_loading_btn){
        return;
      }

      if(!rec_id){
        return;
      }

      if(!this.can_pay){
        // Toast("有未达到存储克重的产品！");
        return;
      }

      if(!this.select_agreement){
        Toast("请同意《黄金象用户存储协议》！");
        return;
      }

      if(this.cart.disabled_label != ''){
        Toast("购物车异常！");
        return;
      }

      var data = {
        shipping_id:"ship_o2o_express",
        rec_id:rec_id,
        address_id:"-1",
        order_type:this.getOrderType(),
      }

      this.is_loading_btn = true;
      this.genOrder(data);
    }.after(function() {
      utils.trackEvent("click_orderPage_payButton");
    }),

    flowCheckOrder:function(address_id,cb){
      var _this = this;

      utils.API.flow_checkOrder({
        data: {
          token: _this.mall_token,
          location: _this.location,
          "address_id" : address_id,
          // "rec_id" : rec_id,
          "order_type":1,//1：存储；2：提货
        }
      })
      .then(function(ret) {
        _this.check_order = _.assign(_this.check_order,ret.model.data);

        if(_this.check_order.shipping_list && _this.check_order.shipping_list.length){
          _this.shipping_info = _.assign({},_this.check_order.shipping_list[0]);
        }

        if(_this.check_order.bonus && _this.check_order.bonus.length){
          _this.bonus = _this.check_order.bonus;
        }

        cb&&cb(ret);

      })
      .catch(function(ret) {
        if(ret.errorCode == 80009){
          Toast("商品价格有所变动，已为您重新计算！");
          _this.getCart(function(){
            _this.flowCheckOrder("-1",_this.getRecId(_this.can_buy_goods_category));
          });
        }else{
          !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        }
      });
    },

    genOrder:function(data){
      var _this = this,
          data = _.assign(data,{
            token: _this.mall_token,
            pay_id: -1,
            need_inv: 0,
            location: _this.location,
            integral: 0,
          });

      if(_this.bonus.length > 0 && _this.active_coupon){
        data.bonus = _this.active_coupon.bonus_id;
      }

      utils.API.flow_done({
        //然后生成订单
        data:data,
        show_loading:true,
      })
      .then(function(ret) {
        _this.order_id = ret.model.data.order_id;
        _this.$router.push({ path: `/order/${_this.order_id}/paymenttype`});
        setTimeout(function(){
          _this.is_loading_btn = false;
        },200);
        
      })
      .catch(function(ret) {
        if(ret.errorCode == 80009){
          Toast("商品价格有所变动，已为您重新计算！");
          _this.getCart(function(){
            _this.flowCheckOrder("-1",_this.getRecId(_this.can_buy_goods_category));
          });
        }else{
          !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        }
        _this.is_loading_btn = false;
      });
    },

    //弹层操作
    selectCoupon:function(coupon,number){
      this.bonus.forEach(function(item,index){
        if(coupon){
          if(index == number){
            item.is_checked = true;
          }else{
            item.is_checked = false;
          }
        }else{
          item.is_checked = false;
        }
      })

      this.select_coupon = coupon?_.assign({},coupon):coupon;

      this.coupons_modal = !this.coupons_modal;
    },
    closeCouponsModal:function(){
      this.coupons_modal = !this.coupons_modal;
    },
    //弹层操作
    
    showTip:function(){
      MessageBox({
        title: '',
        message: '特别说明：如遇周末及节假日，到期时间根据天数自动顺延',
        showCancelButton: false,
      });
    },

    goBack: function() {
      this.$router.goBack();
    }
  }
};
</script>

<style lang="less" scoped>
@import "./GenOrderStorage.less";
</style>