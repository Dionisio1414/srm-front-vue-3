<template>
  <base-template :tabs="BASE_TABS" :default-navigation="false">
    <template #title>
      {{ $t('supplies.titles.supplies') }}
    </template>

    <template #side-element>
      <prime-button
        type="button"
        :label="$t('parsing.buttons.createSupply')"
        class="p-button-success p-button-outlined mr-5 white-space-nowrap"
        @click="onOpen()"
      />
    </template>

    <template #default>
      <supplies-table
        :updated-filter="updatedFilter"
        @update-data="getSupplies"
        @reset-filter="resetFilter"
      />
    </template>
  </base-template>

  <parsing-modal
    v-if="!updated"
    :visibility="modalState"
    type="supplies"
    @close-modal="onClose(forceUpdate)"
    @callback="
      () => {
        getSupplies();
      }
    "
  />
</template>

<script lang="ts" setup>
import PrimeButton from 'primevue/button';

import useSuppliesStore from '@/app/supplies/shared/store/supplies-store';
import useInfoStore from '@/app/shared/store/info-store';
import useNotification from '@/app/shared/services/hooks/notifications';
import useTableClearFilters from '@/app/shared/services/hooks/table-clear-filters';
import useForceUpdate from '@/app/shared/services/hooks/force-update';
import useModal from '@/app/shared/services/hooks/modal';
import useAccessByRole from '@/app/shared/services/hooks/access-by-role';

import BaseTemplate from '@/app/shared/components/base-template.vue';
import SuppliesTable from '@/app/supplies/shared/components/supplies-table.vue';
import ParsingModal from '@/app/shared/components/parsing/parsing-modal.vue';

import BASE_TABS from '@/app/supplies/shared/config/tabs-constants';
import { Supplies } from '@/@types/supplies';
import { SUPPLIES_DEFAULT_FILTERS } from '@/app/shared/store/tables-store';

import type { CustomError } from '@/app/shared/services/hooks/notifications';

const suppliesStore = useSuppliesStore();
const infoStore = useInfoStore();
const { onError } = useNotification();
const { updated, forceUpdate } = useForceUpdate();
const { modalState, onOpen, onClose } = useModal();

const { updatedFilter, clearFilterHandler } = useTableClearFilters({
  defaultFilters: SUPPLIES_DEFAULT_FILTERS,
  defaultSchema: {},
  key: 'suppliesList',
});

const { errorCallback } = useAccessByRole();

const getSupplies = async (hideLoader = false): Promise<void> => {
  try {
    await suppliesStore.getSupplies({ hideLoader });

    const supplyGuids = suppliesStore.supplies.map((item: Supplies) => item.guid) as string[];

    await infoStore.getSuppliesOrders({ supplyGuids });
  } catch (error) {
    onError(error as CustomError, errorCallback);
  }
};

const resetFilter = () => clearFilterHandler(getSupplies.bind(null, false));

infoStore.getSupplyStatuses().catch((error) => onError(error));
getSupplies(Boolean(suppliesStore.supplies.length));
</script>
