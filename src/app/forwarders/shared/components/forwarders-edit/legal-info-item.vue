<template>
  <prime-fieldset :legend="data.legal_name || ''" class="my-3">
    <div class="grid align-items-center">
      <label :for="`edit-legalName-${index}`" class="col-fixed w-10rem">
        *{{ $t('forwarder.legal.legalName') }}:
      </label>

      <div class="col">
        <input-text
          :id="`edit-legalName-${index}`"
          :model-value="data.legal_name || ''"
          type="text"
          class="w-full p-inputtext-sm"
          :class="vv.legal_name.$error ? 'p-invalid' : ''"
          :readonly="isReadonly || isLoading"
          :placeholder="$t('forwarder.legal.legalName')"
          v-tooltip="{
            value: errorMessage(vv.legal_name.$errors),
            disabled: !errorMessage(vv.legal_name.$errors),
          }"
          @input="updateData(index, 'legal_name', $event.target.value)"
        />
      </div>
    </div>

    <div class="flex align-items-center justify-content-end mt-3 mb-4">
      <div class="p-field-checkbox pr-3">
        <checkbox
          :id="`edit-isPrimary-${index}`"
          :model-value="data.is_primary"
          binary
          :disabled="isReadonly || isLoading"
          :class="vv.is_primary.$error ? 'p-invalid' : ''"
          @input="updateData(index, 'is_primary', $event)"
        />

        <label :for="`legalIsPrimary-${index}`">
          {{ $t('forwarder.legal.primary') }}
        </label>
      </div>

      <div class="p-field-checkbox pr-3">
        <checkbox
          :id="`edit-isActive-${index}`"
          :model-value="data.is_active"
          binary
          :disabled="isReadonly || isLoading"
          :class="vv.is_active.$error ? 'p-invalid' : ''"
          @input="updateData(index, 'is_active', $event)"
        />

        <label :for="`legalIsActive-${index}`">
          {{ $t('forwarder.legal.isActive') }}
        </label>
      </div>
    </div>

    <div class="grid align-items-center">
      <label :for="`edit-idLegal-${index}`" class="col-fixed w-10rem">
        *{{ $t('forwarder.legal.idLegal') }}:
      </label>

      <div class="col">
        <input-text
          :id="`edit-idLegal-${index}`"
          :model-value="data.id_legal || ''"
          type="text"
          class="w-full p-inputtext-sm"
          :class="vv.id_legal.$error ? 'p-invalid' : ''"
          :readonly="isReadonly || isLoading"
          :placeholder="$t('forwarder.legal.idLegal')"
          v-tooltip="{
            value: errorMessage(vv.id_legal.$errors),
            disabled: !errorMessage(vv.id_legal.$errors),
          }"
          @input="updateData(index, 'id_legal', $event.target.value)"
        />
      </div>
    </div>

    <div class="grid align-items-center">
      <label :for="`edit-legalAddress-${index}`" class="col-fixed w-10rem">
        *{{ $t('forwarder.legal.legalAddress') }}:
      </label>

      <div class="col">
        <input-text
          :id="`edit-legalAddress-${index}`"
          :model-value="data.legal_address || ''"
          type="text"
          class="w-full p-inputtext-sm"
          :class="vv.legal_address.$error ? 'p-invalid' : ''"
          :readonly="isReadonly || isLoading"
          :placeholder="$t('forwarder.legal.legalAddress')"
          v-tooltip="{
            value: errorMessage(vv.legal_address.$errors),
            disabled: !errorMessage(vv.legal_address.$errors),
          }"
          @input="updateData(index, 'legal_address', $event.target.value)"
        />
      </div>
    </div>

    <div class="grid align-items-center">
      <label :for="`edit-zipCode-${index}`" class="col-fixed w-10rem">
        *{{ $t('forwarder.legal.zipCode') }}:
      </label>

      <div class="col">
        <input-text
          :id="`edit-zipCode-${index}`"
          :model-value="data.zip_code || ''"
          type="text"
          class="w-full p-inputtext-sm"
          :class="vv.zip_code.$error ? 'p-invalid' : ''"
          :readonly="isReadonly || isLoading"
          :placeholder="$t('forwarder.legal.zipCode')"
          v-tooltip="{
            value: errorMessage(vv.zip_code.$errors),
            disabled: !errorMessage(vv.zip_code.$errors),
          }"
          @input="updateData(index, 'zip_code', $event.target.value)"
        />
      </div>
    </div>

    <divider align="left">
      <span class="text-md">{{ $t('forwarder.titles.bankDetails') }}</span>
    </divider>

    <div class="grid align-items-center">
      <label :for="`edit-thePayee-${index}`" class="col-fixed w-10rem">
        *{{ $t('forwarder.legal.bank.thePayee') }}:
      </label>

      <div class="col">
        <input-text
          :id="`edit-thePayee-${index}`"
          :model-value="data.the_payee || ''"
          type="text"
          class="w-full p-inputtext-sm"
          :class="vv.the_payee.$error ? 'p-invalid' : ''"
          :readonly="isReadonly || isLoading"
          :placeholder="$t('forwarder.legal.bank.thePayee')"
          v-tooltip="{
            value: errorMessage(vv.the_payee.$errors),
            disabled: !errorMessage(vv.the_payee.$errors),
          }"
          @input="
            ($event) => {
              updateData(index, 'the_payee', $event.target.value);
              changeThePayeeHandler($event.target.value || '');
            }
          "
        />
      </div>
    </div>

    <div class="grid align-items-center">
      <label :for="`edit-vatId-${index}`" class="col-fixed w-10rem">
        *{{ $t('forwarder.legal.bank.vatId') }}:
      </label>

      <div class="col">
        <input-text
          :id="`edit-vatId-${index}`"
          :model-value="data.vat_id || ''"
          type="text"
          class="w-full p-inputtext-sm"
          :class="vv.vat_id.$error ? 'p-invalid' : ''"
          :readonly="isReadonly || isLoading"
          :placeholder="$t('forwarder.legal.bank.vatId')"
          v-tooltip="{
            value: errorMessage(vv.vat_id.$errors),
            disabled: !errorMessage(vv.vat_id.$errors),
          }"
          @input="updateData(index, 'vat_id', $event.target.value)"
        />
      </div>
    </div>

    <div class="grid align-items-center">
      <label :for="`edit-iban-${index}`" class="col-fixed w-10rem">
        *{{ $t('forwarder.legal.bank.iban') }}:
      </label>

      <div class="col">
        <input-text
          :id="`edit-iban-${index}`"
          :model-value="data.iban || ''"
          type="text"
          class="w-full p-inputtext-sm"
          :class="vv.iban.$error ? 'p-invalid' : ''"
          :readonly="isReadonly || isLoading"
          :placeholder="$t('forwarder.legal.bank.iban')"
          v-tooltip="{
            value: errorMessage(vv.iban.$errors),
            disabled: !errorMessage(vv.iban.$errors),
          }"
          @input="updateData(index, 'iban', $event.target.value)"
        />
      </div>
    </div>

    <div class="grid align-items-center">
      <label :for="`edit-swiftCode-${index}`" class="col-fixed w-10rem">
        *{{ $t('forwarder.legal.bank.swiftCode') }}:
      </label>

      <div class="col">
        <input-text
          :id="`edit-swiftCode-${index}`"
          :model-value="data.swift_code || ''"
          type="text"
          class="w-full p-inputtext-sm"
          :class="vv.swift_code.$error ? 'p-invalid' : ''"
          :readonly="isReadonly || isLoading"
          :placeholder="$t('forwarder.legal.bank.swiftCode')"
          v-tooltip="{
            value: errorMessage(vv.swift_code.$errors),
            disabled: !errorMessage(vv.swift_code.$errors),
          }"
          @input="updateData(index, 'swift_code', $event.target.value)"
        />
      </div>
    </div>

    <div v-if="(!isReadonly || isLoading) && canDelete" class="flex justify-content-end mt-3">
      <prime-button
        :label="$t('forwarder.buttons.removeBankInfo')"
        class="p-button-danger text-base"
        :disabled="isLoading"
        @click="$emit('delete-data', index)"
      />
    </div>
  </prime-fieldset>
