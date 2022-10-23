<template>
  <data-table
    :data-key="getColumnData('ports')?.default ? 'countryId' : 'id'"
    :value="isLoading ? new Array(10) : data"
    striped-rows
    responsive-layout="scroll"
    :state-key="stateKey || `directories-table-${storageKey}`"
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
    :global-filter-fields="[
      'id',
      'name',
      'guid',
      'description',
      'countryId',
      'countryName',
      'type',
    ]"
    v-model:expanded-rows="expandedRows"
  >
    <template #header>
      <div class="flex justify-content-end align-items-center">
        <slot
          name="waysFilter"
          :export-data="exportData"
          :updated-filter="updatedFilter"
          :reset-filters-handler="resetFiltersHandler"
          :filters="filters"
        />

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

    <column
      v-if="getColumnData('ports')?.default || columnIsSelected('ports')"
      expander
      :header-style="{ width: '3rem' }"
    />

    <column
      v-if="getColumnData('id')?.default || columnIsSelected('id')"
      sortable
      :field="getColumnData('id')?.key"
      :header="$t(getColumnData('id')?.title)"
      style="min-width: 10rem"
    >
      <template #body="{ data }">
        <template v-if="!isLoading">
          {{ data[getColumnData('id')?.key] }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="getColumnData('value')?.default || columnIsSelected('value')"
      sortable
      :field="getColumnData('value')?.key"
      :header="$t(getColumnData('value')?.title)"
      style="min-width: 10rem"
    >
      <template #body="{ data }">
        <template v-if="!isLoading">
          {{ data[getColumnData('value')?.key] }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <template
      v-if="getColumnData('ports')?.default || columnIsSelected('ports')"
      #expansion="{ data }"
    >
      <div class="subtable-wrapper">
        <directories-inner-table
          :data="data.ports"
          :is-loading="isLoading"
          :state-key="`inner-table-${data.countryId}-${STORAGE_KEYS.PORT_PORTS_INNER_COLUMNS}`"
          :storage-key="STORAGE_KEYS.PORT_PORTS_INNER_COLUMNS"
          :fields="PORT_PORTS_INNER_FIELDS"
        />
      </div>
    </template>
  </data-table>
</template>

<script lang="ts" setup>
import { PropType, Ref, ref } from 'vue';

import cloneDeep from 'lodash.clonedeep';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Skeleton from 'primevue/skeleton';

import DirectoriesInnerTable from './directories-inner-table.vue';

import useTableColumns from '@/app/shared/services/hooks/table-columns';
import useExportTableData from '@/app/shared/services/hooks/export-table-data';
import useStaticTableClearFilters from '@/app/shared/services/hooks/static-table-clear-filter';

import { PER_PAGE_OPTIONS } from '@/app/shared/store/tables-store';
import {
  PORT_PORTS_INNER_FIELDS,
  STORAGE_KEYS,
} from '@/app/directories/shared/config/table-fields-constants';
import { FILTERS_CONSTANTS } from '@/app/directories/shared/config/filters-scheme-constants';

import type { TableField } from '@/@types/table';
import type { FiltersConstants } from '@/app/directories/shared/config/filters-scheme-constants';

const props = defineProps({
  data: { type: Array, required: true },
  stateKey: { type: String, default: () => '' },
  isLoading: { type: Boolean, required: true },
  storageKey: { type: String, required: true },
  fields: { type: Array as PropType<(TableField & { key: string })[]>, required: true },
});

const { exportData } = useExportTableData();
const { getColumnData, columnIsSelected } = useTableColumns(props.fields, props.storageKey);

const filters: Ref<FiltersConstants> = ref(cloneDeep(FILTERS_CONSTANTS));

const { updatedFilter } = useStaticTableClearFilters();

const resetFiltersHandler = () => {
  filters.value = cloneDeep(FILTERS_CONSTANTS);
};

const expandedRows = ref([]);
</script>
