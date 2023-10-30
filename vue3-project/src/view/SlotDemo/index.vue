<template>
    <button>
        <slot>default</slot>
    </button>
    <button>
        <slot name="submit"></slot>
    </button>
    <button>
        <slot name="actSlot"></slot>
    </button>
    <button>
        <slot name="child" :msg="msg"></slot>
    </button>
</template>
<script setup>
const msg = "child";
</script>