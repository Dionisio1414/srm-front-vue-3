<template>
  <data-table
    id="supplier"
    lazy
    striped-rows
    data-key="guid"
    :value="supplierStore.loading ? new Array(perPage) : supplierStore.orders"
    v-model:filters="filters"
    v-model:expanded-rows="expandedRows"
    :sort-field="filtersState.sort.sortKey || ''"
    :sort-order="filtersState.sort.orderBy === 'desc' ? 1 : -1"
    removable-sort
    filter-display="menu"
    responsive-layout="scroll"
    context-menu
    v-model:contextMenuSelection="selectedProduct"
    :class="{ 'pointer-events-none': supplierStore.loading }"
    @sort="onSort"
    @filter="onFilter"
    @row-expand="onRowExpand"
    @row-collapse="resetActiveProducts($event.data.guid)"
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
          @click="exportData('supplier')"
        >
          <font-awesome-icon icon="file-excel" size="xl" />
        </prime-button>

        <multi-select
          v-model="selectedColumns"
          :options="noDefaultFields"
          option-label="title"
          :placeholder="$t('placeholders.columns')"
          class="w-18rem my-1 ml-3"
          scroll-height="25rem"
        >
          <template #value="{ value, placeholder }">
            <template v-if="!value || value.length === 0">
              {{ placeholder }}
            </template>

            <template v-else>
              {{
                value
                  .map(
                    (item) => `
                  ${$t(item.title)}
                  ${columnIsEmpty(supplierStore.orders, item.name) ? '(Empty)' : ''}
                `
                  )
                  .join(', ')
              }}
            </template>
          </template>

          <template #option="{ option }">
            {{ $t(option.title) }}
            {{ columnIsEmpty(supplierStore.orders, option.name) ? '(Empty)' : '' }}
          </template>
        </multi-select>

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

    <column :expander="true" :header-style="{ width: '3rem' }" class="py-0" />

    <column
      v-if="showColumn(supplierStore.orders, 'orderNumber')"
      field="orderNumber"
      sortable
      :header="$t(getColumnData('orderNumber')?.title)"
      style="min-width: 10rem"
      class="relative"
    >
      <template #body="{ data }">
        <template v-if="!supplierStore.loading">
          {{ data.orderNumber }}

          <router-link
            v-if="data.guid"
            :to="{
              name: ordersStore.type(data.status.id),
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
      v-if="showColumn(supplierStore.orders, 'proformaInvoiceNumber')"
      field="proformaInvoiceNumber"
      sortable
      :header="$t(getColumnData('proformaInvoiceNumber')?.title)"
      style="min-width: 12rem"
      class="relative"
    >
      <template #body="{ data }">
        <template v-if="!supplierStore.loading">
          {{ data.proformaInvoiceNumber }}

          <router-link
            v-if="data.guid"
            :to="{
              name: ordersStore.type(data.status.id),
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
      v-if="showColumn(supplierStore.orders, 'proformaInvoiceDate')"
      sortable
      :header="$t(getColumnData('proformaInvoiceDate')?.title)"
      field="proformaInvoiceDate"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      style="min-width: 12rem"
      class="relative"
    >
      <template #body="{ data }">
        <template v-if="!supplierStore.loading">
          {{ formatDate(data.proformaInvoiceDate) }}

          <router-link
            v-if="data.guid"
            :to="{
              name: ordersStore.type(data.status.id),
              params: { guid: data.guid },
              query: { orderNumber: data.orderNumber },
            }"
            class="absolute top-0 left-0 z-1 w-full h-full"
          />
        </template>

        <skeleton v-else />
      </template>

      <template #filter="{ filterModel, filterCallback }">
        <calendar
          v-model="filterModel.value"
          selection-mode="range"
          :manual-input="false"
          date-format="yy-mm-dd"
          :placeholder="$t('placeholders.date')"
        >
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
        </calendar>
      </template>
    </column>

    <column
      v-if="showColumn(supplierStore.orders, 'createdAt')"
      sortable
      :header="$t(getColumnData('createdAt')?.title)"
      field="createdAt"
      style="min-width: 12rem"
      class="relative"
    >
      <template #body="{ data }">
        <template v-if="!supplierStore.loading">
          {{ formatDate(data.createdAt) }}

          <router-link
            v-if="data.guid"
            :to="{
              name: ordersStore.type(data.status.id),
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
      v-if="showColumn(supplierStore.orders, 'responsible.name')"
      sort-field="responsible.name"
      filter-field="responsible"
      :header="$t(getColumnData('responsible.name')?.title)"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      style="min-width: 14rem"
      class="relative"
    >
      <template #body="{ data }">
        <template v-if="!supplierStore.loading">
          {{ data.responsible.name }}

          <router-link
            v-if="data.guid"
            :to="{
              name: ordersStore.type(data.status.id),
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
          filter
          :options="infoStore.members"
          option-label="name"
          option-value="id"
          scroll-height="25rem"
          :placeholder="$t('placeholders.responsible')"
        >
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

    <column
      v-if="showColumn(supplierStore.orders, 'company.name')"
      field="company"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      :header="$t(getColumnData('company.name')?.title)"
      style="min-width: 10rem"
      class="relative"
    >
      <template #body="{ data }">
        <template v-if="!supplierStore.loading">
          {{ data.company?.name }}

          <router-link
            v-if="data.guid"
            :to="{
              name: ordersStore.type(data.status.id),
              params: { guid: data.guid },
              query: { orderNumber: data.orderNumber },
            }"
            class="absolute top-0 left-0 z-1 w-full h-full"
          />
        </template>

        <skeleton v-else />
      </template>

      <template #filter="{ filterModel }">
        <dropdown
          v-model="filterModel.value"
          :options="infoStore.companies"
          option-label="name"
          option-value="id"
          scroll-height="25rem"
          :placeholder="$t('placeholders.brand')"
        />
      </template>
    </column>

    <column
      v-if="showColumn(supplierStore.orders, 'estimatedProductionEndDate')"
      sortable
      field="estimatedProductionEndDate"
      :header="$t(getColumnData('estimatedProductionEndDate')?.title)"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      style="min-width: 10rem"
      class="relative"
    >
      <template #body="{ data }">
        <template v-if="!supplierStore.loading">
          {{ formatDate(data.estimatedProductionEndDate) }}

          <router-link
            v-if="data.guid"
            :to="{
              name: ordersStore.type(data.status.id),
              params: { guid: data.guid },
              query: { orderNumber: data.orderNumber },
            }"
            class="absolute top-0 left-0 z-1 w-full h-full"
          />
        </template>

        <skeleton v-else />
      </template>

      <template #filter="{ filterModel, filterCallback }">
        <calendar
          v-model="filterModel.value"
          selection-mode="range"
          :manual-input="false"
          date-format="yy-mm-dd"
          :placeholder="$t('placeholders.date')"
        >
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
        </calendar>
      </template>
    </column>

    <column
      v-if="showColumn(supplierStore.orders, 'category')"
      field="category"
      :header="$t(getColumnData('category')?.title)"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      style="min-width: 12rem"
      class="relative"
    >
      <template #body="{ data }">
        <template v-if="!supplierStore.loading">
          {{ data.category }}

          <router-link
            v-if="data.guid"
            :to="{
              name: ordersStore.type(data.status.id),
              params: { guid: data.guid },
              query: { orderNumber: data.orderNumber },
            }"
            class="absolute top-0 left-0 z-1 w-full h-full"
          />
        </template>

        <skeleton v-else />
      </template>

      <template #filter="{ filterModel }">
        <lazy-dropdown
          type="category"
          :model-value="filterModel.value"
          :placeholder="$t('placeholders.category')"
          class="w-full text-left"
          @update-model-value="($event) => (filterModel.value = $event.value)"
        />
      </template>
    </column>

    <column
      v-if="showColumn(supplierStore.orders, 'articles')"
      sortable
      field="articles"
      :header="$t(getColumnData('articles')?.title)"
      style="min-width: 10rem"
      class="relative"
    >
      <template #body="{ data }">
        <template v-if="!supplierStore.loading">
          {{ data.articles }}

          <router-link
            v-if="data.guid"
            :to="{
              name: ordersStore.type(data.status.id),
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
      v-if="showColumn(supplierStore.orders, 'pieces')"
      sortable
      sort-field="pieces"
      :header="$t(getColumnData('pieces')?.title)"
      style="min-width: 10rem"
      class="relative"
    >
      <template #body="{ data }">
        <template v-if="!supplierStore.loading">
          {{ data.pieces }}

          <router-link
            v-if="data.guid"
            :to="{
              name: ordersStore.type(data.status.id),
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
      v-if="showColumn(supplierStore.orders, 'total.usd')"
      sortable
      field="total.usd"
      :header="$t(getColumnData('total.usd')?.title)"
      style="min-width: 10rem"
      class="relative"
    >
      <template #body="{ data }">
        <template v-if="!supplierStore.loading">
          {{ formatCurrency(data.total.usd) }}

          <router-link
            v-if="data.guid"
            :to="{
              name: ordersStore.type(data.status.id),
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
      v-if="showColumn(supplierStore.orders, 'status.id')"
      sort-field="status.sort"
      filter-field="status"
      sortable
      :header="$t(getColumnData('status.id')?.title)"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      style="min-width: 15rem"
      class="relative py-0"
    >
      <template #body="{ data }">
        <template v-if="!supplierStore.loading">
          <prime-button
            type="button"
            class="p-button-sm justify-content-center w-auto py-1 mr-1"
            :class="getTagClass(data.status.color)"
          >
            {{ $t(`order.statuses.${data.status.alias}`) }}
          </prime-button>

          <router-link
            v-if="data.guid"
            :to="{
              name: ordersStore.type(data.status.id),
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
          :options="infoStore.supplierStatuses"
          option-label="title"
          scroll-height="25rem"
          :placeholder="$t('placeholders.status')"
        >
          <template #value="{ value, placeholder }">
            <prime-button
              v-for="option in value"
              :key="option.id"
              type="button"
              class="p-button-sm w-auto py-1 mr-1 pointer-events-none"
              :class="getTagClass(option.color)"
            >
              {{ $t(`order.statuses.${option.alias}`) }}
            </prime-button>

            <template v-if="!value || value.length === 0">
              {{ placeholder }}
            </template>
          </template>

          <template #option="{ option }">
            <prime-button
              type="button"
              class="p-button-sm py-1 pointer-events-none"
              :class="getTagClass(option.color)"
            >
              {{ $t(`order.statuses.${option.alias}`) }}
            </prime-button>
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

    <template #expansion="{ data }">
      <div class="subtable-wrapper">
        <supplier-inner-table
          :status="data.status.id"
          :data="supplierStore.orderProducts(data.guid) || []"
          :order-guid="data.guid"
          :active-products="active.products[data.guid] || []"
          @set-active-products="setActiveProducts"
          @update-quantity="updateProductQuantity"
        />
      </div>
    </template>
  </data-table>

  <paginator
    :first="(filtersState.page - 1) * filtersState.perPage"
    :rows="Number(filtersState.perPage)"
    :total-records="supplierStore.total"
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
    :style="supplierStore.loading ? 'pointer-events: none' : ''"
    @page="onPageChange"
  />

  <prime-button
    v-if="Object.values(active.products).length"
    type="button"
    class="fixed z-2 flex align-items-center shadow-5"
    style="left: 13.5rem; bottom: 5rem; color: var(--surface-50); line-height: 1"
    :disabled="isLoading || disabled"
    @click="onSave"
  >
    <font-awesome-icon :icon="['far', 'floppy-disk']" size="xl" class="mr-2" />

    <span class="text-xl font-bold">
      {{ $t('supplier.moveToSwh') }}
    </span>
  </prime-button>

  <context-menu ref="cm" :model="menuModel" class="w-20rem" />
