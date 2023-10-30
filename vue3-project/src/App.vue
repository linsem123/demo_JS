

<template>
    <!-- props和emit -->
    <HelloWorld hello-msg="Hello Emma" @emit-func="(val)=>returnMsg=val" />
    <div>{{returnMsg}}</div>

    <!-- 组件实现v-model -->
    <ViewModel v-model:num.maxnum="num" class="box" />
    <div>{{num}}</div>

    <!-- 插槽 -->
    <SlotDemo>
        button
        <!-- 具名插槽 -->
        <template #submit>submit</template>
        <!-- 动态插槽 -->
        <template #[slotName]>act</template>
        <!-- 插槽作用域 -->
        <template #child="{msg}">{{msg}}</template>
    </SlotDemo>
    <!-- 依赖注入 -->
    <ProvidDemo />
    <!-- 异步组件 -->
    <AsyncComp />
</template>
<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { ref } from "vue";
import HelloWorld from "./components/HelloWorld.vue";
import ViewModel from "./components/ViewModel.vue";
import SlotDemo from "./view/SlotDemo/index.vue";
import ProvidDemo from "./view/ProvidDemo/index.vue";
import AsyncComp from "./view/AsyncComp/index.vue";
const returnMsg = ref("");
const num = ref(0);
const slotName = "actSlot";
</script>
<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
