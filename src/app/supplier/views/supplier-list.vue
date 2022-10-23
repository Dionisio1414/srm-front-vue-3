<template>
  <supplier-table
    :updated-filter="updatedFilter"
    @update-data="getData"
    @get-products="getProducts"
    @reset-filter="resetFilter"
  />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

import useSupplierStore from '@/app/supplier/shared/store/supplier-store';
import useInfoStore from '@/app/shared/store/info-store';
import useProductionStatus from '@/app/shared/services/hooks/production-status';
import useNotification from '@/app/shared/services/hooks/notifications';
import useTableClearFilters from '@/app/shared/services/hooks/table-clear-filters';
import useTableOrdersCheck from '@/app/shared/services/hooks/table-orders-check';
import useAccessByRole from '@/app/shared/services/hooks/access-by-role';

import { FILTERS_CONSTANTS as SUPPLIER_FILTERS } from '@/app/supplier/shared/config/filters-scheme-constants';
import { SUPPLIERS_DEFAULT_FILTERS } from '@/app/shared/store/tables-store';

import SupplierTable from '@/app/supplier/shared/components/supplier-table.vue';

import type { CustomError } from '@/app/shared/services/hooks/notifications';

const supplierStore = useSupplierStore();
const infoStore = useInfoStore();
const route = useRoute();
const { setDefaultStatus } = useProductionStatus('supplier');
const { updatedFilter, clearFilterHandler } = useTableClearFilters({
  defaultFilters: SUPPLIERS_DEFAULT_FILTERS,
  defaultSchema: SUPPLIER_FILTERS,
  key: 'supplier',
});
const { ordersCheckHandler } = useTableOrdersCheck({
  key: 'supplier',
  defaultFilters: { ...SUPPLIERS_DEFAULT_FILTERS, statusIds: [] },
  defaultSchema: SUPPLIER_FILTERS,
});

const { onCustomError } = useNotification();

const getOrders = (hideLoader: boolean) =>
  supplierStore
    .getOrders(route.params.guid as string, hideLoader)
    .catch((error) => onCustomError(error));

const { errorCallback } = useAccessByRole(clearFilterHandler.bind(null, getOrders));

const getData = async (hideLoader = false) => {
  try {
    await getOrders(hideLoader);
  } catch (error) {
    onCustomError(error as CustomError, errorCallback);
  }
};

const getProducts = (guid: string) => {
  supplierStore.getOrderProducts(guid).catch((error) => onCustomError(error));
};

const resetFilter = () => clearFilterHandler(getData.bind(null, false));

infoStore.getMembers().catch((error) => onCustomError(error));
infoStore.getCompanies().catch((error) => onCustomError(error));

onMounted(async () => {
  await infoStore.getStatuses().catch((error) => onCustomError(error));
  setDefaultStatus();

  getData(Boolean(supplierStore.products.length)).then(() => {
    ordersCheckHandler({
      data: supplierStore.orders,
      init: true,
      callback: getOrders.bind(null, Boolean(supplierStore.products.length)),
    });
  });
});
</script>
