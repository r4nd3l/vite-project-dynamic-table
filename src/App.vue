<template>
  <main class="p-8 max-w-4xl mx-auto space-y-10">
    <h1 class="text-2xl font-semibold">TableFrame</h1>

    <!-- TableFrame Component -->
    <component
      :is="TableFrame"
      :headers="['First', 'Second', 'Third']"
      :sources="sources"
      tableClass="min-w-max border border-gray-300 rounded-md"
      theadClass="bg-gray-400"
      thClass="p-2 text-left text-white"
      tbodyClass="divide-y divide-gray-100"
      baseRowClass="hover:bg-gray-50"
      tdClass="p-2"
    />
    <!-- END -->
  </main>
</template>

<script setup lang="ts">
import TableFrame from "./components/TableFrame.vue";
import type { RowSource } from "./types/table-frame.types";
import UserRow from "./components/rows/UserRow.vue";

const users = [
  { id: 1, name: "Alice", team: "Hero", role: "Lead" },
  { id: 2, name: "Béla", team: "Design", role: "IC" },
];

const sources: RowSource[] = [
  {
    items: users,
    rowComponent: UserRow,
    key: (u) => (u as any).id,
    rowClass: (_, i) => (i % 2 ? "bg-white" : "bg-gray-50"),
    rowProps: () => ({ "data-kind": "user" }),
  },
];
</script>
