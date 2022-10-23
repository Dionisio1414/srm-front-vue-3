<template>
  <div class="grid align-items-start">
    <div class="grid align-items-center col-12 h-6rem p-0 m-0">
      <div class="p-field-checkbox col-3 flex align-items-center">
        <input-switch id="BaseInfoIsActive" :disabled="isLoading" v-model="isActiveModel" />

        <label for="BaseInfoIsActive" class="mx-4">
          {{ $t('price.labels.active') }}
        </label>
      </div>

      <div v-if="!data.is_active" class="p-field flex flex-column col-3">
        <label for="baseInfoReason"> *{{ $t('price.labels.reason') }}: </label>

        <dropdown
          id="baseInfoReason"
          :model-value="data.reason_id"
          :options="infoStore.forwarderReasons"
          option-label="description"
          option-value="id"
          aria-describedby="baseInfoReason-help"
          class="my-1"
          :class="vv.reason_id.$error ? 'p-invalid' : ''"
          :placeholder="$t('placeholders.reason')"
          :disabled="isLoading"
          @change="updateData('reason_id', $event.value)"
        />

        <small id="baseInfoReason-help" :class="vv.reason_id.$error ? 'p-error' : ''">
          {{ errorMessage(vv.reason_id.$errors) }}
        </small>
      </div>
    </div>

    <div class="p-field flex flex-column col-3">
      <label for="baseInfoForwarder"> *{{ $t('price.labels.forwarder') }}: </label>

      <lazy-dropdown
        id="baseInfoForwarder"
        type="forwarders"
        :model-value="data.forwarder_guid ? { value: data.forwarder_guid } : null"
        :placeholder="$t('placeholders.forwarder')"
        class="w-full my-1"
        :class="vv.forwarder_guid.$error ? 'p-invalid' : ''"
        :disabled="isLoading"
        @update-model-value="updateData('forwarder_guid', $event.value.value)"
      />

      <small id="baseInfoForwarder-help" :class="vv.forwarder_guid.$error ? 'p-error' : ''">
        {{ errorMessage(vv.forwarder_guid.$errors) }}
      </small>
    </div>

    <div class="p-field flex flex-column col-3">
      <label for="baseInfoWays"> *{{ $t('price.labels.way') }}: </label>

      <div class="flex flex-wrap align-items-center">
        <multi-select
          id="baseInfoWays"
          :options="infoStore.forwarderWays"
          option-value="id"
          option-label="name"
          :model-value="data.way_ids"
          :disabled="!data.forwarder_guid || isLoading"
          class="w-full my-1"
          :class="vv.way_ids.$error ? 'p-invalid' : ''"
          :placeholder="$t('placeholders.way')"
          @change="updateData('way_ids', $event.value)"
        />
      </div>

      <small :class="vv.way_ids.$error ? 'p-error' : ''">
        {{ errorMessage(vv.way_ids.$errors) }}
      </small>
    </div>

    <div class="p-field flex flex-wrap col-6 px-0">
      <label for="baseInfoRelevantDates" class="col-12 py-0">
        *{{ $t('price.labels.relevantDates') }}:
      </label>

      <div class="flex flex-wrap align-items-center col-6 py-0">
        <calendar
          id="baseInfoRelevantDates"
          :model-value="data.relevant_date_from"
          :manual-input="false"
          date-format="yy-mm-dd"
          :placeholder="$t('placeholders.fromDate')"
          class="w-full my-1"
          :input-class="['min-w-0 w-full', { 'p-invalid': vv.relevant_date_from.$error }]"
          :disabled="isLoading"
          @date-select="updateData('relevant_date_from', formatDate($event))"
        />
      </div>

      <div class="flex flex-wrap align-items-center col-6 py-0">
        <calendar
          :model-value="data.relevant_date_to"
          :manual-input="false"
          date-format="yy-mm-dd"
          :min-date="new Date(data.relevant_date_from)"
          :placeholder="$t('placeholders.toDate')"
          class="w-full my-1"
          :input-class="['min-w-0 w-full', { 'p-invalid': vv.relevant_date_to.$error }]"
          :disabled="!data.relevant_date_from || isLoading"
          @date-select="updateData('relevant_date_to', formatDate($event))"
        />
      </div>

      <small
        class="col-12 py-0"
        :class="vv.relevant_date_from.$error || vv.relevant_date_to.$error ? 'p-error' : ''"
      >
        {{
          errorMessage(vv.relevant_date_from.$errors) || errorMessage(vv.relevant_date_to.$errors)
        }}
      </small>
    </div>

    <div class="p-field flex flex-column col-3">
      <label for="baseInfoTariff"> *{{ $t('price.labels.tariff') }}: </label>

      <div class="flex flex-wrap align-items-center">
        <dropdown
          id="baseInfoTariff"
          :options="infoStore.forwarderTariffs"
          option-value="id"
          option-label="tariff"
          :model-value="data.tariff_id"
          :disabled="!data.forwarder_guid || isLoading"
          class="w-full my-1"
          :class="vv.tariff_id.$error ? 'p-invalid' : ''"
          :placeholder="$t('placeholders.tariff')"
          @change="updateData('tariff_id', $event.value)"
        />
      </div>

      <small :class="vv.tariff_id.$error ? 'p-error' : ''">
        {{ errorMessage(vv.tariff_id.$errors) }}
      </small>
    </div>

    <div class="p-field flex flex-column col-3">
      <label for="baseInfoLoadingType"> *{{ $t('price.labels.loadingType') }}: </label>

      <div class="flex flex-wrap align-items-center">
        <dropdown
          id="baseInfoLoadingType"
          :options="infoStore.loadingTypes"
          option-value="id"
          option-label="type"
          :model-value="data.loading_type_id"
          :disabled="!data.way_ids?.length || isLoading"
          class="w-full my-1"
          :class="vv.loading_type_id.$error ? 'p-invalid' : ''"
          :placeholder="$t('placeholders.loadingType')"
          @change="updateData('loading_type_id', $event.value)"
        />
      </div>

      <small :class="vv.loading_type_id.$error ? 'p-error' : ''">
        {{ errorMessage(vv.loading_type_id.$errors) }}
      </small>
    </div>

    <div
      v-if="!data.is_active && isOtherReason(data.reason_id)"
      class="p-field flex flex-column col-6"
    >
      <label for="baseInfoReasonComment"> *{{ $t('price.labels.reasonComment') }}: </label>

      <prime-textarea
        id="baseInfoReasonComment"
        :model-value="data.reason_comment"
        aria-describedby="baseInfoReasonComment-help"
        rows="3"
        class="w-full my-1"
        :class="vv.reason_comment.$error ? 'p-invalid' : ''"
        :placeholder="$t('placeholders.reasonComment')"
        style="resize: none"
        :disabled="isLoading"
        @input="updateData('reason_comment', $event.target.value)"
      />

      <small id="baseInfoReasonComment-help" :class="vv.reason_comment.$error ? 'p-error' : ''">
        {{ errorMessage(vv.reason_comment.$errors) }}
      </small>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, PropType, watch } from 'vue';

