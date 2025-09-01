<template>
  <main class="p-8 max-w-4xl mx-auto space-y-10">
    <h1 class="text-2xl font-semibold">TableFrame — many row types, one frame</h1>

    <component
      :is="TableFrame"
      :headers="['Col A', 'Col B', 'Col C', 'Actions']"
      :sources="sources"
      wrapperClass="overflow-auto"
      tableClass="min-w-max border border-gray-300 rounded-md"
      theadClass="bg-gray-100"
      headerRowClass="border-b border-gray-200"
      thClass="p-2 text-left text-gray-700"
      tbodyClass="divide-y divide-gray-100"
      baseRowClass="hover:bg-gray-50"
      tdClass="p-2"
      @row-action="onRowAction"
    />
  </main>
</template>

<script setup lang="ts">
import TableFrame from "./components/TableFrame.vue";
import type { RowSource } from "./types/table-frame.types";
import UserRow from "./components/rows/UserRow.vue";
import InvoiceRow from "./components/rows/InvoiceRow.vue";

const users = [
  { id: 1, name: "Alice", team: "Engineering", role: "Lead" },
  { id: 2, name: "Béla", team: "Design", role: "IC" },
];
const invoices = [
  { no: "INV-1001", customer: "Acme Inc.", amount: 1499.5, status: "Paid" as const },
  { no: "INV-1002", customer: "Globex LLC", amount: 275.0, status: "Overdue" as const },
];

const sources: RowSource[] = [
  {
    items: users,
    rowComponent: UserRow,
    key: (u) => (u as any).id,
    rowClass: (_, i) => (i % 2 ? "bg-white" : "bg-gray-50"),
    rowProps: () => ({ "data-kind": "user" }), // extra attrs/props
  },
  {
    items: invoices,
    rowComponent: InvoiceRow,
    key: (inv) => (inv as any).no,
    rowClass: "bg-white",
    rowProps: () => ({ "data-kind": "invoice" }),
  },
];

function onRowAction(payload: any) {
  console.log("row-action", payload);
}
</script>
