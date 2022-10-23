<template>
  <li class="my-1">
    <b>{{ $t('order.note.deliveryTime') }}</b>
    {{ $t('order.deliveryTimeDescription', { maxLeadTime: plt.maxLeadTime }) }}
  </li>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

import type { OrderPlt } from '@/@types/order';

defineProps({
  plt: { type: Object as PropType<OrderPlt>, required: true },
});
</script>
