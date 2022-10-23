<template>
  <data-table
    id="orders-list"
    lazy
    striped-rows
    data-key="guid"
    :value="ordersStore.loading ? new Array(perPage) : ordersStore[type]"
    v-model:filters="filters"
    :sort-field="filtersState.sort.sortKey || ''"
    :sort-order="filtersState.sort.orderBy === 'desc' ? 1 : -1"
    removable-sort
    filter-display="menu"
    responsive-layout="scroll"
    context-menu
    v-model:contextMenuSelection="selectedProduct"
    v-model:selection="selectedCustomers"
    :class="{ 'pointer-events-none': ordersStore.loading }"
    @sort="onSort"
    @filter="onFilter"
    @row-contextmenu="onRowContextMenu"
  >
    <template #header>
      <div class="flex flex-wrap align-items-center">
        <checkbox
          v-show="isPlanned"
          class="mr-4"
          :model-value="isChecked"
          :disabled="!disabledCheckbox"
          binary
          @change="checkboxToggleHandler"
        />

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
          @click="exportData('orders-list', [0])"
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
                  ${columnIsEmpty(ordersStore[type], item.name) ? '(Empty)' : ''}
                `
                  )
                  .join(', ')
              }}
            </template>
          </template>

          <template #option="{ option }">
            {{ $t(option.title) }}
            {{ columnIsEmpty(ordersStore[type], option.name) ? '(Empty)' : '' }}
          </template>
        </multi-select>

        <div
          v-if="selectedCustomers.length && $can('create', 'Order.responsible')"
          class="flex align-items-center my-1 ml-3"
        >
          <dropdown
            v-model="responsible"
            filter
            show-clear
            :options="infoStore.members"
            option-label="name"
            option-value="id"
            :placeholder="$t('placeholders.responsible')"
            class="w-18rem"
            scroll-height="25rem"
          />

          <prime-button
            type="button"
            :disabled="!responsible"
            class="flex align-items-center justify-content-center p-0 ml-2"
            style="width: 2.8125rem; height: 2.8125rem"
            @click="onChangeResponsible"
          >
            <font-awesome-icon icon="floppy-disk" size="xl" />
          </prime-button>
        </div>

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
        {{ $t('orders.noFound') }}
      </div>
    </template>

    <column
      v-if="$can('create', 'Order.responsible') || isPlanned"
      selection-mode="multiple"
      :header-style="{ width: '3.25rem' }"
      class="py-0"
    />

    <column
      v-if="showColumn(ordersStore[type], 'factory.name')"
      sortable
      sort-field="factory.name"
      filter-field="factory"
      :header="$t(getColumnData('factory.name')?.title)"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      style="min-width: 13rem"
      class="relative py-0"
    >
      <template #body="{ data }">
        <router-link
          v-if="!ordersStore.loading"
          :to="{ name: 'supplier', params: { guid: data.factory.guid } }"
          class="no-underline"
          style="font-size: inherit"
        >
          <prime-button :label="data.factory.name" class="p-button-link p-0" />
        </router-link>

        <skeleton v-else />
      </template>

      <template #filter="{ filterModel }">
        <lazy-dropdown
          type="suppliers"
          :model-value="filterModel.value"
          :placeholder="$t('placeholders.supplier')"
          class="w-full text-left"
          @update-model-value="($event) => (filterModel.value = $event.value)"
        />
      </template>
    </column>

    <column
      v-if="showColumn(ordersStore[type], 'orderNumber')"
      field="orderNumber"
      sortable
      :header="$t(getColumnData('orderNumber')?.title)"
      style="min-width: 10rem"
      class="relative"
    >
      <template #body="{ data }">
        <template v-if="!ordersStore.loading">
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
      v-if="showColumn(ordersStore[type], 'proformaInvoiceNumber')"
      field="proformaInvoiceNumber"
      sortable
      :header="$t(getColumnData('proformaInvoiceNumber')?.title)"
      style="min-width: 12rem"
      class="relative"
    >
      <template #body="{ data }">
        <template v-if="!ordersStore.loading">
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
      v-if="showColumn(ordersStore[type], 'proformaInvoiceDate')"
      sortable
      :header="$t(getColumnData('proformaInvoiceDate')?.title)"
      field="proformaInvoiceDate"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      style="min-width: 12rem"
      class="relative"
    >
      <template #body="{ data }">
        <template v-if="!ordersStore.loading">
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
      v-if="showColumn(ordersStore[type], 'createdAt')"
      sortable
      :header="$t(getColumnData('createdAt')?.title)"
      field="createdAt"
      style="min-width: 10rem"
      class="relative"
    >
      <template #body="{ data }">
        <template v-if="!ordersStore.loading">
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
      v-if="showColumn(ordersStore[type], 'responsible.name') && $can('view', 'Order.responsible')"
      sort-field="responsible.name"
      filter-field="responsible"
      :header="$t(getColumnData('responsible.name')?.title)"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      style="min-width: 14rem"
      class="relative"
    >
      <template #body="{ data }">
        <template v-if="!ordersStore.loading">
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
      v-if="showColumn(ordersStore[type], 'company.name')"
      field="company"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      :header="$t(getColumnData('company.name')?.title)"
      style="min-width: 12rem"
      class="relative"
    >
      <template #body="{ data }">
        <template v-if="!ordersStore.loading">
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
      v-if="showColumn(ordersStore[type], 'estimatedProductionEndDate')"
      sortable
      field="estimatedProductionEndDate"
      :header="$t(getColumnData('estimatedProductionEndDate')?.title)"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      style="min-width: 10rem"
      class="relative"
    >
      <template #body="{ data }">
        <template v-if="!ordersStore.loading">
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
      v-if="showColumn(ordersStore[type], 'category')"
      field="category"
      :header="$t(getColumnData('category')?.title)"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      style="min-width: 12rem"
      class="relative"
    >
      <template #body="{ data }">
        <template v-if="!ordersStore.loading">
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
      v-if="showColumn(ordersStore[type], 'articles')"
      field="articles"
      sortable
      :header="$t(getColumnData('articles')?.title)"
      style="min-width: 10rem"
      class="relative"
    >
      <template #body="{ data }">
        <template v-if="!ordersStore.loading">
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
      v-if="showColumn(ordersStore[type], 'pieces')"
      sortable
      field="pieces"
      :header="$t(getColumnData('pieces')?.title)"
      style="min-width: 10rem"
      class="relative"
    >
      <template #body="{ data }">
        <template v-if="!ordersStore.loading">
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
      v-if="showColumn(ordersStore[type], 'orderExecution')"
      sortable
      field="orderExecution"
      :header="$t(getColumnData('orderExecution')?.title)"
      style="min-width: 10rem"
      class="relative"
    >
      <template #body="{ data }">
        <template v-if="!ordersStore.loading">
          {{ data.orderExecution }} %

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
      v-if="showColumn(ordersStore[type], 'total.usd')"
      field="total.usd"
      sortable
      :header="$t(getColumnData('total.usd')?.title)"
      style="min-width: 10rem"
      class="relative"
    >
      <template #body="{ data }">
        <template v-if="!ordersStore.loading">
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
      v-if="showColumn(ordersStore[type], 'status.id')"
      sort-field="status.id"
      filter-field="status"
      sortable
      :header="$t(getColumnData('status.id')?.title)"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      style="min-width: 12rem"
      class="relative py-0 text-left"
    >
      <template #body="{ data }">
        <template v-if="!ordersStore.loading">
          <prime-button
            type="button"
            class="justify-content-center p-button-sm py-1 px-3"
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
          :options="
            type === 'drafts' || type === 'planned'
              ? infoStore.draftsStatuses
              : infoStore.ordersStatuses
          "
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
  </data-table>

  <paginator
    :first="(filtersState.page - 1) * filtersState.perPage"
    :rows="Number(filtersState.perPage)"
    :total-records="ordersStore[`total${type.charAt(0).toUpperCase() + type.slice(1)}`]"
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
    :style="ordersStore.loading ? 'pointer-events: none' : ''"
    @page="onPageChange"
  />

  <context-menu ref="cm" :model="menuModel" class="w-20rem" />
</template>

<script lang="ts" setup>
import { computed, ref, PropType, onUpdated, Ref } from 'vue';

import { useAbility } from '@casl/vue';
import { useI18n } from 'vue-i18n';

import { library } from '@fortawesome/fontawesome-svg-core';

import {
  faFilter,
  faFileExcel,
  faFloppyDisk,
  faFilterCircleXmark,
} from '@fortawesome/free-solid-svg-icons';

import vTooltip from 'primevue/tooltip';

import DataTable from 'primevue/datatable';
import Paginator from 'primevue/paginator';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import PrimeButton from 'primevue/button';
import MultiSelect from 'primevue/multiselect';
import Dropdown from 'primevue/dropdown';
import Skeleton from 'primevue/skeleton';
import Checkbox from 'primevue/checkbox';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ContextMenu from 'primevue/contextmenu';

import useTablesStore, { PER_PAGE_OPTIONS } from '@/app/shared/store/tables-store';
import useOrdersStore from '@/app/orders/shared/store/orders-store';
import useInfoStore from '@/app/shared/store/info-store';
import useTableColumns from '@/app/shared/services/hooks/table-columns';
import useTableFilters from '@/app/shared/services/hooks/table-filters';
import useExportTableData from '@/app/shared/services/hooks/export-table-data';
import useTableFiltersObserver from '@/app/shared/services/hooks/table-filters-observer';
import useBadgeFilters from '@/app/orders/shared/services/hooks/badge-filters';
import useBeforeLeave from '@/app/shared/services/hooks/before-leave';
import useTableSelectedCustomers from '@/app/orders/shared/services/hooks/table-selected-customers';
import useCopyData from '@/app/shared/services/hooks/copy-data';

import {
  formatDate,
  formatCurrency,
  getTagClass,
} from '@/app/shared/services/helpers/table-helpers';
import {
  ORDERS_FIELDS,
  DRAFTS_FIELDS,
  PLANNED_FIELDS,
  STORAGE_KEYS,
} from '@/app/orders/shared/config/table-fields-constants';

import LazyDropdown from '@/app/shared/components/lazy-dropdown.vue';

import type { ListOrder } from '@/@types/order';
import type { Filter, ShipmentsFilter, Sort } from '@/@types/table';
import type { Callbacks, FiltersScheme } from '@/app/shared/services/hooks/table-filters';
import type { OrdersType } from '@/app/orders/shared/services/hooks/badge-filters';

library.add(faFilter, faFileExcel, faFloppyDisk, faFilterCircleXmark);

const props = defineProps({
  type: { type: String as PropType<OrdersType>, required: true },
  updatedFilter: { type: Boolean, required: true },
});

const emit = defineEmits(['update-data', 'change-responsible', 'reset-filter']);

const tablesStore = useTablesStore();
const ordersStore = useOrdersStore();
const infoStore = useInfoStore();
const { t } = useI18n();
const { can: $can } = useAbility();
const { updateBadgeStatuses } = useBadgeFilters();

const filtersState = computed(() => tablesStore[props.type]);
const perPage = computed(() => (filtersState.value.perPage > 50 ? 50 : filtersState.value.perPage));

const fieldsData =
  props.type === 'orders'
    ? ORDERS_FIELDS
    : props.type === 'drafts'
    ? DRAFTS_FIELDS
    : PLANNED_FIELDS;

const fieldsStorageKey =
  props.type === 'orders'
    ? STORAGE_KEYS.ORDERS_COLUMNS
    : props.type === 'drafts'
    ? STORAGE_KEYS.DRAFTS_COLUMNS
    : STORAGE_KEYS.PLANNED_COLUMNS;

const filterCallbacks: Callbacks = [
  (payload: FiltersScheme): void => {
    tablesStore.setScheme(props.type, payload as never);
  },

  (payload: Sort): void => {
    tablesStore.setSort(props.type, payload);

    emit('update-data');
  },

  (payload: Filter & ShipmentsFilter): void => {
    updateBadgeStatuses(payload.statusIds, tablesStore[props.type].filters.statusIds);
    tablesStore.setFilters(props.type, payload);
    ordersStore.getStatisticsStatuses(props.type);

    emit('update-data');
  },

  (payload: { page: number; perPage: number }): void => {
    tablesStore.setPage(props.type, payload.page);
    tablesStore.setPerPage(props.type, payload.perPage);

    emit('update-data');
  },

  (payload: Filter & ShipmentsFilter): void => {
    tablesStore.setFilters(props.type, payload);
    ordersStore.getStatisticsStatuses(props.type);

    emit('update-data');
  },
];

const { noDefaultFields, selectedColumns, showColumn, getColumnData, columnIsEmpty } =
  useTableColumns<ListOrder>(fieldsData, fieldsStorageKey);

const { filters, searchString, onSort, onFilter, onPageChange, onSearch } = useTableFilters(
  filtersState.value,
  filterCallbacks
);

const responsible = ref();
const { selectedCustomers, isChecked, disabledCheckbox, checkboxToggleHandler, isPlanned } =
  useTableSelectedCustomers();

const onChangeResponsible = () => {
  const ids: string[] = selectedCustomers.value.map((item: { guid: string }): string => item.guid);

  emit('change-responsible', { guids: ids, userId: responsible.value, type: props.type });

  responsible.value = null;
  selectedCustomers.value = [];
};

useTableFiltersObserver(selectedColumns);

const { exportData } = useExportTableData();

const { cm, copyData, onRowContextMenu } = useCopyData();

const selectedProduct: Ref<ListOrder> = ref({} as ListOrder);
const menuModel = ref([
  {
    label: t('order.messages.copyFactory'),
    icon: 'pi pi-fw pi-copy',
    command: () => copyData(selectedProduct.value.factory.name),
  },
  {
    label: t('order.messages.copyOrderNumber'),
    icon: 'pi pi-fw pi-copy',
    command: () => copyData(selectedProduct.value.orderNumber),
  },
  {
    label: t('order.messages.copyPiNumber'),
    icon: 'pi pi-fw pi-copy',
    command: () => copyData(selectedProduct.value.proformaInvoiceNumber),
  },
]);

onUpdated(() => {
  filters.value = filtersState.value.scheme;

  if (props.updatedFilter) {
    searchString.value = '';
  }
});

const condition = computed(
  () => $can('create', 'Order.responsible') && !!selectedCustomers.value.length
);
useBeforeLeave(condition);
</script>
