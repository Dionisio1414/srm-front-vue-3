<template>
  <data-table
    id="supplier-mails"
    lazy
    striped-rows
    data-key="guid"
    :value="supplierMailsStore.loading ? new Array(perPage) : data"
    v-model:filters="filters"
    :sort-field="filtersState.sort.sortKey || ''"
    :sort-order="filtersState.sort.orderBy === 'desc' ? 1 : -1"
    removable-sort
    filter-display="menu"
    responsive-layout="scroll"
    :class="{ 'pointer-events-none': supplierMailsStore.loading }"
    context-menu
    v-model:contextMenuSelection="selectedMails"
    @sort="onSort"
    @row-contextmenu="onRowContextMenu"
  >
    <template #header>
      <div class="flex flex-wrap align-items-center">
        <prime-button
          type="button"
          class="p-button-outlined relative flex align-items-center justify-content-center p-0"
          style="width: 2.8125rem; height: 2.8125rem"
          :disabled="updatedFilter"
          @click="$emit('reset-filter')"
        >
          <font-awesome-icon :icon="updatedFilter ? 'filter' : 'filter-circle-xmark'" size="xl" />
        </prime-button>

        <prime-button
          type="button"
          class="flex align-items-center justify-content-center p-0 ml-3"
          style="width: 2.8125rem; height: 2.8125rem"
          @click="exportData('supplier-mails')"
        >
          <font-awesome-icon icon="file-excel" size="xl" />
        </prime-button>

        <span class="p-input-icon-left my-1 ml-auto">
          <i class="pi pi-search" />

          <input-text
            :model-value="searchString"
            :placeholder="$t('placeholders.search')"
            class="w-18rem"
            @input="onSearch($event.target.value, true)"
          />
        </span>
      </div>
    </template>

    <template #empty>
      <div class="p-3 text-4xl">
        {{ $t('supplierMails.noFound') }}
      </div>
    </template>

    <column
      v-if="showColumn(data, 'name')"
      sortable
      :field="getColumnData('name')?.key"
      :sort-field="getColumnData('name')?.sortKey"
      :header="$t(getColumnData('name')?.title)"
      class="relative"
      style="min-width: 12rem"
    >
      <template #body="{ data, field }">
        <router-link
          v-if="!supplierMailsStore.loading"
          :to="{ name: 'supplier', params: { guid: data.guid } }"
          class="no-underline"
          style="font-size: inherit"
        >
          <prime-button :label="data[field]" class="p-button-link p-0" />
        </router-link>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(data, 'id')"
      sortable
      :field="getColumnData('id')?.key"
      :sort-field="getColumnData('id')?.sortKey"
      :header="$t(getColumnData('id')?.title)"
      class="relative"
      style="min-width: 12rem"
    >
      <template #body="{ data, field }">
        <template v-if="!supplierMailsStore.loading">
          {{ data[field] }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(data, 'mails')"
      sortable
      :field="getColumnData('mails')?.key"
      :sort-field="getColumnData('mails')?.sortKey"
      :header="$t(getColumnData('mails')?.title)"
      class="relative py-0"
      style="min-width: 12rem"
    >
      <template #body="{ data, field, index }">
        <template v-if="!supplierMailsStore.loading">
          <span class="absolute opacity-0">{{ data[field] }}</span>
          <checkbox
            :model-value="data[field]"
            :binary="true"
            @change="
              onCellEditComplete(
                cloneDeep({ ...data, isMailApproved: !data.isMailApproved }),
                index
              )
            "
          />
        </template>

        <skeleton v-else />
      </template>
    </column>
  </data-table>

  <paginator
    :first="(filtersState.page - 1) * filtersState.perPage"
    :rows="Number(filtersState.perPage)"
    :total-records="supplierMailsStore.total"
    :rows-per-page-options="PER_PAGE_OPTIONS"
    template="
      FirstPageLink PrevPageLink PageLinks NextPageLink
      LastPageLink CurrentPageReport RowsPerPageDropdown
    "
    :current-page-report-template="
      $i18n.locale === 'en'
        ? 'Showing {first} to {last} of {totalRecords} entries'
        : 'Показаны записи с {first} по {last} из {totalRecords}'
    "
    :style="supplierMailsStore.loading ? 'pointer-events: none' : ''"
    @page="onPageChange"
  />

  <context-menu ref="cm" :model="menuModel" class="w-20rem" />
</template>

<script lang="ts" setup>
import { computed, onUpdated, PropType, Ref, ref } from 'vue';

import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';

import { library } from '@fortawesome/fontawesome-svg-core';
import cloneDeep from 'lodash.clonedeep';

import {
  faFilter,
  faFileExcel,
  faFloppyDisk,
  faFilterCircleXmark,
} from '@fortawesome/free-solid-svg-icons';

import DataTable from 'primevue/datatable';
import Paginator from 'primevue/paginator';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import PrimeButton from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Skeleton from 'primevue/skeleton';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ContextMenu from 'primevue/contextmenu';

import useTablesStore, { PER_PAGE_OPTIONS } from '@/app/shared/store/tables-store';
import useSupplierMailsStore from '@/app/supplier-mails/shared/store/supplier-mails-store';
import useTableColumns from '@/app/shared/services/hooks/table-columns';
import useTableFilters from '@/app/shared/services/hooks/table-filters';
import useExportTableData from '@/app/shared/services/hooks/export-table-data';
import useTableFiltersObserver from '@/app/shared/services/hooks/table-filters-observer';
import useCopyData from '@/app/shared/services/hooks/copy-data';

import {
  SUPPLIER_MAILS_FIELDS,
  STORAGE_KEY,
} from '@/app/supplier-mails/shared/config/table-fields-constants';

import { changeMailStatus } from '@/app/supplier-mails/shared/services/api';

import type { Filter, Sort } from '@/@types/table';
import type { Callbacks } from '@/app/shared/services/hooks/table-filters';
import type { SupplierMails } from '@/@types/mails';

library.add(faFilter, faFileExcel, faFloppyDisk, faFilterCircleXmark);

const props = defineProps({
  data: { type: Array as PropType<SupplierMails[]>, required: true },
  updatedFilter: { type: Boolean, required: true },
});

const emit = defineEmits(['update-data', 'reset-filter']);

const toast = useToast();
const { t } = useI18n();
const tablesStore = useTablesStore();
const supplierMailsStore = useSupplierMailsStore();

const filtersState = computed(() => tablesStore.supplierMails);
const perPage = computed(() => (filtersState.value.perPage > 50 ? 50 : filtersState.value.perPage));

const filterCallbacks: Callbacks = [
  undefined,

  (payload: Sort): void => {
    tablesStore.setSort('supplierMails', payload);

    emit('update-data');
  },

  undefined,

  (payload: { page: number; perPage: number }): void => {
    tablesStore.setPage('supplierMails', payload.page);
    tablesStore.setPerPage('supplierMails', payload.perPage);

    emit('update-data');
  },

  (payload: Filter): void => {
    tablesStore.setFilters('supplierMails', payload);

    emit('update-data');
  },
];

const { showColumn, getColumnData } = useTableColumns<SupplierMails>(
  SUPPLIER_MAILS_FIELDS,
  STORAGE_KEY
);

const { filters, searchString, onSort, onPageChange, onSearch } = useTableFilters(
  filtersState.value,
  filterCallbacks
);

useTableFiltersObserver();

const { exportData } = useExportTableData();

const onCellEditComplete = async (newData: SupplierMails, index: number) => {
  const initialData = cloneDeep(props.data[index]);
  const { isMailApproved, guid } = newData;

  supplierMailsStore.updateMailsData({ isMailApproved, index });

  try {
    await changeMailStatus({ is_mail_approved: isMailApproved }, guid);

    toast.add({
      severity: isMailApproved ? 'success' : 'warn',
      detail: isMailApproved
        ? t('supplierMails.messages.enabled')
        : t('supplierMails.messages.disabled'),
      life: 5000,
    });
  } catch (error) {
    const { isMailApproved } = initialData;

    supplierMailsStore.updateMailsData({ isMailApproved, index });
    toast.add({
      severity: 'error',
      detail: isMailApproved
        ? t('supplierMails.messages.enableIssues')
        : t('supplierMails.messages.disableIssues'),
      life: 5000,
    });
  }
};

const { cm, copyData, onRowContextMenu } = useCopyData();

const selectedMails: Ref<SupplierMails> = ref({} as SupplierMails);
const menuModel = ref([
  {
    label: t('order.messages.copyFactory'),
    icon: 'pi pi-fw pi-copy',
    command: () => copyData(selectedMails.value.name),
  },
]);

onUpdated(() => {
  if (props.updatedFilter) {
    searchString.value = '';
  }
});
</script>
