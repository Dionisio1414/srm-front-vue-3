<template>
  <div class="p-field flex flex-column mt-3">
    <label for="parsingFirstRow"> *{{ $t('parsing.labels.firstRow') }}: </label>

    <input-number
      id="parsingFirstRow"
      v-model="startRowModel"
      :min="1"
      mode="decimal"
      locale="de-DE"
      :placeholder="$t('parsing.placeholders.lastRow')"
      class="w-full my-1"
      :class="vv.start_row.$error ? 'p-invalid' : ''"
      :disabled="disabled"
    />

    <small id="parsingFirstRow-help" :class="vv.start_row.$error ? 'p-error' : ''">
      {{ errorMessage(vv.start_row.$errors) }}
    </small>
  </div>

  <div class="p-field flex flex-column mt-3">
    <label for="parsingEndRow"> *{{ $t('parsing.labels.lastRow') }}: </label>

    <input-number
      id="parsingEndRow"
      v-model="endRowModel"
      :min="1"
      mode="decimal"
      locale="de-DE"
      :placeholder="$t('parsing.placeholders.lastRow')"
      class="w-full my-1"
      :class="vv.end_row.$error ? 'p-invalid' : ''"
      :disabled="disabled"
    />

    <small id="parsingEndRow-help" :class="vv.end_row.$error ? 'p-error' : ''">
      {{ errorMessage(vv.end_row.$errors) }}
    </small>
  </div>

  <div v-if="type === 'supplies'" class="p-field flex flex-column mt-3">
    <label for="parsingSupplier">*{{ $t('parsing.labels.supplier') }}</label>

    <lazy-dropdown
      type="suppliers"
      :model-value="supplier"
      :placeholder="$t('placeholders.supplier')"
      class="w-full my-1"
      :class="vv.supplier.$error ? 'p-invalid' : ''"
      :disabled="disabled"
      @update-model-value="($event) => $emit('update-supplier', $event.value)"
    />

    <small id="parsingSupplier-help" :class="vv.supplier.$error ? 'p-error' : ''">
      {{ errorMessage(vv.supplier.$errors) }}
    </small>
  </div>

  <div
    v-if="type === 'supplier' || type === 'supplies' || type === 'supply'"
    class="p-field flex flex-column mt-3"
  >
    <label for="parsingFileType">*{{ $t('parsing.labels.fileType') }}</label>

    <dropdown
      id="parsingFileType"
      :model-value="fileType"
      :options="FILE_TYPES"
      option-label="label"
      option-value="id"
      aria-describedby="parsingFileType-help"
      class="w-full my-1"
      :class="vv.file_type.$error ? 'p-invalid' : ''"
      :placeholder="$t('parsing.placeholders.fileType')"
      @change="($event) => $emit('update-file-type', $event.value)"
    />

    <small id="parsingFileType-help" :class="vv.file_type.$error ? 'p-error' : ''">
      {{ errorMessage(vv.file_type.$errors) }}
    </small>
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';

import { useVuelidate } from '@vuelidate/core';

import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';

import errorMessage from '@/app/shared/utils/error-message';
import { rowSchema } from '@/app/shared/config/parsing/parsing-validation-schema';
import { FILE_TYPES } from '@/app/shared/config/parsing/parsing-file-types';

import LazyDropdown from '@/app/shared/components/lazy-dropdown.vue';

import type { ParsingType, SupplierShort } from '@/@types/additional';

const props = defineProps({
  startRow: { type: Number, required: true },
  endRow: { type: Number, required: true },
  supplier: { type: Object as PropType<SupplierShort>, required: true },
  fileType: { type: Number, required: true },
  disabled: { type: Boolean, required: true },
  type: { type: String as PropType<ParsingType>, required: true },
});

const emit = defineEmits(['update-data', 'update-supplier', 'update-file-type']);

const data = computed(() => ({
  start_row: props.startRow,
  end_row: props.endRow,
  supplier: props.supplier,
  file_type: props.fileType,
}));

const vv = useVuelidate(rowSchema(props.type), data);

const updateData = (key: string, value: string) => {
  emit('update-data', { key: `${key}`, value });
  vv.value[key].$model = value;
};

const endRowModel = computed({
  get() {
    return props.endRow;
  },
  set(value) {
    updateData('end_row', value);
  },
});

const startRowModel = computed({
  get() {
    return props.startRow;
  },
  set(value) {
    updateData('start_row', value);
  },
});
</script>
