<template>
  <div>
    <!-- 头部 -->
    <top-head
      @go-back="goBack()"
      :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">提现</div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->

    <div class="mall-my-withdraw">
      <div class="top-blank"></div>
      
      <div class="withdraw-wrap">
        <h4 class="withdraw-title">提现金额</h4>

        <div class="withdraw-ribbon">
          <input class="ribbon-input" type="number" name="withdraw-number" v-model="withdraw_number" :placeholder="`请输入${min_money}元以上金额`" />
          <!-- <div class="error-hint">提现金额格式不正确</div> -->
        </div>

        <h4 v-if="gt_money" class="user-money red">输入金额已超过账户余额</h4>
        <h4 v-else class="user-money">账户可提取余额(元)  {{user_info.user_money}}</h4>



        <div class="remark-wrap">
          <h4 class="remark-title">提现信息(必填)</h4>
          <div class="ribbon-wrap">
            <div class="ribbon">
              <label>姓名</label>
              <input type="text" name="name" @click="clickInput('name')" @blur="inputBlurValidate('name')" v-model="info.name" placeholder="请输入持卡人姓名">
            </div>
            <div class="error-hint"  v-if="!validation.name">姓名格式不正确</div>
          </div>

          <div class="ribbon-wrap">
            <div class="ribbon">
              <label>身份证号</label>
              <input type="text" name="idno" @click="clickInput('idno')" @blur="inputBlurValidate('idno')" v-model="info.idno" placeholder="请输入持卡人身份证号">
            </div>
            <div class="error-hint"  v-if="!validation.idno">身份证号输入有误</div>
          </div>

          <div class="ribbon-wrap">
            <div class="ribbon">
              <label>手机号</label>
              <input type="text" name="phone" @click="clickInput('phone')" @blur="inputBlurValidate('phone')" v-model="info.phone" placeholder="银行卡预留手机号">
            </div>
            <div class="error-hint"  v-if="!validation.phone">手机号格式不正确</div>
          </div>

          <div class="ribbon-wrap">
            <div class="ribbon">
              <label>银行卡号</label>
              <input type="number" name="card_number" @click="clickInput('card_number')" @blur="inputBlurValidate('card_number')" v-model="info.card_number" placeholder="请认真核对银行卡号">
            </div>
            <div class="error-hint"  v-if="!validation.card_number">银行卡号格式不正确</div>
          </div>

          <!-- <div class="ribbon-wrap">
            <div class="ribbon" @click="showAddressPicker">
              <label>开户地址</label>
              <input type="text" disabled name="address" v-model="info.address" placeholder="请选择开户行地址">
            </div>
            <div class="error-hint"  v-if="!validation.branch">开户行格式不正确</div>
          </div> -->

          <!-- <div class="ribbon-wrap">
            <div class="ribbon">
              <label>开户行</label>
              <select class="ribbon-select" v-model="info.branch">
                <option value="-1">请选择此银行卡开户行</option>
                <option v-for="branch in branch_list"></option>
              </select>
              <span class="iconfont icon-xiangxia1"></span>
            </div>
            <div class="error-hint"  v-if="!validation.branch">开户行格式不正确</div>
          </div> -->

          
        </div>

        <div class="warm-tip">
          <h4>温馨提示：</h4>
          <p>1:到账时间：不同银行系统转账速度稍有不同，一般为1-3个工作日内；<span class="bold">在双休日和法定节假日期间，用户可以申请提现，黄金象将在节假日后的工作日进行处理。</span></p>
          <!-- <p>2:为避免提现失败，请确保您的银行卡卡号、银行卡支行信息、持卡人姓名正确无误。</p> -->
          <p>2:如需帮助，请联系人工客服 <a :href="'tel:'+guest_phone">400-821-0704</a>  （工作日9:00-12:00；13:00-17:00），或在官方微信公众号【黄金象】留言，我们将尽快与您联系。</p>
        </div>
      </div>

      <div class="zhanwei"></div>
  	</div>
    
    <div class="bottom-wrap">
      <a class="bottom-btn" :class="!can_pay?'disable':''" @click="submit">提交</a>
    </div>

    <!-- <div v-show="show_address_picker" class="address-picker-wrap">
      <div class="address-picker-wrap-mask"></div>
      <div class="address-picker-unit" :class="{'show':show_address_picker}">
        <span class="iconfont icon-close" @click="closeAddressPicker()"></span>
        <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
        <div class="address-picker-btn-wrap">
          <a href="javascript:;" class="address-picker-btn confirm" @click="confirmAddressPicker()">确定</a>
        </div>
      </div>
    </div> -->

  </div>
</template>

