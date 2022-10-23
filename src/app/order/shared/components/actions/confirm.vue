<template>
  <prime-button
    v-if="$can('view', 'Order.status.rollback')"
    :label="translate(status.alias, 'openPopupButtonText')"
    class="p-button-outlined p-button-warning mt-2 mr-2"
    @click="onRollback(status.alias)"
  />
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

import PrimeButton from 'primevue/button';

import useTranslation from '@/app/order/shared/services/hooks/translations';
import useRollbackConfirmation from '@/app/order/shared/services/hooks/rollback-confirmation';

import type { StatusHistoryStatus } from '@/@types/order';

defineProps({
  status: { type: Object as PropType<StatusHistoryStatus>, required: true },
});

const emit = defineEmits(['rollback-status']);

const { getScenarioTranslate: translate } = useTranslation();

const callback = () => emit('rollback-status');
const { onRollback } = useRollbackConfirmation(callback);
</script>
