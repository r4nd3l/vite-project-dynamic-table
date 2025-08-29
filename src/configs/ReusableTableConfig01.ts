import type { TableConfig } from "../types/ReusableTableTypes";
import Pill from "../components/Pill.vue";

export const ReusableTableConfiguration01: TableConfig = {
  /*
    Table dimensions, if so.
    Not recommended to set,
    "data" will handle as it is
    */
  //   rows: 3,
  //   cols: 3,

  /*
    "data" is a static(!) representation of the table's content
    "data" content will be overridden if the "cellContent" is set
    Also "data" is the **map** of the table
  */
  data: [
    ["Alice", "Engineering", "Lead"],
    ["Béla", "Design", "IC"],
    ["Cecilia", "Finance", "Mgr"],
    ["Cecilia", "Finance", "Mgr"],
  ],
  showHeader: true,
  headers: ["Name", "Team", "Role"],
  //
  wrapperClass: ["border border-gray-300 p-4 bg-white shadow-md rounded-md"],
  tableClass: "border border-gray-300 rounded-md",
  headerClass: ["bg-gray-300", "bg-gray-400", "bg-gray-500"],
  rowClass: ["bg-green-300", "bg-gray-500", "bg-blue-300", "bg-blue-300"],
  colClass: [
    "p-2 border border-gray-200 text-left",
    "p-2 border border-gray-200 text-center",
    "p-2 border border-gray-200 text-right bg-gray-200",
    "p-2 border border-gray-200 text-right bg-teal-200",
  ],

  // (1) Static per-cell override (matrix)
  cellClass: [
    ["bg-red-500", undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
  ],

  // (2) Dynamic per-column content
  // component(s) or native elements per column use "undefined" for no content

  cellContent: [
    // Column 0 -> Pill with the cell's text
    {
      is: Pill,
      class: "mr-2",
      props: ({ value }) => ({
        text: String(value),
        _class: "bg-indigo-600 text-white",
      }),
    },

    // Column 1 -> nothing special (uses default text)
    {
      is: "span",
      class: "px-2 py-1 text-xs border rounded bg-red-300",
      props: () => ({
        type: "span",
      }),
      text: "Span text",
    },

    // Column 2 -> a native button
    {
      is: "button",
      class: "px-2 py-1 text-xs border rounded bg-red-300",
      props: ({ row, value }) => ({
        // You can pass DOM listeners right here
        onClick: () => alert(`Row ${row + 1} role: ${value}`),
        type: "button",
      }),
      text: "Edit button",
    },
  ],
};
