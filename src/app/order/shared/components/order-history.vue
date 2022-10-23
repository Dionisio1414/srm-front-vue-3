<template>
  <div class="relative">
    <block-ui :blocked="edited">
      <panel :header="$t('order.titles.history')">
        <tab-view lazy>
          <tab-panel :header="$t('order.titles.statusHistory')">
            <order-statuses @update-order="$emit('update-order')" />
          </tab-panel>

          <tab-panel :header="$t('order.titles.changesHistory')">
            <order-changes />
          </tab-panel>

          <tab-panel :header="$t('order.titles.changesProductHistory')">
            <order-products-changes />
          </tab-panel>

          <tab-panel :header="$t('order.titles.mails')">
            <order-mails />
          </tab-panel>
        </tab-view>
      </panel>
    </block-ui>
  </div>
</template>

<script lang="ts" setup>
import BlockUi from 'primevue/blockui';
import Panel from 'primevue/panel';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

import OrderStatuses from './order-statuses/order-statuses.vue';
import OrderChanges from './order-changes/order-changes.vue';
import OrderProductsChanges from './order-changes/order-products-changes.vue';
import OrderMails from './order-mails/order-mails.vue';

defineProps({
  edited: { type: Boolean, required: true },
});

defineEmits(['update-order']);
</script>
