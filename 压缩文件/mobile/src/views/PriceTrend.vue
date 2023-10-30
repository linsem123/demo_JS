<template>
	<div>
		<!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
      :show_border="false"
    >
      <div slot="left"></div>
      <div slot="main">金价趋势</div>
      <div slot="right">
      	<div class="right-head" @click="switchPricesource">
      		<span>金价来源</span>
      		<span class="iconfont icon-wenhao"></span>
      	</div>
      </div>
    </top-head>
    <!-- 头部 -->

    <div class="trend-wrap">
    	<div class="top-blank"></div>
      <!-- <mt-loadmore style="min-height:calc(100vh - 1.7rem);" :top-method="loadTop" ref="loadmore"> -->
      	<div class="price-wrap">
      		<div class="price-unit">
      			<h4 class="price">{{product_price}}</h4>
      			<p class="text">今日金价（元/克）</p>
      		</div>
      		<div class="price-unit">
      			<h4 class="price">{{yesterday_price}}</h4>
      			<p class="text">昨日金价（元/克）</p>
      		</div>
      	</div>
      	<div class="high-price-wrap">
      		<div class="high-price-wrap-inner">
      			<p class="high-price-unit">{{currentChartData.label}}最高：<span class="high-price">{{price_max}}</span></p>
      			<p class="high-price-unit">{{currentChartData.label}}最低：<span class="high-price">{{price_min}}</span></p>
      		</div>
      	</div>

      	<div class="chart-wrap">
      		<div class="chart-wrap-inner">
            <div class="echart-wrap">
              <vChart
                :options="chart_option"
                ref="chart"
              ></vChart>
              <div class="chart-date">
                <span class="chart-date-cell">{{start_date}}</span>
                <span class="chart-date-cell">{{end_date}}</span>
              </div>
            </div>
            <ul class="switch-chart">
              <li class="switch-chart-cell" v-for="(item,index) in trend_data" :class="currentChartData.days==item.days?'active':''" @click="switchChart(item)">{{item.label}}</li>
            </ul>
      		</div>
      	</div>

      	<div class="panel-wrap" v-if="news_list.length">
      		<h4 class="panel-title">
            <span class="title-cell">行业要闻</span>
          </h4>
          <ul class="news-wrap">
          	<li class="news-cell" v-for="(news,index) in news_list" @click="gotoNode(news,index)">
          		<div class="left-wrap">
          			<h4 class="news-title">{{news.title}}</h4>
          			<p class="news-publish">黄金象</p>
          		</div>
          		<img class="news-img" :src="news.field_thumb">
          	</li>
          </ul>
      	</div>
      <!-- </mt-loadmore> -->
      <div class="zhanwei"></div>
    </div>

    <div class="bottom-bar-wrap" :class="{ 'fix-gt-phonex':isGtIphonex }">
      <div class="bottom-bar-wrap-inner">
        <a class="bottom-bar-btn" href="javascript:;" @click="redirect('/goods','click_goldPriceTrend_buygoldButton');">买金条</a>
        <a class="bottom-bar-btn" href="javascript:;" @click="redirect('/activity/cjsj','click_goldPriceTrend_buyinvestButton');">
          <span v-if="macross">买理财</span>
          <span v-else>存黄金</span>
        </a>
      </div>
    </div>

    <!-- 来源弹层 -->
    <Popup
        v-model="show_pricesource"
        pop-transition="popup-fade" 
        class="pop-modal pricesource-model">
      <div class="content">
        <span class="iconfont icon-close2" @click="show_pricesource=!show_pricesource"></span>
        <div class="top-back"></div>
        <img class="top-img" src="@/assets/images/sounder.png">
        <ul class="source-disc-wrap">
          <li class="source-disc-cell">
            <p class="dot">1</p>
            <span class="disc-text">黄金象金价为实物金条价格=原料金价+加工费，买入、卖出均采用此价格</span>
          </li>
          <li class="source-disc-cell">
            <p class="dot">2</p>
            <span class="disc-text">上金所开盘期间，原料金价参考上金所9:00-9:30黄金T+D加权均价，上金所休盘期间，原料金价参考国际黄金加权均价</span>
          </li>
          <li class="source-disc-cell">
            <p class="dot">3</p>
            <span class="disc-text">金条加工费6-10元/克</span>
          </li>
        </ul>
      </div>
      <div class="mask"></div>
    </Popup>
    <!-- 来源弹层 -->

	</div>
</template>

<script>
import store from '@/vuex/index.js'
import topHead from "@/views/components/TopHead.vue";
import echarts from 'vue-echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';

import {
	Toast,
	Popup,
	// Loadmore,
} from 'mint-ui';

