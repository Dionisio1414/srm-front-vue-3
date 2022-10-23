<template>
  <directories-table
    id="ways"
    :data="data"
    :is-loading="isLoading"
    :storage-key="STORAGE_KEYS.PORT_WAYS_COLUMNS"
    :fields="PORT_WAYS_FIELDS"
  >
    <template #waysFilter="{ exportData, updatedFilter, resetFiltersHandler, filters }">
      <prime-button
        type="button"
        class="p-button-outlined relative flex align-items-center justify-content-center p-0"
        style="width: 2.8125rem; height: 2.8125rem"
        :disabled="!updatedFilter(filters)"
        @click="resetFiltersHandler"
      >
        <font-awesome-icon
          :icon="!updatedFilter(filters) ? 'filter' : 'filter-circle-xmark'"
          size="xl"
        />
      </prime-button>

      <prime-button
        type="button"
        class="flex align-items-center justify-content-center p-0 ml-3"
        style="width: 2.8125rem; height: 2.8125rem"
        @click.stop="exportData('ways')"
      >
        <font-awesome-icon icon="file-excel" size="xl" />
      </prime-button>

      <prime-button
        type="button"
        class="p-button-success flex align-items-center ml-3"
        style="padding-top: 0.5050625rem; padding-bottom: 0.5050625rem"
        v-tooltip="{
          value: $t('messages.inDeveloping'),
        }"
      >
        <font-awesome-icon icon="plus" size="xl" class="mr-3" />

        <span class="text-lg">
          {{ $t('directories.buttons.newWay') }}
        </span>
      </prime-button>
    </template>
  </directories-table>
</template>

<script lang="ts" setup>
import { library } from '@fortawesome/fontawesome-svg-core';

import {
  faFilter,
  faFileExcel,
  faFilterCircleXmark,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';

import vTooltip from 'primevue/tooltip';
import PrimeButton from 'primevue/button';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import useInfoStore from '@/app/shared/store/info-store';
import useGetData from '@/app/directories/shared/services/hooks/getData';

import {
  PORT_WAYS_FIELDS,
  STORAGE_KEYS,
} from '@/app/directories/shared/config/table-fields-constants';

import DirectoriesTable from '@/app/directories/shared/components/directories-table.vue';

library.add(faFilter, faFileExcel, faFilterCircleXmark, faPlus);

const infoStore = useInfoStore();

const { isLoading, data, getData } = useGetData('ways', infoStore.getWays);

getData();
</script>
