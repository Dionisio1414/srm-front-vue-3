<template>
  <data-table
    id="supplier-supplies"
    lazy
    striped-rows
    data-key="guid"
    filter-display="menu"
    responsive-layout="scroll"
    removable-sort
    context-menu
    v-model:contextMenuSelection="selectedProduct"
    v-model:selection="selectedCustomers"
    :value="suppliesStore.loading ? new Array(perPage) : suppliesStore.supplies"
    v-model:filters="filters"
    :sort-field="filtersState.sort.sortKey || ''"
    :sort-order="filtersState.sort.orderBy === 'desc' ? 1 : -1"
    :class="{ 'pointer-events-none': suppliesStore.loading }"
    @sort="onSort"
    @filter="onFilter"
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
          @click="exportData('supplier-supplies')"
        >
          <font-awesome-icon icon="file-excel" size="xl" />
        </prime-button>

        <span class="p-input-icon-left my-1 ml-auto">
          <i class="pi pi-search" />

          <input-text
            :model-value="searchString"
            :placeholder="$t('placeholders.search')"
            class="w-18rem"
            v-tooltip.bottom="{
              value: $t('messages.searchMessage'),
              disabled: searchString.length > 2,
            }"
            @input="onSearch($event.target.value)"
          />
        </span>
      </div>
    </template>

    <template #empty>
      <div class="p-3 text-4xl">
        {{ $t('supplier.noFound') }}
      </div>
    </template>

    <column
      v-if="showColumn(suppliesStore.supplies, 'supplyNumber')"
      sortable
      :field="getColumnData('supplyNumber')?.name"
      :sort-field="getColumnData('supplyNumber')?.sortKey"
      :header="$t(getColumnData('supplyNumber')?.title)"
      class="relative"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!suppliesStore.loading">
          {{ data.supplyNumber }}

          <router-link
            v-if="data.guid"
            :to="{
              name: 'supply',
              params: { guid: data.guid },
              query: { orderNumber: data.orderNumber },
            }"
            class="absolute top-0 left-0 z-1 w-full h-full"
          />
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(suppliesStore.supplies, 'cargoReadyDate')"
      sortable
      :field="getColumnData('cargoReadyDate')?.name"
      :sort-field="getColumnData('cargoReadyDate')?.sortKey"
      :header="$t(getColumnData('cargoReadyDate')?.title)"
      class="relative"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!suppliesStore.loading">
          {{ data.cargoReadyDate }}

          <router-link
            v-if="data.guid"
            :to="{
              name: 'supply',
              params: { guid: data.guid },
              query: { orderNumber: data.orderNumber },
            }"
            class="absolute top-0 left-0 z-1 w-full h-full"
          />
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      sortable
      :field="getColumnData('files')?.name"
      :sort-field="getColumnData('files')?.sortKey"
      :header="$t(getColumnData('files')?.title)"
      class="relative"
      style="max-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!suppliesStore.loading">
          <indicators :files="data.files" />

          <router-link
            v-if="data.guid"
            :to="{
              name: 'supply',
              params: { guid: data.guid },
              query: { orderNumber: data.orderNumber },
            }"
            class="absolute top-0 left-0 z-1 w-full h-full"
          />
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(suppliesStore.supplies, 'total.usd')"
      sortable
      :field="getColumnData('total.usd')?.name"
      :sort-field="getColumnData('total.usd')?.sortKey"
      :header="$t(getColumnData('total.usd')?.title)"
      class="relative"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!suppliesStore.loading">
          {{ data.total.usd }}

          <router-link
            v-if="data.guid"
            :to="{
              name: 'supply',
              params: { guid: data.guid },
              query: { orderNumber: data.orderNumber },
            }"
            class="absolute top-0 left-0 z-1 w-full h-full"
          />
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(suppliesStore.supplies, 'total.amount')"
      sortable
      :field="getColumnData('total.amount')?.name"
      :sort-field="getColumnData('total.amount')?.sortKey"
      :header="$t(getColumnData('total.amount')?.title)"
      class="relative"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!suppliesStore.loading">
          {{ data.total.amount }}

          <router-link
            v-if="data.guid"
            :to="{
              name: 'supply',
              params: { guid: data.guid },
              query: { orderNumber: data.orderNumber },
            }"
            class="absolute top-0 left-0 z-1 w-full h-full"
          />
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      :header="$t(getColumnData('orderNumbers')?.title)"
      class="relative py-0"
      style="max-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!suppliesStore.loading">
          <orders-srm :supply-guid="data.guid" :supplies-orders="infoStore.suppliesOrders" />

          <router-link
            v-if="data.guid"
            :to="{
              name: 'supply',
              params: { guid: data.guid },
              query: { orderNumber: data.orderNumber },
            }"
            class="absolute top-0 left-0 z-1 w-full h-full"
          />
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(suppliesStore.supplies, 'status')"
      sortable
      :field="getColumnData('status')?.name"
      :sort-field="getColumnData('status')?.sortKey"
      filter-field="status"
      :header="$t(getColumnData('status')?.title)"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      style="min-width: 12rem"
      class="relative py-0 text-left"
    >
      <template #body="{ data }">
        <template v-if="!suppliesStore.loading">
          <div class="p-datatable-inner-cell">
            <span class="font-bold">
              {{ $t(`supply.statusHistory.statuses.${data.status.alias}`) }}
            </span>
          </div>

          <router-link
            v-if="data.guid"
            :to="{
              name: 'supply',
              params: { guid: data.guid },
              query: { orderNumber: data.orderNumber },
            }"
            class="absolute top-0 left-0 z-1 w-full h-full"
          />
        </template>

        <skeleton v-else />
      </template>

      <template #filter="{ filterModel, filterCallback }">
        <multi-select
          v-model="filterModel.value"
          :options="supplyStatuses"
          option-label="alias"
          scroll-height="25rem"
          :placeholder="$t('placeholders.status')"
        >
          <template #value="{ value, placeholder }">
            <template v-for="(option, index) in value" :key="option.id">
              {{ index > 0 ? ', ' : '' }}
              {{ $t(`supply.statusHistory.statuses.${option.alias}`) }}
            </template>

            <template v-if="!value || value.length === 0">
              {{ placeholder }}
            </template>
          </template>

          <template #option="{ option }">
            {{ $t(`supply.statusHistory.statuses.${option.alias}`) }}
          </template>

          <template #footer>
            <div class="flex justify-content-end py-3" style="padding-right: 1.25rem">
              <prime-button
                type="button"
                class="p-button-sm"
                :disabled="!filterModel.value"
                @click="filterCallback"
              >
                {{ $t('messages.applyLabel') }}
              </prime-button>
            </div>
          </template>
        </multi-select>
      </template>
    </column>
  </data-table>

  <paginator
    :first="(filtersState.page - 1) * filtersState.perPage"
    :rows="Number(filtersState.perPage)"
    :total-records="suppliesStore.total"
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
    :style="suppliesStore.loading ? 'pointer-events: none' : ''"
    @page="onPageChange"
  />

  <context-menu ref="cm" :model="menuModel" class="w-20rem" />
