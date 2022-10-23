<template>
  <data-table
    id="supply"
    v-bind="$attrs"
    data-key="guid"
    striped-rows
    responsive-layout="scroll"
    :value="supplyStore.loading ? new Array(10) : supplyStore.products"
    :rows="10"
    :rows-per-page-options="PER_PAGE_OPTIONS"
    :loading="supplyStore.loading"
    removable-sort
    :state-key="`articles-table-${supplyStore.supply.guid}`"
    state-storage="local"
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
      'orderNumber',
      'articleId',
      'articleNo',
      'genericArticleId',
      'amount',
      'unitPriceUsd',
      'fid',
      'minimalOrderQuantity',
    ]"
  >
    <template #header>
      <div class="flex flex-wrap align-items-center">
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
          class="flex align-items-center justify-content-center p-0 my-1 ml-3"
          style="width: 2.8125rem; height: 2.8125rem"
          @click="exportData('supply')"
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
        {{ $t('supplies.noFound') }}
      </div>
    </template>

    <template #loading>
      {{ $t('supplies.loading') }}
    </template>

    <column style="min-width: 0; width: 0" class="py-0">
      <template #body="{ data }">
        <template v-if="!supplyStore.loading">
          <button
            type="button"
            style="padding: 0.5rem 1rem; color: currentColor"
            @click="onDelete(data.guid)"
          >
            <font-awesome-icon icon="trash-can" size="lg" />
          </button>
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(supplyStore.products, 'orderNumber')"
      :field="getColumnData('orderNumber')?.name"
      sortable
      :header="$t(getColumnData('orderNumber')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!supplyStore.loading">
          {{ data.orderNumber }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(supplyStore.products, 'articleId')"
      :field="getColumnData('articleId')?.name"
      sortable
      :header="$t(getColumnData('articleId')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!supplyStore.loading">
          {{ data.articleId }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(supplyStore.products, 'articleNo')"
      :field="getColumnData('articleNo')?.name"
      sortable
      :header="$t(getColumnData('articleNo')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!supplyStore.loading">
          {{ data.articleNo }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(supplyStore.products, 'genericArticleId')"
      :field="getColumnData('genericArticleId')?.name"
      sortable
      :header="$t(getColumnData('genericArticleId')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!supplyStore.loading">
          {{ data.genericArticleId }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(supplyStore.products, 'unitPriceUsd')"
      :field="getColumnData('unitPriceUsd')?.name"
      sortable
      :header="$t(getColumnData('unitPriceUsd')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!supplyStore.loading">
          {{ data.unitPriceUsd.toFixed(2) }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(supplyStore.products, 'amount')"
      :field="getColumnData('amount')?.name"
      sortable
      :header="$t(getColumnData('amount')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!supplyStore.loading">
          {{ data.amount }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(supplyStore.products, 'fid')"
      :field="getColumnData('fid')?.name"
      sortable
      :header="$t(getColumnData('fid')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!supplyStore.loading">
          {{ data.fid }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(supplyStore.products, 'minimalOrderQuantity')"
      :field="getColumnData('minimalOrderQuantity')?.name"
      sortable
      :header="$t(getColumnData('minimalOrderQuantity')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!supplyStore.loading">
          {{ data.minimalOrderQuantity }}
        </template>

        <skeleton v-else />
      </template>
    </column>
  </data-table>

  <prime-button
    v-if="isAddSupply"
    type="button"
    class="fixed z-2 flex align-items-center shadow-5"
    style="left: 13.5rem; bottom: 5rem; color: var(--surface-50); line-height: 1"
    :loading="supplyStore.loading"
    @click="
      $router.push({
        path: `/supplier/${supplyStore.supply.factory?.guid}/swh`,
        query: { supplyGuid: supplyStore.supply.guid },
      })
    "
  >
    <font-awesome-icon icon="plus" size="xl" class="mr-2" />

    <span class="text-xl font-bold">
      {{ $t('supplies.addToSupply') }}
    </span>
  </prime-button>
</template>

<script lang="ts" setup>
import { computed, ref, Ref } from 'vue';

import { useI18n } from 'vue-i18n';
import { useConfirm } from 'primevue/useconfirm';

import cloneDeep from 'lodash.clonedeep';
import { library } from '@fortawesome/fontawesome-svg-core';

import {
  faFilter,
  faFileExcel,
  faFloppyDisk,
  faTrashCan,
  faPlus,
  faFilterCircleXmark,
} from '@fortawesome/free-solid-svg-icons';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import PrimeButton from 'primevue/button';
import InputText from 'primevue/inputtext';
import Skeleton from 'primevue/skeleton';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import useSupplyStore from '@/app/supply/shared/store/supply-store';
import useTableColumns from '@/app/shared/services/hooks/table-columns';
import useExportTableData from '@/app/shared/services/hooks/export-table-data';
import useNotification from '@/app/shared/services/hooks/notifications';
import useTableFiltersObserver from '@/app/shared/services/hooks/table-filters-observer';
import useStaticTableClearFilters from '@/app/shared/services/hooks/static-table-clear-filter';

import { PER_PAGE_OPTIONS } from '@/app/shared/store/tables-store';
import {
  FILTERS_CONSTANTS,
  FiltersConstants,
} from '@/app/supply/shared/config/filters-scheme-constants';
import {
  SUPPLY_PRODUCTS_FIELDS,
  STORAGE_KEYS,
} from '@/app/supply/shared/config/table-fields-constants';

import type { SupplyProducts } from '@/@types/supply';
import type { CustomError } from '@/app/shared/services/hooks/notifications';

library.add(faFilter, faFileExcel, faFloppyDisk, faTrashCan, faPlus, faFilterCircleXmark);

const emit = defineEmits(['update-data']);

const supplyStore = useSupplyStore();
const { t } = useI18n();
const confirm = useConfirm();

const { exportData } = useExportTableData();
const { onError, onSuccess } = useNotification();

const { showColumn, getColumnData } = useTableColumns<SupplyProducts>(
  SUPPLY_PRODUCTS_FIELDS,
  STORAGE_KEYS.SUPPLY_PRODUCTS_COLUMNS
);

const isAddSupply = computed(() => supplyStore.supply?.status?.alias !== 'canceled');

const deleteProduct = async (guid: string) => {
  try {
    await supplyStore.deleteProduct(guid);

    onSuccess(t('supplies.messages.productDeleteMessage'));
    emit('update-data');
  } catch (error) {
    onError(error as CustomError);
  }
};

const onDelete = (guid: string) => {
  confirm.require({
    message: t('supplies.messages.deleteProductMessage'),
    header: t('supplies.messages.deleteProductHeader'),
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    acceptLabel: t('supplies.messages.saveDataAcceptLabel'),
    rejectLabel: t('supplies.messages.saveDataRejectLabel'),

    accept: deleteProduct.bind(null, guid),
  });
};

const filters: Ref<FiltersConstants> = ref(cloneDeep(FILTERS_CONSTANTS));

const { updatedFilter } = useStaticTableClearFilters();

const resetFiltersHandler = () => {
  filters.value = cloneDeep(FILTERS_CONSTANTS);
};

useTableFiltersObserver();
</script>
