import { defineStore } from 'pinia';

import useTablesStore from '@/app/shared/store/tables-store';

import type { Forwarder, ForwarderItem } from '@/@types/forwarder';
import type { ForwarderData } from '@/@types/form-data';

import { getForwarders, getForwarder, createForwarder } from '@/app/forwarders/shared/services/api';

interface ForwardersState {
  forwarders: Forwarder[];
  forwarder: ForwarderItem;
  info: ForwarderData;

  total: number;
  loading: boolean;
}

const useForwardersStore = defineStore('forwarders', {
  state: () =>
    ({
      forwarders: [],
      forwarder: {} as ForwarderItem,
      info: {} as ForwarderData,

      total: 25,
      loading: false,
    } as ForwardersState),

  actions: {
    async getForwarders(hideLoader: boolean) {
      const tablesStore = useTablesStore();

      const params = {
        page: tablesStore.forwarders.page,
        per_page: tablesStore.forwarders.perPage,
        is_deleted: tablesStore.forwarders.filters.is_deleted,
        search: tablesStore.forwarders.filters.search || null,
      };

      try {
        this.loading = !hideLoader;

        const data = await getForwarders(params);

        this.forwarders = data.data;
        this.total = data.items_count;
      } finally {
        this.loading = false;
      }
    },

    async getForwarder(guid: string) {
      this.forwarder = await getForwarder(guid);
    },

    async createForwarder(formData: ForwarderData) {
      await createForwarder(formData);
    },
  },

  persist: {
    paths: ['forwarders', 'total'],
  },
});

export default useForwardersStore;
export type { ForwardersState };
