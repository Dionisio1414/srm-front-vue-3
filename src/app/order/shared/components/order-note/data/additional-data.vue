<template>
  <li class="my-1">
    <b>{{ $t('order.note.designAndPacking') }}</b>
    {{ data.designAndPacking }}
  </li>

  <li class="my-1">
    <b>{{ $t('order.note.engraving') }}</b>
    {{ data.engraving }}
  </li>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

import type { InfoAdditionalData } from '@/@types/order';

defineProps({
  data: { type: Object as PropType<InfoAdditionalData>, required: true },
});
</script>
