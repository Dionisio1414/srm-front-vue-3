<template>
  <block-ui :blocked="isLoading" class="flex flex-wrap align-items-center">
    <template v-for="(script, index) in scripts" :key="index">
      <component
        v-if="getScript(script.id)"
        :is="getScript(script.id)"
        :alias="alias"
        :script="script"
        :status="status"
        :is-loading="isLoading"
        @change-status="changeSupplyStatus($event)"
      />
    </template>

    <prime-button
      v-if="rollbackAllowed(status.id)"
      icon="pi pi-backward"
      class="p-button-outlined w-4rem mt-2 ml-auto"
      @click="onRollback(status.alias, true)"
    />
  </block-ui>
</template>

<script lang="ts" setup>
import { PropType, ref, computed } from 'vue';

import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import BlockUi from 'primevue/blockui';
import PrimeButton from 'primevue/button';

import useSupplyStore from '@/app/supply/shared/store/supply-store';
import useNotification from '@/app/shared/services/hooks/notifications';
import useRollbackConfirmation from '@/app/order/shared/services/hooks/rollback-confirmation';

import { HISTORY_STATUSES } from '@/app/supply/shared/config/history-statuses-constants';
import { changeStatus, rollbackStatus } from '@/app/supply/shared/services/api';

import ChangeStatus from '@/app/supply/shared/components/actions/change-status.vue';

import type { SupplyStatus, StatusHistoryScenario } from '@/@types/supply';
import type { CustomError } from '@/app/shared/services/hooks/notifications';

defineProps({
  alias: { type: String, required: true },
  status: { type: Object as PropType<SupplyStatus>, default: () => ({}) },
  scripts: { type: Array as PropType<StatusHistoryScenario[]>, default: () => [] },
});

const emit = defineEmits(['update-supply', 'update-history']);

const route = useRoute();
const supplyStore = useSupplyStore();
const { t } = useI18n();
const { onSuccess, onError } = useNotification();

const isLoading = ref(false);

const rollbackAllowed = computed(() => supplyStore.statusRollbackAllowed);

const getScript = (id: number): unknown => {
  if (HISTORY_STATUSES.includes(id)) {
    return ChangeStatus;
  }

  return undefined;
};

const changeSupplyStatus = async (statusId: number) => {
  isLoading.value = true;

  try {
    await changeStatus(route.params.guid as string, statusId);

    onSuccess(t('supply.statusHistory.messages.statusChangeSuccess'));

    emit('update-supply');
    emit('update-history');
  } catch (error) {
    onError(error as CustomError);
  } finally {
    isLoading.value = false;
  }
};

const rollbackCallback = async () => {
  isLoading.value = true;

  try {
    await rollbackStatus(route.params.guid as string);

    onSuccess(t('order.messages.statusChangeSuccess'));

    emit('update-supply');
    emit('update-history');
  } catch (error) {
    onError(error as CustomError);
  } finally {
    isLoading.value = false;
  }
};

const { onRollback } = useRollbackConfirmation(rollbackCallback);
</script>
