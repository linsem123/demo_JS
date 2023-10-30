<template>
  <div>
    <!-- 头部 -->
    <top-head>
      <div slot="left">
        <span v-if="macross" class="head-left-icon" @click.stop="redirect('/activity/cjsj',`click_cart_cjsj`)">黄金理财</span>
        <span v-else class="head-left-icon padding-left" @click.stop="redirect('/activity/cjsj',`click_cart_cjsj`)">存黄金送现金</span>
      </div>
      <div slot="main">购物车</div>
      <div slot="right">
        <span v-if="cart&&cart.goods_list&&selected_goods.length>0" class="head-right-icon iconfont icon-iconzhengli" @click="removeGoodsFromCart()"></span>
      </div>
    </top-head>
    <!-- 头部 -->


    <div class="mall-my-confirm-cart" :class="cart&&cart.goods_list?'':(macross?'':'white')">
      <div class="top-blank"></div>
      
      <mt-loadmore style="min-height:calc(100vh - 1.7rem);" :top-method="loadTop" ref="loadmore">
        <div v-if="is_loading" class="loading-box">
          <span class="loading-img"></span>
        </div>
        
        <div v-else>
          <template v-if="cart&&cart.goods_list">
            
            <div class="goods-info-wrap">

              <mt-cell-swipe
                class="cart-cell-swipe"
                :right="[
                  {
                    content: '删除',
                    style: { background: 'red', color: '#fff' },
                    handler: (event) => {removeGoodsFromCart(goods.rec_id);}
                  }
                ]"  v-for="(goods, index) in goods_list">

              <!-- 商品信息 -->
              <div class="goods-info" >
                
                <div class="goods-info-inner">
                  <div class="goods-info-select" @click="switchCheckStatus(goods)">
                    <span class="select-core" :class="goods.is_checked?'checked':''"></span>
                  </div>
                  <div class="goods-info-body clearfix">
                    <div class="goods-info-img-wrap" @click.stop="redirect(`/goods/${goods.goods_id}`)">
                      <img class="goods-info-img" :src="goods.img.small">
                    </div>
                    <div class="goods-info-body-right">
                      <h4 class="goods-info-title" @click.stop="redirect(`/goods/${goods.goods_id}`)">
                        <!-- <span class="category metal" v-if="isStorage(goods.properties)">金条</span>
                        <span class="category accessory" v-else >饰品</span> -->
                        <span>{{goods.goods_name}}</span>
                      </h4>
                      
                      <div class="conditions">
                        <!-- <span class="goods-info-limit" v-if="goods.is_xiangou == 0">不限购</span>
                        <span class="goods-info-limit" v-else>限购{{goods.xiangou_num}}件</span> -->

                        <span class="goods-info-limit" v-if="goods.is_xiangou != 0">限购{{goods.xiangou_num}}件</span>
                      </div>

                      <div class="goods-info-price-wrap">
                        <span class="goods-info-price">{{goods.formated_goods_price}}</span>
                        <div class="goods-info-amount-number-wrap">
                          <span class="subtract-btn iconfont icon-subtract-btn" @click="switchAmount(goods,false)"></span>
                          <input class="goods-info-amount-number" type="number" name="" readonly="readonly" v-model="goods.goods_number"/>
                          <span class="add-btn iconfont icon-add-btnfill" @click="switchAmount(goods,true)"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="error" v-if="goods.disabled_label!=''">{{goods.disabled_label}}</div>
                <div class="error" v-else-if="goods.is_xiangou>0&&(goods.goods_number>goods.xiangou_num)">您输入的数量超过了宝贝的限购数~</div>
              </div>
              <!-- 商品信息 -->

              </mt-cell-swipe>

            </div>

            <div class="zhanwei"></div>

          </template>
          
          <template v-else>
            <div class="wrapper">
              <div class="cart-nothing"></div>
              <p class="nothing-text first">购物车是空的哎</p>
              <p class="nothing-text">想买啥？别客气随便逛！</p>
            </div>
            <template v-if="macross">
              <div class="page-break"></div>
              <div class="recommend-wrap">
                <ul class="recommend-nav">
                  <li class="recommend-nav-cell" :class="nav.active?'active':''" v-for="(nav,index) in recommend_nav" @click="switchRecommendNav(nav,index,`click_cart_tab_${index+1}_goodslist`)">{{nav.name}}</li>
                </ul>
                <!-- 存储推荐 -->
                <ul class="recommend-list" v-show="active_recommend_nav.name=='黄金理财'">
                  <li class="recommend-list-cell" v-for="(item,index) in recommend_storage_list">
                    <div class="img-wrap result-cell-img-wrap">
                      <img :ref="`storage_img_wrap_${index}`" class="img" @click.stop="redirect(`/activity/cjsj`,'click_cart_tab_1_goodslist',{goods_id:item.id,index:(index+1),category:'黄金理财'})" v-lazy="{src: item.img.thumb, loading:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwcHgiICBoZWlnaHQ9IjIwMHB4IiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIGNsYXNzPSJsZHMtZWNsaXBzZSIgc3R5bGU9ImJhY2tncm91bmQ6IG5vbmU7Ij48cGF0aCBuZy1hdHRyLWQ9Int7Y29uZmlnLnBhdGhDbWR9fSIgbmctYXR0ci1maWxsPSJ7e2NvbmZpZy5jb2xvcn19IiBzdHJva2U9Im5vbmUiIGQ9Ik0zMCA1MEEyMCAyMCAwIDAgMCA3MCA1MEEyMCAyMiAwIDAgMSAzMCA1MCIgZmlsbD0iI2ZmYjYwNiIgdHJhbnNmb3JtPSJyb3RhdGUoMTI0LjU2OSA1MCA1MSkiPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBjYWxjTW9kZT0ibGluZWFyIiB2YWx1ZXM9IjAgNTAgNTE7MzYwIDUwIDUxIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGVUcmFuc2Zvcm0+PC9wYXRoPjwvc3ZnPg=='}">
                    </div>
                    <div class="info-wrap">
                      <h4 class="info-title" @click.stop="redirect(`/activity/cjsj`,'click_cart_tab_1_goodslist',{goods_id:item.id,index:(index+1),category:'黄金理财'})">{{item.name}}</h4>
                      <div class="info-price">
                        <span>{{formatedMinPrice(item)}}</span>
                        <!-- <p class="gouwuche" @click.stop="addToCart($event,`storage_img_wrap_${index}`,item.id,index,item.img.thumb,'click_buygold_cart')">
                          <span class="iconfont icon-gouwuche"></span>
                        </p> -->
                      </div>
                    </div>
                  </li>
                </ul>
                <!-- 存储推荐 -->

                <!-- 提货推荐 -->
                <ul class="recommend-list" v-show="active_recommend_nav.name=='实物金条'">
                  <li class="recommend-list-cell" v-for="(item,index) in recommend_buyable_list">
                    <div class="img-wrap result-cell-img-wrap">
                      <!-- <img v-show="active_recommend_nav.name=='黄金理财'" class="img" :src="item.img.thumb"> -->
                      <!-- <img v-show="active_recommend_nav.name=='实物金条'" class="img" v-lazy="{src: item.img.thumb, loading:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwcHgiICBoZWlnaHQ9IjIwMHB4IiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIGNsYXNzPSJsZHMtZWNsaXBzZSIgc3R5bGU9ImJhY2tncm91bmQ6IG5vbmU7Ij48cGF0aCBuZy1hdHRyLWQ9Int7Y29uZmlnLnBhdGhDbWR9fSIgbmctYXR0ci1maWxsPSJ7e2NvbmZpZy5jb2xvcn19IiBzdHJva2U9Im5vbmUiIGQ9Ik0zMCA1MEEyMCAyMCAwIDAgMCA3MCA1MEEyMCAyMiAwIDAgMSAzMCA1MCIgZmlsbD0iI2ZmYjYwNiIgdHJhbnNmb3JtPSJyb3RhdGUoMTI0LjU2OSA1MCA1MSkiPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBjYWxjTW9kZT0ibGluZWFyIiB2YWx1ZXM9IjAgNTAgNTE7MzYwIDUwIDUxIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGVUcmFuc2Zvcm0+PC9wYXRoPjwvc3ZnPg=='}"> -->
                      <img class="img" :ref="`buyable_img_wrap_${index}`" @click.stop="redirect(`/goods/${item.id}`,'click_cart_tab_2_goodslist',{goods_id:item.id,index:(index+1),category:'实物金条'})" v-lazy="{src: item.img.thumb, loading:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwcHgiICBoZWlnaHQ9IjIwMHB4IiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIGNsYXNzPSJsZHMtZWNsaXBzZSIgc3R5bGU9ImJhY2tncm91bmQ6IG5vbmU7Ij48cGF0aCBuZy1hdHRyLWQ9Int7Y29uZmlnLnBhdGhDbWR9fSIgbmctYXR0ci1maWxsPSJ7e2NvbmZpZy5jb2xvcn19IiBzdHJva2U9Im5vbmUiIGQ9Ik0zMCA1MEEyMCAyMCAwIDAgMCA3MCA1MEEyMCAyMiAwIDAgMSAzMCA1MCIgZmlsbD0iI2ZmYjYwNiIgdHJhbnNmb3JtPSJyb3RhdGUoMTI0LjU2OSA1MCA1MSkiPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBjYWxjTW9kZT0ibGluZWFyIiB2YWx1ZXM9IjAgNTAgNTE7MzYwIDUwIDUxIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGVUcmFuc2Zvcm0+PC9wYXRoPjwvc3ZnPg=='}">
                    </div>
                    <div class="info-wrap">
                      <h4 class="info-title" @click.stop="redirect(`/goods/${item.id}`,'click_cart_tab_2_goodslist',{goods_id:item.id,index:(index+1),category:'实物金条'})">{{item.name}}</h4>
                      <div class="info-price">
                        <span>{{formatedMinPrice(item)}}</span>
                        <p class="gouwuche" @click.stop="addToCart($event,`buyable_img_wrap_${index}`,item.id,index,item.img.thumb,'click_buygold_cart')">
                          <span class="iconfont icon-gouwuche"></span>
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
                <!-- 提货推荐 -->
              </div>
            </template>
          </template>
        </div>
      </mt-loadmore>
  	</div>
    

    <div v-if="cart&&cart.goods_list" class="checkstand-wrapper" :class="isGtIphonex?'fix-gt-phonex':''">
      <p class="select-all">
        <span class="select-core" :class="select_all?'checked':''" @click="switchCheckStatus('all')"></span>
        <span class="select-all-text">全选</span>
      </p>
      <p class="total">(不含运费)合计:<span class="total-price">{{cart.total?cart.total.goods_price:0}}</span></p>
    </div>

    <div v-if="cart&&cart.goods_list" class="confirm-wrap" :class="isGtIphonex?'fix-gt-phonex':''">
      <a class="confirm-btn storage" :class="(cart.disabled_label!=''||selected_goods.length<=0)?'disable':''" @click="genStorage"><span v-if="macross">买理财</span><span v-else>存黄金</span></a>
      <a class="confirm-btn withdraw" :class="(cart.disabled_label!=''||selected_goods.length<=0)?'disable':''" @click="genWithdraw">立即购买</a>
    </div>
    <div class="btn-wrap" v-else>
      <a class="bottom-btn" href="javascript:;" @click="redirect('/goods')">去选购</a>
    </div>



  </div>
