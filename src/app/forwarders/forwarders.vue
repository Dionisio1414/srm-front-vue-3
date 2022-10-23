<template>
  <base-template
    :tabs="FORWARDERS_TABS"
    :exact="false"
    :is-back="$route.name === 'forwarder-edit' || $route.name === 'forwarder-create'"
    @back="() => $router.push('/forwarders')"
  >
    <template #title>
      <div class="flex align-items-center">
        {{
          ($route.name === 'forwarders-list' && $t(`forwarder.titles.forwarder`)) ||
          ($route.name === 'forwarder-edit' && $t(`forwarder.titles.editForwarder`)) ||
          ($route.name === 'forwarder-create' && $t(`forwarder.titles.createForwarder`))
        }}

        <prime-button
          v-if="forwardersStore.forwarder.deleted_at && $route.name === 'forwarder-edit'"
          :label="$t('forwarder.buttons.deleted')"
          class="p-button-sm pointer-events-none ml-3 uppercase"
          style="padding: 0.18rem 0.5rem 0.15rem"
        />
      </div>
    </template>

    <template #default>
      <router-view />
    </template>
  </base-template>
</template>

<script lang="ts" setup>
import PrimeButton from 'primevue/button';

import useForwardersStore from '@/app/forwarders/shared/store/forwarders-store';

import FORWARDERS_TABS from '@/app/forwarders/shared/config/tabs-constants';

import BaseTemplate from '@/app/shared/components/base-template.vue';

const forwardersStore = useForwardersStore();
</script>
