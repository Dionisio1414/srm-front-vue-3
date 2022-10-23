<template>
  <p>{{ $t('order.statusesDescription.prepaymentExpectation1') }}</p>
  <p>
    {{
      $t('order.statusesDescription.prepaymentExpectation2', {
        orderNumber,
        percent: Math.round(prepayment.percent * 1e10) / 1e10,
        amount: Number(prepayment.amount).toFixed(2) || 0,
      })
    }}
  </p>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useRoute } from 'vue-router';

import useOrderStore from '@/app/order/shared/store/order-store';
import useNotification from '@/app/shared/services/hooks/notifications';

const route = useRoute();
const orderStore = useOrderStore();
const { onError } = useNotification();

const orderNumber = computed(() => orderStore.order.orderNumber);
const prepayment = computed(() => orderStore.prepayment);

orderStore.getPrepayment(route.params.guid as string).catch((error) => onError(error));
</script>
