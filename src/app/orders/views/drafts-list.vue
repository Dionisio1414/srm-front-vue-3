<template>
  <orders-table
    :updated-filter="updatedFilter"
    :type="type"
    @update-data="updateData"
    @change-responsible="changeResponsible($event)"
    @reset-filter="resetFilter(() => $emit('reset-badges'))"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import useListView from '@/app/orders/shared/services/hooks/list-view';

import OrdersTable from '@/app/orders/shared/components/orders-table.vue';

export default defineComponent({
  name: 'DraftsList',

  components: { OrdersTable },

  emits: ['reset-badges'],

  setup() {
    const { type, updateData, changeResponsible, updatedFilter, resetFilter } = useListView();

    return {
      type,
      updateData,
      changeResponsible,
      updatedFilter,
      resetFilter,
    };
  },
});
</script>
