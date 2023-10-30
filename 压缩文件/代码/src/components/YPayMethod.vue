//手续费支付方式
//mode simple-选择框 complex 没实现再见
//label 左边的字
//@confirm获取选择的key
<template lang="pug">
.pay-method
  .simple.flex(v-if="mode === 'simple'" @click="showSelect = true")
    span.label {{label}}
    span.value {{type}}
    img(src="@/assets/images/common/select.png")
  .complex.flex
  van-popup(v-model="showSelect" position="bottom")
    van-picker(:columns="columns" ref="vant"  @cancel="showSelect = false" @confirm="confirm" show-toolbar)
</template>

<script>
// const citys = {
//   '浙江': ['杭州', '宁波', '温州', '嘉兴', '湖州'],
//   '福建': ['福州', '厦门', '莆田', '三明', '泉州']
// };
import _ from "lodash";
export default {
  name: "YPayMethod",
  props:['mode','label','flag'],
  
  data(){
      return{
        type: '',
        showSelect: false,
        columns:[{key: '02',text:'分期支付'},{key: '01',text:'一次性支付'}],
      //   columns: [
      //   {
      //     values: Object.keys(citys),
      //     className: 'column1'
      //   },
      //   {
      //     values: citys['浙江'],
      //     className: 'column2',
      //     defaultIndex: 2
      //   }
      // ]
    }
  },
  mounted(){
    this.init();
  },
  watch:{
    showSelect:function(){
      if(this.showSelect==true){
        setTimeout(()=>{
          let that = this;
          that.columns.forEach(function (value, index) {
           if(value.text==that.type){
             that.$refs.vant.setIndexes([index]);
           }
          });
        },0)
      }
    }
  },
  methods:{
    init(){
      _.forEach(this.columns,(item,index)=>{
        if(this.flag==item.key){
          this.type = item.text;
        }
      });
    },
    change(picker,value){
      // console.log("change value",value);
    },
    confirm(value,index){
      this.showSelect = false;
      this.type = this.columns[index].text;
      this.$emit('confirm',value.key);
    }
  }
}
</script>
<style scoped lang="stylus">
.pay-method
  width 100%
  height 0.44rem
  background #fff
  padding 0 5.3%
  box-sizing border-box
  .flex
    width 100%
    height 100%
    display flex
    align-items center
    font-size 0.15rem
    color: #000
    .label
      width 50%
    .value
      flex 1
      text-align right
    img
      width 2.4%
      margin-left 2.4%

</style>
