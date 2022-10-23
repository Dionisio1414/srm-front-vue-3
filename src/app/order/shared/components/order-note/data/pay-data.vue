<template>
  <li class="my-1">
    <b>{{ $t('order.note.termOfPayment') }}</b>

    <ul class="list-none">
      <li v-if="data.payOnCreated" class="flex align-items-center gap-2 my-1">
        <span class="mr-2">
          {{ $t('order.payData.payOnCreated') }}

          <strong>{{ data.payOnCreated }}%</strong>;
        </span>
        <span>
          {{ $t('order.defermentsLabel') }}

          <strong>{{ delayData.delay_on_created }}</strong>
          {{ $t('order.labels.days') }}
        </span>
      </li>

      <li v-if="data.payOnProduction" class="flex align-items-center gap-2 my-1">
        <span class="mr-2">
          {{ $t('order.payData.payOnProduction') }}

          <strong>{{ data.payOnProduction }}%</strong>;
        </span>
        <span>
          {{ $t('order.defermentsLabel') }}

          <strong>{{ delayData.delay_on_production }}</strong>
          {{ $t('order.labels.days') }}
        </span>
      </li>

      <li v-if="data.paymentOnWarehouse" class="flex align-items-center gap-2 my-1">
        <span class="mr-2">
          {{ $t('order.payData.paymentOnWarehouse') }}

          <strong>{{ data.paymentOnWarehouse }}%</strong>;
        </span>
        <span>
          {{ $t('order.defermentsLabel') }}

          <strong>{{ delayData.delay_on_warehouse }}</strong>
          {{ $t('order.labels.days') }}
        </span>
      </li>

      <li v-if="data.paymentExchangeBl" class="flex align-items-center gap-2 my-1">
        <span class="mr-2">
          {{ $t('order.payData.paymentExchangeBl') }}

          <strong>{{ data.paymentExchangeBl }}%</strong>;
        </span>
        <span>
          {{ $t('order.defermentsLabel') }}

          <strong>{{ delayData.delay_exchange_bl }}</strong>
          {{ $t('order.labels.days') }}
        </span>
      </li>

      <li v-if="data.payOnPort" class="flex align-items-center gap-2 my-1">
        <span class="mr-2">
          {{ $t('order.payData.payOnPort') }}

          <strong>{{ data.payOnPort }}%</strong>;
        </span>
        <span>
          {{ $t('order.defermentsLabel') }}

          <strong>{{ delayData.delay_on_port }}</strong>
          {{ $t('order.labels.days') }}
        </span>
      </li>

      <li v-if="data.payOnDelivered" class="flex align-items-center gap-2 my-1">
        <span class="mr-2">
          {{ $t('order.payData.payOnDelivered') }}

          <strong>{{ data.payOnDelivered }}%</strong>;
        </span>
        <span>
          {{ $t('order.defermentsLabel') }}

          <strong>{{ delayData.delay_on_delivered }}</strong>
          {{ $t('order.labels.days') }}
        </span>
      </li>

      <li v-if="data.paymentOnCompletion" class="flex align-items-center gap-2 my-1">
        <span class="mr-2">
          {{ $t('order.payData.paymentOnCompletion') }}

          <strong>{{ data.paymentOnCompletion }}%</strong>;
        </span>
        <span>
          {{ $t('order.defermentsLabel') }}

          <strong>{{ delayData.delay_on_completion }}</strong>
          {{ $t('order.labels.days') }}
        </span>
      </li>
    </ul>
  </li>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

import type { InfoPay, InfoPayOnDelay } from '@/@types/order';

defineProps({
  data: { type: Object as PropType<InfoPay>, required: true },
  delayData: { type: Object as PropType<InfoPayOnDelay>, required: true },
});
</script>
