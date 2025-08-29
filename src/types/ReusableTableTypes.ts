export type Dim = number | string;
export type Align = "left" | "center" | "right";

/**
 * A very simple, prop-driven config.
 * All style-like fields accept:
 *  - a single value  -> apply everywhere
 *  - a 1D array      -> per-row for rowHeights/bg/color, per-column for colWidths/textAlign
 *  - a 2D matrix     -> per-cell
 * Colors may be hex/rgb/hsl (inline) or a utility class (e.g. 'bg-sky-50', 'text-red-600').
 */
export interface TableConfig {
  rows?: number;
  cols?: number;
  data?: (string | number | null)[][]; // explicit grid (overrides rows/cols)
  defaultContent?: string | ((row: number, col: number) => string);

  // sizing
  rowHeights?: Dim | Dim[]; // numbers => px
  colWidths?: Dim | Dim[];
  cellPadding?: Dim | [Dim, Dim]; // y or [y,x]
  tableLayout?: "auto" | "fixed"; // default 'auto'
  tableWidth?: Dim; // e.g. '100%', '800px'

  // colors/align
  bg?: string | string[] | string[][];
  color?: string | string[] | string[][];
  textAlign?: Align | Align[] | Align[][];

  // borders
  borders?: {
    inner?: boolean; // default: true
    outer?: boolean; // default: true
    width?: Dim; // default: 1
    style?: "solid" | "dashed" | "dotted" | "double";
    color?: string; // hex/rgb OR a class like 'border-gray-300'
  };

  // misc
  className?: string; // extra table classes
}