export default {
	components:{
		topHead:topHead,
    vChart:echarts,
    Popup:Popup,
    // mtLoadmore:Loadmore,
	},
	data(){
	  return {
	  	// mall_token:"",
      // echart_initOptions:{
      //   renderer:'svg',
      // },
      show_pricesource:false,
      product_price:"--",
      currentChartData:{},
      trend_data:[
        {
          days:"7",
          // active:true,
          data:null,
          label:"近7日",
        },
        {
          days:"30",
          // active:false,
          data:null,
          label:"近30日",
        },
        {
          days:"180",
          // active:false,
          data:null,
          label:"近6个月",
        },
        {
          days:"360",
          // active:false,
          data:null,
          label:"近1年",
        },
      ],
      chart_option:{
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            // snap: true,
          },
          // position: function (pt) {
          //   return [pt[0]-52, '10%'];
          // },
          // alwaysShowContent:false,
          // hideDelay:10,
          enterable:true,
          // formatter:function(params,ticket,callback){
          //   callback(console.log(params))
            
          // },
          // triggerOn:"mousemove|click",
          // showDelay: 50  //防止抖动
          // extraCssText:'z-index:1;'
        },
        // axisPointer: {
        //   link: {xAxisIndex: 'all'},
        //   // label: {
        //   //   backgroundColor: '#777'
        //   // }
        // },
        // toolbox: {
        //   show: true,
        //   width:"200px",
        //   height:"200px",
        // },
        legend: {
          // data:['销量']
        },
        grid:{
          left: '12%',
          top: 10,
          right: '5%',
          bottom: 40,
          width: 'auto',
          height: 'auto',
        },
        xAxis: {
          axisLabel:{
            show: false,
            rotate:60,
            textStyle:{
              align: 'center'
            },
          },
          boundaryGap:false,
          axisTick:{
            show:false,
          },
          axisLine: {
            lineStyle: {
              color: '#999999',
              opacity:0,
            }
          },
          axisPointer:{
            snap:true,
          },
          data: [],
        },
        yAxis: {
          splitNumber:4,
          // minInterval:1,
          min: function(value) {
            // console.log(value)
            // return 260;
            return Math.floor(value.min);
          },
          // max: function(value) {
          //   return Math.ceil(value.max);
          // },
          // axisLabel:{
          //   show:false,
          // },
          axisTick:{
            show:false,
          },
          axisLine: {
            // show:false,
            lineStyle: {
              color: '#999999',
              opacity:0,
            }
          },
          axisLabel:{
            fontSize:12,
            color:"#999999",
          },
          splitLine: {
            show: true,
            lineStyle:{
              color: ['#fbfbfb'],
              width: 1,
              type: 'solid'
            }
          }
        },
        series: [{
          name: '',
          type: 'line',
          smooth: true,
          symbol: "none",
          itemStyle: {
            normal: {
              color: '#ffc100'
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#ffe69c'
              },{
                offset: 1,
                color: '#ffe'
              }]),
              opacity:0.8,
            },
          },
          data: []
        }]
      },
      news_list:[],
		}	
	},
	mounted(){
    var me = this,
        canvas = document.querySelector('canvas');
    canvas.addEventListener("touchstart", function(e) {
      me.$refs.chart.mergeOptions({
        tooltip: {
          show:true,
        }
      });
      e.preventDefault();
    }, false);
    canvas.addEventListener("touchmove", function(e) {
      e.preventDefault();
    }, false);
    canvas.addEventListener("touchend", function(e) {
      // alert("touchend");
      // console.log(me.$refs.chart)
      me.$refs.chart.mergeOptions({
        tooltip: {
          show:false,
        }
      });
      e.preventDefault();
    }, false);
		this.init();
	},
	beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      // vm.init();
      utils.trackEvent("exposure_goldPriceTrend");
      // vm.mall_token = utils.storageGet("mall_token");
    })
  },
	store,
  computed: {
    macross() {
      return this.$store.getters.getMacross;
    },
    isGtIphonex(){
      return utils.isGtIphonex()
    },
  	seller_id(){//店铺id
      return this.$store.getters.getSellerId;
    },
    location() {
      return this.$store.getters.getLocation;
    },
    resume_stamp() {
      return this.$store.getters.getResumeStamp;
    },
    yesterday_price(){
      var price = "--";
      if(this.trend_data[0].data && this.trend_data[0].data.series_data.length){
        price = this.trend_data[0].data.series_data[this.trend_data[0].data.xAxis_data.length-1];
      }
      return price;
    },
    price_max(){
      var price = "--";

      if(this.currentChartData.data && this.currentChartData.data.series_data.length){
        price = _.max(this.currentChartData.data.series_data);
      }
      return price;
    },
    price_min(){
      var price = "--";

      if(this.currentChartData.data && this.currentChartData.data.series_data.length){
        price = _.min(this.currentChartData.data.series_data);
      }
      return price;
    },
    start_date(){
      var date = "";
      if(this.currentChartData.data && this.currentChartData.data.xAxis_data && this.currentChartData.data.xAxis_data.length){
        date = this.currentChartData.data.xAxis_data[0];
      }
      return date;
    },
    end_date(){
      var date = "";

      if(this.currentChartData.data && this.currentChartData.data.xAxis_data && this.currentChartData.data.xAxis_data.length){
        date = this.currentChartData.data.xAxis_data[this.currentChartData.data.xAxis_data.length-1]
      }
      return date;
    },
  },
  watch:{
    resume_stamp:function(nval,oval){//app  reume
      utils.trackEvent("exposure_goldPriceTrend");
    },
  },
	methods:{
		init:function(){
			var me = this;
      this.getProductPrice();
      this.getNews();
      this.getTrendData("7",function(data){
        me.currentChartData = me.trend_data[0];
        me.setChartOption(data.xAxis_data,data.series_data);
      });
		},

    /************获取黄金要闻**************/
    getNews:function(){
      var me = this;
      utils.API.cmsservice_news({
        method:"get",
      })
      .then(function(ret) {
        me.news_list = [];
        me.news_list = ret.model.filter(function(item,index){
          item.link = "##";
          return index < 3;
        });
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    /************获取黄金要闻**************/

    setChartOption:function(xAxis_data,series_data){
      this.chart_option.xAxis.data = [];
      this.chart_option.series[0].data = [];
      this.chart_option = _.merge({},this.chart_option,{
        xAxis:{
          data:xAxis_data,
        },
        series:[{
          data:series_data,
        }],
      })
    },

    switchChart:function(item){
      this.currentChartData = item;

      var me = this,
          find_data = _.find(this.trend_data,function(o){ return o.days == item.days});

      if(_.isEmpty(find_data.data)){
        this.getTrendData(item.days,function(data){
          // debugger
          me.setChartOption(data.xAxis_data,data.series_data);
        });
      }else{
        me.setChartOption(item.data.xAxis_data,item.data.series_data);
      }
    }.after(function(item){
      utils.trackEvent('click_goldPriceTrend_button_'+item.days);
    }),

    /************今日金价获取**************/
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
    /************今日金价获取**************/

    /************获取历史价格趋势**************/
    getTrendData:function(days,cb){
      var me = this;

      utils.API.product_getHistoryPrice({
        show_loading:true,
        data: {
          "reqBody":{
            "productName":"G",
            "days":days,//{string} reauired 如果是"7"这种数字，表示最近7天的数据；和date两个参数取其一
            // date:"2018-07-01~2018-07-09",//{string} optional 如果是"2018-07-01~2018-07-09"这种时间段，表示一个时间段的数据，和days两个参数取其一
          }
        }
      })
      .then(function(ret) {
        var res = ret.model.items || [],
            find_index = _.findIndex(me.trend_data,function(o){ return o.days == days}),
            data = {
              xAxis_data:[],
              series_data:[],
            };
        // if(_.isEmpty(data_in_trend_data)){

        // }
        if(find_index != -1){
          res.forEach(function(item,index){
            // if(index == 0 || index == res.length-1){
            //   data.xAxis_data.push(item.date);
            // }else{
            //   data.xAxis_data.push("");
            // }
            data.xAxis_data.push(item.date);
            data.series_data.push(item.price)
          })
        }
        me.trend_data[find_index].data = _.merge({},data);
        cb&&cb(me.trend_data[find_index].data);
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    /************获取历史价格趋势**************/


    switchPricesource:function(){
      this.show_pricesource =! this.show_pricesource;
    }.after(function(){
      utils.trackEvent("click_goldPriceTrend_source");
    }),

    // loadTop:function(){
    //   this.init();
    //   setTimeout(()=>{
    //     this.$refs.loadmore&&this.$refs.loadmore.onTopLoaded();
    //   },1000)
    // },

    gotoNode: function(activity_name,index) {
      utils.gotoNode(activity_name);
      utils.trackEvent("click_goldPriceTrend_newslist",{
        index:(index+1),
      });
    },

    redirect: function(path,event_name) {
      this.$router.push({path: path});
    }.after(function(path,event_name){
      if(event_name){
        utils.trackEvent(event_name);
      }
    }),
    goBack: function() {
      this.$router.goBack();
    },
	}

};
</script>
<style lang="less" scoped>
	@import './pricetrend.less';
</style>