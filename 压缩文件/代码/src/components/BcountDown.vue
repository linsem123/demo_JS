// 倒计时
// timeShow 控制倒计时是否显示
// countTime 倒计时时间
<template lang="pug">
    <div id="countdown" v-if="timeShow">
        <div class="count-txt">
            <span class="text">{{countText}}</span>
        </div>
    </div>
</template>
<script>
export default {
    name: "BcountDown",
    props: ['timeShow','countTime'],
    data(){
        return{
            countText:"",
            timer:""
        } 
    },
    watch:{
        timeShow(){
            if(this.timeShow==true){
                this.countText = this.countTime;
                this.autoCountDown(this.countText);
            }
            else if(this.timeShow==false){
                clearInterval(this.timer);
            }
        }
        
    },
    methods: {
        autoCountDown(n){
          
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                n--;
                this.countText = n;
                if(n<=0){
                    clearInterval(this.timer);
                    this.$emit("closeTime");
                }
            },1000); 
        }
    }
}
</script>

<style scoped>
#countdown{background: url("../assets/images/banner2.png") repeat-x center;background-size: 100% auto;
width: 100%;height: 100%;z-index: 10000;position: fixed;top: 0;left: 0;display: block;opacity: 0.8;line-height: 100%;}
#countdown .count-txt{text-align: center;color: rgb(87,116,241);font-size: 0.6rem;top:37%;position: relative;}
</style>
