import { defineStore } from 'pinia';

import { getPrice, changePriceExpanse } from '@/app/price/shared/services/api';

import type { PriceItem } from '@/@types/price';
import type { ForwarderExpanse } from '@/@types/form-data';

interface PriceItemState {
  price: PriceItem;

  loading: boolean;
}

const usePriceItemStore = defineStore('price/item', {
  state: () =>
    ({
      price: {} as PriceItem,

      loading: false,
    } as PriceItemState),

  actions: {
    async getPrice(guid: string) {
      try {
        this.loading = true;

        this.price = await getPrice(guid);
      } finally {
        this.loading = false;
      }
    },

    async changePriceExpanse(guid: string, data: ForwarderExpanse) {
      try {
        this.loading = true;

        await changePriceExpanse(guid, data);
      } finally {
        this.loading = false;
      }
    },
  },
});

export default usePriceItemStore;
export type {};
