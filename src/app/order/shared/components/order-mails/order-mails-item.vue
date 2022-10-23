<template>
  <div class="flex align-items-start justify-content-between mb-4">
    <div v-html="$t(`order.mailsKeys.${data.alias}`)" />

    <small class="flex-shrink-0 w-9rem text-right" style="margin-top: 0.1rem">
      {{ formatDate(data.created_at, true) }}
    </small>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

import { formatDate } from '@/app/shared/services/helpers/table-helpers';

import type { MailsHistory } from '@/@types/order';

defineProps({
  data: { type: Object as PropType<MailsHistory>, required: true },
});
</script>
