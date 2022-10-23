import { defineStore } from 'pinia';
import cloneDeep from 'lodash.clonedeep';

import useTablesStore, { ORDERS_DEFAULT_SORT } from '@/app/shared/store/tables-store';

import {
  getOrders,
  getStatisticsStatuses,
  updateResponsible,
} from '@/app/orders/shared/services/api';
import { DRAFT_STATUSES, PLANNED_STATUSES } from '@/app/orders/shared/config/statuses-constants';

import type { ListOrder } from '@/@types/order';
import type { StatisticsStatus } from '@/@types/additional';
import type { OrdersType } from '@/app/orders/shared/services/hooks/badge-filters';

interface OrdersState {
  orders: ListOrder[];
  drafts: ListOrder[];
  planned: ListOrder[];
  selectedCustomers: ListOrder[];
  statistics: StatisticsStatus[];

  watchBadgesStatuses: boolean;
  ordersBadgeStatuses: { [key: string]: StatisticsStatus[] };
  draftsBadgeStatuses: { [key: string]: StatisticsStatus[] };
  plannedBadgeStatuses: { [key: string]: StatisticsStatus[] };

  totalOrders: number | string;
  totalDrafts: number | string;
  totalPlanned: number | string;
  loading: boolean;
}

const useOrdersStore = defineStore('orders', {
  state: () =>
    ({
      orders: [],
      drafts: [],
      planned: [],
      selectedCustomers: [],
      statistics: [],

      totalOrders: 25,
      totalDrafts: 25,
      totalPlanned: 25,
      loading: false,

      watchBadgesStatuses: true,
      ordersBadgeStatuses: {
        progress: [],
        attention: [],
        delayed: [],
        good: [],
        closed: [],
      },
      draftsBadgeStatuses: {
        progress: [],
        attention: [],
        delayed: [],
        good: [],
      },
      plannedBadgeStatuses: {
        progress: [],
        attention: [],
        delayed: [],
        good: [],
      },
    } as OrdersState),

  getters: {
    dataIndex(state) {
      return (guid: string, type: OrdersType) =>
        state[type].findIndex((item: ListOrder) => item.guid === guid);
    },

    statisticsStatuses(state) {
      return (ids: number[]) =>
        state.statistics.filter((item: StatisticsStatus) => ids.includes(item.id));
    },

    type() {
      return (statusId: number) => {
        if (DRAFT_STATUSES.includes(statusId)) {
          return 'draft';
        }
        if (PLANNED_STATUSES.includes(statusId)) {
          return 'planned';
        }

        return 'order';
      };
    },
  },

  actions: {
    async getOrders(type: OrdersType, hideLoader: boolean) {
      const tablesStore = useTablesStore();

      const isDefaultSort = !tablesStore[type].sort?.sortKey || !tablesStore[type].sort?.orderBy;
      const sort = isDefaultSort ? ORDERS_DEFAULT_SORT : tablesStore[type].sort;

      const params = {
        page: tablesStore[type].page,
        perPage: tablesStore[type].perPage,
        ...sort,
        ...tablesStore[type].filters,
      };

      try {
        this.loading = !hideLoader;

        const data = await getOrders(params);

        this[type] = data.data;
        this[`total${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof OrdersState] =
          data.items_count as never;
      } finally {
        this.loading = false;
      }
    },

    async getStatisticsStatuses(type: OrdersType) {
      const tablesStore = useTablesStore();

      const { filters } = tablesStore[type];
      const statusType: 1 | 2 | 3 = type === 'drafts' ? 1 : type === 'planned' ? 3 : 2;
      const payload = { ...filters, statusType, statusIds: null };

      this.statistics = await getStatisticsStatuses(payload);
    },

    async updateResponsible(guids: string[], userId: number, type: OrdersType) {
      const data = await updateResponsible(guids, userId);

      data.items.forEach((item) => {
        const index = this.dataIndex(item.guid, type);

        if (index > -1) {
          this.setOrdersResponsible(index, item, type);
        }
      });
    },

    setOrdersResponsible(index: number, item: ListOrder, type: OrdersType) {
      const data = cloneDeep(this[type]);

      data[index].responsible = item.responsible;
      this[type] = data;
    },

    setBadgeData(key: keyof OrdersState, value: never) {
      this[key] = value;
    },
  },

  persist: {
    paths: [
      'orders',
      'drafts',
      'planned',
      'totalOrders',
      'totalDrafts',
      'totalPlanned',
      'ordersBadgeStatuses',
      'draftsBadgeStatuses',
      'plannedBadgeStatuses',
    ],
  },
});

export default useOrdersStore;
export type { OrdersState };
