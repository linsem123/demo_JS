// 申请失败弹框
// show 控制弹框显示/隐藏 默认隐藏
// title 失败弹框标题
// msg 失败内容
// err 失败返回的错误码
// btnTxt 按钮文字
<template lang="pug">
    <div id="fail" v-show="show">
        <div class="fail">
            <div class="fail-top">
                <img src="@/assets/images/fail.png" alt="">
            </div>
            <div class="fail-title">{{title}}</div>
            <div class="fail-txt">{{msg}}</div>
            <div class="fail-err">{{err}}</div>
            <div id="confirm" @click="confirm">{{text}}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "BapplyFail",
    props: ['show','title','msg','err','btnTxt'],
    data(){
        return{
            text:"确定"
        } 
    },
    created(){
        this.text = this.btnTxt ? this.btnTxt : '确定';
    },
    methods: {
        confirm(){
            this.$emit("apllayFailBtn")
        }
    }
}
</script>

<style scoped>
#fail{width:100%;height:100%;background:rgba(0,0,0,0.4);position: fixed;left:0;top:0;}
.fail{position: absolute;width: 2.63rem;left:50%;top:50%;transform:translate(-50%,-50%); background: #FFF;text-align: center;z-index: 400;
border-radius: 0.1rem;}
.fail-top{margin:0.26rem 0 0.15rem;}
.fail-top img{width:0.38rem;}
.fail-title{font-size: 0.16rem;height: 0.22rem;line-height: 0.22rem;font-weight: 600;margin-bottom: 0.21rem;}
.fail-txt{font-size: 0.14rem;line-height: 0.2rem;width:2.16rem;color:#333;margin: 0 auto;}
.fail-err{margin:0.05rem 0 0.4rem;}
#confirm{position: relative;bottom: 0.2rem;height: 0.34rem;line-height: 0.34rem;border: 0.01rem solid #5084FF;border-radius: 0.17rem;
font-size: 0.14rem;color: #5084FF;letter-spacing: -0.0034rem;text-align: center;width: 2.16rem;left: 0.24rem;}
</style>
