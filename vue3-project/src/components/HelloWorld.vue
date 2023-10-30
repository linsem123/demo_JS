
<template>
    <div @click="$emit('emitFunc','Hello!Nick')">{{props.helloMsg}}</div>
</template>
<script  setup>
import { ref } from "vue";

defineEmits({
    emitFunc: val => {
        console.log(val);
    }
});
//props声明,命名方式小驼峰
const props = defineProps({
    helloMsg: String
});
</script>
<style scoped>
</style>
