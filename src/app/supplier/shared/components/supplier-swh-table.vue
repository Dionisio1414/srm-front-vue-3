<template>
  <data-table
    id="supplier-swh"
    lazy
    striped-rows
    data-key="guid"
    filter-display="menu"
    responsive-layout="scroll"
    v-model:selection="selectedProducts"
    :value="swhStore.loading ? new Array(perPage) : swhStore.products"
    :class="{ 'pointer-events-none': swhStore.loading }"
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
          @click="exportData('supplier-swh', [0, 1, 2])"
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
        {{ $t('supplier.productsNoFound') }}
      </div>
    </template>

    <column selection-mode="multiple" :header-style="{ width: '3.25rem' }" class="py-0"> </column>

    <column v-if="!isSupplyGuid" style="min-width: 0" class="py-0 text-center">
      <template #body="{ data }">
        <button
          type="button"
          style="padding: 0.5rem 1rem; color: currentColor"
          @click="deleteProductHandler(data.guid, data.order_number)"
        >
          <font-awesome-icon icon="trash-can" size="lg" />
        </button>
      </template>
    </column>

    <column v-if="!swhStore.loading" class="py-0">
      <template #body="{ data }">
        <template v-if="data">
          <input-number
            v-if="swhStore.showQuantity(activeProducts, data.guid)"
            :model-value="Number(swhStore.quantity(activeProducts, data.guid))"
            :min="0"
            :max="data.quantity"
            mode="decimal"
            class="w-full"
            :input-class="`p-inputtext-xs p-in w-3rem ${
              swhStore.quantity(activeProducts, data.guid) > data.quantity ||
              !swhStore.quantity(activeProducts, data.guid)
                ? 'p-invalid'
                : ''
            }`"
            :use-grouping="false"
            v-tooltip="$t(`supplier.maxQuantity`, { quantity: data.quantity })"
            @input="changeQuantity(data.guid, data, $event.value)"
          />
        </template>
        <!-- eslint-enable max-len -->
      </template>
    </column>

    <column
      v-if="showColumn(swhStore.products, 'order_number')"
      :field="getColumnData('order_number')?.name"
      :header="$t(getColumnData('order_number')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!swhStore.loading">
          {{ data.order_number }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(swhStore.products, 'article_id')"
      :field="getColumnData('article_id')?.name"
      :header="$t(getColumnData('article_id')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!swhStore.loading">
          {{ data.article_id }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(swhStore.products, 'article_no')"
      :field="getColumnData('article_no')?.name"
      :header="$t(getColumnData('article_no')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!swhStore.loading">
          {{ data.article_no }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(swhStore.products, 'name_en')"
      :field="getColumnData('name_en')?.name"
      :header="$t(getColumnData('name_en')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!swhStore.loading">
          {{ $i18n.locale === 'en' ? data.category_name?.name_en : data.category_name?.name_ru }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(swhStore.products, 'quantity')"
      :field="getColumnData('quantity')?.name"
      :header="$t(getColumnData('quantity')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!swhStore.loading">
          {{ data.quantity }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(swhStore.products, 'price.price_usd')"
      :field="getColumnData('price.price_usd')?.name"
      :header="$t(getColumnData('price.price_usd')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!swhStore.loading">
          {{ data.price?.price_usd }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(swhStore.products, 'moq')"
      :field="getColumnData('moq')?.name"
      :header="$t(getColumnData('moq')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!swhStore.loading">
          {{ data.moq }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(swhStore.products, 'all_quantity')"
      :field="getColumnData('all_quantity')?.name"
      :header="$t(getColumnData('all_quantity')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!swhStore.loading">
          {{ data.all_quantity }}
        </template>

        <skeleton v-else />
      </template>
    </column>
  </data-table>

  <paginator
    :first="(filtersState.page - 1) * filtersState.perPage"
    :rows="Number(filtersState.perPage)"
    :total-records="swhStore.total"
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
    :style="swhStore.loading ? 'pointer-events: none' : ''"
    @page="onPageChange"
  />

  <prime-button
    v-if="activeProducts.length && !isSupplyGuid"
    type="button"
    class="fixed z-2 flex align-items-center shadow-5"
    style="left: 13.5rem; bottom: 5rem; color: var(--surface-50); line-height: 1"
    :loading="isLoading"
    :disabled="disabled"
    @click="onSave"
  >
    <font-awesome-icon :icon="['far', 'floppy-disk']" size="xl" class="mr-2" />

    <span class="text-xl font-bold">
      {{ $t('supplier.moveToSupplies') }}
    </span>
  </prime-button>

  <prime-button
    v-if="activeProducts.length && isSupplyGuid"
    type="button"
    class="fixed z-2 flex align-items-center shadow-5"
    style="left: 13.5rem; bottom: 5rem; color: var(--surface-50); line-height: 1"
    :loading="isLoading"
    :disabled="disabled"
    @click="addToSupplyHandler"
  >
    <font-awesome-icon icon="plus" size="xl" class="mr-2" />

    <span class="text-xl font-bold">
      {{ $t('supplies.addToSupply') }}
    </span>
  </prime-button>
</template>

<script lang="ts" setup>
import { computed, onUpdated, Ref, ref, watch } from 'vue';

import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import cloneDeep from 'lodash.clonedeep';
import { library } from '@fortawesome/fontawesome-svg-core';

import {
  faFilter,
  faFileExcel,
  faPlus,
  faFilterCircleXmark,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons';

import vTooltip from 'primevue/tooltip';

import DataTable from 'primevue/datatable';
import Paginator from 'primevue/paginator';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import PrimeButton from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import InputNumber from 'primevue/inputnumber';
import { useConfirm } from 'primevue/useconfirm';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import useSwhStore from '@/app/supplier/shared/store/supplier-swh-store';
import useTablesStore, { PER_PAGE_OPTIONS } from '@/app/shared/store/tables-store';
import useTableColumns from '@/app/shared/services/hooks/table-columns';
import useTableFilters from '@/app/shared/services/hooks/table-filters';
import useExportTableData from '@/app/shared/services/hooks/export-table-data';
import useTableFiltersObserver from '@/app/shared/services/hooks/table-filters-observer';
import useNotification from '@/app/shared/services/hooks/notifications';

import {
  SUPPLIER_SWH_FIELDS,
  STORAGE_KEYS,
} from '@/app/supplier/shared/config/table-fields-constants';
import { moveToSupply, deleteSwhProduct } from '@/app/supplier/shared/services/api';
import { addProducts } from '@/app/supply/shared/services/api';

import type { Callbacks } from '@/app/shared/services/hooks/table-filters';

import type { SwhProduct, ActiveSwhProduct } from '@/@types/product';
import type { Filter, ShipmentsFilter } from '@/@types/table';
import type { CustomError } from '@/app/shared/services/hooks/notifications';

library.add(faFilter, faFileExcel, faFloppyDisk, faPlus, faFilterCircleXmark, faTrashCan);

const props = defineProps({
  updatedFilter: { type: Boolean, required: true },
});

const emit = defineEmits(['update-data', 'reset-filter', 'add-to-supply']);

const route = useRoute();
const router = useRouter();
const swhStore = useSwhStore();
const tablesStore = useTablesStore();
const confirm = useConfirm();
const { t } = useI18n();
const { exportData } = useExportTableData();
const { onError, onSuccess } = useNotification();

const isLoading = ref(false);

const filtersState = computed(() => tablesStore.supplierSwh);
const perPage = computed(() => (filtersState.value.perPage > 50 ? 50 : filtersState.value.perPage));

const isSupplyGuid = computed(() => !!route.query.supplyGuid);

const disabled = ref(false);
const selectedProducts = ref([]);
const activeProducts: Ref<ActiveSwhProduct[]> = ref([]);

const filterCallbacks: Callbacks = [
  undefined,

  undefined,

  undefined,

  (payload: { page: number; perPage: number }): void => {
    tablesStore.setPage('supplierSwh', payload.page);
    tablesStore.setPerPage('supplierSwh', payload.perPage);

    emit('update-data');
  },

  (payload: Filter & ShipmentsFilter): void => {
    tablesStore.setFilters('supplierSwh', payload);

    emit('update-data');
  },
];

const { showColumn, getColumnData } = useTableColumns<SwhProduct>(
  SUPPLIER_SWH_FIELDS,
  STORAGE_KEYS.SUPPLIER_SWH_COLUMNS
);

const { searchString, onPageChange, onSearch } = useTableFilters(
  filtersState.value,
  filterCallbacks
);

const productsChangeHandler = (active: ActiveSwhProduct[], products: SwhProduct[]): void => {
  const normalizeProduct = (
    active: ActiveSwhProduct[],
    formatted: ActiveSwhProduct[]
  ): ActiveSwhProduct[] => {
    const clone = cloneDeep(formatted);

    const handler = (current: ActiveSwhProduct) => {
      const index = clone.findIndex((product) => product.swhGuid === current.swhGuid);

      if (index > -1) {
        clone[index].amount = current.amount;
      }
    };

    active.forEach(handler);

    return clone;
  };

  const formatted: ActiveSwhProduct[] = products.map((product) => ({
    swhGuid: product.guid,
    amount: product.quantity,
  }));
  const normalized: ActiveSwhProduct[] = normalizeProduct(active, formatted);

  activeProducts.value = normalized;
};

const changeQuantity = (orderGuid: string, data: SwhProduct, value: number | string) => {
  const quantity = value > data.quantity ? data.quantity : value;

  const index = activeProducts.value.findIndex((product) => product.swhGuid === orderGuid);
  const current = activeProducts.value.find((product) => product.swhGuid === orderGuid);

  if (index > -1 && current) {
    const payload = { swhGuid: current?.swhGuid, amount: Number(quantity) };

    activeProducts.value.splice(index, 1, payload);
  }
};

const resetActiveProducts = () => {
  selectedProducts.value = [];
  activeProducts.value = [];
};

const onSave = async () => {
  try {
    isLoading.value = true;

    const data = await moveToSupply(route.params.guid as string, activeProducts.value);

    emit('update-data');
    onSuccess(t('supplier.moveToSuppliesMessage', { supplyNumber: data.supplyNumber }));
  } catch (error) {
    onError(error as CustomError);
  } finally {
    isLoading.value = false;
    resetActiveProducts();
  }
};

const addToSupplyHandler = async () => {
  try {
    const params = {
      products: activeProducts.value.map((item: ActiveSwhProduct) => item),
      guid: route.query.supplyGuid,
    } as { products: ActiveSwhProduct[]; guid: string };

    isLoading.value = true;

    await addProducts(params);

    onSuccess(t('supplies.addToSupply'));

    router.push(`/supply/${route.query.supplyGuid}`);
  } catch (error) {
    onError(error as CustomError);
  } finally {
    isLoading.value = false;
    resetActiveProducts();
  }
};

const deleteProduct = async (guid: string, orderNumber: string): Promise<void> => {
  try {
    isLoading.value = true;

    await deleteSwhProduct(guid);

    emit('update-data');
    onSuccess(t('supplier.messages.successfullyDeleteMessage', { orderNumber }));
  } catch (error) {
    onError(error as CustomError);
  } finally {
    isLoading.value = false;
  }
};

const deleteProductHandler = (guid: string, orderNumber: string) => {
  confirm.require({
    message: t('supplier.messages.deleteSwhProductMessage'),
    header: t('supplier.messages.deleteSwhProductHeader'),
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    acceptLabel: t('supplier.messages.saveDataAcceptLabel'),
    rejectLabel: t('supplier.messages.saveDataRejectLabel'),

    accept: deleteProduct.bind(null, guid, orderNumber),
  });
};

useTableFiltersObserver();

watch(selectedProducts, (products) => productsChangeHandler(activeProducts.value, products));

watch(
  () => activeProducts.value,
  (products) => {
    const withZeroQuantity = products.find((product) => !product.amount);

    disabled.value = Boolean(withZeroQuantity);
  },
  { deep: true }
);

onUpdated(() => {
  if (props.updatedFilter) searchString.value = '';
});
</script>
