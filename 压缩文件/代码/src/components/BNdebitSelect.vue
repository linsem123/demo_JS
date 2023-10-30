// 借记卡选择框
// nocard 无借记卡
// hascard 有借记卡
// skip 跳转路径
// bankName 借记卡名称
// bankNum 借记卡卡号
// debitList 借记卡数组
// getdebitcard 切换借记卡
// deleteCard 删除借记卡
// choseShow 选中状态--当前选中的信用卡对应的索引，当切换信用卡时，保留被切换到的信用卡的索引，建议把此值放在state中保存
<template lang="pug">
  <div id="debit"> 
    <div class="lend-content">
      <div class="lend-cell clear" v-show="nocard" @click="goAdd">
        <div class="cell-left"><label for="addAmount">收款账户</label></div>
        <div class="cell-middle">
          <input type="text" id='addAmount' readonly="readonly" placeholder="添加借记卡" />
        </div>
        <div class="cell-right">
          <img src="@/assets/images/lendcash/arrow.png" alt="">
        </div>
      </div>
      <div class="lend-cell clear" v-show="hascard" @click="selectDebit">
        <div class="cell-left"><label for="amount">收款账户</label></div>
        <div class="cell-middle">
          <input type="text"  id='bankName' v-model="bankName" readonly="readonly"  ref="bankName" />
        </div>
        <div class="cell-right">
          <img src="@/assets/images/lendcash/arrow.png" alt="">
        </div>
      </div>
      <div class="lend-cell clear te2"  v-show="hascard" @click="selectDebit">
        <div class="cell-middle te">
          <input type="text" id='bankNum' v-model="bankNum" readonly="readonly" ref="bankNum"/>
        </div>        
      </div>
    </div>
    <div class="debitcard-select" v-show="debitShow">
      <div class="select-title clear">
          <a href="javascript:;" id="cancel" @click="Cancel">取消</a>
          <a href="javascript:;" id="edit" @click="Edit" v-show="editShow">编辑</a>
          <a href="javascript:;" id="finish" @click="Finish" v-show="finishShow">完成</a>
          <span>选择借记卡</span>
      </div>
      <ul class="select-list">
          <li v-for="(item,index) in debitList" :key="index" @click="changeChosed(item,index)" class="clear">
              <p class="debitcard-txt">
                <span class="fakeDebitName">{{item[1].length>11?item[1].slice(0,11)+"...":item[1]}}</span>
                <span class="fakeDebitNo">({{item[0].slice(item[0].length-4,item[0].length)}})</span>
              </p>
              <img src="@/assets/images/chose.png" alt="" v-show="choseShow==index" class="chosed">
              <img src="@/assets/images/remove.png" alt="" class="removed" v-show="removeShow" @click="Remove(index,item[0])">
          </li>
      </ul> 
      <div class="addcard" @click="Addcard">
        <img src="@/assets/images/add.png" alt="" class="addfile" />
        <span class="addtxt">添加借记卡</span>
        <img src="@/assets/images/arrow.png" alt="" class="addarrow" />
      </div>
    </div>
    <div class="deb-remind" v-show="deleteShow">
      <p>确认删除该张借记卡吗？</p>
      <div class="btn">
        <span id="btn-cancel" class="btn2" @click="btnCancel">取消</span><span id="btn-confirm" @click="btnConfirm">确定</span>
      </div>
    </div>
    <div class="layer" v-show="layShow"></div>
  </div>  
</template>

<script>
import _ from "lodash";
export default {
  name: "BYdebitSelect",
  props: ['nocard','hascard','skip','bankName','bankNum','debitList','choseShow'],
  data(){
    return{
      debitShow:false,
      removeShow:false,
      editShow:true,
      finishShow:false,
      layShow:false,
      deleteShow:false  
    }
  },
  methods: {
    goAdd(){          // 跳转新增借记卡
      this.$router.push({path:this.skip});
      // this.$emit("goAdd");
    },
    selectDebit(){   // 显示借记卡列表
      this.layShow = true;
      this.debitShow = true;
      this.$emit("selectDebit");
    },
    Cancel(){         // 取消按钮
      this.layShow = false;
      this.debitShow = false;
      this.removeShow = false;
      this.$emit("debCancel");
    },
    Edit(){           // 编辑按钮
      this.editShow = false;
      this.finishShow = true;
      this.removeShow = true;
    },
    Finish(){         // 完成按钮
      this.editShow = true;
      this.finishShow = false;
      this.removeShow = false;
      this.layShow = false;
      this.debitShow = false;
      this.$emit("debFinish");
    },
    changeChosed(item,index){     // 选择借记卡
      _.forEach(this.debitList,(item2,i) => {
        if(index==i){
          // this.choseShow = index;
          this.$emit("getdebitcard",{"data":item2,"debitIndex":index}); // 返回被选中的借记卡信息
        }
      });
      if(this.removeShow!=true){
        this.layShow = false;
        this.debitShow = false;
      }
    },
    Remove(index,item){
      this.deleteShow = true;
      this.$emit("deleteCard",{"cardIndex":index,"cardNum":item});
    },
    Addcard(){        // 新增借记卡
      this.$router.push({path:this.skip});
      this.layShow = false;
      this.debitShow = false;
    },
    // 取消删除借记卡操作提示
    btnCancel(){
      this.deleteShow = false;
    },
    // 确定删除借记卡操作提示
    btnConfirm(){
      this.deleteShow = false;
      this.$emit("btnConfirm");
    },
  }
}
</script>

