//资金用途
//mode simple-选择框 complex 没实现再见
//label 左边的字
//@confirm获取选择的key
<template lang="pug">
  .fund-usage
    .simple.flex(v-if="mode === 'simple'" @click="showSelect = true")
      span.label {{label}}
      span.value {{type}}
      img(src="@/assets/images/common/select.png")
    .complex.flex
    van-popup(v-model="showSelect" position="bottom")
      van-picker(:columns="columns" ref="vant" @cancel="showSelect = false" @confirm="confirm" show-toolbar)

</template>

<script>
  export default {
    name: "YFundUsage",
    props: ['mode', 'label',"usage","columns"],
    data() {
      return {
        type: '',
        showSelect: false,
        // columns: [{key: '01', text: '家用电器消费'}, {key: '02', text: '家庭消费'}, {key: '03', text: '医疗消费'}, {
        //   key: '04',
        //   text: '购车消费'
        // }, {key: '05', text: '婚庆消费'}, {key: '06', text: '助学消费'}]
      }
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
    created(){
      this.init();
    },
    methods:{
      init(){
        _.forEach(this.columns,(item,index)=>{
          if(this.usage==item.key){
            this.type = item.text;
          }
        });
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
  .fund-usage
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
        // width 32.7%
        flex 1
        text-align right
      img
        // height 31.8%
        width 2.4%
        margin-left 2.4%
</style>
