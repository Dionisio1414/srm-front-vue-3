<template>
  <li class="my-1">
    <b>{{ $t('order.note.termsOfDelivery') }}</b>

    <ul class="list-none">
      <li class="flex align-items-center">
        {{ $t('order.termsDeliveryData.incoterms') }}

        <filter-dropdown
          :model-value="data.incoterm"
          type="incoterms"
          class="p-select-xs w-15rem my-1 ml-2"
          :class="vv.incoterm.$error ? 'p-invalid' : ''"
          :disabled="disabled"
          v-tooltip="{
            value: errorMessage(vv.incoterm.$errors),
            disabled: !errorMessage(vv.incoterm.$errors),
          }"
          @update-model-value="updateData('incoterm', $event.value, $event.initial)"
        />
      </li>
      <li class="flex align-items-center">
        {{ $t('order.termsDeliveryData.country') }}

        <dropdown
          :model-value="data.country_id"
          :options="countries"
          option-value="id"
          option-label="name"
          class="p-select-xs w-15rem my-1 ml-2"
          :class="vv.country_id.$error ? 'p-invalid' : ''"
          :disabled="!countries.length || disabled"
          v-tooltip="{
            value: errorMessage(vv.country_id.$errors),
            disabled: !errorMessage(vv.country_id.$errors),
          }"
          @change="updateData('country_id', $event.value)"
        />
      </li>
      <li class="flex align-items-center">
        {{ $t('order.termsDeliveryData.city') }}

        <input-text
          :model-value="data.city"
          class="p-inputtext-xs w-15rem my-1 ml-2"
          :class="vv.city.$error ? 'p-invalid' : ''"
          :disabled="disabled"
          v-tooltip="{
            value: errorMessage(vv.city.$errors),
            disabled: !errorMessage(vv.city.$errors),
          }"
          @input="updateData('city', $event.target.value)"
        />
      </li>
    </ul>
  </li>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, PropType, toRefs, watch } from 'vue';

import { useVuelidate } from '@vuelidate/core';

import vTooltip from 'primevue/tooltip';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';

import useInfoStore from '@/app/shared/store/info-store';
import useNotification from '@/app/shared/services/hooks/notifications';

import errorMessage from '@/app/shared/utils/error-message';

import FilterDropdown from '@/app/shared/components/filter-dropdown.vue';
import { termsDeliveryInfoSchema } from '@/app/order/shared/config/validation-schemes';

import type { TermsDeliveryInfoData } from '@/@types/form-data';
import type { Country } from '@/@types/additional';

const props = defineProps({
  disabled: { type: Boolean, required: true },
  data: { type: Object as PropType<TermsDeliveryInfoData>, required: true },
});

const emit = defineEmits(['update-data']);

const infoStore = useInfoStore();
const { onError } = useNotification();

const countries = computed(() => infoStore.allCountries);

const vv = useVuelidate(termsDeliveryInfoSchema, toRefs(props.data));

const updateData = (name: keyof TermsDeliveryInfoData, value: string | number, initial = false) => {
  emit('update-data', { name, value, initial });

  vv.value[name].$model = typeof value === 'string' ? value.trim() : value;
};

const getCountryId = (key: string | number, countries: Country[]): string | number => {
  if (typeof key === 'string') {
    const country = countries.find((country) => country.name === key);

    return country?.id || key;
  }

  return key;
};

const countriesWatcher = watch(countries, (countries) => {
  const id = getCountryId(props.data.country_id, countries);

  updateData('country_id', id, true);
  countriesWatcher();
});

infoStore.getAllCountries().catch((error) => onError(error));

onBeforeUnmount(() => {
  infoStore.$patch((state) => {
    state.allCountries = [];
  });
});
</script>
