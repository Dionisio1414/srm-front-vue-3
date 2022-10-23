<template>
  <div class="flex align-items-center justify-content-between">
    <divider align="left">
      <span class="inline-block text-md" style="min-height: 1rem">{{ data.name }}</span>
    </divider>

    <prime-button
      v-if="length > 1"
      type="button"
      icon="pi pi-trash"
      class="p-button-danger ml-3 text-base"
      @click="$emit('delete-person', index)"
    />
  </div>

  <div class="grid align-items-center">
    <label :for="`edit-personName-${index}`" class="col-fixed w-10rem">
      *{{ $t('forwarder.contact.person.name') }}:
    </label>

    <div class="col">
      <input-text
        :id="`edit-personName-${index}`"
        :model-value="data.name"
        type="text"
        class="w-full p-inputtext-sm"
        :class="vv.name.$error ? 'p-invalid' : ''"
        :readonly="isLoading"
        :placeholder="$t('forwarder.contact.person.name')"
        v-tooltip="{
          value: errorMessage(vv.name.$errors),
          disabled: !errorMessage(vv.name.$errors),
        }"
        @input="updatePersonData(index, 'name', $event)"
      />
    </div>
  </div>

  <div class="grid align-items-center">
    <label :for="`edit-personPosition-${index}`" class="col-fixed w-10rem">
      *{{ $t('forwarder.contact.person.position') }}:
    </label>

    <div class="col">
      <input-text
        :id="`edit-personPosition-${index}`"
        :model-value="data.position"
        type="text"
        class="w-full p-inputtext-sm"
        :class="vv.position.$error ? 'p-invalid' : ''"
        :readonly="isLoading"
        :placeholder="$t('forwarder.contact.person.position')"
        v-tooltip="{
          value: errorMessage(vv.position.$errors),
          disabled: !errorMessage(vv.position.$errors),
        }"
        @input="updatePersonData(index, 'position', $event)"
      />
    </div>
  </div>

  <div class="grid align-items-center">
    <label :for="`edit-personPhone-${index}`" class="col-fixed w-10rem">
      *{{ $t('forwarder.contact.person.phone') }}:
    </label>

    <div class="col">
      <input-text
        :id="`edit-personPhone-${index}`"
        :model-value="data.phone"
        type="text"
        class="w-full p-inputtext-sm"
        :class="vv.phone.$error ? 'p-invalid' : ''"
        :readonly="isLoading"
        :placeholder="$t('forwarder.contact.person.phone')"
        v-tooltip="{
          value: errorMessage(vv.phone.$errors),
          disabled: !errorMessage(vv.phone.$errors),
        }"
        @input="updatePersonData(index, 'phone', $event)"
      />
    </div>
  </div>

  <div class="grid align-items-center">
    <label :for="`edit-personEmail-${index}`" class="col-fixed w-10rem">
      *{{ $t('forwarder.contact.person.email') }}:
    </label>

    <div class="col">
      <input-text
        :id="`edit-personEmail-${index}`"
        :model-value="data.email"
        type="text"
        class="w-full p-inputtext-sm"
        :class="vv.email.$error ? 'p-invalid' : ''"
        :readonly="isLoading"
        :placeholder="$t('forwarder.contact.person.email')"
        v-tooltip="{
          value: errorMessage(vv.email.$errors),
          disabled: !errorMessage(vv.email.$errors),
        }"
        @input="updatePersonData(index, 'email', $event)"
      />
    </div>
  </div>

  <div class="grid align-items-center">
    <label :for="`edit-personCountry-${index}`" class="col-fixed w-10rem">
      *{{ $t('forwarder.contact.person.country') }}:
    </label>

    <div class="col">
      <dropdown
        :id="`edit-personCountry-${index}`"
        :model-value="data.country_id"
        filter
        :options="countries"
        option-label="name"
        option-value="id"
        class="w-full p-inputtext-sm"
        panel-class="w-15rem"
        :class="vv.country_id.$error ? 'p-invalid' : ''"
        :disabled="isLoading"
        :placeholder="$t('forwarder.contact.person.country')"
        v-tooltip="{
          value: errorMessage(vv.country_id.$errors),
          disabled: !errorMessage(vv.country_id.$errors),
        }"
        @change="updatePersonData(index, 'country_id', $event)"
      />
    </div>
  </div>

  <div class="p-field-checkbox my-3 ml-auto">
    <checkbox :id="`edit-personHead-${index}`" binary :disabled="isLoading" v-model="isHeadModel" />

    <label :for="`edit-personHead-${index}`">
      {{ $t('forwarder.contact.person.isHead') }}
    </label>
  </div>
</template>

<script lang="ts" setup>
import { computed, toRefs } from 'vue';

import { useVuelidate } from '@vuelidate/core';

import vTooltip from 'primevue/tooltip';
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';
import PrimeButton from 'primevue/button';

import useInfoStore from '@/app/shared/store/info-store';

import { contactPersonScheme } from '@/app/forwarders/shared/config/validation-schemes/contacts-scheme';
import errorMessage from '@/app/shared/utils/error-message';

import type { ForwarderContactPerson } from '@/@types/form-data';

const props = defineProps({
  data: { type: Object, required: true },
  index: { type: Number, required: true },
  length: { type: Number, required: true },
  isLoading: { type: Boolean, required: true },
});

const emit = defineEmits(['update-person', 'delete-person']);

const infoStore = useInfoStore();

const countries = computed(() => infoStore.allCountries);

const vv = useVuelidate(contactPersonScheme, toRefs(props.data));

const updatePersonData = (
  index: number,
  key: keyof ForwarderContactPerson,
  { target, value }: { target?: HTMLInputElement; value: number | boolean }
): void => {
  emit('update-person', { key, index, value: target?.value || value });

  vv.value[key].$model = target?.value || value;
};

const isHeadModel = computed({
  get() {
    return props.data.is_head;
  },

  set(value: boolean) {
    updatePersonData(props.index, 'is_head', { value });
  },
});
</script>
