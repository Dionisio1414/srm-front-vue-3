<template>
  <supplier-supplies-table
    :updated-filter="updatedFilter"
    @update-data="getProducts"
    @reset-filter="resetFilter"
  />
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

import useSupplierSuppliesStore from '@/app/supplier/shared/store/supplier-supplies-store';
import useInfoStore from '@/app/shared/store/info-store';
import useNotification from '@/app/shared/services/hooks/notifications';
import useTableClearFilters from '@/app/shared/services/hooks/table-clear-filters';

import { SUPPLIER_SUPPLY_DEFAULT_FILTERS } from '@/app/shared/store/tables-store';

import SupplierSuppliesTable from '@/app/supplier/shared/components/supplier-supplies-table.vue';

import type { CustomError } from '@/app/shared/services/hooks/notifications';
import type { SupplyProduct } from '@/@types/product';

const suppliesStore = useSupplierSuppliesStore();
const infoStore = useInfoStore();
const route = useRoute();
const { onError, onCustomError } = useNotification();
const { updatedFilter, clearFilterHandler } = useTableClearFilters({
  defaultFilters: SUPPLIER_SUPPLY_DEFAULT_FILTERS,
  defaultSchema: {},
  key: 'supplierSupplies',
});

const getProducts = async (hideLoader = false, loadAdditionalData = false) => {
  try {
    await suppliesStore.getSupplies(route.params.guid as string, hideLoader);

    if (loadAdditionalData) {
      const supplyGuids = suppliesStore.supplies.map(
        (item: SupplyProduct) => item.guid
      ) as string[];

      await infoStore.getSuppliesOrders({ supplyGuids });
    }
  } catch (error) {
    onCustomError(error as CustomError);
  }
};

const resetFilter = () => clearFilterHandler(getProducts);

infoStore.getSupplyStatuses().catch((error) => onError(error));
getProducts(Boolean(suppliesStore.supplies.length), true);
</script>
