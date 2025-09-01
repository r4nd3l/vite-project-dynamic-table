<template>
  <tr :class="rowClass">
    <td :class="tdClass">{{ item.name }}</td>
    <td :class="tdClass">{{ item.team }}</td>
    <td :class="[...tdClass, 'text-right']">{{ item.role }}</td>
    <td :class="tdClass">
      <button class="px-2 py-1 text-xs border rounded" @click="$emit('row-action', { type: 'inspect', row, item })">Inspect</button>
    </td>
  </tr>
</template>

<script setup lang="ts">
defineProps<{
  row: number; // global row index
  index: number; // index within this source
  item: { id: number; name: string; team: string; role: string };
  cols?: number;
  rowClass: string[]; // merged by frame
  tdClass: string[]; // shared cell class from frame
}>();
defineEmits<{ (e: "row-action", payload: any): void }>();
</script>
