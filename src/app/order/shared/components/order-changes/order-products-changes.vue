<template>
  <template v-if="isLoading || changesArr.length >= 1">
    <progress-bar
      v-if="isLoading"
      mode="indeterminate"
      class="absolute"
      style="top: 0; right: 0; left: 0; z-index: 1110; height: 0.5rem"
    />

    <block-ui :blocked="isLoading" class="mt-4">
      <div class="overflow-hidden" :style="`max-height: ${isHidden ? '18rem' : 'auto'}`">
        <div ref="container">
          <timeline :value="changesArr">
            <template #content="{ item }">
              <h4 class="mt-0 mb-3">
                {{ $t('order.titles.article', { guid: item[0].article_no }) }}
              </h4>

              <template v-for="(data, index) in item" :key="index">
                <order-changes-item
                  v-if="item[index + 1]"
                  type="products"
                  :current="data"
                  :previous="item[index + 1]"
                />
              </template>
            </template>
          </timeline>
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

  <div v-else class="mt-4 text-xl">{{ $t('order.titles.productsNotChanged') }}</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';

import { faAnglesDown, faAnglesUp } from '@fortawesome/free-solid-svg-icons';

import ProgressBar from 'primevue/progressbar';
import BlockUi from 'primevue/blockui';
import Timeline from 'primevue/timeline';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import useContentToggler from '@/app/order/shared/services/hooks/content-toggler';
import useGetHistory from '@/app/order/shared/services/hooks/get-history';

import OrderChangesItem from '@/app/order/shared/components/order-changes/order-changes-item.vue';

library.add(faAnglesDown, faAnglesUp);

const { container, isHidden, showButton, changeVisibility } = useContentToggler();
const { isLoading, productsChanges, getChangesHistory } = useGetHistory();

const changesArr = computed(() =>
  Object.values(productsChanges.value).filter((products) => products.length > 1)
);

getChangesHistory('products');
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
  background: linear-gradient(to top, var(--surface-f) 40%, rgba(255, 255, 255, 0));
}
</style>
