<template>
  <span :class="['inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', klass]">
    {{ text }}
  </span>
</template>

<script setup lang="ts">
defineProps<{ text: string; klass?: string }>();
</script>
