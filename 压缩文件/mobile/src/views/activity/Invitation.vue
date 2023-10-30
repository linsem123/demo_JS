<template>
	<div class="main">
   <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">邀请有礼</div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->

    <div class="content">
      <img src="@/assets/images/invitation/head.jpg" alt="">

      <div class="dynamic-content">
        <div class="invite-btn" @click="showSharePupup">点击邀请好友</div>
        <div class="roll-data-wrap">
          <div class="roll-data-inner">
            <ul class="roll-data" :class="{anim:animate==true}">
              <li class="roll-data-cell" v-for="(item,index) in roll_data">
                <span>{{item.mobile}}</span>
                <span>58元优惠券</span>
                <span>已入账</span>
              </li>
            </ul>
          </div>
          <div class="roll-data-btn-wrap">
            <div class="roll-data-btn" @click="showInviteRecord">我的邀请</div>
            <div class="roll-data-btn" @click="showInviteReward">我的奖励</div>
          </div>
        </div>
        <div class="text-wrap">
          <h4>活动规则：</h4>
          <p>邀请好友注册，好友在注册后的30天内下单购买我们的金条产品，则邀请人可以获得58元优惠券奖励哦～</p>
          <h4>说明：</h4>
          <p style="letter-spacing: -0.5px;">1.优惠券有效期30天，仅限购买金条使用，不可与其他优惠券叠加使用</p>
          <p>2.如果发现有恶意骗取奖励行为，黄金象有权取消该笔奖励</p>
          <p>3.如有疑问，可联系黄金象客服：400 821 0704</p>
        </div>
      </div>

      <!-- <img src="@/assets/images/newbie/bg-2.jpg" alt=""> -->
    </div>


    <!-- 我的邀请 -->
    <Popup
        v-model="show_invite_record"
        pop-transition="popup-fade" 
        class="pop-modal">
      <div class="content" style="padding:0.5rem 1rem;">
        <span class="iconfont icon-shibai" @click="show_invite_record=!show_invite_record"></span>
        
        


        <div class="invite-head-wrap">
          <table>
            <thead>
              <th>账号</th>
              <th>状态</th>
            </thead>
          </table>
        </div>
        <template v-if="invite_record.length">
          <div class="invite-body-wrap">
            <table>
              <tbody>
                <tr v-for="item in invite_record">
                  <td>{{item.invitee_mobile | filter_hide}}</td>
                  <td>已注册</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>

        <template v-else>
          <div class="nothing-wrap">
            <img class="nothing-img" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATIAAADTCAYAAAACqZ9WAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkNGQjY1MDNFMDE2OTExRTlBMjBEOEUyMkFCQjI5MDYyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkNGQjY1MDNGMDE2OTExRTlBMjBEOEUyMkFCQjI5MDYyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0ZCNjUwM0MwMTY5MTFFOUEyMEQ4RTIyQUJCMjkwNjIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0ZCNjUwM0QwMTY5MTFFOUEyMEQ4RTIyQUJCMjkwNjIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz74NvZMAAAaZklEQVR42uydCZhU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">
            <p class="nothing-text">暂无邀请哦～</p>
          </div>
        </template>
      </div>
      <div class="mask"></div>
    </Popup>


    <!-- 我的奖励 -->
    <Popup
        v-model="show_invite_reward"
        pop-transition="popup-fade" 
        class="pop-modal">
      <div class="content">
        <span class="iconfont icon-shibai" @click="show_invite_reward=!show_invite_reward"></span>
        <div class="invite-head-wrap">
          <table>
            <thead>
              <th>账号</th>
              <th>获得时间</th>
              <th>状态</th>
            </thead>
          </table>
        </div>

        <template v-if="invite_reward.length">
          <div class="invite-body-wrap">
            <table>
              <tbody>
                <tr v-for="item in invite_reward">
                  <td>{{item.invitee_mobile | filter_hide}}</td>
                  <td>{{item.reward_time | filter_cut_time}}</td>
                  <td>已入账</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>

        <template v-else>
          <div class="nothing-wrap">
            <img class="nothing-img" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATIAAADTCAYAAAACqZ9WAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkNGQjY1MDNFMDE2OTExRTlBMjBEOEUyMkFCQjI5MDYyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkNGQjY1MDNGMDE2OTExRTlBMjBEOEUyMkFCQjI5MDYyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0ZCNjUwM0MwMTY5MTFFOUEyMEQ4RTIyQUJCMjkwNjIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0ZCNjUwM0QwMTY5MTFFOUEyMEQ4RTIyQUJCMjkwNjIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz74NvZMAAAaZklEQVR42uydCZhU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">
            <p class="nothing-text">暂无奖励哦～</p>
          </div>
        </template>

      </div>
      <div class="mask"></div>
    </Popup>

    <share-to-weixin
      :show="show_share_pupup"
      :to_bottom="0"
      :share_para="share_para"
      :track_event_name="track_event_name"
      @close-share-popup="closeSharePopup"
    ></share-to-weixin>

  </div>
