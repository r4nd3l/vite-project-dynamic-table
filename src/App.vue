<template>
  <main class="p-8 space-y-10 max-w-screen-lg mx-auto">
    <h1 class="text-2xl font-semibold">ReusableTable — class-only</h1>

    <section>
      <h2 class="text-lg font-medium mb-2">A) Auto-numbered content</h2>
      <ReusableTable :config="autoNumbered" />
    </section>

    <section>
      <h2 class="text-lg font-medium mb-2">B) Zebra rows + borders (class-only)</h2>
      <ReusableTable :config="zebra" />
    </section>

    <section>
      <h2 class="text-lg font-medium mb-2">C) Explicit data + per-column alignment</h2>
      <ReusableTable :config="explicit" />
    </section>
  </main>
</template>

<script setup lang="ts">
import ReusableTable from "./components/ReusableTable.vue";
import type { TableConfig } from "./types/ReusableTableTypes";

/** A) no data -> rows/cols + default numbering */
const autoNumbered: TableConfig = {
  rows: 3,
  cols: 4,
  showHeader: true,
  headers: ["A", "B", "C", "D"],
  // only classes:
  wrapperClass: "overflow-auto",
  tableClass: "min-w-max border border-gray-300 rounded-md",
  headerClass: ["bg-gray-100 text-gray-700 font-medium", "bg-gray-100", "bg-gray-100", "bg-gray-100"],
  rowClass: [
    "odd:bg-white even:bg-gray-50", // row 0
    "odd:bg-white even:bg-gray-50", // row 1
    "odd:bg-white even:bg-gray-50", // row 2
  ],
  colClass: [
    "text-left p-2 border border-gray-200",
    "text-center p-2 border border-gray-200",
    "text-right p-2 border border-gray-200",
    "text-left p-2 border border-gray-200",
  ],
};

/** B) only classes for visuals; zebra via rowClass; borders via colClass */
const zebra: TableConfig = {
  rows: 5,
  cols: 3,
  defaultContent: (r, c) => `#${r + 1}-${c + 1}`,
  tableClass: "min-w-max rounded-md",
  rowClass: ["bg-white", "bg-gray-50", "bg-white", "bg-gray-50", "bg-white"],
  colClass: "p-2 border border-gray-200",
};

/** C) explicit data; per-column alignment via colClass array; custom header */
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
  // per-cell overrides (matrix): emphasize first row, first col
  cellClass: [
    ["font-semibold", undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
  ],
};
</script>

<style>
/* If you’re not using Tailwind, add your own CSS for the class names above, or swap to your design system classes. */
body {
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
</style>