</template>

<script lang="ts" setup>
import { PropType, toRefs } from 'vue';

import { useVuelidate } from '@vuelidate/core';

import vTooltip from 'primevue/tooltip';
import PrimeFieldset from 'primevue/fieldset';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Divider from 'primevue/divider';
import PrimeButton from 'primevue/button';

import useFieldsConnection from '@/app/forwarders/shared/services/hooks/fields-connection';

import { legalScheme } from '@/app/forwarders/shared/config/validation-schemes/legal-scheme';
import errorMessage from '@/app/shared/utils/error-message';

import type { ForwarderLegal } from '@/@types/form-data';

const props = defineProps({
  index: { type: Number, required: true },
  canDelete: { type: Boolean, required: true },
  isLoading: { type: Boolean, required: true },
  isReadonly: { type: Boolean, required: true },
  data: { type: Object as PropType<ForwarderLegal>, required: true },
});

const emit = defineEmits(['update-data', 'delete-data']);

const vv = useVuelidate(legalScheme, props.data);

const updateData = (index: number, key: string, value: never) => {
  emit('update-data', { index, key, value });

  vv.value[key].$model = value;
};

const { changeThePayeeHandler } = useFieldsConnection(toRefs(props.data), (value: string): void => {
  emit('update-data', { index: props.index, key: 'the_payee', value });
  vv.value.the_payee.$model = value;
});
</script>