</template>

<script>

import topHead from "@/views/components/TopHead.vue";
import shareToWeixin from "@/views/components/shareToWeixin.vue";
import appconfig from "@/config/appconfig.js";
import { Toast, Popup } from "mint-ui";

export default {
  components: {
    topHead,
    Popup,
    shareToWeixin: shareToWeixin,
  },
  data() {
    return {
      enter_time:0,
      mall_token:"",
      invite_reward:[],
      invite_record:[],

      show_invite_record:false,
      show_invite_reward:false,

      show_share_pupup:false,

      share_para:{},

      track_event_name:{
        share_success:"click_activity_yqhyButton_Success",
        share_fail:"click_activity_yqhyButton_fail",
      },

      roll_data:[],

      animate:false,
    }
  },
  mounted() {
    // this.init();
  },
  filters:{
    filter_cut_time(time){
      return time.split(" ")[0];
    },
    filter_hide(number){
      return utils.hideString(number,3,4);
    },
  },
  computed: {
    // mall_token(){
    //   return utils.storageGet("mall_token")
    // },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.init();
      utils.trackEvent("exposure_activity_yqhy");
    })
  },
  beforeRouteLeave (to, from, next) {
    utils.trackEvent("pageLeave-"+from.meta.track_name,{"path":from.fullPath},new Date().getTime()-this.enter_time);
    next();
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  },
  methods:{
    init(){
      this.enter_time = new Date().getTime();
      this.mall_token = utils.storageGet("mall_token");
      this.getRollData();
      setInterval(this.scroll,2010)
    },

    scroll(){
      this.animate = true
      setTimeout(() => {
        this.roll_data.push(this.roll_data[0]);
        this.roll_data.shift();
        this.animate= false;  // 这个地方如果不把animate 取反会出现消息回滚的现象，此时把ul 元素的过渡属性取消掉就可以完美实现无缝滚动的效果了
      },1990)
    },

    getRollData:function(){
      var me = this;

      utils.API.cmsservice_invite_record({
        method:"get",
      })
      .then(function(ret) {
        me.roll_data = ret.model.map(function(item){
          item.mobile = utils.hideString(item.mobile,3,4);
          return item;
        });
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    showInviteRecord:function(){
      var me = this;
      this.getInviteRecordList(function(){
        me.show_invite_record = !me.show_invite_record;
      });
      utils.trackEvent("click_activity_yqhy_myInvitation");
    },
    showInviteReward:function(){
      var me = this;
      this.getInviteRewardList(function(){
        me.show_invite_reward = !me.show_invite_reward;
      });
      utils.trackEvent("click_activity_yqhy_myRewards");
    },
    getInviteRecordList:function(cb){
      var me = this;

      if(!this.mall_token){
        this.redirect("/login");
        return;
      }

      if(me.invite_record.length){
        cb&&cb();
        return;
      }

      utils.API.invite_record({
        data:{
          token:this.mall_token,
          "pagination" : {
            "count":99999,
            "page":1,
          }
        }
      })
      .then(function(ret) {
        // console.log(ret.model.data);
        me.invite_record = ret.model.data;
        cb&&cb();
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    getInviteRewardList:function(cb){
      var me = this;

      if(!this.mall_token){
        this.redirect("/login");
        return;
      }

      if(me.invite_reward.length){
        cb&&cb();
        return;
      }

      utils.API.invite_reward({
        data:{
          token:this.mall_token,
          "pagination" : {
            "count":99999,
            "page":1,
          }
        }
      })
      .then(function(ret) {
        // console.log(ret.model.data);
        me.invite_reward = ret.model.data;
        cb&&cb();
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    getInviteUser:function(cb){
      var me = this;

      utils.API.invite_user({
        data:{
          token:this.mall_token,
        }
      })
      .then(function(ret) {
        cb&&cb(ret.model.data);
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    /*分享*/
    showSharePupup:function(){
      var me = this;

      if(!this.mall_token){
        this.redirect("/login");
        return;
      }

      if(_.isEmpty(me.share_para)){
        this.getInviteUser(function(info){
          me.share_para = _.merge({},{
            message: {
              media: {
                webpageUrl:`${appconfig.activeurl}/dist/201812-register/register.html?source=020401&invite_code=${info.invite_code}`,
              }
            },
          });

          me.show_share_pupup = true;
        });
      }else{
        me.show_share_pupup = true;
      }
    }.after(function(){
      utils.trackEvent("click_activity_yqhyButton");
    }),
    
    closeSharePopup: function() {
      //关闭分享弹层
      this.show_share_pupup = false;
    },
    /*分享*/

    goBack(){
      this.$router.goBack();
    },
    redirect:function(path,event_name){
      path ? this.$router.push({ path: path }):this.goBack();
    }
    // .after(function(path,event_name) {
    //   utils.trackEvent(event_name);
    // }),
      // }
  }
};
</script>
<style lang="less" scoped>
@import "./Invitation.less";
</style>
