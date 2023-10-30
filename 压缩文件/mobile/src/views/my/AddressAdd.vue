<template>
  <div>
    <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">新建地址</div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->


    <div class="mall-add-address">
      <div class="top-blank"></div>
      <!-- 地址信息 -->
      <div class="address-info-wrap">
        <ul class="address-info">
          <li class="address-info-cell">
            <label>收货人:</label>
            <input autocomplete="off" class="address-name" type="text" name="" @click="restValidation('consignee')" @blur="inputBlurValidate('consignee')" v-model="info_data.consignee">
            <div v-if="!validation.consignee" class="error-hint">收货人格式不正确</div>
          </li>
          <li class="address-info-cell">
            <label>手机号:</label>
            <input autocomplete="off" class="address-phone" type="text" name="" @click="restValidation('mobile')" @blur="inputBlurValidate('mobile')" v-model="info_data.mobile">
            <div v-if="!validation.mobile" class="error-hint">手机号格式不正确</div>
          </li>
          <li class="address-info-cell" @click="showAddressPicker()">
            <label>省市区:</label>
            <span class="address-province fake-input" @click="restValidation('address_head_info')">{{info_data.address_head_info}}</span>
            <!-- <input v-show="show_address_picker" class="address-province" type="text" name="" v-model="info_data.address_head_info"> -->
            <div v-if="!validation.address_head_info" class="error-hint">省市区格式不正确</div>
          </li>
          <li class="address-info-cell align-top">
            <label>详细地址:</label>
            <textarea autocomplete="off" class="address-detail" @click="restValidation('address_detail')" @blur="inputBlurValidate('address_detail')" v-model="info_data.address_detail"></textarea>
            <div v-if="!validation.address_detail" class="error-hint">详细地址格式不正确</div>
          </li>
        </ul>
      </div>
      <!-- 地址信息 -->

      <!-- 设为默认 -->
      <div class="set-default-wrap">
        <p class="set-default-text">设为默认地址</p>
        <mt-switch v-model="set_default"></mt-switch>
      </div>
      <!-- 设为默认 -->


      <div v-show="show_address_picker" class="address-picker-wrap">
        <div class="address-picker-wrap-mask"></div>
        <div class="address-picker-unit" :class="{'show':show_address_picker}">
          <span class="iconfont icon-close" @click="closeAddressPicker()"></span>
          <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
          <div class="address-picker-btn-wrap">
            <a href="javascript:;" class="address-picker-btn confirm" @click="confirmAddressPicker()">确定</a>
          </div>
        </div>
      </div>
      

      <div class="btn-wrap">
        <a class="bottom-btn" href="javascript:;" @click="save()">保存</a>
      </div>
    </div>
  </div>
</template>

<script>

import topHead from "@/views/components/TopHead.vue";
import constants    from '@/assets/js/constants.js';

import {
  Toast,
  Indicator,
  Switch,
  Picker,
  MessageBox,
} from 'mint-ui';

// utils.extendApi(API);//把API扩充到utils方法里边

