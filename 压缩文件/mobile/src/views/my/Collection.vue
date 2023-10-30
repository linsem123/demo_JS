<template>
	<div>
    <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">宝贝收藏</div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->



		<div class="collection-wrap">
			<div class="top-blank"></div>

	    <!-- 分类内容 start -->
        <div class="collection-content clearfix">
          <mt-loadmore style="min-height:calc(100vh - 1.7rem);" :top-method="loadTop" ref="loadmore">
            <div class="result-wrap">
              <div class="result-list-wrap">
                <ul class="result-list">
                  <li class="result-cell" v-for="(item,index) in result_list">
                    <mt-cell-swipe
                      class="collection-cell-swipe"
                      :right="[
                        {
                          content: '删除',
                          style: { background: 'red', color: '#fff' },
                          handler: (event) => {removeCollection(item.goods_id,index);}
                        }
                      ]">

                      <div class="result-cell-img-wrap">
                        <img class="result-cell-img"  @click.stop="redirect(`/goods/${item.goods_id}`)" v-lazy="{src: item.img.thumb, loading:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwcHgiICBoZWlnaHQ9IjIwMHB4IiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIGNsYXNzPSJsZHMtZWNsaXBzZSIgc3R5bGU9ImJhY2tncm91bmQ6IG5vbmU7Ij48cGF0aCBuZy1hdHRyLWQ9Int7Y29uZmlnLnBhdGhDbWR9fSIgbmctYXR0ci1maWxsPSJ7e2NvbmZpZy5jb2xvcn19IiBzdHJva2U9Im5vbmUiIGQ9Ik0zMCA1MEEyMCAyMCAwIDAgMCA3MCA1MEEyMCAyMiAwIDAgMSAzMCA1MCIgZmlsbD0iI2ZmYjYwNiIgdHJhbnNmb3JtPSJyb3RhdGUoMTI0LjU2OSA1MCA1MSkiPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBjYWxjTW9kZT0ibGluZWFyIiB2YWx1ZXM9IjAgNTAgNTE7MzYwIDUwIDUxIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGVUcmFuc2Zvcm0+PC9wYXRoPjwvc3ZnPg=='}">
                      </div>
                      <div class="result-cell-info-wrap">
                        <p class="result-cell-info-title" @click.stop="redirect(`/goods/${item.goods_id}`)">{{item.name}}</p>
                        <p v-if="item.properties_tags" class="result-cell-info-tag">
                          <span class="tag-cell" v-for="tag in item.properties_tags">{{tag}}</span>
                        </p>
                        <div class="result-cell-info-price">
                          <span class="price">{{formatedMinPrice(item)}}</span>
                          <span class="collect-num">{{item.collect_num||0}}人收藏</span>
                        </div>
                      </div>

                    </mt-cell-swipe>
                  </li>
                </ul>
              </div>
            </div>

            <!-- <div class="click-more" @click="getMore();">{{tip}}</div> -->
            <div class="zhanwei"></div>
          </mt-loadmore>
        </div>
        <!-- 分类内容 end -->


			<div class="zhanwei"></div>
		</div>

	</div>
</template>

<script>
import topHead from "@/views/components/TopHead.vue";

import { Toast, MessageBox, Loadmore, CellSwipe } from "mint-ui";

export default {
  components: {
    topHead: topHead,
    mtLoadmore:Loadmore,
    mtCellSwipe:CellSwipe,
  },
  data() {
    return {
      mall_token:"",
      result_list:[],
    };
  },
  computed: {
    
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.init();
      // utils.trackEvent("exposure_my");
    })
  },

  mounted() {
    // this.init();
  },
  methods: {
    init: function() {
      this.mall_token = utils.storageGet("mall_token");
      
      this.getCollectionList();
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
    removeCollection:function(goods_id,index){
      var me = this;
      utils.API.user_collect_delete({
        data: {
          token: me.mall_token,
          goods_id: goods_id
        }
      })
      .then(function(ret) {
        me.result_list.splice(index,1);
        Toast("删除收藏成功~");
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    getCollectionList:function(){
      var me = this;

      utils.API.user_collect_list({
        data: {
          "token": me.mall_token,
        }
      })
      .then(function(ret) {
        var data = _.isArray(ret.model.data)?ret.model.data:[]

        data.forEach(function(item){
          let index = _.findIndex(item.properties,function(o){return o.name == "标签";});
          if(index != -1){
            item.properties[index].value = item.properties[index].value.split(/[,，]/);
            item.properties_tags = item.properties[index].value;
          }
          item.select_num = 0;
        })
        me.result_list = data;
        me.$refs.loadmore&&me.$refs.loadmore.onTopLoaded();
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    loadTop:function(){
      this.getCollectionList();
    },


    goBack:function(){
      this.$router.goBack();
    },

    redirect: function(url,event_name){
      this.$router.push({path: url})
    }.after(function(url,event_name){
      if(event_name){
        utils.trackEvent(event_name);
      }
    }),
  }
};
</script>


<style lang="less" scoped>
@import "./Collection.less";
</style>