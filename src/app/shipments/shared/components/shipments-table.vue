<template>
  <data-table
    id="shipments"
    lazy
    data-key="guid"
    :value="shipmentsStore.loading ? new Array(perPage) : [...newItems, ...items]"
    v-model:filters="filters"
    :removable-sort="true"
    filter-display="menu"
    striped-rows
    responsive-layout="scroll"
    :class="{ 'pointer-events-none': shipmentsStore.loading }"
    @filter="onFilter"
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
          @click="exportData('shipments')"
        >
          <font-awesome-icon icon="file-excel" size="xl" />
        </prime-button>

        <prime-button
          v-if="!isActiveStatus"
          type="button"
          class="flex align-items-center p-button-success mr-auto ml-3"
          style="padding-top: 0.5050625rem; padding-bottom: 0.5050625rem"
          @click="addShipment"
        >
          <font-awesome-icon icon="plus" size="xl" class="mr-3" />

          <span class="text-lg">
            {{ $t('shipments.buttons.new') }}
          </span>
        </prime-button>
      </div>
    </template>

    <template #empty>
      <div class="p-3 text-4xl">
        {{ $t('shipments.noFound') }}
      </div>
    </template>

    <template #loading>
      {{ $t('shipments.loading') }}
    </template>

    <column
      v-if="showColumn(items, 'way', 'way_ids') || newItems.length"
      :field="getColumnData('way')?.name"
      :header="$t(getColumnData('way')?.title)"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      style="min-width: 15rem; width: 15rem"
    >
      <template #body="{ data, index }">
        <template v-if="!shipmentsStore.loading">
          <template v-if="!data.isNew">
            {{ data.way_ids.map((id: number) => infoStore.wayName(id)).join(', ') }}
          </template>

          <template v-else>
            <multi-select
              :model-value="data.way_ids"
              :options="infoStore.ways"
              option-label="name"
              option-value="id"
              :placeholder="$t('placeholders.way')"
              class="p-select-xs w-15rem text-left"
              scroll-height="25rem"
              @change="updateData(`[${index}].way_ids`, $event.value)"
            />
          </template>
        </template>

        <skeleton v-else />
      </template>

      <template #filter="{ filterModel }">
        <dropdown
          v-model="filterModel.value"
          show-clear
          :options="infoStore.ways"
          option-label="name"
          option-value="id"
          scroll-height="25rem"
          :placeholder="$t('placeholders.way')"
        />
      </template>
    </column>

    <column
      v-if="showColumn(items, 'supplier') || newItems.length"
      :field="getColumnData('supplier')?.name"
      :header="$t(getColumnData('supplier')?.title)"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      style="min-width: 15rem; width: 15rem"
    >
      <template #body="{ data, index }">
        <template v-if="!shipmentsStore.loading">
          <template v-if="!data.isNew">
            {{ data.supplier?.label }}
          </template>

          <template v-else>
            <lazy-dropdown
              type="suppliers"
              :model-value="
                data.supplier
                  ? { value: data.supplier.value, label: data.supplier.label }
                  : undefined
              "
              :placeholder="$t('placeholders.supplier')"
              class="p-select-xs w-15rem text-left"
              @update-model-value="
                updateData(`[${index}].supplier.value`, $event?.value?.value || ''),
                  updateData(`[${index}].supplier.label`, $event?.value?.label || '')
              "
            />
          </template>
        </template>

        <skeleton v-else />
      </template>

      <template #filter="{ filterModel }">
        <lazy-dropdown
          show-clear
          type="suppliers"
          :model-value="filterModel.value"
          :placeholder="$t('placeholders.supplier')"
          class="w-full text-left"
          @update-model-value="($event) => (filterModel.value = $event.value)"
        />
      </template>
    </column>

    <column
      v-if="showColumn(items, 'forwarder') || newItems.length"
      :field="getColumnData('forwarder')?.name"
      :header="$t(getColumnData('forwarder')?.title)"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      style="min-width: 15rem; width: 15rem"
    >
      <template #body="{ data, index }">
        <template v-if="!shipmentsStore.loading">
          <template v-if="!data.isNew">
            {{ data.forwarder?.label }}
          </template>

          <template v-else>
            <lazy-dropdown
              type="forwarders-strict"
              :model-value="
                data.forwarder
                  ? { value: data.forwarder.value, label: data.forwarder.label }
                  : undefined
              "
              :way-ids="data.way_ids"
              :placeholder="$t('placeholders.forwarder')"
              class="p-select-xs w-15rem text-left"
              @update-model-value="
                updateData(`[${index}].forwarder.value`, $event?.value?.value || ''),
                  updateData(`[${index}].forwarder.label`, $event?.value?.label || ''),
                  changeForwarderWays($event?.value?.way_ids || [])
              "
            />
          </template>
        </template>

        <skeleton v-else />
      </template>

      <template #filter="{ filterModel }">
        <lazy-dropdown
          show-clear
          type="forwarders"
          :model-value="filterModel.value"
          :placeholder="$t('placeholders.forwarder')"
          class="w-full text-left"
          @update-model-value="($event) => (filterModel.value = $event.value)"
        />
      </template>
    </column>

    <column
      v-if="showColumn(items, 'shipmentLoadingType') || newItems.length"
      :field="getColumnData('shipmentLoadingType')?.name"
      :header="$t(getColumnData('shipmentLoadingType')?.title)"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      style="min-width: 15rem; width: 15rem"
    >
      <template #body="{ data, index }">
        <template v-if="!shipmentsStore.loading">
          <template v-if="!data.isNew">
            {{ infoStore.loadingTypeName(data.shipmentLoadingType) }}
          </template>

          <template v-else>
            <shipments-dropdown
              show-clear
              :way-ids="data.way_ids"
              :filter-ways="forwarderWays"
              :model-value="data.shipmentLoadingType"
              type="loadingType"
              class="p-select-xs w-15rem text-left"
              :placeholder="$t('placeholders.incoterm')"
              @update-data="
                updateData(`[${index}].shipmentLoadingType`, $event?.value),
                  changeTuWays($event?.wayIds || [])
              "
            />
          </template>
        </template>

        <skeleton v-else />
      </template>

      <template #filter="{ filterModel }">
        <dropdown
          v-model="filterModel.value"
          show-clear
          :options="infoStore.loadingTypes"
          option-label="type"
          option-value="id"
          scroll-height="25rem"
          :placeholder="$t('placeholders.incoterm')"
        />
      </template>
    </column>

    <column
      v-if="showColumn(items, 'pointOfLoading') || newItems.length"
      :field="getColumnData('pointOfLoading')?.name"
      :header="$t(getColumnData('pointOfLoading')?.title)"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      style="min-width: 18rem"
    >
      <template #body="{ data, index }">
        <template v-if="!shipmentsStore.loading">
          <template v-if="!data.isNew">
            {{ infoStore.portName(data.pointOfLoading) }}
          </template>

          <template v-else>
            <dropdown
              :model-value="data.pointOfLoading"
              show-clear
              :options="infoStore.ports"
              option-label="name"
              option-value="id"
              option-group-label="countryName"
              option-group-children="ports"
              :placeholder="$t('placeholders.portOfLoading')"
              class="p-select-xs w-15rem text-left"
              scroll-height="25rem"
              @change="updateData(`[${index}].pointOfLoading`, $event.value)"
            />
          </template>
        </template>

        <skeleton v-else />
      </template>

      <template #filter="{ filterModel }">
        <dropdown
          v-model="filterModel.value"
          show-clear
          :options="infoStore.ports"
          option-label="name"
          option-value="id"
          option-group-label="countryName"
          option-group-children="ports"
          scroll-height="25rem"
          :placeholder="$t('placeholders.portOfLoading')"
        />
      </template>
    </column>

    <column
      v-if="showColumn(items, 'weight') || newItems.length"
      :field="getColumnData('weight')?.name"
      :header="$t(getColumnData('weight')?.title)"
      style="min-width: 8rem; width: 8rem"
    >
      <template #body="{ data, index }">
        <template v-if="!shipmentsStore.loading">
          <template v-if="!data.isNew">
            {{ data.weight }}
          </template>

          <template v-else>
            <input-number
              :model-value="Number(data.weight)"
              mode="decimal"
              locale="de-DE"
              :min="0"
              :max="data.weight"
              :max-fraction-digits="5"
              :use-grouping="false"
              :placeholder="$t('placeholders.weight')"
              input-class="p-inputtext-xs w-8rem"
              @input="updateData(`[${index}].weight`, $event.value)"
            />
          </template>
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(items, 'volume') || newItems.length"
      :field="getColumnData('volume')?.name"
      :header="$t(getColumnData('volume')?.title)"
      style="min-width: 8rem; width: 8rem"
    >
      <template #body="{ data, index }">
        <template v-if="!shipmentsStore.loading">
          <template v-if="!data.isNew">
            {{ data.volume }}
          </template>

          <template v-else>
            <input-number
              :model-value="Number(data.volume)"
              mode="decimal"
              locale="de-DE"
              :min="0"
              :max="data.volume"
              :max-fraction-digits="5"
              :use-grouping="false"
              :placeholder="$t('placeholders.volume')"
              input-class="p-inputtext-xs w-8rem"
              @input="updateData(`[${index}].volume`, $event.value)"
            />
          </template>
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(items, 'tu', 'transportUnits') || newItems.length"
      :field="getColumnData('tu')?.name"
      :header="$t(getColumnData('tu')?.title)"
      style="min-width: 12rem; width: 12rem"
    >
      <template #body="{ data, index }">
        <template v-if="!shipmentsStore.loading">
          <template v-if="!data.isNew">
            <div
              v-for="(name, index) in data.transportUnits.map((item) => item.type)"
              :key="index"
              style="height: 1rem; line-height: 1rem"
            >
              <span v-if="index !== 0" class="absolute opacity-0">&nbsp;/&nbsp;</span>

              {{ name }}
            </div>
          </template>

          <template v-else>
            <template v-for="(item, innerIndex) in data.transportUnits" :key="innerIndex">
              <shipments-dropdown
                show-clear
                :way-ids="data.way_ids"
                :filter-ways="tuWays"
                :model-value="item.type"
                type="transportUnit"
                class="p-select-xs w-15rem text-left"
                :class="`
                  ${(innerIndex > 0 && 'mt-2') || ''}
                  ${tuValid(item) && sizeValid(item) ? '' : 'p-invalid'}`"
                :placeholder="$t('placeholders.tu')"
                @update-data="
                  updateData(`[${index}].transportUnits[${innerIndex}].type`, $event?.value)
                "
              />
            </template>
          </template>
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(items, 'size', 'transportUnits') || newItems.length"
      :field="getColumnData('size')?.name"
      :header="$t(getColumnData('size')?.title)"
      style="min-width: 12rem; width: 12rem"
    >
      <template #body="{ data, index }">
        <template v-if="!shipmentsStore.loading">
          <template v-if="!data.isNew">
            <div
              v-for="(value, index) in data.transportUnits.map((item) => item.size)"
              :key="index"
              style="height: 1rem; line-height: 1rem"
            >
              <span v-if="index !== 0" class="absolute opacity-0">&nbsp;/&nbsp;</span>

              {{ value }}
            </div>
          </template>

          <template v-else>
            <template v-for="(item, innerIndex) in data.transportUnits" :key="innerIndex">
              <shipments-dropdown
                show-clear
                :way-ids="data.way_ids"
                :filter-ways="tuWays"
                :model-value="item.size"
                type="size"
                class="p-select-xs w-15rem text-left"
                :class="`${(innerIndex > 0 && 'mt-2') || ''} ${sizeValid(item) ? '' : 'p-invalid'}`"
                :placeholder="$t('placeholders.size')"
                @update-data="
                  updateData(`[${index}].transportUnits[${innerIndex}].size`, $event?.value)
                "
              />
            </template>
          </template>
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(items, 'amount', 'transportUnits') || newItems.length"
      :field="getColumnData('amount')?.name"
      :header="$t(getColumnData('amount')?.title)"
      style="min-width: 14rem; width: 14rem"
    >
      <template #body="{ data, index }">
        <template v-if="!shipmentsStore.loading">
          <template v-if="!data.isNew">
            <div
              v-for="(amount, index) in data.transportUnits.map((item) => item.amount)"
              :key="`data-${index}`"
              style="height: 1rem; line-height: 1rem"
            >
              <span v-if="index !== 0" class="absolute opacity-0">&nbsp;/&nbsp;</span>

              {{ amount }}
            </div>
          </template>

          <template v-else>
            <div
              v-for="(item, innerIndex) in data.transportUnits"
              :key="`inner-${innerIndex}`"
              class="flex align-items-center"
              :class="(innerIndex > 0 && 'mt-2') || ''"
            >
              <input-number
                :model-value="Number(item.amount)"
                mode="decimal"
                :min="0"
                :max="item.amount"
                :use-grouping="false"
                :placeholder="$t('placeholders.tuAmount')"
                :input-class="`p-inputtext-xs w-10rem ${tuValid(item) ? '' : 'p-invalid'}`"
                @input="updateData(`[${index}].transportUnits[${innerIndex}].amount`, $event.value)"
              />

              <prime-button
                v-if="innerIndex === 0"
                class="p-button-success p-button-sm flex align-items-center justify-content-center p-0 ml-2"
                style="width: 1.6875rem; height: 1.6875rem"
                @click="addTransportUnit(index)"
              >
                <font-awesome-icon icon="plus" size="lg" />
              </prime-button>

              <prime-button
                v-else
                icon="pi pi-minus"
                class="p-button-danger p-button-sm flex align-items-center justify-content-center p-0 ml-2"
                style="width: 1.6875rem; height: 1.6875rem"
                @click="deleteTransportUnit(index, innerIndex)"
              >
                <font-awesome-icon icon="minus" size="lg" />
              </prime-button>
            </div>
          </template>
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(items, 'cargoReadyDate') || newItems.length"
      :field="getColumnData('cargoReadyDate')?.name"
      :header="$t(getColumnData('cargoReadyDate')?.title)"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      style="min-width: 14rem; width: 14rem"
      class="relative"
    >
      <template #body="{ data, index }">
        <template v-if="!shipmentsStore.loading">
          <template v-if="!data.isNew">
            {{ formatDate(data.cargoReadyDate) }}
          </template>

          <template v-else>
            <calendar
              :model-value="data.cargoReadyDate"
              :manual-input="false"
              date-format="yy-mm-dd"
              :placeholder="$t('placeholders.date')"
              input-class="p-inputtext-xs w-14rem"
              @date-select="updateData(`${index}.cargoReadyDate`, formatDate($event))"
            />
          </template>
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

    <column class="py-0" style="min-width: 0; width: 0">
      <template #body="{ data, index }">
        <template v-if="!shipmentsStore.loading">
          <template v-if="!data.isNew">
            <div class="flex justify-content-end">
              <prime-button
                v-if="!isActiveStatus"
                :label="$t('shipments.buttons.moveToActive')"
                type="button"
                class="p-button-success p-button-sm flex-grow-1 flex-shrink-0 white-space-nowrap"
                style="padding: 0.31rem 0.5rem; margin-right: 0.375rem"
                :disabled="disabledIndex === index"
                @click="moveToActive(data.guid, index)"
              />

              <prime-button
                type="button"
                class="p-button-sm flex align-items-center justify-content-center p-0"
                :disabled="disabledIndex === index"
                style="width: 1.6875rem; height: 1.6875rem"
                @click="moveToCanceled(data.guid, index)"
              >
                <font-awesome-icon icon="trash-can" size="lg" />
              </prime-button>
            </div>
          </template>

          <template v-else>
            <div class="flex justify-content-end">
              <prime-button
                :label="$t('shipments.buttons.save')"
                type="button"
                class="p-button-success p-button-sm flex-shrink-0 white-space-nowrap"
                style="padding: 0.31rem 0.5rem; margin-right: 0.375rem"
                :loading="loadingIndex === index"
                :disabled="disabled(data)"
                @click="saveShipment(index)"
              />

              <prime-button
                :label="$t('shipments.buttons.close')"
                type="button"
                class="p-button-danger p-button-sm flex-shrink-0 white-space-nowrap"
                style="padding: 0.31rem 0.5rem"
                :disabled="loadingIndex === index"
                @click="deleteShipment(index)"
              />
            </div>
          </template>
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
import { computed, onUpdated } from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';

import {
  faFilter,
  faFileExcel,
  faPlus,
  faMinus,
  faFilterCircleXmark,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';

import DataTable from 'primevue/datatable';
import Paginator from 'primevue/paginator';
import Column from 'primevue/column';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import InputNumber from 'primevue/inputnumber';
import PrimeButton from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import useTablesStore, { PER_PAGE_OPTIONS } from '@/app/shared/store/tables-store';
import useInfoStore from '@/app/shared/store/info-store';
import useShipmentsStore from '@/app/shipments/shared/store/shipments-store';
import useTableColumns from '@/app/shared/services/hooks/table-columns';
import useTableFilters from '@/app/shared/services/hooks/table-filters';
import useCreateShipments from '@/app/shipments/shared/services/hooks/create-shipments';
import useTableFiltersObserver from '@/app/shared/services/hooks/table-filters-observer';
import useShipmentsStatuses from '@/app/shipments/shared/services/hooks/shipments-statuses';
import useActiveWays from '@/app/shipments/shared/services/hooks/active-ways';
import useExportTableData from '@/app/shared/services/hooks/export-table-data';

import {
  SHIPMENTS_FIELDS,
  STORAGE_KEY,
} from '@/app/shipments/shared/config/table-fields-constants';
import { formatDate } from '@/app/shared/services/helpers/table-helpers';
import { FILTERS_CONSTANTS } from '@/app/shipments/shared/config/filters-scheme-constants';

import ShipmentsDropdown from '@/app/shipments/shared/components/shipments-dropdown.vue';
import LazyDropdown from '@/app/shared/components/lazy-dropdown.vue';

import type { Filter, ShipmentsFilter } from '@/@types/table';
import type { Callbacks, FiltersScheme } from '@/app/shared/services/hooks/table-filters';

library.add(faFilter, faFileExcel, faPlus, faMinus, faFilterCircleXmark, faTrashCan);

const emit = defineEmits(['update-data', 'reset-filter']);

const props = defineProps({
  updatedFilter: { type: Boolean, required: true },
});

const tablesStore = useTablesStore();
const infoStore = useInfoStore();
const shipmentsStore = useShipmentsStore();
const { exportData } = useExportTableData();

const isActiveStatus = computed(() => tablesStore.isActiveShipmentsStatus);

const {
  items,
  newItems,

  filtersState,

  loadingIndex,

  addShipment,
  deleteShipment,
  addTransportUnit,
  deleteTransportUnit,
  updateData,

  saveShipment,
  disabled,
  tuValid,
  sizeValid,
} = useCreateShipments();

const perPage = computed(() => (filtersState.value.perPage > 50 ? 50 : filtersState.value.perPage));

const filterCallbacks: Callbacks = [
  (payload: FiltersScheme): void => {
    tablesStore.setScheme('shipments', payload as never);
  },

  undefined,

  (payload: Filter & ShipmentsFilter): void => {
    tablesStore.setFilters('shipments', payload);

    emit('update-data');
  },

  (payload: { page: number; perPage: number }): void => {
    tablesStore.setPage('shipments', payload.page);
    tablesStore.setPerPage('shipments', payload.perPage);

    emit('update-data');
  },

  undefined,
];

const { showColumn, getColumnData } = useTableColumns(SHIPMENTS_FIELDS, STORAGE_KEY);

const { filters, searchString, onFilter, onPageChange } = useTableFilters(
  filtersState.value,
  filterCallbacks
);

const { disabledIndex, moveToActive, moveToCanceled } = useShipmentsStatuses();

const { forwarderWays, changeForwarderWays, tuWays, changeTuWays } = useActiveWays();

onUpdated(() => {
  if (props.updatedFilter) {
    filters.value = FILTERS_CONSTANTS;
    searchString.value = '';
  }
});

useTableFiltersObserver();
</script>
