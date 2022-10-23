<template>
  <div class="grid p-5 m-0">
    <base-info
      v-if="Object.keys(forwardersStore.forwarder).length"
      :data="forwardersStore.forwarder"
      class="col-10 flex-grow-1 p-0 m-2"
      @update-data="updateData"
    />

    <div class="col-4">
      <legal-info
        v-if="forwardersStore.forwarder.legal_information"
        :data="forwardersStore.forwarder.legal_information"
        class="mt-4"
        @update-data="updateData(true)"
      />
    </div>

    <div class="col-4">
      <service-info
        v-if="forwardersStore.forwarder.service && !updated"
        class="mt-4"
        :data="forwardersStore.forwarder.service"
        :notes="forwardersStore.forwarder.area_notes || ''"
        @update-data="updateData(true)"
      />
    </div>

    <div class="col-4">
      <contact-info
        v-if="forwardersStore.forwarder.contact && !updated"
        class="mt-4"
        :data="forwardersStore.forwarder.contact"
        @update-data="updateData(true)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

import useInfoStore from '@/app/shared/store/info-store';
import useForwardersStore from '@/app/forwarders/shared/store/forwarders-store';
import useNotification from '@/app/shared/services/hooks/notifications';
import useForceUpdate from '@/app/shared/services/hooks/force-update';

import BaseInfo from '@/app/forwarders/shared/components/forwarders-edit/base-info.vue';
import LegalInfo from '@/app/forwarders/shared/components/forwarders-edit/legal-info.vue';
import ServiceInfo from '@/app/forwarders/shared/components/forwarders-edit/service-info.vue';
import ContactInfo from '@/app/forwarders/shared/components/forwarders-edit/contact-info.vue';

import type { ForwarderItem } from '@/@types/forwarder';

const route = useRoute();
const infoStore = useInfoStore();
const forwardersStore = useForwardersStore();

const { onCustomError } = useNotification();
const { updated, forceUpdate } = useForceUpdate();

const updateData = async (force = false) => {
  await forwardersStore
    .getForwarder(route.params.guid as string)
    .catch((error) => onCustomError(error));

  if (force) forceUpdate();
};

forwardersStore.$patch((state) => {
  state.forwarder = {} as ForwarderItem;
});

updateData();

infoStore.getAllCountries().catch((error) => onCustomError(error));
</script>
