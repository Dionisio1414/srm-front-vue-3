<template>
  <li class="my-1">
    <b>{{ $t('order.note.bankInformation') }}</b>

    <ul class="list-none">
      <li class="my-1">{{ $t('order.bankInformation.swift') }} {{ data.swiftCode }}</li>

      <li class="my-1">{{ $t('order.bankInformation.beneficiary') }} {{ data.recipient }}</li>

      <li class="my-1">{{ $t('order.bankInformation.iban') }} {{ data.iban }}</li>
    </ul>
  </li>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

import type { InfoBankData } from '@/@types/order';

defineProps({
  data: { type: Object as PropType<InfoBankData>, required: true },
});
</script>
