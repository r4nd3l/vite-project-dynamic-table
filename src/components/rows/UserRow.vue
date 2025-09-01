<template>
  <tr :class="rowClass">
    <td :class="tdClass">{{ item.name }}</td>
    <td :class="tdClass">{{ item.team }}</td>
    <td :class="[...tdClass, 'text-left']">{{ item.role }}</td>
  </tr>
</template>

<script setup lang="ts">
defineProps<{
  row: number;
  index: number;
  item: { id: number; name: string; team: string; role: string };
  cols?: number;
  rowClass: string[];
  tdClass: string[];
}>();
</script>
