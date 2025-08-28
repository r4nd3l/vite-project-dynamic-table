// src/table/table.types.ts
export type Row = Record<string, unknown>;
export type SortDir = 'asc' | 'desc' | null;

export type ColumnType =
  | 'text'      // read-only text
  | 'number'
  | 'date'
  | 'money'
  | 'badge'     // pill style
  | 'boolean'   // read-only tick/cross
  | 'component' // mount a custom component
  | 'auto';     // infer from row value at runtime

export type EditorType = 'input' | 'number' | 'textarea' | 'select' | 'switch' | 'date' | 'custom';

export interface ValidatorCtx {
  row: Row;
  key: string;
  value: unknown;
}
export type Validator = (ctx: ValidatorCtx) => string | null;

export interface EditorDef {
  type: EditorType;
  props?: Record<string, unknown>;
  options?: Array<{ label: string; value: unknown }>; // for select
  componentName?: string; // for 'custom' editor; resolve from global or local registry
  validators?: Validator[];
  // If true, commit value on change; otherwise commit on blur/enter (input/textarea)
  instant?: boolean;
}

export interface ColumnDef {
  key: string;               // property on the row
  label: string;             // column header
  type?: ColumnType;         // how to render (defaults to 'auto')
  width?: string;            // e.g. '120px' or '15ch'
  align?: 'left' | 'center' | 'right';
  sticky?: 'left' | 'right';
  visible?: boolean;         // default true
  sortable?: boolean | ((a: Row, b: Row) => number);
  filterable?: boolean;
  // Formatting and parsing (for display vs underlying value)
  format?: (value: unknown, row: Row) => string;
  parse?: (input: unknown, row: Row) => unknown;
  // Editor turns the cell editable
  editor?: EditorDef | null;
  // When type === 'component', you can give a component name (global registry or via slots)
  componentName?: string;
  // Responsive: hide column under certain breakpoints
  responsive?: { sm?: boolean; md?: boolean; lg?: boolean; xl?: boolean }; // if true => hide at that bp
}

export interface RowAction {
  key: string;
  label: string;
  icon?: string; // optional class or name; you can map to your icon system
  confirm?: string; // message for confirm()
  when?: (row: Row) => boolean; // conditionally render
}

export interface TableSchema {
  id: string;              // for caching user prefs, column visibility, etc.
  rowKey: string;          // unique id property in each row (e.g., 'id')
  columns: ColumnDef[];
  rowActions?: RowAction[]; // per-row buttons (edit/delete/custom)
  selection?: 'none' | 'single' | 'multi';
  pageSize?: number;       // default page size
}
