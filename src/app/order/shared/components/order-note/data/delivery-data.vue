<template>
  <li
    v-if="
      (data?.Ocean?.deliveryType && data?.Ocean?.port) ||
      (data?.Air?.deliveryType && data?.Air?.port) ||
      (data?.Rail?.deliveryType && data?.Rail?.port) ||
      (data?.Truck?.deliveryType && data?.Truck?.port)
    "
    class="my-1"
  >
    <b>{{ $t('order.note.deliveryPort') }}</b>

    <ul class="list-none">
      <li v-if="data?.Ocean?.deliveryType && data?.Ocean?.port" class="my-1">
        {{ data?.Ocean?.deliveryType }}: {{ data?.Ocean?.port }}
      </li>

      <li v-if="data?.Air?.deliveryType && data?.Air?.port" class="my-1">
        {{ data?.Air?.deliveryType }}: {{ data?.Air?.port }}
      </li>

      <li v-if="data?.Rail?.deliveryType && data?.Rail?.port" class="my-1">
        {{ data?.Rail?.deliveryType }}: {{ data?.Rail?.port }}
      </li>

      <li v-if="data?.Truck?.deliveryType && data?.Truck?.port" class="my-1">
        {{ data?.Truck?.deliveryType }}: {{ data?.Truck?.port }}
      </li>

      <li v-if="data?.['Sea+RW']?.deliveryType && data?.['Sea+RW']?.port" class="my-1">
        {{ data?.['Sea+RW']?.deliveryType }}: {{ data?.['Sea+RW']?.port }}
      </li>
    </ul>
  </li>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

import type { InfoDelivery } from '@/@types/order';

defineProps({
  data: { type: Object as PropType<InfoDelivery>, required: true },
});
</script>