import { useVuelidate } from '@vuelidate/core';

import MultiSelect from 'primevue/multiselect';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import InputSwitch from 'primevue/inputswitch';
import PrimeTextarea from 'primevue/textarea';

import useInfoStore from '@/app/shared/store/info-store';

import errorMessage from '@/app/shared/utils/error-message';
import { formatDate } from '@/app/shared/services/helpers/table-helpers';
import { baseInfoScheme } from '@/app/price/shared/config/validation-schemes';

import LazyDropdown from '@/app/shared/components/lazy-dropdown.vue';

import type { PriceBaseInfo } from '@/@types/form-data';

const props = defineProps({
  data: { type: Object as PropType<PriceBaseInfo>, required: true },
  isLoading: { type: Boolean, required: true },
});

const emit = defineEmits(['update-data']);

const infoStore = useInfoStore();

const isOtherReason = (id: number): boolean => {
  const current = infoStore.forwarderReasons.find((item) => item.id === id);

  return current?.alias === 'other';
};

const vv = useVuelidate(baseInfoScheme(props.data, isOtherReason), props.data);

const isActiveModel = computed({
  get() {
    return props.data.is_active;
  },

  set(value: boolean) {
    emit('update-data', { key: 'is_active', value });
  },
});

const updateData = (key: string, value: never) => {
  emit('update-data', { key, value });

  vv.value[key].$model = value;
};

const setToDate = (date: string | null) => {
  const fromDate = new Date(date || '');
  fromDate.setDate(fromDate.getDate() + 30);

  emit('update-data', { key: 'relevant_date_to', value: formatDate(fromDate) });
};

watch(
  () => props.data.relevant_date_from,
  (date) => {
    if (!props.data.relevant_date_to && date) {
      setToDate(date);
    } else {
      const fromDate = new Date(date || '');
      const toDate = new Date(props.data.relevant_date_to || '');

      if (date && fromDate > toDate) {
        setToDate(date);
      }
    }
  }
);

onMounted(async () => {
  await nextTick();

  emit('update-data', { key: 'relevant_date_from', value: formatDate(new Date(Date.now())) });
});
</script>
