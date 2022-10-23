<template>
  <div class="grid align-items-start p-5 m-0">
    <div class="p-field flex flex-column col-3">
      <label :for="`legalName-${index}`"> *{{ $t('forwarder.legal.legalName') }}: </label>

      <input-text
        :id="`legalName-${index}`"
        :model-value="data.legal_name || ''"
        :aria-describedby="`legalName-${index}-help`"
        class="my-1"
        :class="vv.legal_name.$error ? 'p-invalid' : ''"
        :placeholder="$t('forwarder.legal.legalName')"
        @input="updateData('legal_name', index, $event)"
      />

      <small :id="`legalName-${index}-help`" :class="vv.legal_name.$error ? 'p-error' : ''">
        {{ errorMessage(vv.legal_name.$errors) }}
      </small>
    </div>

    <div class="p-field flex flex-column col-3">
      <label :for="`legalId-${index}`"> *{{ $t('forwarder.legal.idLegal') }}: </label>

      <input-text
        :id="`legalId-${index}`"
        :model-value="data.id_legal || ''"
        :aria-describedby="`legalId-${index}-help`"
        class="my-1"
        :class="vv.id_legal.$error ? 'p-invalid' : ''"
        :placeholder="$t('forwarder.legal.idLegal')"
        @input="updateData('id_legal', index, $event)"
      />

      <small :id="`legalId-${index}-help`" :class="vv.id_legal.$error ? 'p-error' : ''">
        {{ errorMessage(vv.id_legal.$errors) }}
      </small>
    </div>

    <div class="p-field flex flex-column col-3">
      <label :for="`legalAddress-${index}`"> *{{ $t('forwarder.legal.legalAddress') }}: </label>

      <input-text
        :id="`legalAddress-${index}`"
        :model-value="data.legal_address || ''"
        :aria-describedby="`legalAddress-${index}-help`"
        class="my-1"
        :class="vv.legal_address.$error ? 'p-invalid' : ''"
        :placeholder="$t('forwarder.legal.legalAddress')"
        @input="updateData('legal_address', index, $event)"
      />

      <small :id="`legalAddress-${index}-help`" :class="vv.legal_address.$error ? 'p-error' : ''">
        {{ errorMessage(vv.legal_address.$errors) }}
      </small>
    </div>

    <div class="p-field flex flex-column col-3">
      <label :for="`legalZipCode-${index}`"> *{{ $t('forwarder.legal.zipCode') }}: </label>

      <input-text
        :id="`legalZipCode-${index}`"
        :model-value="data.zip_code || ''"
        :aria-describedby="`legalZipCode-${index}-help`"
        class="my-1"
        :class="vv.zip_code.$error ? 'p-invalid' : ''"
        :placeholder="$t('forwarder.legal.zipCode')"
        @input="updateData('zip_code', index, $event)"
      />

      <small :id="`legalZipCode-${index}-help`" :class="vv.zip_code.$error ? 'p-error' : ''">
        {{ errorMessage(vv.zip_code.$errors) }}
      </small>
    </div>

    <div class="col-12 flex align-items-center">
      <div class="p-field-checkbox pr-3">
        <checkbox
          :id="`legalIsPrimary-${index}`"
          v-model="isPrimaryModel"
          binary
          :class="vv.is_primary.$error ? 'p-invalid' : ''"
        />

        <label :for="`legalIsPrimary-${index}`">
          {{ $t('forwarder.legal.primary') }}
        </label>
      </div>

      <div class="p-field-checkbox pr-3">
        <checkbox
          :id="`legalIsActive-${index}`"
          v-model="isActiveModel"
          binary
          :class="vv.is_active.$error ? 'p-invalid' : ''"
        />

        <label :for="`legalIsActive-${index}`">
          {{ $t('forwarder.legal.isActive') }}
        </label>
      </div>
    </div>

    <divider align="left">
      <span class="text-lg">{{ $t('forwarder.titles.bankDetails') }}</span>
    </divider>

    <div class="p-field flex flex-column col-3">
      <label :for="`legalThePayee-${index}`"> *{{ $t('forwarder.legal.bank.thePayee') }}: </label>

      <input-text
        :id="`legalThePayee-${index}`"
        :model-value="data.the_payee || ''"
        :aria-describedby="`legalThePayee-${index}-help`"
        class="my-1"
        :class="vv.the_payee.$error ? 'p-invalid' : ''"
        :placeholder="$t('forwarder.legal.bank.thePayee')"
        @input="
          ($event) => {
            updateData('the_payee', index, $event);
            changeThePayeeHandler($event.target?.value || '');
          }
        "
      />

      <small :id="`legalThePayee-${index}-help`" :class="vv.the_payee.$error ? 'p-error' : ''">
        {{ errorMessage(vv.the_payee.$errors) }}
      </small>
    </div>

    <div class="p-field flex flex-column col-3">
      <label :for="`legalVatId-${index}`"> *{{ $t('forwarder.legal.bank.vatId') }}: </label>

      <input-text
        :id="`legalVatId-${index}`"
        :model-value="data.vat_id || ''"
        :aria-describedby="`legalVatId-${index}-help`"
        class="my-1"
        :class="vv.vat_id.$error ? 'p-invalid' : ''"
        :placeholder="$t('forwarder.legal.bank.vatId')"
        @input="updateData('vat_id', index, $event)"
      />

      <small :id="`legalVatId-${index}-help`" :class="vv.vat_id.$error ? 'p-error' : ''">
        {{ errorMessage(vv.vat_id.$errors) }}
      </small>
    </div>

    <div class="p-field flex flex-column col-3">
      <label :for="`legalIban-${index}`"> *{{ $t('forwarder.legal.bank.iban') }}: </label>

      <input-text
        :id="`legalIban-${index}`"
        :model-value="data.iban || ''"
        :aria-describedby="`legalIban-${index}-help`"
        class="my-1"
        :class="vv.iban.$error ? 'p-invalid' : ''"
        :placeholder="$t('forwarder.legal.bank.iban')"
        @input="updateData('iban', index, $event)"
      />

      <small :id="`legalIban-${index}-help`" :class="vv.iban.$error ? 'p-error' : ''">
        {{ errorMessage(vv.iban.$errors) }}
      </small>
    </div>

    <div class="p-field flex flex-column col-3">
      <label :for="`legalSwiftCode-${index}`"> *{{ $t('forwarder.legal.bank.swiftCode') }}: </label>

      <input-text
        :id="`legalSwiftCode-${index}`"
        :model-value="data.swift_code || ''"
        :aria-describedby="`legalSwiftCode-${index}-help`"
        class="my-1"
        :class="vv.swift_code.$error ? 'p-invalid' : ''"
        :placeholder="$t('forwarder.legal.bank.swiftCode')"
        @input="updateData('swift_code', index, $event)"
      />

      <small :id="`legalSwiftCode-${index}-help`" :class="vv.swift_code.$error ? 'p-error' : ''">
        {{ errorMessage(vv.swift_code.$errors) }}
      </small>
    </div>

    <div v-if="legalInfo.length > 1" class="col-12 mt-3">
      <prime-button
        :label="$t('forwarder.buttons.removeBankInfo')"
        class="p-button-outlined p-button-danger p-button-sm"
        @click="$emit('remove-info', index)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType, toRefs } from 'vue';

