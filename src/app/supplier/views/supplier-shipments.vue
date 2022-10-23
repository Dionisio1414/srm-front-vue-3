<template>
  <supplier-shipments-table @update-data="getShipments" />
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useRoute } from 'vue-router';

import useInfoStore from '@/app/shared/store/info-store';
import useSupplierShipmentsStore from '@/app/supplier/shared/store/supplier-shipments-store';
import useNotification from '@/app/shared/services/hooks/notifications';

import SupplierShipmentsTable from '@/app/supplier/shared/components/supplier-shipments-table.vue';

const route = useRoute();
const infoStore = useInfoStore();
const supplierShipmentsStore = useSupplierShipmentsStore();
const { onCustomError } = useNotification();

const wayIds = computed(() => infoStore.ways.map((way) => way.id));
const countryIds = computed(() => infoStore.countries.map((country) => country.id));

const getShipments = (hideLoader = false) => {
  supplierShipmentsStore
    .getShipments(route.params.guid as string, hideLoader)
    .catch((error) => onCustomError(error));
};

const getAdditionalData = async () => {
  infoStore.getWays().catch((error) => onCustomError(error));
  infoStore.getCountries({ way_ids: wayIds.value }).catch((error) => onCustomError(error));
  infoStore
    .getPorts({ way_ids: wayIds.value, country_ids: countryIds.value })
    .catch((error) => onCustomError(error));
};

getShipments(Boolean(supplierShipmentsStore.shipments.length));
getAdditionalData();
</script>
