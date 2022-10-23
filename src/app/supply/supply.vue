<template>
  <base-card-template>
    <template #header>
      <div class="flex align-items-center mb-8">
        <prime-button
          type="button"
          class="p-button-sm flex align-items-center justify-content-center p-0 mr-5"
          style="width: 2.1875rem; height: 1.5625rem; margin-top: 0.1875rem"
          @click="$router.push(`/supplier/${supply.factory?.guid}/supplies`)"
        >
          <font-awesome-icon icon="arrow-left" />
        </prime-button>

        <h1 class="m-0 text-5xl">
          {{ $t('supplies.titles.supply', { number: supply.supplyNumber }) }}
        </h1>

        <router-link
          v-if="supply.factory?.guid"
          :to="{ name: 'supplier', params: { guid: supply.factory?.guid } }"
          class="ml-5 no-underline text-2xl font-semibold"
          style="color: var(--text-color)"
        >
          {{ supply.factory?.jurName ? ` ${supply.factory?.jurName}` : ` ${supply.factory?.name}` }}
        </router-link>

        <prime-button
          v-if="isAddSupply"
          type="button"
          :label="$t('parsing.buttons.addSupply')"
          class="p-button-warning p-button-outlined ml-auto white-space-nowrap"
          @click="onOpen()"
        />

        <prime-button
          v-if="isAddSupply"
          type="button"
          :label="$t('parsing.buttons.compare')"
          class="p-button-success p-button-outlined ml-3 white-space-nowrap"
          @click="onOpenCompare()"
        />
      </div>
    </template>

    <template #content>
      <supply-info class="mb-7" @update-supply="getSupply" />

      <supply-links class="mb-7" />

      <h2 class="text-xl ml-4 mb-3 mt-0">{{ $t('supplies.titles.articles') }}</h2>

      <articles-table
        @update-data="
          () => {
            getSupplyProducts();
            getSupply();
            getSupplyOrders();
          }
        "
      />
    </template>

    <template #sidebar>
      <supply-files />

      <supply-history
        class="mt-6"
        @update-supply="
          {
            getSupplyProducts();
            getSupply();
            getSupplyOrders();
          }
        "
      />
    </template>
  </base-card-template>

  <parsing-modal
    v-if="!updated"
    :visibility="modalState"
    type="supply"
    @close-modal="onClose(forceUpdate)"
    @callback="
      () => {
        getSupply();
        getSupplyProducts();
        getSupplyOrders();
      }
    "
  />

  <parsing-modal
    v-if="!updated"
    :visibility="compareModalState"
    type="compareSupply"
    @close-modal="onCloseCompare(forceUpdate)"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useRoute } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import PrimeButton from 'primevue/button';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import useSupplyStore from '@/app/supply/shared/store/supply-store';
import useNotification from '@/app/shared/services/hooks/notifications';
import useForceUpdate from '@/app/shared/services/hooks/force-update';
import useModal from '@/app/shared/services/hooks/modal';
import useAccessByRole from '@/app/shared/services/hooks/access-by-role';

import BaseCardTemplate from '@/app/shared/components/base-card-template.vue';
import ArticlesTable from '@/app/supply/shared/components/articles-table.vue';
import SupplyFiles from '@/app/supply/shared/components/supply-files/supply-files.vue';
import SupplyHistory from '@/app/supply/shared/components/supply-history/supply-history.vue';
import SupplyLinks from '@/app/supply/shared/components/supply-links/supply-links.vue';
import SupplyInfo from '@/app/supply/shared/components/supply-info/supply-info.vue';
import ParsingModal from '@/app/shared/components/parsing/parsing-modal.vue';

library.add(faArrowLeft);

const route = useRoute();
const supplyStore = useSupplyStore();

const { onCustomError } = useNotification();
const { errorCallback } = useAccessByRole();
const { updated, forceUpdate } = useForceUpdate();
const { modalState, onOpen, onClose } = useModal();
const {
  modalState: compareModalState,
  onOpen: onOpenCompare,
  onClose: onCloseCompare,
} = useModal();

const supply = computed(() => supplyStore.supply);
const isAddSupply = computed(() => supply.value?.status?.alias !== 'canceled');

const getSupply = () => {
  supplyStore
    .getSupply(route.params.guid as string)
    .catch((error) => onCustomError(error, errorCallback));
};

const getSupplyProducts = () => {
  supplyStore.getProducts(route.params.guid as string).catch((error) => onCustomError(error));
};

const getSupplyOrders = () => {
  supplyStore.getSupplyOrders(route.params.guid as string).catch((error) => onCustomError(error));
};

getSupply();
getSupplyProducts();
getSupplyOrders();
</script>
