import { defineStore } from 'pinia';

import useTablesStore, { SUPPLIER_MAILS_DEFAULT_SORT } from '@/app/shared/store/tables-store';

import { getMailsList } from '@/app/supplier-mails/shared/services/api';

import type { SupplierMails } from '@/@types/mails';

interface SupplierMailsState {
  mails: SupplierMails[];

  total: number;
  loading: boolean;
}

const useSupplierMails = defineStore('supplier-mails', {
  state: () =>
    ({
      mails: [],

      total: 20,
      loading: false,
    } as SupplierMailsState),

  actions: {
    async getMailsList(hideLoader: boolean) {
      const tablesStore = useTablesStore();

      const isDefaultSort =
        !tablesStore.supplierMails.sort?.sortKey || !tablesStore.supplierMails.sort?.orderBy;
      const sort = isDefaultSort ? SUPPLIER_MAILS_DEFAULT_SORT : tablesStore.supplierMails.sort;

      const params = {
        page: tablesStore.supplierMails.page,
        perPage: tablesStore.supplierMails.perPage,
        sort_key: sort?.sortKey,
        order: sort?.orderBy,
        query: tablesStore.supplierMails.filters.search,
      };

      try {
        this.loading = !hideLoader;

        const data = await getMailsList(params);

        this.mails = data.data;
        this.total = data.items_count;
      } finally {
        this.loading = false;
      }
    },

    updateMailsData({ isMailApproved, index }: { isMailApproved: boolean; index: number }) {
      this.mails[index] = { ...this.mails[index], isMailApproved };
    },
  },

  persist: {
    paths: ['mails', 'total'],
  },
});

export default useSupplierMails;
export type { SupplierMailsState };
