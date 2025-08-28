<!-- src/table/UniversalTable.vue -->
<template>
  <div class="table-wrap">
    <div class="toolbar">
      <slot name="toolbar">
        <input v-model="core.search" class="txt" type="search" placeholder="Search…" aria-label="Search table" />
        <div class="spacer"></div>
        <details class="cols">
          <summary>Columns</summary>
          <ul>
            <li v-for="c in (schema.columns ?? []).filter(Boolean)" :key="c.key">
              <label>
                <input type="checkbox" v-model="core.columnVisibility[c.key]" />
                {{ c.label }}
              </label>
            </li>
          </ul>
        </details>
      </slot>
    </div>

    <div class="table-scroller">
      <table class="utbl">
        <thead>
          <tr>
            <th v-if="schema.selection !== 'none'"></th>
            <th
              v-for="c in (visibleColumns ?? []).filter(Boolean)"
              :key="c.key"
              :style="{ width: c.width }"
              :class="[{ sticky: c.sticky }, c.align || 'left']"
              @click="c.sortable ? core.setSort(c.key) : null"
              :aria-sort="ariaSort(c.key)"
            >
              <slot :name="`header-${c.key}`" :column="c">
                <span class="th-label">{{ c.label }}</span>
                <span v-if="c.sortable" class="sort-ind">
                  <span v-if="core.sortBy.value === c.key && core.sortDir.value === 'asc'">▲</span>
                  <span v-else-if="core.sortBy.value === c.key && core.sortDir.value === 'desc'">▼</span>
                  <span v-else>⇅</span>
                </span>
              </slot>
            </th>
            <th v-if="schema.rowActions?.length">Actions</th>
          </tr>
        </thead>

        <tbody v-if="!loading && pageRows.length">
          <tr v-for="row in pageRows" :key="String(row[schema.rowKey])">
            <td v-if="schema.selection !== 'none'">
              <input v-if="schema.selection === 'multi'" type="checkbox" :checked="isSelected(row)" @change="toggleSelect(row)" />
              <input v-else-if="schema.selection === 'single'" type="radio" name="tbl-sel" :checked="isSelected(row)" @change="toggleSelect(row, true)" />
            </td>

            <td v-for="c in (visibleColumns ?? []).filter(Boolean)" :key="c.key" :class="[cellClass(c)]" :style="{ textAlign: c.align || 'left' }">
              <!-- 1) named slot override -->
              <slot :name="`cell-${c.key}`" :row="row" :column="c" :edit="commitCell">
                <!-- 2) schema -> dynamic renderer -->
                <component :is="resolveRenderer(c, row)" :value="readCell(c, row)" :row="row" :column="c" :readonly="!c.editor" @commit="commitCell.bind(null, c, row)" />
              </slot>
            </td>

            <td v-if="schema.rowActions?.length" class="actions">
              <slot name="row-actions" :row="row" :emit="emitAction">
                <button v-for="a in schema.rowActions" v-show="!a.when || a.when(row)" :key="a.key" class="btn ghost" @click="onRowAction(a, row)">
                  {{ a.label }}
                </button>
              </slot>
            </td>
          </tr>
        </tbody>

        <tbody v-else-if="loading">
          <tr>
            <td :colspan="colspan">Loading…</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td :colspan="colspan">
              <slot name="empty">No records.</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pager" role="navigation" aria-label="Pagination">
      <button class="btn" :disabled="core.page.value <= 1" @click="prevPage">Prev</button>
      <span>Page {{ core.page.value }} / {{ core.pageCount.value }} ({{ core.total.value }} rows)</span>
      <button class="btn" :disabled="core.page.value >= core.pageCount.value" @click="nextPage">Next</button>
      <select v-model.number="core.pageSize" aria-label="Rows per page">
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
        <option :value="100">100</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Row, TableSchema, ColumnDef } from "./table.types";
import { useTableCore } from "./useTableCore";

// ----- Props/Emits -----
const props = defineProps<{
  schema: TableSchema;
  rows: Row[];
  loading?: boolean;
  modelValue?: Row[]; // optional v-model for edited rows
  selected?: Array<string | number>; // selected row keys
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Row[]): void;
  (e: "update:selected", value: Array<string | number>): void;
  (e: "row-action", payload: { action: string; row: Row }): void;
  (e: "cell-edit", payload: { row: Row; column: ColumnDef; value: unknown }): void;
}>();

