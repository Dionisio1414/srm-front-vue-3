<template>
  <data-table
    id="supplier-products"
    data-key="guid"
    :value="loadingGuid === orderGuid ? new Array(3) : data"
    striped-rows
    responsive-layout="scroll"
    :rows="10"
    removable-sort
    :rows-per-page-options="PER_PAGE_OPTIONS"
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
      'categoryName.en',
      'categoryCode',
      'brand.name',
      'article.no',
      'article.oe',
    ]"
    :class="{ 'pointer-events-none': loadingGuid === orderGuid }"
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
          @click="exportData('supplier-products', [0, 1])"
        >
          <font-awesome-icon icon="file-excel" size="lg" />
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
                  ${columnIsEmpty(data, item.name) ? '(Empty)' : ''}
                `
                  )
                  .join(', ')
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
            class="w-18rem"
          />
        </span>
      </div>
    </template>

    <template #empty>
      <div class="p-3 text-4xl">
        {{ $t('supplier.productsNoFound') }}
      </div>
    </template>

    <column
      v-if="supplierStore.canMove(status)"
      selection-mode="multiple"
      :header-style="{ width: '3.25rem' }"
      body-class="text-center"
      class="py-0"
    >
      <template #body="{ data }">
        <template v-if="data">
          <checkbox v-if="data.remainder_quantity" v-model="selectedProducts" :value="data" />

          <prime-button
            v-else
            label="SWH"
            class="p-button-sm pointer-events-none"
            style="padding: 0.18rem 0.5rem 0.15rem"
          />
        </template>
      </template>
    </column>

    <column v-if="supplierStore.canMove(status)" class="py-0">
      <template #body="{ data }">
        <template v-if="data && data.remainder_quantity">
          <input-number
            v-if="supplierStore.showQuantity(activeProducts, data.guid)"
            :model-value="Number(supplierStore.quantity(activeProducts, data.guid))"
            :min="0"
            :max="data.remainder_quantity"
            class="w-full"
            :input-class="`p-inputtext-xs p-in w-3rem ${
              supplierStore.quantity(activeProducts, data.guid) > data.remainder_quantity ||
              !supplierStore.quantity(activeProducts, data.guid)
                ? 'p-invalid'
                : ''
            }`"
            :use-grouping="false"
            v-tooltip="$t(`supplier.maxQuantity`, { quantity: data.remainder_quantity })"
            @input="changeQuantity(orderGuid, data, $event.value)"
          />
        </template>
        <!-- eslint-enable max-len -->
      </template>
    </column>

    <column
      v-if="showColumn(data, 'id')"
      field="id"
      sortable
      :header="$t(getColumnData('id')?.title)"
      style="min-width: 5rem"
    >
      <template #body="{ data }">
        <template v-if="data && 'id' in data">
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
        <template v-if="data && 'categoryName' in data">
          {{ data.categoryName.en }}
        </template>

        <skeleton v-else />
      </template>

      <template #filter="{ filterModel, filterCallback }">
        <multi-select
          v-model="filterModel.value"
          :options="categories"
          option-label=""
          scroll-height="25rem"
          placeholder="Select categories"
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
      v-if="showColumn(data, 'comment')"
      field="comment"
      sortable
      :header="$t(getColumnData('comment')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="data && 'comment' in data">
          {{ data.comment }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(data, 'categoryCode')"
      field="categoryCode"
      sortable
      :header="$t(getColumnData('categoryCode')?.title)"
      style="min-width: 10rem"
    >
      <template #body="{ data }">
        <template v-if="data && 'categoryCode' in data">
          {{ data.categoryCode }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(data, 'brand.name')"
      field="brand.name"
      sortable
      :header="$t(getColumnData('brand.name')?.title)"
      filter-menu-class="w-23rem"
      :show-filter-match-modes="false"
      style="min-width: 10rem"
    >
      <template #body="{ data }">
        <template v-if="data && 'brand' in data">
          {{ data.brand.name }}
        </template>

        <skeleton v-else />
      </template>

      <template #filter="{ filterModel, filterCallback }">
        <multi-select
          v-model="filterModel.value"
          :options="brands"
          option-label=""
          scroll-height="25rem"
          placeholder="Select brands"
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
      v-if="showColumn(data, 'article.no')"
      field="article.no"
      sortable
      :header="$t(getColumnData('article.no')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="data && 'article' in data">
          {{ data.article.no }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(data, 'fid')"
      field="fid"
      sortable
      :header="$t(getColumnData('fid')?.title)"
      style="min-width: 10rem"
    >
      <template #body="{ data }">
        <template v-if="data && 'fid' in data">
          {{ data.fid }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(data, 'quantity')"
      field="quantity"
      sortable
      :header="$t(getColumnData('quantity')?.title)"
      style="min-width: 10rem"
    >
      <template #body="{ data }">
        <template v-if="data && 'quantity' in data">
          {{ data.quantity }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(data, 'price.usd')"
      field="price.usd"
      sortable
      :header="$t(getColumnData('price.usd')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="data && 'price' in data">
          {{ data.price.usd }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(data, 'price.eur')"
      field="price.eur"
      sortable
      :header="$t(getColumnData('price.eur')?.title)"
      style="min-width: 12rem"
    >
      <template #body="{ data }">
        <template v-if="data && 'price' in data">
          {{ data.price.eur }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(data, 'price.total_usd')"
      field="price.total_usd"
      sortable
      :header="$t(getColumnData('price.total_usd')?.title)"
      style="min-width: 8rem"
    >
      <template #body="{ data }">
        <template v-if="data && 'price' in data">
          {{ data.price.total_usd }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(data, 'minimalOrderQuantity')"
      field="minimalOrderQuantity"
      sortable
      :header="$t(getColumnData('minimalOrderQuantity')?.title)"
      style="min-width: 8rem"
    >
      <template #body="{ data }">
        <template v-if="data && 'minimalOrderQuantity' in data">
          {{ data.minimalOrderQuantity }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(data, 'article.oe')"
      field="article.oe"
      sortable
      :header="$t(getColumnData('article.oe')?.title)"
      style="min-width: 8rem"
    >
      <template #body="{ data }">
        <template v-if="data && 'article' in data">
          {{ data.article.oe }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(data, 'emarkNumber')"
      field="emarkNumber"
      sortable
      :header="$t(getColumnData('emarkNumber')?.title)"
      style="min-width: 16rem"
    >
      <template #body="{ data }">
        <template v-if="data && 'emarkNumber' in data">
          {{ data.emarkNumber }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(data, 'emarkCountry')"
      field="emarkCountry"
      sortable
      :header="$t(getColumnData('emarkCountry')?.title)"
      style="min-width: 16rem"
    >
      <template #body="{ data }">
        <template v-if="data && 'emarkCountry' in data">
          {{ data.emarkCountry }}
        </template>

        <skeleton v-else />
      </template>
    </column>

    <column
      v-if="showColumn(data, 'pcsInBox')"
      field="pcsInBox"
      sortable
      :header="$t(getColumnData('pcsInBox')?.title)"
      style="min-width: 8rem"
    >
      <template #body="{ data }">
        <template v-if="data && 'pcsInBox' in data">
          {{ data.pcsInBox }}
        </template>

        <skeleton v-else />
      </template>
    </column>
  </data-table>
</template>

<script lang="ts" setup>
import { PropType, Ref, ref, computed, watch, onBeforeUnmount } from 'vue';

import uniq from 'lodash.uniq';
import cloneDeep from 'lodash.clonedeep';
import { library } from '@fortawesome/fontawesome-svg-core';

import { faFilter, faFileExcel, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import vTooltip from 'primevue/tooltip';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import MultiSelect from 'primevue/multiselect';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Checkbox from 'primevue/checkbox';
import Skeleton from 'primevue/skeleton';
import PrimeButton from 'primevue/button';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import useSupplierStore from '@/app/supplier/shared/store/supplier-store';
import useTableColumns from '@/app/shared/services/hooks/table-columns';
import useExportTableData from '@/app/shared/services/hooks/export-table-data';
import useTableFiltersObserver from '@/app/shared/services/hooks/table-filters-observer';
import useStaticTableClearFilters from '@/app/shared/services/hooks/static-table-clear-filter';

import { PER_PAGE_OPTIONS } from '@/app/shared/store/tables-store';
import {
  SUPPLIER_INNER_FIELDS,
  STORAGE_KEYS,
} from '@/app/supplier/shared/config/table-fields-constants';
import {
  SUPPLIER_INNER_FILTERS_CONSTANTS,
  SupplierInnerFiltersConstants,
} from '@/app/supplier/shared/config/filters-scheme-constants';

import type { SupplierProduct, ActiveProduct } from '@/@types/product';

library.add(faFilter, faFileExcel, faFilterCircleXmark);

const props = defineProps({
  status: { type: Number, required: true },
  orderGuid: { type: String, required: true },
  activeProducts: { type: Array as PropType<ActiveProduct[]>, required: true },
  data: { type: Array as PropType<SupplierProduct[]>, required: true },
});

const emit = defineEmits(['set-active-products', 'update-quantity']);

const supplierStore = useSupplierStore();
const { exportData } = useExportTableData();

const selectedProducts = ref([]);
const loadingGuid = computed(() => supplierStore.productsLoading);

const { noDefaultFields, selectedColumns, showColumn, getColumnData, columnIsEmpty } =
  useTableColumns<SupplierProduct>(SUPPLIER_INNER_FIELDS, STORAGE_KEYS.SUPPLIER_INNER_COLUMNS);

const categories = computed(() => {
  const allCategories = props.data.map((item) => item.categoryName.en);

  return uniq(allCategories);
});

const brands = computed(() => {
  const allBrands = props.data.map((item) => item.brand.name);

  return uniq(allBrands);
});

const filters: Ref<SupplierInnerFiltersConstants> = ref(
  cloneDeep(SUPPLIER_INNER_FILTERS_CONSTANTS)
);

const { updatedFilter } = useStaticTableClearFilters();

const resetFiltersHandler = () => {
  filters.value = cloneDeep(SUPPLIER_INNER_FILTERS_CONSTANTS);
};

const changeQuantity = (orderGuid: string, data: SupplierProduct, value: number | string): void => {
  const quantity = value > data.quantity ? data.quantity : value;

  emit('update-quantity', { orderGuid, guid: data.guid, value: quantity });
};

const productsChangeHandler = (active: ActiveProduct[], products: SupplierProduct[]) => {
  const normalizeProduct = (
    active: ActiveProduct[],
    formatted: ActiveProduct[]
  ): ActiveProduct[] => {
    const clone = cloneDeep(formatted);

    const handler = (current: ActiveProduct) => {
      const index = clone.findIndex((product) => product.product_guid === current.product_guid);

      if (index > -1) {
        clone[index].quantity = current.quantity;
      }
    };

    active.forEach(handler);

    return clone;
  };

  const formatted: ActiveProduct[] = products.map((product) => ({
    product_guid: product.guid,
    quantity: product.remainder_quantity,
  }));
  const normalized: ActiveProduct[] = normalizeProduct(active, formatted);

  emit('set-active-products', { guid: props.orderGuid, products: normalized });
};

watch(selectedProducts, (products) => productsChangeHandler(props.activeProducts, products));

useTableFiltersObserver(selectedColumns);

onBeforeUnmount(() => {
  selectedProducts.value = [];
});
</script>

<style scoped>
:deep(.swh-quantity-column) {
  padding: 0 !important;
}
</style>
