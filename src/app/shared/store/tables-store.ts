import { defineStore } from 'pinia';
import cloneDeep from 'lodash.clonedeep';

import { FILTERS_CONSTANTS as SHIPMENTS_FILTERS } from '@/app/shipments/shared/config/filters-scheme-constants';
import {
  FILTERS_CONSTANTS as SUPPLIER_FILTERS,
  SUPPLIER_SUPPLIES_FILTERS_CONSTANTS,
} from '@/app/supplier/shared/config/filters-scheme-constants';
import { FILTERS_CONSTANTS as ORDERS_FILTERS } from '@/app/orders/shared/config/filters-scheme-constants';
import { FILTERS_CONSTANTS as PRICES_FILTERS } from '@/app/price/shared/config/filters-scheme-constants';
import { FILTERS_CONSTANTS as SUPPLIES_FILTERS } from '@/app/supplies/shared/config/filters-scheme-constants';
import { ACTIVE_BOOKING_SHIPMENT } from '@/app/shipments/shared/config/shipments-statuses';
import { ACTIVE_PRODUCTIONS_STATUS } from '@/app/orders/shared/config/statuses-constants';

import type { Filter, ShipmentsFilter, PricesFilter, Sort } from '@/@types/table';
import type { FiltersScheme } from '@/app/shared/services/hooks/table-filters';

interface ItemState {
  page: number | string;
  perPage: number | string;
  sort?: Sort;
  filters: Filter & ShipmentsFilter & PricesFilter;
  scheme: FiltersScheme;
}

interface TablesState {
  orders: ItemState;
  drafts: ItemState;
  planned: ItemState;
  supplier: ItemState;
  supplierShipments: ItemState;
  supplierSwh: ItemState;
  supplierSupplies: ItemState;
  priceList: ItemState;
  shipments: ItemState;
  forwarders: ItemState;
  suppliesList: ItemState;
  supplierMails: ItemState;
}

const useTablesStore = defineStore('tables', {
  state: () =>
    ({
      orders: {
        page: 1,
        perPage: 10,
        sort: { sortKey: 'status.id', orderBy: 'desc' },
        filters: {
          categoryCode: null,
          companyId: null,
          estimatedProductionEndDate: null,
          search: '',
          statusIds: [],
          factory: null,
          responsibleIds: [],
          statusType: 2,
          searchDate: null,
        },
        scheme: cloneDeep(ORDERS_FILTERS),
      },

      drafts: {
        page: 1,
        perPage: 10,
        sort: { sortKey: 'status.id', orderBy: 'desc' },
        filters: {
          categoryCode: null,
          companyId: null,
          estimatedProductionEndDate: null,
          search: '',
          statusIds: [],
          factory: null,
          responsibleIds: [],
          statusType: 1,
          searchDate: null,
        },
        scheme: cloneDeep(ORDERS_FILTERS),
      },

      planned: {
        page: 1,
        perPage: 10,
        sort: { sortKey: 'status.id', orderBy: 'desc' },
        filters: {
          categoryCode: null,
          companyId: null,
          estimatedProductionEndDate: null,
          search: '',
          factory: null,
          responsibleIds: [],
          statusType: 3,
          searchDate: null,
        },
        scheme: cloneDeep(ORDERS_FILTERS),
      },

      supplier: {
        page: 1,
        perPage: 10,
        sort: { sortKey: 'status.sort', orderBy: 'desc' },
        filters: {
          statusIds: [],
          searchDate: null,
          factory: [],
          estimatedProductionEndDate: null,
          companyId: null,
          categoryCode: null,
          responsibleIds: null,
        },
        scheme: cloneDeep(SUPPLIER_FILTERS),
      },

      supplierShipments: {
        page: 1,
        perPage: 10,
        filters: {},
        scheme: {},
      },

      supplierSwh: {
        page: 1,
        perPage: 10,
        filters: {
          search: '',
        },
        scheme: {},
      },

      supplierSupplies: {
        page: 1,
        perPage: 10,
        sort: { sortKey: 'total_price_usd', orderBy: 'desc' },
        filters: {
          search: '',
          statusIds: [],
        },
        scheme: cloneDeep(SUPPLIER_SUPPLIES_FILTERS_CONSTANTS),
      },

      shipments: {
        page: 1,
        perPage: 10,
        filters: {
          way: null,
          supplier: null,
          forwarder: null,
          statusId: 1,
          loadingTypeId: null,
          pointOfLoading: null,
          cargoReadyDateBegin: null,
          cargoReadyDateEnd: null,
        },
        scheme: cloneDeep(SHIPMENTS_FILTERS),
      },

      forwarders: {
        page: 1,
        perPage: 10,
        filters: {
          search: '',
          is_deleted: 0,
        },
        scheme: {},
      },

      priceList: {
        page: 1,
        perPage: 10,
        filters: {
          forwarderGuids: [],
          wayIds: [],
          tariffIds: [],
          loadingTypeIds: [],
          isActive: 1,
        },
        scheme: cloneDeep(PRICES_FILTERS),
      },

      suppliesList: {
        page: 1,
        perPage: 10,
        sort: { sortKey: 'number', orderBy: 'desc' },
        filters: {
          search: '',
          statusIds: [],
        },
        scheme: cloneDeep(SUPPLIES_FILTERS),
      },

      supplierMails: {
        page: 1,
        perPage: 10,
        sort: { sortKey: 'name', orderBy: 'desc' },
        filters: {
          search: '',
        },
        scheme: {},
      },
    } as TablesState),

  getters: {
    isActiveShipmentsStatus(state) {
      return state.shipments.filters.statusId === ACTIVE_BOOKING_SHIPMENT;
    },
  },

  actions: {
    setPage(key: keyof TablesState, page: number) {
      this[key].page = page;
    },

    setPerPage(key: keyof TablesState, perPage: number) {
      this[key].perPage = perPage;
    },

    setSort(key: keyof TablesState, sort: Sort) {
      this[key].sort = sort;
    },

    setFilters(key: keyof TablesState, filters: Filter & ShipmentsFilter) {
      this[key].filters = filters;
    },

    setScheme(key: keyof TablesState, scheme: never) {
      this[key].scheme = scheme;
    },
  },

  persist: true,
});

