<template>
  <data-table
    id="ports-items"
    :data-key="getColumnData('ports')?.default ? 'countryId' : 'id'"
    :value="isLoading ? new Array(10) : data"
    striped-rows
    responsive-layout="scroll"
    :state-key="stateKey || `directories-table-${storageKey}`"
    state-storage="local"
    :rows="10"
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
        <prime-button
          type="button"
          class="p-button-outlined relative flex align-items-center justify-content-center p-0 my-1"
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
          class="flex align-items-center justify-content-center p-0 my-1 ml-3 mr-auto"
          style="width: 2.8125rem; height: 2.8125rem"
          @click.stop="exportData('ports-items')"
        >
          <font-awesome-icon icon="file-excel" size="xl" />
        </prime-button>
        <!-- eslint-enable max-len -->

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
      {{ $t('directories.noFound') }}
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
      style="min-width: 10rem; width: 10rem"
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
      style="min-width: 10rem; width: 10rem"
    >
      <template #body="{ data }">
        <template v-if="!isLoading">
          {{ data[getColumnData('value')?.key] }}
        </template>

        <skeleton v-else />
      </template>
    </column>
  </data-table>
</template>

<script lang="ts" setup>
import { PropType, Ref, ref } from 'vue';

import cloneDeep from 'lodash.clonedeep';
import { library } from '@fortawesome/fontawesome-svg-core';

import { faFilter, faFileExcel, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';

import PrimeButton from 'primevue/button';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Skeleton from 'primevue/skeleton';

import useTableColumns from '@/app/shared/services/hooks/table-columns';
import useExportTableData from '@/app/shared/services/hooks/export-table-data';
import useStaticTableClearFilters from '@/app/shared/services/hooks/static-table-clear-filter';

import { PER_PAGE_OPTIONS } from '@/app/shared/store/tables-store';
import { FILTERS_CONSTANTS } from '@/app/directories/shared/config/filters-scheme-constants';

import type { TableField } from '@/@types/table';
import type { FiltersConstants } from '@/app/directories/shared/config/filters-scheme-constants';

library.add(faFilter, faFileExcel, faFilterCircleXmark);

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
