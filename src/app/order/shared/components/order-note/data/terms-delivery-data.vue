<template>
  <li class="my-1">
    <b>{{ $t('order.note.termsOfDelivery') }}</b>

    <ul class="list-none">
      <li class="my-1">{{ $t('order.termsDeliveryData.incoterms') }} {{ data.incoterms }}</li>

      <li class="my-1">{{ $t('order.termsDeliveryData.country') }} {{ country }}</li>

      <li class="my-1">{{ $t('order.termsDeliveryData.city') }} {{ data.city }}</li>
    </ul>
  </li>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

import type { InfoTermsDelivery } from '@/@types/order';

defineProps({
  country: { type: String, required: true },
  data: { type: Object as PropType<InfoTermsDelivery>, required: true },
});
</script>
