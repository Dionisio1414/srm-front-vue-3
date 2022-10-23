<template>
  <li class="flex align-items-center my-1">
    <b>{{ $t('order.note.designAndPacking') }}</b>

    <input-text
      :model-value="data.design_and_packing"
      class="p-inputtext-xs w-15rem my-1 ml-2"
      :class="vv.design_and_packing.$error ? 'p-invalid' : ''"
      :disabled="disabled"
      v-tooltip="{
        value: errorMessage(vv.design_and_packing.$errors),
        disabled: !errorMessage(vv.design_and_packing.$errors),
      }"
      @input="updateData('design_and_packing', $event.target.value)"
    />
  </li>

  <li class="flex align-items-center my-1">
    <b>{{ $t('order.note.engraving') }}</b>

    <input-text
      :model-value="data.engraving"
      class="p-inputtext-xs w-15rem my-1 ml-2"
      :class="vv.engraving.$error ? 'p-invalid' : ''"
      :disabled="disabled"
      v-tooltip="{
        value: errorMessage(vv.engraving.$errors),
        disabled: !errorMessage(vv.engraving.$errors),
      }"
      @input="updateData('engraving', $event.target.value)"
    />
  </li>
</template>

<script lang="ts" setup>
import { PropType, toRefs } from 'vue';

import { useVuelidate } from '@vuelidate/core';

import vTooltip from 'primevue/tooltip';
import InputText from 'primevue/inputtext';

import errorMessage from '@/app/shared/utils/error-message';
import { additionalInfoSchema } from '@/app/order/shared/config/validation-schemes';

import type { AdditionalInfoData } from '@/@types/form-data';

const props = defineProps({
  disabled: { type: Boolean, required: true },
  data: { type: Object as PropType<AdditionalInfoData>, required: true },
});

const emit = defineEmits(['update-data']);

const vv = useVuelidate(additionalInfoSchema, toRefs(props.data));

const updateData = (name: keyof AdditionalInfoData, value: string | number, initial = false) => {
  emit('update-data', { name, value, initial });

  vv.value[name].$model = typeof value === 'string' ? value.trim() : value;
};
</script>
