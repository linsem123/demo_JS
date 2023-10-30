<template>
  <div>
    <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">卖出</div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->


    <div class="todo-buyback-wrap">
      <div class="top-blank"></div>

      <div class="config-wrap">
        <div class="config-wrap-inner">
          <div class="config-title bold">锁定金价</div>
          <div class="config-info">
            <p class="config-text red bold">{{detail.unitPrice&&detail.unitPrice.toFixed(2)||''}}<span class="unit">元/克</span></p>
          </div>
        </div>
      </div>
      
      <!-- 购买信息 -->
      <div class="buy-info-wrap">
        <ul class="cart-goods-list">
          <li class="cart-goods-cell" v-for="goods in detail.details">
            <div class="goods-info-img-wrap">
              <img class="goods-info-img" :src="goods.url">
            </div>
            <div class="goods-info">
              <h4 class="goods-info-title">{{goods.goodsName}}</h4>
              <div class="goods-info-price-wrap">
                <span class="goods-info-number">x{{goods.quantity}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!-- 购买信息 -->

      <div class="config-wrap">
        <div class="config-wrap-inner">
          <div class="config-title">卖出克重</div>
          <div class="config-info">
            <p class="config-text">{{detail.weigh}}克</p>
          </div>
        </div>
      </div>

      <div class="order-info-wrap">
        <div class="order-info-line">
          <div class="order-info-line-inner">
            <label>预计金额<span>（克重*锁定金价）</span></label>
            <span class="info-line-text">￥{{((detail.unitPrice&&detail.unitPrice||0)*(detail.weigh&&detail.weigh||0)).toFixed(2)}}</span>
          </div>
          <div class="order-info-line-inner">
            <label>手续费</label>
            <span class="info-line-text red">-￥{{detail.buybackFee&&detail.buybackFee.toFixed(2)||0}}</span>
          </div>
        </div>
        <div class="order-info-line">
          <div class="order-info-line-inner">
            <label>最终成交金额</label>
            <span class="info-line-text red">¥{{detail.amount&&detail.amount.toFixed(2)||0}}</span>
          </div>
        </div>
        <div class="order-info-line">
          <div class="order-info-line-inner">
            <label>订单编号</label>
            <span class="info-line-text">{{detail.orderNo}}</span>
          </div>
          <div class="order-info-line-inner">
            <label>订单生成日期</label>
            <span class="info-line-text">{{detail.createTime}}</span>
          </div>
        </div>
      </div>
  	</div>

    <template if="detail.status==1">
      <div class="agreement-wrap">
        <span class="select-core" :class="select_agreement?'checked':''" @click="select_agreement=!select_agreement"></span>
        <span class="agreement-text">我已阅读并同意<i @click="show_contract=true">《黄金象用户不出库回购业务协议》</i></span>
      </div>

      <div class="bottom-wrap">
        <a class="bottom-btn left" @click="cancel">取消订单</a>
        <a class="bottom-btn right" @click="gotoPay">确认回购</a>
      </div>
    </template>


    <!-- 黄金象用户注册协议 -->
      <Popup
          v-model="show_contract"
          position="right" 
          class="pop-modal">
        <a href="javascript:void(0);" class="iconfont icon-back" @click="show_contract=!show_contract"></a>
        <div class="title">黄金象用户不出库回购业务协议</div>
        <div class="content">
          <div class="pop-content-wrap" v-html= "contract.body"></div>
        </div>
      </Popup>
    <!-- 黄金象用户注册协议 -->

  </div>
</template>

<script>
import topHead from "@/views/components/TopHead.vue";
import appconfig from "@/config/appconfig.js";

import { Toast, MessageBox, Popup } from "mint-ui";

// utils.extendApi(API);//把API扩充到utils方法里边

export default {
  components: {
    topHead: topHead,
    Popup:Popup,
  },
  data() {
    return {
      mall_token:"",
      detail:{
        "id":"",
        "status":1,
        "type":1,
        "orderNo":"",
        "productName":"",
        "unitPrice":0,
        "weigh":0,
        "createTime":"",
        "amount":0,
        "details": [],
      },

      select_agreement:true,
      show_contract:false,
      contract:{
        title:"",
        body:"",
      },
    };
  },
  computed: {
    macross() {
      return this.$store.getters.getMacross;
    },
    order_id() {
      return this.$route.params.order_id||"";
    },
    // mall_token(){
    //   return utils.storageGet("mall_token")
    // },
  },
  watch:{
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
      this.getBuybackDetail();
    },

    getContract:function(){
      var me = this;

      utils.API.cmsservice_contract_buyback({
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
    
    getBuybackDetail:function(){
      var me = this;

      utils.API.buyback_detail({
        data: {
          token: me.mall_token,
          "reqBody":{
            id:me.order_id,
          },
        }
      })
      .then(function(ret) {
        me.detail = _.assign({},ret.model);
        // me.$router.push({ path:`/my/todo/payresult`});
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    cancel:function(){
      var me = this;

      MessageBox({
        title: "",
        message: "确定取消吗？",
        showCancelButton: true
      }).then(function(action) {
        if (action === "confirm") {
          utils.API.buyback_cancel({
            //取消订单
            data: {
              token: me.mall_token,
              "reqBody":{
                id:me.order_id,
              },
            }
          })
          .then(function(ret) {
            Toast("取消成功！");
            setTimeout(function(){
              me.$router.push({ path:`/my/order/buyback/${me.order_id}`});
            },2000);
          })
          .catch(function(ret) {
            !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
          });
        } else {

        }
      });
    },

    gotoPay:function(){
      var me = this,
          data = {
            id:this.order_id,
          };

      if(!this.select_agreement){
        Toast("请同意《黄金象用户不出库回购业务协议》！");
        return;
      }

      utils.API.buyback_confirm({
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
@import "./TodoBuyback.less";
</style>