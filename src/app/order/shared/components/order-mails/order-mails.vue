<template>
  <template v-if="isLoading || mailsHistory.length > 0">
    <progress-bar
      v-if="isLoading"
      mode="indeterminate"
      class="absolute"
      style="top: 0; right: 0; left: 0; z-index: 1110; height: 0.5rem"
    />

    <block-ui :blocked="isLoading" class="mt-4">
      <div class="overflow-hidden" :style="`max-height: ${isHidden ? '18rem' : 'auto'}`">
        <div ref="container">
          <order-mails-item v-for="item in mailsHistory" :key="item.guid" :data="item" />
        </div>
      </div>

      <button
        v-if="showButton"
        type="button"
        class="toggler-button flex justify-content-center w-full pt-2 pb-3"
        :class="{ '--is-active': !isHidden }"
        style="color: currentColor"
        @click="changeVisibility"
      >
        <font-awesome-icon :icon="isHidden ? 'angles-down' : 'angles-up'" size="2xl" />
      </button>
    </block-ui>
  </template>

  <div v-else class="mt-4 text-xl">{{ $t('order.titles.mailsNotSent') }}</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useRoute } from 'vue-router';

import { library } from '@fortawesome/fontawesome-svg-core';

import { faAnglesDown, faAnglesUp } from '@fortawesome/free-solid-svg-icons';

import ProgressBar from 'primevue/progressbar';
import BlockUi from 'primevue/blockui';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import useOrderStore from '@/app/order/shared/store/order-store';
import useNotification from '@/app/shared/services/hooks/notifications';
import useContentToggler from '@/app/order/shared/services/hooks/content-toggler';

import OrderMailsItem from './order-mails-item.vue';

import type { CustomError } from '@/app/shared/services/hooks/notifications';

library.add(faAnglesDown, faAnglesUp);

const route = useRoute();
const orderStore = useOrderStore();
const { onError } = useNotification();

const { container, isHidden, showButton, changeVisibility } = useContentToggler();

const isLoading = ref(false);
const mailsHistory = computed(() => orderStore.mailsHistory);

const getMailsHistory = async () => {
  try {
    isLoading.value = true;

    await orderStore.getMailsHistory(route.params.guid as string);
  } catch (error) {
    onError(error as CustomError);
  } finally {
    isLoading.value = false;
  }
};

getMailsHistory();
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

:deep(p) {
  word-break: break-word;
}

.toggler-button {
  position: relative;
  z-index: 1;
}

.toggler-button.--is-active::before {
  opacity: 0;
}

.toggler-button::before {
  position: absolute;
  top: -4rem;
  right: 0;
  left: 0;
  height: 4rem;
  content: '';
  pointer-events: none;
  background: linear-gradient(to top, var(--surface-0) 40%, rgba(255, 255, 255, 0));
}
</style>
