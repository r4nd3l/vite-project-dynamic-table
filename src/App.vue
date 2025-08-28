<template>
  <main style="padding: 1rem; max-width: 1200px; margin: 0 auto">
    <h1>Universal Table — Users</h1>
    <UniversalTable :rows="rows" v-model="rows" :schema="schema" :selected="selected" @update:selected="selected = $event" @row-action="onRowAction" @cell-edit="onCellEdit">
      <!-- Example: custom header and a custom cell for 'plan' -->
      <template #header-plan="{ column }">
        <span>{{ column.label }} 🌐</span>
      </template>

      <template #cell-plan="{ row, column, edit }">
        <!-- demonstrate custom slot override -->
        <select class="txt" :value="row.plan" @change="edit(column, row, ($event.target as HTMLSelectElement).value)">
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="team">Team</option>
        </select>
      </template>
    </UniversalTable>

    <pre>Selected: {{ selected }}</pre>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import UniversalTable from "./table/UniversalTable.vue";
import { usersSchema, seedUsers } from "./example/users.schema";

const schema = usersSchema;
const rows = ref(seedUsers);
const selected = ref<Array<number | string>>([]);

function onRowAction(e: { action: string; row: any }) {
  if (e.action === "impersonate") {
    alert(`Impersonating ${e.row.email}`);
  }
  if (e.action === "delete") {
    rows.value = rows.value.filter((r) => r.id !== e.row.id);
  }
}
function onCellEdit(e: { row: any; column: any; value: unknown }) {
  // persist via API here
  console.log("cell-edit", e);
}
</script>
