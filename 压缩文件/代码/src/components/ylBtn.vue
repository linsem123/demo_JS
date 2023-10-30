<template>
    <div :style="{'backgroundColor':bgcolor}">
        <p @click="confirm" :style="{'backgroundColor':btnBgcolor,'margin':margin}">{{text}}</p>
    </div>
</template>
<script>
export default {
    name:"subtn",
    props:["text","bgcolor","btnBgcolor","margin"],
    data(){
        return{}
    },
    methods:{
        confirm(){
            this.$emit("confirmbtn");
        }
    }
}
</script>
<style scoped>
    p{
        border-radius: 0.22rem;
        width:89.7%;
        height:0.45rem;
        line-height: 0.45rem;
        font-size: 0.16rem;
        color: #FFFFFF;
        letter-spacing: 0.0019rem;
        text-align: center;
        margin:0 auto;
    }
</style>
