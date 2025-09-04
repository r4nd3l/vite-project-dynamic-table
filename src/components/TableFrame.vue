<template>
  <div :class="klass(wrapperClass)">
    <table :class="klass(tableClass)">
      <thead v-if="normalizedHeaders.length" :class="klass(theadClass)">
        <tr :class="klass(headerRowClass)">
          <th v-for="(h, i) in normalizedHeaders" :key="i" :class="thClassFor(i, h.label, h.classList)" v-bind="thAttrsFor(i, h.label, h.attrs)">
            <!-- column-specific slot has priority, then a generic #th, then label -->
            <slot :name="`th-${i}`" :label="h.label" :index="i">
              <slot name="th" :label="h.label" :index="i">
                {{ h.label }}
              </slot>
            </slot>
          </th>
        </tr>
      </thead>

      <tbody :class="klass(tbodyClass)">
        <template v-for="(src, sIdx) in normalizedSources" :key="sIdx">
          <template v-for="(item, i) in src.items" :key="String(src.key(item, i, src.offset + i))">
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
              />
            </template>
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { TableFrameProps, RowSource, ClassList, RowKeyFn, HeaderLike } from "./../types/table-frame.types";

defineOptions({ inheritAttrs: false });

// Important: keep <any> to avoid generic invariance at prop boundary
const props = withDefaults(defineProps<TableFrameProps<any>>(), {
  sources: () => [],
});

const klass = (c?: ClassList): string[] => (Array.isArray(c) ? c : c ? c.split(/\s+/) : []);

/** Normalize headers to objects with label/classList/attrs */
const normalizedHeaders = computed(() =>
  (props.headers ?? []).map((h: HeaderLike) => {
    if (typeof h === "string") {
      return { label: h, classList: [] as string[], attrs: {} as Record<string, unknown> };
    }
    return {
      label: h.label,
      classList: klass(h.class),
      attrs: h.attrs ?? {},
    };
  })
);

/** Optional extra classes per <th>, via prop thClasses */
function thClassFor(index: number, label: string, fromHeader: string[]): string[] {
  const base = klass(props.thClass);
  const extra = Array.isArray(props.thClasses)
    ? klass(props.thClasses[index])
    : typeof props.thClasses === "function"
    ? klass(props.thClasses(label, index))
    : [];
  return [...base, ...fromHeader, ...extra];
}

/** Optional extra attrs per <th>, via prop thAttrs */
function thAttrsFor(index: number, label: string, fromHeader: Record<string, unknown>): Record<string, unknown> {
  const extra =
    typeof props.thAttrs === "function"
      ? (props.thAttrs as (label: string, index: number) => Record<string, unknown>)(label, index)
      : props.thAttrs ?? {};
  return { ...fromHeader, ...extra };
}

/** Single-source normalization (rows + rowComponent) */
const singleSource = computed<RowSource<any> | null>(() => {
  if (props.rows && props.rowComponent) {
    return { items: props.rows, rowComponent: props.rowComponent };
  }
  return null;
});

/** Final sources with offsets and safe key */
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

/** Helpers for row classes & props */
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
