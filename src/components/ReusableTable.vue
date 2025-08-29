<template>
  <div class="rt-wrap">
    <table :class="['rt', config.className, borderColorClass]" :style="tableStyle">
      <colgroup v-if="colCount">
        <col v-for="c in colCount" :key="c" :style="colStyle(c - 1)" />
      </colgroup>

      <tbody>
        <tr v-for="r in rowCount" :key="r" :style="rowStyle(r - 1)">
          <template v-for="c in colCount" :key="c">
            <td :class="cellClass(r - 1, c - 1)" :style="cellStyle(r - 1, c - 1)">
              <slot name="cell" :row="r - 1" :col="c - 1" :value="cellValue(r - 1, c - 1)">
                {{ cellValue(r - 1, c - 1) }}
              </slot>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { TableConfig, Dim, Align } from "../types/ReusableTableTypes";

const props = defineProps<{ config: TableConfig }>();
const cfg = computed(() => props.config ?? ({} as TableConfig));

// ---- grid shape ------------------------------------------------------------
const rowCount = computed(() => cfg.value.data?.length ?? cfg.value.rows ?? 0);
const colCount = computed(() => cfg.value.data?.[0]?.length ?? cfg.value.cols ?? 0);

// fallback content factory
const defaultFactory = (r: number, c: number) => {
  const dc = cfg.value.defaultContent;
  if (typeof dc === "function") return dc(r, c);
  if (typeof dc === "string") return dc;
  return "";
};

function cellValue(r: number, c: number) {
  const d = cfg.value.data;
  if (d && d[r] && typeof d[r][c] !== "undefined") return d[r][c];
  return defaultFactory(r, c);
}

// ---- utils -----------------------------------------------------------------
const toPx = (d?: Dim) => {
  if (d == null) return undefined;
  return typeof d === "number" ? `${d}px` : String(d);
};

// pick value from single / 1D / 2D tokens
function pick<T>(token: T | T[] | T[][] | undefined, r: number, c: number): T | undefined {
  if (token == null) return undefined;
  if (Array.isArray(token)) {
    if (Array.isArray(token[0])) {
      // matrix
      const m = token as T[][];
      return m[r] && typeof m[r][c] !== "undefined" ? m[r][c] : undefined;
    } else {
      // Heuristic: for widths/align -> treat as per-column; for bg/color/rowHeights -> per-row.
      // We'll switch based on the field at call sites by passing rowFirst: true/false if needed.
      // Here we assume call sites choose which index to use.
      return undefined as any;
    }
  }
  return token as T;
}

// Specialized pickers for 1D arrays
const pickRow = <T>(arr: T | T[] | T[][] | undefined, r: number) => {
  if (arr == null) return undefined;
  if (Array.isArray(arr)) {
    if (Array.isArray(arr[0])) return undefined;
    const a = arr as T[];
    return typeof a[r] !== "undefined" ? a[r] : undefined;
  }
  return arr as T;
};
const pickCol = <T>(arr: T | T[] | T[][] | undefined, c: number) => {
  if (arr == null) return undefined;
  if (Array.isArray(arr)) {
    if (Array.isArray(arr[0])) return undefined;
    const a = arr as T[];
    return typeof a[c] !== "undefined" ? a[c] : undefined;
  }
  return arr as T;
};

function isClassToken(token?: string) {
  if (!token) return false;
  // crude test: utility classes usually have '-', spaces, or start with alpha and not '#'
  return token.includes(" ") || token.includes("-") || (!token.startsWith("#") && !token.startsWith("rgb") && !token.startsWith("hsl"));
}

function colorClassOrStyle(kind: "bg" | "text" | "border", token?: string) {
  if (!token) return { class: "", style: {} as Record<string, string> };
  if (isClassToken(token)) {
    if (kind === "bg") return { class: token, style: {} };
    if (kind === "text") return { class: token, style: {} };
    if (kind === "border") return { class: token, style: {} };
  }
  // treat as CSS value
  if (kind === "bg") return { class: "", style: { backgroundColor: token } };
  if (kind === "text") return { class: "", style: { color: token } };
  if (kind === "border") return { class: "", style: { borderColor: token } };
  return { class: "", style: {} };
}

// ---- borders ---------------------------------------------------------------
const borders = computed(() => ({
  inner: cfg.value.borders?.inner ?? true,
  outer: cfg.value.borders?.outer ?? true,
  width: cfg.value.borders?.width ?? 1,
  style: cfg.value.borders?.style ?? "solid",
  color: cfg.value.borders?.color ?? "#e5e7eb",
}));

const borderColorToken = computed(() => borders.value.color);
const borderColorClass = computed(() => {
  const cc = colorClassOrStyle("border", borderColorToken.value);
  return cc.class || "";
});
const borderColorInline = computed(() => {
  const cc = colorClassOrStyle("border", borderColorToken.value);
  return cc.style;
});

