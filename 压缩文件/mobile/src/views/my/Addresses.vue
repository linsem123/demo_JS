<template>
  <div>
    <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">我的地址</div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->




    <template v-if="address_list.length">
    <div class="mall-select-address">
      <div class="top-blank"></div>
      <!-- 地址信息 -->
      <div class="address-info-wrap" v-for="(item,index) in address_list">
        <div class="default-wrap" v-show="item.default_address == 1">
          <span class="select-core checked"></span>
        </div>
        <div class="address-inner-wrap">
          <div>
            <div class="address-info-head">
              <span class="name">{{item.consignee}}</span>
              <span class="phone">{{item.mobile}}</span>
            </div>
            <div class="address">{{item.address}}</div>
          </div>
          <div class="btn">
            <span @click="deleteAddress(item)">删除</span>
            <span @click="redirect(`/my/address/${item.id}/edit`)">编辑</span>
          </div>
        </div>
      </div>
      <!-- 地址信息 -->
      <div class="zhanwei"></div>
  	</div>
    </template>
    <template v-else>
      <div class="wrapper">
        没有更多啦~
      </div>
    </template>

    <div class="btn-wrap">
      <a class="bottom-btn" href="javascript:;" @click="redirect('/my/address/add')">添加新地址</a>
    </div>
    
  </div>
</template>

<script>
import topHead from "@/views/components/TopHead.vue";
import constants    from '@/assets/js/constants.js';

import {
	Toast,
	MessageBox
} from 'mint-ui';

export default {
	components:{
    topHead:topHead,
	},
  computed: {
    // mall_token(){//当前选择的address
    //   return utils.storageGet("mall_token")
    // },
  },
	data(){
	  return {
      address_list:[],
      mall_token:"",
		}	
	},
	mounted(){
    // this.init();
	},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.init();
    })
  },
	methods:{
    init:function(){

      this.mall_token = utils.storageGet("mall_token");

      this.getMyAddressList();
    },
    getMyAddressList:function(cb){
      var _this = this;
      utils.API.address_list({
        data:{
          token: _this.mall_token
        }
      })
      .then(function (ret) {
        _this.address_list = ret.model.data;
        _this.$store.commit('setMallAddress',ret.model.data);
        // console.log("_this.category:",_this.category)
        cb&&cb();
      })
      .catch(function(ret){
        !ret.__servererror__ && Toast(ret.errorMessage||"未知错误！");
      });
    },
    deleteAddress:function(address){
      var _this = this;
      MessageBox.confirm('确定执行此操作?').then(action => {
        utils.API.address_delete({
          data:{
            token:utils.storageGet("mall_token"),
            address_id: address.id
          }
        })
        .then(function (ret) {
          _this.getMyAddressList();
          Toast("地址已删除");
        })
        .catch(function(ret){
          !ret.__servererror__ && Toast(ret.errorMessage||"未知错误！");
        });
      });
    },
    redirect:function(path){
      this.$router.push({ path: path})
    },
	  goBack:function(){
      this.$router.goBack();
		}
	}
};

</script>

<style lang="less" scoped>

@import "~@/assets/less/variable.less";

.wrapper {
  text-align: center;
  color: #ccc;
  margin-top: 1.5rem;
}
.mall-select-address{
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  // position: absolute;
  .address-info-wrap {
    padding:0.3rem 0.4rem 0.6rem;
    background:#ffffff;
    position: relative;
    margin-bottom:0.2rem;
    display: flex;
    align-items:center;
    .default-wrap {

    }
    .address-inner-wrap {
      width: 100%;
      margin-left:0.3rem;
    }
    .address-info-head {
      margin-bottom:0.24rem;
      font-size:0.32rem;
      font-weight: bold;
      .name {

      }
      .phone {
        margin-left: 0.2rem;
      }
    }
    .btn{
      float:right;
      span{
        margin-right:10px;
      }
    }
    .address {
      width: 90%;
    }
    .icon-confirm {
      color:#BFBFBF;
      position: absolute;
      top:50%;
      left: 0.4rem;
      font-size: 0.5rem;
      transform: translateY(-50%);
    }
    .icon-confirmfill {
      color:#0076FF;
      position: absolute;
      top:50%;
      left: 0.4rem;
      font-size: 0.5rem;
      transform: translateY(-50%);
    }
  }
}
.btn-wrap {
  position: absolute;
  text-align: center;
  bottom:0;
  z-index: 1000;
  width: 100%;
  .bottom-btn {
    display: inline-block;
    width: 5rem;;
    height: 0.8rem;
    text-align: center;
    line-height: 0.8rem;
    background:@font-color-yellow;
    color:#ffffff;
    font-size: 0.32rem;
    font-weight: bold;
    border-radius: 0.5rem;
    margin-bottom:0.2rem;
  }
}

</style>