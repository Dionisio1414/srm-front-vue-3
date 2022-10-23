<template>
  <li class="my-1">
    <b class="block">{{ $t('order.note.additionalTerms') }}</b>
    <!-- FIXME: additional terms formatting -->
    <ul class="list-none">
      <li v-for="(item, index) in data.additionalTerms.split('\n')" :key="index" class="my-1">
        {{ item }}
      </li>
    </ul>
  </li>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

import type { InfoProformaInvoice } from '@/@types/order';

defineProps({
  data: { type: Object as PropType<InfoProformaInvoice>, required: true },
});
</script>
