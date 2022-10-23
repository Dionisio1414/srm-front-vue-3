<template>
  <prime-dialog
    v-model:visible="modalState"
    modal
    :header="type === 'confirm' ? $t('order.expectation.confirm') : $t('order.expectation.change')"
    style="width: 40rem"
  >
    <template v-if="type === 'confirm'">
      <p>
        {{ $t('order.expectation.confirmDesc') }}
      </p>
      <p>
        {{
          $t('order.expectation.confirmBody', {
            orderNumber: orderNumber,
            percents: Math.round(prepayment.percent * 1e10) / 1e10,
            amount: Number(prepayment.amount).toFixed(2) || 0,
          })
        }}
      </p>

      <div class="flex justify-content-end mt-6">
        <prime-button
          :label="$t('order.expectation.cancelChange')"
          type="button"
          class="p-button-outlined p-button-danger mr-3"
          :disabled="isLoading"
          @click="onClose()"
        />

        <prime-button
          :label="$t('order.expectation.confirmChange')"
          type="button"
          class="p-button-success"
          :loading="isLoading"
          @click="setPrepaymentAmount(prepayment.amount)"
        />
      </div>
    </template>

    <template v-else>
      <p>
        {{ $t('order.expectation.changeDesc') }}
      </p>
      <p>
        {{
          $t('order.expectation.changeBody', {
            orderNumber: orderNumber,
            orderSum: prepayment.orderSum,
          })
        }}
      </p>

      <div class="grid align-items-center">
        <label for="prepaymentAmount" class="col-fixed w-10rem text-lg">
          {{ $t('order.labels.amount') }}:
        </label>

        <div class="col">
          <input-number
            id="prepaymentAmount"
            :model-value="amount"
            mode="decimal"
            locale="de-DE"
            :max-fraction-digits="2"
            :use-grouping="false"
            class="w-full"
            :placeholder="$t('order.placeholders.amount')"
            :disabled="infoLoading"
            @input="calculate('amount', $event.value)"
          />
        </div>
      </div>

      <div class="grid align-items-center">
        <label for="prepaymentPercent" class="col-fixed w-10rem text-lg">
          {{ $t('order.labels.percents') }}:
        </label>

        <div class="col">
          <input-number
            id="prepaymentPercent"
            :model-value="percent"
            mode="decimal"
            locale="de-DE"
            :max-fraction-digits="2"
            :use-grouping="false"
            class="w-full"
            :placeholder="$t('order.placeholders.percents')"
            :disabled="infoLoading"
            @input="calculate('percent', $event.value)"
          />
        </div>
      </div>

      <div class="flex justify-content-end mt-6">
        <prime-button
          :label="$t('order.expectation.cancelChange')"
          type="button"
          class="p-button-outlined p-button-danger mr-3"
          :disabled="isLoading || infoLoading"
          @click="
            () => {
              onClose();
              reset();
            }
          "
        />

        <prime-button
          :label="$t('order.expectation.confirmChange')"
          type="button"
          class="p-button-success"
          :loading="isLoading || infoLoading"
          @click="setPrepaymentAmount(amount)"
        />
      </div>
    </template>
  </prime-dialog>

  <prime-button
    :label="$t('order.expectation.confirm')"
    class="p-button-outlined p-button-success mt-2 mr-2"
    @click="
      overpayment.isOverpayment
        ? onConfirm()
        : (() => {
            type = 'confirm';
            onOpen();
          })()
    "
  />

  <prime-button
    :label="$t('order.expectation.change')"
    class="p-button-outlined p-button-warning mt-2 mr-2"
    @click="
      overpayment.isOverpayment
        ? onConfirm()
        : (() => {
            type = 'change';
            onOpen();
          })()
    "
  />
</template>

<script lang="ts" setup>
import { computed, PropType, reactive, ref } from 'vue';

import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useConfirm } from 'primevue/useconfirm';

import debounce from 'lodash.debounce';

import PrimeDialog from 'primevue/dialog';
import PrimeButton from 'primevue/button';
import InputNumber from 'primevue/inputnumber';

import useOrderStore from '@/app/order/shared/store/order-store';
import useModal from '@/app/shared/services/hooks/modal';
import useNotification from '@/app/shared/services/hooks/notifications';

import { setPrepayment, calculateAmount, calculatePercents } from '@/app/order/shared/services/api';
import { HISTORY_STATUSES } from '@/app/order/shared/config/history-statuses-constants';

import type { StatusHistoryStatus } from '@/@types/order';
import type { CustomError } from '@/app/shared/services/hooks/notifications';

defineProps({
  status: { type: Object as PropType<StatusHistoryStatus>, required: true },
});

const emit = defineEmits(['change-status']);

const route = useRoute();
const { t } = useI18n();
const confirm = useConfirm();
const orderStore = useOrderStore();
const { modalState, onOpen, onClose } = useModal();
const { onSuccess, onError } = useNotification();

const type = ref('');
const isLoading = ref(false);
const infoLoading = ref(false);

const orderNumber = computed(() => orderStore.order.orderNumber);
const prepayment = computed(() => orderStore.prepayment);
const overpayment = computed(() => orderStore.overpayment);

const formData = reactive({ amount: prepayment.value.amount, percent: prepayment.value.percent });

const amount = computed(() => formData.amount || prepayment.value.amount);
const percent = computed(() => formData.percent || prepayment.value.percent);

const reset = () => {
  formData.amount = 0;
  formData.percent = 0;
};

const calculate = debounce(async (type: 'percent' | 'amount', value: number) => {
  if (value !== null) {
    try {
      infoLoading.value = true;

      if (type === 'percent') {
        const data = await calculateAmount(route.params.guid as string, value);

        formData.percent = value;
        formData.amount = data.amount;
      } else {
        const data = await calculatePercents(route.params.guid as string, value);

        formData.amount = value;
        formData.percent = data.percent;
      }
    } catch (error) {
      onError(error as CustomError);
    } finally {
      infoLoading.value = false;
    }
  }
}, 500);

const setPrepaymentAmount = async (amount: number) => {
  try {
    isLoading.value = true;

    const data = await setPrepayment(route.params.guid as string, amount);

    onSuccess(data.message);
    emit('change-status', { statusId: HISTORY_STATUSES.UPLOAD_PREPAYMENT_ORDER });
  } catch (error) {
    onError(error as CustomError);
  } finally {
    isLoading.value = false;
    onClose();
  }
};

const onConfirm = () => {
  confirm.require({
    message: t('order.expectation.message'),
    header: t('order.expectation.header'),
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: t('order.expectation.acceptLabel'),
    rejectLabel: t('order.expectation.rejectLabel'),
    accept: () => emit('change-status', { statusId: HISTORY_STATUSES.UPLOAD_PREPAYMENT_ORDER }),
  });
};

orderStore.getOverpayment(route.params.guid as string);
</script>
