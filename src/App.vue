<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-6xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg p-6">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-gray-800">Document Requirements Table</h1>
          <p class="text-gray-600 mt-2">Manage your document requirements with customizable rows</p>
        </div>

        <!-- Table Controls -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">Document Requirements</h2>

          <!-- Statistics -->
          <div v-if="rows.length > 0" class="mt-6 text-sm text-gray-600">
            Total requirements: {{ rows.length }} | Required: {{ requiredCount }} | Optional: {{ optionalCount }}
          </div>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50">
                <th class="text-left font-medium text-gray-700 py-4 px-4 border-b">Text</th>
                <th class="text-left font-medium text-gray-700 py-4 px-4 border-b">Type</th>
                <th class="text-left font-medium text-gray-700 py-4 px-4 border-b">Checkbox</th>
                <th class="text-left font-medium text-gray-700 py-4 px-4 border-b">Dropdown</th>
                <th class="text-center font-medium text-gray-700 py-4 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              <!-- Dynamic Row Components -->
              <component
                :is="TableRow"
                v-for="(row, index) in rows"
                :key="row.id"
                :row-data="row"
                :index="index"
                @update:row="updateRow"
                @remove:row="removeRow"
                @log:item="logItem"
              />
            </tbody>
          </table>

          <!-- Empty State -->
          <div v-if="rows.length === 0" class="text-center py-12 text-gray-500">
            <svg class="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            <p class="mt-4 text-lg">No requirements found</p>
            <p class="text-sm">Click "Add New Requirement" to create your first requirement</p>
          </div>
        </div>

        <button
          @click="addNewRow"
          class="flex items-center mt-8 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors capitalize"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add New Requirement
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import TableRow from "./components/TableRow.vue";

// Sample initial data
const initialRows = [
  { id: 1, text: "ID Document", type: "required", checkbox: true, dropdown: "file01" },
  { id: 2, text: "Proof of Address", type: "optional", checkbox: false, dropdown: "file02" },
  { id: 3, text: "Bank Statement", type: "required", checkbox: true, dropdown: "file03" },
];

const rows = ref([...initialRows]);
let nextId = ref(4); // Starting ID for new rows

// Computed properties for statistics
const requiredCount = computed(() => rows.value.filter((row) => row.type === "required").length);

const optionalCount = computed(() => rows.value.filter((row) => row.type === "optional").length);

// Add a new empty row
const addNewRow = () => {
  const newRow = {
    id: nextId.value++,
    text: "",
    type: "optional",
    checkbox: false,
    dropdown: "file01",
  };
  rows.value.push(newRow);
};

interface RowData {
  id: number;
  text: string;
  type: "required" | "optional";
  checkbox: boolean;
  dropdown: string;
}

// Update a specific row
const updateRow = (index: number, updatedData: Partial<RowData>) => {
  rows.value[index] = { ...rows.value[index], ...updatedData };
};

// Remove a specific row
const removeRow = (index: number) => {
  rows.value.splice(index, 1);
};

// Log item to console
const logItem = (index: number) => {
  const item = rows.value[index];
  console.log(`Item ${index + 1}:`, item);
};

// Optionally expose methods to parent components
defineExpose({
  addNewRow,
  getRowCount: () => rows.value.length,
  getRows: () => rows.value,
});
</script>

<style scoped>
tr:last-child td {
  border-bottom: none !important;
}
</style>
