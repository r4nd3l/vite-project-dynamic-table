/**
 * CLASS-ONLY CONFIG (no inline styles)
 *
 * - Provide `rows` & `cols` OR a `data` matrix (data takes precedence)
 * - `defaultContent`: string or (r,c) => string, used when data is absent for a cell
 * - `headers`: optional array of column titles (used when showHeader = true)
 *
 * All styling is via **classes only**:
 * - wrapperClass: classes on outer <div>
 * - tableClass:   classes on <table>
 * - headerClass:  string for all headers OR array per-column (each entry may be a string or array)
 * - rowClass:     string for all rows OR array per-row
 * - colClass:     string for all columns OR array per-column (applied to each cell in that column)
 * - cellClass:    string for all cells OR 2D matrix [row][col]
 *
 * You can pass space-delimited strings ("p-2 border") or arrays (["p-2","border"])
 */
export interface TableConfig {
  rows?: number;
  cols?: number;
  data?: (string | number | null)[][];
  defaultContent?: string | ((row: number, col: number) => string);

  showHeader?: boolean;
  headers?: (string | null | undefined)[];

  // class-only styling
  wrapperClass?: ClassList;
  tableClass?: ClassList;
  headerClass?: ClassList | PerColClassList;
  rowClass?: ClassList | PerRowClassList;
  colClass?: ClassList | PerColClassList;
  cellClass?: ClassList | (ClassList | undefined)[][];
}

export type ClassList = string | string[];
export type PerRowClassList = (ClassList | undefined)[];
export type PerColClassList = (ClassList | undefined)[];
