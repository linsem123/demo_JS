<template>
    <div id="smsCode" data-flag="flag_two">
		<div class="smstxt">
			<span>向右拖动滑块填充拼图</span>
			<span id="smsimg" @click="changetu"></span>
		</div>
		<div class="filter">
			<div class="move">
				<div id="img">
					<img  alt="" id="big" :src="hdata.bimgSrc">
					<img  alt="" id="tar" :src="hdata.timgSrc">
				</div>
			</div>
		</div>
		<div class="xy_control">
			<div class="xy_bar"></div>
			<div id="arrow" >
				<span class="s1"></span>
				<span class="s2"></span>
				<span class="s3"></span>
			</div>
		</div>
	</div>
</template>
<script>
import {mapActions,mapState} from "vuex";
import api from "../api/api.js";  //调用接口
export default {
    name:"ImageCode", //滑块验证码
    data(){
        return{
            flag_two:"",
        }
    },
    computed:mapState({
        laystatu:state => state.a.home.menu.laystatu,
        imagestatu:state => state.a.home.menu.imagestatu,
        hdata:state => state.a.home.hdata,
        pdata:state => state.a.public.pdata,
        logui:state => state.a.login.logui,
        ldata:state => state.a.login.ldata
    }),
    mounted(){
        this.bindEvents();
    },
    methods:{
        bindEvents(){
            this.flag_two = this.pdata.identflag;
            var tarimg = document.getElementById("tar"); //小图
            var arrow = document.getElementById("arrow");; //滑块
            var bigimg = document.getElementById("big"); //总长
            var originX, originY,moveX,moveY, isTouchStart = false;
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
                    this.$store.dispatch('sendphonelen',{
                        sendlen:moveX,
                        flag_two:this.flag_two,
                        logui:this.logui
                    });
                    tarimg.style.left=0;
                    arrow.style.left=0;
                }
            });
        },
        changetu(){
            this.flag_two = this.pdata.identflag;
            this.$store.dispatch('changephone',{
                ldata:this.ldata,
                flag_two:this.flag_two,
                logui:this.logui,
            })
        }
    }
}
</script>

<style scoped>
#smsCode{position: fixed;left: 50%;top: 50%;transform: translate(-50%,-50%);z-index: 300;background: #fff;padding: 0 0.1rem;
border: 0.01rem solid #999;border-radius: 0.04rem;}
.smstxt{font-size: 0.1rem;height: 0.2rem;line-height: 0.2rem;}
#smsimg{position: absolute;width: 0.12rem;height:0.12rem;right: 0.1rem;top: 0.04rem;background:url("../assets/images/update.png") no-repeat;
background-size: 100% 100%;}
.filter{top:0;left:0;width:100%;height:150px;}
.move{width: 250px;height:150px;left:0;right:0;top:0;bottom: 0;margin:auto;}
.move #img{height:150px;position: relative;}
.move #img #big{display: block;width:250px;height:100%;z-index: 600;}
.move #img #tar{position: absolute;top:0;height:100%;width:50px;z-index: 700;}
.xy_bar{width: 100%;height: 13px;border-radius: 7px;background: #e4e4e4;position: relative;top: 16px;}
#arrow{width: 50px;height: 30px;position: relative;top: -5px;background: rgb(26,101,255);
border-radius: 30px;text-align: center;}
#arrow span{display: inline-block;width: 2px;height: 16px;background: #fff;position: relative;top: 6px;}
.s1{margin-right: 1px;}
.s2{margin-right: 1px;}
</style>
