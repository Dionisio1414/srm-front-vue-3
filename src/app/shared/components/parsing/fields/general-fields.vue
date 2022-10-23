<template>
  <div v-if="type === 'compare'" class="p-field flex flex-column mt-3">
    <label for="parsingOem"> *{{ $t('parsing.labels.oem') }}: </label>

    <input-text
      id="parsingOem"
      :model-value="data.oem"
      :placeholder="$t('parsing.placeholders.oem')"
      class="w-full my-1"
      :class="vv.oem.$error ? 'p-invalid' : ''"
      :disabled="disabled"
      @input="updateData('oem', $event.target.value)"
    />

    <small id="parsingOem-help" :class="vv.oem.$error ? 'p-error' : ''">
      {{ errorMessage(vv.oem.$errors) }}
    </small>
  </div>

  <div class="p-field flex flex-column mt-3">
    <label for="parsingArticleNo"> *{{ $t('parsing.labels.articleNo') }}: </label>

    <input-text
      id="parsingArticleNo"
      :model-value="data.article_no"
      :placeholder="$t('parsing.placeholders.articleNo')"
      class="w-full my-1"
      :class="vv.article_no.$error ? 'p-invalid' : ''"
      :disabled="disabled"
      @input="updateData('article_no', $event.target.value)"
    />

    <small id="parsingArticleNo-help" :class="vv.article_no.$error ? 'p-error' : ''">
      {{ errorMessage(vv.article_no.$errors) }}
    </small>
  </div>

  <div class="p-field flex flex-column mt-3">
    <label for="parsingFID"> *{{ $t('parsing.labels.fid') }}: </label>

    <input-text
      id="parsingFID"
      :model-value="data.fid"
      :placeholder="$t('parsing.placeholders.fid')"
      class="w-full my-1"
      :class="vv.fid.$error ? 'p-invalid' : ''"
      :disabled="disabled"
      @input="updateData('fid', $event.target.value)"
    />

    <small id="parsingFID-help" :class="vv.fid.$error ? 'p-error' : ''">
      {{ errorMessage(vv.fid.$errors) }}
    </small>
  </div>

  <div class="p-field flex flex-column mt-3">
    <label for="parsingQuantityUsd"> *{{ $t('parsing.labels.quantity') }}: </label>

    <input-text
      id="parsingQuantityUsd"
      :model-value="data.quantity"
      :placeholder="$t('parsing.placeholders.quantity')"
      class="w-full my-1"
      :class="vv.quantity.$error ? 'p-invalid' : ''"
      :disabled="disabled"
      @input="updateData('quantity', $event.target.value)"
    />

    <small id="parsingQuantityUsd-help" :class="vv.quantity.$error ? 'p-error' : ''">
      {{ errorMessage(vv.quantity.$errors) }}
    </small>
  </div>

  <div class="p-field flex flex-column mt-3">
    <label for="parsingPriceUsd"> *{{ $t('parsing.labels.price') }}: </label>

    <input-text
      id="parsingPriceUsd"
      :model-value="data.price_usd"
      :placeholder="$t('parsing.placeholders.price')"
      class="w-full my-1"
      :class="vv.price_usd.$error ? 'p-invalid' : ''"
      :disabled="disabled"
      @input="updateData('price_usd', $event.target.value)"
    />

    <small id="parsingPriceUsd-help" :class="vv.price_usd.$error ? 'p-error' : ''">
      {{ errorMessage(vv.price_usd.$errors) }}
    </small>
  </div>

  <div
    v-if="
      type === 'supplier' || type === 'supplies' || type === 'supply' || type === 'compareSupply'
    "
    class="p-field flex flex-column mt-3"
  >
    <label for="parsingOrderNo"> *{{ $t('parsing.labels.orderNo') }}: </label>

    <input-text
      id="parsingOrderNo"
      :model-value="data.order_no"
      :placeholder="$t('parsing.placeholders.orderNo')"
      class="w-full my-1"
      :class="vv.order_no.$error ? 'p-invalid' : ''"
      :disabled="disabled"
      @input="updateData('order_no', $event.target.value)"
    />

    <small id="parsingOrderNo-help" :class="vv.order_no.$error ? 'p-error' : ''">
      {{ errorMessage(vv.order_no.$errors) }}
    </small>
  </div>
</template>

<script lang="ts" setup>
import { PropType, toRefs } from 'vue';

import { useVuelidate } from '@vuelidate/core';

import InputText from 'primevue/inputtext';

import errorMessage from '@/app/shared/utils/error-message';
import { generalSchema } from '@/app/shared/config/parsing/parsing-validation-schema';

import type { ParsingGeneralFields, ParsingType } from '@/@types/additional';

const props = defineProps({
  data: { type: Object as PropType<ParsingGeneralFields>, required: true },
  disabled: { type: Boolean, required: true },
  type: {
    type: String as PropType<ParsingType>,
    required: true,
  },
});

const emit = defineEmits(['update-data']);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const vv = useVuelidate(generalSchema(props.type) as any, toRefs(props.data));

const updateData = (key: string, value: string) => {
  emit('update-data', { key: `general_fields.${key}`, value });
  vv.value[key].$model = value;
};
</script>