export default {
  components:{
    topHead:topHead,
    mtSwitch:Switch,
    mtPicker:Picker,
  },
  data(){
    return {
      tip:"点击加载更多",
      set_default:false,

      show_address_picker:false,

      address_detail:{
        province:"",
        province_name:"",
        city:"",
        city_name:"",
        district:"",
        district_name:"",
      },

      defalut_address_detail:{},

      info_data:{
        consignee:"",//收件人
        mobile:"",//手机
        address_head_info:"",//选择的省市、区县
        address_detail:"",//详细地址
      },

      validation:{
        consignee:true,
        mobile:true,
        address_head_info:true,
        address_detail:true,
      },

      // referrer:"",
      position:{
        lat:"",
        lng:"",
      },


      ////////////////////////联动
      picker:null,

      province:{
        id:undefined,
        name:undefined,
      },
      city:{
        id:undefined,
        name:undefined,
      },
      district:{
        id:undefined,
        name:undefined,
      },

      province_arr:[],
      city_arr:[],
      district_arr:[],

      slot_province_arr:[],
      slot_city_arr:[],
      slot_district_arr:[],

      slots: [
        {
          flex: 1,
          values: [],
          className: 'slot1',
          textAlign: 'center'
        },
        {
          divider: true,
          content: '-',
          className: 'slot2'
        },
        {
          flex: 1,
          values: [],
          className: 'slot3',
          textAlign: 'center'
        },
        {
          divider: true,
          content: '-',
          className: 'slot4'
        },
        {
          flex: 1,
          values: [],
          className: 'slot5',
          textAlign: 'center'
        }
        ///////////////////////////
      ],

      address_list:[],
    } 
  },
  watch:{
    province: {
      handler: function(nval, oval) {
        // console.log("nval:",nval,"oval:",oval)
        var _this = this,
          // id = _this.address_detail.province;
          id = _.result(
            _.find(_this.province_arr, function(o) {
              return o.name == nval.name;
            }),
            "id"
          );

        if (!_.isEqual(nval, oval)) {
          this.getMallShopRegion("", id, function(data) {
            _this.city_arr = data.regions;
            _this.slot_city_arr = _this.city_arr.map(function(item) {
              return item.name;
            });

            if (_this.picker) {
              _this.picker.setSlotValues(1, _this.slot_city_arr);
              _this.picker.setSlotValue(1, _this.address_detail.city_name);
            }
          });
        }
      },
      immediate: true
    },
    city: {
      handler: function(nval, oval) {
        var _this = this,
          id = _.result(
            _.find(_this.city_arr, function(o) {
              return o.name == nval.name;
            }),
            "id"
          );

        if (!_.isEqual(nval, oval)) {
          this.getMallShopRegion("", id, function(data) {
            _this.district_arr = data.regions;
            _this.slot_district_arr = _this.district_arr.map(function(item) {
              return item.name;
            });

            if (_this.picker) {
              _this.picker.setSlotValues(2, _this.slot_district_arr);
              _this.picker.setSlotValue(2, _this.address_detail.district_name);
            }
          });
        }
      },
      immediate: true
    }
  },
  mounted(){
    this.init();
  },
  methods:{
    init:function(){
      var _this = this;
      this.show_address_picker = false;
      this.info_data = _.assign(this.info_data,{
        consignee:"",//收件人
        mobile:"",//手机
        address_head_info:"",//选择的省市、区县
        address_detail:"",//详细地址
      });

      this.validation = _.assign(this.validation,{
        consignee:true,
        mobile:true,
        address_head_info:true,
        address_detail:true,
      });
    },
    validate:function(key){
      return this.validation[key] = new RegExp(constants.FORM_REG[key],'g').test(_.trim(this.info_data[key]))
    },
    restValidation:function(key){
      this.validation[key] = true;
    },
    inputBlurValidate:function(key){//表单输入框在blur时验证格式
      this.validate(key);
    },
    synchValidateAllInput:function(){//表单输入格式验证
      var _this = this,
          success = true;
      _.forOwn(_this.validation, function(value, key) {
        if(!_this.validate(key)){
          success = false;
        }
      });
      return success;
    },
    confirmAddressPicker:function(){
      var _this = this;
      if(!this.province.name || !this.city.name || !this.district.name){
        Toast("请正确选择省市区！")
        return;
      }
      this.info_data.address_head_info = this.province.name + this.city.name + this.district.name;

      this.address_detail = _.assign(this.address_detail,{
        province:_this.province.id,
        province_name:_this.province.name,
        city:_this.city.id,
        city_name:_this.city.name,
        district:_this.district.id,
        district_name:_this.district.name,
      })

      this.closeAddressPicker();
    },
    showAddressPicker:function(){
      var _this = this;

      _this.getMallShopRegion(1,"",function(data){
        _this.province_arr = data.regions;

        _this.slot_province_arr = _this.province_arr.map(function(item){
          return item.name;
        });

        if(_this.picker){
          _this.picker.setSlotValues(0, _this.slot_province_arr);
          _this.picker.setSlotValue(0,_this.address_detail.province_name);
        }

        _this.show_address_picker = true;
      });

    },
    closeAddressPicker:function(){
      this.show_address_picker = false;
    },
    onValuesChange(picker, values) {
      var _this = this;
      !this.picker&&(this.picker = picker);
      // console.log(values)

      _this.province = _.assign({},_this.province,{
        id:_.result(_.find(_this.province_arr, function(o) { return o.name == values[0]; }),"id"),
        name:values[0]
      });

      _this.city = _.assign({},_this.city,{
        id:_.result(_.find(_this.city_arr, function(o) { return o.name == values[1]; }),"id"),
        name:values[1]
      });

      _this.district = _.assign({},_this.district,{
        id:_.result(_.find(_this.district_arr, function(o) { return o.name == values[2]; }),"id"),
        name:values[2]
      });

    },
    getMallShopRegion:function(type,parent_id,cb){
      utils.API.shop_region({
        data:{
          type:type,//0，1，2，3（1：省/市，2：市，3：区/县）
          parent_id:parent_id,
        }
      })
      .then(function (ret) {
        
        cb&&cb(ret.model.data);
        // _this.$store.commit('setShopCategory',ret.model.data);
        // console.log("_this.category:",_this.category)
      })
      .catch(function(ret){
        !ret.__servererror__ && Toast(ret.errorMessage||"未知错误！");
      });
    },
    save:function(){
      var _this = this;
      if(!this.synchValidateAllInput()){//表单输入格式验证
        return;
      }

      var address_head = _this.address_detail.province_name + _this.address_detail.city_name + _this.address_detail.district_name,
          send_data = {
            "token":utils.storageGet("mall_token"),   
            "address" : {
              "consignee":_.trim(_this.info_data.consignee),
              "city":_this.address_detail.city,
              "street":_this.address_detail.district,
              "mobile":_.trim(_this.info_data.mobile),
              "address":address_head+_.trim(_this.info_data.address_detail),
              "address_info": "",
              // "location":{//暂时去掉经纬度
              //   "longitude":_this.position.lng,
              //   "latitude":_this.position.lat,
              // },
              "set_default":_this.set_default?"true":"false", 
            }
          }

      utils.API.address_add({
        data:send_data,
      })
      .then(function (ret) {
        Toast("新建地址成功！");
        setTimeout(function(){
          _this.$router.goBack();
          // _this.$router.replace({path: `/my/addresses` });
        },2000);
      })
      .catch(function(ret){
        !ret.__servererror__ && Toast(ret.errorMessage||"未知错误！");
      });
    },
    goBack:function(){
      this.$router.goBack();
      // this.$router.push({path: `/mall_mine` })
    },
  }
};

