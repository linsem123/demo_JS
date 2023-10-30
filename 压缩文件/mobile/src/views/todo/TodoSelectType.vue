<template>
  <div>
    <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">选择到期处理方式</div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->


    <div class="todo-type-wrap">
      <div class="top-blank"></div>

      <ul class="type-wrap">
        <li class="type-cell" @click="switchType('storage')">
          <span class="select-core" :class="current_type == 'storage'?'active':''"></span>
          <div class="content">
            <h4 class="type-title">
              <span class="title-text">续存</span>
            </h4>
            <p>1、重新选择固定期限，生成“续存订单”</p>
            <p>2、以黄金象当日金价计算发放“续存订单”固定收益</p>
          </div>
        </li>
        <li class="type-cell" @click="switchType('buyback')">
          <span class="select-core" :class="current_type == 'buyback'?'active':''"></span>
          <div class="content">
            <h4 class="type-title">
              <span class="title-text">卖出</span>
              <!-- <span class="title-extra">推荐</span> -->
            </h4>
            <p>1、以黄金象当日金价卖出</p>
            <p>2、卖出无手续费</p>
            <p>3、卖出金额将直接进入您的黄金象账户</p>
          </div>
        </li>
        <li class="type-cell" @click="switchType('withdraw')">
          <span class="select-core" :class="current_type == 'withdraw'?'active':''"></span>
          <div class="content">
            <h4 class="type-title">
              <span class="title-text">提取实物金条</span>
            </h4>
            <p>1、10克起提，可选实物金条规格：10/20/50/100克</p>
            <p>2、顺丰包邮</p>
            <p>3、随货寄送金条质检证书及发票</p>
          </div>
        </li>
      </ul>
  	</div>


    <div class="bottom-wrap">
      <a class="bottom-btn yellow" @click="gotoNext()">下一步</a>
    </div>
    <!-- <div class="bottom-wrap">
      <a class="bottom-btn yellow" @click="gotoNext('withdraw')">提货</a>
      <a class="bottom-btn red" @click="gotoNext('storage')">存储</a>
      <a class="bottom-btn blue" @click="gotoNext('buyback')">不出库回购<span class="iconfont icon-tishi" @click.stop="show_contract=!show_contract"></span>
      </a>
    </div> -->

  </div>
</template>

<script>
import topHead from "@/views/components/TopHead.vue";
import store from '@/vuex/index.js'
import { Toast, MessageBox, } from "mint-ui";

// utils.extendApi(API);//把API扩充到utils方法里边

export default {
  components: {
    topHead: topHead,
  },
  data() {
    return {
      mall_token:"",

      todo_list:[],
      goods_list:[],
      selected_goods_info:[],

      type_data:{
        buyback:false,//不出库回购
        withdraw:false,//提货
        storage:true,//存储
      },
    }
  },
  computed: {
    macross() {
      return this.$store.getters.getMacross;
    },
    current_type(){
      var res = "";
      _.forEach(this.type_data,function(value,key){
        if(value){
          res = key;
        }
      });

      return res;
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
      this.setSelectedGoodsInfo();
      this.getTodoList();
    },
    setSelectedGoodsInfo(){
      var goods_info = this.$route.params.selected_goods_info||[],
          res = [];
      goods_info = goods_info.split(",");

      goods_info.forEach(function(item){
        var arr = item.split("-");
        res.push({
          goodsId:arr[0],
          is_checked:true,
          number:arr[1],
        })
      });

      this.selected_goods_info = res;
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
          
          var obj = _.find(me.selected_goods_info,function(o){
            return o.goodsId == item.goodsId;
          });

          if(obj){
            item.is_checked = obj.is_checked;
            item.number = obj.number;
          }
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

    switchType:function(type){
      var me = this;
      _.forEach(this.type_data,function(value,key){
        if(key == type){
          me.type_data[key] = true;
          // value = true;
        }else{
          me.type_data[key] = false;
          // value = false;
        }
      });
    },

    gotoNext:function(){
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

      switch(this.current_type){
        case "withdraw":
          // path = `/my/todo/generate/storage/${selected_goods_info}`;
          let remainder = this.total_weight%10;
          if(remainder != 0){
            Toast("只能提取10克的倍数哦!");
            return;
          }
          this.$router.push({ path:`/my/todo/generate/withdraw/${selected_goods_info}`});
          break;
        case "storage":
          // path = `/my/todo/generate/storage/${selected_goods_info}`;
          this.$router.push({ path:`/my/todo/generate/storage/${selected_goods_info}`});
          break;
        case "buyback":
          // path = `/my/todo/generate/buyback/${selected_goods_info}`;
          // MessageBox({
          //   title: "",
          //   message: `<div>确定不出库回购吗？(确认后生成订单)</div>
          //             <div class="message-box-content">选择确认即视为同意<a @click="show_contract=!show_contract">《黄金象用户不出库回购业务协议》</a><div>`,
          //   showCancelButton: true
          // }).then(function(action) {
          //   if (action === "confirm") {
          //     var date = me.formatBuybackSendOrderData(product_names,selected_goods);
          //     me.genBuybackOrder(date);
          //   }
          // });
          var date = me.formatBuybackSendOrderData(product_names,selected_goods);
          me.genBuybackOrder(date);
          break;
      }
      
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
@import "./TodoSelectType.less";
</style>