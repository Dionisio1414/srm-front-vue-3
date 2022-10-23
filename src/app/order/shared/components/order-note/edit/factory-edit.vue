<template>
  <li class="my-1">
    <b>{{ $t('order.note.factoryInformation') }}</b>

    <ul class="list-none">
      <li class="flex align-items-center my-1">
        {{ $t('order.factoryInformation.name') }} {{ factory.name }}
      </li>

      <li class="flex align-items-center">
        {{ $t('order.factoryInformation.jurName') }}

        <input-text
          :model-value="data.jur_name"
          class="p-inputtext-xs w-15rem my-1 ml-2"
          :class="vv.jur_name.$error ? 'p-invalid' : ''"
          :disabled="disabled"
          v-tooltip="{
            value: errorMessage(vv.jur_name.$errors),
            disabled: !errorMessage(vv.jur_name.$errors),
          }"
          @input="updateData('jur_name', $event.target.value)"
        />
      </li>

      <li class="flex align-items-center">
        {{ $t('order.factoryInformation.vatNumber') }}

        <input-text
          :model-value="data.vat_number"
          class="p-inputtext-xs w-15rem my-1 ml-2"
          :class="vv.vat_number.$error ? 'p-invalid' : ''"
          :disabled="disabled"
          v-tooltip="{
            value: errorMessage(vv.vat_number.$errors),
            disabled: !errorMessage(vv.vat_number.$errors),
          }"
          @input="updateData('vat_number', $event.target.value)"
        />
      </li>

      <li class="flex align-items-center">
        {{ $t('order.factoryInformation.legalAddress') }}

        <input-text
          :model-value="data.legal_address"
          class="p-inputtext-xs w-15rem my-1 ml-2"
          :class="vv.legal_address.$error ? 'p-invalid' : ''"
          :disabled="disabled"
          v-tooltip="{
            value: errorMessage(vv.legal_address.$errors),
            disabled: !errorMessage(vv.legal_address.$errors),
          }"
          @input="updateData('legal_address', $event.target.value)"
        />
      </li>

      <li class="flex align-items-center">
        {{ $t('order.factoryInformation.address') }}

        <input-text
          :model-value="data.address"
          class="p-inputtext-xs w-15rem my-1 ml-2"
          :class="vv.address.$error ? 'p-invalid' : ''"
          :disabled="disabled"
          v-tooltip="{
            value: errorMessage(vv.address.$errors),
            disabled: !errorMessage(vv.address.$errors),
          }"
          @input="updateData('address', $event.target.value)"
        />
      </li>

      <li class="flex align-items-center">
        {{ $t('order.factoryInformation.phone') }}

        <input-text
          :model-value="data.general_phone"
          class="p-inputtext-xs w-15rem my-1 ml-2"
          :class="vv.general_phone.$error ? 'p-invalid' : ''"
          :disabled="disabled"
          v-tooltip="{
            value: errorMessage(vv.general_phone.$errors),
            disabled: !errorMessage(vv.general_phone.$errors),
          }"
          @input="updateData('general_phone', $event.target.value)"
        />
      </li>
    </ul>
  </li>
</template>

<script lang="ts" setup>
import { PropType, toRefs } from 'vue';

import { useVuelidate } from '@vuelidate/core';

import vTooltip from 'primevue/tooltip';
import InputText from 'primevue/inputtext';

import errorMessage from '@/app/shared/utils/error-message';
import { factoryInfoSchema } from '@/app/order/shared/config/validation-schemes';

import type { FactoryInfoData } from '@/@types/form-data';
import type { OrderFactory } from '@/@types/order';

const props = defineProps({
  disabled: { type: Boolean, required: true },
  data: { type: Object as PropType<FactoryInfoData>, required: true },
  factory: { type: Object as PropType<OrderFactory>, required: true },
});

const emit = defineEmits(['update-data']);

const vv = useVuelidate(factoryInfoSchema, toRefs(props.data));

const updateData = (name: keyof FactoryInfoData, value: string | number, initial = false) => {
  emit('update-data', { name, value, initial });

  vv.value[name].$model = typeof value === 'string' ? value.trim() : value;
};
</script>