const PER_PAGE_OPTIONS = [10, 50, 100];

const ORDERS_DEFAULT_SORT = {
  sortKey: 'status.id',
  orderBy: 'desc',
};

const ORDERS_DEFAULT_FILTERS = {
  categoryCode: null,
  companyId: null,
  estimatedProductionEndDate: null,
  search: '',
  statusIds: ACTIVE_PRODUCTIONS_STATUS,
  factory: null,
  responsibleIds: [],
  statusType: 2,
  searchDate: null,
};

const DRAFTS_DEFAULT_FILTERS = {
  categoryCode: null,
  companyId: null,
  estimatedProductionEndDate: null,
  search: '',
  statusIds: [],
  factory: null,
  responsibleIds: [],
  statusType: 1,
  searchDate: null,
};

const PLANED_DEFAULT_FILTERS = {
  categoryCode: null,
  companyId: null,
  estimatedProductionEndDate: null,
  search: '',
  factory: null,
  responsibleIds: [],
  statusType: 3,
  searchDate: null,
};

const SUPPLIER_DEFAULT_SORT = {
  sortKey: 'status.sort',
  orderBy: 'desc',
};

const SUPPLIER_SUPPLY_DEFAULT_SORT = {
  sortKey: 'total_price_usd',
  orderBy: 'desc',
};

const SUPPLIER_SUPPLY_DEFAULT_FILTERS = {
  search: '',
};

const SUPPLIER_SWH_DEFAULT_FILTERS = {
  search: '',
};

const SUPPLIES_DEFAULT_SORT = {
  sortKey: 'number',
  orderBy: 'desc',
};

const SUPPLIES_DEFAULT_FILTERS = {
  search: '',
};

const SUPPLIERS_DEFAULT_FILTERS = {
  statusIds: ACTIVE_PRODUCTIONS_STATUS,
  searchDate: null,
  factory: [],
  estimatedProductionEndDate: null,
  companyId: null,
  categoryCode: null,
  responsibleIds: null,
};

const SHIPMENTS_DEFAULT_FILTERS = {
  way: null,
  supplier: null,
  forwarder: null,
  statusId: 2,
  loadingTypeId: null,
  pointOfLoading: null,
  cargoReadyDateBegin: null,
  cargoReadyDateEnd: null,
};

const BOOKING_SHIPMENTS_DEFAULT_FILTERS = {
  way: null,
  supplier: null,
  forwarder: null,
  statusId: 1,
  loadingTypeId: null,
  pointOfLoading: null,
  cargoReadyDateBegin: null,
  cargoReadyDateEnd: null,
};

const SUPPLIER_MAILS_DEFAULT_SORT = {
  sortKey: 'name',
  orderBy: 'desc',
};

const SUPPLIER_MAILS_DEFAULT_FILTERS = {
  search: '',
};

export default useTablesStore;
export {
  PER_PAGE_OPTIONS,
  ORDERS_DEFAULT_SORT,
  ORDERS_DEFAULT_FILTERS,
  DRAFTS_DEFAULT_FILTERS,
  PLANED_DEFAULT_FILTERS,
  SUPPLIER_DEFAULT_SORT,
  SUPPLIER_SUPPLY_DEFAULT_FILTERS,
  SUPPLIER_SWH_DEFAULT_FILTERS,
  SUPPLIER_SUPPLY_DEFAULT_SORT,
  SUPPLIERS_DEFAULT_FILTERS,
  SHIPMENTS_DEFAULT_FILTERS,
  SUPPLIES_DEFAULT_SORT,
  SUPPLIES_DEFAULT_FILTERS,
  BOOKING_SHIPMENTS_DEFAULT_FILTERS,
  SUPPLIER_MAILS_DEFAULT_SORT,
  SUPPLIER_MAILS_DEFAULT_FILTERS,
};
export type { TablesState, ItemState };
