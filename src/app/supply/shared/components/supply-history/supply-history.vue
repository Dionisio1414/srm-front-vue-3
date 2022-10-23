<template>
  <div class="relative">
    <progress-bar
      v-if="isLoading"
      mode="indeterminate"
      class="absolute"
      style="top: 0; right: 0; left: 0; z-index: 1110; height: 0.5rem"
    />

    <block-ui :blocked="isLoading">
      <panel
        :header="$t('supply.statusHistory.title')"
        class="shadow-2"
        style="border-radius: 0.6rem"
      >
        <template #default>
          <timeline :value="history.slice(0, history.length > 2 ? sliceIndex : history.length)">
            <template #content="{ item, index }">
              <div class="flex align-items-baseline justify-content-between">
                <h4 class="mb-0" style="margin-top: -0.05rem">
                  {{ $t(`supply.statusHistory.statuses.${item.alias}`) }}
                </h4>

                <small>{{ formatDate(item.created_at, true) }}</small>
              </div>

              <supply-history-description :alias="item.alias" />

              <supply-history-actions
                v-if="index === 0"
                :alias="item.alias"
                :status="item.status"
                :scripts="item.status_scenario"
                @update-supply="$emit('update-supply')"
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
        </template>
      </panel>
    </block-ui>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useRoute } from 'vue-router';

import { library } from '@fortawesome/fontawesome-svg-core';

import { faAnglesDown, faAnglesUp } from '@fortawesome/free-solid-svg-icons';

import ProgressBar from 'primevue/progressbar';
import BlockUi from 'primevue/blockui';
import Panel from 'primevue/panel';
import Timeline from 'primevue/timeline';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import useSupplyStore from '@/app/supply/shared/store/supply-store';
import useNotification from '@/app/shared/services/hooks/notifications';
import useHistoryToggler from '@/app/order/shared/services/hooks/history-toggler';

import { formatDate } from '@/app/shared/services/helpers/table-helpers';

import SupplyHistoryDescription from '@/app/supply/shared/components/supply-history/supply-history-description.vue';
import SupplyHistoryActions from '@/app/supply/shared/components/supply-history/supply-history-actions.vue';

import type { CustomError } from '@/app/shared/services/hooks/notifications';

library.add(faAnglesDown, faAnglesUp);

defineEmits(['update-supply']);

const route = useRoute();
const supplyStore = useSupplyStore();
const { onError } = useNotification();
const { sliceIndex, changeSliceIndex } = useHistoryToggler();

const isLoading = ref(false);
const history = computed(() => supplyStore.statusHistory);

const getStatusHistory = async () => {
  isLoading.value = true;

  try {
    await supplyStore.getStatusHistory(route.params.guid as string);
  } catch (error) {
    onError(error as CustomError);
  } finally {
    isLoading.value = false;
  }
};

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
