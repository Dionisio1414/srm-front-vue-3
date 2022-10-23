<template>
  <forwarders-table :data-loading="isLoading" @update-data="updateData" />
</template>

<script lang="ts" setup>
import useForwardersStore from '@/app/forwarders/shared/store/forwarders-store';
import useNotification from '@/app/shared/services/hooks/notifications';

import ForwardersTable from '@/app/forwarders/shared/components/forwarders-table.vue';
import { ref } from 'vue';

const forwardersStore = useForwardersStore();
const { onCustomError } = useNotification();

const isLoading = ref(false);

const updateData = async (hideLoader = false) => {
  isLoading.value = true;

  forwardersStore
    .getForwarders(hideLoader)
    .catch((error) => onCustomError(error))
    .finally(() => {
      isLoading.value = false;
    });
};

updateData(Boolean(forwardersStore.forwarders.length));
</script>
