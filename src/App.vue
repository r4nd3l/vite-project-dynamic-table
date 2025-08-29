<template>
  <main style="padding: 2rem; display: grid; gap: 2rem; max-width: 1200px; margin: 0 auto">
    <h1>ReusableTable demo</h1>

    <section>
      <h2>Basic (auto content)</h2>
      <ReusableTable :config="basic" />
    </section>

    <section>
      <h2>Custom colors, sizes, borders</h2>
      <ReusableTable :config="styled" />
    </section>

    <section>
      <h2>Explicit data grid (names)</h2>
      <ReusableTable :config="withNames" />
    </section>
  </main>
</template>

<script setup lang="ts">
import ReusableTable from "./components/ReusableTable.vue";
import type { TableConfig } from "./types/ReusableTableTypes";

const basic: TableConfig = {
  rows: 3,
  cols: 4,
  defaultContent: (r, c) => `R${r + 1}C${c + 1}`,
};

const styled: TableConfig = {
  rows: 4,
  cols: 4,
  defaultContent: (r, c) => `#${r + 1}-${c + 1}`,
  // sizes
  rowHeights: [100, 150, 50, 75], // px numbers or '2rem' as 1st, 2nd and so on
  colWidths: ["8rem", "10rem", "12rem", "8rem"],
  cellPadding: [8, 12], // [y, x] in px or CSS length
  // colors (hex/rgb = inline, or utility classes like 'bg-blue-50', 'text-red-600')
  bg: ["#f9fafb", "#ffffff", "#f9fafb", "#ffffff"], // per-row
  color: "text-gray-800", // class applied to every cell
  textAlign: ["left", "center", "right"], // per-column
  // borders
  borders: {
    inner: true,
    outer: true,
    width: 4,
    style: "solid",
    color: "#e5e7eb", // or a class, e.g. 'border-gray-300'
  },
  tableLayout: "fixed", // optional: 'auto' | 'fixed'
  className: "rounded-md overflow-hidden shadow-sm", // extra table classes
};

const withNames: TableConfig = {
  // If you pass data, rows/cols are inferred
  data: [
    ["Alice", "Engineering", "Lead"],
    ["Béla", "Design", "IC"],
    ["Cecilia", "Finance", "Mgr"],
    ["Dávid", "Engineering", "IC"],
  ],
  // Column sizes
  colWidths: ["14ch", "18ch", "10ch"],
  // Per-cell background (matrix) mixing class + hex
  bg: [
    ["bg-emerald-50", "#fff", "#fff"],
    ["#fff", "#fff", "#fff"],
    ["bg-emerald-50", "#fff", "#fff"],
    ["#fff", "#fff", "#fff"],
  ],
  borders: { inner: true, outer: true, width: 1, style: "dashed", color: "border-gray-400" },
  textAlign: "left",
};
</script>
