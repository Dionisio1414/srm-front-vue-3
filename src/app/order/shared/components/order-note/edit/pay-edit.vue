<template>
  <li class="my-1">
    <b>{{ $t('order.note.termOfPayment') }}</b>

    <ul class="list-none">
      <li class="flex align-items-center gap-2">
        <span class="mr-2">
          {{ $t('order.payData.payOnCreated') }}

          <input-number
            :min="0"
            :max="100"
            :model-value="data.pay_on_created"
            :input-class="[
              'p-inputtext-xs w-5rem my-1 ml-2',
              { 'p-invalid': vv.pay_on_created.$error },
            ]"
            :disabled="disabled"
            v-tooltip="{
              value: errorMessage(vv.pay_on_created.$errors),
              disabled: !errorMessage(vv.pay_on_created.$errors),
            }"
            @input="updateData('pay_on_created', $event.value)"
          />
        </span>
        <span>
          {{ $t('order.defermentsLabel') }}

          <input-text
            :model-value="delayData.delay_on_created"
            class="p-inputtext-xs w-5rem ml-2"
            maxlength="4"
            :disabled="disabled"
            @keypress="isDigitHandler"
            @input="updateDelayData('delay_on_created', +$event.target.value)"
          />
        </span>
        {{ $t('order.labels.days') }}
      </li>

      <li class="flex align-items-center gap-2">
        <span class="mr-2">
          {{ $t('order.payData.payOnProduction') }}

          <input-number
            :min="0"
            :max="100"
            :model-value="data.pay_on_production"
            :input-class="[
              'p-inputtext-xs w-5rem my-1 ml-2',
              { 'p-invalid': vv.pay_on_production.$error },
            ]"
            :disabled="disabled"
            v-tooltip="{
              value: errorMessage(vv.pay_on_production.$errors),
              disabled: !errorMessage(vv.pay_on_production.$errors),
            }"
            @input="updateData('pay_on_production', $event.value)"
          />
        </span>
        <span>
          {{ $t('order.defermentsLabel') }}

          <input-text
            :model-value="delayData.delay_on_production"
            class="p-inputtext-xs w-5rem ml-2"
            maxlength="4"
            :disabled="disabled"
            @keypress="isDigitHandler"
            @input="updateDelayData('delay_on_production', +$event.target.value)"
          />
          {{ $t('order.labels.days') }}
        </span>
      </li>

      <li class="flex align-items-center gap-2">
        <span class="mr-2">
          {{ $t('order.payData.payOnDelivered') }}

          <input-number
            :min="0"
            :max="100"
            :model-value="data.pay_on_delivered"
            :input-class="[
              'p-inputtext-xs w-5rem my-1 ml-2',
              { 'p-invalid': vv.pay_on_delivered.$error },
            ]"
            :disabled="disabled"
            v-tooltip="{
              value: errorMessage(vv.pay_on_delivered.$errors),
              disabled: !errorMessage(vv.pay_on_delivered.$errors),
            }"
            @input="updateData('pay_on_delivered', $event.value)"
          />
        </span>
        <span>
          {{ $t('order.defermentsLabel') }}

          <input-text
            :model-value="delayData.delay_on_delivered"
            class="p-inputtext-xs w-5rem ml-2"
            maxlength="4"
            :disabled="disabled"
            @keypress="isDigitHandler"
            @input="updateDelayData('delay_on_delivered', +$event.target.value)"
          />
          {{ $t('order.labels.days') }}
        </span>
      </li>

      <li class="flex align-items-center gap-2">
        <span class="mr-2">
          {{ $t('order.payData.payOnPort') }}

          <input-number
            :min="0"
            :max="100"
            :model-value="data.pay_on_port"
            :input-class="[
              'p-inputtext-xs w-5rem my-1 ml-2',
              { 'p-invalid': vv.pay_on_port.$error },
            ]"
            :disabled="disabled"
            v-tooltip="{
              value: errorMessage(vv.pay_on_port.$errors),
              disabled: !errorMessage(vv.pay_on_port.$errors),
            }"
            @input="updateData('pay_on_port', $event.value)"
          />
        </span>
        <span>
          {{ $t('order.defermentsLabel') }}

          <input-text
            :model-value="delayData.delay_on_port"
            class="p-inputtext-xs w-5rem ml-2"
            maxlength="4"
            :disabled="disabled"
            @keypress="isDigitHandler"
            @input="updateDelayData('delay_on_port', +$event.target.value)"
          />
          {{ $t('order.labels.days') }}
        </span>
      </li>

      <li class="flex align-items-center gap-2">
        <span class="mr-2">
          {{ $t('order.payData.paymentExchangeBl') }}

          <input-number
            :min="0"
            :max="100"
            :model-value="data.payment_exchange_bl"
            :input-class="[
              'p-inputtext-xs w-5rem my-1 ml-2',
              { 'p-invalid': vv.payment_exchange_bl.$error },
            ]"
            :disabled="disabled"
            v-tooltip="{
              value: errorMessage(vv.payment_exchange_bl.$errors),
              disabled: !errorMessage(vv.payment_exchange_bl.$errors),
            }"
            @input="updateData('payment_exchange_bl', $event.value)"
          />
        </span>
        <span>
          {{ $t('order.defermentsLabel') }}

          <input-text
            :model-value="delayData.delay_exchange_bl"
            class="p-inputtext-xs w-5rem ml-2"
            maxlength="4"
            :disabled="disabled"
            @keypress="isDigitHandler"
            @input="updateDelayData('delay_exchange_bl', +$event.target.value)"
          />
          {{ $t('order.labels.days') }}
        </span>
      </li>

      <li class="flex align-items-center gap-2">
        <span class="mr-2">
          {{ $t('order.payData.paymentOnCompletion') }}

          <input-number
            :min="0"
            :max="100"
            :model-value="data.payment_on_completion"
            :input-class="[
              'p-inputtext-xs w-5rem my-1 ml-2',
              { 'p-invalid': vv.payment_on_completion.$error },
            ]"
            :disabled="disabled"
            v-tooltip="{
              value: errorMessage(vv.payment_on_completion.$errors),
              disabled: !errorMessage(vv.payment_on_completion.$errors),
            }"
            @input="updateData('payment_on_completion', $event.value)"
          />
        </span>
        <span>
          {{ $t('order.defermentsLabel') }}

          <input-text
            :model-value="delayData.delay_on_completion"
            class="p-inputtext-xs w-5rem ml-2"
            maxlength="4"
            :disabled="disabled"
            @keypress="isDigitHandler"
            @input="updateDelayData('delay_on_completion', +$event.target.value)"
          />
          {{ $t('order.labels.days') }}
        </span>
      </li>

      <li class="flex align-items-center gap-2">
        <span class="mr-2">
          {{ $t('order.payData.paymentOnWarehouse') }}

          <input-number
            :min="0"
            :max="100"
            :model-value="data.payment_on_warehouse"
            :input-class="[
              'p-inputtext-xs w-5rem my-1 ml-2',
              { 'p-invalid': vv.payment_on_warehouse.$error },
            ]"
            :disabled="disabled"
            v-tooltip="{
              value: errorMessage(vv.payment_on_warehouse.$errors),
              disabled: !errorMessage(vv.payment_on_warehouse.$errors),
            }"
            @input="updateData('payment_on_warehouse', $event.value)"
          />
        </span>
        <span>
          {{ $t('order.defermentsLabel') }}

          <input-text
            :model-value="delayData.delay_on_warehouse"
            class="p-inputtext-xs w-5rem ml-2"
            maxlength="4"
            :disabled="disabled"
            @keypress="isDigitHandler"
            @input="updateDelayData('delay_on_warehouse', +$event.target.value)"
          />
          {{ $t('order.labels.days') }}
        </span>
      </li>
    </ul>
  </li>
</template>

<script lang="ts" setup>
import { PropType, toRefs } from 'vue';

import { useVuelidate } from '@vuelidate/core';

import vTooltip from 'primevue/tooltip';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';

import errorMessage from '@/app/shared/utils/error-message';
import { paymentInfoSchema } from '@/app/order/shared/config/validation-schemes';

import type { PaymentInfoData } from '@/@types/form-data';
import { InfoPayOnDelay } from '@/@types/order';

const props = defineProps({
  disabled: { type: Boolean, required: true },
  data: { type: Object as PropType<PaymentInfoData>, required: true },
  delayData: { type: Object as PropType<InfoPayOnDelay>, required: true },
});

const emit = defineEmits(['update-data', 'update-delay-data']);

const vv = useVuelidate(paymentInfoSchema(props.data), toRefs(props.data));

const updateData = (name: keyof PaymentInfoData, value: string | number) => {
  emit('update-data', { name, value });

  vv.value[name].$model = typeof value === 'string' ? value.trim() : value;
};

const updateDelayData = (name: keyof InfoPayOnDelay, value: number) =>
  emit('update-delay-data', { name, value });

const isDigitHandler = (e: KeyboardEvent) => !/^\d+$/.test(e.key) && e.preventDefault();
</script>
