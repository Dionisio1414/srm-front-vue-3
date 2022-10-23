<template>
  <price-item-info @update-data="getData" />
  <price-item-table @update-data="getData" />
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

import usePriceItemStore from '@/app/price/shared/store/price-item-store';
import useNotification from '@/app/shared/services/hooks/notifications';
import useAccessByRole from '@/app/shared/services/hooks/access-by-role';

import PriceItemInfo from '@/app/price/shared/components/price-item/price-item-info.vue';
import PriceItemTable from '@/app/price/shared/components/price-item/price-item-table.vue';

const route = useRoute();
const priceItemStore = usePriceItemStore();
const { onCustomError } = useNotification();

const { errorCallback } = useAccessByRole();

const getData = () => {
  priceItemStore
    .getPrice(route.params.guid as string)
    .catch((error) => onCustomError(error, errorCallback));
};

getData();
</script>
