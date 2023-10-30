<template>
    <button @click="updateMsg">{{ msg }}</button>
</template>
<script setup>
import { inject } from "vue";

const { updateMsg, msg } = inject("message");
console.log(msg);
</script>
