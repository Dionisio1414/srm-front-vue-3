import { computed, ComputedRef, Ref, watch } from 'vue';

import { useRoute } from 'vue-router';

import cloneDeep from 'lodash.clonedeep';
import uniqBy from 'lodash.uniqby';

import useTablesStore from '@/app/shared/store/tables-store';
import useOrdersStore from '@/app/orders/shared/store/orders-store';
import useForceUpdate from '@/app/shared/services/hooks/force-update';

import type { OrderStatus, StatisticsStatus } from '@/@types/additional';
import type { Filter, ShipmentsFilter } from '@/@types/table';

type Type = 'progress' | 'attention' | 'delayed' | 'good' | 'planned';
type OrdersType = 'orders' | 'drafts' | 'planned';
type StoreKeys = 'ordersBadgeStatuses' | 'draftsBadgeStatuses' | 'plannedBadgeStatuses';

type UpdateFilters = {
  statuses: StatisticsStatus[];
  type: Type;
  isActive: boolean;
};

type StatusIds = number[] | null | undefined;
type BadgeStatuses = { [key: string]: StatisticsStatus[] };

type BadgeFilters = {
  filtersUpdated: Ref<boolean>;
  badgeStatuses: ComputedRef<BadgeStatuses>;
  updateFilters: (payload: UpdateFilters) => void;
  updateBadgeStatuses: (statuses: StatusIds, previousStatuses: StatusIds) => void;
  resetBadgesStatusesHandler: () => void;
};

function badgeFilters(): BadgeFilters {
  const route = useRoute();
  const tablesStore = useTablesStore();
  const ordersStore = useOrdersStore();
  const { updated, forceUpdate } = useForceUpdate();

  const type: ComputedRef<OrdersType> = computed(
    () => (route.name as string).replace('-list', '') as OrdersType
  );
  const storeKey: ComputedRef<StoreKeys> = computed(
    () => `${type.value}BadgeStatuses` as StoreKeys
  );
  const badgeStatuses = computed(() => ordersStore[storeKey.value]);
  const ordersBadgeStatuses = computed(() => ordersStore.ordersBadgeStatuses);
  const draftsBadgeStatuses = computed(() => ordersStore.draftsBadgeStatuses);
  const watchBadgesStatuses = computed(() => ordersStore.watchBadgesStatuses);

  const updateFilters = ({ statuses, type, isActive }: UpdateFilters) => {
    const clone = cloneDeep(badgeStatuses.value);

    clone[type] = isActive ? [] : cloneDeep(statuses);

    ordersStore.setBadgeData('watchBadgesStatuses', true as never);
    ordersStore.setBadgeData(storeKey.value, clone as never);
  };

  const deleteBadgeStatuses = (
    statuses: StatusIds,
    badgeStatuses: BadgeStatuses
  ): BadgeStatuses => {
    const statusesReducer = (
      badgeStatuses: BadgeStatuses,
      [key, value]: [key: string, value: StatisticsStatus[]]
    ) => {
      const formattedStatuses = value?.filter((status) => !statuses?.includes(status.id));

      badgeStatuses[key] = formattedStatuses;

      return badgeStatuses;
    };

    return Object.entries(cloneDeep(badgeStatuses)).reduce(statusesReducer, {});
  };

  const updateBadgeStatuses = (statuses: StatusIds, previousStatuses: StatusIds) => {
    const cloneBadgeStatuses = cloneDeep(badgeStatuses.value);

    if (statuses && previousStatuses && statuses.length) {
      const statusDeleted = previousStatuses.length > statuses.length;

      if (statusDeleted) {
        const uniqStatuses = [
          ...statuses.filter((status) => previousStatuses.indexOf(status) === -1),
          ...previousStatuses.filter((status) => statuses.indexOf(status) === -1),
        ];

        const filteredBadgeStatuses = deleteBadgeStatuses(uniqStatuses, cloneBadgeStatuses);

        cloneBadgeStatuses.progress = filteredBadgeStatuses.progress;
        cloneBadgeStatuses.attention = filteredBadgeStatuses.attention;
        cloneBadgeStatuses.delayed = filteredBadgeStatuses.delayed;
        cloneBadgeStatuses.good = filteredBadgeStatuses.good;
      }
    } else {
      cloneBadgeStatuses.progress = [];
      cloneBadgeStatuses.attention = [];
      cloneBadgeStatuses.delayed = [];
      cloneBadgeStatuses.good = [];
    }

    ordersStore.setBadgeData('watchBadgesStatuses', false as never);
    ordersStore.setBadgeData(storeKey.value, cloneBadgeStatuses as never);
  };

  const statusesChangeHandler = (statuses: BadgeStatuses) => {
    const { progress, attention, delayed, good, closed } = cloneDeep(statuses);

    const groupedStatuses = uniqBy(
      [...progress, ...attention, ...delayed, ...good, ...(closed || [])],
      'id'
    );

    const filters: Filter & ShipmentsFilter = {
      ...cloneDeep(tablesStore[type.value].filters),
      statusIds: groupedStatuses.map((status) => status.id),
    };
    const scheme = cloneDeep(tablesStore[type.value].scheme);

    const formatStatus = (status: StatisticsStatus): OrderStatus => ({
      id: status.id,
      alias: status.alias,
      color: status.color,
      parent: status.parent,
      title: status.title,
      type: status.type,
    });

    scheme.status.value = groupedStatuses.map(formatStatus);

    tablesStore.setFilters(type.value, filters);
    tablesStore.setScheme(type.value, scheme as never);
    ordersStore.setBadgeData(type.value, [] as never);

    forceUpdate();
  };

  const resetBadgesStatusesHandler = () => {
    const DEFAULT_BADGE_STATUSES = {
      progress: [],
      attention: [],
      delayed: [],
      good: [],
      closed: [],
    };

    ordersStore.$patch((state) => {
      state.watchBadgesStatuses = false;
    });

    ordersStore.$patch((state) => {
      state[storeKey.value] = DEFAULT_BADGE_STATUSES;
    });
  };

  watch(
    ordersBadgeStatuses,
    (statuses) => {
      if (watchBadgesStatuses.value && statuses) {
        statusesChangeHandler(statuses);
      }
    },
    { deep: true }
  );

  watch(
    draftsBadgeStatuses,
    (statuses) => {
      if (watchBadgesStatuses.value && statuses) {
        statusesChangeHandler(statuses);
      }
    },
    { deep: true }
  );

  return {
    filtersUpdated: updated,
    badgeStatuses,
    updateFilters,
    updateBadgeStatuses,
    resetBadgesStatusesHandler,
  };
}

export type { Type, OrdersType, StoreKeys };
export default badgeFilters;
