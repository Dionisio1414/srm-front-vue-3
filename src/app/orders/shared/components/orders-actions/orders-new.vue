<template>
  <prime-button
    class="p-button-outlined p-button-success"
    :label="$t('orders.actions.new.newLabel')"
    :disabled="loading"
    @click="onOpen"
  />
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import { useConfirm } from 'primevue/useconfirm';
import PrimeButton from 'primevue/button';

defineProps({
  loading: { type: Boolean, required: true },
});

const confirm = useConfirm();
const { t } = useI18n();

const emit = defineEmits(['change-status']);

const onOpen = () => {
  confirm.require({
    message: t('orders.actions.new.leaveMessage'),
    header: t('orders.leaveHeader'),
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: t('orders.leaveAccept'),
    rejectLabel: t('orders.leaveReject'),

    accept: () => {
      emit('change-status', {
        status_id: 1,
        comment: '',
      });
    },
  });
};
</script>
