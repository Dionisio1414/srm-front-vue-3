<template>
  <data-table :value="data" striped-rows responsive-layout="scroll">
    <template #header>
      <div class="flex justify-content-between align-items-center">
        <prime-button
          :label="$t('price.buttons.add')"
          type="button"
          class="p-button-success p-button-sm w-10rem"
          @click="$emit('add-price')"
        />

        <multi-select
          :model-value="selected"
          :options="infoStore.unitTypesSizes"
          :placeholder="$t('placeholders.units')"
          class="w-23rem"
          :disabled="!infoStore.unitTypesSizes.length"
          @change="$emit('update:selected', $event.value)"
        >
          <template #value="{ value, placeholder }">
            <template v-if="!value || value.length === 0">
              {{ placeholder }}
            </template>

            <template v-else>
              {{ value.map(
                  (item: { [key: string]: string }) => `
                    ${item.transportUnitSizeValue || ''}
                    ${item.transportUnitTypeValue || ''}`
                ).join(', ')
              }}
            </template>
          </template>

          <template #option="{ option }">
            {{ option.transportUnitSizeValue }}
            {{ option.transportUnitTypeValue }}
          </template>
        </multi-select>
      </div>
    </template>

    <template #empty>
      <div class="p-3 text-4xl">
        {{ $t('price.noFound') }}
      </div>
    </template>

    <column :header="$t('price.table.expense')" style="min-width: 20rem; width: 20rem">
      <template #body="{ data: dataItem, index }">
        <dropdown
          :model-value="dataItem.expance_field_id"
          :options="infoStore.forwarderExpanseFields"
          option-label="field"
          option-value="id"
          :placeholder="$t('placeholders.expense')"
          class="w-20rem text-left"
          :class="{ 'p-invalid': !dataItem.expance_field_id }"
          :disabled="!infoStore.forwarderExpanseFields.length"
          @change="updateData(`[${index}].expance_field_id`, $event.value)"
        />
      </template>
    </column>

    <column :header="$t('price.table.currency')" style="min-width: 20rem; width: 20rem">
      <template #body="{ data: dataItem, index }">
        <dropdown
          :model-value="dataItem.currency_id"
          :options="infoStore.currencies"
          option-label="currency"
          option-value="id"
          :placeholder="$t('placeholders.currency')"
          class="w-20rem text-left"
          :class="{ 'p-invalid': !dataItem.currency_id }"
          :disabled="!infoStore.currencies.length"
          @change="updateData(`[${index}].currency_id`, $event.value)"
        />
      </template>
    </column>

    <column
      v-for="(column, index) in selected"
      :key="index"
      :header="`
        ${column.transportUnitSizeValue || ''}
        ${column.transportUnitTypeValue || ''}`"
      style="min-width: 12rem; width: 12rem"
    >
      <template #body="{ data: dataItem, index: dataIndex }">
        <input-number
          :model-value="dataItem.forwarder_price_transport_units[index].value"
          mode="decimal"
          locale="de-DE"
          :min="0"
          :max-fraction-digits="2"
          :use-grouping="false"
          :allow-empty="false"
          class="w-12rem"
          :input-class="['w-12rem', { 'p-invalid': customValidator(data).includes(dataIndex) }]"
          @input="
            updateData(
              `[${dataIndex}].forwarder_price_transport_units[${index}].value`,
              $event.value
            )
          "
        />
      </template>
    </column>

    <column style="min-width: 5rem; width: 5rem">
      <template #body="{ index }">
        <prime-button
          :label="$t('price.buttons.delete')"
          icon="pi pi-trash"
          :disabled="data.length === 1"
          class="p-button-danger p-button-sm"
          @click="$emit('delete-price', index)"
        />
      </template>
    </column>
  </data-table>
</template>

<script lang="ts" setup>
import { PropType, watch } from 'vue';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import PrimeButton from 'primevue/button';
import InputNumber from 'primevue/inputnumber';

import useInfoStore from '@/app/shared/store/info-store';

import { customValidator } from '@/app/price/shared/config/validation-schemes';

import type { ForwarderExpanse } from '@/@types/form-data';
import type { UnitTypeSize } from '@/@types/additional';

defineProps({
  data: { type: Array as PropType<ForwarderExpanse[]>, required: true },
  selected: { type: Array as PropType<UnitTypeSize[]>, required: true },
});

const emit = defineEmits(['update-data', 'update:selected', 'add-price', 'delete-price']);

const infoStore = useInfoStore();

const updateData = (key: string, value: string | number | null) => {
  emit('update-data', { key, value: value === null ? 0 : value });
};

watch(
  () => infoStore.unitTypesSizes,
  (units) => {
    if (units.length) {
      emit('update:selected', [units[0]]);
    }
  }
);
</script>
