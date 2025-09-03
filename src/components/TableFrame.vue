<template>
  <div :class="klass(wrapperClass)">
    <table :class="klass(tableClass)">
      <thead v-if="headers?.length" :class="klass(theadClass)">
        <tr :class="klass(headerRowClass)">
          <th v-for="(h, i) in headers" :key="i" :class="klass(thClass)">
            <!-- column-specific slot has priority, then a generic #th, then plain text -->
            <slot :name="`th-${i}`" :label="h" :index="i">
              <slot name="th" :label="h" :index="i">
                {{ h }}
              </slot>
            </slot>
          </th>
        </tr>
      </thead>

      <!-- TableFrame.vue -->
      <tbody :class="klass(tbodyClass)">
        <template v-for="(src, sIdx) in normalizedSources" :key="sIdx">
          <template v-for="(item, i) in src.items" :key="String(src.key(item, i, src.offset + i))">
            <!-- If a rowComponent is provided, use it -->
            <component
              v-if="src.rowComponent"
              :is="src.rowComponent"
              :row="src.offset + i"
              :index="i"
              :item="item"
              :cols="colCount"
              :row-class="rowClasses(src, item, i)"
              :td-class="klass(tdClass)"
              :is-first-row="i === 0"
              :is-last-row="i === src.items.length - 1"
              :row-attrs="propsFor(src, item, i)"
            />
            <!-- Otherwise, render via a scoped slot -->
            <template v-else>
              <slot
                name="row"
                :row="src.offset + i"
                :index="i"
                :item="item"
                :cols="colCount"
                :row-class="rowClasses(src, item, i)"
                :td-class="klass(tdClass)"
                :is-first-row="i === 0"
                :is-last-row="i === src.items.length - 1"
                :row-attrs="propsFor(src, item, i)"
              >
                <!-- Optional fallback if no slot is provided -->
                <tr :class="rowClasses(src, item, i)">
                  <td :class="klass(tdClass)">{{ (item as any)?.name }}</td>
                  <td :class="klass(tdClass)">{{ (item as any)?.team }}</td>
                  <td :class="[...klass(tdClass), 'text-left']">{{ (item as any)?.role }}</td>
                </tr>
              </slot>
            </template>
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import type { TableFrameProps, RowSource, ClassList, RowKeyFn } from "./../types/table-frame.types";

defineOptions({ inheritAttrs: false });

// ⬇️ IMPORTANT: use <any> so props.sources is RowSource<any>[]
const props = withDefaults(defineProps<TableFrameProps<any>>(), {
  sources: () => [],
});

const klass = (c?: ClassList): string[] => (Array.isArray(c) ? c : c ? c.split(/\s+/) : []);

// single-source normalization
const singleSource = computed<RowSource<any> | null>(() => {
  if (props.rows && props.rowComponent) {
    return { items: props.rows, rowComponent: props.rowComponent };
  }
  return null;
});

const normalizedSources = computed(() => {
  const base: RowSource<any>[] = [];
  if (singleSource.value) base.push(singleSource.value);
  if (props.sources?.length) base.push(...props.sources);

  let offset = 0;
  return base.map((src) => {
    const length = src.items?.length ?? 0;
    const key: RowKeyFn = src.key ?? ((_, __, gi) => gi);
    const out = { ...src, offset, key } as RowSource<any> & { offset: number; key: RowKeyFn };
    offset += length;
    return out;
  });
});

const colCount = computed(() => props.headers?.length ?? undefined);

function rowClasses(src: RowSource<any> & { offset: number }, item: unknown, i: number): string[] {
  const base = klass(props.baseRowClass);
  const extra = typeof src.rowClass === "function" ? (src.rowClass as any)(item, i, src.offset + i) : src.rowClass;
  return [...base, ...klass(extra)];
}

function propsFor(src: RowSource<any> & { offset: number }, item: unknown, i: number) {
  const rowIdx = src.offset + i;
  if (!src.rowProps) return {};
  return typeof src.rowProps === "function" ? (src.rowProps as any)(item, i, rowIdx) : src.rowProps;
}
</script>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}
th,
td {
  vertical-align: middle;
}
</style>
