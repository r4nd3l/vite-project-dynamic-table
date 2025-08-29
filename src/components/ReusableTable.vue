<template>
  <div :class="classList(cfg.wrapperClass)">
    <table :class="['rt', ...classList(cfg.tableClass)]">
      <thead v-if="cfg.showHeader">
        <tr>
          <th v-for="c in colCount" :key="c" :class="headerClassOf(c - 1)">
            <slot name="header" :col="c - 1" :label="headerLabel(c - 1)">
              {{ headerLabel(c - 1) }}
            </slot>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="r in rowCount" :key="r" :class="rowClassOf(r - 1)">
          <td v-for="c in colCount" :key="c" :class="cellClassOf(r - 1, c - 1)">
            <slot name="cell" :row="r - 1" :col="c - 1" :value="cellValue(r - 1, c - 1)">
              {{ cellValue(r - 1, c - 1) }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ClassList, PerColClassList, PerRowClassList, TableConfig } from "../types/ReusableTableTypes";

const props = defineProps<{ config: TableConfig }>();
const cfg = computed(() => props.config ?? ({} as TableConfig));

// grid conf
const rowCount = computed(() => cfg.value.data?.length ?? cfg.value.rows ?? 0);
const colCount = computed(() => cfg.value.data?.[0]?.length ?? cfg.value.cols ?? 0);

const headerLabel = (c: number) => {
  const h = cfg.value.headers;
  if (h && typeof h[c] !== "undefined" && h[c] !== null) return String(h[c]);
  return `Col ${c + 1}`;
};

const defaultContent = (r: number, c: number) => {
  const dc = cfg.value.defaultContent;
  if (typeof dc === "function") return dc(r, c);
  if (typeof dc === "string") return dc;
  return `R${r + 1}C${c + 1}`;
};

const cellValue = (r: number, c: number) => {
  const d = cfg.value.data;
  if (d && d[r] && typeof d[r][c] !== "undefined" && d[r][c] !== null) return d[r][c];
  return defaultContent(r, c);
};

// class helpers
const toClassArray = (token?: ClassList): string[] => {
  if (!token) return [];
  if (Array.isArray(token)) return token.flatMap((v) => String(v).split(/\s+/).filter(Boolean));
  return String(token).split(/\s+/).filter(Boolean);
};

const classList = (token?: ClassList): string[] => {
  return toClassArray(token);
};

const pickRowClass = (token?: ClassList | PerRowClassList, r?: number): string[] => {
  if (Array.isArray(token) && r != null) {
    // Per-row array (each entry can be string or string[])
    return toClassArray(token[r] as ClassList | undefined);
  }
  return toClassArray(token as ClassList | undefined);
};

const pickColClass = (token?: ClassList | PerColClassList, c?: number): string[] => {
  if (Array.isArray(token) && c != null) {
    return toClassArray(token[c] as ClassList | undefined);
  }
  return toClassArray(token as ClassList | undefined);
};

const rowClassOf = (r: number): string[] => {
  return pickRowClass(cfg.value.rowClass, r);
};

const headerClassOf = (c: number): string[] => {
  // header can be a single classlist or per-column
  const base = pickColClass(cfg.value.headerClass, c);
  return base;
};

const cellClassOf = (r: number, c: number): string[] => {
  const perCol = pickColClass(cfg.value.colClass, c);
  const perCell = Array.isArray(cfg.value.cellClass)
    ? toClassArray(cfg.value.cellClass?.[r]?.[c] as ClassList | undefined)
    : toClassArray(cfg.value.cellClass as ClassList | undefined);
  return ["rt-cell", ...perCol, ...perCell];
};
</script>

<style scoped lang="css">
.rt {
  border-collapse: separate;
  border-spacing: 0;
}
.rt-cell {
  vertical-align: middle;
}
</style>
