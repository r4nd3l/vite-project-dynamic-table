import type { Component } from "vue";

export type ClassList = string | string[] | undefined;

export interface RowSource<T = unknown> {
  items: T[];
  rowComponent: Component;
  key?: (item: T, index: number) => string | number;
  rowProps?: Record<string, unknown> | ((item: T, index: number, globalIndex: number) => Record<string, unknown>);
  rowClass?: ClassList | ((item: T, index: number, globalIndex: number) => ClassList);
}

export interface TableFrameProps {
  headers?: string[];
  sources: RowSource[];
  rows?: unknown[];
  rowComponent?: Component;

  wrapperClass?: ClassList;
  tableClass?: ClassList;
  theadClass?: ClassList;
  headerRowClass?: ClassList;
  thClass?: ClassList;
  tbodyClass?: ClassList;
  baseRowClass?: ClassList;
  tdClass?: ClassList;

  // additional source for different footer content 
  footerSources?: RowSource[];
}
