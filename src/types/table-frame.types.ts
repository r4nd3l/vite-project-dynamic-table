// src/types/table-frame.types.ts
import type { Component, FunctionalComponent } from "vue";

export type ClassList = string | string[] | undefined;

export interface RowProps<T = unknown> {
  row: number;
  index: number;
  item: T;
  cols?: number;
  rowClass: string[];
  tdClass: string[];
  isFirstRow: boolean;
  isLastRow: boolean;
  rowAttrs?: Record<string, unknown>;
}

// keep these "broad" to avoid generic invariance at prop boundary
export type RowKeyFn = (item: any, index: number, globalIndex: number) => string | number;
export type RowPropsFn = (item: any, index: number, globalIndex: number) => Record<string, unknown>;
export type RowClassFn = (item: any, index: number, globalIndex: number) => ClassList;

// NEW: structured header entry
export type HeaderLike =
  | string
  | {
      label: string;
      class?: ClassList;
      attrs?: Record<string, unknown>;
    };

export interface RowSource<T = any> {
  items: T[];
  rowComponent?: Component | FunctionalComponent<any>;
  key?: RowKeyFn;
  rowProps?: Record<string, unknown> | RowPropsFn;
  rowClass?: ClassList | RowClassFn;
}

export interface TableFrameProps<T = any> {
  // headers can be strings or structured objects
  headers?: HeaderLike[];

  // either sources, or rows+rowComponent
  sources?: RowSource<T>[];
  rows?: T[];
  rowComponent?: Component | FunctionalComponent<any>;

  wrapperClass?: ClassList;
  tableClass?: ClassList;
  theadClass?: ClassList;
  headerRowClass?: ClassList;
  thClass?: ClassList;
  tbodyClass?: ClassList;
  baseRowClass?: ClassList;
  tdClass?: ClassList;

  // NEW: additional ways to style <th> per column
  thClasses?: ClassList[] | ((label: string, index: number) => ClassList);
  thAttrs?: Record<string, unknown> | ((label: string, index: number) => Record<string, unknown>);

  footerSources?: RowSource<T>[];
}
