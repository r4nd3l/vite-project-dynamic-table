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
  tableClass: "border border-gray-600 rounded-md",
  colClass: ["p-2 border border-gray-200 text-left", "p-2 border border-gray-200 text-center", "p-2 border border-gray-200 text-right"],

  rowComponent: CustomRow02,
  rowComponentProps: (row) => ({ person: people[row] }),
};
