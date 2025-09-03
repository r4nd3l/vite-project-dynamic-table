<template>
  <main class="p-8 max-w-4xl mx-auto space-y-10">
    <h1 class="text-2xl font-semibold">TableFrame</h1>

    <TableFrame
      :headers="['First', 'Second', 'Third']"
      :sources="userSources"
      tableClass="min-w-max border border-gray-300 rounded-md"
      theadClass="bg-gray-400"
      thClass="p-2 text-left text-white"
      tbodyClass="divide-y divide-gray-100"
      baseRowClass="hover:bg-gray-50"
      tdClass="p-2"
    >
      <template #row="{ item, rowClass, tdClass, isFirstRow, isLastRow, rowAttrs }">
        <tr v-if="isFirstRow" v-bind="rowAttrs">
          <td :class="tdClass">1</td>
          <td :class="tdClass">2</td>
          <td :class="tdClass">3</td>
        </tr>
        <tr :class="rowClass" v-bind="rowAttrs">
          <td :class="tdClass">{{ item.name }}</td>
          <td :class="tdClass">{{ item.team }}</td>
          <td :class="[...tdClass, 'text-left']">{{ item.role }}</td>
        </tr>
        <tr v-if="isLastRow" v-bind="rowAttrs">
          <td :class="tdClass">1</td>
          <td :class="tdClass">2</td>
          <td :class="tdClass">3</td>
        </tr>
      </template>
    </TableFrame>
  </main>
</template>
<script setup lang="ts">
import TableFrame from "./components/TableFrame.vue";
import type { RowSource } from "./types/table-frame.types";

type User = { id: number; name: string; team: string; role: string };

const users: User[] = [
  { id: 1, name: "Alice", team: "Hero", role: "Lead" },
  { id: 2, name: "Béla", team: "Design", role: "IC" },
];

const userSources: RowSource<User>[] = [
  {
    items: users,
    key: (u) => u.id,
    rowClass: (_u, i) => (i % 2 ? "bg-white" : "bg-gray-50"),
    rowProps: () => ({ "data-kind": "user" }),
  },
];
</script>
