<template>
    <AsyncComp />
</template>
<script setup>
import { defineAsyncComponent } from "vue";
const AsyncComp = defineAsyncComponent({
    // 加载函数
    loader: () => import("./Demo.vue"),

    // 加载异步组件时使用的组件
    // loadingComponent: LoadingComponent,
    // 展示加载组件前的延迟时间，默认为 200ms
    delay: 2000,

    // 加载失败后展示的组件
    // errorComponent: ErrorComponent,
    // 如果提供了一个 timeout 时间限制，并超时了
    // 也会显示这里配置的报错组件，默认值是：Infinity
    timeout: 3000
});
</script>
