<template>
  <main class="p-8 space-y-10 max-w-screen-lg mx-auto">
    <section>
      <h2 class="text-lg font-medium mb-2">Dynamic Table</h2>
      <ReusableTable :config="ReusableTableConfiguration01" />
    </section>
    <hr />
    <section>
      <h2 class="text-lg font-medium mb-2">Static Table</h2>
      <ReusableTable :config="ReusableTableConfiguration02" />
    </section>
    <hr />
    <section>
      <h2 class="text-lg font-medium mb-2">Component Table with dynamic cells</h2>
      <ReusableTable :config="ReusableTableConfiguration03" />
    </section>
    <hr />
    <section>
      <h2 class="text-lg font-medium mb-2">Component Table with sample</h2>
      <ReusableTable :config="ReusableTableConfiguration04" />
    </section>
  </main>
</template>

<script setup lang="ts">
import ReusableTable from "./components/ReusableTable.vue";
import { ReusableTableConfiguration01 } from "./configs/ReusableTableConfig01";
import { ReusableTableConfiguration02 } from "./configs/ReusableTableConfig02";
import { ReusableTableConfiguration03 } from "./configs/ReusableTableConfig03";
import { ReusableTableConfiguration04 } from "./configs/ReusableTableConfig04";
</script>
