<template>
  <tr :class="rowClass">
    <td :class="tdClass">{{ item.no }}</td>
    <td :class="tdClass">{{ item.customer }}</td>
    <td :class="[...tdClass, 'text-right']">{{ currency(item.amount) }}</td>
    <td :class="tdClass">
      <span :class="statusClass(item.status)">{{ item.status }}</span>
    </td>
  </tr>
</template>

<script setup lang="ts">
defineProps<{
  row: number;
  index: number;
  item: { no: string; customer: string; amount: number; status: "Paid" | "Pending" | "Overdue" };
  rowClass: string[];
  tdClass: string[];
}>();
const currency = (n: number) => n.toLocaleString(undefined, { style: "currency", currency: "USD" });
const statusClass = (s: string) =>
  s === "Paid"
    ? "px-2 py-1 text-xs rounded bg-emerald-100 text-emerald-700"
    : s === "Overdue"
    ? "px-2 py-1 text-xs rounded bg-rose-100 text-rose-700"
    : "px-2 py-1 text-xs rounded bg-amber-100 text-amber-700";
</script>
