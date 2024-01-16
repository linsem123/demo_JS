<script setup lang="ts">
import { ref } from 'vue';
withDefaults(defineProps<{ msg: string }>(), { msg: 'hello world 11' });
const count = ref(0);
</script>

<template>
  <h1>{{ msg }}</h1>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
