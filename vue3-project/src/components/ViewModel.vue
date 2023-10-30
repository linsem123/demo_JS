
<template>
    <!-- 透传的attributes可以在模板的表达式中直接用 $attrs 访问到，prop和接收emit的事件不会被偷传 -->
    <!-- {{$attrs}} -->
    <div v-bind="$attrs">{{props.num}}</div>
    <button @click="checkMax()">+1</button>
</template>
<script  setup>
import { ref, useAttrs } from "vue";
//组件实现v-model
const emit = defineEmits(["update:num"]);
const props = defineProps({ num: Number, numModifiers: { default: () => ({}) } });

function checkMax() {
    console.log(props);
    //自定义修饰符功能
    if (props.numModifiers.maxnum) {
        props.num < 5 ? emit("update:num", props.num + 1) : null;
    } else {
        emit("update:num", props.num + 1);
    }
}
//访问一个组件的所有透传 attribute
console.log(useAttrs());
</script>
<style scoped>
</style>
