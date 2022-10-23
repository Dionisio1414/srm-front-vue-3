<template>
  <li>
    <b>{{ $t('order.note.bankInformation') }}</b>

    <ul class="list-none">
      <li class="flex align-items-center">
        {{ $t('order.bankInformation.swift') }}

        <input-text
          :model-value="data.bank_swift_code"
          class="p-inputtext-xs w-15rem my-1 ml-2"
          :class="vv.bank_swift_code.$error ? 'p-invalid' : ''"
          :disabled="disabled"
          v-tooltip="{
            value: errorMessage(vv.bank_swift_code.$errors),
            disabled: !errorMessage(vv.bank_swift_code.$errors),
          }"
          @input="updateData('bank_swift_code', $event.target.value)"
        />
      </li>

      <li class="flex align-items-center">
        {{ $t('order.bankInformation.beneficiary') }}

        <input-text
          :model-value="data.bank_recipient"
          class="p-inputtext-xs w-15rem my-1 ml-2"
          :class="vv.bank_recipient.$error ? 'p-invalid' : ''"
          :disabled="disabled"
          v-tooltip="{
            value: errorMessage(vv.bank_recipient.$errors),
            disabled: !errorMessage(vv.bank_recipient.$errors),
          }"
          @input="updateData('bank_recipient', $event.target.value)"
        />
      </li>

      <li class="flex align-items-center">
        {{ $t('order.bankInformation.iban') }}

        <input-text
          :model-value="data.bank_iban"
          class="p-inputtext-xs w-15rem my-1 ml-2"
          :class="vv.bank_iban.$error ? 'p-invalid' : ''"
          :disabled="disabled"
          v-tooltip="{
            value: errorMessage(vv.bank_iban.$errors),
            disabled: !errorMessage(vv.bank_iban.$errors),
          }"
          @input="updateData('bank_iban', $event.target.value)"
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
import { bankInfoSchema } from '@/app/order/shared/config/validation-schemes';

import type { BankInfoData } from '@/@types/form-data';

const props = defineProps({
  disabled: { type: Boolean, required: true },
  data: { type: Object as PropType<BankInfoData>, required: true },
});

const emit = defineEmits(['update-data']);

const vv = useVuelidate(bankInfoSchema, toRefs(props.data));

const updateData = (name: keyof BankInfoData, value: string | number) => {
  emit('update-data', { name, value });

  vv.value[name].$model = typeof value === 'string' ? value.trim() : value;
};
</script>
