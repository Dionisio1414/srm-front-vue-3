<template>
  <div class="flex align-items-center gap-2">
    <orders-new :loading="isLoading" @change-status="changeStatusHandler" />

    <orders-reject
      :loading="isLoading"
      :status-reasons="statusReasons"
      @change-status="changeStatusHandler"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useI18n } from 'vue-i18n';

import useInfoStore from '@/app/shared/store/info-store';
import useOrdersStore from '@/app/orders/shared/store/orders-store';
import useNotifications from '@/app/shared/services/hooks/notifications';

import OrdersNew from './orders-new.vue';
import OrdersReject from './orders-reject.vue';

import { changeStatusPlanned } from '@/app/orders/shared/services/api';

import { ChangeStatusPlanned } from '@/@types/order';
import type { CustomError } from '@/app/shared/services/hooks/notifications';

const emit = defineEmits(['reset-actions']);

const infoStore = useInfoStore();
const ordersStore = useOrdersStore();
const { t } = useI18n();
const { onSuccess, onError } = useNotifications();

const statusId = 8;
const isLoading = ref(false);

const selectedCustomers = computed(() => ordersStore.selectedCustomers);
const statusReasons = computed(() => infoStore.statusReasons);

const changeStatusHandler = async (data: ChangeStatusPlanned) => {
  try {
    isLoading.value = true;

    const params = {
      ...data,
      order_guids: selectedCustomers.value.map((item) => item.guid),
    } as ChangeStatusPlanned;

    await changeStatusPlanned(params);
    await ordersStore.getOrders('planned', true);

    emit('reset-actions');

    onSuccess(t('orders.actions.successMessage'));
  } catch (error) {
    onError(error as CustomError);
  } finally {
    isLoading.value = false;
  }
};

infoStore.getStatusReasons(statusId).catch((error) => onError(error));
</script>
