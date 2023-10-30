<template>
	<section v-if="notice_list.length" class="notice">
		<p class="sounder-wrap">
			<!-- <span class="sounder-title">业务公告:</span> -->
			<span class="iconfont icon-gonggao"></span>
		</p>
		<div class="notice-list-wrap">
			<ul class="notice-list">
				<li class="notice-cell" :class="{ 'hastran':add_transition }" :style="{top:top}" v-for="item in notice_list" @click="gotoNode(item)">
          <div class="notice-cell-title">{{item.title}}</div>
        </li>
			</ul>
		</div>
	</section>
</template>

<script>
import { Toast } from "mint-ui";
export default {
  props:["refresh",],
  components: {},
  data() {
    return {
      interval: null,
      limit: 5,
      count: 1,
      timer: 5000,
      height: 0.56,
      top: "0rem",
      add_transition: true,
      notice_list:[],
      page: 0
    };
  },
  mounted() {
  },
  watch:{
    refresh:function(nval,oval){
      this.init();
    },
  },
  methods: {
    init:function(){
      this.getNotice();
    },
    /************获取公告**************/
    getNotice: function() {
      var me = this;
      utils.API.cmsservice_notice({
        method:"get",
      })
      .then(function(ret) {
        ret.model.forEach(function(item){
          item.link = "##";
        });
        me.notice_list = ret.model;
        if(me.notice_list.length > 1){
          me.scrollInterval();
        }
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    /************获取公告**************/
    scrollInterval: function() {
      var me = this;
      clearInterval(this.interval);
      this.interval = setInterval(function() {
        me.add_transition = true;
        me.top = -1 * me.height + "rem";
        setTimeout(function() {
          me.add_transition = false;
          me.top = 0;
          me.notice_list.push(me.notice_list.shift());
        }, 1000);
      }, me.timer);
    },
    gotoNode:function(item) {
      // utils.gotoNode(activity_name);
      this.$emit("click-notice",item);
    }
  }
};
</script>

<style lang="less" scoped>
@sub_con: #b0b1b3;
@blue: #3096ea;

.notice {
  height: 0.56rem;
  background: #fdf3e7;
  box-sizing: border-box;
  padding: 0 0.34rem;
  display: flex;
  align-items: center;
  .sounder-wrap {
    // display: inline-block;
    // line-height: 0.56rem;
    .sounder-title {
      display: inline-block;
      vertical-align: middle;
    }
    .iconfont {
      // display: inline-block;
      // vertical-align: middle;
      color:#ed7b39;
      font-size:0.28rem;
    }
  }
  .notice-list-wrap {
    overflow: hidden;
    display: inline-block;
    vertical-align: middle;
    max-width: 6rem;
    height: 0.56rem;
    line-height: 0.56rem;
    color:#ed7b39;
    margin-left:0.1rem;
    .notice-list {
      .notice-cell {
        &.hastran {
          transition: all 1s;
        }
        position: relative;
        top: 0;
        height: 0.56rem;
        line-height: 0.56rem;
        .notice-cell-title {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
  .more {
    display: inline-block;
    vertical-align: middle;
    border-left: 1px solid #ececec;
    padding-left: 10px;
  }
}
</style>