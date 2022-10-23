<template>
  <div class="flex align-items-center flex-wrap gap-2 p-2">
    <template v-if="orderNumbers?.length">
      <template v-for="(val, index) in orderNumbers" :key="index">
        <span v-if="index !== 0" class="absolute opacity-0">&nbsp;/&nbsp;</span>

        <orders-srm-item :order-number="val" />
      </template>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { PropType, computed } from 'vue';

import OrdersSrmItem from '@/app/shared/components/orders-srm/orders-srm-item.vue';
import type { SuppliesOrders } from '@/@types/supplies';

const props = defineProps({
  supplyGuid: { type: String, required: true },
  suppliesOrders: { type: Array as PropType<SuppliesOrders[]>, required: true, default: () => [] },
});

const orderNumbers = computed(() =>
  props.suppliesOrders
    .find((item: SuppliesOrders) => item.supplyGuid === props.supplyGuid)
    ?.orderNumbers.filter((item) => item)
);
</script>