// backing store for rows (prefer v-model when provided)
const writableRows = computed<Row[]>({
  get: () => props.modelValue ?? props.rows,
  set: (v) => emit("update:modelValue", v),
});

const schema = computed(() => props.schema);
const core = useTableCore(
  () => writableRows.value,
  () => schema.value
);
const visibleColumns = core.visibleColumns;
const pageRows = core.pageRows;
const loading = computed(() => props.loading ?? false);
const colspan = computed(() => (visibleColumns.value ?? []).length + (schema.value.selection === "none" ? 0 : 1) + (schema.value.rowActions?.length ? 1 : 0));

// ----- selection -----
const selected = computed<Array<string | number>>({
  get: () => props.selected ?? [],
  set: (v) => emit("update:selected", v),
});
const isSelected = (row: Row) => selected.value.includes(row[schema.value.rowKey] as any);
const toggleSelect = (row: Row, single = false) => {
  const key = row[schema.value.rowKey] as any;
  if (single) {
    selected.value = [key];
  } else {
    selected.value = isSelected(row) ? selected.value.filter((k) => k !== key) : [...selected.value, key];
  }
};

// ----- render helpers -----
const ariaSort = (key: string) => {
  if (core.sortBy.value !== key) return "none";
  return core.sortDir.value === "asc" ? "ascending" : "descending";
};

function readCell(c: ColumnDef, row: Row) {
  const val = row[c.key];
  return c.format ? c.format(val, row) : val;
}

function commitCell(c: ColumnDef, row: Row, next: unknown) {
  // reverse parse if formatter exists
  const base = c.parse ? c.parse(next, row) : next;

  // validators
  const validators = c.editor?.validators ?? [];
  for (const v of validators) {
    const err = v({ row, key: c.key, value: base });
    if (err) {
      // You can replace with a toast
      alert(err);
      return;
    }
  }

  const key = schema.value.rowKey;
  const updated = writableRows.value.map((r) => (r[key] === row[key] ? { ...r, [c.key]: base } : r));
  writableRows.value = updated;
  emit("cell-edit", { row, column: c, value: base });
}

function cellClass(c: ColumnDef) {
  const classes = ["cell", c.align || "left"];
  if (c.sticky) classes.push(`sticky-${c.sticky}`);
  if (c.editor) classes.push("editable");
  if (c.type === "badge") classes.push("badge-cell");
  return classes.join(" ");
}

// ----- row actions -----
function onRowAction(a: { key: string; confirm?: string }, row: Row) {
  if (a.confirm && !confirm(a.confirm)) return;
  emit("row-action", { action: a.key, row });
}
const emitAction = (key: string, row: Row) => emit("row-action", { action: key, row });

// pagination helpers to avoid using ++/-- on non-number types in templates
const prevPage = () => {
  if (core.page.value > 1) core.page.value--;
};
const nextPage = () => {
  if (core.page.value < core.pageCount.value) core.page.value++;
};

// ----- dynamic renderers (default) -----
const DefaultCell = {
  props: ["value"],
  template: `<span>{{ value ?? '' }}</span>`,
};

const BooleanCell = {
  props: ["value"],
  template: `<span :aria-label="value ? 'True' : 'False'">{{ value ? '✔︎' : '—' }}</span>`,
};

const BadgeCell = {
  props: ["value"],
  template: `<span class="badge">{{ value }}</span>`,
};

const InputEditor = {
  props: ["value", "column", "row", "readonly"],
  emits: ["commit"],
  template: `
    <template v-if="readonly"><span>{{ value ?? '' }}</span></template>
    <input v-else class="txt" :value="value ?? ''"
      @input="$emit('commit', $event.target.value)" />
  `,
};

const NumberEditor = {
  props: ["value", "column", "row", "readonly"],
  emits: ["commit"],
  template: `
    <template v-if="readonly"><span>{{ value ?? '' }}</span></template>
    <input v-else class="txt" type="number" :value="value ?? ''"
      @input="$emit('commit', $event.target.valueAsNumber)" />
  `,
};

const TextareaEditor = {
  props: ["value", "column", "row", "readonly"],
  emits: ["commit"],
  template: `
    <template v-if="readonly"><span style="white-space: pre-wrap">{{ value ?? '' }}</span></template>
    <textarea v-else class="txt" :value="value ?? ''"
      @change="$emit('commit', $event.target.value)"></textarea>
  `,
};

