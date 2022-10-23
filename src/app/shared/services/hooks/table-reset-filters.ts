import cloneDeep from 'lodash.clonedeep';

import useTablesStore from '@/app/shared/store/tables-store';
import useInfoStore from '@/app/shared/store/info-store';

import type { TablesState } from '@/app/shared/store/tables-store';

type callbackType = (hideLoader: boolean) => void;

interface TableResetFilters {
  onResetTableHandler: (callback: callbackType) => void;
}
interface TablesResetFiltersParams<T, K> {
  defaultFilters: T;
  defaultSchema: K;
  key: keyof TablesState;
}

function tableResetFilters<T, K>({
  defaultFilters,
  defaultSchema,
  key,
}: TablesResetFiltersParams<T, K>): TableResetFilters {
  const tablesStore = useTablesStore();
  const infoStore = useInfoStore();

  const onResetTableHandler = (callback: callbackType) => {
    const schema = cloneDeep(defaultSchema);

    if (key === 'orders' || key === 'supplier') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (schema as any).status.value = infoStore.productionStatuses;
    }

    tablesStore.setFilters(key, cloneDeep(defaultFilters));
    tablesStore.setScheme(key, schema as never);
    tablesStore.setPage(key, 1);

    if (callback) callback(false);
  };

  return { onResetTableHandler };
}

export default tableResetFilters;
