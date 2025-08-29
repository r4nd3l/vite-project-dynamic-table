<template>
  <tr :class="rowClass">
    <td :class="cellClassOf(0)">{{ person.name }}</td>
    <td :class="cellClassOf(1)">{{ person.age }}</td>
    <td :class="cellClassOf(2)">{{ person.city }}</td>
  </tr>
</template>

<script setup lang="ts">
interface Person {
  name: string;
  age: number;
  city: string;
}

defineProps<{
  row: number;
  cols: number;
  rowClass: string[];
  valueAt: (col: number) => unknown;
  atomsAt: (col: number) => any[];
  cellClassOf: (col: number) => string[];
  person: Person; // injected via rowComponentProps
}>();
</script>