</script>

<style lang="less" scoped>

@import "~@/assets/less/variable.less";

.mall-add-address{
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  // position: absolute;

  .address-info-wrap {
    padding:0.24rem;
    background:#ffffff;
    .address-info {
      .address-info-cell {
        font-size:0.28rem;
        line-height: 0.28rem;
        padding:0.2rem 0;
        border-bottom: 1px solid #DEDEDE;
        display: flex;
        align-items: center;
        position: relative;
        &:last-child {
          border-bottom: none;
        }
        &.align-top {
          display: flex;
          align-items: start;
        }
        label {
          width: 1.5rem;
        }
        input,.fake-input {
          padding:0 0.2rem;
          width: 5rem;
          height: 0.52rem;
          line-height: 0.52rem;
          display: inline-block;
          border:none;
        }
        textarea {
          vertical-align: top;
          width: 5rem;
          padding:0 0.2rem;
          resize: none;
          border:none;
        }
        .error-hint {
          position: absolute;
          right: 0;
          bottom:0;
          color:@red;
          font-size:0.24rem;
          // display:none;
        }
      }
    }
  }

  .set-default-wrap {
    margin-top: 0.2rem;
    padding:0.24rem;
    display: flex;
    justify-content:space-between;
    align-items: center;
    background:#ffffff;
    .set-default-text {
      font-size:0.28rem;
    }
  }

  .address-picker-wrap {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 10;
    .address-picker-wrap-mask {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 20;
      background:#000000;
      opacity: 0.4;
    }
    .address-picker-unit {
      width: 100%;
      background:#ffffff;
      padding:0.4rem 0.2rem;
      position: absolute;
      bottom:-40%;
      height: 40%;
      z-index: 30;
      box-sizing: border-box;
      transition: all 0.3s;
      &.show{
        bottom:0;
      }
      .icon-close {
        position: absolute;
        top:0.2rem;
        right: 0.2rem;
        font-size: 0.28rem;
        z-index: 100;
      }
      .picker {
        .picker-item {
          font-size: 0.32rem;
          .picker-center-highlight {
            z-index: -1;
          }
          .picker-slot-wrapper {

          }
        }
      }
      .address-picker-btn-wrap {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        text-align: center;
        margin-top: 0.4rem;
        .address-picker-btn {
          display: inline-block;
          width: 5rem;;
          height: 0.6rem;
          text-align: center;
          line-height: 0.6rem;
          background:@font-color-yellow;
          color:#ffffff;
          font-size: 0.32rem;
          font-weight: bold;
          border-radius: 0.5rem;
          margin-bottom:0.1rem;
        }
      }
    }
  }


  .btn-wrap {
    position: fixed;
    text-align: center;
    bottom:0;
    z-index: 5;
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
}

</style>