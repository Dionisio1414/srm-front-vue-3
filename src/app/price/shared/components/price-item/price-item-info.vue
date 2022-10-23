<template>
  <prime-dialog
    v-model:visible="modalState"
    modal
    header="Change price status"
    style="width: 40rem"
  >
    <form id="PriceItemForm" @submit.prevent="saveActivity">
      <div class="p-field-checkbox flex align-items-center mt-3">
        <input-switch
          id="PriceItemIsActive"
          :disabled="activityLoading"
          v-model="vv.isActive.$model"
        />

        <label for="PriceItemIsActive" class="mx-4">
          {{ $t('price.labels.active') }}
        </label>
      </div>

      <div v-if="!vv.isActive.$model" class="p-field grid align-items-start mt-3">
        <label for="PriseItemReason" class="col-fixed w-10rem mt-2">
          *{{ $t('price.labels.reason') }}:
        </label>

        <div class="col">
          <dropdown
            id="PriseItemReason"
            v-model="vv.reasonId.$model"
            :options="reasons"
            option-label="alias"
            option-value="id"
            aria-describedby="PriseItemReason-help"
            class="w-full my-1"
            :class="vv.reasonId.$error ? 'p-invalid' : ''"
            :placeholder="$t('placeholders.reason')"
            :disabled="activityLoading"
          >
            <template #value="{ value, placeholder }">
              <template v-if="value">
                {{ $t(`price.reasons.${getReasonName(value)}`) }}
              </template>

              <template v-else>
                {{ placeholder }}
              </template>
            </template>

            <template #option="{ option }">
              {{ $t(`price.reasons.${option.alias}`) }}
            </template>
          </dropdown>

          <small id="PriseItemReason-help" :class="vv.reasonId.$error ? 'p-error' : ''">
            {{ errorMessage(vv.reasonId.$errors) }}
          </small>
        </div>
      </div>

      <div
        v-if="!vv.isActive.$model && isOtherReason(vv.reasonId.$model)"
        class="p-field grid align-items-start mt-3"
      >
        <label for="PriceItemReasonComment" class="col-fixed w-10rem mt-2">
          *{{ $t('price.labels.reasonComment') }}:
        </label>

        <div class="col">
          <prime-textarea
            id="PriceItemReasonComment"
            v-model="vv.comment.$model"
            aria-describedby="PriceItemReasonComment-help"
            rows="3"
            class="w-full my-1"
            :class="vv.comment.$error ? 'p-invalid' : ''"
            :placeholder="$t('placeholders.reasonComment')"
            style="resize: none"
            :disabled="activityLoading"
          />

          <small id="PriceItemReasonComment-help" :class="vv.comment.$error ? 'p-error' : ''">
            {{ errorMessage(vv.comment.$errors) }}
          </small>
        </div>
      </div>
    </form>

    <template #footer>
      <prime-button
        label="Cancel"
        class="p-button-outlined p-button-danger p-button-sm"
        :disabled="activityLoading"
        @click="onClose(() => $emit('update-data'))"
      />
      <prime-button
        form="PriceItemForm"
        :loading="activityLoading"
        label="Save"
        type="submit"
        class="p-button-success p-button-sm"
      />
    </template>
  </prime-dialog>

  <div v-if="price.forwarder?.name" class="flex align-items-center p-3">
    <h1 class="m-0">
      {{ price.forwarder?.name }}
      ({{ price.tariff?.tariff }}, {{ price.loading_type?.type }})
    </h1>

    <div class="p-field-checkbox flex align-items-center ml-5">
      <input-switch id="PriceItemIsActive" v-model="vv.isActive.$model" @change="onOpen()" />

      <label for="PriceItemIsActive">
        {{ $t('price.labels.active') }}
        {{
          price.disable_reason_link.reason_id && !price.is_active
            ? `(${$t(`price.reasons.${getReasonName(price.disable_reason_link.reason_id)}`)})`
            : ''
        }}
      </label>
    </div>

    <div class="flex flex-wrap align-items-center ml-5">
      <label for="PriceItemRelevantDates" class="py-0 mr-3">
        {{ $t('price.labels.relevantDates') }}:
      </label>

      <calendar
        id="PriceItemRelevantDates"
        v-model="dates.from"
        :manual-input="false"
        date-format="yy-mm-dd"
        :disabled="datesLoading"
        :placeholder="$t('placeholders.fromDate')"
        class="w-10rem"
        @date-select="dates.from = formatDate($event)"
      />

      <span class="mx-3">—</span>

      <calendar
        :model-value="dates.to"
        :manual-input="false"
        date-format="yy-mm-dd"
        :disabled="datesLoading"
        :placeholder="$t('placeholders.toDate')"
        :min-date="new Date(dates.from)"
        class="w-10rem"
        @date-select="dates.to = formatDate($event)"
      />

      <prime-button
        icon="pi pi-save"
        type="button"
        :loading="datesLoading"
        class="p-button-success ml-3"
        @click="saveRelevantDate"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import PrimeDialog from 'primevue/dialog';
import InputSwitch from 'primevue/inputswitch';
import Calendar from 'primevue/calendar';
import PrimeButton from 'primevue/button';
import PrimeTextarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';

import usePriceItemStore from '@/app/price/shared/store/price-item-store';
import useModal from '@/app/shared/services/hooks/modal';
import usePriceItemRelevantDates from '@/app/price/shared/services/hooks/price-item-relevant-dates';
import usePriceItemActivity from '@/app/price/shared/services/hooks/price-item-activity';

import { formatDate } from '@/app/shared/services/helpers/table-helpers';
import errorMessage from '@/app/shared/utils/error-message';

const emit = defineEmits(['update-data']);

const priceItemStore = usePriceItemStore();
const { modalState, onOpen, onClose } = useModal();

const price = computed(() => priceItemStore.price);

const { dates, isLoading: datesLoading, saveRelevantDate } = usePriceItemRelevantDates(price);
const {
  vv,
  isLoading: activityLoading,
  reasons,
  getReasons,
  getReasonName,
  isOtherReason,
  saveActivity,
} = usePriceItemActivity(price, () => {
  onClose();
  emit('update-data');
});

getReasons();
</script>
