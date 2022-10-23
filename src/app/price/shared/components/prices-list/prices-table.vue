<template>
  <data-table
    lazy
    data-key="guid"
    :value="priceListStore.prices"
    v-model:filters="filters"
    :loading="priceListStore.loading"
    filter-display="menu"
    striped-rows
    responsive-layout="scroll"
    @filter="onFilter"
  >
    <template #empty>
      <div class="p-3 text-4xl">
        {{ $t('price.notFound') }}
      </div>
    </template>

    <template #loading>
      {{ $t('price.loading') }}
    </template>

    <column
      v-if="getColumnData('forwarder.guid')?.default || columnIsSelected('forwarder.guid')"
      filter-field="forwarderGuids"
      :header="$t(getColumnData('forwarder.guid')?.title)"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      style="min-width: 12rem; width: 12rem"
      class="relative"
    >
      <template #body="{ data }">
        {{ data.forwarder.name }}

        <router-link
          v-if="data.guid"
          :to="{ name: 'price-item', params: { guid: data.guid } }"
          class="absolute top-0 left-0 z-1 w-full h-full"
        />
      </template>

      <template #filter="{ filterModel }">
        <lazy-dropdown
          multiple
          type="forwarders"
          :model-value="filterModel.value"
          :placeholder="$t('placeholders.forwarder')"
          class="w-full text-left"
          @update-model-value="($event) => (filterModel.value = $event.value)"
        />
      </template>
    </column>

    <column
      v-if="getColumnData('ways')?.default || columnIsSelected('ways')"
      filter-field="wayIds"
      :header="$t(getColumnData('ways')?.title)"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      style="min-width: 12rem; width: 12rem"
      class="relative"
    >
      <template #body="{ data }">
        {{ data.ways.map((way: { name: string }) => way.name).join(', ') }}

        <router-link
          v-if="data.guid"
          :to="{ name: 'price-item', params: { guid: data.guid } }"
          class="absolute top-0 left-0 z-1 w-full h-full"
        />
      </template>

      <template #filter="{ filterModel }">
        <filter-dropdown
          multiple
          type="ways"
          :model-value="filterModel.value"
          :placeholder="$t('placeholders.way')"
          class="w-full text-left"
          @update-model-value="($event) => (filterModel.value = $event.value)"
        />
      </template>
    </column>

    <column
      v-if="getColumnData('tariff.id')?.default || columnIsSelected('tariff.id')"
      filter-field="tariffIds"
      :header="$t(getColumnData('tariff.id')?.title)"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      style="min-width: 12rem; width: 12rem"
      class="relative"
    >
      <template #body="{ data }">
        {{ data.tariff.tariff }}

        <router-link
          v-if="data.guid"
          :to="{ name: 'price-item', params: { guid: data.guid } }"
          class="absolute top-0 left-0 z-1 w-full h-full"
        />
      </template>

      <template #filter="{ filterModel }">
        <filter-dropdown
          multiple
          type="tariffs"
          :model-value="filterModel.value"
          :placeholder="$t('placeholders.tariff')"
          class="w-full text-left"
          @update-model-value="($event) => (filterModel.value = $event.value)"
        />
      </template>
    </column>

    <column
      v-if="getColumnData('is_active')?.default || columnIsSelected('is_active')"
      filter-field="isActive"
      :header="$t(getColumnData('is_active')?.title)"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      :show-clear-button="false"
      style="min-width: 12rem; width: 12rem"
      class="relative py-0"
    >
      <template #body="{ data }">
        <checkbox :model-value="data.is_active" binary />

        <router-link
          v-if="data.guid"
          :to="{ name: 'price-item', params: { guid: data.guid } }"
          class="absolute top-0 left-0 z-1 w-full h-full"
        />
      </template>

      <template #filter="{ filterModel }">
        <dropdown
          v-model="filterModel.value"
          :options="[
            { id: 1, name: 'Relevant dates' },
            { id: 0, name: 'Unrelevant dates' },
          ]"
          option-value="id"
          option-label="name"
          :placeholder="$t('placeholders.dateRelevant')"
        />
      </template>
    </column>

    <column
      v-if="getColumnData('relevant_date_from')?.default || columnIsSelected('relevant_date_from')"
      :header="$t(getColumnData('relevant_date_from')?.title)"
      style="min-width: 12rem; width: 12rem"
      class="relative"
    >
      <template #body="{ data }">
        {{ formatDate(data.relevant_date_from) }} - {{ formatDate(data.relevant_date_to) }}

        <router-link
          v-if="data.guid"
          :to="{ name: 'price-item', params: { guid: data.guid } }"
          class="absolute top-0 left-0 z-1 w-full h-full"
        />
      </template>
    </column>
  </data-table>

  <paginator
    :first="(filtersState.page - 1) * filtersState.perPage"
    :rows="Number(filtersState.perPage)"
    :total-records="priceListStore.total"
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
    :style="priceListStore.loading ? 'pointer-events: none' : ''"
    @page="onPageChange"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import DataTable from 'primevue/datatable';
import Paginator from 'primevue/paginator';
import Column from 'primevue/column';
import Checkbox from 'primevue/checkbox';
import Dropdown from 'primevue/dropdown';

import usePriceListStore from '@/app/price/shared/store/price-list-store';
import useTablesStore, { PER_PAGE_OPTIONS } from '@/app/shared/store/tables-store';
import useTableColumns from '@/app/shared/services/hooks/table-columns';
import useTableFilters from '@/app/shared/services/hooks/table-filters';
import useTableFiltersObserver from '@/app/shared/services/hooks/table-filters-observer';

import { PRICES_FIELDS, STORAGE_KEYS } from '@/app/price/shared/config/tables-fields-constants';
import { formatDate } from '@/app/shared/services/helpers/table-helpers';

import LazyDropdown from '@/app/shared/components/lazy-dropdown.vue';
import FilterDropdown from '@/app/shared/components/filter-dropdown.vue';

import type { Filter, ShipmentsFilter } from '@/@types/table';
import type { Callbacks, FiltersScheme } from '@/app/shared/services/hooks/table-filters';

const emit = defineEmits(['update-data']);

const priceListStore = usePriceListStore();
const tablesStore = useTablesStore();

const filtersState = computed(() => tablesStore.priceList);

const filterCallbacks: Callbacks = [
  (payload: FiltersScheme): void => {
    tablesStore.setScheme('priceList', payload as never);
  },

  undefined,

  (payload: Filter & ShipmentsFilter): void => {
    tablesStore.setFilters('priceList', payload);

    emit('update-data');
  },

  (payload: { page: number; perPage: number }): void => {
    tablesStore.setPage('priceList', payload.page);
    tablesStore.setPerPage('priceList', payload.perPage);

    emit('update-data');
  },

  undefined,
];

const { getColumnData, columnIsSelected } = useTableColumns(PRICES_FIELDS, STORAGE_KEYS);

const { filters, onFilter, onPageChange } = useTableFilters(filtersState.value, filterCallbacks);

useTableFiltersObserver();
</script>
