<template>
  <button
    v-if="statuses.length"
    class="badge-item"
    :class="[`--is-${type}`, { '--is-active': isActive }]"
    type="button"
    :disabled="isLoading"
    @click="
      type !== 'planned' && statuses.length && $emit('update-filters', { statuses, type, isActive })
    "
  >
    <b>{{ count }}</b>

    {{ $t(`orders.titles.${type}`, { name: $t(`orders.titles.${$route.name}`) }) }}
  </button>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';

import useOrdersStore from '@/app/orders/shared/store/orders-store';

import type { StatisticsStatus } from '@/@types/additional';
import type { Type } from '@/app/orders/shared/services/hooks/badge-filters';

const props = defineProps({
  type: { type: String as PropType<Type>, required: true },
  statuses: { type: Array as PropType<StatisticsStatus[]>, required: true },
  badgeStatuses: {
    type: Object as PropType<{ [key: string]: StatisticsStatus[] }>,
    required: true,
  },
});

defineEmits(['update-filters']);

const ordersStore = useOrdersStore();

const isLoading = computed(() => ordersStore.loading);

const isActive = computed(
  () =>
    props.badgeStatuses[props.type]?.length &&
    props.badgeStatuses[props.type]?.length === props.statuses.length
);

const count = computed(() =>
  props.statuses.reduce((count: number, item: StatisticsStatus) => count + item.count, 0)
);
</script>

<style scoped>
.badge-item {
  padding: 0.375rem 0.875rem;
  font-size: 1.125rem;
  border-radius: var(--border-radius);
  opacity: 0.5;
}

.badge-item:disabled {
  cursor: wait;
}

.badge-item.--is-progress,
.badge-item.--is-planned {
  color: var(--indigo);
  background: var(--indigo-light);
}

.badge-item.--is-planned {
  cursor: default;
  opacity: 1;
}

.badge-item.--is-attention {
  color: var(--red);
  background: var(--red-light);
}

.badge-item.--is-delayed {
  color: var(--yellow);
  background: var(--yellow-light);
}

.badge-item.--is-good {
  color: var(--green);
  background: var(--green-light);
}

.badge-item.--is-active {
  opacity: 1;
}

.badge-item.--is-closed {
  background: var(--pink-light);
  color: var(--pink);
}
</style>
