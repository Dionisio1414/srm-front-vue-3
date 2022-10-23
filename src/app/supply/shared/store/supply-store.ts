import { defineStore } from 'pinia';
import cloneDeep from 'lodash.clonedeep';

import {
  getSupply,
  getProducts,
  deleteProduct,
  getFiles,
  addFile,
  deleteFile,
  getStatusHistory,
  getSupplyOrders,
} from '@/app/supply/shared/services/api';

import { STATUSES_NOT_ROLLBACK } from '@/app/supply/shared/config/history-statuses-constants';

import type { Supply, SupplyProducts, StatusHistory, SupplyOrders } from '@/@types/supply';
import type { SupplyFiles, FileInner } from '@/@types/additional';

interface SupplyState {
  supply: Supply;
  products: SupplyProducts[];
  supplyOrders: SupplyOrders;
  loading: boolean;

  files: SupplyFiles;
  filesLoading: boolean;

  statusHistory: StatusHistory[];
}

const useSupplyStore = defineStore('supply', {
  state: () =>
    ({
      supply: {} as Supply,
      products: [],
      supplyOrders: {} as SupplyOrders,
      loading: false,

      files: {
        ci: [],
        photo: [],
        pl: [],
        hbl: [],
        pay: [],
      },
      filesLoading: false,

      statusHistory: [],
    } as SupplyState),

  getters: {
    statusRollbackAllowed() {
      return (id: number) => !STATUSES_NOT_ROLLBACK.includes(id);
    },
  },

  actions: {
    async getSupply(guid: string) {
      this.supply = await getSupply(guid);
    },

    async getProducts(guid: string) {
      try {
        this.loading = true;

        const data = await getProducts(guid);

        this.products = data;
      } finally {
        this.loading = false;
      }
    },

    async deleteProduct(guid: string) {
      try {
        this.loading = true;

        await deleteProduct(guid);
        await this.getProducts(guid);
      } finally {
        this.loading = false;
      }
    },

    async getFiles(guid: string, type: keyof SupplyFiles) {
      try {
        this.filesLoading = true;

        const data = await getFiles(guid, type);

        this.setFiles(type, data.items);
      } finally {
        this.filesLoading = false;
      }
    },

    async addFile(guid: string, type: keyof SupplyFiles, formData: FormData) {
      await addFile(guid, type, formData);

      this.getFiles(guid, type);
    },

    async deleteFile(type: keyof SupplyFiles, fileGuid: string) {
      await deleteFile(fileGuid);

      this.removeFile(type, fileGuid);
    },

    async getStatusHistory(guid: string) {
      this.statusHistory = await getStatusHistory(guid);
    },

    setFiles(type: keyof SupplyFiles, data: FileInner[]) {
      this.files[type] = data;
    },

    removeFile(type: keyof SupplyFiles, fileGuid: string) {
      const clone = cloneDeep(this.files[type]);
      const index = clone.findIndex((file) => file.guid === fileGuid);

      if (index > -1) {
        clone.splice(index, 1);
      }

      this.files[type] = clone;
    },

    async getSupplyOrders(guid: string) {
      this.supplyOrders = await getSupplyOrders(guid);
    },
  },
});

export default useSupplyStore;
export type { SupplyState };
