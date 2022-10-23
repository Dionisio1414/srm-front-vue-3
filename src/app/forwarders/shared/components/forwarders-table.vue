<template>
  <data-table
    lazy
    data-key="guid"
    :value="forwardersStore.forwarders"
    :loading="forwardersStore.loading"
    striped-rows
    responsive-layout="scroll"
  >
    <template #header>
      <div class="flex justify-content-between align-items-center">
        <router-link :to="{ name: 'forwarder-create' }" class="no-underline">
          <prime-button
            class="flex align-items-center p-button-success"
            style="padding-top: 0.5050625rem; padding-bottom: 0.5050625rem"
          >
            <font-awesome-icon icon="plus" size="xl" class="mr-3" />

            <span class="text-lg">
              {{ $t('forwarder.buttons.addForwarder') }}
            </span>
          </prime-button>
        </router-link>

        <div class="field-checkbox mb-0 ml-auto">
          <input-switch
            id="showDeleted"
            :model-value="tablesStore.forwarders.filters.is_deleted"
            :true-value="1"
            :false-value="0"
            @input="onChange"
          />

          <label for="showDeleted" class="ml-3 text-xl">
            {{ $t('forwarder.buttons.showDeleted') }}
          </label>
        </div>

        <span class="p-input-icon-left my-1 ml-5">
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
        {{ $t('forwarder.noFound') }}
      </div>
    </template>

    <template #loading>
      {{ $t('forwarder.loading') }}
    </template>

    <column
      v-if="showColumn(forwardersStore.forwarders, 'name')"
      field="name"
      :header="$t(getColumnData('name')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        {{ data.name }}
      </template>
    </column>

    <column
      v-if="showColumn(forwardersStore.forwarders, 'legal_address')"
      field="legal_address"
      :header="$t(getColumnData('legal_address')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        {{ data.legal_address }}
      </template>
    </column>

    <column
      v-if="showColumn(forwardersStore.forwarders, 'service.countries')"
      field="service.countries"
      :header="$t(getColumnData('service.countries')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        {{ data.service?.countries?.map((country: { name: string }) => country.name )?.join(', ') }}
      </template>
    </column>

    <column
      v-if="showColumn(forwardersStore.forwarders, 'service.point_of_loading')"
      field="service.point_of_loading"
      :header="$t(getColumnData('service.point_of_loading')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        {{
          data.service?.point_of_loading?.map(
            (port: { name: string }) => port.name )?.join(', ')
        }}
      </template>
    </column>

    <column
      v-if="showColumn(forwardersStore.forwarders, 'service.ways')"
      field="service.ways"
      :header="$t(getColumnData('service.ways')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        {{ data.service?.ways?.map((way: { name: string }) => way.name )?.join(', ') }}
      </template>
    </column>

    <column
      v-if="showColumn(forwardersStore.forwarders, 'phone')"
      field="phone"
      :header="$t(getColumnData('phone')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        {{ data.phone }}
      </template>
    </column>

    <column
      v-if="showColumn(forwardersStore.forwarders, 'deleted')"
      :field="getColumnData('deleted')?.key"
      :header="$t(getColumnData('deleted')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data, field }">
        {{ formatDate(get(data, field), true) }}
      </template>
    </column>

    <column :exportable="false" class="py-0" style="min-width: 5rem">
      <template #body="{ data }">
        <div class="flex">
          <router-link
            :to="{ name: 'forwarder-edit', params: { guid: data.guid } }"
            class="no-underline"
          >
            <prime-button
              class="p-button-success p-button-sm flex align-items-center justify-content-center p-0"
              style="width: 1.6875rem; height: 1.6875rem"
            >
              <font-awesome-icon icon="pen-to-square" size="lg" />
            </prime-button>
          </router-link>

          <prime-button
            v-if="!data.deleted_at"
            class="p-button-danger p-button-sm flex align-items-center justify-content-center p-0 ml-3"
            style="width: 1.6875rem; height: 1.6875rem"
            :disabled="isLoading || dataLoading"
            @click="onDelete(data.guid, data.name)"
          >
            <font-awesome-icon icon="trash-can" size="lg" />
          </prime-button>
        </div>
      </template>
    </column>
  </data-table>

  <paginator
    :first="(filtersState.page - 1) * filtersState.perPage"
    :rows="Number(filtersState.perPage)"
    :total-records="forwardersStore.total"
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
    :style="forwardersStore.loading ? 'pointer-events: none' : ''"
    @page="onPageChange"
  />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useI18n } from 'vue-i18n';
