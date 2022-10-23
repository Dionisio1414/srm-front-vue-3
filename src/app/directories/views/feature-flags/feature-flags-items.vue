<template>
  <data-table
    id="feature-flags"
    data-key="guid"
    :value="isLoading ? new Array(10) : data"
    striped-rows
    responsive-layout="scroll"
    state-key="feature-flags"
    state-storage="local"
    :rows="10"
    removable-sort
    :rows-per-page-options="PER_PAGE_OPTIONS"
    paginator
    paginator-template="
      FirstPageLink PrevPageLink PageLinks NextPageLink
      LastPageLink CurrentPageReport RowsPerPageDropdown
    "
    :current-page-report-template="
      $i18n.locale === 'en'
        ? 'Showing {first} to {last} of {totalRecords} entries'
        : 'Показаны записи с {first} по {last} из {totalRecords}'
    "
    v-model:filters="filters"
    filter-display="menu"
    :global-filter-fields="['feature', 'description', 'is_enabled']"
    v-model:expanded-rows="expandedRows"
    edit-mode="row"
    v-model:editing-rows="editingRows"
    @row-edit-save="onRowEditSave"
  >
    <template #header>
      <div class="flex justify-content-end align-items-center">
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
          @click="exportData('feature-flags')"
        >
          <font-awesome-icon icon="file-excel" size="xl" />
        </prime-button>

        <span class="p-input-icon-left my-1 ml-auto">
          <i class="pi pi-search" />

          <input-text
            v-model="filters['global'].value"
            :placeholder="$t('placeholders.search')"
            class="w-18rem"
          />
        </span>
      </div>
    </template>

    <template #empty>
      <div class="p-3 text-4xl">
        {{ $t('directories.noFound') }}
      </div>
    </template>

    <template #loading>
      {{ $t('directories.loading') }}
    </template>

    <column :row-editor="true" style="width: 7rem" class="py-0" body-style="text-align: center;" />

    <column
      v-if="getColumnData('feature')?.default || columnIsSelected('feature')"
      sortable
      :field="getColumnData('feature')?.key"
      :header="$t(getColumnData('feature')?.title)"
      style="min-width: 10rem"
    >
      <template #body="{ data, field }">
        <template v-if="!isLoading">
          {{ data[field] }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="getColumnData('description')?.default || columnIsSelected('description')"
      sortable
      :field="getColumnData('description')?.key"
      :header="$t(getColumnData('description')?.title)"
      class="py-0"
      style="width: 40rem"
    >
      <template #body="{ data, field }">
        <template v-if="!isLoading">
          {{ data[field] }}
        </template>

        <skeleton v-else />
      </template>

      <template #editor="{ data, field }">
        <input-text v-model="data[field]" class="p-inputtext-xs w-30rem" />
      </template>
    </column>

    <column
      v-if="getColumnData('active')?.default || columnIsSelected('active')"
      sortable
      :field="getColumnData('active')?.key"
      :header="$t(getColumnData('active')?.title)"
      style="min-width: 10rem"
    >
      <template #body="{ data, field }">
        <template v-if="!isLoading">
          <span class="absolute opacity-0">{{ data[field] }}</span>
          <checkbox :model-value="data[field]" :binary="true" class="pointer-events-none" />
        </template>

        <skeleton v-else />
      </template>

      <template #editor="{ data, field }">
        <checkbox v-model="data[field]" :binary="true" />
      </template>
    </column>
  </data-table>
</template>

<script lang="ts" setup>
import { Ref, ref } from 'vue';

import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';

import cloneDeep from 'lodash.clonedeep';
import { library } from '@fortawesome/fontawesome-svg-core';

import { faFilter, faFileExcel, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';

import DataTable from 'primevue/datatable';
import PrimeButton from 'primevue/button';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import InputText from 'primevue/inputtext';
import Column from 'primevue/column';
import Checkbox from 'primevue/checkbox';
import Skeleton from 'primevue/skeleton';

import useInfoStore from '@/app/shared/store/info-store';
import useGetData from '@/app/directories/shared/services/hooks/getData';
import useTableColumns from '@/app/shared/services/hooks/table-columns';
import useExportTableData from '@/app/shared/services/hooks/export-table-data';
import useStaticTableClearFilters from '@/app/shared/services/hooks/static-table-clear-filter';

import { changeFeatureStatus } from '@/app/shared/services/api/info-api';

import { PER_PAGE_OPTIONS } from '@/app/shared/store/tables-store';
import {
  FEATURE_FLAGS_FIELDS,
  STORAGE_KEYS,
} from '@/app/directories/shared/config/table-fields-constants';
import { FILTERS_CONSTANTS } from '@/app/directories/shared/config/filters-scheme-constants';

import type { FiltersConstants } from '@/app/directories/shared/config/filters-scheme-constants';
import { FeatureFlag } from '@/@types/additional.js';

library.add(faFilter, faFileExcel, faFilterCircleXmark);

const toast = useToast();
const { t } = useI18n();
const infoStore = useInfoStore();

const editingRows = ref([]);

const { exportData } = useExportTableData();
const { getColumnData, columnIsSelected } = useTableColumns(
  FEATURE_FLAGS_FIELDS,
  STORAGE_KEYS.FEATURE_FLAGS_COLUMNS
);

const filters: Ref<FiltersConstants> = ref(cloneDeep(FILTERS_CONSTANTS));

const { updatedFilter } = useStaticTableClearFilters();

const resetFiltersHandler = () => {
  filters.value = cloneDeep(FILTERS_CONSTANTS);
};

const { isLoading, data, getData } = useGetData('featureFlags', infoStore.getFeatureFlags);

const onRowEditSave = async ({ newData, index }: { newData: FeatureFlag; index: number }) => {
  const initialData = cloneDeep(data.value[index]);
  const { feature, is_enabled, description } = newData;

  data.value[index] = { ...data.value[index], feature, is_enabled, description };

  try {
    const response = await changeFeatureStatus({ feature, is_enabled, description });

    data.value[index] = response;

    toast.add({
      severity: is_enabled ? 'success' : 'warn',
      detail: is_enabled ? t('messages.featureEnabled') : t('messages.featureDisabled'),
      life: 5000,
    });
  } catch (error) {
    data.value[index] = initialData;

    toast.add({
      severity: 'error',
      detail: is_enabled ? t('messages.featureEnableIssues') : t('messages.featureDisableIssues'),
      life: 5000,
    });
  }
};

getData();
</script>
