import type { Component } from "vue";

export type ClassList = string | string[] | undefined;

export interface RowSource<T = unknown> {
  /** The items to loop (one <tr> per item). */
  items: T[];
  /** Component that must render exactly one <tr>. */
  rowComponent: Component;
  /** Unique key for each item (recommended). */
  key?: (item: T, index: number) => string | number;
  /** Extra props for the row component (static or per item). */
  rowProps?: Record<string, unknown> | ((item: T, index: number, globalIndex: number) => Record<string, unknown>);
  /** Extra classes for the <tr> root (single or per-item). */
  rowClass?: ClassList | ((item: T, index: number, globalIndex: number) => ClassList);
}

export interface TableFrameProps {
  /** Optional column titles (thead). If omitted, you control header via slot or leave it blank. */
  headers?: string[];
  /** Drive tbody via “sources” (supports many loops). */
  sources: RowSource[];
  /** If you want a single loop, you can pass a convenience source: rows + rowComponent. */
  rows?: unknown[];
  rowComponent?: Component;

  // class-only styling
  wrapperClass?: ClassList;
  tableClass?: ClassList;
  theadClass?: ClassList;
  headerRowClass?: ClassList;
  thClass?: ClassList;
  tbodyClass?: ClassList;
  /** Base class(es) applied to every <tr> unless row source overrides. */
  baseRowClass?: ClassList;
  /** A base class applied to each <td> — pass it down to row components if you want unified cell spacing. */
  tdClass?: ClassList;
}