<script>
import topHead from "@/views/components/TopHead.vue";
import constants from "@/assets/js/constants.js";
import {
	Toast,
	MessageBox,
  Picker,
} from 'mint-ui';

export default {
	components:{
    topHead:topHead,
    mtPicker: Picker
	},
	data(){
	  return {
      mall_token:"",
      user_info: {},
	  	withdraw_number:"",
      min_money:20,
      info:{
        name:"",
        idno:"",
        card_number:"",
        phone:"",
        // branch:"-1",
        // address:"",
      },
      validation:{
        name:true,
        idno:true,
        card_number:true,
        phone:true,
        // branch:true,
        // address:true,
      },

      // branch_list:[],
      // bankinfo:{},


      ////////////////////////联动
      // show_address_picker: false,
      // picker:null,

      // address_detail:{
      //   province:"",
      //   province_name:"",
      //   city:"",
      //   city_name:"",
      //   district:"",
      //   district_name:"",
      // },

      // province:{
      //   id:undefined,
      //   name:undefined,
      // },
      // city:{
      //   id:undefined,
      //   name:undefined,
      // },
      // district:{
      //   id:undefined,
      //   name:undefined,
      // },

      // province_arr:[],
      // city_arr:[],
      // district_arr:[],

      // slot_province_arr:[],
      // slot_city_arr:[],
      // slot_district_arr:[],

      // slots: [
      //   {
      //     flex: 1,
      //     values: [],
      //     className: 'slot1',
      //     textAlign: 'center'
      //   },
      //   {
      //     divider: true,
      //     content: '-',
      //     className: 'slot2'
      //   },
      //   {
      //     flex: 1,
      //     values: [],
      //     className: 'slot3',
      //     textAlign: 'center'
      //   },
      //   {
      //     divider: true,
      //     content: '-',
      //     className: 'slot4'
      //   },
      //   {
      //     flex: 1,
      //     values: [],
      //     className: 'slot5',
      //     textAlign: 'center'
      //   }
      // ],
      ////////////////////////联动
      ///
      ///
      ///
		}	
	},
  computed: {
    gt_money(){
      var gt_money = false;
      if(Number(this.withdraw_number) > Number(this.user_info.user_money)){
        gt_money = true;
      }else{
        gt_money = false;
      }

      return gt_money;
    },
    guest_phone(){
      return this.$store.getters.getGuestPhone;
    },
    // mall_token(){
    //   return utils.storageGet("mall_token");
    // },
    // mall_uid(){
    //   return utils.storageGet("mall_uid");
    // },
    can_pay(){
      var me = this,
          res = false;

      if(new RegExp(constants.FORM_REG["money"],'g').test(this.withdraw_number) && Number(this.withdraw_number) >= this.min_money){
        res = true;
      }else{
        res = false;
      }
      return res;
    },
  },
	mounted(){
    // this.init();
	},
  watch: {
    province: {
      handler: function(nval, oval) {
        // console.log("nval:",nval,"oval:",oval)
        var me = this,
          // id = me.address_detail.province;
          id = _.result(
            _.find(me.province_arr, function(o) {
              return o.name == nval.name;
            }),
            "id"
          );

        if (!_.isEqual(nval, oval)) {
          this.getMallShopRegion("", id, function(data) {
            me.city_arr = data.regions;
            me.slot_city_arr = me.city_arr.map(function(item) {
              return item.name;
            });

            if (me.picker) {
              me.picker.setSlotValues(1, me.slot_city_arr);
              me.picker.setSlotValue(1, me.address_detail.city_name);
            }
          });
        }
      },
      immediate: true
    },
    city: {
      handler: function(nval, oval) {
        // console.log("citynval:",nval,"cityoval:",oval)
        var me = this,
          // id = me.address_detail.city;
          id = _.result(
            _.find(me.city_arr, function(o) {
              return o.name == nval.name;
            }),
            "id"
          );
        if (!_.isEqual(nval, oval)) {
          this.getMallShopRegion("", id, function(data) {
            me.district_arr = data.regions;
            me.slot_district_arr = me.district_arr.map(function(item) {
              return item.name;
            });

            if (me.picker) {
              me.picker.setSlotValues(2, me.slot_district_arr);
              me.picker.setSlotValue(2, me.address_detail.district_name);
            }
          });
        }
      },
      immediate: true
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.init();
    })
  },
	methods:{
    init: function() {
      this.mall_token = utils.storageGet("mall_token");
      this.getUserInfo();
      this.getBankInfo();
    },

    /*******************获取用户银行卡信息*********************/
    getBankInfo:function(){
      var me = this;
      utils.API.goldbag_user_account_bankinfo({
        data: {
          token: me.mall_token,
        }
      })
      .then(function(ret) {

        me.info = _.assign(me.info,{
          name:ret.model.data.user_name||"",
          idno:ret.model.data.id_card||"",
          card_number:ret.model.data.bank_card||"",
          phone:ret.model.data.mobile_phone||"",
          // branch:ret.model.data.bank_branch_name||"-1",
        });
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    /*******************获取用户银行卡信息*********************/

    getUserInfo: function() {
      var me = this;
      utils.API.user_info({
        data: {
          token: me.mall_token,
        }
      })
      .then(function(ret) {
        me.user_info = _.assign({}, me.user_info, ret.model.data);
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    validate:function(key){
      var success = new RegExp(constants.FORM_REG[key],'g').test(_.trim(this.info[key]));

      if(key == "idno" && success){
        success = utils.identityCodeValid(_.trim(this.info[key])).success;
      }
      return success;
    },
    clickInput:function(key){
      this.validation[key] = true;
    },
    inputBlurValidate:function(key){//表单输入框在blur时验证格式
      this.validation[key] = this.validate(key);
    },
    userAccountRaply:function(cb){//会员提现申请
      var me = this;

      utils.API.goldbag_user_account_raply({
        show_loading:true,
        data: {
          "token" : me.mall_token,
          "amount" : _.trim(me.withdraw_number),

          "bank_card":_.trim(me.info.card_number),
          "id_card":_.trim(me.info.idno),
          "mobile_phone":_.trim(me.info.phone),
          "user_name":_.trim(me.info.name),
          // "bank_branch_name":

          "note" : `用户姓名:${me.info.name};身份证号:${me.info.idno};银行卡号:${me.info.card_number};用户手机号:${me.info.phone}`,  
        }
      })
      .then(function(ret) {
        cb&&cb(ret);
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    submit:function(){
      var me = this;

      if(!this.can_pay){
        return;
      }

      var success = true;
      _.forOwn(this.info, function(value, key) {
        var res = me.validate(key);
        me.validation[key] = res;
        if(!res){
          success = false;
        }
      });

      if(!success){//表单输入格式验证
        return;
      }

      if(Number(this.user_info.user_money) <= 0 || Number(this.user_info.user_money) < Number(this.withdraw_number)){
        Toast("您的账户余额不足，无法提现！")
        return;
      }

      MessageBox({
        title: "",
        message: "确认提交提现申请吗？",
        showCancelButton: true
      }).then(function(action) {
        if(action === "confirm") {
          me.userAccountRaply(function(ret){
            MessageBox({
              title: "",
              message: "您的提现申请已成功提交，请等待管理员的审核！",
            }).then(function(action) {
              if(action === "confirm") {
                me.goBack();
              }else{

              }
            });
          }) 
        }else{

        }
      }); 
    },
	  goBack:function(){
			this.$router.goBack();
		},
    redirect: function(url){
      this.$router.push({path: url})
    },


    /****************地址选择器相关********************/
    // confirmAddressPicker:function(){
    //   var _this = this;
    //   if(!this.province.name || !this.city.name || !this.district.name){
    //     Toast("请正确选择省市区！")
    //     return;
    //   }
    //   this.info.address = this.province.name + this.city.name + this.district.name;

    //   this.address_detail = _.assign(this.address_detail,{
    //     province:_this.province.id,
    //     province_name:_this.province.name,
    //     city:_this.city.id,
    //     city_name:_this.city.name,
    //     district:_this.district.id,
    //     district_name:_this.district.name,
    //   })

    //   this.closeAddressPicker();
    // },
    // showAddressPicker:function(){
    //   var _this = this;

    //   _this.getMallShopRegion(1,"",function(data){
    //     _this.province_arr = data.regions;

    //     _this.slot_province_arr = _this.province_arr.map(function(item){
    //       return item.name;
    //     });

    //     if(_this.picker){
    //       _this.picker.setSlotValues(0, _this.slot_province_arr);
    //       _this.picker.setSlotValue(0,_this.address_detail.province_name);
    //     }

    //     _this.show_address_picker = true;
    //   });

    // },
    // closeAddressPicker:function(){
    //   this.show_address_picker = false;
    // },
    // onValuesChange(picker, values) {
    //   var _this = this;
    //   !this.picker&&(this.picker = picker);
    //   // console.log(values)

    //   _this.province = _.assign({},_this.province,{
    //     id:_.result(_.find(_this.province_arr, function(o) { return o.name == values[0]; }),"id"),
    //     name:values[0]
    //   });

    //   _this.city = _.assign({},_this.city,{
    //     id:_.result(_.find(_this.city_arr, function(o) { return o.name == values[1]; }),"id"),
    //     name:values[1]
    //   });

    //   _this.district = _.assign({},_this.district,{
    //     id:_.result(_.find(_this.district_arr, function(o) { return o.name == values[2]; }),"id"),
    //     name:values[2]
    //   });

    // },
    // getMallShopRegion:function(type,parent_id,cb){
    //   utils.API.shop_region({
    //     data:{
    //       type:type,//0，1，2，3（1：省/市，2：市，3：区/县）
    //       parent_id:parent_id,
    //     }
    //   })
    //   .then(function (ret) {
        
    //     cb&&cb(ret.model.data);
    //     // _this.$store.commit('setShopCategory',ret.model.data);
    //     // console.log("_this.category:",_this.category)
    //   })
    //   .catch(function(ret){
    //     !ret.__servererror__ && Toast(ret.errorMessage||"未知错误！");
    //   });
    // },
    /****************地址选择器相关********************/
	}
};

</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";

.mall-my-withdraw{
	width: 100vw;
  height: 100vh;
  overflow-y: auto;
  // position: absolute;
  background:#ffffff;

  .withdraw-wrap {
    padding:0 0.35rem;
    box-sizing: border-box;
    .withdraw-title {
      padding:0.2rem 0;
      font-size:0.3rem;
      font-weight:normal;
    }
    .withdraw-ribbon {
      .ribbon-input {
        width:100%;
        box-sizing:border-box;
        padding:0.2rem;
        height:0.8rem;
        line-height:0.8rem;
        font-size:0.3rem;
        border:1px solid @border-color;
      }
      .error-hint {
        color:@error-color;
        text-align:right;
      }
    }
    .user-money {
      margin-top:0.1rem;
      font-size:0.26rem;
      color:@yellow;
      font-weight:normal;
      &.red {
        color:@red;
      }
    }
    .tip-wrap {
      margin-top:0.45rem;
      font-size:0.28rem;
      color:@font-gray-color;
    }
  }

  .remark-wrap {
    margin-top:0.3rem;
    .remark-title {
      font-size:0.3rem;
      margin-bottom:0.4rem;
    }
    .ribbon-wrap {
      margin-bottom:0.4rem;
      &:last-child {
        margin-bottom:0;
      }
      .ribbon {
        display:flex;
        justify-content:space-between;
        align-items:center;
        position: relative;
        label {
          font-size:0.3rem;
        }
        input {
          box-sizing:border-box;
          font-size:0.3rem;
          width:5.25rem;
          height:0.88rem;
          line-height:0.88rem;
          border:1px solid @border-color;
          padding:0 0.2rem;
          &[disabled] {
            background: #ffffff;
            color:@base-gray-color;
          }
        }
        .form-normal {
          font-size:0.3rem;
          width:5.25rem;
          height:0.88rem;
          border:1px solid @border-color;
          padding:0 0.2rem;
          background: #ffffff;
          box-sizing: border-box;
        }
        .ribbon-select {
          font-size:0.3rem;
          width:5.25rem;
          height:0.88rem;
          border:1px solid @border-color;
          padding:0 0.2rem;
          background: #ffffff;
        }
        .iconfont {
          font-size:0.24rem;
          color:#c6c6c6;
          position: absolute;
          right:0.1rem;
        }
      }
      .error-hint {
        color:@error-color;
        text-align:right;
      }
    }
  }

  .warm-tip {
    margin-top:0.2rem;
    h4 {
      font-style: normal;
      color:@font-gray-color;
      margin-bottom:0.1rem;
    }
    p{
      font-size:0.24rem;
      color:@font-gray-color;
      margin-bottom:0.1rem;
      .bold {
        color:@font-color;
      }
    }
    a {
      color:@font-gray-color;
    }
  }

  .zhanwei {
    height:1.2rem;
  }
}

.bottom-wrap {
  position: absolute;
  z-index:1;
  bottom:0;
  display: flex;
  width: 100%;
  justify-content: space-between;
  background: #ffffff;
  align-items: center;

  .bottom-btn {
    font-size:0.4rem;
    font-weight:bold;
    color:#ffffff;
    background:@yellow;
    text-align:center;
    width:100%;
    height:1.1rem;
    line-height:1.1rem;
    &.disable {
      background:@yellow-disable;
    }
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
    background: #000000;
    opacity: 0.4;
  }
  .address-picker-unit {
    width: 100%;
    background: #ffffff;
    padding: 0.4rem 0.2rem;
    position: absolute;
    bottom: -40%;
    height: 40%;
    z-index: 30;
    box-sizing: border-box;
    transition: all 0.3s;
    &.show {
      bottom: 0;
    }
    .icon-close {
      position: absolute;
      top: 0.2rem;
      right: 0.2rem;
      font-size: 0.28rem;
      z-index: 100;
    }
    .picker {
      .picker-item {
        font-size: 0.32rem;
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

</style>