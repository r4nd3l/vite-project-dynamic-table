<template>
  <!-- static row at the top: render once -->
  <tr v-if="isFirstRow" v-bind="$attrs">
    <td :class="tdClass">1</td>
    <td :class="tdClass">2</td>
    <td :class="tdClass">3</td>
  </tr>
  <!-- dynamic row: render for every data item -->
  <tr :class="rowClass" v-bind="$attrs">
    <td :class="tdClass">{{ item.name }}</td>
    <td :class="tdClass">{{ item.team }}</td>
    <td :class="[...tdClass, 'text-left']">{{ item.role }}</td>
  </tr>
  <!-- static row at the bottom: render once -->
  <tr v-if="isLastRow" v-bind="$attrs">
    <td :class="tdClass">1</td>
    <td :class="tdClass">2</td>
    <td :class="tdClass">3</td>
  </tr>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });
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
  rowAttrs?: Record<string, any>;
}>();
</script>
