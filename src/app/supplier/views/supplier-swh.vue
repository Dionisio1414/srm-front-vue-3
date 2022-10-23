<template>
  <supplier-swh-table
    :updated-filter="updatedFilter"
    @update-data="getProducts"
    @reset-filter="resetFilter"
  />
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

import useSupplierSwhStore from '@/app/supplier/shared/store/supplier-swh-store';
import useNotification from '@/app/shared/services/hooks/notifications';
import useTableClearFilters from '@/app/shared/services/hooks/table-clear-filters';

import { SUPPLIER_SWH_DEFAULT_FILTERS } from '@/app/shared/store/tables-store';

import SupplierSwhTable from '@/app/supplier/shared/components/supplier-swh-table.vue';

const route = useRoute();
const supplierSwhStore = useSupplierSwhStore();
const { onCustomError } = useNotification();
const { updatedFilter, clearFilterHandler } = useTableClearFilters({
  defaultFilters: SUPPLIER_SWH_DEFAULT_FILTERS,
  defaultSchema: {},
  key: 'supplierSwh',
});

const getProducts = (hideLoader = false) => {
  supplierSwhStore
    .getSwhProducts(route.params.guid as string, hideLoader)
    .catch((error) => onCustomError(error));
};

const resetFilter = () => clearFilterHandler(getProducts);

getProducts(Boolean(supplierSwhStore.products.length));
</script>
