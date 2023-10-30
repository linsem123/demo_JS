<template>
  <div >
  	<!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
      ref="top_head"
    >
      <div slot="left"></div>
      <div slot="main"><span v-if="macross">黄金理财</span><span v-else>存黄金送现金</span></div>
      <div slot="right">
        <span class="head-icon iconfont icon-kehufuwukefu" @click="redirect('/my/guestservice','click_hjlc_phone')"></span>
        <span v-if="!is_weixin" class="head-icon iconfont icon-fenxiang" @click="showSharePupup"></span>
      </div>
    </top-head>
    <!-- 头部 -->

    <ul v-if="show_fixed_nav" class="goods-list-nav fixed">
      <li class="goods-list-nav-cell" :class="{ active:schema.active,hot:schema.hot }" v-for="(schema,index) in interest_schema" @click="switchSchema(schema,index,`click_homePage_cjsj_classification_${index+1}`)">{{schema.days}}天</li>
    </ul>

    <div class="cjsj-fastbuy-wrap" ref="fastbuy">
  		<div class="top-blank"></div>

      <template v-if="macross">
        <!-- 今日金价 -->
        <div class="today-price-wrap" ref="cjsj_pannel_wrap">
          <h4 class="price-title">
            <span class="price-title-text">今日金价</span>
            <span class="price-title-desc">(含加工费)</span>
          </h4>
          <div class="price-wrap">
            <p class="price-cell">
              <span class="price">{{product_price}}</span>
              <span class="unit">元/克</span>
            </p>
            <p class="price-icon" @click="redirect('/pricetrend','click_hjlc_goldPriceTrend')">
              <span class="iconfont icon-trend"></span>
              <span class="price-icon-text">金价趋势</span>
            </p>
          </div>
        </div>
        <!-- 今日金价 -->

        <!-- 特价金30天 -->
        <div class="panel-wrap">
          <special-product
          :theme="'brown'"
          :refresh="special_refresh"
          ></special-product>
        </div>
        <!-- 特价金30天 -->

      </template>

      <template v-else>
        <div class="head-wrap">
          <div class="ellipse"></div>
          <div class="board">
            <h4 class="board-title">抵御通货还能赚？</h4>
            <h4 class="board-sub-title">存金首选<span>黄金象</span></h4>
            <p>
              <span>尊享隐私安全</span>
              <span>存储百年无忧</span>
            </p>
          </div>
          <div class="back-book-wrap">
            <div class="back-book-line">
              <span>银行金库安全标准</span>
              <span>库房3道加密大门，24h安保</span>
            </div>
            <div class="back-book-line">
              <span>全覆盖无死角监控摄像报警和红外线对射报警</span>
            </div>
          </div>
        </div>

        <ul class="cjsj-pannel-wrap" ref="cjsj_pannel_wrap">
          <li class="cjsj-pannel-cell">
            <h4 class="cjsj-pannel-title">中国人保财险</h4>
            <p class="cjsj-pannel-text align-center">全额承保用户</p>
            <p class="cjsj-pannel-text align-center">黄金安全</p>
            <img class="cjsj-pannel-img" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAAA1CAYAAACZdW+UAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjc2QjgwRjkxMEVGMzExRTk4NUU5Q0Y1QzVEODRGMUFBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjc2QjgwRjkyMEVGMzExRTk4NUU5Q0Y1QzVEODRGMUFBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzZCODBGOEYwRUYzMTFFOTg1RTlDRjVDNUQ4NEYxQUEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzZCODBGOTAwRUYzMTFFOTg1RTlDRjVDNUQ4NEYxQUEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5uQ4VDAAA0ZUlEQVR42ox8B4Bc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">
          </li>
          <li class="cjsj-pannel-cell">
            <h4 class="cjsj-pannel-title">存入立拿现金</h4>
            <p class="cjsj-pannel-text">线上买金，10g起存</p>
            <p class="cjsj-pannel-text" style="margin-top:0.34rem;">灵活选择存储期限,赠送金额 1 秒到账</p>
          </li>
          <li class="cjsj-pannel-cell">
            <h4 class="cjsj-pannel-title">到期灵活变现</h4>
            <p class="cjsj-pannel-text">支持提取实物金条，顺丰包邮</p>
            <p class="cjsj-pannel-text">可选择新的期限继续存储</p>
            <p class="cjsj-pannel-text">无回购手续费，可立即变现</p>
          </li>
        </ul>

        <!-- 价格对比 -->
        <div class="vs-wrap">
          <vs-price
          :refresh="vs_refresh"
          ></vs-price>
        </div>
        <!-- 价格对比 -->
      </template>

      <!-- 存储列表 -->
      <div class="panel-wrap panel-wrap-type1">
        <h4 v-if="macross" class="panel-title">
          <span class="title-cell">黄金理财</span>
        </h4>
        <div class="goods-list-unit-wrap" ref="goods_list_unit_wrap">
          <ul class="goods-list-nav">
            <li class="goods-list-nav-cell" :class="{ active:schema.active,hot:schema.hot }" v-for="(schema,index) in interest_schema" @click="switchSchema(schema,index,`click_homePage_cjsj_classification_${index+1}`)">{{schema.days}}天</li>
          </ul>

          <div class="result-wrap">
            <div class="result-list-wrap">
              <ul class="result-list">
                <li class="result-cell" v-for="(item,index) in storage_list">
                  <div class="result-cell-img-wrap">
                    <img class="result-cell-img" :key="item.img.goods_thumb" v-lazy="{src: item.img.goods_thumb, loading:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwcHgiICBoZWlnaHQ9IjIwMHB4IiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIGNsYXNzPSJsZHMtZWNsaXBzZSIgc3R5bGU9ImJhY2tncm91bmQ6IG5vbmU7Ij48cGF0aCBuZy1hdHRyLWQ9Int7Y29uZmlnLnBhdGhDbWR9fSIgbmctYXR0ci1maWxsPSJ7e2NvbmZpZy5jb2xvcn19IiBzdHJva2U9Im5vbmUiIGQ9Ik0zMCA1MEEyMCAyMCAwIDAgMCA3MCA1MEEyMCAyMiAwIDAgMSAzMCA1MCIgZmlsbD0iI2ZmYjYwNiIgdHJhbnNmb3JtPSJyb3RhdGUoMTI0LjU2OSA1MCA1MSkiPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBjYWxjTW9kZT0ibGluZWFyIiB2YWx1ZXM9IjAgNTAgNTE7MzYwIDUwIDUxIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGVUcmFuc2Zvcm0+PC9wYXRoPjwvc3ZnPg=='}">
                  </div>
                  <div class="result-cell-info-wrap">
                    <p class="result-cell-info-title">{{item.name}}</p>
                    <p v-if="macross" class="result-cell-info-interest">{{current_annual_rate}}%固定收益+金价波动收益</p>
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
        </div>
      </div>
      <!-- 存储列表 -->

      <!-- 产品说明 -->
      <div v-if="macross" class="panel-wrap">
        <h4 class="panel-title">
          <span class="title-cell">产品说明</span>
        </h4>
        <div class="specification-table-wrap">
          <div class="specification-table">
            <div class="table-tr">
              <div class="table-td"><p>收益构成</p></div>
              <div class="table-td"><p>固定年化收益+金价波动收益</p></div>
            </div>
            <div class="table-tr">
              <div class="table-td"><p>固定收益</p></div>
              <div class="table-td"><p>下单即发放至账户</p></div>
            </div>
            <div class="table-tr">
              <div class="table-td"><p>到期3种选择</p></div>
              <div class="table-td">
                <p>1、随时卖出提现</p>
                <p>2、随时提取实物金条</p>
                <p>3、继续存入生息</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 产品说明 -->

      <div class="zhanwei"></div>
  	</div>

    <div class="buy-info-wrap" :class="{ 'macross':macross, 'absolute':show_buy_info, 'fix-gt-phonex':isGtIphonex }">
      <div class="buy-info-inner-wrap">
        <div class="buy-info">
          <p class="total-price">总金额(元)：¥{{total.total_price}}</p>
          <p class="weight-wrap">
            <span class="total-weight">共{{total.total_weight}}g</span>
            <span class="total-interest">赠送入账 ¥{{total.total_interest}}</span>
          </p>
        </div>
        <div class="buy-btn" @click="addToCart">立即买入</div>
      </div>
    </div>

    
    <share-to-weixin
      :show="show_share_pupup"
      :share_para="share_para"
      :to_bottom="0"
      @close-share-popup="closeSharePopup"
    ></share-to-weixin>

  </div>
