<template>
  <progress-bar
    v-if="isLoading || isAutoLoading"
    mode="indeterminate"
    class="absolute"
    style="top: 0; right: 0; left: 0; z-index: 1110; height: 0.5rem"
  />

  <block-ui :blocked="isLoading" class="mt-4">
    <timeline :value="history.slice(0, history.length > 2 ? sliceIndex : history.length)">
      <template #content="{ item, index }">
        <div class="flex align-items-baseline justify-content-between">
          <h4 class="mb-0" style="margin-top: -0.05rem">
            {{ $t(`order.statuses.${item.alias}`) }}
          </h4>

          <small>{{ formatDate(item.updated_at, true) }}</small>
        </div>

        <order-statuses-expectation-description
          v-if="item.status.id === HISTORY_STATUSES.PREPAYMENT_EXPECTATION"
        />

        <order-statuses-description v-else :alias="item.status.alias" />

        <order-statuses-comment v-if="item.comments.length" :comments="item.comments" />

        <order-statuses-reason v-if="item.reason" :reason="item.reason" />

        <order-statuses-actions
          v-if="index === 0"
          :alias="item.alias"
          :status="item.status"
          :scripts="item.status_scenario"
          @update-order="$emit('update-order')"
          @update-history="getStatusHistory()"
        />
      </template>

      <template #marker="{ item }">
        <div class="p-timeline-event-marker" :class="`p-timeline-event-${item.class}`" />
      </template>
    </timeline>

    <button
      v-if="history.length > 2"
      type="button"
      class="flex justify-content-center w-full pt-2 pb-3"
      style="color: currentColor"
      @click="changeSliceIndex(history.length)"
    >
      <font-awesome-icon :icon="sliceIndex === 2 ? 'angles-down' : 'angles-up'" size="2xl" />
    </button>
  </block-ui>
</template>

<script lang="ts" setup>
import { computed, Ref, ref, watch } from 'vue';

import { useRoute } from 'vue-router';

import { library } from '@fortawesome/fontawesome-svg-core';

import { faAnglesDown, faAnglesUp } from '@fortawesome/free-solid-svg-icons';

import ProgressBar from 'primevue/progressbar';
import BlockUi from 'primevue/blockui';
import Timeline from 'primevue/timeline';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import useOrderStore from '@/app/order/shared/store/order-store';
import useNotification from '@/app/shared/services/hooks/notifications';
import useHistoryToggler from '@/app/order/shared/services/hooks/history-toggler';

import {
  HISTORY_STATUSES,
  AUTO_STATUSES,
} from '@/app/order/shared/config/history-statuses-constants';
import { formatDate } from '@/app/shared/services/helpers/table-helpers';

import OrderStatusesExpectationDescription from './order-statuses-expectation-description.vue';
import OrderStatusesDescription from './order-statuses-description.vue';
import OrderStatusesReason from './order-statuses-reason.vue';
import OrderStatusesComment from './order-statuses-comment.vue';
import OrderStatusesActions from './order-statuses-actions.vue';

import type { CustomError } from '@/app/shared/services/hooks/notifications';

library.add(faAnglesDown, faAnglesUp);

const emit = defineEmits(['update-order']);

const route = useRoute();
const orderStore = useOrderStore();
const { onError } = useNotification();
const { sliceIndex, changeSliceIndex } = useHistoryToggler();

const isLoading = ref(false);
const isAutoLoading = ref(false);
const history = computed(() => orderStore.statusHistory);
const timer: Ref<null | number> = ref(null);

const getStatusHistory = async (): Promise<void> => {
  isLoading.value = true;

  try {
    await orderStore.getStatusHistory(route.params.guid as string);
    orderStore.getFileStatus(route.params.guid as string);
  } catch (error) {
    onError(error as CustomError);
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => orderStore.statusHistory,
  () => {
    if (timer.value) {
      clearTimeout(timer.value);
      timer.value = null;
    }

    if (AUTO_STATUSES.includes(history.value[0].status.id)) {
      isAutoLoading.value = true;

      timer.value = setTimeout(() => {
        getStatusHistory();
        emit('update-order');
      }, 10000);
    } else {
      timer.value = null;
      isAutoLoading.value = false;
    }
  }
);

getStatusHistory();
</script>

<style scoped>
:deep(.p-timeline-event-opposite) {
  display: none;
}

:deep(.p-timeline-event-content) {
  padding-bottom: 2rem !important;
}

:deep(.p-timeline .p-timeline-event-marker) {
  border-width: 0.25rem;
}

:deep(.p-timeline .p-timeline-event-marker.p-timeline-event-danger) {
  border-color: #ea5455;
}

:deep(.p-timeline .p-timeline-event-marker.p-timeline-event-success) {
  border-color: #28c76f;
}

:deep(.p-timeline .p-timeline-event-marker.p-timeline-event-dark) {
  border-color: #4b4b4b;
}

:deep(.p-timeline .p-timeline-event-marker.p-timeline-event-warning) {
  border-color: #ff9f43;
}

:deep(p) {
  word-break: break-word;
}
</style>
