import { computed, ComputedRef, onMounted } from 'vue';

import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import cloneDeep from 'lodash.clonedeep';

import useTablesStore, {
  ORDERS_DEFAULT_FILTERS,
  DRAFTS_DEFAULT_FILTERS,
  PLANED_DEFAULT_FILTERS,
} from '@/app/shared/store/tables-store';
import useOrdersStore from '@/app/orders/shared/store/orders-store';
import useInfoStore from '@/app/shared/store/info-store';
import useNotification from '@/app/shared/services/hooks/notifications';
import useProductionStatus from '@/app/shared/services/hooks/production-status';
import useTableOrdersCheck from '@/app/shared/services/hooks/table-orders-check';
import useAccessByRole from '@/app/shared/services/hooks/access-by-role';

import useTableClearFilters from '@/app/shared/services/hooks/table-clear-filters';

import { FILTERS_CONSTANTS as ORDERS_FILTERS } from '@/app/orders/shared/config/filters-scheme-constants';

import type { OrdersType } from '@/app/orders/shared/services/hooks/badge-filters';
import type { CustomError } from '@/app/shared/services/hooks/notifications';

type callbackType = () => void;

type ListData = {
  type: ComputedRef<OrdersType>;
  updateData: () => void;
  changeResponsible: (payload: { guids: string[]; userId: number; type: OrdersType }) => void;
  updatedFilter: ComputedRef<boolean>;
  resetFilter: (callback: callbackType) => void;
};

function listData(): ListData {
  const tablesStore = useTablesStore();
  const ordersStore = useOrdersStore();
  const infoStore = useInfoStore();
  const route = useRoute();
  const { t } = useI18n();

  const { onSuccess, onCustomError } = useNotification();

  const type: ComputedRef<OrdersType> = computed(
    () =>
      (typeof route.name === 'string' ? route.name.replace('-list', '') : 'orders') as OrdersType
  );
  const data = computed(() => ordersStore[type.value]);

  const { defaultFilters, defaultSchema, key } = {
    defaultFilters:
      type.value === 'drafts'
        ? DRAFTS_DEFAULT_FILTERS
        : type.value === 'planned'
        ? PLANED_DEFAULT_FILTERS
        : ORDERS_DEFAULT_FILTERS,
    defaultSchema: ORDERS_FILTERS,
    key: type.value,
  };

  const { updatedFilter, clearFilterHandler } = useTableClearFilters({
    defaultFilters,
    defaultSchema,
    key,
  });
  const { ordersCheckHandler } = useTableOrdersCheck({
    key: 'orders',
    defaultFilters: { ...ORDERS_DEFAULT_FILTERS, statusIds: [] },
    defaultSchema: ORDERS_FILTERS,
  });

  const { setDefaultStatus } = useProductionStatus(type.value);

  const resetData = () => {
    const storeFilters = cloneDeep(tablesStore[type.value].filters);
    const statusType = type.value === 'drafts' ? 1 : type.value === 'planned' ? 3 : 2;

    tablesStore.setFilters(type.value, { ...storeFilters, statusType });
  };

  const getOrders = (hideLoader: boolean) => ordersStore.getOrders(type.value, hideLoader);

  const { errorCallback } = useAccessByRole(clearFilterHandler.bind(null, getOrders));

  const updateData = async (hideLoader = false) => {
    try {
      await getOrders(hideLoader);
    } catch (error) {
      onCustomError(error as CustomError, errorCallback);
    }
  };

  const loadInitialData = async () => {
    infoStore.getMembers().catch((error) => onCustomError(error));
    await infoStore.getStatuses().catch((error) => onCustomError(error));

    if (type.value === 'orders') {
      infoStore.getCompanies().catch((error) => onCustomError(error));
    }
  };

  const resetFilter = (callback: callbackType) => {
    clearFilterHandler(getOrders.bind(null, false));
    ordersStore.getStatisticsStatuses(type.value);

    if (callback) callback();
  };

  const changeResponsible = ({
    guids,
    userId,
    type,
  }: {
    guids: string[];
    userId: number;
    type: OrdersType;
  }) => {
    ordersStore
      .updateResponsible(guids, userId, type)
      .then(() => onSuccess(t('orders.responsibleChanged')))
      .catch((error) => onCustomError(error));
  };

  resetData();

  onMounted(async () => {
    await loadInitialData();
    setDefaultStatus();

    updateData(Boolean(data.value.length)).then(() => {
      ordersCheckHandler({
        data: data.value,
        init: type.value === 'orders',
        callback: getOrders.bind(null, Boolean(data.value.length)),
      });
    });
  });

  return {
    type,

    updateData,
    changeResponsible,

    updatedFilter,
    resetFilter,
  };
}

export default listData;
