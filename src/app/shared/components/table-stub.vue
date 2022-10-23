<template>
  <data-table :value="value" striped-rows responsive-layout="scroll">
    <column
      v-for="(field, index) in fields"
      :key="index"
      :field="field"
      :header="field.toUpperCase()"
    >
      <template #body>
        <skeleton />
      </template>
    </column>
  </data-table>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Skeleton from 'primevue/skeleton';

defineProps({
  value: { type: Array, required: true },
  fields: { type: Array as PropType<string[]>, required: true },
});
</script>
