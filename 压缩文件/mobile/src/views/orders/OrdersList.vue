<template>
  <div @click="clickWholePage($event)">
    <!-- 头部 -->
    <top-head
     @go-back="goBack()"
    :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">
        <ul class="category-wrap">
          <li class="category-cell" :class="{ active:current_top_category_key==category.key }" v-for="category in top_category" @click.stop="clickTopCategory(category.key)">{{category.name}}</li>
        </ul>
      </div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->

    <!-- 理财的分类 -->
    <ul class="order-category" v-if="current_top_category_key==1">
      <li class="order-category-cell" :class="{ active:current_order_category_key==order_category.key,click:order_category.is_selected==true }" @click="clickOrderCategory(order_category)" v-for="order_category in top_category[0].order_category">
        <div class="cell-title">
          <span class="category-cell-text">{{order_category.active_name}}</span>
          <span class="trangle-up"></span>
          <span class="trangle-down"></span>
        </div>
        <div class="order-type-wrap">
          <ul class="order-type-list-wrap">
            <li class="order-type-list-cell" :class="{ selected:(current_order_category_key==order_category.key && current_order_type==type.statusKey) }" v-for="type in order_category.order_type" @click="clickOrderType(order_category,type)">
              <span class="type-name">{{type.statusName}}</span>
              <span class="iconfont icon-correct"></span>
            </li>
          </ul>
          <div class="order-type-mask"></div>
        </div>
      </li>
    </ul>
    <!-- 理财的分类 -->

    <!-- 金条/饰品的分类 -->
    <ul class="order-category" v-if="current_top_category_key==2">
      <li class="order-category-cell" :class="{ active:current_order_type==order_category.statusKey }" @click="clickOrderCategory(order_category)" v-for="order_category in top_category[1].order_category">
        <div class="cell-title">
          <span class="category-cell-text">{{order_category.statusName}}</span>
        </div>
      </li>
    </ul>
    <!-- 金条/饰品的分类 -->


    <div class="main" :class="{ white:order_list_status=='has_order_list',white:order_list_status=='none' }">
      <div v-if="order_list_status=='has_order_list'">
        
        <mt-loadmore style="min-height:calc(100vh - 3.84rem);" :top-method="loadTop" :auto-fill="true" ref="loadmore">
          <ul class="order-list-wrap"
            v-infinite-scroll="scrollLoadMore"
            infinite-scroll-disabled="!can_scroll"
            infinite-scroll-distance="10">

            <!-- 后台的订单 -->
              <template v-if="!/^[a-zA-z]+\_*$/.test(current_order_type)">
                <!-- 1:买入；2:卖出；3:到期提金 -->
                <!-- 买入 -->
                <template v-if="current_order_category_key==1">
                  <li class="order-cell" v-for="(order,index) in order_list" :key="order.id" @click="redirect(`/my/order/deposit/${order.id}`)">
                    <div class="order-left">
                      <div v-if="order.orderType==2" class="order-title">续存 {{order.weigh}}克</div>
                      <div v-else class="order-title">买入 {{order.weigh}}克</div>
                      <p class="order-time">{{order.createTime}}</p>
                    </div>
                    <div class="order-right">
                      <p class="order-price" v-if="order.paidAmount">{{order.paidAmount | toFixed}}元</p>
                      <p class="order-price-type"></p>
                      <p class="order-status"><span>{{renderStatus(order.status)}}</span></p>
                    </div>
                  </li>
                </template>
                <!-- 买入 -->

                <!-- 卖出 -->
                <template v-if="current_order_category_key==2">
                  <li class="order-cell" v-for="(order,index) in order_list" :key="order.id" @click="redirect(`/my/order/buyback/${order.id}`)">
                    <div class="order-left">
                      <div v-if="order.orderType==2" class="order-title">续存 {{order.weigh}}克</div>
                      <div v-else class="order-title">卖出 {{order.weigh}}克</div>
                      <p class="order-time">{{order.createTime}}</p>
                    </div>
                    <div class="order-right">
                      <p class="order-price">{{order.amount | toFixed}}元</p>
                      <p class="order-price-type">卖出金额</p>
                      <p class="order-status"><span>{{renderStatus(order.status)}}</span></p>
                    </div>
                  </li>
                </template>
                <!-- 卖出 -->

                <!-- 到期提金 -->
                <template v-if="current_order_category_key==3">
                  <li class="order-cell" v-for="(order,index) in order_list" :key="order.id" @click="redirect(`/my/order/delivery/${order.id}`)">
                    <div class="order-left">
                      <div class="order-title">到期提金 {{order.weigh}}克</div>
                      <p class="order-time">{{order.createTime}}</p>
                    </div>
                    <div class="order-right">
                      <p class="order-price"></p>
                      <p class="order-price-type"></p>
                      <p class="order-status"><span>{{renderStatus(order.status)}}</span></p>
                    </div>
                  </li>
                </template>
                <!-- 到期提金 -->
              </template>
            <!-- 后台的订单 -->


            <!-- ecjia的订单 -->
            <template v-if="/^[a-zA-z]+\_*$/.test(current_order_type)">
              <li class="order-cell" v-for="(order,index) in order_list" :key="order.order_id" @click="redirect(`/my/order/${order.order_id}`)">
                <div class="order-left">
                  <template v-if="order.goods_number>1">
                    <div class="order-title">
                      <p class="goods-name">{{order.goods_list | filterName}}</p>
                      <p class="goods-number">等{{order.goods_number||''}}件商品</p>
                    </div>
                  </template>
                  <template v-else>
                    <div class="order-title all">{{order.goods_list | filterName}}</div>
                  </template>
                  <p class="order-time">{{order.order_time}}</p>
                </div>
                <div class="order-right">
                  <p class="order-price">{{order.total_fee||'' | toFixed}}元</p>
                  <p class="order-price-type"></p>
                  <p class="order-status"><span>{{renderStatus(order.order_status_code)}}</span></p>
                </div>
              </li>
            </template>
            <!-- ecjia的订单 -->
          </ul>

          <div class="click-more">
            <div v-if="tip=='加载中...'" class="loading-box">
              <span class="loading-img"></span>
            </div>
            <span> {{tip}}</span>
          </div>

          <div class="zhanwei"></div>
        </mt-loadmore>
      </div>

      <div v-if="order_list_status=='loading'" class="loading-box">
        <span class="loading-img"></span>
      </div>

      <div v-if="order_list_status=='none'" class="none-order">
        <img src="@/assets/images/orders-nothing.png">
      </div>
    </div>
  </div>
