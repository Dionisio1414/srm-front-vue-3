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
        @change-status="changeStatus($event)"
      />

      <prepayment-order
        v-else-if="status.id === HISTORY_STATUSES.UPLOAD_PREPAYMENT_ORDER"
        :alias="alias"
        :status="status"
        :is-loading="isLoading"
        @change-status="changeStatus($event)"
      />

      <prime-button
        v-else
        :label="translate(alias, script.alias)"
        :loading="isLoading"
        class="p-button-outlined mt-2 mr-2"
        :class="`p-button-${script.class}`"
        @click="changeStatus({ statusId: script.id })"
      />
    </template>

    <prime-button
      v-if="rollbackAllowed(status.id) && $can('view', 'Order.status.rollback')"
      icon="pi pi-backward"
      class="p-button-outlined w-4rem mt-2 ml-auto"
      @click="onRollback(status.alias, true)"
    />
  </block-ui>
</template>

<script lang="ts" setup>
import { computed, ref, PropType } from 'vue';

import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';

import BlockUi from 'primevue/blockui';
import PrimeButton from 'primevue/button';

import useOrderStore from '@/app/order/shared/store/order-store';
import useNotification from '@/app/shared/services/hooks/notifications';
import useTranslation from '@/app/order/shared/services/hooks/translations';
import useRollbackConfirmation from '@/app/order/shared/services/hooks/rollback-confirmation';

import { HISTORY_STATUSES } from '@/app/order/shared/config/history-statuses-constants';

import Reject from '@/app/order/shared/components/actions/reject.vue';
import PrepaymentOrder from '@/app/order/shared/components/actions/prepayment-order.vue';
import PrepaymentExpectation from '@/app/order/shared/components/actions/prepayment-expectation.vue';
import PiChecking from '@/app/order/shared/components/actions/pi-checking.vue';
import Executed from '@/app/order/shared/components/actions/executed.vue';
import Closed from '@/app/order/shared/components/actions/closed.vue';

import type { StatusHistoryScenario, StatusHistoryStatus } from '@/@types/order';
import type { CustomError } from '@/app/shared/services/hooks/notifications';

defineProps({
  alias: { type: String, required: true },
  status: { type: Object as PropType<StatusHistoryStatus>, default: () => ({}) },
  scripts: { type: Array as PropType<StatusHistoryScenario[]>, default: () => [] },
});

const emit = defineEmits(['update-order', 'update-history']);

const route = useRoute();
const toast = useToast();
const { t } = useI18n();
const orderStore = useOrderStore();
const { onSuccess, onError } = useNotification();
const { getScenarioTranslate: translate } = useTranslation();

const isLoading = ref(false);

const rollbackAllowed = computed(() => orderStore.statusRollbackAllowed);

const getScript = (id: number): unknown => {
  switch (id) {
    case HISTORY_STATUSES.STATUS_REJECTED:
      return Reject;

    case HISTORY_STATUSES.STATUS_REJECTED_ORDER:
      return Reject;

    case HISTORY_STATUSES.UPLOAD_PREPAYMENT_ORDER:
      return PrepaymentExpectation;

    case HISTORY_STATUSES.STATUS_PROFORMA_INVOICE_CHECKING:
      return PiChecking;

    case HISTORY_STATUSES.EXECUTED:
      return Executed;

    case HISTORY_STATUSES.CLOSED:
      return Closed;

    default:
      return undefined;
  }
};

const rollbackStatus = async () => {
  isLoading.value = true;

  try {
    await orderStore.rollbackStatus(route.params.guid as string);

    onSuccess(t('order.messages.statusChangeSuccess'));

    emit('update-order');
    emit('update-history');
  } catch (error) {
    if ((error as CustomError).response.status === 400) {
      toast.add({
        severity: 'error',
        detail: t('order.messages.orderHasSupplies'),
        life: 5000,
      });
    } else {
      onError(error as CustomError);
    }
  } finally {
    isLoading.value = false;
  }
};

const changeStatus = async ({
  statusId,
  reasonId,
  comment,
}: {
  statusId: number;
  reasonId?: number;
  comment?: string;
}) => {
  isLoading.value = true;

  try {
    await orderStore.changeStatus(route.params.guid as string, statusId, reasonId, comment);

    onSuccess(t('order.messages.statusChangeSuccess'));

    emit('update-order');
    emit('update-history');
  } catch (error) {
    const is400Error = (error as CustomError).response.status === 400;

    if (is400Error && statusId !== HISTORY_STATUSES.CLOSED) {
      toast.add({
        severity: 'error',
        detail: t('order.messages.orderHasSupplies'),
        life: 5000,
      });
    } else if (is400Error && statusId === HISTORY_STATUSES.CLOSED) {
      toast.add({
        severity: 'error',
        detail: t('order.messages.orderInSwh'),
        life: 5000,
      });
    } else {
      onError(error as CustomError);
    }
  } finally {
    isLoading.value = false;
  }
};

const { onRollback } = useRollbackConfirmation(rollbackStatus);
</script>
