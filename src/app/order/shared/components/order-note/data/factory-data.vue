<template>
  <li class="my-1">
    <b>{{ $t('order.note.factoryInformation') }}</b>

    <ul class="list-none">
      <li class="my-1">{{ $t('order.factoryInformation.name') }} {{ factory.name }}</li>

      <li class="my-1">{{ $t('order.factoryInformation.jurName') }} {{ factory.jurName }}</li>

      <li class="my-1">{{ $t('order.factoryInformation.vatNumber') }} {{ factory.vatNumber }}</li>

      <li class="my-1">
        {{ $t('order.factoryInformation.legalAddress') }} {{ factory.legalAddress }}
      </li>

      <li class="my-1">{{ $t('order.factoryInformation.address') }} {{ factory.address }}</li>

      <li class="my-1">{{ $t('order.factoryInformation.phone') }} {{ factory.phone }}</li>
    </ul>
  </li>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

import type { OrderFactory } from '@/@types/order';

defineProps({
  country: { type: String, required: true },
  factory: { type: Object as PropType<OrderFactory>, required: true },
});
</script>