</template>

<script lang="ts" setup>
import { computed, ref, reactive, onUpdated, Ref, watch } from 'vue';

import { useI18n } from 'vue-i18n';

import cloneDeep from 'lodash.clonedeep';
import { library } from '@fortawesome/fontawesome-svg-core';

import { faFilter, faFileExcel, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons';

import vTooltip from 'primevue/tooltip';

import DataTable from 'primevue/datatable';
import Paginator from 'primevue/paginator';
import Column from 'primevue/column';
import Calendar from 'primevue/calendar';
import PrimeButton from 'primevue/button';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import Dropdown from 'primevue/dropdown';
import Skeleton from 'primevue/skeleton';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ContextMenu from 'primevue/contextmenu';

import useSupplierStore from '@/app/supplier/shared/store/supplier-store';
import useTablesStore, { PER_PAGE_OPTIONS } from '@/app/shared/store/tables-store';
import useInfoStore from '@/app/shared/store/info-store';
import useOrdersStore from '@/app/orders/shared/store/orders-store';
import useNotifications from '@/app/shared/services/hooks/notifications';
import useTableColumns from '@/app/shared/services/hooks/table-columns';
import useTableFilters from '@/app/shared/services/hooks/table-filters';
import useExportTableData from '@/app/shared/services/hooks/export-table-data';
import useTableFiltersObserver from '@/app/shared/services/hooks/table-filters-observer';
import useCopyData from '@/app/shared/services/hooks/copy-data';

import { moveToSwh } from '@/app/supplier/shared/services/api';

import {
  formatDate,
  formatCurrency,
  getTagClass,
} from '@/app/shared/services/helpers/table-helpers';
import { SUPPLIER_FIELDS, STORAGE_KEYS } from '@/app/supplier/shared/config/table-fields-constants';

import SupplierInnerTable from '@/app/supplier/shared/components/supplier-inner-table.vue';
import LazyDropdown from '@/app/shared/components/lazy-dropdown.vue';

import type { ListOrder } from '@/@types/order';
import type { ActiveProduct } from '@/@types/product';
import type { Filter, ShipmentsFilter, Sort } from '@/@types/table';
import type { CustomError } from '@/app/shared/services/hooks/notifications';
import type { Callbacks, FiltersScheme } from '@/app/shared/services/hooks/table-filters';

library.add(faFilter, faFileExcel, faFloppyDisk, faFilterCircleXmark);

const props = defineProps({
  updatedFilter: { type: Boolean, required: true },
});

const emit = defineEmits(['update-data', 'get-products', 'reset-filter']);

const tablesStore = useTablesStore();
const infoStore = useInfoStore();
const supplierStore = useSupplierStore();
const ordersStore = useOrdersStore();
const { t } = useI18n();
const { onError, onSuccess } = useNotifications();
const { exportData } = useExportTableData();

const filtersState = computed(() => tablesStore.supplier);
const perPage = computed(() => (filtersState.value.perPage > 50 ? 50 : filtersState.value.perPage));

const expandedRows = ref([]);

const isLoading = ref(false);
const disabled = ref(false);
const active: { products: { [key: string]: ActiveProduct[] } } = reactive({ products: {} });

const filterCallbacks: Callbacks = [
  (payload: FiltersScheme): void => {
    tablesStore.setScheme('supplier', payload as never);
  },

  (payload: Sort): void => {
    tablesStore.setSort('supplier', payload);

    emit('update-data');
    expandedRows.value = [];
  },

  (payload: Filter & ShipmentsFilter): void => {
    tablesStore.setFilters('supplier', payload);

    emit('update-data');
    expandedRows.value = [];
  },

  (payload: { page: number; perPage: number }): void => {
    tablesStore.setPage('supplier', payload.page);
    tablesStore.setPerPage('supplier', payload.perPage);

    emit('update-data');
    expandedRows.value = [];
  },

  (payload: Filter & ShipmentsFilter): void => {
    tablesStore.setFilters('supplier', payload);

    emit('update-data');
    expandedRows.value = [];
  },
];

const { noDefaultFields, selectedColumns, showColumn, getColumnData, columnIsEmpty } =
  useTableColumns<ListOrder>(SUPPLIER_FIELDS, STORAGE_KEYS.SUPPLIER_COLUMNS);

const { filters, searchString, onSort, onFilter, onPageChange, onSearch } = useTableFilters(
  filtersState.value,
  filterCallbacks
);

const onRowExpand = ($event: { data: { guid: string } }) => {
  const {
    data: { guid },
  } = $event;

  if (!supplierStore.orderProducts(guid).length) {
    emit('get-products', guid);
  }
};

type SetActiveProducts = {
  guid: string;
  products: ActiveProduct[];
};

const setActiveProducts = ({ guid, products }: SetActiveProducts) => {
  const clone = cloneDeep(active.products);

  if (!products.length) {
    delete clone[guid];
  } else {
    clone[guid] = products;
  }

  active.products = clone;
};

type UpdateProductQuantity = {
  orderGuid: string;
  guid: string;
  value: number | string;
};

const updateProductQuantity = ({ orderGuid, guid, value }: UpdateProductQuantity) => {
  const clone = cloneDeep(active.products);
  const current = cloneDeep(clone[orderGuid]);
  const index = current.findIndex((item) => item.product_guid === guid);

  if (index > -1) {
    current[index].quantity = value;
  }

  clone[orderGuid] = current;
  active.products = clone;
};

const resetActiveProducts = (guid?: string) => {
  if (guid) {
    const clone = cloneDeep(active.products);

    delete clone[guid];
    active.products = clone;
  } else {
    active.products = {};
  }
};

const onSave = async () => {
  try {
    isLoading.value = true;

    const params = { products: Object.values(active.products).flat(2) };
    await moveToSwh(params);

    onSuccess(t('supplier.moveToSwhMessage'));
  } catch (error) {
    onError(error as CustomError);
  } finally {
    resetActiveProducts();

    isLoading.value = false;
    expandedRows.value = [];
    supplierStore.resetProducts();
  }
};

useTableFiltersObserver(selectedColumns);

const { cm, copyData, onRowContextMenu } = useCopyData();

const selectedProduct: Ref<ListOrder> = ref({} as ListOrder);
const menuModel = ref([
  {
    label: t('order.messages.copyOrderNumber'),
    icon: 'pi pi-fw pi-copy',
    command: () => copyData(selectedProduct.value.orderNumber),
  },
]);

onUpdated(() => {
  filters.value = filtersState.value.scheme;

  if (props.updatedFilter) {
    searchString.value = '';
  }
});

watch(
  () => active.products,
  (products) => {
    const withZeroQuantity = Object.values(products)
      .flatMap((product) => product)
      .find((product) => !product.quantity);

    disabled.value = Boolean(withZeroQuantity);
  },
  { deep: true }
);
</script>
