<template>
  <div :class="klass(wrapperClass)">
    <table :class="klass(tableClass)">
      <!-- THEAD (optional) -->
      <thead v-if="headers?.length" :class="klass(theadClass)">
        <tr :class="klass(headerRowClass)">
          <th v-for="(h, i) in headers" :key="i" :class="klass(thClass)">
            <slot name="th" :label="h" :index="i">{{ h }}</slot>
          </th>
        </tr>
      </thead>

      <tbody :class="klass(tbodyClass)">
        <!-- Render every source, one after another -->
        <template v-for="(src, sIdx) in normalizedSources" :key="sIdx">
          <component
            v-for="(item, i) in src.items"
            :key="String(src.key(item, i, src.offset + i))"
            :is="src.rowComponent"
            :row="src.offset + i"
            :index="i"
            :item="item"
            :cols="colCount"
            :row-class="rowClasses(src, item, i)"
            :td-class="klass(tdClass)"
            v-bind="propsFor(src, item, i)"
            v-on="$attrs"
          />
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { TableFrameProps, RowSource, ClassList } from "./../types/table-frame.types";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TableFrameProps>(), {
  sources: () => [],
});

const klass = (c?: ClassList) => (Array.isArray(c) ? c : c ? c.split(/\s+/) : []);

// If user passed a single rows + rowComponent, normalize into a source:
const singleSource = computed<RowSource | null>(() => {
  if (props.rows && props.rowComponent) {
    return {
      items: props.rows,
      rowComponent: props.rowComponent,
    } as RowSource;
  }
  return null;
});

const normalizedSources = computed(() => {
  const base: RowSource[] = [];
  if (singleSource.value) base.push(singleSource.value);
  if (props.sources?.length) base.push(...props.sources);
  // annotate with running offsets and safe key
  let offset = 0;
  return base.map((src) => {
    const length = src.items?.length ?? 0;
    const key = src.key ?? ((_: unknown, _i: number, gi: number) => gi);
    const out = { ...src, offset, key } as RowSource & { offset: number; key: any };
    offset += length;
    return out;
  });
});

// HEADS UP: all row components in this frame should render the same number of <td>s
// so they align with the header. We surface a colCount hint to rows.
const colCount = computed(() => props.headers?.length ?? undefined);

// helpers to compute row classes & props
function rowClasses(src: RowSource & { offset: number }, item: unknown, i: number): string[] {
  const base = klass(props.baseRowClass);
  let extra: ClassList = undefined;
  if (typeof src.rowClass === "function") {
    extra = (src.rowClass as any)(item, i, src.offset + i);
  } else {
    extra = src.rowClass;
  }
  return [...base, ...klass(extra)];
}

function propsFor(src: RowSource & { offset: number }, item: unknown, i: number) {
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
