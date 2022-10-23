<template>
  <directories-table
    id="reasons"
    :data="data"
    :is-loading="isLoading"
    :storage-key="STORAGE_KEYS.FORWARDER_REASONS_COLUMNS"
    :fields="FORWARDER_REASONS_FIELDS"
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
        @click.stop="exportData('reasons')"
      >
        <font-awesome-icon icon="file-excel" size="xl" />
      </prime-button>

      <prime-button
        type="button"
        class="p-button-success flex align-items-center mr-auto ml-3"
        style="padding-top: 0.5050625rem; padding-bottom: 0.5050625rem"
        v-tooltip="{
          value: $t('messages.inDeveloping'),
        }"
      >
        <font-awesome-icon icon="plus" size="xl" class="mr-3" />

        <span class="text-lg">
          {{ $t('directories.buttons.newReason') }}
        </span>
      </prime-button>
    </template>
  </directories-table>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useI18n } from 'vue-i18n';
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
  FORWARDER_REASONS_FIELDS,
  STORAGE_KEYS,
} from '@/app/directories/shared/config/table-fields-constants';

import DirectoriesTable from '@/app/directories/shared/components/directories-table.vue';
import { Reason } from '@/@types/additional';

library.add(faFilter, faFileExcel, faFilterCircleXmark, faPlus);

const infoStore = useInfoStore();
const { t } = useI18n();

const { isLoading, getData } = useGetData('reasons', infoStore.getReasons);

const data = computed(() =>
  infoStore.reasons.map((item: Reason) => ({
    ...item,
    description: t(`forwarder.reasons.${item.alias}`),
  }))
);

getData();
</script>
