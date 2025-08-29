<template>
  <main class="p-8 space-y-10 max-w-screen-lg mx-auto">
    <section>
      <h2 class="text-lg font-medium mb-2">Reusable Table Test</h2>
      <ReusableTable :config="reusableTableConfiguration" />
    </section>
  </main>
</template>

<script setup lang="ts">
import ReusableTable from "./components/ReusableTable.vue";
import { reusableTableConfiguration } from "./configs/ReusableTableConfig";
</script>
