<template>
  <div :class="classHelpers.classList(cfg.wrapperClass)">
    <table :class="['rt', ...classHelpers.classList(cfg.tableClass)]">
      <thead v-if="cfg.showHeader">
        <tr>
          <th v-for="c in colCount" :key="c" :class="classHelpers.headerClassOf(c - 1)">
            <slot name="header" :col="c - 1" :label="headerLabel(c - 1)">
              {{ headerLabel(c - 1) }}
            </slot>
          </th>
        </tr>
      </thead>

      <tbody>
        <!-- Loop rows; decide per-row whether to use a custom row component -->
        <template v-for="r in rowCount" :key="r">
          <!-- CUSTOM ROW COMPONENT -->
          <component
            v-if="rowHelpers.compOf(r - 1)"
            :is="rowHelpers.compOf(r - 1)"
            :row="r - 1"
            :cols="colCount"
            :row-class="rowHelpers.componentClassOf(r - 1)"
            :value-at="(c:number) => cellValue(r - 1, c)"
            :atoms-at="(c:number) => atomsForCell(r - 1, c)"
            :cell-class-of="(c:number) => classHelpers.cellClassOf(r - 1, c)"
            v-bind="rowHelpers.compPropsOf(r - 1)"
          />
          <!-- DEFAULT ROW (cells rendered here) -->
          <tr v-else :class="classHelpers.rowClassOf(r - 1)">
            <td v-for="c in colCount" :key="c" :class="classHelpers.cellClassOf(r - 1, c - 1)">
              <template v-if="atomsForCell(r - 1, c - 1).length">
                <component
                  v-for="(atom, i) in atomsForCell(r - 1, c - 1)"
                  :key="i"
                  :is="atomHelpers.tag(atom)"
                  v-bind="atomHelpers.props(atom, r - 1, c - 1)"
                  :class="classHelpers.classList(atomHelpers.class(atom))"
                >
                  <template v-if="atomHelpers.text(atom, r - 1, c - 1) !== null">
                    {{ atomHelpers.text(atom, r - 1, c - 1) }}
                  </template>
                </component>
              </template>
              <template v-else>
                <slot name="cell" :row="r - 1" :col="c - 1" :value="cellValue(r - 1, c - 1)">
                  {{ cellValue(r - 1, c - 1) }}
                </slot>
              </template>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ClassList, PerColClassList, PerRowClassList, TableConfig, CellAtom, CellContent, CellCtx } from "../types/ReusableTableTypes";

const props = defineProps<{ config: TableConfig }>();
const cfg = computed(() => props.config ?? ({} as TableConfig));

// grid conf
const rowCount = computed(() => Math.max(cfg.value.data?.length ?? 0, cfg.value.rows ?? 0));
const colCount = computed(() => Math.max(cfg.value.data?.[0]?.length ?? 0, cfg.value.cols ?? 0));

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

// class helpers - wrapped
const classHelpers = {
  toClassArray(token?: ClassList): string[] {
    if (!token) return [];
    if (Array.isArray(token)) return token.flatMap((v) => String(v).split(/\s+/).filter(Boolean));
    return String(token).split(/\s+/).filter(Boolean);
  },
  classList(token?: ClassList): string[] {
    return classHelpers.toClassArray(token);
  },
  pickRowClass(token?: ClassList | PerRowClassList, r?: number): string[] {
    if (Array.isArray(token) && r != null) {
      return classHelpers.toClassArray(token[r] as ClassList | undefined);
    }
    return classHelpers.toClassArray(token as ClassList | undefined);
  },
  pickColClass(token?: ClassList | PerColClassList, c?: number): string[] {
    if (Array.isArray(token) && c != null) {
      return classHelpers.toClassArray(token[c] as ClassList | undefined);
    }
    return classHelpers.toClassArray(token as ClassList | undefined);
  },
  rowClassOf(r: number): string[] {
    return classHelpers.pickRowClass(cfg.value.rowClass, r);
  },
  headerClassOf(c: number): string[] {
    return classHelpers.pickColClass(cfg.value.headerClass, c);
  },
  cellClassOf(r: number, c: number): string[] {
    const perCol = classHelpers.pickColClass(cfg.value.colClass, c);
    const perCell = Array.isArray(cfg.value.cellClass)
      ? classHelpers.toClassArray(cfg.value.cellClass?.[r]?.[c] as ClassList | undefined)
      : classHelpers.toClassArray(cfg.value.cellClass as ClassList | undefined);
    return ["rt-cell", ...perCol, ...perCell];
  },
};

// component(s) in cells
const isMatrix = (x: unknown): x is unknown[][] => {
  return Array.isArray(x) && Array.isArray(x[0]);
};
const isAtomArray = (x: unknown): x is CellAtom[] => {
  return Array.isArray(x) && !Array.isArray((x as any)[0]);
};

// _ctx underscored
const normalizeAtoms = (token: CellAtom | CellAtom[] | undefined, _ctx: CellCtx): CellAtom[] => {
  if (token == null) return [];
  return (Array.isArray(token) ? token : [token]).map((a) => a);
};

const atomsForCell = (r: number, c: number): CellAtom[] => {
  const content = cfg.value.cellContent as CellContent | undefined;
  if (!content) return [];
  const ctx: CellCtx = { row: r, col: c, value: cellValue(r, c) };

  if (isMatrix(content)) {
    return normalizeAtoms((content as any[][])[r]?.[c], ctx);
  }
  if (isAtomArray(content)) {
    const arr = content as CellAtom[];
    const token = typeof arr[c] !== "undefined" ? arr[c] : (arr as any);
    return normalizeAtoms(token as any, ctx);
  }
  return normalizeAtoms(content as CellAtom | CellAtom[], ctx);
};

const atomHelpers = {
  tag(atom: CellAtom): any {
    if (atom == null || typeof atom === "string" || typeof atom === "number") return "span";
    return (atom as any).is ?? "span";
  },
  props(atom: CellAtom, r: number, c: number): Record<string, unknown> {
    if (atom == null || typeof atom === "string" || typeof atom === "number") return {};
    const a = atom as any;
    const ctx: CellCtx = { row: r, col: c, value: cellValue(r, c) };
    if (typeof a.props === "function") return a.props(ctx) ?? {};
    return a.props ?? {};
  },
  class(atom: CellAtom): ClassList | undefined {
    if (atom == null || typeof atom === "string" || typeof atom === "number") return undefined;
    return (atom as any).class;
  },
  text(atom: CellAtom, r: number, c: number): string | null {
    if (atom == null) return null;
    if (typeof atom === "string" || typeof atom === "number") return String(atom);
    const a = atom as any;
    if (a.text == null) return null;
    const ctx: CellCtx = { row: r, col: c, value: cellValue(r, c) };
    return typeof a.text === "function" ? a.text(ctx) : String(a.text);
  },
};

// row component selection
const rowHelpers = {
  compOf(r: number) {
    const src = cfg.value.rowComponent;
    if (!src) return null;
    // Only call if it's specifically a c a component constructor)
    if (typeof src === "function" && src.length === 1) {
      return (src as (row: number) => any)(r);
    }
    return src;
  },
  compPropsOf(r: number) {
    const p = cfg.value.rowComponentProps;
    return typeof p === "function" ? p(r) : p ?? {};
  },
  componentClassOf(r: number): string[] {
    // merge optional rowComponentClass with existing rowClass (so your zebra/borders persist)
    const fromRowComp = classHelpers.pickRowClass(cfg.value.rowComponentClass, r);
    const base = classHelpers.rowClassOf(r);
    return [...base, ...fromRowComp];
  },
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
