<template>
  <data-table
    id="supplier-shipments"
    lazy
    data-key="guid"
    :value="shipmentsStore.loading ? new Array(perPage) : shipmentsStore.shipments"
    filter-display="menu"
    striped-rows
    responsive-layout="scroll"
    :class="{ 'pointer-events-none': shipmentsStore.loading }"
  >
    <template #header>
      <div class="flex flex-wrap align-items-center">
        <prime-button
          type="button"
          class="flex align-items-center justify-content-center p-0 my-1 mr-auto"
          style="width: 2.8125rem; height: 2.8125rem"
          @click="exportData('supplier-shipments')"
        >
          <font-awesome-icon icon="file-excel" size="xl" />
        </prime-button>
      </div>
    </template>

    <template #empty>
      <div class="p-3 text-4xl">
        {{ $t('shipments.noFound') }}
      </div>
    </template>

    <column
      v-if="showColumn(shipmentsStore.shipments, 'wayIds')"
      :field="getColumnData('wayIds')?.name"
      :header="$t(getColumnData('wayIds')?.title)"
      style="min-width: 15rem"
    >
      <template #body="{ data }">
        <template v-if="!shipmentsStore.loading">
          {{ data.wayIds.map((wayId) => infoStore.wayName(wayId)).join(', ') }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(shipmentsStore.shipments, 'status.alias')"
      :field="getColumnData('status.alias')?.name"
      :header="$t(getColumnData('status.alias')?.title)"
      style="min-width: 15rem"
    >
      <template #body="{ data }">
        <template v-if="!shipmentsStore.loading">
          {{ data.status.alias }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(shipmentsStore.shipments, 'forwarder.name')"
      :field="getColumnData('forwarder.name')?.name"
      :header="$t(getColumnData('forwarder.name')?.title)"
      style="min-width: 15rem"
    >
      <template #body="{ data }">
        <template v-if="!shipmentsStore.loading">
          {{ data.forwarder?.name }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(shipmentsStore.shipments, 'shipmentLoadingType.type')"
      :field="getColumnData('shipmentLoadingType.type')?.name"
      :header="$t(getColumnData('shipmentLoadingType.type')?.title)"
      style="min-width: 15rem"
    >
      <template #body="{ data }">
        <template v-if="!shipmentsStore.loading">
          {{ data.shipmentLoadingType?.type }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(shipmentsStore.shipments, 'pointOfLoading')"
      :field="getColumnData('pointOfLoading')?.name"
      :header="$t(getColumnData('pointOfLoading')?.title)"
      style="min-width: 15rem"
    >
      <template #body="{ data }">
        <template v-if="!shipmentsStore.loading">
          {{ infoStore.portName(data.pointOfLoading) }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(shipmentsStore.shipments, 'tu', 'transportUnits')"
      :field="getColumnData('tu')?.name"
      :header="$t(getColumnData('tu')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!shipmentsStore.loading">
          <div
            v-for="(unit, index) in data.transportUnits.map((item) => item.type)"
            :key="index"
            style="height: 1rem; line-height: 1rem"
          >
            <span v-if="index !== 0" class="absolute opacity-0">&nbsp;/&nbsp;</span>

            {{ unit.name }}
          </div>
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(shipmentsStore.shipments, 'size', 'transportUnits')"
      :field="getColumnData('size')?.name"
      :header="$t(getColumnData('size')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!shipmentsStore.loading">
          <div
            v-for="(unit, index) in data.transportUnits.map((item) => item.size)"
            :key="index"
            style="height: 1rem; line-height: 1rem"
          >
            <span v-if="index !== 0" class="absolute opacity-0">&nbsp;/&nbsp;</span>

            {{ unit.value }}
          </div>
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(shipmentsStore.shipments, 'amount', 'transportUnits')"
      :field="getColumnData('amount')?.name"
      :header="$t(getColumnData('amount')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!shipmentsStore.loading">
          <div
            v-for="(amount, index) in data.transportUnits.map((item) => item.amount)"
            :key="`data-${index}`"
            style="height: 1rem; line-height: 1rem"
          >
            <span v-if="index !== 0" class="absolute opacity-0">&nbsp;/&nbsp;</span>

            {{ amount }}
          </div>
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(shipmentsStore.shipments, 'cargoReadyDate')"
      :field="getColumnData('cargoReadyDate')?.name"
      :header="$t(getColumnData('cargoReadyDate')?.title)"
      style="min-width: 12rem"
      class="relative"
    >
      <template #body="{ data }">
        <template v-if="!shipmentsStore.loading">
          {{ formatDate(data.cargoReadyDate) }}
        </template>

        <skeleton v-else />
      </template>
    </column>
  </data-table>

  <paginator
    :first="(filtersState.page - 1) * filtersState.perPage"
    :rows="Number(filtersState.perPage)"
    :total-records="shipmentsStore.total"
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
    :style="shipmentsStore.loading ? 'pointer-events: none' : ''"
    @page="onPageChange"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';

import { faFileExcel } from '@fortawesome/free-solid-svg-icons';

import DataTable from 'primevue/datatable';
import Paginator from 'primevue/paginator';
import Column from 'primevue/column';
import Skeleton from 'primevue/skeleton';
import PrimeButton from 'primevue/button';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import useTablesStore, { PER_PAGE_OPTIONS } from '@/app/shared/store/tables-store';
import useInfoStore from '@/app/shared/store/info-store';
import useSupplierShipmentsStore from '@/app/supplier/shared/store/supplier-shipments-store';
import useTableColumns from '@/app/shared/services/hooks/table-columns';
import useTableFilters from '@/app/shared/services/hooks/table-filters';
import useExportTableData from '@/app/shared/services/hooks/export-table-data';
import useTableFiltersObserver from '@/app/shared/services/hooks/table-filters-observer';

import { formatDate } from '@/app/shared/services/helpers/table-helpers';
import {
  SUPPLIER_SHIPMENTS_FIELDS,
  STORAGE_KEYS,
} from '@/app/supplier/shared/config/table-fields-constants';

import type { Shipments } from '@/@types/shipment';
import type { Callbacks } from '@/app/shared/services/hooks/table-filters';

library.add(faFileExcel);

const emit = defineEmits(['update-data']);

const tablesStore = useTablesStore();
const infoStore = useInfoStore();
const shipmentsStore = useSupplierShipmentsStore();
const { exportData } = useExportTableData();

const filtersState = computed(() => tablesStore.supplierShipments);
const perPage = computed(() => (filtersState.value.perPage > 50 ? 50 : filtersState.value.perPage));

const filterCallbacks: Callbacks = [
  undefined,

  undefined,

  undefined,

  (payload: { page: number; perPage: number }): void => {
    tablesStore.setPage('supplierShipments', payload.page);
    tablesStore.setPerPage('supplierShipments', payload.perPage);

    emit('update-data');
  },

  undefined,
];

const { showColumn, getColumnData } = useTableColumns<Shipments>(
  SUPPLIER_SHIPMENTS_FIELDS,
  STORAGE_KEYS.SHIPMENTS_COLUMNS
);

const { onPageChange } = useTableFilters(filtersState.value, filterCallbacks);

useTableFiltersObserver();
</script>