import { useVuelidate } from '@vuelidate/core';

import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import PrimeButton from 'primevue/button';

import useFieldsConnection from '@/app/forwarders/shared/services/hooks/fields-connection';

import errorMessage from '@/app/shared/utils/error-message';
import { legalScheme } from '@/app/forwarders/shared/config/validation-schemes/legal-scheme';

import type { ForwarderLegal } from '@/@types/form-data';

const props = defineProps({
  index: { type: Number, required: true },
  data: { type: Object as PropType<ForwarderLegal>, required: true },
  legalInfo: { type: Array as PropType<ForwarderLegal[]>, required: true },
});

const emit = defineEmits(['remove-info', 'update-data']);

const vv = useVuelidate(legalScheme, toRefs(props.data));

const updateData = (
  key: keyof ForwarderLegal,
  index: number,
  { target, value }: { target?: HTMLInputElement; value: number | boolean | string }
): void => {
  emit('update-data', { key, index, value: target?.value || value });

  vv.value[key].$model = target?.value || value;
};

const isPrimaryModel = computed({
  get() {
    return props.data.is_primary;
  },

  set(value: boolean) {
    updateData('is_primary', props.index, { value });
  },
});

const isActiveModel = computed({
  get() {
    return props.data.is_active;
  },

  set(value: boolean) {
    updateData('is_active', props.index, { value });
  },
});

const { changeThePayeeHandler } = useFieldsConnection(toRefs(props.data), (value: string): void => {
  updateData('the_payee', props.index, { value });
});
</script>