</template>

<script>
import topHead from "@/views/components/TopHead.vue";
import constants from "@/assets/js/constants.js";

import { Toast, MessageBox, CellSwipe, Loadmore } from "mint-ui";

// utils.extendApi(API);//把API扩充到utils方法里边

export default {
  components: {
    topHead: topHead,
    mtCellSwipe:CellSwipe,
    mtLoadmore:Loadmore,
  },
  data() {
    return {
      mall_token:"",
      count: 1,
      temp_cart:{},
      cart:{
        goods_list:undefined,
      },
      goods_list:[],
      payment_list: [],
      address_list:[],
      select_all:false,
      selected_goods:[],
      top_head_height:0,

      recommend_nav:[{
        name:"黄金理财",
        active:true,
      },{
        name:"实物金条",
        active:false,
      },],
      recommend_storage_list:[],
      recommend_buyable_list:[],

      is_loading:false,

      show_recommend:false,
    };
  },
  computed: {
    isGtIphonex(){
      return utils.isGtIphonex()
    },
    seller_id() {
      return this.$store.getters.getSellerId;
    },
    total_price() {
      var shop_price = Number(this.goods.unformatted_shop_price);
      return this.count * shop_price;
    },
    location() {
      return this.$store.getters.getLocation;
    },
    select_address() {
      //当前选择的address
      return this.$store.getters.getMallCurrentSelectAddress || {};
    },
    macross() {
      return this.$store.getters.getMacross;
    },
    greater_than_limit(){
      var me = this,
          res = {
            gt:false,
            position:[],
          };

      this.goods_list.forEach(function(item,index){
        if(item.is_checked == 1){
          if(item.is_xiangou>0 && item.goods_number > item.xiangou_num){
            res.gt = true;
            res.position.push(document.querySelectorAll(".goods-info")[index].offsetTop);
          }
        }
      });

      return res;
    },
    
    not_storage_incart(){
      var me = this,
          result = {
            in_cart:false,
            position:[],
          };

      this.goods_list.forEach(function(item,index){
        if(item.is_checked == 1){
          if(_.isArray(item.properties)){
            var res = _.find(item.properties, function(o) { return o.name == "存储类别"; });
            if(res == undefined){//不可存储
              result.in_cart = true;
              result.position.push(document.querySelectorAll(".goods-info")[index].offsetTop);
            }
          }
        }
      });

      return result;
    },
    resume_stamp() {
      return this.$store.getters.getResumeStamp;
    },
    active_recommend_nav(){
      var res = {};
      this.recommend_nav.forEach(function(item){
        if(item.active){
          res = item;
        }
      });
      return res;
    },
  },
  mounted() {
    // this.init();
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.init();
      utils.trackEvent("exposure_cart");
      // access to component instance via `vm`
    })
  },
  watch:{
    resume_stamp:function(nval,oval){//app  reume
      utils.trackEvent("exposure_cart");
    },
    "cart.goods_list":function(nval,oval){
      if(_.isEmpty(nval)){
        this.show_recommend = true;
        if(!this.recommend_storage_list.length && !this.recommend_buyable_list.length){
          this.getRecommend();
        }
      }else{
        this.show_recommend = false;
      }
    },
  },
  methods: {
    init: function() {
      var me = this;
      this.mall_token = utils.storageGet("mall_token");
      // this.switchRecommendNav(this.recommend_nav[0]);
      this.top_head_height = document.querySelector(".top-head").offsetHeight;
      this.getCart({need_reset:true});

      if(this.cart.goods_list == null){
        this.is_loading = true;
      }
    },
    isStorage(properties){
      var is_storage = false;

      if(_.isArray(properties)){
        var res = _.find(properties, function(o) { return o.name == "存储类别"; });
        if(res != undefined){
          is_storage = true;
        }else{
          is_storage = false;
        }
      }else{
        is_storage = false;
      }

      return is_storage;
    },


    formatedMinPrice(goods){
      var price = "",
          promote_price = Number(goods.unformatted_promote_price)||"",
          shop_price = Number(goods.unformatted_shop_price)||"";

      if(promote_price != 0){
        price = goods.promote_price;
      }else{
        price = goods.shop_price;
      }

      return price;
    },
    switchRecommendNav:function(nav){
      this.active_recommend_nav.active = false;
      // setTimeout(()=>{
        nav.active = true;
      // },10)
    },

    getRecommend:function(){
      this.getRecommendList('storage',(list)=>{
        this.recommend_storage_list = list;
      });
      this.getRecommendList('buyable',(list)=>{
        this.recommend_buyable_list = list;
      });
    },
    getRecommendList:function(recommend_type,cb){
      var me = this;

      utils.API.goldbag_recommend_list({
        data: {
          "token":me.mall_token,
          "seller_id":me.seller_id,
          "recommend_type" : recommend_type,
          "pagination" : {
              "count" : 100,
              "page" : 1
          },
        }
      })
      .then(function(ret) {
        cb&&cb(ret.model.data);
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    getSelectGoodsRecId:function(){
      var rec_id = [];

      this.selected_goods.forEach(function(item){
        rec_id.push(item.rec_id);
      });

      return rec_id.join(',');
    },
    removeGoodsFromCart: function(rec_id) {
      var _this = this;
      // if(this.selected_goods.length <= 0){
      //   Toast("请选择商品！");
      //   return;
      // }

      MessageBox({
        title: "",
        message: rec_id?"确定删除此商品吗？":"确定删除选择的商品吗？",
        showCancelButton: true
      }).then(function(action) {
        if (action === "confirm") {
          utils.API.cart_delete({
            data: {
              token: _this.mall_token,
              rec_id: rec_id||_this.getSelectGoodsRecId(),
              location: _this.location,
            }
          })
          .then(function(ret) {
            _this.getCart({need_reset:true});
          })
          .catch(function(ret) {
            !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
          });
        }
      });
    },
    getCart: function(option,cb) {
      var me = this;
      utils.API.cart_list({
        data: {
          token: me.mall_token,
          seller_id: me.seller_id,
          location: me.location
        }
      })
        .then(function(ret) {
          if(option.need_reset){
            me.restCart(ret);
          }
          me.is_loading = false;
          cb&&cb(ret.model);
        })
        .catch(function(ret) {
          !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
          me.is_loading = false;
        });
    },

    restCart:function(ret){//重置购物车
      this.cart = ret.model.data.cart_list&&ret.model.data.cart_list[0]||{goods_list:null,};
      this.goods_list = this.cart&&this.cart.goods_list||[];
      this.resetSelectAll();
    },

    resetSelectAll:function(){//重置select
      var me = this,
          len = this.goods_list.length,
          conunt = 0;

      this.selected_goods = [];

      this.goods_list.forEach(function(item){
        if(item.is_checked == 1){
          conunt += 1;
          me.selected_goods.push(item);
        }
      });

      if(conunt >= len){
        this.select_all = true;
      }else{
        this.select_all = false;
      }
    },
    switchCheckStatus:function(goods,checked){//改变选中状态
      var _this = this,
          rec_id_arr = [],
          rec_id = goods.rec_id,
          is_checked = goods.is_checked==1?0:1;

      if(goods == "all"){//表示全部改变
        
        this.goods_list.forEach(function(item){
          rec_id_arr.push(item.rec_id);
        });

        rec_id = rec_id_arr.join(",");
        is_checked = !this.select_all;
      }

      if(checked != undefined){
        is_checked = checked;
      }

      utils.API.cart_checked({
        data: {
          token: _this.mall_token,
          "rec_id" :rec_id,  // 1250,1251（批量）
          "is_checked" : is_checked,
          "location": _this.location,
        }
      })
      .then(function(ret) {
        _this.restCart(ret);
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    switchAmount:function(goods,add){//加减数量
      if(add){
        if(goods.is_xiangou > 0 && goods.goods_number+1 > goods.xiangou_num){//查看限购
          Toast("超出每人限购数量！");
          return;
        }else{
          goods.goods_number += 1;
        }
      }else{
        if(goods.goods_number-1 < 1){
          return;
        }else{
          goods.goods_number += -1;
        }
      }
      this.cartUpdate(goods);
    },

    cartUpdate:_.debounce(function(goods){//产品增加数量
      var _this = this;

      utils.API.cart_update({
        data: {
          token: _this.mall_token,
          "rec_id" : goods.rec_id,  // 1250,1251（批量）
          "new_number": goods.goods_number,    //新数量
          "location": _this.location,
        }
      })
      .then(function(ret) {
        _this.restCart(ret);
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },800),

    genStorage:function(){
      if(this.cart.disabled_label!=''){
        // Toast("商品无法购买！")
        return;
      }

      if(this.selected_goods.length <= 0){
        // Toast("购物车无选中商品！")
        return;
      }

      var gtl = this.greater_than_limit;
      if(gtl.gt){
        Toast("您输入的数量超过了宝贝的限购数~");
        if(gtl.position.length){
          document.querySelector(".mall-my-confirm-cart").scrollTop = gtl.position[0]-this.top_head_height-10;
        }
        return;
      }

      var nsi = this.not_storage_incart;
      if(nsi.in_cart){
        Toast("只有投资金条才可存储哦");
        if(nsi.position.length){
          document.querySelector(".mall-my-confirm-cart").scrollTop = nsi.position[0]-this.top_head_height-10;
        }
        return;
      }

      this.$router.push({ path:"/order/generate/storage"});
    }.after(function(){
      utils.trackEvent('click_cart_storageButton');
    }),

    genWithdraw:function(){//提货

      if(this.cart.disabled_label!=''){
        // Toast("商品无法购买！")
        return;
      }

      if(this.selected_goods.length <= 0){
        // Toast("购物车无选中商品！")
        return;
      }

      var gtl = this.greater_than_limit;
      if(gtl.gt){
        Toast("您输入的数量超过了宝贝的限购数~");
        if(gtl.position.length){
          document.querySelector(".mall-my-confirm-cart").scrollTop = gtl.position[0]-this.top_head_height-10;
        }
        return;
      }

      this.$router.push({ path:"/order/generate/withdraw"});
    }.after(function(){
      utils.trackEvent('click_cart_deliveryButton');
    }),

    redirect: function(path,event_name,option) {
      path ? this.$router.push({ path: path }) : this.$router.goBack();
    }.after(function(path,event_name,option) {
      if(event_name){
        if(option){
          utils.trackEvent(event_name,option);
        }else{
          utils.trackEvent(event_name);
        }
      }
    }),


    /************加购物车操作************/
    // addToCart:_.debounce(function($event,ref,goods_id,index,img,event_name){
    //   var me = this,
    //       number = 1,
    //       goodsInCart = {};

    //   me.$store.commit("setCartAnimateTrigger",{
    //     img:this.$refs[ref][0]),
    //     stamp:new Date().getTime(),
    //   });

    //   this.getCart({need_reset:false},function(model){
    //     me.temp_cart = model.data.cart_list&&model.data.cart_list[0]||{};

    //     if(!_.isEmpty(me.temp_cart)){
    //       me.temp_cart.goods_list?(goodsInCart = me.temp_cart.goods_list.filter(function(goods) {
    //         return goods.goods_id == goods_id;
    //       })[0]):[];

    //       if (!_.isEmpty(goodsInCart)) {
    //         number = goodsInCart.goods_number + number;

    //         utils.API.cart_update({
    //           //添加商品到购物车
    //           data: {
    //             token: me.mall_token,
    //             rec_id: goodsInCart.rec_id,
    //             new_number: number,
    //             location: me.location
    //           }
    //         })
    //         .then(function(ret) {
    //           utils.Toast("添加成功，请下拉刷新查看！");
    //           // utils.trackEvent("click_buygold_cart_Success");
    //         })
    //         .catch(function(ret) {
    //           !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    //         });
    //       }else{
    //         me.createCart({
    //           goods_id: goods_id,
    //           number: number
    //         },function(){

    //         });
    //       }
    //     }else{
    //       me.createCart({
    //         goods_id: goods_id,
    //         number: number
    //       },function(){

    //       });
    //     }
    //   });

    // },500)

    addToCart:_.debounce(function($event,ref,goods_id,index,img,event_name){
      var me = this,
          number = 1;

      me.$store.commit("setCartAnimateTrigger",{
        img:this.$refs[ref][0],
        stamp:new Date().getTime(),
      });

      utils.API.goldbag_cart_add({
        data: {
          token: me.mall_token,
          goods_id: goods_id,
          number:number,
        }
      })
      .then(function(ret) {
        utils.Toast("添加成功，请下拉刷新查看！");
        // cb&&cb();
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },500)
    .after(function($event,ref,goods_id,index,img,event_name){
      if(event_name){
        // utils.trackEvent(event_name,{
        //   goods_id:goods_id,
        // });
      }
    }),



    // createCart: function(goods,cb) {
    //   var me = this;
    //   utils.API.cart_create({
    //     //添加商品到购物车
    //     data: {
    //       token: me.mall_token,
    //       goods_id: goods.goods_id,
    //       number: goods.number,
    //       location: me.location
    //     }
    //   })
    //     .then(function(ret) {
    //       utils.Toast("添加成功，请下拉刷新查看！");
    //       // utils.trackEvent("click_buygold_cart_Success");
    //       cb&&cb();
    //     })
    //     .catch(function(ret) {
    //       !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    //     });
    // },
    /************加购物车操作************/

    /************下拉加载************/
    loadTop:function(){
      this.getCart({need_reset:true},()=>{
        this.$refs.loadmore&&this.$refs.loadmore.onTopLoaded();
      });
    },
    /************下拉加载************/


    goBack: function() {
      this.$router.goBack();
    }
  }
};
</script>

<style lang="less" scoped>
@import "./Cart.less";
</style>