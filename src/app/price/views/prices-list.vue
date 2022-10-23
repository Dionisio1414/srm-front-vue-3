<template>
  <prices-table @update-data="updateData" />
</template>

<script lang="ts" setup>
import usePriceListStore from '@/app/price/shared/store/price-list-store';
import useNotification from '@/app/shared/services/hooks/notifications';
import useAccessByRole from '@/app/shared/services/hooks/access-by-role';

import PricesTable from '@/app/price/shared/components/prices-list/prices-table.vue';

const priceListStore = usePriceListStore();
const { onCustomError } = useNotification();

const { errorCallback } = useAccessByRole();

const updateData = (hideLoader = false) => {
  priceListStore.getPrices(hideLoader).catch((error) => onCustomError(error, errorCallback));
};

updateData(Boolean(priceListStore.prices.length));
</script>
