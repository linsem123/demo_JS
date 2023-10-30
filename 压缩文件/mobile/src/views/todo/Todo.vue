<template>
  <div>
    <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">待办</div>
      <div slot="right">
        <span class="right-span" @click="show_orderlist=!show_orderlist">到期订单</span>
      </div>
    </top-head>
    <!-- 头部 -->


    <div class="todo-wrap" :class="{white:!todo_list.length}">
      <div class="top-blank"></div>

      <template v-if="todo_list.length">


        <div class="goods-info-wrap">
          <!-- 商品信息 -->
          <div class="goods-info" v-for="(goods, index) in todo_list">
            
            <div class="goods-info-inner">
              <div class="goods-info-select" @click="switchCheckStatus(goods)">
                <span class="select-core" :class="goods.is_checked?'checked':''"></span>
              </div>
              <div class="goods-info-body clearfix">
                <div class="goods-info-img-wrap">
                  <img class="goods-info-img" :src="goods.url">
                </div>
                <div class="goods-info-body-right">
                  <h4 class="goods-info-title">{{goods.goodsName}}</h4>
                  <div class="goods-info-price-wrap">
                    <div class="goods-info-amount-number-wrap">
                      <span class="subtract-btn iconfont icon-subtract-btn" @click="switchAmount(goods,false)"></span>
                      <input class="goods-info-amount-number" type="number" name="" readonly="readonly" v-model="goods.number"/>
                      <span class="add-btn iconfont icon-add-btnfill" @click="switchAmount(goods,true)"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 商品信息 -->
        </div>

        <div class="zhanwei"></div>

      </template>
      
      <template v-else>
        <div class="wrapper">
          <img src="@/assets/images/todo-nothing.jpg">
        </div>
      </template>
  	</div>


    <template v-if="todo_list.length">
      <div  class="checkstand-wrapper">
        <p class="select-all">
          <span class="select-core" :class="select_all?'checked':''" @click="selectAll()"></span>
          <span class="select-all-text">全选</span>
        </p>
      </div>
      
      <div class="bottom-wrap">
        <a class="bottom-btn yellow" @click="gotoNext()">下一步</a>
      </div>
    </template>

    <!-- <div class="bottom-wrap">
      <a class="bottom-btn yellow" @click="gotoNext('withdraw')">提货</a>
      <a class="bottom-btn red" @click="gotoNext('storage')">存储</a>
      <a class="bottom-btn blue" @click="gotoNext('buyback')">不出库回购<span class="iconfont icon-tishi" @click.stop="show_contract=!show_contract"></span>
      </a>
    </div> -->
    
    <div class="regular-wrap" @click="show_regular=!show_regular">
      <img class="regular-img" src="@/assets/images/todo-regular.png">
    </div>

    <!-- 到期规则 -->
      <Popup
          v-model="show_regular"
          position="right" 
          class="pop-modal">
        <a href="javascript:void(0);" class="iconfont icon-back" @click="show_regular=!show_regular"></a>
        <div class="title">到期处理规则</div>
        <div class="content">
          <div class="pop-content-wrap">
            <ul class="regular-unit">
              <li class="regular-cell">
                <h4 class="regular-title">卖出</h4>
                <p>操作步骤：<span class="bold">选择到期商品-提交订单-确认卖出</span></p>
                <p>1、以黄金象当日金价卖出，获得金价波动收益</p>
                <p>2、卖出无手续费</p>
                <p>3、卖出金额将直接进入您的黄金象账户</p>
                <p>4、金价波动收益：当日金价高于买入金价时，获得金价波动收益</p>
              </li>
              <li class="regular-cell">
                <h4 class="regular-title">提取实物金条</h4>
                <p>操作步骤：<span class="bold">选择到期商品-填写提货信息-等待发货-确认收货</span></p>
                <p>1、10克起提，可选实物金条规格：10/20/50/100克</p>
                <p>2、顺丰包邮</p>
                <p>3、随货寄送金条质检证书及发票</p>
              </li>
              <li class="regular-cell">
                <h4 class="regular-title">续存</h4>
                <p>操作步骤：<span class="bold">选择到期商品-选择续存固定期限-提交续存订单</span></p>
                <p>1、以黄金象当日金价计算“续存订单”固定收益</p>
                <p>2、下单后，即发放固定收益至黄金象账户中</p>
              </li>
            </ul>
          </div>
        </div>
      </Popup>
    <!-- 到期规则 -->

    <!-- 存储到期订单 -->
      <Popup
          v-model="show_orderlist"
          position="right" 
          class="pop-modal">
        <a href="javascript:void(0);" class="iconfont icon-back" @click="show_orderlist=!show_orderlist"></a>
        <div class="title">到期订单</div>
        <div class="content">
          <div class="pop-content-wrap order-list">
            <ul class="order-list" v-if="order_list&&order_list.length>0">
              <li class="order" v-for="(order,index) in order_list" :key="order.id">
                <div class="order-status"> 
                  <span class="order-status-datetime">到期日期:{{order.calInterestStopTime}}</span>
                  <span class="order-status-label  float-right red"> {{order.status | renderStatus(order_type_status) }} </span>
                </div>
                <ul class="goods-list">
                  <li class="goods clearfix" v-for="goods in order.details" :key="goods.goodsId">
                    <img alt="" class="goods-cover" v-lazy="{src: goods.url, loading:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwcHgiICBoZWlnaHQ9IjIwMHB4IiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIGNsYXNzPSJsZHMtZWNsaXBzZSIgc3R5bGU9ImJhY2tncm91bmQ6IG5vbmU7Ij48cGF0aCBuZy1hdHRyLWQ9Int7Y29uZmlnLnBhdGhDbWR9fSIgbmctYXR0ci1maWxsPSJ7e2NvbmZpZy5jb2xvcn19IiBzdHJva2U9Im5vbmUiIGQ9Ik0zMCA1MEEyMCAyMCAwIDAgMCA3MCA1MEEyMCAyMiAwIDAgMSAzMCA1MCIgZmlsbD0iI2ZmYjYwNiIgdHJhbnNmb3JtPSJyb3RhdGUoMTI0LjU2OSA1MCA1MSkiPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBjYWxjTW9kZT0ibGluZWFyIiB2YWx1ZXM9IjAgNTAgNTE7MzYwIDUwIDUxIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGVUcmFuc2Zvcm0+PC9wYXRoPjwvc3ZnPg=='}">
                    <div class="goods-info">
                      <h1 class="goods-name"> {{goods.goodsName}} </h1>
                      <p>
                        <!-- <span class="goods-price"> {{goods.weigh}}克 </span> -->
                        <span class="goods-number"> x{{goods.quantity}} </span>
                      </p>
                    </div>
                  </li> 
                </ul>
                <p class="total">
                  <span>赠送金:{{order.interest}}克</span>
                  <span>
                    <span>共{{order.details?order.details.length:""}}件商品</span>&nbsp;&nbsp;<span class="float-right">合计克重:{{order.weigh}}</span>
                  </span>
                </p>
              </li>
            </ul>
            <div v-else class="none-order">
              <img src="@/assets/images/orders-nothing.png">
            </div>
          </div>
        </div>
      </Popup>
    <!-- 存储到期订单 -->

    <!-- 黄金象用户注册协议 -->
      <!-- <Popup
          v-model="show_contract"
          position="right" 
          class="pop-modal">
        <a href="javascript:void(0);" class="iconfont icon-back" @click="show_contract=!show_contract"></a>
        <div class="title">黄金象用户不出库回购业务协议</div>
        <div class="content">
          <div class="pop-content-wrap" v-html= "contract.body"></div>
        </div>
      </Popup> -->
    <!-- 黄金象用户注册协议 -->

  </div>
