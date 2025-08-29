import type { TableConfig } from "../types/ReusableTableTypes";
import CustomRow01 from "../components/CustomRow01.vue";

export const ReusableTableConfiguration03: TableConfig = {
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

  // Static per-cell override (matrix)
  cellClass: [
    ["bg-red-500", undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
  ],

  // Row component for the second row only (index 1)
  rowComponent: (row: number) => (row === 1 ? CustomRow01 : null) as typeof CustomRow01 | null,
  rowComponentClass: [], // extra class for the custom row's <tr>
  rowComponentProps: (row) => ({ "data-row": row }), // arbitrary props
};
