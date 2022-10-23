<template>
  <base-template
    :tabs="tabs"
    :is-back="!!$route.query.supplyGuid"
    @back="() => $router.push(`/supply/${$route.query.supplyGuid}`)"
  >
    <template #title>
      {{ `${$t('supplier.title')} ${name || ''} ` }}
    </template>

    <template #side-element>
      <div class="flex align-item-center">
        <prime-button
          v-if="!$route.query.supplyGuid"
          type="button"
          :label="$t('parsing.buttons.createSupply')"
          class="p-button-success p-button-outlined mr-5 white-space-nowrap"
          @click="onOpen()"
        />

        <div
          v-if="
            !$route.query.supplyGuid &&
            (userHasRole('administrator') || userHasRole('operator_lead'))
          "
          class="field-checkbox mb-0"
          :style="isLoading ? 'cursor: wait;' : ''"
        >
          <input-switch
            id="reliableSupplier"
            :model-value="isReliable"
            :style="isLoading ? 'pointer-events: none;' : ''"
            @input="onChangeReliableMark"
          />

          <label
            for="reliableSupplier"
            class="ml-3 text-2xl"
            :style="
              isLoading
                ? 'margin-bottom: 0.2rem; pointer-events: none;'
                : 'margin-bottom: 0.2rem; cursor: pointer;'
            "
          >
            {{ $t('supplier.reliableMark') }}
          </label>
        </div>
      </div>
    </template>

    <template #default>
      <router-view />
    </template>
  </base-template>

  <parsing-modal
    v-if="!updated"
    :visibility="modalState"
    type="supplier"
    @close-modal="onClose(forceUpdate)"
    @callback="
      () => {
        getProducts();
      }
    "
  />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useRoute } from 'vue-router';

import InputSwitch from 'primevue/inputswitch';
import PrimeButton from 'primevue/button';

import useLoginStore from '@/app/login/shared/store/login-store';
import useSupplierStore from '@/app/supplier/shared/store/supplier-store';
import useSuppliesStore from '@/app/supplier/shared/store/supplier-supplies-store';
import useNotification from '@/app/shared/services/hooks/notifications';
import useForceUpdate from '@/app/shared/services/hooks/force-update';
import useModal from '@/app/shared/services/hooks/modal';

import SUPPLIER_TABS from '@/app/supplier/shared/config/tabs-constants';
import { changeReliableMark } from '@/app/supplier/shared/services/api';

import BaseTemplate from '@/app/shared/components/base-template.vue';
import ParsingModal from '@/app/shared/components/parsing/parsing-modal.vue';

import type { CustomError } from '@/app/shared/services/hooks/notifications';
import type { BaseTabs } from '@/@types/additional';

const route = useRoute();
const loginStore = useLoginStore();
const supplierStore = useSupplierStore();
const suppliesStore = useSuppliesStore();
const { onCustomError } = useNotification();
const { updated, forceUpdate } = useForceUpdate();
const { modalState, onOpen, onClose } = useModal();

const isLoading = ref(false);
const isReliable = computed(() => supplierStore.factory?.is_reliable_supplier);
const userHasRole = computed(() => loginStore.userHasRole);

const name = computed(() => supplierStore.factory?.name);
const tabs = computed(() => {
  if (route.query.supplyGuid) {
    return SUPPLIER_TABS.filter((item: BaseTabs) => item.to.name === 'supplier-swh');
  }

  return SUPPLIER_TABS;
});

const getFactoryInfo = () => {
  supplierStore.getFactoryInfo(route.params.guid as string).catch((error) => onCustomError(error));
};

const onChangeReliableMark = async (isReliable: boolean) => {
  try {
    isLoading.value = true;

    await changeReliableMark(route.params.guid as string, isReliable);

    supplierStore.setReliableMark(isReliable);
  } catch (error) {
    onCustomError(error as CustomError);
  } finally {
    isLoading.value = false;
  }
};

const getProducts = (hideLoader = false) => {
  suppliesStore
    .getSupplies(route.params.guid as string, hideLoader)
    .catch((error) => onCustomError(error));
};

getFactoryInfo();
</script>