</template>

<script>
import topHead from "@/views/components/TopHead.vue";

import _ from 'lodash';

import { Toast,MessageBox,Loadmore } from "mint-ui";

import { order_type_status } from "@/assets/js/constants";

export default {
  components: {
    topHead:topHead,
    mtLoadmore:Loadmore,
  },
  data() {
    return {
      mall_token:"",

      top_category:[
        {//理财的分类
          name:"理财",
          key:1,
          has_subcategory:true,
          order_category:[
            {
              name:"买入",
              key:1,//订单分类
              typeId: 2,//买入
              active_name:"买入",
              is_selected:false,
              has_subcategory:true,
              order_type:[],
            },
            {
              name:"卖出",
              key:2,//订单分类
              typeId: 3,//卖出
              active_name:"卖出",
              is_selected:false,
              has_subcategory:true,
              order_type:[],
            },
            {
              name:"到期提金",
              key:3,//订单分类
              typeId: 4,//到期提金
              active_name:"到期提金",
              is_selected:false,
              has_subcategory:true,
              order_type:[],
            }
          ],
        },
        {//金条/饰品的分类
          name:"金条/饰品",
          typeId: 1,
          key:2,
          has_subcategory:false,
          order_category:[],
        },
      ],
      current_top_category_key:1,//当前选中的顶级分类,1:理财；2:买金条
      current_order_category_key:1,//当前选中的订单分类,1:买入；2:卖出；3:到期提金;
      current_order_type:-1,//当前选中的订单类型

      click_typeId:null,


      tip: "",
      order_list: null,
      page_size: 10,
      page: 1,

      getting_list:false,
      can_scroll:true,

    };
  },
  filters:{
    totalFee(rawInfo){
      let res = "";
      if(rawInfo && rawInfo.formatedTotalFee){
        let exec = /\d+(\.\d+)*/g.exec(rawInfo.formatedTotalFee);
        if(exec){
          res = Number(exec[0]).toFixed(2)+"元";
        }
      }
      return res;
    },
    toFixed(price){
      return price?parseFloat(price).toFixed(2):"";
    },
    filterName:function(goods_list){
      let res = "";
      
      if(goods_list&&goods_list.length){
        goods_list.forEach(function(item){
          res += item.name;
        });
      }

      return res;
    },
    // computeTotalWeight(goods_list){
    //   let __weight = 0;
    //   goods_list.forEach( goods => {
    //     __weight = __weight + parseInt(goods.quantity) * parseFloat(goods.weigh);
    //   })
    //   return __weight;
    // },
    
  },
  computed: {
    seller_id() {
      return this.$store.getters.getSellerId;
    },
    order_list_status(){
      let res = "";
      if(this.order_list && this.order_list.length > 0){
        res = "has_order_list";
      }else if(this.order_list==null){
        res = "loading";
      }else{
        res = "none";
      }
      return res;
    },
    // mall_token() {
    //   return utils.storageGet("mall_token");
    // },
    click_order_category(){
      var res = {};

      this.top_category.forEach(function(item){
        item.order_category.forEach(function(category){
          if(category.is_selected){
            res = category;
          }
        })
      });

      return res;
    },

    location() {
      return this.$store.getters.getLocation;
    },
  },
  mounted() {
    let me = this;

    this.top_category.forEach(function(item){
      if(item.has_subcategory){
        item.order_category.forEach(function(cell){
          let index = _.findIndex(order_type_status,function(o){ return o.typeId == cell.typeId });
          if(index != -1){

            let status = order_type_status[index].status.filter(function(item){
              return item.canFilter == true;
            });
            cell.order_type = status;
          }
        })
      }else{
        let index = _.findIndex(order_type_status,function(o){ return o.typeId == item.typeId });
        if(index != -1){
          let status = order_type_status[index].status.filter(function(item){
            return item.canFilter == true;
          });
          item.order_category = status;
        }
      }
    });

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
      this.mall_token = utils.storageGet("mall_token");

      this.page = 1;
      this.order_list = null;

      this.handleGetOrderList(true);
    },

    renderStatus(order_status){
      var me = this,
          res = "",
          select_top_category = _.find(this.top_category,function(o){ return me.current_top_category_key == o.key });
      if(select_top_category.has_subcategory){//理财的分类
        if(select_top_category){
          let selected_order_category = _.find(select_top_category.order_category,function(o){ return me.current_order_category_key == o.key });
          if(selected_order_category){
            let filter = selected_order_category.order_type.filter(function(item){
              return order_status == item.statusKey
            });

            if(filter&&filter.length){
              res = filter[0].statusName;
            }
          }
        }
      }else{//金条/视频的分类
        let selected_order_category = _.find(select_top_category.order_category,function(o){ return order_status == o.statusKey });
        if(selected_order_category){
          res = selected_order_category.statusName;
        }
      }
      return res;
    },

    //选择顶部分类
    clickTopCategory:function(category_key){
      if(this.current_top_category_key == category_key){//点了自己
        return;
      }

      this.current_top_category_key = category_key;//当前选中的顶级分类,1:理财；2:买金条
      this.click_order_category.is_selected = false;

      switch(category_key){
        case 1:
          this.current_order_type = -1;//当前选中的订单类型
          this.current_order_category_key = 1;
          break;
        case 2:
          this.current_order_type = "all";//当前选中的订单类型
          break;
      }
      
      this.handleGetOrderList(true);
    },
    resetActive:function(top_category_index,typeId){
      this.top_category[top_category_index].order_category.forEach(function(item){
        if(item.typeId == typeId){
          item.is_selected = false;
        }
      })
    },
    //选择订单分类
    clickOrderCategory:function(order_category){
      if(order_category.has_subcategory){//理财的分类
        if(order_category.key == this.click_order_category.key){//判断是点击了自己
          order_category.is_selected = false;
          return;
        }

        if(!_.isEmpty(this.click_order_category)){
          // this.resetActive(0,this.click_typeId);
          this.click_order_category.is_selected = false;
        }

        this.$nextTick(function () {
          // DOM 现在更新了
          // `this` 绑定到当前实例
          order_category.is_selected = true;
        })

        
        
        // setTimeout(function(){
        //   order_category.is_selected = true;
        // },0);

      }else{
        this.current_order_type = order_category.statusKey;
        this.handleGetOrderList(true);
      }
      // this.click_typeId = order_category.typeId;
    },
    //整个页面的点击的操作
    clickWholePage:function($event){
      if($event.target.className == "order-type-mask"){//如果点击的是订单分类的蒙层
        this.click_order_category.is_selected = false;
        return;
      }

      var res = _.find($event.path,function(o){ return /order-category-cell/g.test(o.className) })
      if(!res){//点击的不是当前订单分类里边和分类列表里的元素，所以收起
        this.click_order_category.is_selected = false;
      }
    },
    //恢复改变的订单分类的初始状态名字
    resetOrderCategory:function(){
      var me = this,
          select_top_category = _.find(this.top_category,function(o){ return me.current_top_category_key == o.key });

      if(select_top_category){
        var selected_order_category = _.find(select_top_category.order_category,function(o){ return me.current_order_category_key == o.key });
        if(selected_order_category){
          selected_order_category.active_name = selected_order_category.name;
        }
      }
    },
    //选择订单分类里边类型列表
    clickOrderType:function(order_category,type){
      
      this.resetOrderCategory();//恢复之前选择的订单分类的初始状态名字
      this.current_order_type = type.statusKey;

      this.$nextTick(function () {
        // DOM 现在更新了
        // `this` 绑定到当前实例
        this.current_order_category_key = order_category.key;

        this.click_order_category.is_selected = false;
        switch(type.statusKey){
          case "all":
            order_category.active_name = order_category.name;
            break;
          case "-1":
            order_category.active_name = order_category.name;
            break;
          default:
            order_category.active_name = type.statusName;
        }

        this.handleGetOrderList(true);

      });
    },

    handleGetOrderList:function(reset,cb){
      // current_top_category_key:1,//当前选中的顶级分类
      // current_order_category_key:1,//当前选中的订单分类
      // current_order_type:"all",//当前选中的订单类型
      var func = "",
          para = [];

      if(reset){
        this.order_list = null;
      }

      if(/^[a-zA-z]+\_*$/.test(this.current_order_type)){//如果都是字母是ecjia的订单
        func = "getInstanceDeliveryOrderList";
        para.push(this.current_order_type,this.current_top_category_key);////0表示所有类型，1表示存储类型，2表示提货类型

      }else{//是黄金象自己后台的订单
        switch(this.current_order_category_key){
          case 1://1:买入,2:卖出,3:到期提金
            func = "getDepositOrderList";//存储（寄存）订单列表(买入)
            break;
          case 2://1:买入,2:卖出,3:到期提金
            func = "getBuybackOrderList";//回购订单列表(卖出)
            break;
          case 3://1:买入,2:卖出,3:到期提金
            func = "getDepositDeliveryOrderList";//存储提货订单列表(到期提金)
            break;
        }
        para.push(this.current_order_type);
      }

      para.push(reset);

      if(cb){
        para.push(cb);
      }
      this[func].apply(this,para);
    },

    loadTop:function(){
      this.handleGetOrderList(true);
    },


    scrollLoadMore:function(){//滚动加载
      this.can_scroll = false;

      if(this.tip == "-没有更多啦-"){
        return;
      }

      if(this.getting_list){
        return;
      }

      this.tip = "加载中...";

      this.handleGetOrderList(false,()=>{
        this.$nextTick(function() {
          // DOM 现在更新了
          // `this` 绑定到当前实例
          setTimeout(()=>{
            if(this.tip == "-没有更多啦-"){
              this.can_scroll = false;
            }else{
              this.can_scroll = true;
            }
          },1000)
        })
      });
    },

/********************************获取订单列表/********************************/
    getInstanceDeliveryOrderList(order_status,ecjia_order_type,reset,cb) {//获取即时提货、存储订单列表（ecjia）
      if(reset){
         this.page = 1; 
      }

      let data = {
        token: this.mall_token,
        order_type:ecjia_order_type||2,//0表示所有类型，1表示存储类型，2表示提货类型
        pagination: {
          count: this.page_size,
          page: this.page,
        }
      };

      this.getting_list = true;

      if (order_status !== "all") {
        data.type = order_status;
      }

      utils.API.order_list({
        data: data
      })
      .then(res => {
        // this.order_list = [];
        let _data = _.isArray(res.model.data)?res.model.data:[]


        if(this.page == 1){
          this.order_list = _data;
          this.page += 1;
          if(res.model.paginated.more == 0){
            this.tip = "-没有更多啦-";
          }else{
            this.tip = "";
            // this.tip = "-点击加载更多-";
          }
        }else{
          if(res.model.paginated.more == 0){
            this.tip = "-没有更多啦-";
            if(this.order_list.length < res.model.paginated.total){
              this.order_list = [].concat(this.order_list,_data);
            }
          }else{
            this.page += 1;
            this.tip = "";
            // this.tip = "-点击加载更多-";
            // this.order_list = [].concat(this.order_list,data);
            this.order_list = [].concat(this.order_list,_data);
          } 
        }

        this.$refs.loadmore&&this.$refs.loadmore.onTopLoaded();
        this.getting_list = false;
        cb&&cb();
      })
      .catch(ret => {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        this.$refs.loadmore&&this.$refs.loadmore.onTopLoaded();
        this.getting_list = false;
      });
    },
    getDepositOrderList(order_status,reset,cb) {//获取寄存（存储）列表
      if(reset){
         this.page = 1; 
      }

      let data = {
        status:"",
        pageId: this.page, //{number} 当前页，page为空返回全部列表
        pageSize: this.page_size, //{number} 每页显示条数
      };

      this.getting_list = true;

      if (order_status != "-1") {//-1表示全部
        data.status = order_status;
      }

      utils.API.deposit_list({
        data:{
          token: this.mall_token,
          reqBody:data,
        },
      })
      .then(res => {
        let _data = res&&res.model&&res.model.items||[];

        if(this.page == 1){
          this.order_list = _data;
          
          if(this.page < res.model.pageSum){
            this.page += 1;
            this.tip = "";
          }else{
            this.tip = "-没有更多啦-";
            // this.tip = "-点击加载更多-";
          }

        }else if(this.page < res.model.pageSum){//证明不是最末页
          this.order_list = [].concat(this.order_list,_data);
          this.tip = "";
          this.page += 1;
        }else{
          this.order_list = [].concat(this.order_list,_data);
          this.tip = "-没有更多啦-";
        }

        this.$refs.loadmore&&this.$refs.loadmore.onTopLoaded();
        this.getting_list = false;
        cb&&cb();
      })
      .catch((ret)=> {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        this.$refs.loadmore&&this.$refs.loadmore.onTopLoaded();
        this.getting_list = false;
      });
    },
    getBuybackOrderList(order_status,reset,cb) {//获取回购订单列表
      if(reset){
         this.page = 1; 
      }

      let data = {
        status:"",
        type: 2,//1.利息回购 2.商品回购
        pageId: this.page, //{number} 当前页，page为空返回全部列表
        pageSize: this.page_size, //{number} 每页显示条数
      };
      
      this.getting_list = true;

      if (order_status != "-1") {//-1表示全部
        data.status = order_status;
      }
      utils.API.buyback_list({
        data:{
          token: this.mall_token,
          reqBody:data,
        }
      })
      .then(res => {
         let _data = res&&res.model&&res.model.items||[];

        if(this.page == 1){
          this.order_list = _data;
          if(this.page < res.model.pageSum){
            this.page += 1;
            this.tip = "";
          }else{
            this.tip = "-没有更多啦-";
            // this.tip = "-点击加载更多-";
          }
        }else if(this.page < res.model.pageSum){//证明不是最末页
          this.order_list = [].concat(this.order_list,_data);
          this.tip = "";
          this.page += 1;
        }else{
          this.order_list = [].concat(this.order_list,_data);
          this.tip = "-没有更多啦-";
        }

        this.$refs.loadmore&&this.$refs.loadmore.onTopLoaded();
        this.getting_list = false;
        cb&&cb();
      })
      .catch((ret)=> {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        this.$refs.loadmore&&this.$refs.loadmore.onTopLoaded();
        this.getting_list = false;
      });
    },
    getDepositDeliveryOrderList(order_status,reset,cb) {//存储提货订单列表
      if(reset){
         this.page = 1; 
      }

      let data = {
        status:"",
        type: 2,//1.利息回购 2.商品回购
        pageId: this.page, //{number} 当前页，page为空返回全部列表
        pageSize: this.page_size, //{number} 每页显示条数
      };
      
      this.getting_list = true;

      if (order_status != "-1") {//-1表示全部
        data.status = order_status;
      }

      utils.API.delivery_list({
         data:{
          token: this.mall_token,
          reqBody:data,
        }
      })
      .then(res => {

        let _data = res&&res.model&&res.model.items||[];

        if(this.page == 1){
          this.order_list = _data;
          if(this.page < res.model.pageSum){
            this.page += 1;
            this.tip = "";
          }else{
            this.tip = "-没有更多啦-";
            // this.tip = "-点击加载更多-";
          }
        }else if(this.page < res.model.pageSum){//证明不是最末页
          this.order_list = [].concat(this.order_list,_data);
          this.tip = "";
          this.page += 1;
        }else{
          this.order_list = [].concat(this.order_list,_data);
          this.tip = "-没有更多啦-";
        }

        this.$refs.loadmore&&this.$refs.loadmore.onTopLoaded();
        this.getting_list = false;
        cb&&cb();
      })
      .catch((ret)=> {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        this.$refs.loadmore&&this.$refs.loadmore.onTopLoaded();
        this.getting_list = false;
      });
    },
/********************************获取订单列表/********************************/


/********************************按钮操作********************************/
  /**********即使提货、存储操作**********/
    // confirmOrder: function(order_id, index) {//即使提货：确认收货(ecjia)
    //   var _this = this;
    //   utils.API.order_affirmReceived({
    //     //确认订单
    //     data: {
    //       token:this.mall_token,
    //       order_id: order_id
    //     }
    //   })
    //   .then(function(ret) {
    //     // console.log(ret);
    //     // location.href = ret.model.data.payment.pay_online;
    //     _this.getOrderDetail(order_id, function(detail) {
    //       if(_this.current_order_status == "all"){
    //         _this.order_list[index] = _.assign(_this.order_list[index], detail);
    //       }else{
    //         _this.order_list.splice(index,1);
    //       }
    //       Toast("收货成功！");
    //     });
    //     _this.initOrderCount();
    //   })
    //   .catch(function(ret) {
    //     !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    //   });
    // },
    // cancelOrder: function(order_id,index) {//即时提货、存储：取消订单(ecjia)
    //   MessageBox({
    //     title: "",
    //     message: "确定取消此订单吗？",
    //     showCancelButton: true
    //   }).then(action => {
    //     if (action === "confirm") {
    //       utils.API.order_cancel({
    //         //取消订单
    //         data: {
    //           token: this.mall_token,
    //           order_id: order_id
    //         }
    //       })
    //       .then(ret => {
    //         // var index = _.findIndex(this.order_list, {order_id: order_id});
    //         // if(index == -1){
    //         //   return;
    //         // }
    //         this.getOrderDetail(order_id, detail => {
    //           Toast("取消订单成功！");

    //           if(this.current_order_status == "all"){
    //             this.order_list[index] = _.assign(
    //               this.order_list[index],
    //               detail
    //             );
    //           }else{
    //             this.order_list.splice(index,1);
    //           }
    //         });
    //         this.initOrderCount();
    //       })
    //       .catch(function(ret) {
    //         !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    //       });
    //     }
    //   });
    // },
    // payOrder: function(order_id, index) {//即时提货、存储：去支付(ecjia)
    //   this.$router.push({ path: `/order/${order_id}/paymenttype` });
    // },
  /**********即使提货、存储操作**********/
    
  /**********存储提货操作**********/
    // cancelDepositDelivery:function(order_id,index){//存储提货：取消存储提货
    //   var me = this;

    //   MessageBox({
    //     title: "",
    //     message: "确定取消提货吗？",
    //     showCancelButton: true
    //   }).then(action => {
    //     if (action === "confirm") {
    //       utils.API.delivery_cancel({
    //         //取消订单
    //         data: {
    //           token: me.mall_token,
    //           "reqBody":{
    //             id: order_id
    //           },
    //         }
    //       })
    //       .then(ret => {
    //         this.getDepositDeliveryOrderDetail(order_id, detail => {
    //           Toast("取消提货成功！");
    //           let index = _.findIndex(this.order_list, {id: order_id});
    //           if(index != -1){
    //             this.order_list.splice(index,1);
    //           }
    //           // this.order_list[index] = _.assign(
    //           //   this.order_list[index],
    //           //   detail
    //           // );
    //         });
    //         this.initOrderCount();
    //       })
    //       .catch(function(ret) {
    //         !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    //       });
    //     }
    //   });
    // },
    // payDepositDelivery:function(order,index){//存储提货：存储提货付款
    //   var me = this;

    //   if(order.expressFee <= 0){
    //     utils.API.fund_pay({
    //       data: {
    //         "token": me.mall_token,
    //         "reqBody":{
    //           id:order.id,
    //           channel:"alipay",
    //         },
    //       }
    //     })
    //     .then(function(ret) {
    //       me.getDepositDeliveryOrderDetail(order.id,function(detail){
    //         Toast("提货申请成功，请耐心等待发货！");
    //         let index = _.findIndex(me.order_list, {id: order.id});
    //         if(index != -1){
    //           me.order_list.splice(index,1);
    //         }
    //         // me.order_list[index] = _.assign(
    //         //   me.order_list[index],
    //         //   detail
    //         // );
    //       });
    //       me.initOrderCount();
    //     })
    //     .catch(function(ret) {
    //       !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    //     });
    //   }else{
    //     this.$router.push({ path: `/my/todo/paymenttype/${order.id}`});
    //   }
    // },
    // confirmDepositDelivery:function(order_id,index){//存储提货：存储提货确认收货
    //   var _this = this;

    //   utils.API.delivery_confirm({
    //     data: {
    //       token: _this.mall_token,
    //       "reqBody":{
    //         id: order_id
    //       },
    //     }
    //   })
    //   .then(ret => {
    //     this.getDepositDeliveryOrderDetail(order_id, detail => {
    //       Toast("确认收货成功！");
    //       let index = _.findIndex(this.order_list, {id: order_id});
    //       if(index != -1){
    //         this.order_list.splice(index,1);
    //       }
          
    //       // this.order_list[index] = _.assign(
    //       //   this.order_list[index],
    //       //   detail
    //       // );
    //     });
    //     this.initOrderCount();
    //   })
    //   .catch(function(ret) {
    //     !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    //   });
    // },
  /**********存储提货操作**********/

  /**********回购操作**********/
    // cancelBuyback:function(order_id,index){//回购：取消回购
    //   var me = this,
    //       data = {
    //         id:order_id,
    //       };
    //   MessageBox({
    //     title: "",
    //     message: "确认取消回购吗？",
    //     showCancelButton: true
    //   }).then(action => {
    //     if (action === "confirm") {
    //       utils.API.buyback_cancel({
    //         data: {
    //           token: me.mall_token,
    //           "reqBody":data,
    //         }
    //       })
    //       .then(function(ret) {
    //         me.getBuybackOrderDetail(order_id,function(detail){
    //           Toast("取消回购成功！");
    //           let index = _.findIndex(me.order_list, {id: order_id});
    //           if(index != -1){
    //             me.order_list.splice(index,1);
    //           }
    //           // me.order_list[index] = _.assign(
    //           //   me.order_list[index],
    //           //   detail
    //           // );
    //         });
    //         me.initOrderCount();
    //       })
    //       .catch(function(ret) {
    //         !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    //       });
    //     }
    //   });
    // },
    // confirmBuyback:function(order_id,index){//回购：确认回购
    //   var me = this,
    //       data = {
    //         id:order_id,
    //       };
    //   MessageBox({
    //     title: "",
    //     message: "确认回购吗？",
    //     showCancelButton: true
    //   }).then(action => {
    //     if (action === "confirm") {
    //       utils.API.buyback_confirm({
    //         data: {
    //           token: me.mall_token,
    //           "reqBody":data,
    //         }
    //       })
    //       .then(function(ret) {
    //         me.getBuybackOrderDetail(order_id,function(detail){
    //           Toast("确认回购成功！");
    //           let index = _.findIndex(me.order_list, {id: order_id});
    //           if(index != -1){
    //             me.order_list.splice(index,1);
    //           }
    //           // me.order_list[index] = _.assign(
    //           //   me.order_list[index],
    //           //   detail
    //           // );
    //         });
    //         me.initOrderCount();
    //         // me.$router.replace({ path:`/my/todo/payresult`});
    //       })
    //       .catch(function(ret) {
    //         !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    //       });
    //     }
    //   });
    // },
  /**********回购操作**********/
/********************************按钮操作********************************/


/********************************再次购买********************************/
  // getCart(cb) {
  //   var _this = this;
    
  //   utils.API.cart_list({
  //     data: {
  //       token: _this.mall_token,
  //       seller_id: _this.seller_id,
  //       location: _this.location
  //     }
  //   })
  //   .then(function(ret) {
  //     // _this.cart = ret.model.data.cart_list[0]||{};
  //     cb&&cb(ret.model.data.cart_list[0]||{});
  //   })
  //   .catch(function(ret) {
  //     !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
  //   });
  // },

  // goodsInCart:function(goods_id,cart){
  //   if(!cart || !_.isArray(cart.goods_list)){
  //     return {};
  //   }
  //   var goods_in_cart = cart.goods_list.filter(function(goods) {
  //         return goods.goods_id == goods_id;
  //       })[0]||{};

  //   return goods_in_cart;
  // },

  // cartUpdate:function(rec_id,number){//更新商品到购物车
  //   var me = this;

  //   return new Promise(function(resolve, reject) {
  //     utils.API.cart_update({
  //       data: {
  //         token: me.mall_token,
  //         rec_id: rec_id,
  //         new_number: number,
  //         location: me.location
  //       }
  //     })
  //     .then(function(ret) {
  //       resolve(ret);
  //     })
  //     .catch(function(ret) {
  //       reject(ret);
  //       // !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
  //     });
  //   })
  // },
  // cartCreate: function(goods){//添加商品到购物车
  //   var _this = this;

  //   return new Promise(function(resolve, reject) {
  //     utils.API.cart_create({
  //       data: {
  //         token: _this.mall_token,
  //         goods_id: goods.goods_id,
  //         number: goods.goods_number,
  //         location: _this.location
  //       }
  //     })
  //     .then(function(ret) {
  //       resolve(ret);
  //     })
  //     .catch(function(ret) {
  //       reject(ret);
  //       // !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
  //     });
  //   })
  // },

  // purchaseAgain:function(order){//再次购买
  //   var me = this;

  //   this.getCart(function(cart){
  //     var funs = [];
  //     // console.log(order.goods_list);
  //     order.goods_list.forEach(function(goods){
        
  //       var goodsInCart = me.goodsInCart(goods.goods_id,cart);
  //       if(!_.isEmpty(goodsInCart)){
  //         funs.push(me.cartUpdate(goodsInCart.rec_id,goodsInCart.goods_number+goods.goods_number));
  //       }else{
  //         funs.push(me.cartCreate(goods));
  //       }
  //     })

  //     Promise.all(funs)
  //     .then(function (res) {
  //       Toast("添加成功，请前往购物车查看！");
  //       me.$router.push({ path: `/order/cart` });
  //     })
  //     .catch(function(ret) {
  //       !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
  //     });
  //   })
  // },
/********************************再次购买********************************/


/********************************获取订单详情********************************/
  // getOrderDetail: function(order_id, cb) {//获取ecjia订单详情
  //   var _this = this;
  //   utils.API.order_detail({
  //     //订单详情
  //     data: {
  //       token: _this.mall_token,
  //       order_id: order_id
  //     }
  //   })
  //     .then(function(ret) {
  //       cb && cb(ret.model.data);
  //     })
  //     .catch(function(ret) {
  //       !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
  //     });
  // },
  // getDepositOrderDetail:function(order_id,cb){//获取存储订单详情
  //   var _this = this;
  //   utils.API.deposit_detail({
  //     //订单详情
  //     data: {
  //       token: _this.mall_token,
  //       "reqBody":{
  //         id: order_id
  //       },
  //     }
  //   })
  //   .then(function(ret) {
  //     cb && cb(ret.model);
  //   })
  //   .catch(function(ret) {
  //     !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
  //   });
  // },
  // getDepositDeliveryOrderDetail:function(order_id,cb){//获取存储提货订单详情
  //   var _this = this;
  //   utils.API.delivery_detail({
  //     //订单详情
  //     data: {
  //       token: _this.mall_token,
  //       "reqBody":{
  //         id: order_id
  //       },
  //     }
  //   })
  //   .then(function(ret) {
  //     cb && cb(ret.model);
  //   })
  //   .catch(function(ret) {
  //     !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
  //   });
  // },
  // getBuybackOrderDetail:function(order_id,cb){//获取回购订单详情
  //   var _this = this;
  //   utils.API.buyback_detail({
  //     //订单详情
  //     data: {
  //       token: _this.mall_token,
  //       "reqBody":{
  //         id: order_id
  //       },
  //     }
  //   })
  //   .then(function(ret) {
  //     cb && cb(ret.model);
  //   })
  //   .catch(function(ret) {
  //     !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
  //   });
  // },
/********************************获取订单详情********************************/

/********************************获取各种订单状态个数********************************/
  // getOrderstatusNumber:function(cb){//获取后台订单状态个数
  //   var _this = this;
  //   utils.API.orderstatus_number({
  //     //订单详情
  //     data: {
  //       token: _this.mall_token,
  //       "reqBody":{
  //       },
  //     }
  //   })
  //   .then(function(ret) {
  //     // console.log(ret.model);
  //     _.forEach(_this.order_status_count,function(val,key){
  //       let data_obj;
  //       switch(key){
  //         case "2":
  //           data_obj = ret.model.deposit;//存储 2
  //           break;
  //         case "3":
  //           data_obj = ret.model.buyback;//回购 3
  //           break;
  //         case "4":
  //           data_obj = ret.model.delivery;//存储提货 4
  //           break;
  //       }

  //       _.forEach(_this.order_status_count[key],function(v,k){
  //         if(k != "all_count"){
  //           let res = _.find(data_obj,function(o){return o.status == k});
  //           if(res){
  //             _this.order_status_count[key][k].count += res.count;
  //             _this.order_status_count[key].all_count += res.count;
  //           }
  //         }
  //       });
  //     });

  //     cb&&cb();
  //   })
  //   .catch(function(ret) {
  //     !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
  //   });
  // },
  // getOrderCount:function(cb){//获取ecjia订单状态个数
  //   var _this = this;
  //   utils.API.order_count({
  //     //订单详情
  //     data: {
  //       token: _this.mall_token,
  //     }
  //   })
  //   .then(function(ret) {
  //     // console.log(ret.model);

  //     _.forEach(_this.order_status_count,function(val,key){
  //       let data_obj;
  //       switch(key){
  //         case "1":
  //           data_obj = ret.model.data.desposit;//提货 1
  //           break;
  //         case "2":
  //           data_obj = ret.model.data.storage;//存储 2
  //           break;
  //       }

  //       _.forEach(_this.order_status_count[key],function(v,k){
  //         if(k != "all_count"){
  //           let res = _.find(data_obj,function(o){return o.type == k});
  //           if(res){
  //             _this.order_status_count[key][k].count += res.count;
  //             _this.order_status_count[key].all_count += res.count;
  //           }
  //         }
  //       });
  //     });

  //     cb && cb();
  //   })
  //   .catch(function(ret) {
  //     !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
  //   });
  // },
/********************************获取各种订单状态个数********************************/
    

    
    // selectWillDo:function(value,order_id,cb){//设置到期后自动转为什么
    //   var me = this,
    //       data = {
    //         id:order_id,
    //         willDo:value,
    //       };
      
    //   utils.API.deposit_update({
    //     data: {
    //       token: me.mall_token,
    //       "reqBody":data,
    //     }
    //   })
    //   .then(function(ret) {

    //     me.getDepositOrderDetail(order_id,function(detail){
    //       Toast("设置成功！");
    //       let index = _.findIndex(me.order_list, {order_id: order_id});
    //       if(index == -1){
    //         return;
    //       }
    //       me.order_list[index] = _.assign(
    //         me.order_list[index],
    //         detail
    //       );
    //     });
    //   })
    //   .catch(function(ret) {
    //     !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    //   });
    // },

    // getMore:function() {
    //   this.handleGetOrderList(this.current_order_type,this.current_order_status);
    // },
    goBack:function(){
      this.$router.goBack('/my')
    },
    redirect: function(path) {
      path ? this.$router.push({ path: path }) : this.$router.goBack();
    },
    
  }
};
</script>

<style lang="less" scoped>
@import "./OrdersList.less";
</style>