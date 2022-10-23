<template>
  <base-card-template>
    <template #header>
      <div class="flex align-items-center">
        <prime-button
          type="button"
          class="p-button-sm flex align-items-center justify-content-center p-0 mr-5"
          style="width: 2.1875rem; height: 1.5625rem; margin-top: 0.1875rem; min-width: 2.1875rem"
          @click="onBack"
        >
          <font-awesome-icon icon="arrow-left" />
        </prime-button>

        <h1 class="m-0 text-5xl min-w-max">
          {{ $t('orders.titles.order', { number: order.orderNumber }) }}
        </h1>

        <router-link
          v-if="order.factory?.guid"
          :to="{ name: 'supplier', params: { guid: order.factory?.guid } }"
          class="max-w-max mx-5 overflow-hidden no-underline text-2xl font-semibold white-space-nowrap text-overflow-ellipsis"
          style="color: var(--text-color)"
        >
          {{ order.factory?.name ? ` ${order.factory?.name}` : ` ${order.factory?.jurName}` }}
        </router-link>

        <prime-button
          type="button"
          :label="$t('parsing.buttons.compare')"
          class="p-button-success p-button-outlined w-10rem ml-auto min-w-max"
          :disabled="isDataEditing || generationAvailable"
          @click="onOpen()"
        />

        <template
          v-if="
            (userHasRole('administrator') && changeAllowed(order.status?.id)) ||
            (userHasRole('operator_lead') && changeAllowed(order.status?.id)) ||
            (userHasRole('operator') && operatorChangeAllowed(order.status?.id))
          "
        >
          <prime-button
            type="button"
            :label="isDataEditing ? $t('order.cancelEditData') : $t('order.editData')"
            class="p-button-outlined ml-3 min-w-max"
            @click="changeEditingStatus"
          />

          <prime-button
            type="button"
            :label="$t('order.saveData')"
            :disabled="!isDataEditing || !generationAvailable"
            class="ml-3 min-w-max"
            :loading="isLoading"
            @click="onSave"
          />
        </template>
      </div>

      <divider align="left">
        <span class="p-tag">
          {{ $t(`orders.titles.${isDraft ? 'draft' : isOrder ? 'orderDivider' : 'planned'}`) }}
        </span>
      </divider>
    </template>

    <template #content>
      <order-info
        :disabled="isLoading"
        :data="formData.orderInfo || {}"
        :editing-allowed="
          (changeAllowed(order.status?.id) && isDataEditing) ||
          (operatorChangeAllowed(order.status?.id) && isDataEditing)
        "
        @update-data="updateData({ key: 'orderInfo', ...$event })"
      />

      <order-table
        class="mt-7"
        :data="productsData"
        :disabled="isLoading"
        :delete-disabled="deleteDisabled"
        :clear-editing-rows="clearEditingRows"
        :editing-allowed="
          (changeAllowed(order.status?.id) && isDataEditing) ||
          (operatorChangeAllowed(order.status?.id) && isDataEditing)
        "
        @delete-data="onDelete($event)"
        @update-data="updateProductsData($event)"
        @change-editing-products="changeEditingProducts"
      />

      <order-note
        class="mt-6"
        :disabled="isLoading"
        :form-data="formData"
        :editing-allowed="
          (changeAllowed(order.status?.id) && isDataEditing) ||
          (operatorChangeAllowed(order.status?.id) && isDataEditing)
        "
        @update-data="updateData"
        @update-ports-data="updatePortsData"
        @update-delay-data="updateData"
      />
    </template>

    <template #sidebar>
      <order-files :edited="isDataEditing || generationAvailable" />

      <order-history
        :edited="isDataEditing || generationAvailable"
        class="mt-4"
        @update-order="getOrder"
      />
    </template>
  </base-card-template>

  <error-modal
    :visibility="modalVisibility"
    @change-visibility="($event) => (modalVisibility = $event)"
    @go-back="onBack"
  />

  <parsing-modal
    v-if="!updated"
    :visibility="modalState"
    type="compare"
    @close-modal="onClose(forceUpdate)"
    @callback="() => {}"
  />
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount } from 'vue';

import { useRouter } from 'vue-router';

import { library } from '@fortawesome/fontawesome-svg-core';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import PrimeButton from 'primevue/button';
import Divider from 'primevue/divider';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import useLoginStore from '@/app/login/shared/store/login-store';
import useOrderStore from '@/app/order/shared/store/order-store';
import useOrderLoader from '@/app/order/shared/services/hooks/order-loader';
import useDataEditing from '@/app/order/shared/services/hooks/data-editing';
import useForceUpdate from '@/app/shared/services/hooks/force-update';
import useBeforeLeave from '@/app/shared/services/hooks/before-leave';
import useModal from '@/app/shared/services/hooks/modal';
import useAccessByRole from '@/app/shared/services/hooks/access-by-role';

import BaseCardTemplate from '@/app/shared/components/base-card-template.vue';
import OrderInfo from '@/app/order/shared/components/order-info.vue';
import OrderTable from '@/app/order/shared/components/order-table.vue';
import OrderNote from '@/app/order/shared/components/order-note/index.vue';
import OrderFiles from '@/app/order/shared/components/order-files/order-files.vue';
import OrderHistory from '@/app/order/shared/components/order-history.vue';
import ErrorModal from '@/app/order/shared/components/modals/error-modal.vue';
import ParsingModal from '@/app/shared/components/parsing/parsing-modal.vue';

library.add(faArrowLeft);

const router = useRouter();
const loginStore = useLoginStore();
const orderStore = useOrderStore();
const { updated, forceUpdate } = useForceUpdate();
const { modalState, onOpen, onClose } = useModal();

const userHasRole = computed(() => loginStore.userHasRole);
const changeAllowed = computed(() => orderStore.changedAllowed);
const operatorChangeAllowed = computed(() => orderStore.changedAllowedForOperator);

const { modalVisibility, errorCallback } = useAccessByRole();

const { order, isDraft, isPlanned, isOrder, getInfo, getOrder, getProducts } =
  useOrderLoader(errorCallback);

const {
  formData,
  isLoading,
  deleteDisabled,
  generationAvailable,
  isDataEditing,
  clearEditingRows,
  productsData,
  onSave,
  onDelete,
  changeEditingStatus,
  updateData,
  updateProductsData,
  changeEditingProducts,
  updatePortsData,
} = useDataEditing(async () => {
  await getInfo();
  await getOrder();
  await getProducts();
});

const onBack = () => {
  if (isOrder.value) router.push({ name: 'orders-list' });
  else if (isDraft.value) router.push({ name: 'drafts-list' });
  else if (isPlanned.value) router.push({ name: 'planned-list' });
  else router.push({ name: 'orders-list' });
};

const condition = computed(() => isDataEditing.value || generationAvailable.value);
useBeforeLeave(condition);

getOrder();
getProducts();

onBeforeUnmount(() => {
  orderStore.$patch((state) => {
    state.filesStatus = [];
  });
});
</script>
