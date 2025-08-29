import type { TableConfig } from "../types/ReusableTableTypes";
import CustomRow02 from "../components/CustomRow02.vue";

const people = [
  { name: "Alice", age: 30, city: "New York" },
  { name: "Bob", age: 25, city: "Los Angeles" },
  { name: "Charlie", age: 35, city: "Chicago" },
];

export const ReusableTableConfiguration04: TableConfig = {
  data: people.map((p) => [p.name, p.age, p.city]),
  showHeader: true,
  headers: ["Name", "Age", "City"],
  wrapperClass: ["border border-gray-300 p-4 bg-white shadow-md rounded-md"],
  tableClass: "border border-gray-600 rounded-md",
  headerClass: ["bg-gray-300", "bg-gray-400", "bg-gray-500"],
  // rowClass: ["bg-green-300", "bg-green-400", "bg-green-300"],
  colClass: ["p-4 font-bold text-red-500", "p-4 font-bold text-blue-500", "p-4 font-bold text-purple-500"],

  rowComponent: CustomRow02,
  rowComponentProps: (row) => ({ person: people[row] }),
};
