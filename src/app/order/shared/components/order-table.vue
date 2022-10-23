<template>
  <data-table
    id="order"
    v-bind="$attrs"
    data-key="guid"
    :value="orderStore.loading ? new Array(10) : data"
    striped-rows
    responsive-layout="scroll"
    :rows="10"
    :rows-per-page-options="PER_PAGE_OPTIONS"
    :state-key="`product-table-${$route.params.guid}`"
    removable-sort
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
    edit-mode="row"
    v-model:filters="filters"
    v-model:editingRows="editingRows"
    filter-display="menu"
    :global-filter-fields="
      editingAllowed && !disabled
        ? undefined
        : ['guid', 'categoryName.en', 'categoryCode', 'brand.name', 'article.no', 'article.oe']
    "
    class="order-table"
    :class="{ 'pointer-events-none': orderStore.loading || disabled }"
    @row-edit-save="onRowEdit"
    @row-edit-cancel="onRowEditCancel"
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
          class="flex align-items-center justify-content-center p-0 ml-3"
          style="width: 2.8125rem; height: 2.8125rem"
          @click="exportData('order')"
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
                value.map((item: { title: string, name: string }) => `
                  ${$t(item.title)}
                  ${columnIsEmpty(data, item.name) ? "(Empty)" : ""}`
                ).join(", ")
              }}
            </template>
          </template>

          <template #option="{ option }">
            {{ $t(option.title) }}
            {{ columnIsEmpty(data, option.name) ? '(Empty)' : '' }}
          </template>
        </multi-select>

        <span class="p-input-icon-left my-1 ml-auto">
          <i class="pi pi-search" />

          <input-text
            v-model="filters['global'].value"
            :placeholder="$t('placeholders.search')"
            :disabled="editingAllowed && !disabled"
            class="w-18rem"
          />
        </span>
      </div>
    </template>

    <template #empty>
      <div class="p-3 text-4xl">
        {{ $t('order.notFound') }}
      </div>
    </template>

    <column v-if="editingAllowed && !disabled" style="min-width: 0" class="p-0">
      <template #body="{ data, index }">
        <button
          type="button"
          style="padding: 0.5rem 1rem; color: currentColor"
          :disabled="deleteDisabled"
          :style="deleteDisabled ? 'cursor: not-allowed' : ''"
          @click="$emit('delete-data', { index, data })"
        >
          <font-awesome-icon icon="trash-can" size="lg" />
        </button>
      </template>
    </column>

    <column
      v-if="editingAllowed && !disabled"
      :row-editor="true"
      style="min-width: 4rem"
      :body-style="{ 'text-align': 'center' }"
    />

    <column
      v-if="showColumn(data, 'id')"
      field="id"
      sortable
      :header="$t(getColumnData('id')?.title)"
      style="min-width: 5rem"
    >
      <template #body="{ data }">
        <template v-if="!orderStore.loading">
          {{ data.id }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(data, 'categoryName.en')"
      field="categoryName.en"
      sortable
      :header="$t(getColumnData('categoryName.en')?.title)"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      style="min-width: 20rem"
    >
      <template #body="{ data }">
        <template v-if="!orderStore.loading">
          {{ data.categoryName.en }}
        </template>

        <skeleton v-else />
      </template>

      <template #filter="{ filterModel }">
        <multi-select
          v-model="filterModel.value"
          :options="orderStore.categories"
          option-label=""
          scroll-height="25rem"
          :placeholder="$t('placeholders.category')"
        />
      </template>
    </column>

    <column
      v-if="showColumn(data, 'comment') || editingAllowed"
      field="comment"
      sortable
      :header="$t(getColumnData('comment')?.title)"
      style="min-width: 14rem"
    >
      <template #body="{ data }">
        <template v-if="!orderStore.loading">
          {{ data.comment }}
        </template>

        <skeleton v-else />
      </template>

      <template #editor="{ data }">
        <input-text
          :model-value="data.comment"
          class="p-inputtext-xs w-full"
          :class="{ 'p-invalid': articleValidator(data, 'comment') }"
          v-tooltip="{
            value: $t('validations.required', { property: 'comment' }),
            disabled: !articleValidator(data, 'comment'),
          }"
          @input="
            ($event) => {
              data.initialEdit = false;
              data.comment = $event.target.value;
              $emit('change-editing-products', { guid: data.guid, remove: false });
            }
          "
        />
      </template>
    </column>

    <column
      v-if="showColumn(data, 'categoryCode') || editingAllowed"
      field="categoryCode"
      sortable
      :header="$t(getColumnData('categoryCode')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!orderStore.loading">
          {{ data.categoryCode }}
        </template>

        <skeleton v-else />
      </template>

      <!-- <template #editor="{ data }">
        <lazy-dropdown
          type="category"
          :model-value="{ label: data.categoryCode }"
          :placeholder="$t('placeholders.category')"
          class="p-select-xs w-full text-left"
          :class="{'p-invalid': articleValidator(data, 'categoryCode')}"
          v-tooltip="{
            value: $t('validations.required', { property: 'category code' }),
            disabled: !articleValidator(data, 'categoryCode'),
          }"
          @update-model-value="
            ($event) => {
              data.initialEdit = $event.initial
              data.categoryCode = $event.value.label;
              data.categoryId = $event.value.value;
              if (!$event.initial) {
                $emit('change-editing-products', { guid: data.guid, remove: false });
              }
            }
          "
        />
      </template> -->
    </column>

    <column
      v-if="showColumn(data, 'brand.name')"
      field="brand.name"
      sortable
      :header="$t(getColumnData('brand.name')?.title)"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!orderStore.loading">
          {{ data.brand.name }}
        </template>

        <skeleton v-else />
      </template>

      <template #filter="{ filterModel }">
        <multi-select
          v-model="filterModel.value"
          :options="orderStore.brands"
          option-label=""
          scroll-height="25rem"
          :placeholder="$t('placeholders.brand')"
        />
      </template>
    </column>

    <column
      v-if="showColumn(data, 'article.no')"
      field="article.no"
      sortable
      :header="$t(getColumnData('article.no')?.title)"
      style="min-width: 14rem"
    >
      <template #body="{ data }">
        <template v-if="!orderStore.loading">
          {{ data.article.no }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(data, 'fid') || editingAllowed"
      field="fid"
      sortable
      :header="$t(getColumnData('fid')?.title)"
      style="min-width: 10rem"
    >
      <template #body="{ data }">
        <template v-if="!orderStore.loading">
          {{ data.fid }}
        </template>

        <skeleton v-else />
      </template>

      <template #editor="{ data }">
        <input-text
          :model-value="data.fid"
          class="p-inputtext-xs w-full"
          :class="{ 'p-invalid': articleValidator(data, 'fid') }"
          v-tooltip="{
            value: $t('validations.required', { property: 'fid' }),
            disabled: !articleValidator(data, 'fid'),
          }"
          @input="
            ($event) => {
              data.initialEdit = $event.initial;
              data.fid = $event.target.value;
              if (!$event.initial) {
                $emit('change-editing-products', { guid: data.guid, remove: false });
              }
            }
          "
        />
      </template>
    </column>

    <column
      v-if="showColumn(data, 'quantity') || editingAllowed"
      field="quantity"
      sortable
      :header="$t(getColumnData('quantity')?.title)"
      style="min-width: 10rem"
    >
      <template #body="{ data }">
        <template v-if="!orderStore.loading">
          {{ data.quantity }}
        </template>

        <skeleton v-else />
      </template>

      <template #editor="{ data }">
        <input-number
          :min="1"
          mode="decimal"
          locale="de-DE"
          :use-grouping="false"
          :model-value="data.quantity"
          :input-class="[
            'p-inputtext-xs w-full',
            { 'p-invalid': articleValidator(data, 'quantity') },
          ]"
          v-tooltip="{
            value: $t('validations.required', { property: 'quantity' }),
            disabled: !articleValidator(data, 'quantity'),
          }"
          @input="
            ($event) => {
              data.initialEdit = $event.initial;
              data.quantity = $event.value;
              if (!$event.initial) {
                $emit('change-editing-products', { guid: data.guid, remove: false });
              }
            }
          "
        />
      </template>
    </column>

    <column
      v-if="showColumn(data, 'price.usd') || editingAllowed"
      field="price.usd"
      sortable
      :header="$t(getColumnData('price.usd')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!orderStore.loading">
          {{ data.price.usd }}
        </template>

        <skeleton v-else />
      </template>

      <template #editor="{ data }">
        <input-number
          :min="0"
          mode="decimal"
          :use-grouping="false"
          :max-fraction-digits="5"
          :model-value="data.price.usd"
          :input-class="[
            'p-inputtext-xs w-full',
            { 'p-invalid': articleValidator(data, 'price.usd') },
          ]"
          v-tooltip="{
            value: $t('validations.required', { property: 'price (usd)' }),
            disabled: !articleValidator(data, 'price.usd'),
          }"
          @input="
            ($event) => {
              data.initialEdit = $event.initial;
              data.price = { ...data.price, usd: $event.value };
              if (!$event.initial) {
                $emit('change-editing-products', { guid: data.guid, remove: false });
              }
            }
          "
        />
      </template>
    </column>

    <column
      v-if="showColumn(data, 'price.eur') || editingAllowed"
      field="price.eur"
      sortable
      :header="$t(getColumnData('price.eur')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="!orderStore.loading">
          {{ data.price.eur }}
        </template>

        <skeleton v-else />
      </template>

      <!-- <template #editor="{ data }">
        <input-number
          :min="0"
          mode="decimal"
          :use-grouping="false"
          :max-fraction-digits="5"
          :model-value="data.price.eur"
          :input-class="[
            'p-inputtext-xs w-full',
            { 'p-invalid': articleValidator(data, 'price.eur') },
          ]"
          v-tooltip="{
            value: $t('validations.required', { property: 'price (eur)' }),
            disabled: !articleValidator(data, 'price.eur'),
          }"
          @input="
            ($event) => {
              data.initialEdit = $event.initial;
              data.price = { ...data.price, eur: $event.value };
              if (!$event.initial) {
                $emit('change-editing-products', { guid: data.guid, remove: false });
              }
            }
          "
        />
      </template> -->
    </column>

    <column
      v-if="showColumn(data, 'price.total_usd')"
      field="price.total_usd"
      sortable
      :header="$t(getColumnData('price.total_usd')?.title)"
      style="min-width: 10rem"
    >
      <template #body="{ data }">
        <template v-if="!orderStore.loading">
          {{ data.price.total_usd }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(data, 'minimalOrderQuantity') || editingAllowed"
      field="minimalOrderQuantity"
      sortable
      :header="$t(getColumnData('minimalOrderQuantity')?.title)"
      style="min-width: 8rem"
    >
      <template #body="{ data }">
        <template v-if="!orderStore.loading">
          {{ data.minimalOrderQuantity }}
        </template>

        <skeleton v-else />
      </template>

      <template #editor="{ data }">
        <input-number
          :min="0"
          mode="decimal"
          locale="de-DE"
          :use-grouping="false"
          :model-value="data.minimalOrderQuantity"
          :input-class="[
            'p-inputtext-xs w-full',
            { 'p-invalid': articleValidator(data, 'minimalOrderQuantity') },
          ]"
          v-tooltip="{
            value: $t('validations.required', { property: 'MOQ' }),
            disabled: !articleValidator(data, 'minimalOrderQuantity'),
          }"
          @input="
            ($event) => {
              data.initialEdit = $event.initial;
              data.minimalOrderQuantity = $event.value;
              if (!$event.initial) {
                $emit('change-editing-products', { guid: data.guid, remove: false });
              }
            }
          "
        />
      </template>
    </column>

    <column
      v-if="showColumn(data, 'article.oe') || editingAllowed"
      field="article.oe"
      sortable
      :header="$t(getColumnData('article.oe')?.title)"
      style="min-width: 8rem"
    >
      <template #body="{ data }">
        <template v-if="!orderStore.loading">
          {{ data.article.oe }}
        </template>

        <skeleton v-else />
      </template>

      <!-- <template #editor="{ data }">
        <input-text
          :model-value="data.article.oe"
          class="p-inputtext-xs w-full"
          :class="{'p-invalid': articleValidator(data, 'article.oe')}"
          v-tooltip="{
            value: $t('validations.required', { property: 'oem' }),
            disabled: !articleValidator(data, 'article.oe'),
          }"
          @input="($event) => {
            data.initialEdit = $event.initial;
            data.article = { ...data.article, oe: $event.target.value };
            if (!$event.initial) {
              $emit('change-editing-products', { guid: data.guid, remove: false });
            }
          }"
        />
      </template> -->
    </column>

    <column
      v-if="showColumn(data, 'emarkNumber') || editingAllowed"
      field="emarkNumber"
      sortable
      :header="$t(getColumnData('emarkNumber')?.title)"
      :class="{ 'p-invalid': articleValidator(data, 'emarkNumber') }"
      v-tooltip="{
        value: $t('validations.required', { property: 'emark (number)' }),
        disabled: !articleValidator(data, 'emarkNumber'),
      }"
      style="min-width: 16rem"
    >
      <template #body="{ data }">
        <template v-if="!orderStore.loading">
          {{ data.emarkNumber }}
        </template>

        <skeleton v-else />
      </template>

      <template #editor="{ data }">
        <input-text
          :model-value="data.emarkNumber"
          class="p-inputtext-xs w-full"
          @input="
            ($event) => {
              data.initialEdit = $event.initial;
              data.emarkNumber = $event.target.value;
              if (!$event.initial) {
                $emit('change-editing-products', { guid: data.guid, remove: false });
              }
            }
          "
        />
      </template>
    </column>

    <column
      v-if="showColumn(data, 'emarkCountry') || editingAllowed"
      field="emarkCountry"
      sortable
      :header="$t(getColumnData('emarkCountry')?.title)"
      style="min-width: 16rem"
    >
      <template #body="{ data }">
        <template v-if="!orderStore.loading">
          {{ data.emarkCountry }}
        </template>

        <skeleton v-else />
      </template>

      <template #editor="{ data }">
        <input-number
          :min="1"
          mode="decimal"
          locale="de-DE"
          :use-grouping="false"
          :model-value="data.emarkCountry === 0 ? null : data.emarkCountry"
          :input-class="[
            'p-inputtext-xs w-full',
            { 'p-invalid': articleValidator(data, 'emarkCountry') },
          ]"
          v-tooltip="{
            value: $t('validations.required', { property: 'emark (country)' }),
            disabled: !articleValidator(data, 'emarkCountry'),
          }"
          @input="
            ($event) => {
              data.initialEdit = $event.initial;
              data.emarkCountry = $event.value === 0 ? null : $event.value;
              if (!$event.initial) {
                $emit('change-editing-products', { guid: data.guid, remove: false });
              }
            }
          "
        />
      </template>
    </column>

    <column
      v-if="showColumn(data, 'pcsInBox') || editingAllowed"
      field="pcsInBox"
      sortable
      :header="$t(getColumnData('pcsInBox')?.title)"
      style="min-width: 10rem"
    >
      <template #body="{ data }">
        <template v-if="!orderStore.loading">
          {{ data.pcsInBox }}
        </template>

        <skeleton v-else />
      </template>

      <!-- <template #editor="{ data }">
        <input-number
          :min="1"
          mode="decimal"
          locale="de-DE"
          :use-grouping="false"
          :model-value="data.pcsInBox"
          :input-class="
            ['p-inputtext-xs w-full', { 'p-invalid': articleValidator(data, 'pcsInBox') }]
          "
          v-tooltip="{
            value: $t('validations.required', { property: 'pcs/box' }),
            disabled: !articleValidator(data, 'pcsInBox'),
          }"
          @input="($event) => {
            data.initialEdit = $event.initial;
            data.pcsInBox = $event.value;
            if (!$event.initial) {
              $emit('change-editing-products', { guid: data.guid, remove: false });
            }
          }"
        />
      </template> -->
    </column>
  </data-table>

  <div class="flex flex-column align-items-end px-3 text-xl font-bold">
    <div v-for="(brand, index) in orderStore.productsBrands" :key="index" class="mt-5">
      {{ brand.name }}:

      <span class="inline-block w-8rem text-right"> ${{ brand.total?.toFixed(2) }} </span>
    </div>

    <div v-if="orderStore.totalPrice" class="mt-3">
      {{ $t('order.placeholders.total') }}:

      <span class="inline-block w-8rem text-right"> ${{ orderStore.totalPrice?.toFixed(2) }} </span>
    </div>

    <div v-if="orderStore.totalQty" class="mt-3">
      {{ $t('order.placeholders.totalQty') }}:

      <span class="inline-block w-8rem text-right"> {{ orderStore.totalQty }} </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, PropType, watch } from 'vue';

