import type { Component, FunctionalComponent } from 'vue'

export type ClassList = string | string[] | undefined

/** Props a row renderer receives (still strongly typed for your own FCs/SFCs) */
export interface RowProps<T = unknown> {
  row: number            // global index
  index: number          // index within source
  item: T
  cols?: number
  rowClass: string[]
  tdClass: string[]
  isFirstRow: boolean
  isLastRow: boolean
  rowAttrs?: Record<string, unknown>
}

/** Callback shapes (use `any` to stay assignable across generics) */
export type RowKeyFn = (item: any, index: number, globalIndex: number) => string | number
export type RowPropsFn = (item: any, index: number, globalIndex: number) => Record<string, unknown>
export type RowClassFn = (item: any, index: number, globalIndex: number) => ClassList

/** A logical group of rows to render */
export interface RowSource<T = any> {
  items: T[]
  /**
   * Optional row renderer. If omitted, TableFrame expects the consumer
   * to provide a `#row` scoped slot.
   *
   * NOTE: we keep this broad to avoid invariance issues at the prop boundary.
   * You can still build strongly typed row components using RowProps<T> in your own code.
   */
  rowComponent?: Component | FunctionalComponent<any>
  key?: RowKeyFn
  rowProps?: Record<string, unknown> | RowPropsFn
  rowClass?: ClassList | RowClassFn
}

/** Props for TableFrame */
export interface TableFrameProps<T = any> {
  headers?: string[]

  /** Either use `sources`, or `rows` + `rowComponent` (TableFrame will normalize). */
  sources?: RowSource<T>[]
  rows?: T[]
  rowComponent?: Component | FunctionalComponent<any>

  wrapperClass?: ClassList
  tableClass?: ClassList
  theadClass?: ClassList
  headerRowClass?: ClassList
  thClass?: ClassList
  tbodyClass?: ClassList
  baseRowClass?: ClassList
  tdClass?: ClassList

  /** Optional extra groups to render as a footer/tfoot if you add it later */
  footerSources?: RowSource<T>[]
}
