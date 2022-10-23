import { defineStore } from 'pinia';
import cloneDeep from 'lodash.clonedeep';

import useTablesStore, { SUPPLIER_DEFAULT_SORT } from '@/app/shared/store/tables-store';

import { getOrders, getProducts, getFactoryInfo } from '@/app/supplier/shared/services/api';

import { SWH_STATUSES } from '@/app/supplier/shared/config/statuses-constants';

import type { ListOrder, OrderFactory } from '@/@types/order';
import type { ActiveProduct, SupplierProduct } from '@/@types/product';

interface SupplierState {
  orders: ListOrder[];
  products: { [key: string]: SupplierProduct[] };
  factory: OrderFactory;

  total: number;
  loading: boolean;
  productsLoading: string | null;
}

const useSupplierStore = defineStore('supplier', {
  state: () =>
    ({
      orders: [] as ListOrder[],
      products: {},
      factory: {},

      total: 25,
      loading: false,
      productsLoading: null,
    } as SupplierState),

  getters: {
    orderProducts(state) {
      return (guid: string) => state.products[guid] || [];
    },

    canMove() {
      return (id: number) => SWH_STATUSES.includes(id);
    },

    showQuantity() {
      return (active: ActiveProduct[], guid: string) =>
        active.map((item) => item.product_guid).includes(guid);
    },

    quantity() {
      return (active: ActiveProduct[], guid: string) =>
        active.find((item) => item.product_guid === guid)?.quantity || '';
    },
  },

  actions: {
    async getOrders(guid: string, hideLoader: boolean) {
      const tablesStore = useTablesStore();

      const isDefaultSort =
        !tablesStore.supplier.sort?.sortKey || !tablesStore.supplier.sort?.orderBy;
      const sort = isDefaultSort ? SUPPLIER_DEFAULT_SORT : tablesStore.supplier.sort;

      const params = {
        page: tablesStore.supplier.page,
        perPage: tablesStore.supplier.perPage,
        ...sort,
        ...tablesStore.supplier.filters,
        factory: [guid],
      };

      try {
        this.loading = !hideLoader;

        const data = await getOrders(params);

        this.orders = data.data;
        this.total = data.items_count;
        this.products = {};
      } finally {
        this.loading = false;
      }
    },

    async getOrderProducts(guid: string) {
      try {
        this.productsLoading = guid;

        const data = await getProducts(guid);

        this.products = { ...cloneDeep(this.products), [guid]: data.items };
      } finally {
        this.productsLoading = null;
      }
    },

    async getFactoryInfo(guid: string) {
      this.factory = await getFactoryInfo(guid);
    },

    resetProducts() {
      this.products = {};
    },

    setReliableMark(isReliable: boolean) {
      this.factory.is_reliable_supplier = isReliable;
    },
  },

  persist: {
    paths: ['orders', 'total'],
  },
});

export default useSupplierStore;
export type { SupplierState };