const SelectEditor = {
  props: ["value", "column", "row", "readonly"],
  emits: ["commit"],
  template: `
    <template v-if="readonly"><span>{{ labelOf(value) }}</span></template>
    <select v-else class="txt" :value="value" @change="$emit('commit', $event.target.value)">
      <option v-for="opt in (column.editor?.options || [])" :key="String(opt.value)" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  `,
  methods: {
    labelOf(v: unknown) {
      const opts = (this as any).column?.editor?.options || [];
      return opts.find((o: any) => o.value === v)?.label ?? String(v ?? "");
    },
  },
};

const SwitchEditor = {
  props: ["value", "column", "row", "readonly"],
  emits: ["commit"],
  template: `
    <template v-if="readonly">
      <span :aria-label="value ? 'Enabled' : 'Disabled'">{{ value ? 'On' : 'Off' }}</span>
    </template>
    <label v-else class="switch">
  <input type="checkbox" :checked="!!value" @change="$emit('commit', $event.target ? $event.target.checked : false)" />
      <span class="slider"></span>
    </label>
  `,
};

const DateEditor = {
  props: ["value", "column", "row", "readonly"],
  emits: ["commit"],
  template: `
    <template v-if="readonly"><span>{{ value ? new Date(value).toLocaleDateString() : '' }}</span></template>
    <input v-else class="txt" type="date"
      :value="value ? new Date(value).toISOString().slice(0,10) : ''"
      @change="$emit('commit', ($event.target as HTMLInputElement).value)" />
  `,
};

function resolveRenderer(
  c: ColumnDef,
  _row?: /// <reference types="../../node_modules/.vue-global-types/vue_3.5_0.d.ts" />
  Row
) {
  // custom component path
  if (c.type === "component" && c.componentName) return c.componentName;

  // editable?
  if (c.editor) {
    switch (c.editor.type) {
      case "input":
        return InputEditor;
      case "number":
        return NumberEditor;
      case "textarea":
        return TextareaEditor;
      case "select":
        return SelectEditor;
      case "switch":
        return SwitchEditor;
      case "date":
        return DateEditor;
      case "custom":
        return c.editor.componentName || DefaultCell;
    }
  }

  // read-only renderers
  const t = c.type || "auto";
  if (t === "boolean") return BooleanCell;
  if (t === "badge") return BadgeCell;
  return DefaultCell;
}
</script>

<style scoped>
.table-wrap {
  display: grid;
  gap: 0.75rem;
}
.toolbar {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.toolbar .spacer {
  flex: 1;
}
.table-scroller {
  overflow: auto;
  border: 1px solid var(--c, #ddd);
  border-radius: 0.5rem;
}
.utbl {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}
.utbl thead th {
  position: sticky;
  top: 0;
  background: #fafafa;
  z-index: 1;
  padding: 0.5rem;
  font-weight: 600;
  border-bottom: 1px solid #e5e5e5;
  white-space: nowrap;
}
.utbl td {
  padding: 0.5rem;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
}
.left {
  text-align: left;
}
.center {
  text-align: center;
}
.right {
  text-align: right;
}
.sticky-left {
  position: sticky;
  left: 0;
  background: inherit;
  z-index: 2;
}
.sticky-right {
  position: sticky;
  right: 0;
  background: inherit;
  z-index: 2;
}
.badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  background: #eef3ff;
  border: 1px solid #dbe4ff;
}
.actions {
  white-space: nowrap;
}
.editable {
  background: #fff;
}
.txt {
  border: 1px solid #ddd;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  min-width: 12ch;
}
.btn {
  border: 1px solid #ccc;
  background: #fff;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
}
.btn[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn.ghost {
  border-color: #eee;
}
.sort-ind {
  margin-left: 0.25rem;
  opacity: 0.6;
}
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
}
.switch input {
  display: none;
}
.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: #ddd;
  border-radius: 999px;
  transition: 0.2s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 2px;
  top: 2px;
  background: #fff;
  border-radius: 50%;
  transition: 0.2s;
}
.switch input:checked + .slider {
  background: #4ade80;
}
.switch input:checked + .slider:before {
  transform: translateX(18px);
}
.pager {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: flex-end;
}
.cols summary {
  cursor: pointer;
}
</style>
