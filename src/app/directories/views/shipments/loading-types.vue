<template>
  <directories-table
    id="loading-types"
    ref="dt"
    :data="data"
    :is-loading="isLoading"
    :storage-key="STORAGE_KEYS.SHIPMENTS_LOADING_TYPES_COLUMNS"
    :fields="SHIPMENTS_LOADING_TYPES"
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
        @click.stop="exportData('loading-types')"
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
          {{ $t('directories.buttons.newLoadingType') }}
        </span>
      </prime-button>

      <multi-select
        :model-value="wayIds"
        :options="waysOptions"
        option-label="name"
        option-value="id"
        :placeholder="$t('placeholders.way')"
        class="w-18rem my-1 ml-3 mr-auto"
        panel-class="hide-select-all-checkbox"
        @change="changeWayIds($event.value, wayIds)"
      />
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
import MultiSelect from 'primevue/multiselect';
import PrimeButton from 'primevue/button';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import useInfoStore from '@/app/shared/store/info-store';
import useWaysFilter from '@/app/directories/shared/services/hooks/waysFilter';
import useGetData from '@/app/directories/shared/services/hooks/getData';

import {
  SHIPMENTS_LOADING_TYPES,
  STORAGE_KEYS,
} from '@/app/directories/shared/config/table-fields-constants';

import DirectoriesTable from '@/app/directories/shared/components/directories-table.vue';

library.add(faFilter, faFileExcel, faFilterCircleXmark, faPlus);

const infoStore = useInfoStore();

const { isLoading, data, getData } = useGetData('loadingTypes', infoStore.getLoadingTypes);
const { wayIds, waysOptions, changeWayIds } = useWaysFilter(getData);

getData(wayIds.value);
</script>
