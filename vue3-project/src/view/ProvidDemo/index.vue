<template>
    <div>
        <button @click="updateMsg">button</button>
        <Child />
    </div>
</template>
<script setup>
import { provide, ref } from "vue";
import Child from "./components/Child.vue";
const msg = ref("hello");
provide(/* 注入名 */ "message", /* 值 */ { msg, updateMsg });
function updateMsg() {
    msg.value = "South Pole";
}
</script>

