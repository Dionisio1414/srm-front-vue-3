<template>
  <div class="p-field flex flex-column mt-3">
    <label for="parsingTotalPrice"> *{{ $t('parsing.labels.total') }}: </label>

    <input-text
      id="parsingTotalPrice"
      :model-value="data.total_price_usd"
      :placeholder="$t('parsing.placeholders.total')"
      class="w-full my-1"
      :class="vv.total_price_usd.$error ? 'p-invalid' : ''"
      :disabled="disabled"
      @input="updateData('total_price_usd', $event.target.value)"
    />

    <small id="parsingTotalPrice-help" :class="vv.total_price_usd.$error ? 'p-error' : ''">
      {{ errorMessage(vv.total_price_usd.$errors) }}
    </small>
  </div>
</template>

<script lang="ts" setup>
import { PropType, toRefs } from 'vue';

import { useVuelidate } from '@vuelidate/core';

import InputText from 'primevue/inputtext';

import errorMessage from '@/app/shared/utils/error-message';
import { customSchema } from '@/app/shared/config/parsing/parsing-validation-schema';

import type { ParsingCustomFields } from '@/@types/additional';

const props = defineProps({
  data: { type: Object as PropType<ParsingCustomFields>, required: true },
  disabled: { type: Boolean, required: true },
});

const emit = defineEmits(['update-data']);

const vv = useVuelidate(customSchema, toRefs(props.data));

const updateData = (key: string, value: string) => {
  emit('update-data', { key: `custom_fields.${key}`, value });
  vv.value[key].$model = value;
};
</script>
