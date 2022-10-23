<template>
  <data-table
    row-hover
    :value="price.expance"
    :loading="isLoading"
    edit-mode="row"
    v-model:editing-rows="editingRows"
    responsive-layout="scroll"
    :state-key="`price-table-${price.guid}`"
    state-storage="local"
    :rows="10"
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
    @row-edit-init="onRowEditInit"
    @row-edit-save="onRowEditSave"
  >
    <column :header="$t('price.table.expense')" style="min-width: 15rem; width: 15rem">
      <template #body="{ data }">
        {{ data.expance_field.field }}
      </template>

      <template #editor="{ data }">
        <dropdown
          v-model="data.expance_field"
          :options="expanseFields"
          :placeholder="$t('placeholders.expense')"
          class="w-15rem text-left"
          :disabled="!expanseFields.length"
        >
          <template #value="{ value, placeholder }">
            <template v-if="!value">
              {{ placeholder }}
            </template>

            <template v-else>
              {{ value.field }}
            </template>
          </template>

          <template #option="{ option }">
            {{ option.field }}
          </template>
        </dropdown>
      </template>
    </column>

    <column :header="$t('price.table.currency')" style="min-width: 15rem; width: 15rem">
      <template #body="{ data }">
        {{ data.currency.currency }}
      </template>

      <template #editor="{ data }">
        <dropdown
          v-model="data.currency"
          :options="currencies"
          :placeholder="$t('placeholders.currency')"
          class="w-15rem text-left"
          :disabled="!currencies.length"
        >
          <template #value="{ value, placeholder }">
            <template v-if="!value">
              {{ placeholder }}
            </template>

            <template v-else>
              {{ value.currency }}
            </template>
          </template>

          <template #option="{ option }">
            {{ option.currency }}
          </template>
        </dropdown>
      </template>
    </column>

    <column
      v-for="(unit, unitIndex) in price?.expance?.[0]?.transport_units"
      :key="unitIndex"
      :header="`${unit.size_value || ''} ${unit.type_value || ''}`"
      style="min-width: 10rem; width: 10rem"
    >
      <template #body="{ data }">
        {{ data.transport_units[unitIndex].value }}
      </template>

      <template #editor="{ data }">
        <input-number
          :model-value="data.transport_units[unitIndex].value"
          mode="decimal"
          locale="de-DE"
          :min="0"
          :max-fraction-digits="2"
          :use-grouping="false"
          class="w-10rem"
          input-class="w-10rem"
          @input="onChangeUnitValue(data, unitIndex, $event)"
        />
      </template>
    </column>

    <column
      :row-editor="true"
      style="width: 10rem; min-width: 10rem"
      :body-style="{ 'text-align': 'center' }"
    />
  </data-table>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import cloneDeep from 'lodash.clonedeep';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';

import useInfoStore from '@/app/shared/store/info-store';
import usePriceItemStore from '@/app/price/shared/store/price-item-store';
import useNotification from '@/app/shared/services/hooks/notifications';

import { PER_PAGE_OPTIONS } from '@/app/shared/store/tables-store';
import { expanceStructure } from '@/app/price/shared/config/validation-schemes';

import type { ForwarderExpanse, PriceTransportUnit } from '@/@types/form-data';
import type { PriceItemExpanse, PriceItemTU } from '@/@types/price';

const emit = defineEmits(['update-data']);

const infoStore = useInfoStore();
const priceItemStore = usePriceItemStore();
const { onError } = useNotification();

const editingRows = ref([]);

const price = computed(() => priceItemStore.price);
const isLoading = computed(() => priceItemStore.loading);

const expanseLoaded = ref(false);
const expanseFields = computed(() => infoStore.forwarderExpanseFields);
const currencies = computed(() => infoStore.currencies);

const onRowEditInit = () => {
  if (!expanseLoaded.value) {
    const ways = price.value.ways.map((way) => way.id);

    infoStore
      .getForwarderExpanseFields(ways)
      .catch((error) => onError(error))
      .finally(() => {
        expanseLoaded.value = true;
      });
  }

  infoStore.getCurrencies().catch((error) => onError(error));
};

const formatData = (data: PriceItemExpanse): ForwarderExpanse => {
  const clone = cloneDeep(data);
  const expanse = cloneDeep(expanceStructure);

  const getUnit = (data: PriceItemTU): PriceTransportUnit => ({
    guid: data.guid,
    transport_unit_size_id: data.size_id,
    transport_unit_type_id: data.type_id,
    value: data.value,
  });

  const units = cloneDeep(clone.transport_units).map(getUnit);

  expanse.guid = clone.guid;
  expanse.currency_id = clone.currency.id;
  expanse.expance_field_id = clone.expance_field.id;
  expanse.forwarder_price_transport_units = units;

  return expanse;
};

const onRowEditSave = async ($event: { newData: PriceItemExpanse }) => {
  const data = formatData($event.newData);

  await priceItemStore.changePriceExpanse(price.value.guid, data).catch((error) => onError(error));

  emit('update-data');
};

const onChangeUnitValue = (data: PriceItemExpanse, index: number, $event: { value: never }) => {
  const clone = cloneDeep(data.transport_units);

  clone[index].value = $event.value;
  data.transport_units = clone;
};
</script>
