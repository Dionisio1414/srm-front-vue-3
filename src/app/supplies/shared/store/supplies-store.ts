import { defineStore } from 'pinia';

import useTablesStore, { SUPPLIES_DEFAULT_SORT } from '@/app/shared/store/tables-store';

import { getSuppliesList } from '@/app/supplies/shared/services/api';

import type { Supplies } from '@/@types/supplies';

interface SuppliesState {
  supplies: Supplies[];

  total: number | string;
  loading: boolean;
}

const useSuppliesStore = defineStore('supplies', {
  state: () =>
    ({
      supplies: [],

      total: 25,
      loading: false,
    } as SuppliesState),

  actions: {
    async getSupplies({ hideLoader }: { hideLoader: boolean }) {
      const tablesStore = useTablesStore();

      const isDefaultSort =
        !tablesStore.suppliesList.sort?.sortKey || !tablesStore.suppliesList.sort?.orderBy;
      const sort = isDefaultSort ? SUPPLIES_DEFAULT_SORT : tablesStore.suppliesList.sort;

      const params = {
        page: tablesStore.suppliesList.page,
        perPage: tablesStore.suppliesList.perPage,
        ...sort,
        ...tablesStore.suppliesList.filters,
      };

      try {
        this.loading = !hideLoader;

        const data = await getSuppliesList(params);

        this.supplies = data.data;
        this.total = data.items_count;
      } finally {
        this.loading = false;
      }
    },
  },
});

export default useSuppliesStore;
export type { SuppliesState };
