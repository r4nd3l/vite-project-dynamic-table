<template>
  <span :class="['inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', _class]"> {{ text }} and more </span>
</template>

<script setup lang="ts">
defineProps<{ text: string; _class?: string }>();
</script>
