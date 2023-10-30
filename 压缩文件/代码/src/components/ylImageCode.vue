<template>
    <div id="imgCode">
        <div class="img_main">
            <div class="img_title">
                <span>向右拖动滑块填充拼图</span>
                <span class="img_fresh" @click="freshImgCode"></span>
            </div>
            <div class="img_body">
                <img  alt="" class="img_big" ref="bigImg" :src="bigImgSrc">
                <img  alt="" class="img_tar" ref="tarImg" :src="tarImgSrc">
            </div>
            <div class="img_control">
                <div class="img_bar"></div>
                <div class="img_arrow" ref="arrow">
                    <span class="s1"></span>
                    <span class="s2"></span>
                    <span class="s3"></span>
                </div>
            </div>
        </div>
	</div>
</template>
<script>
import {mapActions,mapState} from "vuex";
export default {
    name:"ImageCode", //滑块验证码
    props:["bigImgSrc","tarImgSrc"],
    data(){
        return{
        }
    },
    computed:mapState({}),
    mounted(){
        this.bindEvents();
    },
    methods:{
        bindEvents(){
            let tarimg = this.$refs.tarImg; //小图
            let bigimg = this.$refs.bigImg; //大图总长
            let arrow = this.$refs.arrow;   //滑块
            let originX, originY,moveX,moveY, isTouchStart = false;
            moveX = 0;
            arrow.addEventListener("touchstart",(e)=> {
                originX = e.targetTouches[0].pageX;
            })
            arrow.addEventListener("touchmove",(e)=>{
                moveX = e.targetTouches[0].pageX - originX;
                if (moveX < 0 || (moveX+50) >= 250) return false;
                arrow.style.left = moveX + 'px';
                tarimg.style.left = moveX + 'px';
            },false);
            arrow.addEventListener("touchend",(e)=>{
                if(isTouchStart){
                    return false;
                }else{
                    isTouchStart=true;
                    this.$emit("checkImgCode",moveX)
                }
            });
        },
        freshImgCode(){
            this.$emit("freshImgCode");
        }
    }
}
</script>

<style scoped>
#imgCode{
    position:fixed;
    left:0;top:0;
    width:100%;
    height:100%;
    background: rgba(0,0,0,0.4);
}
.img_main{
    position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);
    width:2.5rem;background: #fff;
    border: 0.01rem solid #C1C7D3;
    border-radius: 0.04rem;
}
.img_title{font-size: 0.12rem;height: 0.24rem;line-height: 0.24rem;}
.img_fresh{position: absolute;width: 0.12rem;height:0.12rem;right: 0.1rem;top: 0.06rem;
    background:url("../assets/images/update.png") no-repeat;background-size: 100% 100%;
}
.img_body{width:100%;height:1.5rem;position: relative;}
.img_big{display: block;width:2.5rem;height:1.5rem;}
.img_tar{position: absolute;top:0;left:0;height:100%;width:0.5rem;z-index: 700;}
.img_control{
    position: relative;
    height:0.4rem;
    background: #fff;
}
.img_bar{width: 100%;height: 0.14rem;border-radius: 0.7rem;background: #e4e4e4;position: absolute;top:0.13rem;left:0;}
.img_arrow{width: 0.5rem;height: 0.3rem;position: absolute;top: 0.05rem;background: rgb(26,101,255);
border-radius: 0.3rem;text-align: center;}
.img_arrow span{display: inline-block;width: 0.02rem;height: 0.16rem;background: #fff;position: relative;top: 0.06rem;}
.s1{margin-right: 0.01rem;}
.s2{margin-right: 0.01rem;}
</style>