<style scoped>
/* 添加借记卡 */
.lend-content{padding:0.2rem 5.3%;box-sizing: border-box;}
.lend-content .lend-cell{height: 0.24rem;line-height: 0.24rem;position: relative;margin-bottom: 0.05rem;}
.lend-content .cell-left{width:0.6rem;font-size: 0.15rem;float: left;}
.lend-content .cell-middle{display: inline-block;position: absolute;right: 0.2rem;}
.lend-content .cell-middle input{border:none;;font-size: 0.15rem;text-align: right;height: 0.24rem;line-height: 0.24rem;width:1.8rem;}
.lend-content .cell-middle.te{margin-left: 0.9rem;}
.lend-content .cell-middle.te input{width: 2rem;}
.lend-content .cell-right{float: right;}
.lend-content .cell-right img{width:0.071rem;position: relative;top: -0.02rem;}
.lend-content .lend-cell.te2{margin:0;}
/* 借记卡列表 */
.debitcard-select {background: #fff;width: 100%;height: 2.66rem;z-index: 600;position: absolute;bottom: 0;color: #333;}
.debitcard-select .select-title {height: 0.5rem;line-height: 0.5rem;text-align: center;border-bottom: 0.01rem solid #dedede;}
#cancel {position: absolute;left: 0.2rem;font-size: 0.15rem;color: #999;letter-spacing: 0.0018rem;}
#edit {position: absolute;right: 0.2rem;font-size: 0.15rem;color: #0060f1;letter-spacing: 0.0018rem;}
#finish {position: absolute;right: 0.2rem;font-size: 0.15rem;color: #0060f1;letter-spacing: 0.0018rem;}
.select-title span {font-size: 0.17rem;color: #333;}
.select-list{height: 1.28rem;overflow: scroll;}
.select-list li {height: 0.63rem;line-height: 0.63rem;border-bottom: 0.01rem solid #eaeaea;position: relative;}
.logo{width: 0.28rem;position: relative;left: 0.3rem;}
.debitcard-txt {display: inline-block;width: 3rem;margin-left: 0.2rem;font-size: 0.15rem;}
.layer {width: 100%;height: 100%;z-index: 100;position: fixed;top: 0;left: 0;display: block;background: #000;opacity: 0.4}
.removed{width: 0.19rem;position: absolute;top:0.23rem;right: 0.25rem;}
.chosed {width: 0.15rem;position: absolute;top:0.25rem;right: 0.27rem;}
.addcard{height: 0.21rem;line-height: 0.21rem;margin: 0.2rem 0;position: relative;}
.addfile{width: 0.24rem;position: relative;left: 0.2rem;top: -0.03rem;}
.addtxt{font-size: 0.15rem;margin-left: 0.3rem;width:2.23rem;display: inline-block;}
.addarrow{width: 0.072rem;position: absolute;top: 0.05rem;right: 0.27rem;}
/* 借记卡删除 */
.deb-remind{position: absolute;top: 2.29rem;width:2.71rem;left: 13.9%;height: 1.07rem;background: #FFFFFF;border-radius: 0.1rem;
z-index:999;}
.deb-remind p{padding:0.2rem 0;font-size: 0.16rem;height: 0.22rem;line-height: 0.22rem;text-align: center;border-bottom: 0.01rem solid #EAEAEA;}
.btn{height: 0.44rem;line-height: 0.44rem;font-size: 0.16rem;color: #0060F1;}
#btn-cancel{width:1.35rem;display: inline-block;text-align: center;border-right: 0.01rem solid #EAEAEA;}
#btn-confirm{width:1.35rem;display: inline-block;text-align: center;}
</style>
