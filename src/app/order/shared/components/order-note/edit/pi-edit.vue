<template>
  <li class="my-1">
    <b>{{ $t('order.note.proformaInvoice') }}</b>

    <ul class="list-none">
      <li class="flex">
        <span style="margin-top: 0.6rem">
          {{ $t('order.proformaInvoice.additionalTerms') }}
        </span>

        <prime-textarea
          :model-value="data.additional_terms_of_company"
          rows="6"
          class="p-inputtext-xs w-30rem my-1 ml-2"
          :class="vv.additional_terms_of_company.$error ? 'p-invalid' : ''"
          style="resize: vertical"
          :disabled="disabled"
          v-tooltip="{
            value: errorMessage(vv.additional_terms_of_company.$errors),
            disabled: !errorMessage(vv.additional_terms_of_company.$errors),
          }"
          @input="updateData('additional_terms_of_company', $event.target.value)"
        />
      </li>
    </ul>
  </li>
</template>

<script lang="ts" setup>
import { PropType, toRefs } from 'vue';

import { useVuelidate } from '@vuelidate/core';

import vTooltip from 'primevue/tooltip';
import PrimeTextarea from 'primevue/textarea';

import errorMessage from '@/app/shared/utils/error-message';
import { piInfoSchema } from '@/app/order/shared/config/validation-schemes';

import type { PiInfoData } from '@/@types/form-data';

const props = defineProps({
  disabled: { type: Boolean, required: true },
  data: { type: Object as PropType<PiInfoData>, required: true },
});

const emit = defineEmits(['update-data']);

const vv = useVuelidate(piInfoSchema, toRefs(props.data));

const updateData = (name: keyof PiInfoData, value: string | number, initial = false) => {
  emit('update-data', { name, value, initial });

  vv.value[name].$model = typeof value === 'string' ? value.trim() : value;
};
</script>