import cloneDeep from 'lodash.clonedeep';

import { library } from '@fortawesome/fontawesome-svg-core';

import {
  faFilter,
  faFileExcel,
  faTrashCan,
  faFilterCircleXmark,
} from '@fortawesome/free-solid-svg-icons';

import vTooltip from 'primevue/tooltip';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import MultiSelect from 'primevue/multiselect';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Skeleton from 'primevue/skeleton';
import PrimeButton from 'primevue/button';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import useOrderStore from '@/app/order/shared/store/order-store';
import useTableColumns from '@/app/shared/services/hooks/table-columns';
import useExportTableData from '@/app/shared/services/hooks/export-table-data';
import useTableFiltersObserver from '@/app/shared/services/hooks/table-filters-observer';
import useStaticTableClearFilters from '@/app/shared/services/hooks/static-table-clear-filter';

import {
  SUPPLIER_INNER_FIELDS,
  STORAGE_KEYS,
} from '@/app/supplier/shared/config/table-fields-constants';
import { PER_PAGE_OPTIONS } from '@/app/shared/store/tables-store';
import { articleValidator } from '@/app/order/shared/config/validation-schemes';
import {
  FILTERS_CONSTANTS,
  FiltersConstants,
} from '@/app/order/shared/config/filters-scheme-constants';

