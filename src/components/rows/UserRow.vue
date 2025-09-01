<template>
  <tbody>
    <!-- static row at the top: render once -->
    <tr v-if="isFirstRow">
      <td :class="tdClass">1</td>
      <td :class="tdClass">2</td>
      <td :class="tdClass">3</td>
    </tr>
    <!-- dynamic row: render for every data item -->
    <tr :class="rowClass">
      <td :class="tdClass">{{ item.name }}</td>
      <td :class="tdClass">{{ item.team }}</td>
      <td :class="[...tdClass, 'text-left']">{{ item.role }}</td>
    </tr>
    <!-- static row at the bottom: render once -->
    <tr v-if="isLastRow">
      <td :class="tdClass">1</td>
      <td :class="tdClass">2</td>
      <td :class="tdClass">3</td>
    </tr>
  </tbody>
</template>

<script setup lang="ts">
defineProps<{
  row: number;
  index: number;
  item: { id: number; name: string; team: string; role: string };
  cols?: number;
  rowClass: string[];
  tdClass: string[];

  /** injected by TableFrame */
  isFirstRow: boolean;
  isLastRow: boolean;
}>();
</script>