</template>

<script>
import appconfig from "@/config/appconfig.js";
import topHead from "@/views/components/TopHead.vue";
import store from '@/vuex/index.js'
import { order_type_status } from "@/assets/js/constants";
import { Toast, MessageBox, Popup, } from "mint-ui";

// utils.extendApi(API);//把API扩充到utils方法里边

export default {
  components: {
    topHead: topHead,
    Popup:Popup,
  },
  data() {
    return {
      mall_token:"",
      order_type_status:order_type_status,

      todo_list:[],
      select_all:false,
      goods_list:[],

      show_orderlist:false,
      order_list:[],//存储已到期订单

      show_regular:false,

      // show_contract:false,
      // contract:{
      //   title:"",
      //   body:"",
      // },
    }
  },
  computed: {
    macross() {
      return this.$store.getters.getMacross;
    },
    total_weight(){
      var total_weight = 0;

      this.todo_list.forEach(function(item){
        if(item.is_checked){
          let weight = Number(item.spec)*Number(item.number);
          total_weight += parseFloat(weight.toFixed("2"));   
        }
      });

      return total_weight;
    },
    selected_product_name(){
      var product_name = [];

      this.todo_list.forEach(function(item){
        if(item.is_checked == true){
          if(!_.find(product_name,function(o){
            return o == item.productName;
          })){
            product_name.push(item.productName);
          }
        }
      })

      return product_name;
    },
  },
  watch:{
  },
  store,
  filters:{
    renderStatus(order_status,order_type_status){
      var statusName = '未知状态',
          type_status = _.find(order_type_status,function(o){
            return o.typeId == 2;
          }),
          status = _.find(type_status.status,function(o){
            return o.statusKey == order_status
          });
      return status.statusName?status.statusName:statusName;
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
      this.getTodoList();
      // this.getContract();
      this.getDepositOrderList(2);//1.存储中 2.已到期 3.提前结束 4.待付款 5.已取消（ecjia） 6.确认中 7.初始化(保留)
    },

    // getContract:function(){
    //   var me = this;

    //   utils.API.cmsservice_contract_buyback({
    //     method:"get",
    //   })
    //   .then(function(ret) {
    //     let contract = "";

    //     if(ret.model&&ret.model.length){
    //       var the_same = _.find(ret.model,function(o){return o.field_audit_status == "无";});

    //       if(the_same){
    //         contract = the_same;
    //       }else{
    //         if(!me.macross){
    //           contract = _.find(ret.model,function(o){
    //             return o.field_audit_status == "审核前";
    //           });
    //         }else{
    //           contract = _.find(ret.model,function(o){
    //             return o.field_audit_status == "审核后";
    //           });
    //         }
    //       }

    //       var reg = /\"+?\/(.+)((\.jpg)|(\.png))\"/gi;
    //       contract.body = contract.body.replace(reg,"\""+appconfig.cmsbaseurl+"/"+"$1$2"+"\"");
    //       me.contract = _.assign({},contract);
    //     }
    //   })
    //   .catch(function(ret) {
    //     !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    //   });
    // },

    // 获取存储到期的订单
    getDepositOrderList(order_status,cb) {//获取寄存（存储）列表
      let data = {
            status:order_status,
            pageId: 1, //{number} 当前页，page为空返回全部列表
            pageSize: 9999, //{number} 每页显示条数
          };

      utils.API.deposit_list({
        data:{
          token: this.mall_token,
          reqBody:data,
        },
      })
      .then(res => {
        this.order_list = res.model.items;
        cb&&cb();
      })
      .catch((ret)=> {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        this.$refs.loadmore&&this.$refs.loadmore.onTopLoaded();
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
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    getSelectedGoods:function(){
      var selected_goods = [];

      this.todo_list.forEach(function(item){
        if(item.is_checked){
          selected_goods.push(item);
        }
      });

      return selected_goods;
    },
    getSelectedGoodsInfo:function(goods){
      var info = [];
      goods.forEach(function(item){
        info.push(item.goodsId+'-'+item.number);
      });
      return info.join(",");
    },


    switchCheckStatus:function(goods){
      var me = this,
          select_number = 0;
          
      if(this.selected_product_name.length > 0){
        if(!_.find(this.selected_product_name,function(o){
          return o == goods.productName;
        })){
          Toast("只能选择同一种类金属的商品！");
          return;
        }
      }
      
      goods.is_checked = !goods.is_checked;

      this.todo_list.forEach(function(item){
        if(item.is_checked){
          select_number += 1;
        }
      })

      if(select_number == this.todo_list.length){
        this.select_all = true;
      }else{
        this.select_all = false;
      }
    },
    selectAll:function(){
      var me = this;
      this.todo_list.forEach(function(item){
        item.is_checked = !me.select_all;
      })
      this.select_all = !this.select_all;
    },

    switchAmount:function(goods,add){//加减数量
      if(add){
        if(goods.number+1 > goods.value){
          // Toast("超出每人限购数量！");
          return;
        }else{
          goods.number += 1;
        }
      }else{
        if(goods.number-1 < 1){
          return;
        }else{
          goods.number -= 1;
        }
      }
    },
    gotoNext:function(name){
      var me = this,
          path = "",
          product_names = [],
          selected_goods = this.getSelectedGoods(),
          selected_goods_info = this.getSelectedGoodsInfo(selected_goods);

      if(selected_goods.length <= 0){
        Toast("请选择商品！");
        return;
      }

      selected_goods.forEach(function(item){
        var index = _.findIndex(product_names, function(product_name) { return product_name == item.productName;});
        if(index == -1){
          product_names.push(item.productName);
        }
      });

      if(product_names.length != 1){
        Toast("请选择单一的金属类别的商品！");
        return;
      }


      this.$router.push({ path:`/my/todo/selecttype/${selected_goods_info}`});

      // switch(name){
      //   case "withdraw":
      //     // path = `/my/todo/generate/storage/${selected_goods_info}`;
      //     let remainder = this.total_weight%10;
      //     if(remainder != 0){
      //       Toast("只能提10克的倍数哦!");
      //       return;
      //     }
      //     this.$router.push({ path:`/my/todo/generate/withdraw/${selected_goods_info}`});
      //     break;
      //   case "storage":
      //     // path = `/my/todo/generate/storage/${selected_goods_info}`;
      //     this.$router.push({ path:`/my/todo/generate/storage/${selected_goods_info}`});
      //     break;
      //   case "buyback":
      //     // path = `/my/todo/generate/buyback/${selected_goods_info}`;
      //     MessageBox({
      //       title: "",
      //       message: `<div>确定不出库回购吗？(确认后生成订单)</div>
      //                 <div class="message-box-content">选择确认即视为同意<a @click="show_contract=!show_contract">《黄金象用户不出库回购业务协议》</a><div>`,
      //       showCancelButton: true
      //     }).then(function(action) {
      //       if (action === "confirm") {
      //         var date = me.formatBuybackSendOrderData(product_names,selected_goods);
      //         me.genBuybackOrder(date);
      //       }
      //     });
      //     break;
      // }
    },
    formatBuybackSendOrderData:function(product_names,selected_goods){
      var goods = [];

      selected_goods.forEach(function(item){
        var obj = {
            goodsId:item.goodsId,//{string} 商品ID
            quantity:item.number,//{number} 数量
          };
        goods.push(obj);
      })

      return {
        // productName:product_names[0],
        items:goods,
      };
    },
    genBuybackOrder:function(data){
      var me = this;

      data.type = 2;//固定值2，代表回购商品

      utils.API.buyback_create({
        data: {
          token: me.mall_token,
          "reqBody":data,
        }
      })
      .then(function(ret) {
        // console.log(ret.model.unitPrice);
        me.$router.push({ path:`/my/todo/generate/buyback/${ret.model.id}`});
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },


    goBack: function() {
      // this.$router.push({ path:"/my"});
      this.$router.goBack();
    }
  }
};
</script>

<style lang="less" scoped>
@import "./Todo.less";
</style>