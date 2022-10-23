import { computed, ComputedRef } from 'vue';

import deepEqual from 'deep-equal';
import cloneDeep from 'lodash.clonedeep';

import useTablesStore from '@/app/shared/store/tables-store';
import useTableResetFilters from '@/app/shared/services/hooks/table-reset-filters';

import type { TablesState } from '@/app/shared/store/tables-store';

type CallbackType = (hideLoader: boolean) => void;

interface TableClearFiltersParams<T, K> {
  defaultFilters: T;
  defaultSchema: K;
  key: keyof TablesState;
}

interface TableClearFilters {
  updatedFilter: ComputedRef<boolean>;
  clearFilterHandler: (callback: CallbackType) => void;
}

function tableClearFilters<T, K>({
  defaultFilters,
  defaultSchema,
  key,
}: TableClearFiltersParams<T, K>): TableClearFilters {
  const tablesStore = useTablesStore();
  const { onResetTableHandler } = useTableResetFilters({
    defaultFilters,
    defaultSchema,
    key,
  });
  const cloneDefaultFilters = cloneDeep(defaultFilters);

  const filtersState = computed(() => tablesStore[key].filters);
  const updatedFilter = computed(() => deepEqual(cloneDefaultFilters, filtersState.value));

  const clearFilterHandler = (callback: CallbackType) => {
    onResetTableHandler(callback);
  };

  return { updatedFilter, clearFilterHandler };
}

export default tableClearFilters;
export type { CallbackType };
