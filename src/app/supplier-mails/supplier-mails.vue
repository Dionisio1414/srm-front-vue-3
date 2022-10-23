<template>
  <base-template :tabs="SUPPLIER_MAILS_TABS" :exact="false">
    <template #title>
      {{ $t(`supplierMails.title`) }}
    </template>

    <template #default>
      <supplier-mails-list
        :data="supplierMailsStore.mails"
        :updated-filter="updatedFilter"
        @update-data="getData"
        @reset-filter="resetFilter"
      />
    </template>
  </base-template>
</template>

<script lang="ts" setup>
import SUPPLIER_MAILS_TABS from '@/app/supplier-mails/shared/config/tabs-constants';

import useSupplierMailsStore from '@/app/supplier-mails/shared/store/supplier-mails-store';
import useNotification from '@/app/shared/services/hooks/notifications';
import useTableClearFilters from '@/app/shared/services/hooks/table-clear-filters';

import { SUPPLIER_MAILS_DEFAULT_FILTERS } from '@/app/shared/store/tables-store';

import BaseTemplate from '@/app/shared/components/base-template.vue';
import SupplierMailsList from '@/app/supplier-mails/shared/components/supplier-mails-list.vue';

const supplierMailsStore = useSupplierMailsStore();
const { onError } = useNotification();

const { updatedFilter, clearFilterHandler } = useTableClearFilters({
  defaultFilters: SUPPLIER_MAILS_DEFAULT_FILTERS,
  defaultSchema: {},
  key: 'supplierMails',
});

const getData = (hideLoader = false) => {
  supplierMailsStore.getMailsList(hideLoader).catch((error) => onError(error));
};

const resetFilter = () => clearFilterHandler(getData.bind(null, false));

getData(Boolean(supplierMailsStore.mails.length));
</script>
