<template>
  <tr class="group hover:bg-gray-50 transition-colors">
    <!-- Text Input -->
    <td class="py-4 px-4 border-b">
      <input
        v-model="localRow.text"
        type="text"
        placeholder="Enter requirement text"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        @input="emitUpdate"
      />
    </td>

    <!-- Type Radio Buttons -->
    <td class="py-4 px-4 border-b">
      <div class="flex space-x-4">
        <label class="flex items-center space-x-2 cursor-pointer">
          <input type="radio" v-model="localRow.type" value="required" class="w-4 h-4 text-blue-600 focus:ring-blue-500" @change="emitUpdate" />
          <span class="text-sm text-gray-700">Required</span>
        </label>
        <label class="flex items-center space-x-2 cursor-pointer">
          <input type="radio" v-model="localRow.type" value="optional" class="w-4 h-4 text-blue-600 focus:ring-blue-500" @change="emitUpdate" />
          <span class="text-sm text-gray-700">Optional</span>
        </label>
      </div>
    </td>

    <!-- Checkbox -->
    <td class="py-4 px-4 border-b">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" v-model="localRow.checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" @change="emitUpdate" />
        <span class="ml-2 text-sm text-gray-700">
          {{ localRow.checkbox ? "Checked" : "Unchecked" }}
        </span>
      </label>
    </td>

    <!-- Dropdown Select -->
    <td class="py-4 px-4 border-b">
      <select
        v-model="localRow.dropdown"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        @change="emitUpdate"
      >
        <option value="file01">File 01 - Identification</option>
        <option value="file02">File 02 - Address Proof</option>
        <option value="file03">File 03 - Financial</option>
        <option value="file04">File 04 - Employment</option>
        <option value="file05">File 05 - Other</option>
      </select>
    </td>

    <!-- Actions -->
    <td class="py-4 px-4 border-b">
      <div class="flex justify-center space-x-2">
        <!-- Log Button -->
        <button
          @click="logItem"
          class="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          title="Log to Console"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          Log
        </button>

        <!-- Delete Button -->
        <button
          @click="$emit('remove:row', index)"
          class="flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete Requirement"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            ></path>
          </svg>
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  rowData: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update:row", "remove:row", "log:item"]);

// Local copy of row data for editing
const localRow = ref({ ...props.rowData });

// Update parent when local data changes
const emitUpdate = () => {
  emit("update:row", props.index, { ...localRow.value });
};

// Log item to console
const logItem = () => {
  emit("log:item", props.index);
};

// Watch for external changes to rowData
watch(
  () => props.rowData,
  (newVal) => {
    localRow.value = { ...newVal };
  },
  { deep: true }
);
</script>

<style scoped>
input:focus,
select:focus {
  box-shadow: none;
  outline: none;
}
</style>