const tableStyle = computed(
  () =>
    ({
      tableLayout: cfg.value.tableLayout ?? "auto",
      width: cfg.value.tableWidth ? toPx(cfg.value.tableWidth) : undefined,
      borderCollapse: "collapse",
      // Apply outer border if enabled
      borderStyle: borders.value.outer ? borders.value.style : "none",
      borderWidth: borders.value.outer ? toPx(borders.value.width) : undefined,
      ...(borderColorInline.value || {}),
    } as Record<string, string | undefined>)
);

function rowStyle(r: number) {
  const h = pickRow<Dim>(cfg.value.rowHeights, r);
  return {
    height: h != null ? toPx(h) : undefined,
  };
}
function colStyle(c: number) {
  const w = pickCol<Dim>(cfg.value.colWidths, c);
  return {
    width: w != null ? toPx(w) : undefined,
  };
}

function cellStyle(r: number, c: number) {
  // bg: matrix > per-row > single
  const mBg = pick<string>(cfg.value.bg as string[][] | undefined, r, c);
  const rowBg = pickRow<string>(cfg.value.bg as string[] | undefined, r);
  const colBg = pickCol<string>(cfg.value.bg as string[] | undefined, c); // optional alternate use
  const bgTok = mBg ?? rowBg ?? colBg ?? (typeof cfg.value.bg === "string" ? cfg.value.bg : undefined);
  const bg = colorClassOrStyle("bg", bgTok);

  const mColor = pick<string>(cfg.value.color as string[][] | undefined, r, c);
  const rowColor = pickRow<string>(cfg.value.color as string[] | undefined, r);
  const colColor = pickCol<string>(cfg.value.color as string[] | undefined, c);
  const colorTok = mColor ?? rowColor ?? colColor ?? (typeof cfg.value.color === "string" ? cfg.value.color : undefined);
  const fg = colorClassOrStyle("text", colorTok);

  const pad = cfg.value.cellPadding;
  const padStyle = Array.isArray(pad) ? { padding: `${toPx(pad[0])} ${toPx(pad[1])}` } : pad != null ? { padding: toPx(pad) } : {};

  const borderInline = borders.value.inner
    ? {
        borderStyle: borders.value.style,
        borderWidth: toPx(borders.value.width),
        ...(borderColorInline.value || {}),
      }
    : { border: "none" };

  return {
    ...bg.style,
    ...fg.style,
    ...padStyle,
    ...borderInline,
  };
}

function cellClass(r: number, c: number) {
  // bg/fg classes if provided
  const mBg = pick<string>(cfg.value.bg as string[][] | undefined, r, c);
  const rowBg = pickRow<string>(cfg.value.bg as string[] | undefined, r);
  const colBg = pickCol<string>(cfg.value.bg as string[] | undefined, c);
  const bgTok = mBg ?? rowBg ?? colBg ?? (typeof cfg.value.bg === "string" ? cfg.value.bg : undefined);
  const bg = colorClassOrStyle("bg", bgTok);

  const mColor = pick<string>(cfg.value.color as string[][] | undefined, r, c);
  const rowColor = pickRow<string>(cfg.value.color as string[] | undefined, r);
  const colColor = pickCol<string>(cfg.value.color as string[] | undefined, c);
  const colorTok = mColor ?? rowColor ?? colColor ?? (typeof cfg.value.color === "string" ? cfg.value.color : undefined);
  const fg = colorClassOrStyle("text", colorTok);

  // text align: single | per-column | matrix
  let alignTok: Align | undefined;
  if (Array.isArray(cfg.value.textAlign)) {
    if (Array.isArray(cfg.value.textAlign[0])) {
      alignTok = (cfg.value.textAlign as Align[][])[r]?.[c];
    } else {
      alignTok = (cfg.value.textAlign as Align[])[c]; // default: per-column
    }
  } else if (typeof cfg.value.textAlign === "string") {
    alignTok = cfg.value.textAlign as Align;
  }

  const alignClass = alignTok === "center" ? "rt-center" : alignTok === "right" ? "rt-right" : "rt-left";

  const borderClass = borders.value.inner && borderColorClass.value ? borderColorClass.value : "";

  return ["rt-cell", alignClass, bg.class, fg.class, borderClass].filter(Boolean);
}
</script>

<style scoped>
.rt {
  width: max-content;
  background: white;
}
.rt-wrap {
  overflow: auto;
}
/* default cell visuals */
.rt-cell {
  min-width: 6ch;
  line-height: 1.35;
}
/* text alignment helpers */
.rt-left {
  text-align: left;
}
.rt-center {
  text-align: center;
}
.rt-right {
  text-align: right;
}

/* Optional: feel free to remove if you don’t use class-based borders */
</style>
