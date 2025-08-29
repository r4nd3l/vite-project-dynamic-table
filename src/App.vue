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
import Pill from "./components/Pill.vue";

const explicit: TableConfig = {
  // rows: 3,
  // cols: 3,
  data: [
    ["Alice", "Engineering", "Lead"],
    ["Béla", "Design", "IC"],
    ["Cecilia", "Finance", "Mgr"],
    ["Cecilia", "Finance", "Mgr"],
  ],
  showHeader: true,
  headers: ["Name", "Team", "Role"],
  //
  wrapperClass: ["border border-gray-300 p-4 bg-white shadow-md rounded-md"],
  tableClass: "border border-gray-300 rounded-md",
  headerClass: ["bg-gray-300", "bg-gray-400", "bg-gray-500"],
  rowClass: ["bg-green-300", "bg-gray-500", "bg-blue-300", "bg-blue-300"],
  colClass: [
    "p-2 border border-gray-200 text-left",
    "p-2 border border-gray-200 text-center",
    "p-2 border border-gray-200 text-right bg-gray-200",
    "p-2 border border-gray-200 text-right bg-teal-200",
  ],
  // per-cell overrides (matrix): emphasize first row, first col
  cellClass: [
    ["bg-red-500", undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
  ],

  // components per column
  cellContent: [
    // Column 0 -> Pill with the cell's text
    {
      is: Pill,
      class: "mr-2",
      props: ({ value }) => ({
        text: String(value),
        klass: "bg-indigo-600 text-white",
      }),
    },
    // Column 1 -> nothing special (uses default text)
    undefined,
    // Column 2 -> a native button
    {
      is: "button",
      class: "px-2 py-1 text-xs border rounded",
      props: ({ row, value }) => ({
        // You can pass DOM listeners right here
        onClick: () => alert(`Row ${row + 1} role: ${value}`),
        type: "button",
      }),
      text: "Edit",
    },
  ],
};
</script>
