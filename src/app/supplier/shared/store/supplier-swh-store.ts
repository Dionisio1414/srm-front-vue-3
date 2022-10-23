import { defineStore } from 'pinia';

import useTablesStore from '@/app/shared/store/tables-store';

import { getSwh } from '@/app/supplier/shared/services/api';

import type { SwhProduct, ActiveSwhProduct } from '@/@types/product';

interface SupplierSwhState {
  products: SwhProduct[];

  total: number;
  loading: boolean;
}

const useSupplierSwhStore = defineStore('supplier/swh', {
  state: () =>
    ({
      products: [],

      total: 25,
      loading: false,
    } as SupplierSwhState),

  getters: {
    showQuantity() {
      return (active: ActiveSwhProduct[], guid: string) =>
        active.map((item) => item.swhGuid).includes(guid);
    },

    quantity() {
      return (active: ActiveSwhProduct[], guid: string) =>
        active.find((item) => item.swhGuid === guid)?.amount || '';
    },
  },

  actions: {
    async getSwhProducts(guid: string, hideLoader: boolean) {
      const tablesStore = useTablesStore();

      const params = {
        page: tablesStore.supplierSwh.page,
        per_page: tablesStore.supplierSwh.perPage,
        search: tablesStore.supplierSwh.filters.search || null,
      };

      try {
        this.loading = !hideLoader;

        const data = await getSwh(guid, params);

        this.products = data.data;
        this.total = data.items_count;
      } finally {
        this.loading = false;
      }
    },
  },

  persist: {
    paths: ['supplies', 'total'],
  },
});

export default useSupplierSwhStore;
export type { SupplierSwhState };