</template>

<script>
import topHead from "@/views/components/TopHead.vue";
import store from "@/vuex/index.js";
import shareToWeixin from "@/views/components/shareToWeixin.vue";
import vsPrice from "@/views/components/VsPrice.vue";
import specialProduct from "@/views/components/SpecialProduct.vue";

import { Toast } from "mint-ui";
import appconfig from "@/config/appconfig.js";

export default {
  components: {
    topHead,
    Toast,
    vsPrice:vsPrice,
    shareToWeixin:shareToWeixin,
    specialProduct:specialProduct,
  },
  data() {
    return {
      enter_time:0,

      mall_token:"",

      vs_refresh:"",
      product_price:"--.--",
      // threeparty_brand:[],

      interest_schema:[],

      storage_list:[],

      selected_interest:{},

      deposit:10,//最小寄存标准

      unit_price:0,//每克金价



      show_fixed_nav:false,
      isSupportSticky:true,
      show_buy_info:false,


      share_para:{},
      show_share_pupup:false,

      // detached_product:null,

      special_refresh:"",

      schema_code:"G",
    };
  },
  computed: {
    macross() {
      return this.$store.getters.getMacross;
    },
    isGtIphonex(){
      return utils.isGtIphonex()
    },
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
    is_weixin(){
      return utils.checkUserAgent().is_weixin||false;
    },
    current_annual_rate(){
      return (this.selected_interest.rate*100).toFixed("2");
    },
    resume_stamp() {
      return this.$store.getters.getResumeStamp;
    },
  },
  mounted() {
    
  },
  watch:{
    resume_stamp:function(nval,oval){//app  reume
      utils.trackEvent("exposure_hjlc");
    },
  },
  store,
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.init();
      utils.trackEvent("exposure_hjlc");
    })
  },
  beforeRouteLeave (to, from, next) {
    utils.trackEvent("pageLeave-"+from.meta.track_name,{"path":from.fullPath},new Date().getTime()-this.enter_time);
    next();
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  },
  // filters:{
  //   formatRate:function(rate){
  //     console.log(rate)
  //     return (rate*100).toFixed("2");
  //   },
  // },
  methods: {
    init(){
      this.enter_time = new Date().getTime();
      this.isSupportSticky = utils.isSupportSticky();
      this.mall_token = utils.storageGet("mall_token");
      this.special_refresh = this.vs_refresh = new Date().getTime();

      this.getProductPrice();
      // this.getBrandPrice();
      this.getProductInterestSchema();
      this.getGoodsStorageList();

      this.show_fixed_nav = false;
      this.$refs.fastbuy.addEventListener('scroll',(event)=>{

        if(!this.isSupportSticky){
          let offset = event.target.scrollTop-this.$refs.goods_list_unit_wrap.offsetTop+this.$refs.top_head.$el.offsetHeight;

          if(offset >= 0){
            this.show_fixed_nav = true;
          }else{
            this.show_fixed_nav = false;
          }
        }


        if(!this.macross){
          let pannel_offset = event.target.scrollTop-this.$refs.cjsj_pannel_wrap.offsetTop+this.$refs.top_head.$el.offsetHeight+60;
          
          if(pannel_offset >= 0){
            this.show_buy_info = true;
          }else{
            this.show_buy_info = false;
          }
        }

      });

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
        ret.model.data.forEach(function(item){
          let index = _.findIndex(item.properties,function(o){return o.name == "标签";});
          if(index != -1){
            item.properties[index].value = item.properties[index].value.split(/[,，]/);
            item.properties_tags = item.properties[index].value;
          }
          item.select_num = 0;
        })
        me.storage_list = ret.model.data;
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
      // console.log("index:",index)
    }.after(function(schema,index,event_name) {
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

    goBack: function() {
      this.$router.goBack();
    },
		redirect:function(path,event_name){
			path ? this.$router.push({ path: path }):this.goBack();
		}.after(function(path,event_name) {
      if(event_name){
        utils.trackEvent(event_name);
      }
    }),

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

    /*分享*/
    showSharePupup:function(){
      let me = this;

      this.share_para = {
        message: {
          title: "存黄金送现金，诚意满满秒到账",
          description: "上黄金象买黄金，抵御通货还能赚？存黄金首选黄金象！存入立拿现金，灵活选择期限，到期灵活变现还可提取实物黄金噢～",
          media: {
            webpageUrl:appconfig.appbaseurl+"/"+window.location.hash,
          }
        },
      };

      this.show_share_pupup = true;
    }.after(function() {
      utils.trackEvent("click_homePage_cjsj_share");
    }),
    closeSharePopup: function() {
      //关闭分享弹层
      this.show_share_pupup = false;
    },
    /*分享*/


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
        
        // me.$router.replace({ path: '/order/generate/fastbuy/common' });
        // me.$router.go(-1);
        setTimeout(function(){
          me.redirect('/order/generate/fastbuy/0');
        },200);
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });

    }.after(function() {
      utils.trackEvent("click_homePage_cjsj_storageButton");
    }),
/********************************加入购物车********************************/

  }
};
</script>
<style lang="less" scoped>
@import "./CjsjFastbuy.less";
</style>