import { useConfirm } from 'primevue/useconfirm';

import get from 'lodash.get';
import { library } from '@fortawesome/fontawesome-svg-core';

import { faPlus, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import vTooltip from 'primevue/tooltip';

import DataTable from 'primevue/datatable';
import Paginator from 'primevue/paginator';
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import Column from 'primevue/column';
import PrimeButton from 'primevue/button';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import useTablesStore, { PER_PAGE_OPTIONS } from '@/app/shared/store/tables-store';
import useForwardersStore from '@/app/forwarders/shared/store/forwarders-store';
import useTableColumns from '@/app/shared/services/hooks/table-columns';
import useTableFilters from '@/app/shared/services/hooks/table-filters';
import useTableFiltersObserver from '@/app/shared/services/hooks/table-filters-observer';
import useNotification from '@/app/shared/services/hooks/notifications';

import {
  FORWARDERS_FIELDS,
  STORAGE_KEY,
} from '@/app/forwarders/shared/config/table-fields-constants';
import { deleteForwarder } from '@/app/forwarders/shared/services/api';
import { formatDate } from '@/app/shared/services/helpers/table-helpers';

import type { Filter, ShipmentsFilter } from '@/@types/table';
import type { FiltersScheme, Callbacks } from '@/app/shared/services/hooks/table-filters';
import type { Forwarder } from '@/@types/forwarder';
import type { CustomError } from '@/app/shared/services/hooks/notifications';

library.add(faPlus, faPenToSquare, faTrashCan);

defineProps({
  dataLoading: { type: Boolean, required: true },
});

const emit = defineEmits(['update-data']);

const { t } = useI18n();
const confirm = useConfirm();
const tablesStore = useTablesStore();
const forwardersStore = useForwardersStore();
const { onSuccess, onError } = useNotification();

const isLoading = ref(false);

const filtersState = computed(() => tablesStore.forwarders);

const filterCallbacks: Callbacks = [
  (payload: FiltersScheme): void => {
    tablesStore.setScheme('shipments', payload as never);
  },

  undefined,

  undefined,

  (payload: { page: number; perPage: number }): void => {
    tablesStore.setPage('forwarders', payload.page);
    tablesStore.setPerPage('forwarders', payload.perPage);

    emit('update-data');
  },

  (payload: Filter & ShipmentsFilter): void => {
    tablesStore.setFilters('forwarders', payload);

    emit('update-data');
  },
];

const { showColumn, getColumnData } = useTableColumns<Forwarder>(FORWARDERS_FIELDS, STORAGE_KEY);

const { searchString, onPageChange, onSearch } = useTableFilters(
  filtersState.value,
  filterCallbacks
);

const deleteItem = async (guid: string, name: string) => {
  try {
    isLoading.value = true;

    await deleteForwarder(guid);
    emit('update-data', true);
    onSuccess(`Forwarder ${name} delete successfully`);
  } catch (error) {
    onError(error as CustomError);
  } finally {
    isLoading.value = false;
  }
};

const onDelete = async (guid: string, name: string) => {
  confirm.require({
    message: t('forwarder.confirmDeletion.message'),
    header: t('forwarder.confirmDeletion.header'),
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: t('forwarder.confirmDeletion.acceptLabel'),
    rejectLabel: t('forwarder.confirmDeletion.rejectLabel'),
    accept: () => deleteItem(guid, name),
  });
};

const onChange = (value: 0 | 1) => {
  tablesStore.$patch((state) => {
    state.forwarders.filters.is_deleted = value;
  });

  emit('update-data');
};

useTableFiltersObserver();
</script>
