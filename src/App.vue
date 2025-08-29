<template>
  <main class="p-8 space-y-10 max-w-screen-lg mx-auto">
    <section>
      <h2 class="text-lg font-medium mb-2">Reusable Table Test</h2>
      <ReusableTable :config="explicit" />
    </section>
  </main>
</template>

<script setup lang="ts">
import ReusableTable from "./components/ReusableTable.vue";
import type { TableConfig } from "./types/ReusableTableTypes";

const explicit: TableConfig = {
  data: [
    ["Alice", "Engineering", "Lead"],
    ["Béla", "Design", "IC"],
    ["Cecilia", "Finance", "Mgr"],
  ],
  showHeader: true,
  headers: ["Name", "Team", "Role"],
  tableClass: "border border-gray-300 rounded-md",
  colClass: ["p-2 border border-gray-200 text-left", "p-2 border border-gray-200 text-center", "p-2 border border-gray-200 text-right"],
  rowClass: ["bg-green-300", "bg-gray-500", "bg-blue-300"],
  // per-cell overrides (matrix): emphasize first row, first col
  cellClass: [
    ["bg-red-500", undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
  ],
};
</script>
