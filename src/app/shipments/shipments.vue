<template>
  <base-template :tabs="BASE_TABS" :exact="false" :default-navigation="false">
    <template #title>
      {{ $t(`shipments.titles.shipments`) }}
    </template>

    <template #default>
      <router-view />
    </template>
  </base-template>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useRoute } from 'vue-router';

import useInfoStore from '@/app/shared/store/info-store';
import useTablesStore from '@/app/shared/store/tables-store';
import useNotification from '@/app/shared/services/hooks/notifications';

import BaseTemplate from '@/app/shared/components/base-template.vue';

import { BASE_TABS } from './shared/config/tabs-constants';

const route = useRoute();
const infoStore = useInfoStore();
const tablesStore = useTablesStore();
const { onCustomError } = useNotification();

const wayIds = computed(() => infoStore.ways.map((way) => way.id));
const countryIds = computed(() => infoStore.countries.map((country) => country.id));

const getAdditionalData = async () => {
  infoStore.getLoadingTypes().catch((error) => onCustomError(error));
  infoStore.getWays().catch((error) => onCustomError(error));
  infoStore.getCountries({ way_ids: wayIds.value }).catch((error) => onCustomError(error));
  infoStore
    .getPorts({ way_ids: wayIds.value, country_ids: countryIds.value })
    .catch((error) => onCustomError(error));
};

getAdditionalData();

tablesStore.setFilters('shipments', {
  ...tablesStore.shipments.filters,
  statusId: route.meta.statusId as number,
});
</script>
