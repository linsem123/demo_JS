<template>
    <div>
        <van-popup v-model="showPick" position="bottom">
            <van-picker ref="vant" :columns="columns" @cancel="cancel" @confirm="confirm" show-toolbar></van-picker>
        </van-popup>
    </div>
</template>
<script>
export default {
    name:"ylPicker",
    props:["showPick","columns","text"],   //columns [{text:"",key:""}]
    data(){
        return{}
    },
    methods:{
        cancel(){
            this.$emit("cancel");
        },
        confirm(value,index){
            let obj = {text:this.columns[index].text,key:value.key};
            this.$emit('confirm',obj);
        }
    },
    watch:{
        showPick:function(){
            if(this.showPick){
                setTimeout(()=>{
                    let that = this;
                    that.columns.forEach(function (value, index) {
                        if(that.text){
                            if(value.text==that.text){
                                that.$refs.vant.setIndexes([index]);
                            }
                        }
                    });
                },0)
            }
        }
    }
}
</script>
<style scoped>

</style>
