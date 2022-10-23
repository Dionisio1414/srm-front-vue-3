import { defineStore } from 'pinia';

import useTablesStore from '@/app/shared/store/tables-store';

import { getShipments } from '@/app/supplier/shared/services/api';

import type { Shipments } from '@/@types/shipment';

interface SupplierSupplyState {
  shipments: Shipments[];

  total: number;
  loading: boolean;
}

const useSupplierShipmentsStore = defineStore('supplier/shipments', {
  state: () =>
    ({
      shipments: [],

      total: 25,
      loading: false,
    } as SupplierSupplyState),

  actions: {
    async getShipments(guid: string, hideLoader: boolean) {
      const tablesStore = useTablesStore();

      const params = {
        supplier: guid,
        page: tablesStore.supplierShipments.page,
        onPage: tablesStore.supplierShipments.perPage,
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
  },

  persist: {
    paths: ['supplies', 'total'],
  },
});

export default useSupplierShipmentsStore;
export type { SupplierSupplyState };
