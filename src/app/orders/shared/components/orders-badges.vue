<template>
  <orders-badge
    v-if="type === 'planned'"
    type="planned"
    :badge-statuses="badgeStatuses"
    :statuses="getStatuses(PLANNED_STATUSES)"
    style="margin-left: 1.25rem"
    @update-filters="$emit('update-filters', $event)"
  />

  <template v-else>
    <orders-badge
      type="progress"
      :badge-statuses="badgeStatuses"
      :statuses="getStatuses(type === 'drafts' ? DRAFTS_PROGRESS : ORDERS_PROGRESS)"
      style="margin-left: 1.25rem"
      @update-filters="$emit('update-filters', $event)"
    />

    <orders-badge
      type="attention"
      :badge-statuses="badgeStatuses"
      :statuses="getStatuses(type === 'drafts' ? DRAFTS_ATTENTION : ORDERS_ATTENTION)"
      style="margin-left: 1.25rem"
      @update-filters="$emit('update-filters', $event)"
    />

    <orders-badge
      type="delayed"
      :badge-statuses="badgeStatuses"
      :statuses="getStatuses(type === 'drafts' ? DRAFTS_DELAYED : ORDERS_DELAYED)"
      style="margin-left: 1.25rem"
      @update-filters="$emit('update-filters', $event)"
    />

    <orders-badge
      type="good"
      :badge-statuses="badgeStatuses"
      :statuses="getStatuses(type === 'drafts' ? DRAFTS_GOOD : ORDERS_GOOD)"
      style="margin-left: 1.25rem"
      @update-filters="$emit('update-filters', $event)"
    />

    <orders-badge
      type="closed"
      :badge-statuses="badgeStatuses"
      :statuses="getStatuses(ORDERS_CLOSED)"
      style="margin-left: 1.25rem"
      @update-filters="$emit('update-filters', $event)"
    />
  </template>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';

import useOrdersStore from '@/app/orders/shared/store/orders-store';
import useNotification from '@/app/shared/services/hooks/notifications';

import {
  PLANNED_STATUSES,
  ORDERS_PROGRESS,
  ORDERS_ATTENTION,
  ORDERS_DELAYED,
  ORDERS_GOOD,
  ORDERS_CLOSED,
  DRAFTS_PROGRESS,
  DRAFTS_ATTENTION,
  DRAFTS_DELAYED,
  DRAFTS_GOOD,
} from '@/app/orders/shared/config/statuses-constants';

import OrdersBadge from './orders-badge.vue';

import type { StatisticsStatus } from '@/@types/additional';
import type { OrdersType } from '@/app/orders/shared/services/hooks/badge-filters';

const props = defineProps({
  type: { type: String as PropType<OrdersType>, required: true },
  badgeStatuses: {
    type: Object as PropType<{ [key: string]: StatisticsStatus[] }>,
    required: true,
  },
});

defineEmits(['update-filters']);

const ordersStore = useOrdersStore();
const { onError } = useNotification();

const getStatuses = computed(() => ordersStore.statisticsStatuses);

ordersStore.getStatisticsStatuses(props.type).catch((error) => onError(error));
</script>
