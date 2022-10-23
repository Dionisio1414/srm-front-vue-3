<template>
  <shipments-layout :tabs="SHIPMENTS_TABS">
    <shipments-table
      :updated-filter="updatedFilter"
      @update-data="getShipments"
      @reset-filter="resetFilter"
    />
  </shipments-layout>
</template>

<script lang="ts" setup>
import useShipmentsStore from '@/app/shipments/shared/store/shipments-store';
import useNotification from '@/app/shared/services/hooks/notifications';
import useTableClearFilters from '@/app/shared/services/hooks/table-clear-filters';
import useAccessByRole from '@/app/shared/services/hooks/access-by-role';

import { SHIPMENTS_TABS } from '@/app/shipments/shared/config/tabs-constants';

import ShipmentsLayout from '@/app/shipments/shared/components/shipments-layout.vue';
import ShipmentsTable from '@/app/shipments/shared/components/shipments-table.vue';

import { BOOKING_SHIPMENTS_DEFAULT_FILTERS } from '@/app/shared/store/tables-store';

defineEmits(['update-data']);

const shipmentsStore = useShipmentsStore();
const { onCustomError } = useNotification();

const { updatedFilter, clearFilterHandler } = useTableClearFilters({
  defaultFilters: BOOKING_SHIPMENTS_DEFAULT_FILTERS,
  defaultSchema: {},
  key: 'shipments',
});

const { errorCallback } = useAccessByRole();

const getShipments = (hideLoader = false) => {
  shipmentsStore.getShipments(hideLoader).catch((error) => onCustomError(error, errorCallback));
};

const resetFilter = () => clearFilterHandler(getShipments.bind(null, false));

getShipments(Boolean(shipmentsStore.shipments.length));
</script>
