import { defineStore } from 'pinia';

import useTablesStore, { SUPPLIER_SUPPLY_DEFAULT_SORT } from '@/app/shared/store/tables-store';

import { getSupplies } from '@/app/supplier/shared/services/api';

import type { SupplyProduct, ActiveSwhProduct } from '@/@types/product';

interface SupplierSuppliesState {
  supplies: SupplyProduct[];

  total: number;
  loading: boolean;
}

const useSupplierSuppliesStore = defineStore('supplier/supplies', {
  state: () =>
    ({
      supplies: [],

      total: 25,
      loading: false,
    } as SupplierSuppliesState),

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
    async getSupplies(guid: string, hideLoader: boolean) {
      const tablesStore = useTablesStore();

      const isDefaultSort =
        !tablesStore.supplierSupplies.sort?.sortKey || !tablesStore.supplierSupplies.sort?.orderBy;
      const sort = isDefaultSort ? SUPPLIER_SUPPLY_DEFAULT_SORT : tablesStore.supplierSupplies.sort;

      const params = {
        page: tablesStore.supplierSupplies.page,
        perPage: tablesStore.supplierSupplies.perPage,
        ...sort,
        ...tablesStore.supplierSupplies.filters,
      };

      try {
        this.loading = !hideLoader;

        const data = await getSupplies(guid, params);

        this.supplies = data.data;
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

export default useSupplierSuppliesStore;
export type { SupplierSuppliesState };
