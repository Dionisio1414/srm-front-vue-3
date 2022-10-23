import { defineStore } from 'pinia';

import useTablesStore from '@/app/shared/store/tables-store';

import { getPrices } from '@/app/price/shared/services/api';

import type { Price } from '@/@types/price';

interface PriceListState {
  prices: Price[];

  total: number;
  loading: boolean;
}

const usePricesListStore = defineStore('price/list', {
  state: () =>
    ({
      prices: [],

      total: 25,
      loading: false,
    } as PriceListState),

  actions: {
    async getPrices(hideLoader: boolean) {
      const tablesStore = useTablesStore();

      const params = {
        page: tablesStore.priceList.page,
        perPage: tablesStore.priceList.perPage,
        ...tablesStore.priceList.filters,
      };

      try {
        this.loading = !hideLoader;

        const data = await getPrices(params);

        this.prices = data.data;
        this.total = data.items_count;
      } finally {
        this.loading = false;
      }
    },
  },

  persist: {
    paths: ['prices', 'total'],
  },
});

export default usePricesListStore;
export type { PriceListState };
