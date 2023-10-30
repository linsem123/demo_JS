<template>
  <Popup
      v-model="address_list_modal"
      position="right" 
      class="pop-modal">
    <a href="javascript:void(0);" class="iconfont icon-back" @click="close"></a>
    <div class="title">收货地址</div>
    <div class="content">
      <div class="pop-address-wrap">
        <ul class="pop-address-list-wrap">
            <li class="address-list-cell" v-for="(address,index) in address_list">
              <div class="address-select" @click="selectAddress(address)">
                <span class="select-core" :class="address.id==active_address.id?'checked':''"></span>
              </div>
              <div class="address-info">
                <div class="adress-info-head">
                  <span class="name">{{address.consignee}}</span>
                  <span class="phone">{{address.mobile}}</span>
                </div>
                <div class="adress">{{address.address}}</div>
              </div>
            </li>
          </ul>
      </div>
    </div>
    <div class="bottom-btn-wrap">
      <a class="bottom-btn" @click="gotoAddAddress">+ 新建收货地址</a>
    </div>
  </Popup>
</template>

<script>
import { Popup } from "mint-ui";

export default {
  props:["address_list_modal","address_list","active_address"],
  components: {
    Popup:Popup,
  },
	data() {
    return {
    };
  },
  computed: {
  },
  watch: {
    address_list_modal:function(nval,oval){
      if(nval == true){
        this.init();
      }
    },
  },
  mounted() {
  },
  methods:{
    init:function(){

    },
    selectAddress:function(item){
      this.$emit('select-address',item);
    },
    close:function(){
      this.$emit('close-address-modal');
    },
    gotoAddAddress:function(){
      this.$router.push({ path:"/my/address/add"});
    },
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";
.pop-modal {
  .content {
    .pop-address-wrap {
      .pop-address-list-wrap {//优惠券弹层
        box-sizing: border-box;
        .address-list-cell {
          // margin-bottom: 0.1rem;
          position: relative;
          padding:0.24rem;
          border-bottom:1px solid @border-color;
          display:flex;
          .address-select {
            display: flex;
            align-items:center;
          }
          .address-info {
            margin-left:0.4rem;
            .adress-info-head {
              .name {
                font-size:0.34rem;
                font-weight:bold;
              }
              .phone {
                font-size:0.34rem;
                margin-left:0.4rem;
                font-weight:bold;
              }
            }
            .adress {
              margin-top:0.1rem;
              font-size:0.26rem;
            }
          }
        }
      }
    }
  }
  .bottom-btn-wrap {
    z-index: 10;
    position:absolute;
    bottom:0.2rem;
    width:100%;
    text-align:center;
    .bottom-btn {
      display: inline-block;
      height:0.8rem;
      line-height:0.8rem;
      padding:0 1.3rem;
      background:@font-color-yellow;
      color:#ffffff;
      text-align:center;
      font-size:0.3rem;
      border-radius: 0.5rem;
    }
  }
}
</style>