<template>
  <div class="links">
    <div class="mb-5 text-xl">
      <span class="font-bold">{{ supplyOrders?.length }}</span>
      {{ $t('supply.supplyLinks.ordersIncluded') }}
    </div>

    <div v-if="supplyOrders?.length" class="flex align-items-center flex-wrap">
      <span class="text-xl mr-4">{{ $t('supply.supplyLinks.srm') }}:</span>
      <supply-order-number
        class="mr-3"
        v-for="(val, index) in supplyOrders"
        :key="index"
        :order-number="val"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import useSupplyStore from '@/app/supply/shared/store/supply-store';

import SupplyOrderNumber from '@/app/supply/shared/components/supply-links/supply-order-number.vue';

const supplyStore = useSupplyStore();

const supplyOrders = computed(() => supplyStore.supplyOrders?.orderNumbers?.filter((el) => el));
</script>
