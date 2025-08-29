<template>
  <tr v-bind="$attrs">
    <!-- Example: first cell uses a Pill component + text -->
    <td :class="cellClassOf(0)">
      <component :is="Pill" class="mr-2" :text="String(valueAt(0))" :_class="'bg-indigo-600 text-white'" />
    </td>

    <!-- Middle cells: render any atoms provided by the table config; fallback to text -->
    <td v-for="c in cols - 2" :key="c" :class="cellClassOf(c)">
      <template v-if="atomsAt(c).length">
        <component
          v-for="(atom, i) in atomsAt(c)"
          :key="i"
          :is="(atom as any).is || 'span'"
          v-bind="atomProps(atom, row, c)"
          :class="(atom as any).class"
        >
          {{ atomText(atom, row, c) }}
        </component>
      </template>
      <template v-else>
        {{ valueAt(c) }}
      </template>
    </td>

    <!-- Last cell: custom button -->
    <td :class="cellClassOf(cols - 1)">
      <button type="button" class="px-2 py-1 text-xs border rounded" @click="$emit('row-click', row)">Details</button>
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { CellAtom } from "../types/ReusableTableTypes";
import Pill from "./Pill.vue";

const props = defineProps<{
  row: number;
  cols: number;
  rowClass: string[];
  valueAt: (col: number) => unknown;
  atomsAt: (col: number) => CellAtom[];
  cellClassOf: (col: number) => string[];
}>();

defineEmits<{ (e: "row-click", row: number): void }>();

const atomProps = (atom: CellAtom, r: number, c: number) => {
  if (typeof atom === "string" || typeof atom === "number") return {};
  const a = atom as any;
  const value = props.valueAt(c);
  return typeof a.props === "function" ? a.props({ row: r, col: c, value }) : a.props ?? {};
};
const atomText = (atom: CellAtom, r: number, c: number) => {
  if (typeof atom === "string" || typeof atom === "number") return String(atom);
  const a = atom as any;
  if (a.text == null) return null;
  const value = props.valueAt(c);
  return typeof a.text === "function" ? a.text({ row: r, col: c, value }) : String(a.text);
};

defineOptions({ inheritAttrs: false });
</script>
