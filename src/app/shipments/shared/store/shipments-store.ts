import { defineStore } from 'pinia';

import useTablesStore from '@/app/shared/store/tables-store';

import { getShipments, createShipment, changeStatus } from '@/app/shipments/shared/services/api';

import type { Shipments } from '@/@types/shipment';
import type { ShipmentsNew } from '@/@types/form-data';

interface ShipmentsState {
  shipments: Shipments[];

  total: number;
  loading: boolean;
  changeIndex: number | null;
}

const useShipmentsStore = defineStore('shipments', {
  state: () =>
    ({
      shipments: [],

      total: 20,
      loading: false,
      changeIndex: null,
    } as ShipmentsState),

  actions: {
    async getShipments(hideLoader: boolean) {
      const tablesStore = useTablesStore();

      const params = {
        page: tablesStore.shipments.page,
        onPage: tablesStore.shipments.perPage,
        ...tablesStore.shipments.filters,
      };

      try {
        this.loading = !hideLoader;

        const data = await getShipments(params);

        this.shipments = data.data;
        this.total = data.items_count;
      } finally {
        this.loading = false;
      }
    },

    async saveShipment(formData: ShipmentsNew) {
      await createShipment(formData);
    },

    async changeStatus(guid: string, index: number, status: string | number) {
      try {
        this.changeIndex = index;

        await changeStatus(guid, status);
        this.getShipments(false);
      } finally {
        this.changeIndex = null;
      }
    },
  },

  persist: {
    paths: ['shipments', 'total'],
  },
});

export default useShipmentsStore;
export type { ShipmentsState };