import type { Product, SupplierProduct } from '@/@types/product';

library.add(faFilter, faFileExcel, faTrashCan, faFilterCircleXmark);

const props = defineProps({
  disabled: { type: Boolean, required: true },
  deleteDisabled: { type: Boolean, required: true },
  editingAllowed: { type: Boolean, required: true },
  clearEditingRows: { type: Boolean, required: true },
  data: { type: Array as PropType<Product[]>, required: true },
});

const emit = defineEmits(['delete-data', 'update-data', 'change-editing-products']);

const orderStore = useOrderStore();
const { exportData } = useExportTableData();

const editingRows = ref([]);

const { noDefaultFields, selectedColumns, showColumn, getColumnData, columnIsEmpty } =
  useTableColumns<SupplierProduct>(SUPPLIER_INNER_FIELDS, STORAGE_KEYS.SUPPLIER_INNER_COLUMNS);

const filters: Ref<FiltersConstants> = ref(cloneDeep(FILTERS_CONSTANTS));

const { updatedFilter } = useStaticTableClearFilters();

const resetFiltersHandler = () => {
  filters.value = cloneDeep(FILTERS_CONSTANTS);
};

const onRowEdit = ($event: { index: number; newData: Product }) => {
  emit('update-data', { index: $event.index, data: $event.newData });
};

const onRowEditCancel = ($event: { newData: Product }) => {
  emit('change-editing-products', { guid: $event.newData.guid, remove: true });
};

watch(
  () => props.clearEditingRows,
  (status) => {
    if (status) {
      editingRows.value = [];
    }
  }
);

useTableFiltersObserver();
</script>

<style>
.order-table .p-row-editor-save {
  position: absolute !important;
  opacity: 0 !important;
}
</style>