</template>

<script lang="ts" setup>
import { computed, onUpdated, Ref, ref } from 'vue';

import { useI18n } from 'vue-i18n';

import { library } from '@fortawesome/fontawesome-svg-core';

import { faFilter, faFileExcel, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons';

import vTooltip from 'primevue/tooltip';

import DataTable from 'primevue/datatable';
import Paginator from 'primevue/paginator';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import PrimeButton from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Indicators from '@/app/supplies/shared/components/indicators/indicators.vue';
import ContextMenu from 'primevue/contextmenu';
import MultiSelect from 'primevue/multiselect';

import useTablesStore, { PER_PAGE_OPTIONS } from '@/app/shared/store/tables-store';
import useSupplierSuppliesStore from '@/app/supplier/shared/store/supplier-supplies-store';
import useInfoStore from '@/app/shared/store/info-store';
import useTableColumns from '@/app/shared/services/hooks/table-columns';
import useTableFilters from '@/app/shared/services/hooks/table-filters';
import useExportTableData from '@/app/shared/services/hooks/export-table-data';
import useTableFiltersObserver from '@/app/shared/services/hooks/table-filters-observer';
import useCopyData from '@/app/shared/services/hooks/copy-data';

import {
  SUPPLIER_SUPPLIES_FIELDS,
  STORAGE_KEYS,
} from '@/app/supplier/shared/config/table-fields-constants';

import OrdersSrm from '@/app/shared/components/orders-srm/orders-srm.vue';

import type { Filter, ShipmentsFilter, Sort } from '@/@types/table';
import type { SupplyProduct } from '@/@types/product';
import type { Callbacks } from '@/app/shared/services/hooks/table-filters';
import type { FiltersScheme } from '@/app/shared/services/hooks/table-filters';

library.add(faFilter, faFileExcel, faFloppyDisk, faFilterCircleXmark);

const props = defineProps({
  updatedFilter: { type: Boolean, required: true },
});

const emit = defineEmits(['update-data', 'reset-filter']);

const { t } = useI18n();
const tablesStore = useTablesStore();
const suppliesStore = useSupplierSuppliesStore();
const infoStore = useInfoStore();
const { exportData } = useExportTableData();

const filtersState = computed(() => tablesStore.supplierSupplies);
const perPage = computed(() => (filtersState.value.perPage > 50 ? 50 : filtersState.value.perPage));
const supplyStatuses = computed(() => infoStore.supplyStatuses);

const filterCallbacks: Callbacks = [
  (payload: FiltersScheme): void => {
    tablesStore.setScheme('supplierSupplies', payload as never);
  },

  (payload: Sort): void => {
    tablesStore.setSort('supplierSupplies', payload);

    emit('update-data');
  },

  (payload: Filter & ShipmentsFilter): void => {
    tablesStore.setFilters('supplierSupplies', payload);

    emit('update-data');
  },

  (payload: { page: number; perPage: number }): void => {
    tablesStore.setPage('supplierSupplies', payload.page);
    tablesStore.setPerPage('supplierSupplies', payload.perPage);

    emit('update-data');
  },

  (payload: Filter): void => {
    tablesStore.setFilters('supplierSupplies', payload);

    emit('update-data');
  },
];

const { showColumn, getColumnData } = useTableColumns<SupplyProduct>(
  SUPPLIER_SUPPLIES_FIELDS,
  STORAGE_KEYS.SUPPLIER_SUPPLIES_COLUMNS
);

const { filters, searchString, onSort, onFilter, onPageChange, onSearch } = useTableFilters(
  filtersState.value,
  filterCallbacks
);

useTableFiltersObserver();

const { cm, copyData, onRowContextMenu } = useCopyData();

const selectedProduct: Ref<SupplyProduct> = ref({} as SupplyProduct);
const menuModel = ref([
  {
    label: t('order.messages.copySupplyNumber'),
    icon: 'pi pi-fw pi-copy',
    command: () => copyData(String(selectedProduct.value.supplyNumber)),
  },
]);

onUpdated(() => {
  if (props.updatedFilter) searchString.value = '';
});
</script>
