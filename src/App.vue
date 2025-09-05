<template>
  <main class="p-8 max-w-4xl mx-auto space-y-10">
    <h1 class="text-2xl font-semibold">TableFrame with dynamic headers #1</h1>

    <TableFrame
      :headers="['First', 'Second', 'Third']"
      :sources="userSources"
      :thClasses="['text-red-600', 'text-center', 'text-right uppercase']"
      :thAttrs="(label, i) => (i === 2 ? { 'data-col': 'third', title: `Column: ${label}` } : {})"
      tableClass="min-w-max border border-gray-300 rounded-md"
      theadClass="bg-gray-400"
      thClass=""
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

    <hr />
    <h1 class="text-2xl font-semibold">TableFrame with dynamic headers #2</h1>
    <TableFrame
      :headers="headers"
      :sources="playerSources"
      :thAttrs="(label, i) => (i === 2 ? { 'data-col': 'third', title: `Column: ${label}` } : {})"
      tableClass="min-w-max border border-gray-300 rounded-md"
      theadClass="bg-gray-400"
      thClass=""
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
import type { HeaderLike, RowSource } from "./types/table-frame.types";

type User = { id: number; name: string; team: string; role: string };
type Player = { id: number; name: string; team: string; role: string };

const users: User[] = [
  { id: 1, name: "Alice", team: "Hero", role: "Lead" },
  { id: 2, name: "Béla", team: "Design", role: "IC" },
];

const players: Player[] = [
  { id: 1, name: "Mark", team: "Keepers", role: "Admin" },
  { id: 2, name: "Adam", team: "Fighter", role: "Hunter" },
];

const userSources: RowSource<User>[] = [
  {
    items: users,
    key: (u) => u.id,
    rowClass: (_u, i) => (i % 2 ? "bg-white" : "bg-gray-50"),
    rowProps: () => ({ "data-kind": "user" }),
  },
];

const playerSources: RowSource<Player>[] = [
  {
    items: players,
    key: (u) => u.id,
    rowClass: (_u, i) => (i % 2 ? "bg-white" : "bg-gray-50"),
    rowProps: () => ({ "data-kind": "user" }),
  },
];

const headers: HeaderLike[] = [
  { label: "First state", class: "text-left text-emerald-500", attrs: { scope: "col", "data-col": 1 } },
  "Second state", // still fine
  { label: "Third state", class: ["text-right", "uppercase"], attrs: { title: "Last column" } },
];
</script>
